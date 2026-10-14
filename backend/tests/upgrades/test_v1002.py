"""Upgrade to profile version 1002: the Schedule and Venue displayed types."""

from . import PROFILE
from plone import api
from Products.GenericSetup.tool import SetupTool

import pytest


SOURCE = "1001"
DESTINATION = "1002"
KEY = "plone.displayed_types"


class TestUpgrade:
    """The step from ``1001`` to ``1002``."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, setup_tool: SetupTool) -> None:
        """Start at the source version.

        :param portal: The Plone site.
        :param setup_tool: The ``portal_setup`` tool.
        """
        self.setup_tool = setup_tool
        setup_tool.setLastVersionForProfile(PROFILE, SOURCE)

    def _steps(self) -> list[dict]:
        """Return the steps offered from the source version.

        :returns: The step infos, flattened.
        """
        steps: list[dict] = []
        for entry in self.setup_tool.listUpgrades(PROFILE):
            steps.extend(entry if isinstance(entry, list) else [entry])
        return steps

    def _run(self) -> None:
        """Run the step from the source version."""
        for step in self._steps():
            if (step["ssource"], step["sdest"]) == (SOURCE, DESTINATION):
                step["step"].doStep(self.setup_tool)

    def test_available(self):
        """The site at the source version is offered this step."""
        assert (SOURCE, DESTINATION) in [
            (s["ssource"], s["sdest"]) for s in self._steps()
        ]

    def test_adds_schedule_and_venue(self):
        """Schedule and Venue are in the displayed types after the step."""
        self._run()

        assert {"Schedule", "Venue"} <= set(api.portal.get_registry_record(KEY))

    def test_keeps_the_entries_already_there(self):
        """The displayed types that were there before are still there."""
        before = set(api.portal.get_registry_record(KEY))

        self._run()

        assert before <= set(api.portal.get_registry_record(KEY))

    def test_no_duplicates(self):
        """Running the step over its own result does not repeat an entry."""
        self._run()
        self._run()

        displayed = list(api.portal.get_registry_record(KEY))
        assert len(displayed) == len(set(displayed))
