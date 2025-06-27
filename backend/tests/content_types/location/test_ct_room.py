from collective.techevent.content.location.room import Room

import pytest


@pytest.fixture
def portal_type() -> str:
    return "Room"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, container, content_instance):
        self.container = container
        self.content = content_instance

    def test_create(self, content_factory, payloads, portal_type):
        payload = payloads[portal_type][1]
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, Room)

    def test_parent_is_venue(self):
        from Acquisition import aq_parent
        from collective.techevent.content.location.venue import Venue

        content = self.content
        parent = aq_parent(content)
        assert parent.portal_type == "Venue"
        assert isinstance(parent, Venue)

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
