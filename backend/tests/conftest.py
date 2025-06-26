from collections import defaultdict
from collective.techevent.testing import ACCEPTANCE_TESTING
from collective.techevent.testing import FUNCTIONAL_TESTING
from collective.techevent.testing import INTEGRATION_TESTING
from dateutil.parser import parse
from pathlib import Path
from plone import api
from plone.dexterity.content import DexterityContent
from pytest_plone import fixtures_factory
from zope.component.hooks import site

import json
import pytest


pytest_plugins = ["pytest_plone"]


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
def resources_folder() -> Path:
    return Path(__file__).parent / "_resources"


def process_payload(payload: dict) -> dict:
    """Process payload."""
    for key in ("start", "end"):
        if key not in payload:
            continue
        value = payload[key]
        payload[key] = parse(value) if value else None
    return payload


@pytest.fixture(scope="session")
def all_content(resources_folder) -> list:
    """Payload to create all content items."""
    fh = resources_folder / "content.json"
    content = [process_payload(payload) for payload in json.loads(fh.read_text())]
    return content


@pytest.fixture(scope="session")
def payloads(all_content) -> dict[str, list[dict]]:
    """Return content type payloads ordered by type."""
    payloads = defaultdict(list)
    for item in all_content:
        ct = item["type"]
        payloads[ct].append(item)
    return payloads


@pytest.fixture(scope="session")
def content_factory():
    """Factory to create a content type in a container."""

    def func(container: DexterityContent, payload: dict) -> DexterityContent:
        payload = {k: v for k, v in payload.items() if not k.startswith("_")}
        with api.env.adopt_roles(["Manager"]):
            content = api.content.create(container=container, **payload)
        return content

    return func


@pytest.fixture(scope="session")
def event_settings(resources_folder) -> dict:
    """Event settings."""
    fh = resources_folder / "event_settings.json"
    payload = json.loads(fh.read_text())
    return process_payload(payload)


@pytest.fixture
def apply_event_settings(event_settings):
    """Apply event settings to content."""

    def func(container: DexterityContent) -> DexterityContent:
        for key, value in event_settings.items():
            setattr(container, key, value)
        return container

    return func


@pytest.fixture
def catalog(portal):
    """Return the catalog brain for a query."""

    def func(**kw) -> list[str]:
        with api.env.adopt_roles(["Manager"]):
            brains = api.content.find(**kw)
        return brains

    return func


@pytest.fixture
def brain_for_content(catalog):
    """Return the catalog brain for a content."""

    def func(content: DexterityContent, **kw) -> list[str]:
        uuid = api.content.get_uuid(content)
        brains = catalog(UID=uuid, **kw)
        return brains[0] if brains else None

    return func
