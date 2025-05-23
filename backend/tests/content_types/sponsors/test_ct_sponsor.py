from Acquisition import aq_parent
from collective.techevent.content.sponsors.sponsor import Sponsor

import pytest


@pytest.fixture
def container(container_level):
    return container_level


@pytest.fixture
def portal_type() -> str:
    return "Sponsor"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, container):
        self.container = container

    def test_create(self, content_factory, payload, portal_type):
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, Sponsor)

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

    def test_sponsor_level_indexed(self, catalog, portal_type, content_instance):
        level = aq_parent(content_instance).id
        query = {"portal_type": portal_type, "level": level}
        results = catalog(**query)
        assert len(results) > 0
        uids = [brain.UID for brain in results]
        assert content_instance.UID() in uids
