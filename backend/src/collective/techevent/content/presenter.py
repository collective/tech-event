from collective.techevent import _
from plone import api
from plone.autoform import directives
from plone.dexterity.content import Container
from plone.schema.email import Email
from zope import schema
from zope.interface import implementer
from zope.interface import Interface


PERMISSION = "cmf.ModifyPortalContent"


ACTIVITIES_TO_LABELS = {
    "Keynote": "keynote-speaker",
    "Talk": "speaker",
    "Training": "instructor",
}


class IPresenter(Interface):
    """A Presenter in the event."""

    title = schema.TextLine(title=_("label_name", default="Name"), required=True)

    description = schema.Text(
        title=_("label_biography", default="Short Biography"),
        description=_(
            "help_description", default="Used in item listings and search results."
        ),
        required=False,
        missing_value="",
    )
    directives.order_before(description="*")
    directives.order_before(title="*")

    email = Email(
        title=_("Email address"),
        description=_("Presenteral e-mail address"),
    )

    categories = schema.List(
        title=_("Categories"),
        value_type=schema.Choice(
            vocabulary="collective.techevent.vocabularies.presenter_labels",
        ),
        default=[],
        required=False,
    )
    directives.read_permission(email=PERMISSION)
    directives.write_permission(categories=PERMISSION, email=PERMISSION)


@implementer(IPresenter)
class Presenter(Container):
    """Convenience subclass for ``Presenter`` portal type."""

    @property
    def activities(self):
        """Return a list of activities connected to this presenter.

        :returns: List of activities connected to this presenter.
        """
        activities = [
            rel.from_object
            for rel in api.relation.get(
                target=self, unrestricted=True, relationship="presenters"
            )
        ]
        # Only show approved activities
        return [
            activity
            for activity in activities
            if api.content.get_state(activity, default="_") == "published"
        ]

    @property
    def labels(self) -> list[dict]:
        """Return a list of labels to be applied to this presenter.

        :returns: List of labels.
        """
        labels = set()
        categories = self.categories
        activities = self.activities
        for category in categories:
            labels.add(category)
        for activity in activities:
            portal_type = activity.portal_type
            if portal_type in ACTIVITIES_TO_LABELS:
                labels.add(ACTIVITIES_TO_LABELS[portal_type])

        return list(labels)
