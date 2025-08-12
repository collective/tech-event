from collective.techevent import PACKAGE_NAME
from plone import api
from plone.app.testing import SITE_OWNER_NAME
from plone.app.testing import SITE_OWNER_PASSWORD
from plone.restapi.testing import RelativeSession
from Products.GenericSetup.tool import SetupTool
from zope.component.hooks import setSite

import pytest
import transaction


@pytest.fixture()
def portal(functional):
    portal = functional["portal"]
    setSite(portal)
    tool: SetupTool = api.portal.get_tool("portal_setup")
    with api.env.adopt_roles(["Manager"]):
        tool.runAllImportStepsFromProfile(f"{PACKAGE_NAME}:demo")
    transaction.commit()
    return portal


@pytest.fixture()
def request_api_factory(portal):
    def factory():
        url = portal.absolute_url()
        api_session = RelativeSession(f"{url}/++api++")
        return api_session

    return factory


@pytest.fixture()
def api_anon_request(request_api_factory):
    return request_api_factory()


@pytest.fixture()
def api_manager_request(request_api_factory):
    request = request_api_factory()
    request.auth = (SITE_OWNER_NAME, SITE_OWNER_PASSWORD)
    yield request
    request.auth = ()
