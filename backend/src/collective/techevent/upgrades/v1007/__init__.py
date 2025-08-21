from collective.techevent import logger
from collective.techevent.utils.permissions import modify_schedule_permissions
from plone import api
from Products.GenericSetup.tool import SetupTool


def reindex_schedule_objects(context: SetupTool):
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
    idxs = [
        "presenter_categories",
    ]
    brains = api.content.find(portal_type=["Presenter"])
    for brain in brains:
        obj = brain.getObject()
        obj.reindexObject(idxs)
        logger.info(f"Reindexed {', '.join(idxs)} {obj.absolute_url()}")
