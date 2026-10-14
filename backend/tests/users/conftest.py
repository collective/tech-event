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


@pytest.fixture
def attendee_factory(content_factory, portal):
    """Create attendees in the attendees container, for the duration of a test.

    :param content_factory: Factory creating content in a container.
    :param portal: The Plone site.
    :returns: A callable creating an attendee with a given id and e-mail.
    """
    created = []

    def func(attendee_id: str, email: str):
        with api.env.adopt_roles(["Manager"]):
            attendee = content_factory(
                portal["attendees"],
                {
                    "type": "Attendee",
                    "id": attendee_id,
                    "first_name": "Jane",
                    "last_name": "Doe",
                    "email": email,
                },
            )
        created.append(attendee_id)
        return attendee

    yield func
    with api.env.adopt_roles(["Manager"]):
        for attendee_id in created:
            if attendee_id in portal["attendees"]:
                portal["attendees"].manage_delObjects([attendee_id])
