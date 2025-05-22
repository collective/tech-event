from plone.dexterity.content import Container
from zope.interface import implementer
from zope.interface import Interface


class IRoom(Interface):
    """A Room inside a venue in the event."""


@implementer(IRoom)
class Room(Container):
    """Convenience subclass for ``Room`` portal type."""
