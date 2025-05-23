from plone.dexterity.content import Container
from zope.interface import implementer
from zope.interface import Interface


class ISchedule(Interface):
    """A Schedule in the event."""


@implementer(ISchedule)
class Schedule(Container):
    """Convenience subclass for ``Schedule`` portal type."""
