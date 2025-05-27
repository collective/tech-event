from collective.techevent import _
from collective.techevent.content.schedule.session import ISession
from collective.techevent.content.schedule.session import Session
from zope import schema
from zope.interface import implementer


class ITalk(ISession):
    """A Talk in the event."""

    duration = schema.Choice(
        title=_("Duration"),
        description=_("Duration of the talk"),
        required=False,
        vocabulary="collective.techevent.vocabularies.durations_talk",
    )


@implementer(ITalk)
class Talk(Session):
    """Convenience subclass for ``Talk`` portal type."""
