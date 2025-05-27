from plone import api

import pytest


@pytest.fixture(scope="class")
def portal(portal_class):
    yield portal_class


class TestRegistryValues:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    @pytest.mark.parametrize(
        "item,expected",
        [
            ("Break", False),
            ("Keynote", False),
            ("LightningTalks", False),
            ("Meeting", False),
            ("OpenSpace", False),
            ("Presenter", False),
            ("Room", False),
            ("Schedule", True),
            ("Slot", False),
            ("Sponsor", False),
            ("SponsorLevel", True),
            ("SponsorsDB", True),
            ("Talk", False),
            ("Tech Event", True),
            ("Training", False),
            ("Venue", True),
        ],
    )
    def test_plone_displayed_types(self, item: str, expected: bool):
        value = api.portal.get_registry_record("plone.displayed_types")
        assert (item in value) is expected
