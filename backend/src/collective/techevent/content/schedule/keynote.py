from collective.techevent import _
from collective.techevent.content.schedule.session import ISession
from collective.techevent.content.schedule.session import Session
from zope import schema
from zope.interface import implementer


class IKeynote(ISession):
    """A Keynote in the event."""


@implementer(IKeynote)
class Keynote(Session):
    """Convenience subclass for ``Keynote`` portal type."""

    duration = schema.Choice(
        title=_("Duration"),
        description=_("Duration of the keynote"),
        required=False,
        vocabulary="collective.techevent.vocabularies.durations_keynote",
    )
