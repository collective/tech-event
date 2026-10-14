from collective.techevent import logger
from pathlib import Path
from plone import api
from plone.exportimport import importers  # type: ignore[attr-defined]  # plone-stubs does not ship plone.exportimport.importers
from Products.GenericSetup.tool import SetupTool


EXAMPLE_CONTENT_FOLDER = Path(__file__).parent / "examplecontent"


def create_example_content(portal_setup: SetupTool) -> None:
    """Import content available at the examplecontent folder.

    :param portal_setup: The GenericSetup tool (unused).
    """
    portal = api.portal.get()
    importer = importers.get_importer(portal)
    for line in importer.import_site(EXAMPLE_CONTENT_FOLDER):
        logger.info(line)
