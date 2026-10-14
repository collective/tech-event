"""Upgrade to profile version 1008: the socialmedia social_links column."""

from . import PROFILE
from collective.techevent.upgrades import v1008
from collective.techevent.upgrades.v1008 import SOCIALMEDIA_PROFILE
from Products.GenericSetup.tool import SetupTool

import pytest


SOURCE = "1007"
DESTINATION = "1008"


class TestUpgrade:
    """The step from ``1007`` to ``1008``."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, setup_tool: SetupTool) -> None:
        """Put the site back at the source version, with socialmedia at 1000.

        :param portal: The Plone site.
        :param setup_tool: The ``portal_setup`` tool.
        """
        self.portal = portal
        self.setup_tool = setup_tool
        setup_tool.setLastVersionForProfile(PROFILE, SOURCE)
        setup_tool.setLastVersionForProfile(SOCIALMEDIA_PROFILE, "1000")

    def _steps(self) -> list[dict]:
        """Return the upgrade steps offered from the source version.

        ``listUpgrades`` returns the steps of a grouped ``upgradeSteps`` as a
        list, and a lone step as a bare info.

        :returns: The step infos, flattened.
        """
        steps: list[dict] = []
        for entry in self.setup_tool.listUpgrades(PROFILE):
            steps.extend(entry if isinstance(entry, list) else [entry])
        return steps

    def test_available(self):
        """The site at the source version is offered exactly this step."""
        steps = self._steps()

        assert [(s["ssource"], s["sdest"]) for s in steps] == [(SOURCE, DESTINATION)]

    def test_runs_the_socialmedia_step(self, monkeypatch):
        """Running the step applies the socialmedia 1001 step, once.

        :param monkeypatch: Pytest fixture to record the call.
        """
        calls: list[SetupTool] = []

        def spy(setup_tool: SetupTool) -> None:
            calls.append(setup_tool)

        monkeypatch.setattr(v1008, "add_social_links_column", spy)
        for step in self._steps():
            step["step"].doStep(self.setup_tool)

        assert calls == [self.setup_tool]

    def test_records_the_socialmedia_version(self, profile_last_version):
        """After the step, socialmedia is recorded at its 1001 profile version.

        :param profile_last_version: pytest-plone helper returning a version
            string for a profile.
        """
        for step in self._steps():
            step["step"].doStep(self.setup_tool)

        assert profile_last_version(SOCIALMEDIA_PROFILE) == "1001"

    def test_fills_the_social_links_column(self, content_factory, payloads):
        """The column is there and the links of existing presenters are in it.

        :param content_factory: Factory creating content in a container.
        :param payloads: Content payloads, ordered by type.
        """
        presenter = content_factory(self.portal, payloads["Presenter"][0])
        for step in self._steps():
            step["step"].doStep(self.setup_tool)

        catalog = self.portal.portal_catalog
        assert "social_links" in catalog.schema()
        brains = catalog.unrestrictedSearchResults(UID=presenter.UID())
        assert len(brains[0].social_links) == 2


class TestNothingToDo:
    """The step leaves sites alone when socialmedia is absent or current."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, setup_tool: SetupTool) -> None:
        """Start from the source version of this package.

        :param portal: The Plone site.
        :param setup_tool: The ``portal_setup`` tool.
        """
        self.setup_tool = setup_tool
        setup_tool.setLastVersionForProfile(PROFILE, SOURCE)

    @pytest.mark.parametrize("version", ["1001", "1002"])
    def test_current_socialmedia_is_left_alone(
        self, monkeypatch, profile_last_version, version: str
    ):
        """A socialmedia at or past 1001 is not touched.

        :param monkeypatch: Pytest fixture to record the call.
        :param profile_last_version: pytest-plone helper returning a version
            string for a profile.
        :param version: The socialmedia profile version recorded on the site.
        """
        calls: list[SetupTool] = []
        monkeypatch.setattr(
            v1008, "add_social_links_column", lambda tool: calls.append(tool)
        )
        self.setup_tool.setLastVersionForProfile(SOCIALMEDIA_PROFILE, version)

        v1008.upgrade_social_links(self.setup_tool)

        assert calls == []
        assert profile_last_version(SOCIALMEDIA_PROFILE) == version

    def test_missing_socialmedia_is_left_alone(self, monkeypatch):
        """A site without socialmedia has nothing to upgrade.

        :param monkeypatch: Pytest fixture to make socialmedia look absent.
        """
        calls: list[SetupTool] = []
        monkeypatch.setattr(
            v1008, "add_social_links_column", lambda tool: calls.append(tool)
        )
        monkeypatch.setattr(
            SetupTool,
            "getLastVersionForProfile",
            lambda self, profile_id: "unknown",
        )

        v1008.upgrade_social_links(self.setup_tool)

        assert calls == []
