from plone.dexterity.content import Container
from zope.interface import implementer
from zope.interface import Interface


class IVenue(Interface):
    """A Venue for the event."""


@implementer(IVenue)
class Venue(Container):
    """Convenience subclass for ``Venue`` portal type."""
