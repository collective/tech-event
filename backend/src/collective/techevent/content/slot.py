from plone.dexterity.content import Container
from zope.interface import implementer
from zope.interface import Interface


class ISlot(Interface):
    """A Slot in the event."""


@implementer(ISlot)
class Slot(Container):
    """Convenience subclass for ``Slot`` portal type."""
