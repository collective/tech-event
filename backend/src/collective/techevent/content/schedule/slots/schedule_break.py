from collective.techevent import _
from collective.techevent.content.schedule.slot import ISlot
from collective.techevent.content.schedule.slot import Slot
from zope import schema
from zope.interface import implementer


class IBreak(ISlot):
    """A Break in the event."""

    slot_category = schema.Choice(
        title=_("Category"),
        description=_("Category of this slot"),
        required=True,
        default="coffee-break",
        vocabulary="collective.techevent.vocabularies.break_categories",
    )


@implementer(IBreak)
class Break(Slot):
    """Convenience subclass for ``Break`` portal type."""
