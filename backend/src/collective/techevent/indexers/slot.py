from collective.techevent.behaviors.schedule import IScheduleSlot
from plone.indexer.decorator import indexer


@indexer(IScheduleSlot)
def slot_room_indexer(obj) -> list[str]:
    """Indexer used to index room information."""
    room = obj.room or set()
    return list(room) if room else []
