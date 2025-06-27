from collective.techevent import _
from plone.dexterity.content import Container
from zope import schema
from zope.interface import implementer
from zope.interface import Interface


class ISlot(Interface):
    """A Slot in the event."""

    slot_category = schema.Choice(
        title=_("Category"),
        description=_("Category of this slot"),
        required=True,
        default="slot",
        vocabulary="collective.techevent.vocabularies.slot_categories",
    )


@implementer(ISlot)
class Slot(Container):
    """Convenience subclass for ``Slot`` portal type."""
