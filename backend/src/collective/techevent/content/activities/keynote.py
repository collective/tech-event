from collective.techevent.content.slot import ISlot
from collective.techevent.content.slot import Slot
from zope.interface import implementer


class IKeynote(ISlot):
    """A Keynote in the event."""


@implementer(IKeynote)
class Keynote(Slot):
    """Convenience subclass for ``Keynote`` portal type."""
