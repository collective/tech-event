from collective.techevent.content.schedule.talk import Talk
from plone import api
from plone.app.testing import TEST_USER_ID
from z3c.relationfield import RelationValue
from zope.component import getUtility
from zope.intid.interfaces import IIntIds

import pytest


@pytest.fixture
def portal_type() -> str:
    return "Talk"


@pytest.fixture
def test_user(portal):
    return portal.acl_users.getUserById(TEST_USER_ID)


@pytest.fixture
def intids():
    return getUtility(IIntIds)


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, container):
        self.container = container

    def test_create(self, content_factory, payload, portal_type):
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, Talk)

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

    @pytest.mark.parametrize(
        "key,value,expected",
        [
            ["session_audience", "developers", True],
            ["session_track", "main", True],
            ["session_level", "general", True],
            ["session_language", "en", True],
        ],
    )
    def test_indexer_session(
        self, catalog, content_instance, key: str, value: str, expected: bool
    ):
        query = {"UID": content_instance.UID(), key: value}
        brains = catalog(**query)
        assert (len(brains) == 1) is expected


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


@pytest.fixture
def setup_talk_and_presenter(
    portal,
    container,
    intids,
    content_factory,
    payloads,
    portal_type,
):
    def _setup(enable_roles=False, enable_presenter_roles=None):
        if enable_roles and enable_presenter_roles:
            enable_presenter_roles(portal, portal_type)

        talk = content_factory(container, payloads[portal_type][0])
        talk.__ac_local_roles__ = {}
        talk.__ac_local_roles_block__ = True

        presenter = content_factory(portal, payloads["Presenter"][0])
        presenter.__ac_local_roles_block__ = True

        talk.presenters = [RelationValue(intids.getId(presenter))]

        return talk, presenter

    return _setup


class TestPresenterRolesDisabled:
    @pytest.fixture(autouse=True)
    def _setup(self, setup_talk_and_presenter):
        self.talk, self.presenter = setup_talk_and_presenter()

    def test_talk_without_presenter_roles(
        self,
        portal,
        test_user,
    ):
        talk_roles = portal.acl_users._getAllLocalRoles(self.talk)
        presenter_roles = portal.acl_users._getAllLocalRoles(self.presenter)

        assert talk_roles == {}
        assert presenter_roles != {}
        assert talk_roles != presenter_roles
        assert "Owner" not in test_user.getRolesInContext(self.talk)


class TestPresenterRolesEnabled:
    @pytest.fixture(autouse=True)
    def _setup(self, setup_talk_and_presenter, enable_presenter_roles):
        self.talk, self.presenter = setup_talk_and_presenter(
            enable_roles=True, enable_presenter_roles=enable_presenter_roles
        )

    def test_talk_with_presenter_roles(
        self,
        portal,
        test_user,
    ):
        talk_roles = portal.acl_users._getAllLocalRoles(self.talk)
        presenter_roles = portal.acl_users._getAllLocalRoles(self.presenter)

        assert talk_roles != {}
        assert presenter_roles != {}
        assert talk_roles == presenter_roles
        assert "Owner" in test_user.getRolesInContext(self.talk)
