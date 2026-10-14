"""Upgrade step helpers that reapply schedule permissions."""

from collective.techevent import logger
from collective.techevent.utils.permissions import modify_schedule_permissions
from plone import api
from Products.GenericSetup.tool import SetupTool


def update_schedule_permissions(context: SetupTool) -> None:
    """Reapply the schedule permissions to every existing Schedule.

    :param context: The ``portal_setup`` tool.
    """
    brains = api.content.find(
        portal_type=["Schedule"],
    )
    for brain in brains:
        obj = brain.getObject()
        modify_schedule_permissions(obj)
        logger.info(f"Updated permissions on {obj.absolute_url()}")
