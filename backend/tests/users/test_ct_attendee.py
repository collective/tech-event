"""The Attendee: one registration, named with a registration code."""

from AccessControl.PermissionRole import rolesForPermissionOn
from collective.techevent.users.content.attendee import Attendee
from collective.techevent.users.content.attendee import IAttendee
from plone import api
from plone.app.testing import login
from plone.app.testing import logout
from zope.interface import Invalid

import pytest
import re


CODE_PATTERN = re.compile(r"^PYC26-[0-9A-HJKMNP-TV-Z]{8}$")


class _Data:
    """Form data, as the invariant validator sees it."""

    def __init__(self, context, **fields):
        self.__context__ = context
        for key, value in fields.items():
            setattr(self, key, value)


class TestContentType:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, attendee_factory):
        self.container = attendees_factory(portal, registration_confirmation="manual")
        self.attendee = attendee_factory(self.container)

    def test_create(self):
        assert isinstance(self.attendee, Attendee)
        assert self.attendee.title == "Jane Doe"
        assert self.attendee.user_id is None
        assert self.attendee.email_verified is False

    def test_named_with_code(self):
        """Without an id, the Attendee is named with a registration code."""
        assert CODE_PATTERN.match(self.attendee.getId())

    def test_upper_case_url(self):
        assert self.attendee.absolute_url().endswith(
            f"/attendees/{self.attendee.getId()}"
        )
        assert self.attendee.getId() == self.attendee.getId().upper()

    def test_explicit_id_kept(self, attendee_factory):
        """An id given by a sync script is kept."""
        other = attendee_factory(
            self.container, id="PYC26-SYNC0001", email="sync@example.org"
        )
        assert other.getId() == "PYC26-SYNC0001"

    def test_initial_state(self):
        assert api.content.get_state(self.attendee) == "pending"

    def test_no_children(self):
        assert self.attendee.allowedContentTypes() == []


class TestIndexes:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, attendee_factory):
        self.container = attendees_factory(portal)
        self.attendee = attendee_factory(
            self.container, email=" Jane@Example.ORG ", user_id="jane"
        )

    def test_email_normalized(self):
        brains = api.content.find(attendee_email="jane@example.org", unrestricted=True)
        assert [b.UID for b in brains] == [self.attendee.UID()]

    def test_user_id(self):
        brains = api.content.find(attendee_user_id="jane", unrestricted=True)
        assert [b.UID for b in brains] == [self.attendee.UID()]

    @pytest.mark.parametrize("column", ["attendee_email", "attendee_user_id", "email"])
    def test_no_metadata(self, column):
        catalog = api.portal.get_tool("portal_catalog")
        assert column not in catalog.schema()


class TestUniqueness:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, attendee_factory):
        self.container = attendees_factory(portal)
        self.attendee = attendee_factory(self.container, user_id="jane")

    def _validate(self, context, **fields):
        data = _Data(context, **fields)
        IAttendee.validateInvariants(data)

    def test_new_email(self):
        self._validate(self.container, email="other@example.org", user_id=None)

    def test_duplicate_email(self):
        with pytest.raises(Invalid) as exc:
            self._validate(self.container, email="JANE@example.org", user_id=None)
        assert "email is already registered" in str(exc.value)

    def test_duplicate_user(self):
        with pytest.raises(Invalid) as exc:
            self._validate(self.container, email="other@example.org", user_id="jane")
        assert "already registered" in str(exc.value)

    def test_editing_itself(self):
        self._validate(self.attendee, email="jane@example.org", user_id="jane")

    def test_other_event(self, portal, content_factory):
        """A registration in another container does not count."""
        folder = content_factory(portal, {"type": "Document", "id": "doc"})
        self._validate(folder, email="jane@example.org", user_id="jane")


class TestAutomaticConfirmation:
    @pytest.mark.parametrize(
        "policy,state",
        [("automatic", "registered"), ("email", "pending"), ("manual", "pending")],
    )
    def test_created_by_organizer(
        self, portal, attendees_factory, attendee_factory, policy, state
    ):
        container = attendees_factory(portal, registration_confirmation=policy)
        attendee = attendee_factory(container)
        assert api.content.get_state(attendee) == state

    def test_created_anonymously(self, portal, attendees_factory, attendee_factory):
        container = attendees_factory(portal)
        logout()
        attendee = attendee_factory(container)
        assert api.content.get_state(attendee) == "pending"

    def test_confirmation_email(
        self, portal, attendees_factory, attendee_factory, mailhost, run_commit_hooks
    ):
        """The email, sent on commit, has the final registration code."""
        container = attendees_factory(portal)
        attendee = attendee_factory(container)
        assert mailhost.messages == []
        run_commit_hooks()
        assert len(mailhost.messages) == 1
        message = mailhost.messages[0].decode()
        assert "To: jane@example.org" in message
        assert attendee.getId() in message


class TestWorkflow:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, attendee_factory, member_factory):
        self.container = attendees_factory(portal, registration_confirmation="manual")
        member_factory("jane", "jane@example.org")
        self.attendee = attendee_factory(self.container, user_id="jane")
        self.attendee.manage_setLocalRoles("jane", ["Owner"])
        self.attendee.reindexObjectSecurity()

    def _as_jane(self):
        login(api.portal.get(), "jane")

    def _transition(self, *transitions):
        with api.env.adopt_roles(["Manager"]):
            for transition in transitions:
                api.content.transition(obj=self.attendee, transition=transition)

    @pytest.mark.parametrize(
        "transitions,state",
        [
            (["confirm"], "registered"),
            (["confirm", "check_in"], "attended"),
            (["confirm", "check_in", "undo_check_in"], "registered"),
            (["cancel"], "cancelled"),
            (["confirm", "cancel"], "cancelled"),
            (["cancel", "revert"], "pending"),
        ],
    )
    def test_transitions(self, transitions, state):
        self._transition(*transitions)
        assert api.content.get_state(self.attendee) == state

    @pytest.mark.parametrize("before", [[], ["confirm"]])
    def test_owner_cancels(self, before):
        self._transition(*before)
        self._as_jane()
        api.content.transition(obj=self.attendee, transition="cancel")
        assert api.content.get_state(self.attendee) == "cancelled"

    @pytest.mark.parametrize(
        "before,transition",
        [([], "confirm"), (["confirm"], "check_in"), (["cancel"], "revert")],
    )
    def test_owner_cannot(self, before, transition):
        self._transition(*before)
        self._as_jane()
        with pytest.raises(api.exc.InvalidParameterError):
            api.content.transition(obj=self.attendee, transition=transition)

    @pytest.mark.parametrize(
        "transitions,owner_modifies",
        [
            ([], True),
            (["confirm"], True),
            (["confirm", "check_in"], False),
            (["cancel"], False),
        ],
    )
    def test_owner_modifies(self, transitions, owner_modifies):
        """Once checked in, or cancelled, the attendee cannot change the record."""
        self._transition(*transitions)
        roles = rolesForPermissionOn("Modify portal content", self.attendee)
        assert ("Owner" in roles) is owner_modifies

    @pytest.mark.parametrize(
        "transitions,owner_views",
        [
            ([], True),
            (["confirm"], True),
            (["confirm", "check_in"], True),
            (["cancel"], False),
        ],
    )
    def test_owner_views(self, transitions, owner_views):
        self._transition(*transitions)
        roles = rolesForPermissionOn("View", self.attendee)
        assert ("Owner" in roles) is owner_views
        assert "Anonymous" not in roles
