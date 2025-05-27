import pytest


class TestSerializer:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    @pytest.mark.parametrize(
        "portal_type,attribute",
        [
            ["Sponsor", "level"],
            ["Sponsor", "image_field"],
            ["Sponsor", "image_scales"],
            ["Sponsor", "social_links"],
            ["Presenter", "image_field"],
            ["Presenter", "image_scales"],
            ["Presenter", "social_links"],
            ["Talk", "image_field"],
            ["Talk", "image_scales"],
            ["Talk", "presenters"],
            ["Talk", "room"],
            ["Talk", "session_track"],
            ["Talk", "session_level"],
            ["Talk", "session_audience"],
            ["Talk", "session_language"],
        ],
    )
    def test_serialization_includes_attribute(
        self, catalog, serializer, portal_type: str, attribute: str
    ):
        brains = catalog(portal_type=portal_type)
        brain = brains[0]
        assert brain.portal_type == portal_type
        result = serializer(brain, summary=True)()
        assert attribute in result
