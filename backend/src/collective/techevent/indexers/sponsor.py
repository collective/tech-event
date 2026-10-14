"""Catalog indexers for the Sponsor content type."""

from Acquisition import aq_parent
from collective.techevent.content.sponsors.sponsor import ISponsor
from collective.techevent.content.sponsors.sponsor import Sponsor
from plone.indexer.decorator import indexer


@indexer(ISponsor)
def level_indexer(sponsor: Sponsor) -> str:
    """Indexer used to store the level of the sponsor."""
    parent = aq_parent(sponsor)
    level = parent.id
    return level
