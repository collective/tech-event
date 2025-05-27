from collective.techevent import _
from collective.techevent.utils import find_event_root
from plone import api
from plone.dexterity.content import DexterityContent
from plone.uuid.interfaces import IUUID
from zope.interface import implementer
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


LABELS = {
    "keynote-speaker": _("Keynote Speaker"),
    "speaker": _("Speaker"),
    "instructor": _("Instructor"),
    "pf-member": _("Plone Foundation Member"),
}


class Vocabulary(SimpleVocabulary):
    """Vocabulary supporting value validation against the Catalog."""

    def __contains__(self, value: DexterityContent | str) -> bool:
        """used during validation to make sure the selected item is found with
        the specified query.

        value can be either a string (hex value of uuid or path) or a plone
        content object.
        """
        if not isinstance(value, str):
            value = IUUID(value)
        if value.startswith("/"):
            # it is a path query
            site_path = "/".join(api.portal.get().getPhysicalPath())
            path = f"{site_path}{value}"
            query = {"path": {"query": path, "depth": 0}}
        else:
            # its a uuid
            query = {"UID": value}
        return bool(api.content.find(**query))


@implementer(IVocabularyFactory)
class PresentersVocabulary:
    """Vocabulary of available Presenters"""

    def query(
        self,
        context: DexterityContent,
    ) -> dict:
        """Query for Presenters."""
        event_root = find_event_root(context)
        return {
            "context": event_root,
            "portal_type": "Presenter",
            "sort_on": "sortable_title",
        }

    @staticmethod
    def prepare_title(result) -> str:
        """Return a friendly value to be used in the vocabulary."""
        return result.Title

    def __call__(
        self, context: DexterityContent, query: dict | None = None
    ) -> Vocabulary:
        query = self.query(context)
        results = api.content.find(**query)
        terms = []
        for result in results:
            title = self.prepare_title(result)
            terms.append(SimpleTerm(result.getObject(), result.UID, title))
        return Vocabulary(terms)


PresentersVocabularyFactory = PresentersVocabulary()


@provider(IVocabularyFactory)
def presenter_labels(context: DexterityContent):
    """Available Labels for a presenter."""
    terms = []
    for token, title in LABELS.items():
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)
