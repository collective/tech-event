import pytest


class TestSerializer:
    portal_type: str = "Talk"

    @pytest.fixture(autouse=True)
    def _setup(self, portal, catalog):
        self.portal = portal
        brains = catalog(portal_type=self.portal_type)
        brain = brains[0]
        self.content = brain.getObject()

    @pytest.mark.parametrize(
        "summary,attribute",
        [
            [True, "portal_type"],
            [True, "room"],
            [True, "session_audience"],
            [True, "session_level"],
            [True, "session_language"],
            [True, "session_track"],
        ],
    )
    def test_serialization_includes_attribute(
        self, serializer, summary: bool, attribute: str
    ):
        result = serializer(self.content, summary=summary)()
        assert attribute in result

    @pytest.mark.parametrize(
        "attribute",
        [
            "portal_type",
            "room",
            "session_audience",
            "session_level",
            "session_language",
            "session_track",
        ],
    )
    def test_vocabulary_serialization(self, serializer, attribute: str):
        result = serializer(self.content, summary=True)()[attribute]
        assert isinstance(result, list)
        if value := (result[0] if result else None):
            assert isinstance(value, dict)
            assert "token" in value
            assert "title" in value
