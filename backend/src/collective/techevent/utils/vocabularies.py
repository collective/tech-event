from plone.dexterity.content import DexterityContent
from zope.component import getUtility
from zope.schema.interfaces import IVocabularyFactory


ATTRIBUTE_VOCABULARY = {
    "room": "collective.techevent.vocabularies.slot_rooms",
    "session_audience": "collective.techevent.vocabularies.session_audiences",
    "portal_type": "plone.app.vocabularies.ReallyUserFriendlyTypes",
    "slot_category": "collective.techevent.vocabularies.slot_categories",
    "session_language": "plone.app.vocabularies.SupportedContentLanguages",
    "session_level": "collective.techevent.vocabularies.session_levels",
    "session_track": "collective.techevent.vocabularies.session_tracks",
}


def get_vocabulary(name: str, context: DexterityContent):
    factory = getUtility(IVocabularyFactory, name)
    return factory(context)


def get_vocabulary_for_attr(attr: str, context: DexterityContent):
    name = ATTRIBUTE_VOCABULARY.get(attr)
    return get_vocabulary(name, context) if name else None
