from collective.techevent import _
from collective.techevent.content.schedule.slot import ISlot
from plone.autoform import directives
from plone.dexterity.content import Container
from zope import schema
from zope.interface import implementer


class ISession(ISlot):
    """A Sessuin in the event."""

    slot_category = schema.Choice(
        title=_("Category"),
        description=_("Category of this slot"),
        required=False,
        default="activity",
        vocabulary="collective.techevent.vocabularies.session_categories",
    )
    directives.omitted("slot_category")


@implementer(ISession)
class Session(Container):
    """Convenience subclass for ``Session`` portal type."""
