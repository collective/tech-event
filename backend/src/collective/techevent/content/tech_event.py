from plone.dexterity.content import Container
from zope.interface import implementer
from zope.interface import Interface


class ITechEvent(Interface):
    """An instance of a event."""


@implementer(ITechEvent)
class TechEvent(Container):
    """Convenience subclass for ``TechEvent`` portal type."""
