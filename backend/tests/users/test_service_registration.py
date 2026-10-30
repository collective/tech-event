"""The ``@registration`` and ``@attendees`` services."""

from collective.techevent.users.tokens import create_token
from datetime import datetime
from datetime import timedelta
from datetime import UTC
from plone import api

import pytest
import re
import transaction


PAYLOAD = {"first_name": "Grace", "last_name": "Hopper", "email": "grace@example.org"}

CODE_PATTERN = re.compile(r"^PYC26-[0-9A-HJKMNP-TV-Z]{8}$")


@pytest.fixture
def container_factory(functional_portal, attendees_factory, commit):
    """Create the Attendees container of the site, committed.

    :returns: A callable taking the container settings.
    """

    def func(**settings):
        container = attendees_factory(functional_portal, **settings)
        commit()
        return container

    return func


class TestGetRegistration:
    def test_no_container(self, api_anon):
        response = api_anon.get("/@registration")
        assert response.status_code == 404
        assert response.json()["error"]["type"] == "NotFound"

    def test_anonymous(self, api_anon, container_factory):
        container_factory(allow_anonymous_registration=True)
        response = api_anon.get("/@registration")
        assert response.status_code == 200
        data = response.json()
        assert data["@id"].endswith("/plone/@registration")
        assert data["state"] == "open"
        assert data["open"] is True
        assert data["closes_at"] is None
        assert data["allow_anonymous_registration"] is True
        assert data["registration"] is None
        assert "defaults" not in data

    def test_member_defaults(self, api_member, container_factory):
        container_factory()
        data = api_member.get("/@registration").json()
        assert data["registration"] is None
        assert data["defaults"] == {
            "first_name": "Ada",
            "last_name": "Lovelace",
            "email": "ada@example.org",
        }

    def test_member_registered(self, api_member, container_factory):
        container_factory()
        api_member.post("/@registration", json={})
        data = api_member.get("/@registration").json()
        assert data["registration"]["state"] == "registered"
        assert CODE_PATTERN.match(data["registration"]["code"])
        # The member does not organize the registrations: no @id for the record
        assert "@id" not in data["registration"]

    def test_expired(self, api_anon, container_factory):
        deadline = datetime.now(UTC) - timedelta(minutes=1)
        container_factory(registration_deadline=deadline)
        data = api_anon.get("/@registration").json()
        assert data["state"] == "open"
        assert data["open"] is False
        assert data["expired"] is True


class TestAttendeesOutsideContainer:
    def test_event_root(self, api_manager):
        """Only an Attendees container has the service."""
        response = api_manager.get("/@attendees")
        assert response.status_code == 404


class TestPostRegistration:
    def test_no_container(self, api_member):
        response = api_member.post("/@registration", json={})
        assert response.status_code == 404

    def test_member(self, api_member, container_factory):
        container_factory()
        response = api_member.post("/@registration", json={})
        assert response.status_code == 201
        data = response.json()
        assert CODE_PATTERN.match(data["code"])
        assert data["state"] == "registered"
        assert data["email"] == "ada@example.org"

    @pytest.mark.parametrize("state", ["created", "closed"])
    def test_not_open(self, api_member, container_factory, state):
        container_factory(state=state)
        response = api_member.post("/@registration", json={})
        assert response.status_code == 403
        assert response.json()["error"] == {
            "type": "RegistrationClosed",
            "message": "Registration is not open.",
        }

    def test_deadline_passed(self, api_member, container_factory):
        deadline = datetime.now(UTC) - timedelta(minutes=1)
        container_factory(registration_deadline=deadline)
        response = api_member.post("/@registration", json={})
        assert response.status_code == 403
        assert response.json()["error"] == {
            "type": "RegistrationDeadlinePassed",
            "message": "The registration deadline has passed.",
        }

    def test_anonymous_not_allowed(self, api_anon, container_factory):
        container_factory()
        response = api_anon.post("/@registration", json=PAYLOAD)
        assert response.status_code == 401
        assert response.json()["error"]["type"] == "Unauthorized"

    def test_anonymous(self, api_anon, container_factory, functional_portal):
        container_factory(allow_anonymous_registration=True)
        response = api_anon.post("/@registration", json=PAYLOAD)
        assert response.status_code == 201
        data = response.json()
        assert data["state"] == "pending"
        assert data["email_verified"] is False
        assert "@id" not in data

    def test_duplicate(self, api_member, container_factory):
        container_factory()
        api_member.post("/@registration", json={})
        response = api_member.post("/@registration", json={})
        assert response.status_code == 409
        assert response.json()["error"]["message"] == (
            "You are already registered for this event."
        )

    def test_invalid(self, api_member, container_factory):
        container_factory()
        response = api_member.post("/@registration", json={"email": "nope"})
        assert response.status_code == 400

    def test_unknown_action(self, api_member, container_factory):
        container_factory()
        response = api_member.post("/@registration/nothing", json={})
        assert response.status_code == 404


