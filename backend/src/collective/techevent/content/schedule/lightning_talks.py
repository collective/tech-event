from collective.techevent import _
from collective.techevent.content.schedule.session import ISession
from collective.techevent.content.schedule.session import Session
from collective.techevent.fields.datagrid import DataGrid
from collective.z3cform.datagridfield.row import DictRow
from plone.autoform import directives
from plone.supermodel.model import Schema
from zope import schema
from zope.interface import implementer


class ITalk(Schema):
    """A talk inside a Lightning Talks session."""

    title = schema.TextLine(
        title=_("Title"),
        description=_("Title of this presentation"),
        required=True,
    )
    presenters = schema.TextLine(
        title=_("Presenters"),
        description=_("Presenters of this talk"),
        required=True,
    )


class ILightningTalks(ISession):
    """A Lightning Talks slot in the event."""

    talks = DataGrid(
        title=_("Presentations"),
        description=_("All presentations at this session."),
        required=False,
        value_type=DictRow(schema=ITalk),
        default=[],
    )
    directives.widget(
        "talks",
        frontendOptions={
            "widget": "dataGridList",
            "widgetProps": {
                "allow_reorder": True,
            },
        },
    )

    session_video = schema.URI(
        title=_("Video"),
        description=_("Video content for this session"),
        required=False,
    )


@implementer(ILightningTalks)
class LightningTalks(Session):
    """Convenience subclass for ``LightningTalks`` portal type."""
