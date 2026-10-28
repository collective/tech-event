"""Upgrade to profile version 1009: add permissions on existing Tech Events.

With ``support_multiple_events`` on, the Plone Site loses the permissions to
add Presenters, Venues and a SponsorsDB. Tech Events created before 1009 never
received them, so nobody could add that content inside them.
"""

from collective.techevent import logger
from collective.techevent.utils import setup_tech_event
from plone import api
from Products.GenericSetup.tool import SetupTool


def setup_tech_event_permissions(setup_tool: SetupTool) -> None:
    """Reapply the event setup, which grants the permissions on Tech Events.

    :param setup_tool: The ``portal_setup`` tool.
    """
    setup_tech_event(api.portal.get())
    logger.info("Reapplied the event setup.")
