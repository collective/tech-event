from collective.techevent.content.schedule.session import ISession
from collective.techevent.content.schedule.session import Session
from zope.interface import implementer


class IOpenSpace(ISession):
    """A OpenSpace in the event."""


@implementer(IOpenSpace)
class OpenSpace(Session):
    """Convenience subclass for ``OpenSpace`` portal type."""
