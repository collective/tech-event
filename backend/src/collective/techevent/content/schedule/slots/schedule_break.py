from collective.techevent import _
from collective.techevent.content.schedule.slot import ISlot
from collective.techevent.content.schedule.slot import Slot
from plone.autoform import directives
from zope import schema
from zope.interface import implementer


class IBreak(ISlot):
    """A Break in the event."""

    slot_category = schema.Choice(
        title=_("Category"),
        description=_("Category of the slot"),
        required=True,
        vocabulary="collective.techevent.vocabularies.slot_categories",
    )
    directives.no_omit("slot_category")


@implementer(IBreak)
class Break(Slot):
    """Convenience subclass for ``Break`` portal type."""
