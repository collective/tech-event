from collective.techevent.content.schedule.schedule import Schedule
from plone.dexterity.content import DexterityContent

import pytest


@pytest.fixture
def container(portal) -> DexterityContent:
    return portal


@pytest.fixture(scope="class")
def content(portal_class, payloads, content_factory):
    payload = payloads["Schedule"][0]
    content = content_factory(portal_class, payload)
    yield content


@pytest.fixture
def portal_type() -> str:
    return "Schedule"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, container):
        self.container = container

    def test_create(self, content_factory, payload, portal_type):
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, Schedule)

    @pytest.mark.parametrize(
        "role,expected",
        [
            ["Manager", True],
            ["Site Administrator", True],
            ["Owner", True],
            ["Contributor", True],
            ["Reader", False],
            ["Anonymous", False],
        ],
    )
    def test_create_permission(
        self, roles_permission_on, permission, role: str, expected: bool
    ):
        roles = roles_permission_on(permission, self.container)
        assert (role in roles) is expected


class TestContentTypeSubscriber:
    @pytest.fixture(autouse=True)
    def _setup(self, content):
        self.content = content

    @pytest.mark.parametrize(
        "ct_permission,role,expected",
        [
            ["collective.techevent: Add Training", "Manager", True],
            ["collective.techevent: Add Training", "Site Administrator", True],
            ["collective.techevent: Add Training", "Owner", True],
            ["collective.techevent: Add Training", "Contributor", True],
            ["collective.techevent: Add Training", "Reader", False],
            ["collective.techevent: Add Training", "Anonymous", False],
            ["collective.techevent: Add Talk", "Manager", True],
            ["collective.techevent: Add Talk", "Site Administrator", True],
            ["collective.techevent: Add Talk", "Owner", True],
            ["collective.techevent: Add Talk", "Contributor", True],
            ["collective.techevent: Add Talk", "Reader", False],
            ["collective.techevent: Add Talk", "Anonymous", False],
            ["collective.techevent: Add Keynote", "Manager", True],
            ["collective.techevent: Add Keynote", "Site Administrator", True],
            ["collective.techevent: Add Keynote", "Owner", True],
            ["collective.techevent: Add Keynote", "Contributor", True],
            ["collective.techevent: Add Keynote", "Reader", False],
            ["collective.techevent: Add Keynote", "Anonymous", False],
            ["collective.techevent: Add Slot", "Manager", True],
            ["collective.techevent: Add Slot", "Site Administrator", True],
            ["collective.techevent: Add Slot", "Owner", True],
            ["collective.techevent: Add Slot", "Contributor", True],
            ["collective.techevent: Add Slot", "Reader", False],
            ["collective.techevent: Add Slot", "Anonymous", False],
        ],
    )
    def test_permission_content_types(
        self,
        roles_permission_on,
        ct_permission: str,
        role: str,
        expected: bool,
    ):
        roles = roles_permission_on(ct_permission, self.content)
        assert (role in roles) is expected
