from collective.techevent.content.schedule.lightning_talks import LightningTalks
from plone import api

import pytest


@pytest.fixture
def portal_type() -> str:
    return "LightningTalks"


@pytest.fixture
def permission() -> str:
    return "collective.techevent: Add Slot"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, container):
        self.container = container

    def test_create(self, content_factory, payload, portal_type):
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, LightningTalks)

    @pytest.mark.parametrize(
        "role,path,expected",
        [
            ["Anonymous", "/", False],
            ["Anonymous", "/schedule", False],
            ["Contributor", "/", False],
            ["Contributor", "/schedule", True],
            ["Manager", "/", False],
            ["Manager", "/schedule", True],
            ["Owner", "/", False],
            ["Owner", "/schedule", True],
            ["Reader", "/", False],
            ["Reader", "/schedule", False],
            ["Site Administrator", "/", False],
            ["Site Administrator", "/schedule", True],
        ],
    )
    def test_create_permission(
        self, roles_permission_on, path, permission, role: str, expected: bool
    ):
        container = api.content.get(path)
        roles = roles_permission_on(permission, container)
        assert (role in roles) is expected

    def test_slot_indexed(self, search_slot_event_dates, portal_type, content_instance):
        results = search_slot_event_dates(portal_type)
        assert len(results) > 0
        uids = [brain.UID for brain in results]
        assert content_instance.UID() in uids


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
