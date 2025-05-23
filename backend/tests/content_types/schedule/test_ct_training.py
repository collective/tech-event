from collective.techevent.content.schedule.training import Training

import pytest


@pytest.fixture
def portal_type() -> str:
    return "Training"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, container):
        self.container = container

    def test_create(self, content_factory, payload, portal_type):
        content = content_factory(self.container, payload)
        assert content.portal_type == portal_type
        assert isinstance(content, Training)

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

    def test_slot_indexed(self, search_slot_event_dates, portal_type, content_instance):
        results = search_slot_event_dates(portal_type)
        assert len(results) > 0
        uids = [brain.UID for brain in results]
        assert content_instance.UID() in uids
