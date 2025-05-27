from collective.techevent import _
from collective.techevent.content.schedule.slot import ISlot
from plone.autoform import directives
from plone.dexterity.content import Container
from zope import schema
from zope.interface import implementer


class ISession(ISlot):
    """A Sessuin in the event."""

    slot_category = schema.TextLine(
        title=_("Category"),
        description=_("Category of this slot"),
        required=False,
        readonly=True,
    )
    directives.omitted("slot_category")


@implementer(ISession)
class Session(Container):
    """Convenience subclass for ``Session`` portal type."""

    @property
    def slot_category(self) -> str:
        return "activity"
