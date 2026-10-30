"""The Attendees container: the registrations of one event and their settings."""

from collective.techevent import _
from collective.techevent.users.code import PREFIX_PATTERN
from collective.techevent.users.utils import aware_datetime
from datetime import datetime
from datetime import UTC
from plone import api
from plone.dexterity.content import Container
from plone.supermodel.model import Schema
from zope import schema
from zope.interface import implementer
from zope.interface import Invalid
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


CONFIRMATION_AUTOMATIC = "automatic"
CONFIRMATION_EMAIL = "email"
CONFIRMATION_MANUAL = "manual"

CONFIRMATION_POLICIES = SimpleVocabulary([
    SimpleTerm(
        CONFIRMATION_AUTOMATIC,
        title=_("Automatic: confirm registrations from logged-in users at once"),
    ),
    SimpleTerm(
        CONFIRMATION_EMAIL,
        title=_("Email: confirm once the registrant verifies the email address"),
    ),
    SimpleTerm(
        CONFIRMATION_MANUAL,
        title=_("Manual: an organizer confirms each registration"),
    ),
])

OPEN_STATE = "open"


def validate_prefix(value: str) -> bool:
    """Check a registration prefix.

    :param value: The prefix.
    :returns: ``True`` when valid.
    :raises Invalid: Unless it has 2 to 12 upper-case letters and digits.
    """
    if not PREFIX_PATTERN.match(value):
        raise Invalid(_("Use 2 to 12 characters, only upper-case letters and digits."))
    return True


class IAttendees(Schema):
    """Attendees database: the registrations of one event."""

    registration_prefix = schema.ASCIILine(
        title=_("Registration prefix"),
        description=_(
            "Starts every registration code of this event, as in PYC26-7KQ3M9XD. "
            "Use 2 to 12 upper-case letters and digits."
        ),
        required=True,
        constraint=validate_prefix,
    )

    allow_anonymous_registration = schema.Bool(
        title=_("Allow anonymous registration"),
        description=_(
            "Let visitors without an account register. They must verify their "
            "email address."
        ),
        default=False,
        required=False,
    )

    registration_confirmation = schema.Choice(
        title=_("Registration confirmation"),
        description=_("How a new registration gets confirmed."),
        vocabulary=CONFIRMATION_POLICIES,
        default=CONFIRMATION_AUTOMATIC,
        required=True,
    )

    registration_deadline = schema.Datetime(
        title=_("Registration deadline"),
        description=_(
            "Registration ends at this date and time, even while the attendees "
            "database is open. Leave empty to close registration by hand."
        ),
        required=False,
    )


@implementer(IAttendees)
class Attendees(Container):
    """Attendees database: the registrations of one event."""

    def closes_at(self) -> datetime | None:
        """Return when registration ends, if there is a deadline.

        :returns: The deadline, timezone aware; a date stored without a
            timezone is read as UTC. ``None`` without one.
        """
        return aware_datetime(getattr(self, "registration_deadline", None))

    @property
    def expired(self) -> bool:
        """Whether the registration deadline has passed.

        Plone has no scheduler, so the deadline is checked whenever someone
        registers: the workflow state stays ``open`` until an organizer
        closes the database.
        """
        closes_at = self.closes_at()
        return closes_at is not None and datetime.now(UTC) >= closes_at

    @property
    def is_open(self) -> bool:
        """Whether registrations are accepted: open, and before the deadline."""
        return api.content.get_state(self) == OPEN_STATE and not self.expired
