"""The ``@sponsors`` service, over HTTP, and the benefit grouping it uses."""

from collective.techevent.services.sponsors.get import GetSponsors
from dataclasses import dataclass
from dataclasses import field
from plone import api

import pytest
import transaction


@dataclass
class FakeLevel:
    """A sponsorship level with the benefits it grants.

    :param id: The level id.
    :param benefits: The benefit codes and values the level grants.
    """

    id: str
    benefits: list[dict[str, str]] = field(default_factory=list)


@dataclass
class FakeSponsorsDB:
    """A sponsors database holding the benefit definitions.

    :param benefits: The benefit definitions, with id, title and description.
    """

    benefits: list[dict[str, str]] = field(default_factory=list)


def all_items(response: dict) -> list[dict]:
    """Return the sponsor items of every level of a response.

    :param response: The JSON body of ``@sponsors``.
    :returns: The sponsor items, flattened across levels.
    """
    items: list[dict] = []
    for level in response.get("items", []):
        items.extend(level.get("items", []))
    return items


class TestSponsorsGet:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        """Bind the portal of the functional layer.

        :param portal: The Plone site with the demo content.
        """
        self.portal = portal

    def test_public_response_shape(self, api_anon_request):
        """Anonymous users get the levels, each with its sponsors and images.

        :param api_anon_request: Anonymous REST session.
        """
        response = api_anon_request.get("@sponsors")

        assert response.status_code == 200
        body = response.json()
        assert body["@id"].startswith("http")
        assert body["items"], "the demo content has sponsorship levels"
        for level in body["items"]:
            assert {"@id", "id", "title", "items", "has_sponsors"} <= set(level)
            assert level["has_sponsors"] is bool(level["items"])
        assert isinstance(body["benefits"], list)

    def test_only_published_sponsors(self, api_anon_request, api_manager_request):
        """A sponsor that is not published is left out for anonymous users.

        :param api_anon_request: Anonymous REST session.
        :param api_manager_request: Manager REST session.
        """
        before = len(all_items(api_anon_request.get("@sponsors").json()))
        sponsors = api.content.find(
            context=self.portal, portal_type="Sponsor", review_state="published"
        )
        assert sponsors, "the demo content has published sponsors"
        api.content.transition(obj=sponsors[0].getObject(), transition="retract")
        transaction.commit()

        anon_after = len(all_items(api_anon_request.get("@sponsors").json()))
        manager_after = len(all_items(api_manager_request.get("@sponsors").json()))

        assert anon_after == before - 1
        assert manager_after >= anon_after


class TestGetBenefits:
    """Benefit grouping, without HTTP."""

    @pytest.fixture(autouse=True)
    def _setup(self):
        """Build the service; benefit grouping needs no request or site."""
        self.service = GetSponsors()
        self.db = FakeSponsorsDB(
            benefits=[
                {"id": "logo", "title": "Logo", "description": "Logo on the site"},
                {"id": "talk", "title": "Talk", "description": "A talk slot"},
            ]
        )

    def test_values_are_grouped_by_level(self):
        """Each benefit lists the value granted by each level that has it."""
        gold = FakeLevel(id="gold", benefits=[{"code": "logo", "value": "large"}])
        silver = FakeLevel(
            id="silver",
            benefits=[
                {"code": "logo", "value": "small"},
                {"code": "talk", "value": "yes"},
            ],
        )

        result = self.service.get_benefits(self.db, [gold, silver])

        assert result == [
            {
                "id": "logo",
                "title": "Logo",
                "description": "Logo on the site",
                "levels": {"gold": "large", "silver": "small"},
            },
            {
                "id": "talk",
                "title": "Talk",
                "description": "A talk slot",
                "levels": {"silver": "yes"},
            },
        ]

    def test_unknown_benefit_codes_are_ignored(self):
        """A level granting a benefit that is not defined adds nothing."""
        level = FakeLevel(id="bronze", benefits=[{"code": "unknown", "value": "x"}])

        result = self.service.get_benefits(self.db, [level])

        assert [item["levels"] for item in result] == [{}, {}]
