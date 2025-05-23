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
