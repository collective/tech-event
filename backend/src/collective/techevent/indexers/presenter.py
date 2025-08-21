from collective.techevent.content.presenter import IPresenter
from plone.indexer.decorator import indexer


@indexer(IPresenter)
def categories_indexer(obj) -> list[str] | None:
    """Indexer used to index category information."""
    if categories := obj.categories:
        return list(categories)
