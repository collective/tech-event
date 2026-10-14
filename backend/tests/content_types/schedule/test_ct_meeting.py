"""Content type tests for Meeting, a slot of the schedule."""

from collective.techevent.content.schedule.slots.meeting import Meeting
from dateutil.parser import parse

import pytest


@pytest.fixture
def portal_type() -> str:
    """Return the portal type under test.

    :returns: The portal type id.
    """
    return "Meeting"


@pytest.fixture
def payload(portal_type: str) -> dict:
    """Return a creation payload for a Meeting inside the schedule.

    :param portal_type: The portal type under test.
    :returns: Keyword arguments for ``plone.api.content.create``.
    """
    return {
        "type": portal_type,
        "id": "meeting-01",
        "title": "Community Meeting",
        "description": "Meeting for the community",
        "start": parse("2025-08-01T15:00:00+00:00"),
        "end": parse("2025-08-01T16:00:00+00:00"),
    }


@pytest.fixture
def permission() -> str:
    """Return the permission needed to add a slot.

    :returns: The permission title.
    """
    return "collective.techevent: Add Slot"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, container) -> None:
        """Bind the schedule container.

        :param container: The schedule the meeting is added to.
        """
        self.container = container

    def test_create(self, content_factory, payload, portal_type: str):
        """A Meeting is created with its own class.

        :param content_factory: Factory creating content in a container.
        :param payload: Creation payload.
        :param portal_type: The portal type under test.
        """
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, Meeting)

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
        self, roles_permission_on, path, permission: str, role: str, expected: bool
    ):
        """Only the roles that may add a slot can add a Meeting, and only in a schedule.

        :param roles_permission_on: Helper returning the roles for a permission.
        :param path: Path of the container.
        :param permission: The add permission.
        :param role: The role under test.
        :param expected: Whether the role may add a Meeting there.
        """
        from plone import api

        container = api.content.get(path)
        roles = roles_permission_on(permission, container)
        assert (role in roles) is expected

    def test_slot_indexed(self, search_slot_event_dates, portal_type, content_instance):
        """A created Meeting is found by the slot dates search.

        :param search_slot_event_dates: Helper searching the catalog by dates.
        :param portal_type: The portal type under test.
        :param content_instance: The Meeting created for the test.
        """
        results = search_slot_event_dates(portal_type)
        assert len(results) > 0
        uids = [brain.UID for brain in results]
        assert content_instance.UID() in uids


class TestVersioning:
    @pytest.fixture(autouse=True)
    def _setup(self, portal) -> None:
        """Bind the portal.

        :param portal: The Plone site.
        """
        self.portal = portal

    def test_versionable(self, portal_type: str, versionable_content_types):
        """The type is registered in portal_repository.

        :param portal_type: The portal type under test.
        :param versionable_content_types: Types versioning is enabled for.
        """
        assert portal_type in versionable_content_types

    def test_create_initial_version_after_adding(self, last_version, content_instance):
        """Adding the content creates version 0.

        :param last_version: Helper returning the latest stored version.
        :param content_instance: The Meeting created for the test.
        """
        version = last_version(content_instance)
        assert version.comment.default == "Initial version"
        assert version.version_id == 0

    def test_create_version_on_save(
        self, notify_mofified, history, last_version, content_instance
    ):
        """Modifying the content creates a new version.

        :param notify_mofified: Helper firing an object modified event.
        :param history: Helper returning the version history.
        :param last_version: Helper returning the latest stored version.
        :param content_instance: The Meeting created for the test.
        """
        content_instance.title = "New Title"
        notify_mofified(content_instance)
        history_data = history(content_instance)
        assert len(history_data) == 2  # Initial + modified version
        version = last_version(content_instance)
        assert version.comment is None
        assert version.version_id == 1
