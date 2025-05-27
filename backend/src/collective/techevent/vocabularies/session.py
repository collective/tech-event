from collective.techevent.utils import find_event_root
from plone.dexterity.content import DexterityContent
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def session_tracks(context: DexterityContent) -> SimpleVocabulary:
    """Available Session Tracks."""
    terms = []
    event_root = find_event_root(context)
    tracks = event_root.tracks
    for track in tracks:
        terms.append(SimpleTerm(track["id"], track["id"], track["title"]))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def session_levels(context: DexterityContent) -> SimpleVocabulary:
    """Available Session Levels."""
    terms = []
    event_root = find_event_root(context)
    levels = event_root.levels
    for level in levels:
        terms.append(SimpleTerm(level["id"], level["id"], level["title"]))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def session_audiences(context: DexterityContent) -> SimpleVocabulary:
    """Available Session Audiences."""
    terms = []
    event_root = find_event_root(context)
    audience = event_root.audience
    for group in audience:
        terms.append(SimpleTerm(group["id"], group["id"], group["title"]))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def durations_keynote(context: DexterityContent) -> SimpleVocabulary:
    """Available Keynote Duration."""
    terms = []
    event_root = find_event_root(context)
    durations = event_root.durations_keynote
    for duration in durations:
        terms.append(SimpleTerm(duration["id"], duration["id"], duration["title"]))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def durations_talk(context: DexterityContent) -> SimpleVocabulary:
    """Available Talk Duration."""
    terms = []
    event_root = find_event_root(context)
    durations = event_root.durations_talk
    for duration in durations:
        terms.append(SimpleTerm(duration["id"], duration["id"], duration["title"]))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def durations_training(context: DexterityContent) -> SimpleVocabulary:
    """Available Training Duration."""
    terms = []
    event_root = find_event_root(context)
    durations = event_root.durations_training
    for duration in durations:
        terms.append(SimpleTerm(duration["id"], duration["id"], duration["title"]))
    return SimpleVocabulary(terms)
