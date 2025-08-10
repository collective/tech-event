from collective.techevent.users.testing import ACCEPTANCE_TESTING
from collective.techevent.users.testing import FUNCTIONAL_TESTING
from collective.techevent.users.testing import INTEGRATION_TESTING
from plone import api
from plone.dexterity.content import DexterityContent
from pytest_plone import fixtures_factory
from zope.component.hooks import site

import pytest


globals().update(
    fixtures_factory((
        (ACCEPTANCE_TESTING, "acceptance"),
        (FUNCTIONAL_TESTING, "functional"),
        (INTEGRATION_TESTING, "integration"),
    ))
)


@pytest.fixture(scope="class")
def portal_class(integration_class):
    if hasattr(integration_class, "testSetUp"):
        integration_class.testSetUp()
    portal = integration_class["portal"]
    with site(portal):
        yield portal
    if hasattr(integration_class, "testTearDown"):
        integration_class.testTearDown()


@pytest.fixture(scope="session")
def content_factory():
    """Factory to create a content type in a container."""

    def func(container: DexterityContent, payload: dict) -> DexterityContent:
        payload = {k: v for k, v in payload.items() if not k.startswith("_")}
        with api.env.adopt_roles(["Manager"]):
            content = api.content.create(container=container, **payload)
        return content

    return func


@pytest.fixture
def portal(integration) -> DexterityContent:
    portal = integration["portal"]
    return portal
