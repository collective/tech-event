from AccessControl.PermissionRole import rolesForPermissionOn
from plone.dexterity.content import DexterityContent

import pytest


@pytest.fixture
def portal(integration, apply_event_settings) -> DexterityContent:
    portal = integration["portal"]
    apply_event_settings(portal)
    return portal


@pytest.fixture
def container(portal) -> DexterityContent:
    return portal


@pytest.fixture
def content_instance(content_factory, container, payload) -> DexterityContent:
    return content_factory(container, payload)


@pytest.fixture
def payload(payloads, portal_type) -> dict:
    return payloads[portal_type][0]


@pytest.fixture
def roles_permission_on():
    def func(permission: str, container: DexterityContent) -> list[str]:
        return rolesForPermissionOn(permission, container)

    return func


@pytest.fixture
def permission(portal_type) -> str:
    return f"collective.techevent: Add {portal_type}"


@pytest.fixture
def event_dates(portal):
    """Return event dates."""
    return portal.start, portal.end
