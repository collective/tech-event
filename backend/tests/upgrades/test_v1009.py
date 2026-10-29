"""Upgrade to profile version 1009: permissions on existing Tech Events."""

from . import PROFILE
from AccessControl.PermissionRole import rolesForPermissionOn
from collective.techevent.subscribers.settings import SUPPORT_MULTIPLE_EVENTS
from collective.techevent.utils import DEFAULT_ROLES
from plone import api
from Products.GenericSetup.tool import SetupTool

import pytest


SOURCE = "1008"
DESTINATION = "1009"

PERMISSIONS = [
    "collective.techevent: Add Presenter",
    "collective.techevent: Add Venue",
    "collective.techevent: Add SponsorsDB",
]


class TestUpgrade:
    """The step from ``1008`` to ``1009``."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, setup_tool: SetupTool, content_factory):
        """Put the site at the source version, with a Tech Event lacking permissions.

        :param portal: The Plone site.
        :param setup_tool: The ``portal_setup`` tool.
        :param content_factory: Factory creating content in a container.
        """
        self.portal = portal
        self.setup_tool = setup_tool
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, True)
        self.tech_event = content_factory(
            portal, {"type": "Tech Event", "id": "edition", "title": "Edition"}
        )
        # A Tech Event created before 1009, where nobody can add this content
        for permission_id in PERMISSIONS:
            self.tech_event.manage_permission(permission_id, roles=[], acquire=False)
        setup_tool.setLastVersionForProfile(PROFILE, SOURCE)
        yield
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, False)

    def _steps(self) -> list[dict]:
        """Return the upgrade steps offered from the source version.

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

    @pytest.mark.parametrize("permission_id", PERMISSIONS)
    def test_grants_permissions(self, permission_id: str):
        """After the step, the Tech Event grants the add permissions.

        :param permission_id: The add permission under test.
        """
        assert rolesForPermissionOn(permission_id, self.tech_event) == ()
        for step in self._steps():
            step["step"].doStep(self.setup_tool)

        roles = rolesForPermissionOn(permission_id, self.tech_event)
        assert set(roles) == set(DEFAULT_ROLES)
