from collective.techevent import _
from collective.techevent.content.schedule.slot import ISlot
from collective.techevent.content.schedule.slot import Slot
from plone.autoform import directives
from zope import schema
from zope.interface import implementer


class IOpenSpace(ISlot):
    """A OpenSpace in the event."""

    slot_category = schema.Choice(
        title=_("Category"),
        description=_("Category of this slot"),
        required=True,
        default="slot",
        vocabulary="collective.techevent.vocabularies.slot_categories",
    )
    directives.omitted("slot_category")


@implementer(IOpenSpace)
class OpenSpace(Slot):
    """Convenience subclass for ``OpenSpace`` portal type."""
