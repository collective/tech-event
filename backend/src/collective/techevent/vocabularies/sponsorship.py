from collective.techevent.utils import get_sponsorship_benefits
from collective.techevent.utils import sponsor_levels
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def sponsorship_levels(context):
    """Available Sponsorship Levels."""
    terms = []
    levels = sponsor_levels(context)
    for level, _ in levels:
        terms.append(SimpleTerm(level.id, level.id, level.title))
    return SimpleVocabulary(terms)


@provider(IVocabularyFactory)
def sponsorship_benefits(context):
    """All Sponsorship Benefits."""
    terms = []
    benefits = get_sponsorship_benefits(context)
    for benefit in benefits:
        token = benefit.get("id")
        title = benefit.get("title")
        if not (token and title):
            continue
        terms.append(SimpleTerm(token, token, title))
    return SimpleVocabulary(terms)
