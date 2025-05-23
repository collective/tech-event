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
