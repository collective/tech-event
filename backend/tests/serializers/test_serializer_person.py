import pytest


class TestSerializer:
    portal_type: str = "Presenter"

    @pytest.fixture(autouse=True)
    def _setup(self, portal, catalog):
        self.portal = portal
        brains = catalog(portal_type=self.portal_type)
        brain = brains[0]
        self.content = brain.getObject()

    @pytest.mark.parametrize(
        "summary,attribute",
        [
            [True, "labels"],
            [True, "social_links"],
            [False, "labels"],
            [False, "activities"],
        ],
    )
    def test_serialization_includes_attribute(
        self, serializer, summary: bool, attribute: str
    ):
        result = serializer(self.content, summary=summary)()
        assert attribute in result
