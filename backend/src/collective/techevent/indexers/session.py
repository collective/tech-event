from collective.techevent.content.schedule.session import ISession
from plone.indexer.decorator import indexer


@indexer(ISession)
def session_track_indexer(obj) -> list[str] | None:
    """Indexer used to index session_track information."""
    if track := obj.session_track:
        return list(track)


@indexer(ISession)
def session_level_indexer(obj) -> list[str] | None:
    """Indexer used to index session_level information."""
    if level := obj.session_level:
        return list(level)


@indexer(ISession)
def session_audience_indexer(obj) -> list[str] | None:
    """Indexer used to index session_audience information."""
    if audience := obj.session_audience:
        return list(audience)


@indexer(ISession)
def session_language_indexer(obj) -> str | None:
    """Indexer used to index session_language information."""
    language = obj.session_language
    if language is not None:
        return language
