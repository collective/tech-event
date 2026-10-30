"""The Ticket: what a registrant can choose when registering for an event."""

from collective.techevent import _
from collective.techevent.users.utils import aware_datetime
from datetime import datetime
from datetime import UTC
from plone.autoform import directives
from plone.dexterity.content import Item
from plone.supermodel.model import Schema
from typing import Any
from zope import schema
from zope.interface import implementer
from zope.interface import Invalid
from zope.interface import invariant


class ITicket(Schema):
    """A ticket of an event, inside its Attendees container."""

    available_from = schema.Datetime(
        title=_("Available from"),
        description=_("Leave empty to offer this ticket from the start."),
        required=False,
    )
    available_until = schema.Datetime(
        title=_("Available until"),
        description=_(
            "Leave empty to offer this ticket until registration ends. The "
            "registration deadline of the attendees database still applies."
        ),
        required=False,
    )
    admission = schema.Bool(
        title=_("Grants admission"),
        description=_("Whether this ticket grants entry to the event."),
        default=True,
        required=False,
    )

    exclude_from_nav = schema.Bool(
        default=True,
        required=False,
    )
    directives.omitted("exclude_from_nav")

    @invariant
    def valid_period(data: Any) -> None:
        """Require a ticket to become available before it stops being so.

        :param data: The object or form data being validated.
        :raises Invalid: When the period ends before it starts.
        """
        start = aware_datetime(getattr(data, "available_from", None))
        end = aware_datetime(getattr(data, "available_until", None))
        if start and end and end <= start:
            raise Invalid(_("A ticket must become available before it ends."))


@implementer(ITicket)
class Ticket(Item):
    """A ticket of an event, inside its Attendees container."""

    @property
    def is_available(self) -> bool:
        """Whether this ticket can be chosen now.

        Like the registration deadline, this is checked whenever someone
        registers: Plone has no scheduler.
        """
        now: datetime = datetime.now(UTC)
        start = aware_datetime(self.available_from)
        end = aware_datetime(self.available_until)
        return (start is None or start <= now) and (end is None or now < end)
