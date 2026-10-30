"""Attendee registration with multiple events: one container per Tech Event."""

from AccessControl.PermissionRole import rolesForPermissionOn
from collective.techevent.subscribers.settings import SUPPORT_MULTIPLE_EVENTS
from collective.techevent.users import registration
from collective.techevent.users.utils import find_attendees_container
from collective.techevent.utils import DEFAULT_ROLES
from plone import api
from plone.app.testing import login
from plone.app.testing import logout

import pytest


PERMISSION = "collective.techevent: Add Attendees Database"


class TestMultipleEvents:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, content_factory, attendees_factory, member_factory):
        self.portal = portal
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, True)
        self.first = content_factory(
            portal, {"type": "Tech Event", "id": "first", "title": "First"}
        )
        self.second = content_factory(
            portal, {"type": "Tech Event", "id": "second", "title": "Second"}
        )
        self.attendees_factory = attendees_factory
        member_factory("ada", "ada@example.org")
        yield
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, False)

    def test_portal_cannot_add(self):
        assert rolesForPermissionOn(PERMISSION, self.portal) == ()

    def test_tech_event_can_add(self):
        roles = rolesForPermissionOn(PERMISSION, self.first)
        assert set(roles) == set(DEFAULT_ROLES)

    def test_one_per_tech_event(self):
        self.attendees_factory(self.first)
        assert rolesForPermissionOn(PERMISSION, self.first) == ()
        assert set(rolesForPermissionOn(PERMISSION, self.second)) == set(DEFAULT_ROLES)

    def test_container_per_event(self):
        first = self.attendees_factory(self.first, registration_prefix="FIRST")
        assert find_attendees_container(self.first).UID() == first.UID()
        assert find_attendees_container(self.second) is None

    def test_registration_in_its_event(self):
        """The same member registers in each event, with each event's prefix."""
        first = self.attendees_factory(self.first, registration_prefix="FIRST")
        second = self.attendees_factory(self.second, registration_prefix="SECOND")
        login(self.portal, "ada")
        one = registration.register(first, {})
        two = registration.register(second, {})
        logout()
        assert one.getId().startswith("FIRST-")
        assert two.getId().startswith("SECOND-")
        assert one.__parent__.UID() == first.UID()
        assert two.__parent__.UID() == second.UID()
