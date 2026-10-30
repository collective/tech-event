"""Self-registration: register, cancel, verify, link to an account."""

from collective.techevent.users import registration
from collective.techevent.users.registration import RegistrationError
from collective.techevent.users.tokens import create_token
from datetime import datetime
from datetime import timedelta
from datetime import UTC
from plone import api
from plone.app.testing import login
from plone.app.testing import logout

import pytest
import re


PAYLOAD = {"first_name": "Grace", "last_name": "Hopper", "email": "grace@example.org"}

URL_PATTERN = re.compile(r"(http\S+registration/verify\?token=\S+)")


def _token_from(message: bytes) -> str:
    """Return the token of the verification link in an email.

    :param message: The raw email.
    :returns: The token.
    """
    text = message.decode().replace("=\r\n", "").replace("=3D", "=")
    match = URL_PATTERN.search(text)
    assert match is not None
    url = match.group(1)
    return url.split("token=")[1]


@pytest.fixture
def ada(portal, member_factory):
    """Log in as Ada, a site member."""
    member_factory("ada", "ada@example.org", "Ada Lovelace")
    login(portal, "ada")
    yield "ada"
    logout()


class TestRegisterMember:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, mailhost, ada):
        self.portal = portal
        self.factory = attendees_factory
        self.mailhost = mailhost

    def test_defaults_from_account(self):
        container = self.factory(self.portal)
        attendee = registration.register(container, {})
        assert attendee.first_name == "Ada"
        assert attendee.last_name == "Lovelace"
        assert attendee.email == "ada@example.org"
        assert attendee.user_id == "ada"
        assert attendee.email_verified is True

    def test_owner(self):
        container = self.factory(self.portal)
        attendee = registration.register(container, {})
        assert dict(attendee.get_local_roles()) == {"ada": ("Owner",)}

    def test_other_email(self):
        """A member may register with another address, which is not verified."""
        container = self.factory(self.portal)
        attendee = registration.register(container, {"email": "work@example.org"})
        assert attendee.email == "work@example.org"
        assert attendee.email_verified is False

    @pytest.mark.parametrize(
        "policy,state,emails",
        [
            ("automatic", "registered", 0),
            ("email", "pending", 1),
            ("manual", "pending", 0),
        ],
    )
    def test_policy(self, policy, state, emails):
        container = self.factory(self.portal, registration_confirmation=policy)
        attendee = registration.register(container, {})
        assert api.content.get_state(attendee) == state
        assert len(self.mailhost.messages) == emails

    def test_automatic_sends_confirmation(self, run_commit_hooks):
        container = self.factory(self.portal)
        attendee = registration.register(container, {})
        run_commit_hooks()
        assert len(self.mailhost.messages) == 1
        assert attendee.getId() in self.mailhost.messages[0].decode()

    def test_named_with_prefix(self):
        container = self.factory(self.portal, registration_prefix="PLONE")
        attendee = registration.register(container, {})
        assert attendee.getId().startswith("PLONE-")

    def test_duplicate_user(self):
        container = self.factory(self.portal)
        registration.register(container, {})
        with pytest.raises(RegistrationError) as exc:
            registration.register(container, {"email": "other@example.org"})
        assert exc.value.status == 409
        assert exc.value.message == "You are already registered for this event."

    def test_duplicate_email(self, attendee_factory):
        container = self.factory(self.portal)
        attendee_factory(container, email="ADA@example.org")
        with pytest.raises(RegistrationError) as exc:
            registration.register(container, {})
        assert exc.value.status == 409
        assert exc.value.message == "This email is already registered for this event."

    @pytest.mark.parametrize(
        "data", [{"email": "not-an-email"}, {"first_name": "  "}, {"last_name": 42}]
    )
    def test_invalid(self, data):
        container = self.factory(self.portal)
        with pytest.raises(RegistrationError) as exc:
            registration.register(container, data)
        assert exc.value.status == 400


