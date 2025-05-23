from collective.techevent.content.schedule.slot import ISlot
from collective.techevent.content.schedule.slot import Slot
from zope.interface import implementer


class IOpenSpace(ISlot):
    """A OpenSpace in the event."""


@implementer(IOpenSpace)
class OpenSpace(Slot):
    """Convenience subclass for ``OpenSpace`` portal type."""
