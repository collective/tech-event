"""Upgrade of the users profile to version 1001: registration without Membrane."""

from plone import api
from Products.GenericSetup.tool import SetupTool

import pytest


PROFILE = "collective.techevent.users:default"
SOURCE = "1000"
DESTINATION = "1001"


class TestUpgrade:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, attendee_factory):
        """Put the site at 1000, with a container and attendees as 1000 left them."""
        self.portal = portal
        self.setup_tool: SetupTool = api.portal.get_tool("portal_setup")
        self.container = attendees_factory(portal, registration_confirmation="manual")
        self.registered = attendee_factory(self.container, email="reg@example.org")
        self.cancelled = attendee_factory(self.container, email="can@example.org")
        with api.env.adopt_roles(["Manager"]):
            api.content.transition(obj=self.registered, transition="confirm")
            api.content.transition(obj=self.cancelled, transition="cancel")
        # 1000 had no Attendees workflow and no registration prefix
        del self.container.workflow_history["attendees_workflow"]
        del self.container.registration_prefix
        # 1000 had no blocks
        self.container.blocks = {}
        self.container.blocks_layout = {"items": []}
        catalog = api.portal.get_tool("portal_catalog")
        catalog.delIndex("attendee_email")
        # 1000 left Attendees out of the navigation
        key = "plone.displayed_types"
        displayed = api.portal.get_registry_record(key)
        api.portal.set_registry_record(
            key, tuple(name for name in displayed if name != "Attendees")
        )
        self.setup_tool.setLastVersionForProfile(PROFILE, SOURCE)

    def _steps(self) -> list[dict]:
        """Return the upgrade steps offered to this destination."""
        steps: list[dict] = []
        for entry in self.setup_tool.listUpgrades(PROFILE):
            steps.extend(entry if isinstance(entry, list) else [entry])
        return [step for step in steps if step["sdest"] == DESTINATION]

    def _upgrade(self):
        with api.env.adopt_roles(["Manager"]):
            for step in self._steps():
                step["step"].doStep(self.setup_tool)

    def test_available(self):
        assert [(s["ssource"], s["sdest"]) for s in self._steps()] == [
            (SOURCE, DESTINATION)
        ]

    def test_container_closed(self):
        self._upgrade()
        assert api.content.get_state(self.container) == "closed"

    def test_prefix_from_event_root(self):
        """The prefix comes from the event root's id: here, the site's."""
        self._upgrade()
        assert self.container.registration_prefix == "PLONE"

    def test_states_kept(self):
        self._upgrade()
        assert api.content.get_state(self.registered) == "registered"
        assert api.content.get_state(self.cancelled) == "cancelled"

    def test_email_index(self):
        self._upgrade()
        brains = api.content.find(attendee_email="reg@example.org", unrestricted=True)
        assert [b.UID for b in brains] == [self.registered.UID()]

    def test_in_navigation(self):
        self._upgrade()
        displayed_types = api.portal.get_registry_record("plone.displayed_types")
        assert "Attendees" in displayed_types
        # The other types stay
        assert "Tech Event" in displayed_types

    def test_registration_page_blocks(self):
        self._upgrade()
        layout = self.container.blocks_layout["items"]
        types = [self.container.blocks[block_id]["@type"] for block_id in layout]
        assert types == ["title", "eventRegistration"]
