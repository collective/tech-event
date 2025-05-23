from collective.techevent.content.schedule.slot import ISlot
from collective.techevent.content.schedule.slot import Slot
from zope.interface import implementer


class ILightningTalks(ISlot):
    """A Lightning Talks slot in the event."""


@implementer(ILightningTalks)
class LightningTalks(Slot):
    """Convenience subclass for ``LightningTalks`` portal type."""
