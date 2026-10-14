"""Upgrade to profile version 1003, and the permissions helper of v1006."""

from . import PROFILE
from AccessControl.PermissionRole import rolesForPermissionOn
from collective.techevent.upgrades import permissions as permissions_v1006
from collective.techevent.upgrades import v1003
from collective.techevent.utils.permissions import modify_schedule_permissions
from Products.GenericSetup.tool import SetupTool

import pytest


SOURCE = "1002"
DESTINATION = "1003"
PERMISSION = "collective.techevent: Add Slot"


def schedule_of(portal):
    """Return the demo Schedule, after clearing its Add Slot permission.

    :param portal: The Plone site with the demo content.
    :returns: The Schedule object.
    """
    schedule = portal["schedule"]
    schedule.manage_permission(PERMISSION, roles=[], acquire=False)
    return schedule


class TestUpgrade:
    """The step from ``1002`` to ``1003``."""

    @pytest.fixture(autouse=True)
    def _setup(self, demo_portal, setup_tool: SetupTool) -> None:
        """Start at the source version.

        :param demo_portal: The site with the demo content.
        :param setup_tool: The ``portal_setup`` tool.
        """
        self.portal = demo_portal
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

    def test_available(self):
        """The site at the source version is offered this step."""
        assert (SOURCE, DESTINATION) in [
            (s["ssource"], s["sdest"]) for s in self._steps()
        ]

    def test_restores_schedule_permissions(self):
        """Running the step gives the schedule its Add Slot roles back."""
        schedule = schedule_of(self.portal)
        assert "Contributor" not in rolesForPermissionOn(PERMISSION, schedule)

        v1003.update_schedule_permissions(self.setup_tool)

        assert "Contributor" in rolesForPermissionOn(PERMISSION, schedule)

    def test_every_schedule_is_visited(self, monkeypatch):
        """Each Schedule found is passed to the permission helper.

        :param monkeypatch: Pytest fixture to record the calls.
        """
        calls: list[str] = []
        monkeypatch.setattr(
            v1003,
            "modify_schedule_permissions",
            lambda obj: calls.append(obj.getId()),
        )

        v1003.update_schedule_permissions(self.setup_tool)

        assert calls == ["schedule"]


class TestPermissionsHelper:
    """The helper used by the v1006 upgrade reapplies the same permissions."""

    def test_v1006_helper_restores_permissions(self, demo_portal, setup_tool):
        """The helper of the permissions module restores the Add Slot roles.

        :param demo_portal: The site with the demo content.
        :param setup_tool: The ``portal_setup`` tool.
        """
        schedule = schedule_of(demo_portal)

        permissions_v1006.update_schedule_permissions(setup_tool)

        assert "Contributor" in rolesForPermissionOn(PERMISSION, schedule)
        assert (
            permissions_v1006.modify_schedule_permissions is modify_schedule_permissions
        )

    def test_helper_sets_the_four_add_permissions(self, demo_portal):
        """The helper sets the roles on each add permission of the schedule.

        :param demo_portal: The site with the demo content.
        """
        schedule = demo_portal["schedule"]

        modify_schedule_permissions(schedule)

        for permission in (
            "collective.techevent: Add Training",
            "collective.techevent: Add Slot",
            "collective.techevent: Add Talk",
            "collective.techevent: Add Keynote",
        ):
            assert "Owner" in rolesForPermissionOn(permission, schedule)
