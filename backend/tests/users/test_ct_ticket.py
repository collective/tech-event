"""The Ticket content type."""

from AccessControl.PermissionRole import rolesForPermissionOn
from collective.techevent.users.content.ticket import ITicket
from collective.techevent.users.content.ticket import Ticket
from datetime import datetime
from datetime import timedelta
from datetime import UTC
from plone import api
from plone.dexterity.fti import DexterityFTI
from types import SimpleNamespace
from zope.component import getUtility
from zope.interface import Invalid
from zope.schema.interfaces import IVocabularyFactory

import pytest


PORTAL_TYPE = "Ticket"

VOCABULARY = "collective.techevent.vocabularies.tickets"

HOUR = timedelta(hours=1)


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, ticket_factory):
        self.container = attendees_factory(portal)
        self.ticket = ticket_factory(self.container, title="Full conference")

    def test_create(self):
        assert isinstance(self.ticket, Ticket)
        assert ITicket.providedBy(self.ticket)

    def test_fti(self):
        fti = api.portal.get_tool("portal_types")[PORTAL_TYPE]
        assert isinstance(fti, DexterityFTI)
        assert fti.global_allow is False

    def test_allowed_in_container(self):
        types = [fti.getId() for fti in self.container.allowedContentTypes()]
        assert sorted(types) == ["Attendee", "Ticket"]

    def test_named_from_title(self):
        """Unlike an Attendee, a Ticket gets no registration code."""
        assert self.ticket.getId() == "full-conference"

    def test_no_workflow(self):
        chain = api.portal.get_tool("portal_workflow").getChainFor(self.ticket)
        assert tuple(chain) == ()

    def test_grants_admission_by_default(self):
        assert self.ticket.admission is True

    def test_not_in_navigation(self):
        brains = api.content.find(UID=self.ticket.UID(), unrestricted=True)
        assert brains[0].exclude_from_nav is True


class TestVisibility:
    @pytest.mark.parametrize(
        "state,public", [("created", False), ("open", True), ("closed", True)]
    )
    def test_follows_container(
        self, portal, attendees_factory, ticket_factory, state, public
    ):
        container = attendees_factory(portal, state=state)
        ticket = ticket_factory(container)
        assert ("Anonymous" in rolesForPermissionOn("View", ticket)) is public


class TestIsAvailable:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, ticket_factory):
        self.container = attendees_factory(portal)
        self.ticket_factory = ticket_factory

    @pytest.mark.parametrize(
        "start,end,available",
        [
            (None, None, True),
            (-1, None, True),
            (1, None, False),
            (None, 1, True),
            (None, -1, False),
            (-1, 1, True),
            (-2, -1, False),
            (1, 2, False),
        ],
    )
    def test_period(self, start, end, available):
        now = datetime.now(UTC)
        ticket = self.ticket_factory(
            self.container,
            available_from=None if start is None else now + start * HOUR,
            available_until=None if end is None else now + end * HOUR,
        )
        assert ticket.is_available is available

    def test_date_without_timezone(self):
        past = datetime.now(UTC).replace(tzinfo=None) - HOUR
        ticket = self.ticket_factory(self.container, available_until=past)
        assert ticket.is_available is False


class TestValidPeriod:
    @pytest.mark.parametrize(
        "start,end,valid",
        [
            (None, None, True),
            (0, None, True),
            (None, 0, True),
            (0, 1, True),
            (1, 0, False),
            (0, 0, False),
        ],
    )
    def test_invariant(self, start, end, valid):
        now = datetime.now(UTC)
        data = SimpleNamespace(
            available_from=None if start is None else now + start * HOUR,
            available_until=None if end is None else now + end * HOUR,
        )
        if valid:
            ITicket.validateInvariants(data)
        else:
            with pytest.raises(Invalid):
                ITicket.validateInvariants(data)


class TestVocabulary:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, attendee_factory, ticket_factory):
        self.portal = portal
        self.container = attendees_factory(portal)
        self.first = ticket_factory(self.container, title="First")
        self.second = ticket_factory(
            self.container,
            title="Second",
            available_until=datetime.now(UTC) - HOUR,
        )
        self.attendee = attendee_factory(self.container)
        self.factory = getUtility(IVocabularyFactory, name=VOCABULARY)

    def test_container(self):
        terms = list(self.factory(self.container))
        assert [term.value for term in terms] == [
            self.first.UID(),
            self.second.UID(),
        ]
        assert [term.title for term in terms] == ["First", "Second"]

    def test_attendee(self):
        assert len(self.factory(self.attendee)) == 2

    def test_elsewhere(self):
        assert len(self.factory(self.portal)) == 0
