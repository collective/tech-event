"""The Attendee: one registration for an event."""

from Acquisition import aq_inner
from Acquisition import aq_parent
from collective.techevent import _
from collective.techevent.users.content.attendees import IAttendees
from collective.techevent.users.utils import duplicate_message
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.schema import Email
from plone.supermodel.model import Schema
from typing import Any
from zope import schema
from zope.interface import implementer
from zope.interface import Invalid
from zope.interface import invariant


class IAttendee(Schema):
    """An attendee of the event: one registration, linked to an account."""

    title = schema.TextLine(readonly=True)

    first_name = schema.TextLine(
        title=_("First Name"),
        required=True,
    )
    last_name = schema.TextLine(
        title=_("Last Name"),
        required=True,
    )
    email = Email(
        title=_("E-mail Address"),
        required=True,
    )
    user_id = schema.ASCIILine(
        title=_("User ID"),
        description=_("The account this registration belongs to, if any."),
        required=False,
    )
    ticket = schema.Choice(
        title=_("Ticket"),
        description=_("The ticket of this registration, if the event has tickets."),
        vocabulary="collective.techevent.vocabularies.tickets",
        required=False,
    )
    email_verified = schema.Bool(
        title=_("Email verified"),
        default=False,
        required=False,
    )
    directives.omitted("email_verified")

    directives.write_permission(
        email="cmf.ReviewPortalContent",
        user_id="cmf.ReviewPortalContent",
        ticket="cmf.ReviewPortalContent",
        email_verified="cmf.ReviewPortalContent",
    )

    exclude_from_nav = schema.Bool(
        default=True,
        required=False,
    )
    directives.omitted("exclude_from_nav")

    @invariant
    def unique_registration(data: Any) -> None:
        """Allow one registration per email, and per account, in an event.

        :param data: The object or form data being validated.
        :raises Invalid: When another Attendee of the same container has the
            same email or user id.
        """
        context = getattr(data, "__context__", None)
        if context is None:
            return
        if IAttendee.providedBy(context):
            container = aq_parent(aq_inner(context))
        else:
            container = context
        if not IAttendees.providedBy(container):
            return
        message = duplicate_message(
            container,
            email=getattr(data, "email", None),
            user_id=getattr(data, "user_id", None),
            exclude=context,
        )
        if message:
            raise Invalid(message)


@implementer(IAttendee)
class Attendee(Container):
    """An attendee of the event: one registration, linked to an account."""

    @property
    def title(self) -> str:
        """The full name of the attendee."""
        return f"{self.first_name} {self.last_name}"

    @title.setter
    def title(self, value: str) -> None:
        # The title is computed from the names
        pass
