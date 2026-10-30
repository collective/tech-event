"""The Attendees container: settings, workflow, deadline, one per event root."""

from AccessControl.PermissionRole import rolesForPermissionOn
from collective.techevent.users.content.attendees import Attendees
from collective.techevent.users.content.attendees import IAttendees
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from datetime import UTC
from plone import api
from plone.dexterity.fti import DexterityFTI
from plone.dexterity.interfaces import IDexterityFTI
from zope.component import queryUtility
from zope.interface import Invalid

import pytest


PERMISSION = "collective.techevent: Add Attendees Database"


class TestFTI:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.fti: DexterityFTI = queryUtility(IDexterityFTI, name="Attendees")

    def test_fti(self):
        assert self.fti is not None
        assert (
            self.fti.klass == "collective.techevent.users.content.attendees.Attendees"
        )
        assert self.fti.global_allow is True
        assert self.fti.allowed_content_types == ("Attendee", "Ticket")

    def test_blocks(self):
        assert "volto.blocks" in self.fti.behaviors

    def test_in_navigation(self):
        displayed_types = api.portal.get_registry_record("plone.displayed_types")
        assert "Attendees" in displayed_types

    def test_not_created_by_the_profile(self):
        """The profile creates no container: each event opts in by adding one."""
        assert len(api.content.find(portal_type="Attendees", unrestricted=True)) == 0


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory):
        self.portal = portal
        self.container = attendees_factory(portal, state="created")

    def test_create(self):
        assert isinstance(self.container, Attendees)
        assert IAttendees.providedBy(self.container)
        assert self.container.registration_prefix == "PYC26"

    def test_initial_state(self):
        assert api.content.get_state(self.container) == "created"
        assert self.container.is_open is False

    @pytest.mark.parametrize(
        "transitions,state,is_open",
        [
            (["open"], "open", True),
            (["open", "close"], "closed", False),
            (["open", "close", "open"], "open", True),
        ],
    )
    def test_transitions(self, transitions, state, is_open):
        with api.env.adopt_roles(["Manager"]):
            for transition in transitions:
                api.content.transition(obj=self.container, transition=transition)
        assert api.content.get_state(self.container) == state
        assert self.container.is_open is is_open

    @pytest.mark.parametrize("permission", ["View", "Access contents information"])
    @pytest.mark.parametrize(
        "transitions,public",
        [
            ([], False),
            (["open"], True),
            (["open", "close"], True),
        ],
    )
    def test_public_once_opened(self, transitions, public, permission):
        with api.env.adopt_roles(["Manager"]):
            for transition in transitions:
                api.content.transition(obj=self.container, transition=transition)
        roles = rolesForPermissionOn(permission, self.container)
        assert ("Anonymous" in roles) is public

    @pytest.mark.parametrize(
        "role,can_view",
        [
            ("Member", False),
            ("Reader", False),
            ("Reviewer", True),
            ("Editor", True),
            ("Site Administrator", True),
            ("Manager", True),
        ],
    )
    def test_organizers_only_before_opening(self, role, can_view):
        roles = rolesForPermissionOn("View", self.container)
        assert (role in roles) is can_view


class TestRegistrationPage:
    def test_default_blocks(self, portal, attendees_factory):
        container = attendees_factory(portal)
        layout = container.blocks_layout["items"]
        types = [container.blocks[block_id]["@type"] for block_id in layout]
        assert types == ["title", "eventRegistration"]

    def test_blocks_kept(self, portal):
        """Blocks sent by the Volto add form are kept."""
        blocks = {"a": {"@type": "slate"}}
        with api.env.adopt_roles(["Manager"]):
            container = api.content.create(
                container=portal,
                type="Attendees",
                id="attendees",
                title="Attendees",
                registration_prefix="PYC26",
                blocks=blocks,
                blocks_layout={"items": ["a"]},
            )
        assert container.blocks == blocks
        assert container.blocks_layout == {"items": ["a"]}


class TestPrefix:
    @pytest.mark.parametrize("value", ["PY", "PYC26", "ABCDEFGHIJ12", "2026"])
    def test_valid(self, value):
        IAttendees["registration_prefix"].validate(value)

    @pytest.mark.parametrize("value", ["P", "pyc26", "PYC-26", "ABCDEFGHIJ123", "PY C"])
    def test_invalid(self, value):
        with pytest.raises(Invalid):
            IAttendees["registration_prefix"].validate(value)


class TestDeadline:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory):
        self.container = attendees_factory(portal)

    def test_no_deadline(self):
        assert self.container.closes_at() is None
        assert self.container.expired is False
        assert self.container.is_open is True

    def test_future_deadline(self):
        self.container.registration_deadline = datetime.now(UTC) + timedelta(days=1)
        assert self.container.expired is False
        assert self.container.is_open is True

    def test_past_deadline(self):
        """Past the deadline, registration ends while the container stays open."""
        self.container.registration_deadline = datetime.now(UTC) - timedelta(minutes=1)
        assert self.container.expired is True
        assert self.container.is_open is False
        assert api.content.get_state(self.container) == "open"

    def test_naive_deadline_is_utc(self):
        naive = datetime(2026, 11, 20, 18, 0)
        self.container.registration_deadline = naive
        assert self.container.closes_at() == naive.replace(tzinfo=UTC)

    def test_aware_deadline_kept(self):
        aware = datetime(2026, 11, 20, 18, 0, tzinfo=timezone(timedelta(hours=-3)))
        self.container.registration_deadline = aware
        assert self.container.closes_at() == aware


class TestOnePerEventRoot:
    def test_portal_grants_permission(self, portal):
        assert rolesForPermissionOn(PERMISSION, portal)

    def test_added_revokes_permission(self, portal, attendees_factory):
        attendees_factory(portal)
        assert rolesForPermissionOn(PERMISSION, portal) == ()

    def test_setup_keeps_it_revoked(self, portal, attendees_factory):
        from collective.techevent.utils import setup_tech_event

        attendees_factory(portal)
        setup_tech_event(portal)
        assert rolesForPermissionOn(PERMISSION, portal) == ()