class TestRegistrationWindow:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, ada):
        self.portal = portal
        self.factory = attendees_factory

    @pytest.mark.parametrize("state", ["created", "closed"])
    def test_not_open(self, state):
        container = self.factory(self.portal, state=state)
        with pytest.raises(RegistrationError) as exc:
            registration.register(container, {})
        assert exc.value.status == 403
        assert exc.value.type == "RegistrationClosed"

    def test_deadline_passed(self):
        """Past the deadline, registration is refused although the state is open."""
        deadline = datetime.now(UTC) - timedelta(minutes=1)
        container = self.factory(self.portal, registration_deadline=deadline)
        assert api.content.get_state(container) == "open"
        with pytest.raises(RegistrationError) as exc:
            registration.register(container, {})
        assert exc.value.status == 403
        assert exc.value.type == "RegistrationDeadlinePassed"
        assert exc.value.message == "The registration deadline has passed."

    def test_before_deadline(self):
        deadline = datetime.now(UTC) + timedelta(days=1)
        container = self.factory(self.portal, registration_deadline=deadline)
        attendee = registration.register(container, {})
        assert api.content.get_state(attendee) == "registered"

    def test_closed_checked_before_deadline(self):
        deadline = datetime.now(UTC) - timedelta(minutes=1)
        container = self.factory(
            self.portal, state="closed", registration_deadline=deadline
        )
        with pytest.raises(RegistrationError) as exc:
            registration.register(container, {})
        assert exc.value.type == "RegistrationClosed"

    def test_status(self):
        deadline = datetime(2030, 11, 20, 21, 0, tzinfo=UTC)
        container = self.factory(self.portal, registration_deadline=deadline)
        status = registration.registration_status(container)
        assert status == {
            "state": "open",
            "open": True,
            "closes_at": "2030-11-20T21:00:00+00:00",
            "expired": False,
            "allow_anonymous_registration": False,
            "registration_confirmation": "automatic",
            "requires_ticket": False,
            "tickets": [],
        }

    def test_status_expired(self):
        deadline = datetime.now(UTC) - timedelta(minutes=1)
        container = self.factory(self.portal, registration_deadline=deadline)
        status = registration.registration_status(container)
        assert status["state"] == "open"
        assert status["open"] is False
        assert status["expired"] is True


class TestRegisterAnonymous:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, mailhost):
        self.portal = portal
        self.factory = attendees_factory
        self.mailhost = mailhost

    def test_not_allowed(self):
        container = self.factory(self.portal)
        logout()
        with pytest.raises(RegistrationError) as exc:
            registration.register(container, PAYLOAD)
        assert exc.value.status == 401

    @pytest.mark.parametrize("policy", ["automatic", "email", "manual"])
    def test_allowed(self, policy):
        container = self.factory(
            self.portal,
            allow_anonymous_registration=True,
            registration_confirmation=policy,
        )
        logout()
        attendee = registration.register(container, PAYLOAD)
        assert api.content.get_state(attendee) == "pending"
        assert attendee.user_id is None
        assert attendee.email_verified is False
        assert dict(attendee.get_local_roles()) == {}

    def test_verification_email(self):
        container = self.factory(self.portal, allow_anonymous_registration=True)
        logout()
        attendee = registration.register(container, PAYLOAD)
        assert len(self.mailhost.messages) == 1
        message = self.mailhost.messages[0]
        assert b"To: grace@example.org" in message
        text = message.decode().replace("=\r\n", "")
        assert attendee.getId() in text
        assert _token_from(message)

    def test_missing_data(self):
        container = self.factory(self.portal, allow_anonymous_registration=True)
        logout()
        with pytest.raises(RegistrationError) as exc:
            registration.register(container, {"email": "grace@example.org"})
        assert exc.value.status == 400


