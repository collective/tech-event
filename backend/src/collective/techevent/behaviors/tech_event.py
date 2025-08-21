from collective.techevent import _
from collective.techevent.fields.datagrid import DataGrid
from collective.techevent.utils.dates import default_end
from collective.techevent.utils.dates import default_start
from collective.techevent.utils.dates import get_iso_dates_between
from collective.z3cform.datagridfield.row import DictRow
from datetime import datetime
from plone.app.event.base import default_timezone
from plone.app.event.dx.behaviors import StartBeforeEnd
from plone.app.z3cform.widgets.datetime import DatetimeFieldWidget
from plone.autoform import directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.dexterity.content import DexterityContent
from plone.supermodel import model
from plone.supermodel.model import Schema
from zope import schema
from zope.interface import implementer
from zope.interface import invariant
from zope.interface import provider


class ITrack(Schema):
    """A track in the event."""

    id = schema.ASCIILine(
        title=_("Code"),
        description=_("Code of this track"),
        required=True,
    )
    title = schema.TextLine(
        title=_("Track"),
        description=_("Title of this track"),
        required=True,
    )
    color = schema.TextLine(
        title=_("Color"),
        description=_("Color used for this item"),
        default="#000000",
        required=True,
    )
    directives.widget(
        "color",
        frontendOptions={
            "widget": "colorPicker",
        },
    )


class ILevel(Schema):
    """A session level in the event."""

    id = schema.ASCIILine(
        title=_("Code"),
        description=_("Code of this level"),
        required=True,
    )
    title = schema.TextLine(
        title=_("Level"),
        description=_("Title of this level"),
        required=True,
    )
    color = schema.TextLine(
        title=_("Color"),
        description=_("Color used for this item"),
        default="#000000",
        required=True,
    )
    directives.widget(
        "color",
        frontendOptions={
            "widget": "colorPicker",
        },
    )


class IAudienceGroup(Schema):
    """A target audience in the event."""

    id = schema.ASCIILine(
        title=_("Code"),
        description=_("Code of this audience"),
        required=True,
    )
    title = schema.TextLine(
        title=_("Audience"),
        description=_("Title of this audience"),
        required=True,
    )
    color = schema.TextLine(
        title=_("Color"),
        description=_("Color used for this item"),
        default="#000000",
        required=True,
    )
    directives.widget(
        "color",
        frontendOptions={
            "widget": "colorPicker",
        },
    )


class IActivityDuration(Schema):
    """Duration, in minutes of an activity."""

    id = schema.ASCIILine(
        title=_("Code"),
        description=_("Code of this duration"),
        required=True,
    )
    title = schema.TextLine(
        title=_("Title"),
        description=_("Title of this duration"),
        required=True,
    )
    duration = schema.Int(
        title=_("Activity duration"),
        description=_("How long, in minutes, this activity will use."),
        default=60,
        required=True,
    )
    color = schema.TextLine(
        title=_("Color"),
        description=_("Color used for this item"),
        default="#000000",
        required=True,
    )
    directives.widget(
        "color",
        frontendOptions={
            "widget": "colorPicker",
        },
    )


