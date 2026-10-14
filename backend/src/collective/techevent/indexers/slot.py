"""Catalog indexers for schedule slots."""

from collective.techevent.behaviors.schedule import IScheduleSlot
from plone.indexer.decorator import indexer
from typing import Any


@indexer(IScheduleSlot)
def slot_room_indexer(obj: Any) -> list[str]:
    """Indexer used to index room information."""
    room = obj.room or set()
    return list(room) if room else []
