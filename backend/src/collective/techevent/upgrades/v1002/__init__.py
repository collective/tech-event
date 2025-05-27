from collective.techevent import logger
from plone import api
from Products.GenericSetup.tool import SetupTool


def update_displayed_types(context: SetupTool):
    key = "plone.displayed_types"
    current_items = set(api.portal.get_registry_record(key))
    additional_items = {"Schedule", "Venue"}
    values = current_items | additional_items
    api.portal.set_registry_record(key, tuple(values))
    logger.info(f"Updated registry entry `{key}` to {', '.join(values)}")
