"""Content type tests for Tech Event, the container of one edition.

The type is only addable when ``support_multiple_events`` is on. The fixture
turns the setting on through the registry, the same path the control panel
uses, and turns it off again afterwards.
"""

from collective.techevent.content.tech_event import TechEvent
from collective.techevent.subscribers.settings import SUPPORT_MULTIPLE_EVENTS
from collective.techevent.utils import DEFAULT_ROLES
from plone import api
from z3c.relationfield import RelationValue
from zope.component import getUtility
from zope.intid.interfaces import IIntIds

import pytest


@pytest.fixture
def portal_type() -> str:
    """Return the portal type under test.

    :returns: The portal type id.
    """
    return "Tech Event"


@pytest.fixture
def payload(portal_type: str) -> dict:
    """Return a creation payload for a Tech Event.

    :param portal_type: The portal type under test.
    :returns: Keyword arguments for ``plone.api.content.create``.
    """
    return {
        "type": portal_type,
        "id": "tech-event-2026",
        "title": "Tech Event 2026",
        "description": "An edition of the conference",
    }


@pytest.fixture
def permission() -> str:
    """Return the permission needed to add a Tech Event.

    :returns: The permission title.
    """
    return "collective.techevent: Add Tech Event"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        """Turn multiple events on for the test, and off afterwards.

        :param portal: The Plone site.
        """
        self.portal = portal
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, True)
        yield
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, False)

    def test_create(self, content_factory, payload, portal_type: str):
        """A Tech Event is created in the portal with its own class.

        :param content_factory: Factory creating content in a container.
        :param payload: Creation payload.
        :param portal_type: The portal type under test.
        """
        content = content_factory(self.portal, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, TechEvent)

    def test_addable_in_portal(self, portal_type: str):
        """The enabled setting makes the type addable in the portal.

        :param portal_type: The portal type under test.
        """
        with api.env.adopt_roles(["Manager"]):
            allowed = [fti.getId() for fti in self.portal.allowedContentTypes()]
        assert portal_type in allowed

    @pytest.mark.parametrize(
        "role,expected",
        [
            ["Manager", True],
            ["Site Administrator", True],
            ["Anonymous", False],
            ["Reader", False],
        ],
    )
    def test_create_permission(
        self, roles_permission_on, permission: str, role: str, expected: bool
    ):
        """Only the roles granted the Add Tech Event permission may add one.

        :param roles_permission_on: Helper returning the roles for a permission.
        :param permission: The add permission.
        :param role: The role under test.
        :param expected: Whether the role may add a Tech Event there.
        """
        roles = roles_permission_on(permission, self.portal)
        assert (role in roles) is expected

    @pytest.mark.parametrize("child_type", ["Presenter", "Venue"])
    def test_add_inside(self, content_factory, payload, payloads, child_type: str):
        """Presenters and Venues can be added inside a new Tech Event.

        :param content_factory: Factory creating content in a container.
        :param payload: Creation payload.
        :param payloads: Creation payloads by portal type.
        :param child_type: The portal type added inside the Tech Event.
        """
        content = content_factory(self.portal, payload)
        item = content_factory(content, payloads[child_type][0])
        assert item.portal_type == child_type
        assert item.getId() in content.objectIds()

    @pytest.mark.parametrize(
        "permission_id",
        [
            "collective.techevent: Add Presenter",
            "collective.techevent: Add Venue",
            "collective.techevent: Add SponsorsDB",
        ],
    )
    def test_existing_get_permissions(
        self, content_factory, payload, roles_permission_on, permission_id: str
    ):
        """Enabling multiple events grants the permissions on existing events.

        :param content_factory: Factory creating content in a container.
        :param payload: Creation payload.
        :param roles_permission_on: Helper returning the roles for a permission.
        :param permission_id: The add permission under test.
        """
        content = content_factory(self.portal, payload)
        # A Tech Event created before the permissions were granted on it
        content.manage_permission(permission_id, roles=[], acquire=True)
        assert roles_permission_on(permission_id, content) == ()
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, False)
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, True)
        roles = roles_permission_on(permission_id, content)
        assert set(roles) == set(DEFAULT_ROLES)

    def test_delete_with_sessions_and_presenters(
        self, content_factory, payload, payloads
    ):
        """A Tech Event holding sessions with presenters can be deleted.

        :param content_factory: Factory creating content in a container.
        :param payload: Creation payload.
        :param payloads: Creation payloads by portal type.
        """
        content = content_factory(self.portal, payload)
        presenter = content_factory(content, payloads["Presenter"][0])
        schedule = content_factory(content, payloads["Schedule"][0])
        talk_payload = {
            **payloads["Talk"][0],
            "presenters": [RelationValue(getUtility(IIntIds).getId(presenter))],
        }
        talk = content_factory(schedule, talk_payload)
        assert talk.presenters[0].to_object == presenter
        with api.env.adopt_roles(["Manager"]):
            api.content.delete(content, check_linkintegrity=False)
        assert payload["id"] not in self.portal.objectIds()


class TestVersioning:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        """Bind the portal, and enable multiple events for the content.

        :param portal: The Plone site.
        """
        self.portal = portal
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, True)
        yield
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, False)

    def test_versionable(self, portal_type: str, versionable_content_types):
        """The type is registered in portal_repository.

        :param portal_type: The portal type under test.
        :param versionable_content_types: Types versioning is enabled for.
        """
        assert portal_type in versionable_content_types

    def test_create_initial_version_after_adding(self, last_version, content_instance):
        """Adding the content creates version 0.

        :param last_version: Helper returning the latest stored version.
        :param content_instance: The Tech Event created for the test.
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
        :param content_instance: The Tech Event created for the test.
        """
        content_instance.title = "New Title"
        notify_mofified(content_instance)
        history_data = history(content_instance)
        assert len(history_data) == 2  # Initial + modified version
        version = last_version(content_instance)
        assert version.comment is None
        assert version.version_id == 1
