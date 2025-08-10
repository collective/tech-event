from collective.techevent.users.content.attendees import Attendees

import pytest


@pytest.fixture
def portal_type() -> str:
    return "Attendees"


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def test_exists(self, portal_type):
        content = self.portal.get("attendees")
        assert content.portal_type == portal_type
        assert isinstance(content, Attendees)
