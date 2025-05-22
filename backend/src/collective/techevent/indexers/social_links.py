from persistent.list import PersistentList
from persistent.mapping import PersistentMapping
from plone.indexer.decorator import indexer
from plonegovbr.socialmedia.behaviors.social_links import ISocialLinks


@indexer(ISocialLinks)
def links_indexer(obj):
    """Indexer used to store in metadata the links of the object."""
    links = []
    if raw_links := obj.social_links:
        for link in raw_links:
            links.append(PersistentMapping(link))
    return PersistentList(links)
