from collective.techevent import PACKAGE_NAME
from plone import api
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.interfaces import ISerializeToJsonSummary
from Products.GenericSetup.tool import SetupTool
from zope.component import getMultiAdapter

import pytest


@pytest.fixture
def http_request(integration_class):
    return integration_class["request"]


@pytest.fixture
def portal(portal_class):
    tool: SetupTool = api.portal.get_tool("portal_setup")
    with api.env.adopt_roles(["Manager"]):
        tool.runAllImportStepsFromProfile(f"{PACKAGE_NAME}:demo")
    yield portal_class


@pytest.fixture
def serializer(http_request):
    def func(context, summary: bool = False):
        iface = ISerializeToJsonSummary if summary else ISerializeToJson
        return getMultiAdapter((context, http_request), iface)

    return func
