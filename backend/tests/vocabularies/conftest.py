from collective.techevent import PACKAGE_NAME
from plone import api
from Products.GenericSetup.tool import SetupTool

import pytest


@pytest.fixture
def portal(portal_class):
    tool: SetupTool = api.portal.get_tool("portal_setup")
    with api.env.adopt_roles(["Manager"]):
        tool.runAllImportStepsFromProfile(f"{PACKAGE_NAME}:demo")
    yield portal_class