@provider(IFormFieldProvider)
class ISettings(model.Schema):
    """Tech Event configuration."""

    model.fieldset(
        "event-settings",
        label=_("Event Settings"),
        fields=[
            "start",
            "end",
            "days",
            "tracks",
            "levels",
            "audience",
            "durations_keynote",
            "durations_talk",
            "durations_training",
            "schedule_review_states",
        ],
    )

    start = schema.Datetime(
        title=_("Start time"), required=False, defaultFactory=default_start
    )
    directives.widget(
        "start",
        DatetimeFieldWidget,
        default_timezone=default_timezone,
        klass="event_start",
    )

    end = schema.Datetime(
        title=_("End time"), required=False, defaultFactory=default_end
    )
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

    days = schema.List(title=_("Event days"), required=False, readonly=True)

    tracks = DataGrid(
        title=_("Tracks"),
        description=_("All tracks available at this event."),
        required=False,
        value_type=DictRow(schema=ITrack),
        default=[],
    )
    directives.widget(
        "tracks",
        frontendOptions={
            "widget": "dataGridList",
            "widgetProps": {
                "allow_reorder": True,
            },
        },
    )

    levels = DataGrid(
        title=_("Session Levels"),
        description=_("Levels for a session."),
        required=False,
        value_type=DictRow(schema=ILevel),
        default=[],
    )
    directives.widget(
        "levels",
        frontendOptions={
            "widget": "dataGridList",
            "widgetProps": {
                "allow_reorder": True,
            },
        },
    )

    audience = DataGrid(
        title=_("Session Audience"),
        description=_("Target group for this audience."),
        required=False,
        value_type=DictRow(schema=ILevel),
        default=[],
    )
    directives.widget(
        "audience",
        frontendOptions={
            "widget": "dataGridList",
            "widgetProps": {
                "allow_reorder": True,
            },
        },
    )

    durations_keynote = DataGrid(
        title=_("Keynote: Slot duration"),
        description=_("Possible slot duration for a keynote"),
        required=False,
        value_type=DictRow(schema=IActivityDuration),
        default=[],
    )
    directives.widget(
        "durations_keynote",
        frontendOptions={
            "widget": "dataGridList",
            "widgetProps": {
                "allow_reorder": True,
            },
        },
    )

    durations_talk = DataGrid(
        title=_("Talk: Slot duration"),
        description=_("Possible slot duration for a talk"),
        required=False,
        value_type=DictRow(schema=IActivityDuration),
        default=[],
    )
    directives.widget(
        "durations_talk",
        frontendOptions={
            "widget": "dataGridList",
            "widgetProps": {
                "allow_reorder": True,
            },
        },
    )

    durations_training = DataGrid(
        title=_("Training: Slot duration"),
        description=_("Possible slot duration for a training"),
        required=False,
        value_type=DictRow(schema=IActivityDuration),
        default=[],
    )
    directives.widget(
        "durations_training",
        frontendOptions={
            "widget": "dataGridList",
            "widgetProps": {
                "allow_reorder": True,
            },
        },
    )

    schedule_review_states = schema.List(
        title=_("Schedule: Additional states"),
        description=_(
            "Workflow states to include in the schedule in addition to 'published'."
        ),
        required=False,
        value_type=schema.Choice(
            vocabulary="plone.app.vocabularies.WorkflowStates",
        ),
    )
    directives.widget(
        "schedule_review_states",
        frontendOptions={
            "widget": "multiSelect",
            "widgetProps": {
                "multiple": True,
            },
        },
    )


@implementer(ISettings)
class Settings:
    """Tech Event settings."""

    def __init__(self, context: DexterityContent):
        self.context = context

    @property
    def start(self) -> datetime:
        """Getter, read from context and return back"""
        return self.context.start

    @start.setter
    def start(self, value: datetime):
        """Setter, called by the form, set on context."""
        self.context.start = value

    @property
    def end(self) -> datetime:
        """Getter, read from context and return back"""
        return self.context.end

    @end.setter
    def end(self, value: datetime):
        """Setter, called by the form, set on context."""
        self.context.end = value

    @property
    def tracks(self) -> list[ITrack]:
        """Getter, read from context and return back"""
        return self.context.tracks

    @tracks.setter
    def tracks(self, value: list[ITrack]):
        """Setter, called by the form, set on context."""
        self.context.tracks = value

    @property
    def levels(self) -> list[ILevel]:
        """Getter, read from context and return back"""
        return self.context.levels

    @levels.setter
    def levels(self, value: list[ILevel]):
        """Setter, called by the form, set on context."""
        self.context.levels = value

    @property
    def audience(self) -> list[IAudienceGroup]:
        """Getter, read from context and return back"""
        return self.context.audience

    @audience.setter
    def audience(self, value: list[IAudienceGroup]):
        """Setter, called by the form, set on context."""
        self.context.audience = value

    @property
    def durations_keynote(self) -> list[IActivityDuration]:
        """Getter, read from context and return back"""
        return self.context.durations_keynote

    @durations_keynote.setter
    def durations_keynote(self, value: list[IActivityDuration]):
        """Setter, called by the form, set on context."""
        self.context.durations_keynote = value

    @property
    def durations_talk(self) -> list[IActivityDuration]:
        """Getter, read from context and return back"""
        return self.context.durations_talk

    @durations_talk.setter
    def durations_talk(self, value: list[IAudienceGroup]):
        """Setter, called by the form, set on context."""
        self.context.durations_talk = value

    @property
    def durations_training(self) -> list[IActivityDuration]:
        """Getter, read from context and return back"""
        return self.context.durations_training

    @durations_training.setter
    def durations_training(self, value: list[IAudienceGroup]):
        """Setter, called by the form, set on context."""
        self.context.durations_training = value

    @property
    def days(self) -> list[str]:
        """Getter, read from context and return back"""
        start = self.context.start
        end = self.context.end
        days = []
        if start and end and (start <= end):
            return get_iso_dates_between(start, end)
        return days

    @days.setter
    def days(self, value: list):
        """Setter, called by the form, set on context."""
        pass

    @property
    def schedule_review_states(self) -> list[str]:
        """Getter, read workflow states from context and return back"""
        return getattr(self.context, "schedule_review_states", None) or []

    @schedule_review_states.setter
    def schedule_review_states(self, value: list[str]):
        """Setter, called by the form, set workflow states on context."""
        self.context.schedule_review_states = list(value or [])
