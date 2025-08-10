from plone.dexterity.content import Container
from zope.interface import implementer
from zope.interface import Interface


class IAttendees(Interface):
    """Attendees database."""


@implementer(IAttendees)
class Attendees(Container):
    """Attendees database."""
