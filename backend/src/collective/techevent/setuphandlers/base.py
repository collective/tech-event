from collective.techevent.utils import setup_tech_event
from plone import api
from Products.GenericSetup.tool import SetupTool


def setup_techevent_settings(portal_setup: SetupTool) -> None:
    """Setup event settings for Plone Site.

    :param portal_setup: The GenericSetup tool (unused).
    """
    portal = api.portal.get()
    setup_tech_event(portal)


def setup_techevent_users(portal_setup: SetupTool) -> None:
    """Grant the permission to add an Attendees container on event roots.

    :param portal_setup: The GenericSetup tool (unused).
    """
    portal = api.portal.get()
    setup_tech_event(portal)
