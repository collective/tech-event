"""Upgrade to profile version 1007: reindex schedule, presenter and dates."""

from . import PROFILE
from collective.techevent.upgrades import v1007
from datetime import datetime
from plone import api
from Products.CMFCore.CMFCatalogAware import CMFCatalogAware
from Products.GenericSetup.tool import SetupTool

import pytest


SOURCE = "1006"
DESTINATION = "1007"


@pytest.fixture
def reindex_calls(monkeypatch) -> list[tuple[str, list[str] | None]]:
    """Record every reindexObject call of catalog-aware content, class-wide.

    :param monkeypatch: Pytest fixture to replace the method for the test.
    :returns: The list of (object id, indexes) pairs, filled by the calls.
    """
    calls: list[tuple[str, list[str] | None]] = []
    original = CMFCatalogAware.reindexObject

    def spy(self, idxs=None, **kw):
        calls.append((self.getId(), list(idxs) if idxs else None))
        return original(self, idxs, **kw)

    monkeypatch.setattr(CMFCatalogAware, "reindexObject", spy)
    return calls


class TestAvailable:
    def test_offered_from_the_source_version(self, demo_portal, setup_tool: SetupTool):
        """The site at the source version is offered this step.

        :param demo_portal: The site with the demo content.
        :param setup_tool: The ``portal_setup`` tool.
        """
        setup_tool.setLastVersionForProfile(PROFILE, SOURCE)
        steps: list[dict] = []
        for entry in setup_tool.listUpgrades(PROFILE):
            steps.extend(entry if isinstance(entry, list) else [entry])

        assert (SOURCE, DESTINATION) in [(s["ssource"], s["sdest"]) for s in steps]


class TestReindexSchedule:
    def test_talks_are_reindexed_with_schedule_indexes(
        self, demo_portal, setup_tool, reindex_calls
    ):
        """Each Talk is reindexed with the schedule indexes, and only those.

        :param demo_portal: The site with the demo content.
        :param setup_tool: The ``portal_setup`` tool.
        :param reindex_calls: Records reindex calls.
        """
        talks = api.content.find(portal_type="Talk")
        assert talks, "the demo content has talks"

        v1007.reindex_schedule_objects(setup_tool)

        expected = {
            "slot_room",
            "session_level",
            "session_audience",
            "session_track",
            "session_language",
        }
        indexed = [
            (oid, idxs) for oid, idxs in reindex_calls if idxs and set(idxs) == expected
        ]
        assert len(indexed) >= len(talks)


class TestReindexPresenters:
    def test_presenters_are_reindexed_with_categories(
        self, demo_portal, setup_tool, reindex_calls
    ):
        """Each Presenter is reindexed with its categories index.

        :param demo_portal: The site with the demo content.
        :param setup_tool: The ``portal_setup`` tool.
        :param reindex_calls: Records reindex calls.
        """
        presenters = api.content.find(portal_type="Presenter")
        assert presenters, "the demo content has presenters"

        v1007.reindex_presenter_objects(setup_tool)

        indexed = [
            oid for oid, idxs in reindex_calls if idxs == ["presenter_categories"]
        ]
        assert len(indexed) == len(presenters)


class TestStartEndDates:
    def test_naive_dates_become_timezone_aware(
        self, demo_portal, setup_tool, reindex_calls
    ):
        """A start stored without a timezone is made aware in the portal timezone.

        :param demo_portal: The site with the demo content.
        :param setup_tool: The ``portal_setup`` tool.
        :param reindex_calls: Records reindex calls.
        """
        brain = api.content.find(portal_type="Talk")[0]
        with api.env.adopt_roles(["Manager"]):
            obj = brain.getObject()
            obj.start = datetime(2025, 8, 1, 15, 0)
            obj.end = datetime(2025, 8, 1, 16, 0)

        v1007.reindex_start_end_dates(setup_tool)

        assert obj.start.tzinfo is not None
        assert obj.end.tzinfo is not None

    def test_objects_without_dates_are_skipped(
        self, demo_portal, setup_tool, reindex_calls
    ):
        """An object with no start is reindexed without changing the dates.

        :param demo_portal: The site with the demo content.
        :param setup_tool: The ``portal_setup`` tool.
        :param reindex_calls: Records reindex calls.
        """
        brain = api.content.find(portal_type="Talk")[0]
        with api.env.adopt_roles(["Manager"]):
            obj = brain.getObject()
            obj.start = None
            obj.end = None

        v1007.reindex_start_end_dates(setup_tool)

        assert obj.start is None and obj.end is None
