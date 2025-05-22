from collective.techevent import _
from collective.techevent.utils import find_event_root
from plone import api
from plone.dexterity.content import DexterityContent
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


CATEGORIES = (
    ("registration", _("Registration")),
    ("coffee-break", _("Coffee-Break")),
    ("lunch", _("Lunch")),
    ("meeting", _("Meeting")),
    ("photo", _("Conference Photo")),
)


@provider(IVocabularyFactory)
def slot_categories(context):
    """Slot Categories."""
    terms = []
    for token, title in CATEGORIES:
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def slot_rooms(context: DexterityContent) -> SimpleVocabulary:
    """Available Slot Rooms."""
    terms = []
    event_root = find_event_root(context)
    for brain in api.content.find(event_root, portal_type="Room"):
        terms.append(SimpleTerm(brain.UID, brain.UID, brain.Title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def slot_tracks(context: DexterityContent) -> SimpleVocabulary:
    """Available Slot Tracks."""
    terms = []
    event_root = find_event_root(context)
    tracks = event_root.tracks
    for track in tracks:
        terms.append(SimpleTerm(track.id, track.id, track.title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def slot_levels(context: DexterityContent) -> SimpleVocabulary:
    """Available Slot Levels."""
    terms = []
    event_root = find_event_root(context)
    levels = event_root.levels
    for level in levels:
        terms.append(SimpleTerm(level.id, level.id, level.title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def slot_audiences(context: DexterityContent) -> SimpleVocabulary:
    """Available Slot Audiences."""
    terms = []
    event_root = find_event_root(context)
    levels = event_root.levels
    for level in levels:
        terms.append(SimpleTerm(level.id, level.id, level.title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def duration_keynote(context: DexterityContent) -> SimpleVocabulary:
    """Available Keynote Duration."""
    terms = []
    event_root = find_event_root(context)
    durations = event_root.duration_keynote
    for duration in durations:
        terms.append(SimpleTerm(duration.id, duration.id, duration.title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def duration_talk(context: DexterityContent) -> SimpleVocabulary:
    """Available Talk Duration."""
    terms = []
    event_root = find_event_root(context)
    durations = event_root.duration_talk
    for duration in durations:
        terms.append(SimpleTerm(duration.id, duration.id, duration.title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def duration_training(context: DexterityContent) -> SimpleVocabulary:
    """Available Training Duration."""
    terms = []
    event_root = find_event_root(context)
    durations = event_root.duration_training
    for duration in durations:
        terms.append(SimpleTerm(duration.id, duration.id, duration.title))
    return SimpleVocabulary(terms)
