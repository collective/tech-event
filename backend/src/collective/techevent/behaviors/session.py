from collective.techevent import _
from plone.app.textfield import RichText
from plone.app.z3cform.widgets.select import SelectFieldWidget
from plone.autoform import directives
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from z3c.relationfield.schema import RelationChoice
from z3c.relationfield.schema import RelationList
from zope import schema
from zope.interface import provider


@provider(IFormFieldProvider)
class IEventSession(model.Schema):
    """A Session in the event."""

    title = schema.TextLine(title=_("Title"), required=True)
    description = schema.Text(title=_("Abstract"), required=True)

    text = RichText(
        title=_("Details"),
        required=False,
        missing_value="",
    )

    # Presenters
    presenters = RelationList(
        title=_("Presenters"),
        description=_(""),
        value_type=RelationChoice(
            vocabulary="collective.techevent.vocabularies.presenters",
        ),
        required=False,
        default=[],
    )

    session_level = schema.Set(
        title=_("Level"),
        description=_("Target Level"),
        value_type=schema.Choice(
            vocabulary="collective.techevent.vocabularies.session_levels",
        ),
        required=False,
    )

    session_audience = schema.Set(
        title=_("Audience"),
        description=_("Target audience"),
        value_type=schema.Choice(
            vocabulary="collective.techevent.vocabularies.session_audiences",
        ),
        required=False,
    )
    session_language = schema.Choice(
        title=_("label_language", default="Language"),
        vocabulary="plone.app.vocabularies.SupportedContentLanguages",
        required=False,
        missing_value="",
    )
    directives.widget("session_language", SelectFieldWidget)

    session_track = schema.Set(
        title=_("Track"),
        description=_("Track this sessionctivity will be listed"),
        value_type=schema.Choice(
            vocabulary="collective.techevent.vocabularies.session_tracks",
        ),
        required=False,
    )

    session_video = schema.URI(
        title=_("Video"),
        description=_("Video content for this session"),
        required=False,
    )

    directives.order_before(
        session_video="*",
        session_audience="*",
        session_level="*",
        session_language="*",
        session_track="*",
        presenters="*",
        text="*",
        description="*",
        title="*",
    )
