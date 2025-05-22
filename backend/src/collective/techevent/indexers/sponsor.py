from Acquisition import aq_parent
from collective.techevent.content.sponsors.sponsor import ISponsor
from collective.techevent.content.sponsors.sponsor import Sponsor
from plone.indexer.decorator import indexer


@indexer(ISponsor)
def level_indexer(sponsor: Sponsor):
    """Indexer used to store the level of the sponsor."""
    parent = aq_parent(sponsor)
    level = parent.id
    return level
