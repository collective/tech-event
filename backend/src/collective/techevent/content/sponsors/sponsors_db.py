from collective.techevent import _
from collective.z3cform.datagridfield.row import DictRow
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.supermodel.model import Schema
from uuid import uuid4
from zope import schema
from zope.interface import implementer
from zope.interface import Interface


def generate_uuid() -> str:
    return f"{uuid4()}"


class IBenefit(Schema):
    """A track in the event."""

    id = schema.ASCIILine(
        title=_("ID"),
        description=_("ID of this benefit"),
        required=True,
        defaultFactory=generate_uuid,
    )
    title = schema.TextLine(
        title=_("Benefit"),
        description=_("Benefit title"),
        default="",
        required=True,
    )
    description = schema.TextLine(
        title=_("Description"),
        description=_("Benefit description"),
        default="",
        required=True,
    )
    directives.widget(
        "id",
        frontendOptions={
            "widget": "hidden",
        },
    )


class ISponsorsDB(Interface):
    """A Sponsors Database in the event."""

    benefits = schema.List(
        title=_("Benefits"),
        description=_("All benefits for sponsoring this event."),
        required=False,
        value_type=DictRow(schema=IBenefit),
        default=[],
    )
    directives.widget(
        "benefits",
        frontendOptions={
            "widget": "dataGridList",
            "widgetProps": {
                "allow_reorder": True,
            },
        },
    )


@implementer(ISponsorsDB)
class SponsorsDB(Container):
    """Convenience subclass for ``SponsorsDB`` portal type."""
