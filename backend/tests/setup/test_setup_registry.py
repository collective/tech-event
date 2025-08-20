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
        value: list[str] = api.portal.get_registry_record("plone.displayed_types")
        assert (item in value) is expected

    @pytest.mark.parametrize(
        "field_name,key,expected",
        [
            ("slot_room", "title", "Room"),
            ("slot_room", "description", "Room for a slot."),
            ("slot_room", "enabled", True),
            ("slot_room", "sortable", False),
            (
                "slot_room",
                "operations",
                [
                    "plone.app.querystring.operation.selection.any",
                    "plone.app.querystring.operation.selection.all",
                ],
            ),
            ("slot_room", "vocabulary", "collective.techevent.vocabularies.slot_rooms"),
            ("slot_room", "group", "Event Schedule"),
            ("session_level", "title", "Level"),
            ("session_level", "description", "Session Level."),
            ("session_level", "enabled", True),
            ("session_level", "sortable", False),
            (
                "session_level",
                "operations",
                [
                    "plone.app.querystring.operation.selection.any",
                    "plone.app.querystring.operation.selection.all",
                ],
            ),
            (
                "session_level",
                "vocabulary",
                "collective.techevent.vocabularies.session_levels",
            ),
            ("session_level", "group", "Event Schedule"),
            ("session_audience", "title", "Audience"),
            ("session_audience", "description", "Target Audience."),
            ("session_audience", "enabled", True),
            ("session_audience", "sortable", False),
            (
                "session_audience",
                "operations",
                [
                    "plone.app.querystring.operation.selection.any",
                    "plone.app.querystring.operation.selection.all",
                ],
            ),
            (
                "session_audience",
                "vocabulary",
                "collective.techevent.vocabularies.session_audiences",
            ),
            ("session_audience", "group", "Event Schedule"),
            ("session_track", "title", "Track"),
            ("session_track", "description", "Session Track."),
            ("session_track", "enabled", True),
            ("session_track", "sortable", False),
            (
                "session_track",
                "operations",
                [
                    "plone.app.querystring.operation.selection.any",
                    "plone.app.querystring.operation.selection.all",
                ],
            ),
            (
                "session_track",
                "vocabulary",
                "collective.techevent.vocabularies.session_tracks",
            ),
            ("session_track", "group", "Event Schedule"),
            ("session_language", "title", "Language"),
            ("session_language", "description", "Session Language."),
            ("session_language", "enabled", True),
            ("session_language", "sortable", False),
            (
                "session_language",
                "operations",
                [
                    "plone.app.querystring.operation.selection.any",
                    "plone.app.querystring.operation.selection.all",
                ],
            ),
            (
                "session_language",
                "vocabulary",
                "plone.app.vocabularies.SupportedContentLanguages",
            ),
            ("session_language", "group", "Event Schedule"),
            ("presenter_categories", "title", "Category"),
            ("presenter_categories", "description", "Presenter Category."),
            ("presenter_categories", "enabled", True),
            ("presenter_categories", "sortable", False),
            (
                "presenter_categories",
                "operations",
                [
                    "plone.app.querystring.operation.selection.any",
                    "plone.app.querystring.operation.selection.all",
                ],
            ),
            (
                "presenter_categories",
                "vocabulary",
                "collective.techevent.vocabularies.presenter_labels",
            ),
            ("presenter_categories", "group", "Event Presenters"),
        ],
    )
    def test_plone_qs_field(self, field_name: str, key: str, expected):
        reg_key = f"plone.app.querystring.field.{field_name}.{key}"
        value = api.portal.get_registry_record(reg_key)
        assert value == expected
