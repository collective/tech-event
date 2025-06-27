from collective.techevent.content.schedule.session import ISession
from collective.techevent.content.schedule.session import Session
from zope.interface import implementer


class ILightningTalks(ISession):
    """A Lightning Talks slot in the event."""


@implementer(ILightningTalks)
class LightningTalks(Session):
    """Convenience subclass for ``LightningTalks`` portal type."""