class TestVerify:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, mailhost):
        self.portal = portal
        self.factory = attendees_factory
        self.mailhost = mailhost

    def _register(self, policy: str = "automatic"):
        container = self.factory(
            self.portal,
            allow_anonymous_registration=True,
            registration_confirmation=policy,
        )
        logout()
        attendee = registration.register(container, PAYLOAD)
        return container, attendee

    @pytest.mark.parametrize(
        "policy,state",
        [("automatic", "registered"), ("email", "registered"), ("manual", "pending")],
    )
    def test_verify(self, policy, state):
        container, attendee = self._register(policy)
        token = _token_from(self.mailhost.messages[0])
        result = registration.verify(container, token)
        assert result.UID() == attendee.UID()
        assert attendee.email_verified is True
        assert api.content.get_state(attendee) == state

    def test_twice(self):
        container, attendee = self._register()
        token = _token_from(self.mailhost.messages[0])
        registration.verify(container, token)
        registration.verify(container, token)
        assert api.content.get_state(attendee) == "registered"

    @pytest.mark.parametrize("token", ["", "garbage", "abc.def"])
    def test_invalid(self, token):
        container, _attendee = self._register()
        with pytest.raises(RegistrationError) as exc:
            registration.verify(container, token)
        assert exc.value.status == 400

    def test_expired(self):
        container, attendee = self._register()
        issued = datetime.now(UTC) - timedelta(hours=49)
        token = create_token(attendee.UID(), now=issued)
        with pytest.raises(RegistrationError) as exc:
            registration.verify(container, token)
        assert exc.value.type == "InvalidToken"

    def test_unknown_uid(self):
        container, _attendee = self._register()
        with pytest.raises(RegistrationError):
            registration.verify(container, create_token("0" * 32))

    def test_other_container(self, content_factory):
        """A token for a registration in another container is refused."""
        _container, attendee = self._register()
        other = content_factory(self.portal, {"type": "Document", "id": "other"})
        token = create_token(attendee.UID())
        with pytest.raises(RegistrationError):
            registration.verify(other, token)


class TestCancel:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory):
        self.portal = portal
        self.container = attendees_factory(portal)

    def test_anonymous(self):
        logout()
        with pytest.raises(RegistrationError) as exc:
            registration.cancel(self.container)
        assert exc.value.status == 401

    def test_not_registered(self, ada):
        with pytest.raises(RegistrationError) as exc:
            registration.cancel(self.container)
        assert exc.value.status == 404

    def test_cancel(self, ada):
        attendee = registration.register(self.container, {})
        result = registration.cancel(self.container)
        assert result.UID() == attendee.UID()
        assert api.content.get_state(attendee) == "cancelled"

    @pytest.mark.parametrize("transitions", [["check_in"], ["cancel"]])
    def test_cannot_cancel(self, ada, transitions):
        attendee = registration.register(self.container, {})
        with api.env.adopt_roles(["Manager"]):
            for transition in transitions:
                api.content.transition(obj=attendee, transition=transition)
        with pytest.raises(RegistrationError) as exc:
            registration.cancel(self.container)
        assert exc.value.status == 409


class TestLinkRegistration:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, attendees_factory, attendee_factory, member_factory):
        self.container = attendees_factory(portal, registration_confirmation="manual")
        self.attendee_factory = attendee_factory
        self.user = member_factory("ada", "ada@example.org")

    def test_verified_email_links(self):
        attendee = self.attendee_factory(
            self.container, email="Ada@Example.org", email_verified=True
        )
        assert (
            registration.link_registration(self.container, self.user).UID()
            == attendee.UID()
        )
        assert attendee.user_id == "ada"
        assert dict(attendee.get_local_roles()) == {"ada": ("Owner",)}
        brains = api.content.find(attendee_user_id="ada", unrestricted=True)
        assert len(brains) == 1

    def test_unverified_email_does_not_link(self):
        attendee = self.attendee_factory(self.container, email="ada@example.org")
        assert registration.link_registration(self.container, self.user) is None
        assert attendee.user_id is None

    def test_linked_to_other_account(self):
        attendee = self.attendee_factory(
            self.container, email="ada@example.org", email_verified=True, user_id="bob"
        )
        assert registration.link_registration(self.container, self.user) is None
        assert attendee.user_id == "bob"

    def test_different_email(self):
        self.attendee_factory(
            self.container, email="grace@example.org", email_verified=True
        )
        assert registration.link_registration(self.container, self.user) is None

    def test_already_linked(self):
        attendee = self.attendee_factory(
            self.container, email="work@example.org", user_id="ada"
        )
        assert (
            registration.link_registration(self.container, self.user).UID()
            == attendee.UID()
        )