class TestCancelAndVerify:
    def test_cancel(self, api_member, container_factory):
        container_factory()
        api_member.post("/@registration", json={})
        response = api_member.post("/@registration/cancel", json={})
        assert response.status_code == 200
        assert response.json()["state"] == "cancelled"

    def test_cancel_anonymous(self, api_anon, container_factory):
        container_factory()
        response = api_anon.post("/@registration/cancel", json={})
        assert response.status_code == 401

    def test_verify(self, api_anon, container_factory, functional_portal):
        container_factory(allow_anonymous_registration=True)
        code = api_anon.post("/@registration", json=PAYLOAD).json()["code"]
        # See what the server committed
        transaction.begin()
        container = functional_portal["attendees"]
        token = create_token(container[code].UID())
        response = api_anon.post("/@registration/verify", json={"token": token})
        assert response.status_code == 200
        data = response.json()
        assert data["code"] == code
        assert data["state"] == "registered"
        assert data["email_verified"] is True

    def test_verify_invalid(self, api_anon, container_factory):
        container_factory(allow_anonymous_registration=True)
        response = api_anon.post("/@registration/verify", json={"token": "nope"})
        assert response.status_code == 400
        assert response.json()["error"]["type"] == "InvalidToken"


class TestAttendeesService:
    @pytest.fixture(autouse=True)
    def _setup(self, container_factory, attendee_factory, commit):
        self.container = container_factory(registration_confirmation="manual")
        attendee_factory(self.container, first_name="Zoe", email="zoe@example.org")
        grace = attendee_factory(
            self.container,
            first_name="Grace",
            last_name="Hopper",
            email="g@example.org",
        )
        with api.env.adopt_roles(["Manager"]):
            api.content.transition(obj=grace, transition="confirm")
        commit()

    def test_organizer(self, api_manager):
        response = api_manager.get("/attendees/@attendees")
        assert response.status_code == 200
        data = response.json()
        assert data["@id"].endswith("/plone/attendees/@attendees")
        assert data["items_total"] == 2
        assert [item["title"] for item in data["items"]] == ["Grace Hopper", "Zoe Doe"]
        assert data["items"][0]["email"] == "g@example.org"
        assert data["counts"] == {
            "pending": 1,
            "registered": 1,
            "attended": 0,
            "cancelled": 0,
        }
        assert data["can_review"] is True

    def test_filter(self, api_manager):
        response = api_manager.get(
            "/attendees/@attendees", params={"review_state": "pending"}
        )
        items = response.json()["items"]
        assert [item["title"] for item in items] == ["Zoe Doe"]

    def test_anonymous(self, api_anon):
        response = api_anon.get("/attendees/@attendees")
        assert response.status_code == 401

    def test_member(self, api_member):
        response = api_member.get("/attendees/@attendees")
        assert response.status_code == 401

    @pytest.mark.parametrize("role,can_review", [("Reviewer", True), ("Editor", False)])
    def test_local_organizer(self, api_local_role_factory, role, can_review):
        session = api_local_role_factory(self.container, role)
        response = session.get("/attendees/@attendees")
        assert response.status_code == 200
        assert response.json()["items_total"] == 2
        assert response.json()["can_review"] is can_review

    def test_anonymous_sees_open_container(self, api_anon):
        """The open container is public, without its registrations."""
        response = api_anon.get("/attendees")
        assert response.status_code == 200
        data = response.json()
        assert data["@type"] == "Attendees"
        assert data["items"] == []

    def test_search_hides_emails(self, api_manager):
        """The catalog has no email column, so @search never returns one."""
        response = api_manager.get(
            "/@search", params={"portal_type": "Attendee", "metadata_fields": "_all"}
        )
        items = response.json()["items"]
        assert len(items) == 2
        assert all("attendee_email" not in item for item in items)
        assert all("email" not in item for item in items)

    def test_rest_add_names_with_code(self, api_manager):
        """A REST POST without an id gets a registration code."""
        response = api_manager.post(
            "/attendees",
            json={
                "@type": "Attendee",
                "first_name": "Alan",
                "last_name": "Turing",
                "email": "alan@example.org",
            },
        )
        assert response.status_code == 201, response.text
        assert CODE_PATTERN.match(response.json()["id"])

    def test_rest_add_duplicate(self, api_manager):
        response = api_manager.post(
            "/attendees",
            json={
                "@type": "Attendee",
                "first_name": "Other",
                "last_name": "Zoe",
                "email": "ZOE@example.org",
            },
        )
        assert response.status_code == 400
        assert "already registered" in response.text
