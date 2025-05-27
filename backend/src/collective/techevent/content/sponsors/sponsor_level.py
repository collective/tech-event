from collective.techevent import _
from collective.techevent.fields.datagrid import DataGrid
from collective.z3cform.datagridfield.row import DictRow
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.supermodel import model
from plone.supermodel.model import Schema
from uuid import uuid4
from zope import schema
from zope.interface import implementer
from zope.interface import Interface


def generate_uuid() -> str:
    return f"{uuid4()}"


class IBenefit(Schema):
    """A Benefit added to a package level."""

    id = schema.ASCIILine(
        title=_("ID"),
        description=_("ID of this benefit"),
        required=True,
        defaultFactory=generate_uuid,
    )

    code = schema.Choice(
        title=_("Benefit"),
        description=_(""),
        vocabulary="collective.techevent.vocabularies.sponsorship_benefits",
        required=True,
        default="",
    )
    value = schema.TextLine(
        title=_("Additional Information"),
        description=_(""),
        default="",
        required=False,
    )
    directives.widget(
        "id",
        frontendOptions={
            "widget": "hidden",
        },
    )


class ISponsorLevel(Interface):
    """Sponsorship Level."""

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
    price = schema.TextLine(
        title=_("Investment"),
        description=_("Investment for this level"),
        default="",
        required=False,
    )
    model.fieldset(
        "benefits",
        label=_("Benefits"),
        fields=[
            "benefits",
        ],
    )
    benefits = DataGrid(
        title=_("Benefits"),
        description=_("Benefits of this level."),
        required=False,
        alias_title="code",
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


@implementer(ISponsorLevel)
class SponsorLevel(Container):
    """Convenience subclass for ``SponsorLevel`` portal type."""
