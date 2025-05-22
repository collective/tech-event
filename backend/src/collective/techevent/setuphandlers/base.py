from collective.techevent.utils import setup_tech_event
from plone import api
from Products.GenericSetup.tool import SetupTool


def setup_techevent_settings(portal_setup: SetupTool):
    """Setup event settings for Plone Site."""
    portal = api.portal.get()
    setup_tech_event(portal)
