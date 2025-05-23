from collective.techevent import _
from collective.techevent.content.schedule.slot import ISlot
from collective.techevent.content.schedule.slot import Slot
from zope import schema
from zope.interface import implementer


class ITalk(ISlot):
    """A Talk in the event."""

    duration = schema.Choice(
        title=_("Duration"),
        description=_("Duration of the talk"),
        required=False,
        vocabulary="collective.techevent.vocabularies.talk_duration",
    )


@implementer(ITalk)
class Talk(Slot):
    """Convenience subclass for ``Talk`` portal type."""
