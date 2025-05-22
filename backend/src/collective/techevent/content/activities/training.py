from collective.techevent import _
from collective.techevent.content.slot import ISlot
from collective.techevent.content.slot import Slot
from plone.app.textfield import RichText
from zope import schema
from zope.interface import implementer


class ITraining(ISlot):
    """A Training Session in the event."""

    duration = schema.Choice(
        title=_("Duration"),
        description=_("Duration of the training"),
        required=False,
        vocabulary="collective.techevent.vocabularies.training_duration",
    )

    requirements = RichText(
        title=_("Requirements"),
        description=_("Requirements of this training"),
        required=False,
        missing_value="",
    )

    total_seats = schema.Int(
        title=_("Seats"),
        description=_("Total number of seats"),
        required=False,
        default=0,
    )


@implementer(ITraining)
class Training(Slot):
    """Convenience subclass for ``Training`` portal type."""
