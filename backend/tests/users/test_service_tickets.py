"""Tickets in the ``@registration`` and ``@attendees`` services."""

from datetime import datetime
from datetime import timedelta
from datetime import UTC
from plone import api

import pytest


PAYLOAD = {"first_name": "Grace", "last_name": "Hopper", "email": "grace@example.org"}

HOUR = timedelta(hours=1)


@pytest.fixture
def container(functional_portal, attendees_factory, commit):
    """Create the Attendees container of the site, taking anonymous registrations."""
    container = attendees_factory(functional_portal, allow_anonymous_registration=True)
    commit()
    return container


@pytest.fixture
def add_ticket(container, ticket_factory, commit):
    """Create a committed Ticket in the container.

    :returns: A callable taking the Ticket's fields.
    """

    def func(**fields):
        ticket = ticket_factory(container, **fields)
        commit()
        return ticket

    return func


class TestStatus:
    def test_without_tickets(self, api_anon, container):
        data = api_anon.get("/@registration").json()
        assert data["requires_ticket"] is False
        assert data["tickets"] == []

    def test_lists_available(self, api_anon, add_ticket):
        first = add_ticket(title="First", description="All days")
        add_ticket(title="Past", available_until=datetime.now(UTC) - HOUR)
        add_ticket(title="Future", available_from=datetime.now(UTC) + HOUR)
        data = api_anon.get("/@registration").json()
        assert data["requires_ticket"] is True
        assert data["tickets"] == [
            {
                "UID": first.UID(),
                "title": "First",
                "description": "All days",
                "admission": True,
            }
        ]

    def test_none_available(self, api_anon, add_ticket):
        add_ticket(title="Past", available_until=datetime.now(UTC) - HOUR)
        data = api_anon.get("/@registration").json()
        assert data["requires_ticket"] is True
        assert data["tickets"] == []

    def test_keeps_container_order(self, api_anon, add_ticket):
        for title in ("Zebra", "Alpha"):
            add_ticket(title=title)
        tickets = api_anon.get("/@registration").json()["tickets"]
        assert [ticket["title"] for ticket in tickets] == ["Zebra", "Alpha"]


class TestRegister:
    def test_without_tickets(self, api_anon, container):
        response = api_anon.post("/@registration", json=PAYLOAD)
        assert response.status_code == 201
        assert response.json()["ticket"] is None

    def test_ticket_ignored_without_tickets(self, api_anon, container):
        response = api_anon.post(
            "/@registration", json={**PAYLOAD, "ticket": "unknown"}
        )
        assert response.status_code == 201
        assert response.json()["ticket"] is None

    def test_chosen(self, api_anon, add_ticket):
        add_ticket(title="First")
        second = add_ticket(title="Second")
        response = api_anon.post(
            "/@registration", json={**PAYLOAD, "ticket": second.UID()}
        )
        assert response.status_code == 201
        assert response.json()["ticket"]["title"] == "Second"

    def test_only_one_available_may_be_left_out(self, api_anon, add_ticket):
        add_ticket(title="Past", available_until=datetime.now(UTC) - HOUR)
        add_ticket(title="Open")
        response = api_anon.post("/@registration", json=PAYLOAD)
        assert response.status_code == 201
        assert response.json()["ticket"]["title"] == "Open"

    def test_several_require_a_choice(self, api_anon, add_ticket):
        add_ticket(title="First")
        add_ticket(title="Second")
        response = api_anon.post("/@registration", json=PAYLOAD)
        assert response.status_code == 400
        assert "ticket" in response.json()["error"]["message"]

    @pytest.mark.parametrize("value", ["unknown", ["a"], {"a": 1}, 1])
    def test_unknown(self, api_anon, add_ticket, value):
        add_ticket(title="First")
        response = api_anon.post("/@registration", json={**PAYLOAD, "ticket": value})
        assert response.status_code == 400

    def test_outside_its_period(self, api_anon, add_ticket):
        add_ticket(title="First")
        past = add_ticket(title="Past", available_until=datetime.now(UTC) - HOUR)
        response = api_anon.post(
            "/@registration", json={**PAYLOAD, "ticket": past.UID()}
        )
        assert response.status_code == 400

    def test_none_available(self, api_anon, add_ticket):
        add_ticket(title="Past", available_until=datetime.now(UTC) - HOUR)
        response = api_anon.post("/@registration", json=PAYLOAD)
        assert response.status_code == 403
        assert response.json()["error"]["type"] == "TicketsUnavailable"

    def test_closed_comes_first(self, api_anon, add_ticket, container, commit):
        ticket = add_ticket(title="First")
        with api.env.adopt_roles(["Manager"]):
            api.content.transition(obj=container, transition="close")
        commit()
        response = api_anon.post(
            "/@registration", json={**PAYLOAD, "ticket": ticket.UID()}
        )
        assert response.status_code == 403
        assert response.json()["error"]["type"] == "RegistrationClosed"

    def test_registration_shows_ticket(self, api_member, add_ticket):
        add_ticket(title="First")
        assert api_member.post("/@registration", json={}).status_code == 201
        data = api_member.get("/@registration").json()
        assert data["registration"]["ticket"]["title"] == "First"


class TestAttendeeContent:
    @pytest.fixture(autouse=True)
    def _setup(self, container, add_ticket, attendee_factory, commit):
        self.first = add_ticket(title="First")
        self.second = add_ticket(title="Second")
        self.attendee = attendee_factory(container, ticket=self.first.UID())
        self.url = f"/attendees/{self.attendee.getId()}"
        commit()

    def test_serialized_with_title(self, api_manager):
        ticket = api_manager.get(self.url).json()["ticket"]
        assert ticket == {"token": self.first.UID(), "title": "First"}

    def test_organizer_changes_ticket(self, api_manager):
        response = api_manager.patch(self.url, json={"ticket": self.second.UID()})
        assert response.status_code == 204
        ticket = api_manager.get(self.url).json()["ticket"]
        assert ticket["title"] == "Second"

    def test_owner_cannot_change_ticket(self, api_local_role_factory):
        session = api_local_role_factory(self.attendee, "Owner")
        session.patch(
            self.url, json={"first_name": "Janet", "ticket": self.second.UID()}
        )
        data = session.get(self.url).json()
        assert data["first_name"] == "Janet"
        assert data["ticket"]["title"] == "First"


class TestAttendeesService:
    @pytest.fixture(autouse=True)
    def _setup(self, container, add_ticket, attendee_factory, commit):
        self.container = container
        self.ticket = add_ticket(title="First")
        attendee_factory(container, ticket=self.ticket.UID())
        attendee_factory(container, first_name="Zoe", email="zoe@example.org")
        commit()

    def test_lists_only_attendees(self, api_manager):
        data = api_manager.get("/attendees/@attendees").json()
        assert data["items_total"] == 2

    def test_ticket(self, api_manager):
        items = api_manager.get("/attendees/@attendees").json()["items"]
        tickets = {item["title"]: item["ticket"] for item in items}
        assert tickets["Jane Doe"]["title"] == "First"
        assert tickets["Zoe Doe"] is None

    def test_deleted_ticket(self, api_manager, commit):
        with api.env.adopt_roles(["Manager"]):
            api.content.delete(obj=self.ticket, check_linkintegrity=False)
        commit()
        items = api_manager.get("/attendees/@attendees").json()["items"]
        assert all(item["ticket"] is None for item in items)
        attendee = next(item for item in items if item["title"] == "Jane Doe")
        assert api_manager.get(attendee["@id"]).status_code == 200
