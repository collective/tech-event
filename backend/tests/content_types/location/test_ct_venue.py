from collective.techevent.content.location.venue import Venue
from plone.dexterity.content import DexterityContent

import pytest


@pytest.fixture
def container(portal) -> DexterityContent:
    return portal


@pytest.fixture
def portal_type() -> str:
    return "Venue"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.container = portal

    def test_create(self, content_factory, payload, portal_type):
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, Venue)

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
