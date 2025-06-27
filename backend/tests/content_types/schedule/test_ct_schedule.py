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


class TestVersioning:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def test_versionable(self, portal_type, versionable_content_types):
        assert portal_type in versionable_content_types

    def test_create_initial_version_after_adding(self, last_version, content_instance):
        version = last_version(content_instance)
        assert version.comment.default == "Initial version"
        assert version.version_id == 0

    def test_create_version_on_save(
        self, notify_mofified, history, last_version, content_instance
    ):
        content_instance.title = "New Title"
        notify_mofified(content_instance)
        history_data = history(content_instance)
        assert len(history_data) == 2  # Initial + modified version
        version = last_version(content_instance)
        assert version.comment is None
        assert version.version_id == 1
