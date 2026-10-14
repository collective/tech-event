"""Vocabularies for the categories and rooms of schedule slots."""

from collective.techevent import _
from collective.techevent.utils import find_event_root
from plone import api
from plone.dexterity.content import DexterityContent
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


CATEGORIES = (
    ("slot", _("Slot")),
    ("registration", _("Registration")),
    ("meeting", _("Meeting")),
    ("photo", _("Conference Photo")),
)


@provider(IVocabularyFactory)  # type: ignore[type-var]  # zope-stubs bind provider's _C to type
def slot_categories(context: DexterityContent) -> SimpleVocabulary:
    """Slot Categories."""
    terms = []
    for token, title in CATEGORIES:
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


BREAK_CATEGORIES = (
    ("coffee-break", _("Coffee-Break")),
    ("lunch", _("Lunch")),
)


@provider(IVocabularyFactory)  # type: ignore[type-var]  # zope-stubs bind provider's _C to type
def break_categories(context: DexterityContent) -> SimpleVocabulary:
    """Break Categories."""
    terms = []
    for token, title in BREAK_CATEGORIES:
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


SESSION_CATEGORIES = (("activity", _("Activity")),)


@provider(IVocabularyFactory)  # type: ignore[type-var]  # zope-stubs bind provider's _C to type
def session_categories(context: DexterityContent) -> SimpleVocabulary:
    """Session Categories."""
    terms = []
    for token, title in SESSION_CATEGORIES:
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)  # type: ignore[type-var]  # zope-stubs bind provider's _C to type
def slot_rooms(context: DexterityContent) -> SimpleVocabulary:
    """Available Slot Rooms."""
    terms = []
    event_root = find_event_root(context)
    for brain in api.content.find(
        event_root, portal_type="Room", sort_on=["getObjPositionInParent"]
    ):
        terms.append(SimpleTerm(brain.UID, brain.UID, brain.Title))
    return SimpleVocabulary(terms)
