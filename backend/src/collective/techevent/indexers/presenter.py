"""Catalog indexers for the Presenter content type."""

from collective.techevent.content.presenter import IPresenter
from plone.indexer.decorator import indexer
from typing import Any


@indexer(IPresenter)
def categories_indexer(obj: Any) -> list[str] | None:
    """Indexer used to index category information."""
    if categories := obj.categories:
        return list(categories)
    return None
