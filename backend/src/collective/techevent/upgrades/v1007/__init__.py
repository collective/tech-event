from collective.techevent import logger
from plone import api
from Products.GenericSetup.tool import SetupTool

import pytz


def reindex_schedule_objects(context: SetupTool):
    """Reindex schedule-related fields for existing schedule objects."""
    idxs = [
        "slot_room",
        "session_level",
        "session_audience",
        "session_track",
        "session_language",
    ]
    brains = api.content.find(
        portal_type=["Talk", "Keynote", "Training", "LightningTalks", "OpenSpace"]
    )
    for brain in brains:
        obj = brain.getObject()
        obj.reindexObject(idxs)
        logger.info(f"Reindexed {', '.join(idxs)} {obj.absolute_url()}")


def reindex_presenter_objects(context: SetupTool):
    """Reindex presenter categories for existing Presenter objects."""
    idxs = [
        "presenter_categories",
    ]
    brains = api.content.find(portal_type=["Presenter"])
    for brain in brains:
        obj = brain.getObject()
        obj.reindexObject(idxs)
        logger.info(f"Reindexed {', '.join(idxs)} {obj.absolute_url()}")


def reindex_start_end_dates(context: SetupTool):
    """Make start and end attributes datetime timezone aware for existing objects."""
    from collective.techevent.behaviors.schedule import IScheduleSlot
    from collective.techevent.behaviors.tech_event import ISettings

    idxs = ["start", "end"]
    tz = pytz.timezone(api.portal.get_registry_record("plone.portal_timezone"))
    brains = api.content.find(object_provides=[IScheduleSlot, ISettings])
    for brain in brains:
        obj = brain.getObject()
        for field in idxs:
            value = getattr(obj, field, None)
            if not value:
                continue
            # Make datetime timezone aware
            value = value.astimezone(tz)
            setattr(obj, field, value)
        obj.reindexObject(idxs)
        logger.info(f"Reindexed {', '.join(idxs)} {obj.absolute_url()}")
