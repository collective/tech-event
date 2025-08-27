from collective.techevent import _
from datetime import datetime
from plone.app.event.base import default_timezone
from plone.app.event.dx.behaviors import StartBeforeEnd
from plone.app.z3cform.widgets.datetime import DatetimeFieldWidget
from plone.autoform import directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from zope import schema
from zope.interface import invariant
from zope.interface import provider


@provider(IFormFieldProvider)
class IScheduleSlot(model.Schema):
    """Slot in the event."""

    model.fieldset(
        "schedule",
        label=_("Schedule"),
        fields=["start", "end", "room"],
    )

    start = schema.Datetime(title=_("Start time"), required=False)
    directives.widget(
        "start",
        DatetimeFieldWidget,
        default_timezone=default_timezone,
        klass="event_start",
    )

    end = schema.Datetime(title=_("End time"), required=False)
    directives.widget(
        "end",
        DatetimeFieldWidget,
        default_timezone=default_timezone,
        klass="event_end",
    )

    @invariant
    def validate_start_end(data):
        start: datetime | None = data.start
        end: datetime | None = data.end
        if (start and end) and start > end:
            raise StartBeforeEnd(_("End time must be after start time."))

    room = schema.Set(
        title=_("Room"),
        description=_("Room the activity will take place"),
        value_type=schema.Choice(
            vocabulary="collective.techevent.vocabularies.slot_rooms",
        ),
        required=False,
    )
