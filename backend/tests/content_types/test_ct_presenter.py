from collective.techevent.content.presenter import Presenter

import pytest


@pytest.fixture
def portal_type() -> str:
    return "Presenter"


@pytest.fixture
def payload(payloads, portal_type) -> dict:
    return payloads[portal_type][0]


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.container = portal

    def test_create(self, content_factory, payload, portal_type):
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, Presenter)

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

    def test_social_links(self, content_instance):
        links = content_instance.social_links
        assert isinstance(links, list)
        assert len(links) == 2

    def test_social_links_metadata(self, brain_for_content, content_instance):
        brain = brain_for_content(content_instance)
        links = brain.social_links
        assert isinstance(links, list)
        assert len(links) == 2

    @pytest.mark.parametrize(
        "category,expected",
        [
            ["keynote-speaker", True],
            ["instructor", True],
            ["foobar", False],
        ],
    )
    def test_indexer_categories(
        self, catalog, content_instance, category: str, expected: bool
    ):
        query = {"UID": content_instance.UID(), "presenter_categories": category}
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
