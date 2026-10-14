"""Catalog indexers for the Session content type."""

from collective.techevent.content.schedule.session import ISession
from plone.indexer.decorator import indexer
from typing import Any


@indexer(ISession)
def session_track_indexer(obj: Any) -> list[str] | None:
    """Indexer used to index session_track information."""
    if track := obj.session_track:
        return list(track)
    return None


@indexer(ISession)
def session_level_indexer(obj: Any) -> list[str] | None:
    """Indexer used to index session_level information."""
    if level := obj.session_level:
        return list(level)
    return None


@indexer(ISession)
def session_audience_indexer(obj: Any) -> list[str] | None:
    """Indexer used to index session_audience information."""
    if audience := obj.session_audience:
        return list(audience)
    return None


@indexer(ISession)
def session_language_indexer(obj: Any) -> str | None:
    """Indexer used to index session_language information."""
    language = obj.session_language
    if language is not None:
        return language
    return None
