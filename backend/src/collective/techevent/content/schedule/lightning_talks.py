from collective.techevent import _
from collective.techevent.content.schedule.slot import ISlot
from collective.techevent.content.schedule.slot import Slot
from plone.autoform import directives
from zope import schema
from zope.interface import implementer


class ILightningTalks(ISlot):
    """A Lightning Talks slot in the event."""

    slot_category = schema.Choice(
        title=_("Category"),
        description=_("Category of this slot"),
        required=True,
        default="slot",
        vocabulary="collective.techevent.vocabularies.slot_categories",
    )
    directives.omitted("slot_category")


@implementer(ILightningTalks)
class LightningTalks(Slot):
    """Convenience subclass for ``LightningTalks`` portal type."""
