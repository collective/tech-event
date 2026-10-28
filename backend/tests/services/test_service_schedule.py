from collective.techevent.services.schedule.get import process_trainings
from collective.techevent.services.schedule.get import round_time
from collective.techevent.services.schedule.get import time_slot
from collective.techevent.subscribers.settings import SUPPORT_MULTIPLE_EVENTS
from collective.techevent.utils import find_event_root
from datetime import datetime
from datetime import UTC
from plone import api

import pytest
import transaction


def total_event_count(response: dict) -> int:
    """Return total number of events in the schedule."""
    count = 0
    for day in response.get("items", []):
        count += len(day.get("items", []))
    return count


class TestScheduleGet:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal
        self.schedule = portal["schedule"]

    def test_schedule_public(self, api_anon_request, api_manager_request):
        # By default, the schedule shows only published events, which shows
        # the same amount of events for anonymous and managers.
        event_root = find_event_root(self.schedule)
        event_root.schedule_review_states = []
        transaction.commit()

        anon_response = api_anon_request.get("@schedule")
        assert anon_response.status_code == 200
        anon_event_count = total_event_count(anon_response.json())

        manager_response = api_manager_request.get("@schedule")
        assert manager_response.status_code == 200
        manager_event_count = total_event_count(manager_response.json())

        assert anon_event_count > 0
        assert manager_event_count > 0
        assert anon_event_count == manager_event_count > 0

    def test_schedule_private(self, api_anon_request, api_manager_request):
        # When the schedule is partly private, anonymous users should see
        # the same amount of events as managers

        event_root = find_event_root(self.schedule)
        for ob in api.content.find(context=self.schedule, portal_type=["Talk"]):
            api.content.transition(ob.getObject(), transition="retract")
        transaction.commit()

        anon_response = api_anon_request.get("@schedule")
        assert anon_response.status_code == 200
        anon_event_count = total_event_count(anon_response.json())

        manager_response = api_manager_request.get("@schedule")
        assert manager_response.status_code == 200
        manager_event_count = total_event_count(manager_response.json())

        assert anon_event_count > 0
        assert manager_event_count > 0
        assert anon_event_count == manager_event_count > 0

        # unless the schedule is configured to show private events. Then
        # anonymous users should still see only published events, but
        # managers should see all events.

        event_root.schedule_review_states = ["published", "private"]
        transaction.commit()

        anon_response = api_anon_request.get("@schedule")
        assert anon_response.status_code == 200
        anon_event_count = total_event_count(anon_response.json())

        manager_response = api_manager_request.get("@schedule")
        assert manager_response.status_code == 200
        manager_event_count = total_event_count(manager_response.json())

        assert anon_event_count > 0
        assert manager_event_count > 0
        assert anon_event_count < manager_event_count

    def test_schedule_room_order(self, api_manager_request):
        response = api_manager_request.get("@schedule")
        assert response.status_code == 200
        days = response.json().get("items", [])
        assert len(days) > 1
        rooms = [x[-1] for x in days[1]["rooms"]]
        assert rooms == ["_all_", "Main Room", "Beta Room"]

        # Move Beta Room at the top and see that it is reflected
        self.portal.about.venue.moveObjectsUp(["beta-room"])
        transaction.commit()

        response = api_manager_request.get("@schedule")
        assert response.status_code == 200
        days = response.json().get("items", [])
        assert len(days) > 1
        rooms = [x[-1] for x in days[1]["rooms"]]
        assert rooms == ["_all_", "Beta Room", "Main Room"]


class TestScheduleMultipleEvents:
    """Each Tech Event's @schedule lists only the slots inside it (#36)."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        """Create two Tech Events, each with a Schedule and a published Talk.

        :param portal: The Plone site, with the demo content.
        """
        self.portal = portal
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, True)
            for year in (2025, 2026):
                event = api.content.create(
                    container=portal,
                    type="Tech Event",
                    id=f"event-{year}",
                    title=f"Event {year}",
                )
                schedule = api.content.create(
                    container=event, type="Schedule", id="schedule", title="Schedule"
                )
                talk = api.content.create(
                    container=schedule,
                    type="Talk",
                    id=f"talk-{year}",
                    title=f"Talk {year}",
                    start=datetime(year, 9, 1, 10, 0, tzinfo=UTC),
                    end=datetime(year, 9, 1, 10, 45, tzinfo=UTC),
                )
                api.content.transition(talk, transition="publish")
        transaction.commit()
        yield
        with api.env.adopt_roles(["Manager"]):
            api.portal.set_registry_record(SUPPORT_MULTIPLE_EVENTS, False)
        transaction.commit()

    def slot_ids(self, api_manager_request, year: int) -> list[str]:
        """Return the ids of the slots in an event's schedule.

        :param api_manager_request: REST API session for a Manager.
        :param year: Year of the event to query.
        :returns: The slot ids, in schedule order.
        """
        response = api_manager_request.get(f"event-{year}/@schedule")
        assert response.status_code == 200
        return [
            slot["@id"].rsplit("/", 1)[-1]
            for day in response.json()["items"]
            for slot in day["items"]
        ]

    @pytest.mark.parametrize("year", [2025, 2026])
    def test_schedule_only_lists_own_slots(self, api_manager_request, year: int):
        with api.env.adopt_roles(["Manager"]):
            api.content.delete(self.portal["schedule"])
        transaction.commit()
        assert self.slot_ids(api_manager_request, year) == [f"talk-{year}"]

    @pytest.mark.parametrize("year", [2025, 2026])
    def test_schedule_ignores_slots_outside_events(
        self, api_manager_request, year: int
    ):
        # Slots left at the site root have no event root once multiple
        # events are enabled; they must not reach an event's schedule.
        assert self.slot_ids(api_manager_request, year) == [f"talk-{year}"]


@pytest.mark.parametrize(
    "dt,expected",
    [
        (datetime(2025, 8, 29, 10, 1), datetime(2025, 8, 29, 10, 15)),
        (datetime(2025, 8, 29, 10, 14), datetime(2025, 8, 29, 10, 15)),
        (datetime(2025, 8, 29, 10, 15), datetime(2025, 8, 29, 10, 15)),
        (datetime(2025, 8, 29, 10, 16), datetime(2025, 8, 29, 10, 30)),
        (datetime(2025, 8, 29, 10, 29), datetime(2025, 8, 29, 10, 30)),
        (datetime(2025, 8, 29, 10, 30), datetime(2025, 8, 29, 10, 30)),
        (datetime(2025, 8, 29, 10, 31), datetime(2025, 8, 29, 10, 45)),
        (datetime(2025, 8, 29, 10, 44), datetime(2025, 8, 29, 10, 45)),
        (datetime(2025, 8, 29, 10, 45), datetime(2025, 8, 29, 10, 45)),
        (datetime(2025, 8, 29, 10, 46), datetime(2025, 8, 29, 11, 00)),
        (datetime(2025, 8, 29, 10, 59), datetime(2025, 8, 29, 11, 00)),
        (datetime(2025, 8, 29, 11, 00), datetime(2025, 8, 29, 11, 00)),
        (datetime(2025, 8, 29, 11, 00, 1), datetime(2025, 8, 29, 11, 00)),
    ],
)
def test_round_time_quarters(dt, expected) -> None:
    assert round_time(dt) == expected


@pytest.mark.parametrize(
    "dt,expected",
    [
        (datetime(2025, 8, 29, 9, 0), "time-0900"),
        (datetime(2025, 8, 29, 15, 45), "time-1545"),
        (datetime(2025, 8, 29, 15, 45, 1), "time-1545"),
        (datetime(2025, 8, 29, 15, 50), "time-1600"),
    ],
)
def test_time_slot(dt, expected) -> None:
    assert time_slot(dt) == expected


def make_slot(portal_type: str, start: str, end: str, room: str = "") -> dict:
    """Return a serialized slot with only the keys the training split reads.

    :param portal_type: The ``@type`` of the slot.
    :param start: Start time, ``HH:MM`` in UTC on 2025-07-31.
    :param end: End time, ``HH:MM`` in UTC on 2025-07-31.
    :param room: Token of the slot's room; empty for every room.
    :returns: The slot.
    """
    return {
        "@type": portal_type,
        "title": portal_type,
        "start": f"2025-07-31T{start}:00+00:00",
        "end": f"2025-07-31T{end}:00+00:00",
        "room": [{"token": room, "title": room}] if room else None,
    }


def hours(slots: list[dict]) -> list[tuple[str, str, str]]:
    """Return the type, start and end hour of each slot.

    :param slots: The serialized slots.
    :returns: ``(type, HH:MM, HH:MM)`` per slot, in order.
    """
    return [(s["@type"], s["start"][11:16], s["end"][11:16]) for s in slots]


class TestProcessTrainings:
    """Whole day trainings are split around the breaks inside them (#31)."""

    def test_split_around_lunch(self):
        slots = [
            make_slot("Training", "12:00", "21:00", room="training"),
            make_slot("Break", "15:00", "17:00"),
        ]
        assert hours(process_trainings(slots)) == [
            ("Training", "12:00", "15:00"),
            ("Break", "15:00", "17:00"),
            ("Training", "17:00", "21:00"),
        ]

    def test_split_around_several_breaks(self):
        slots = [
            make_slot("Training", "12:00", "21:00"),
            make_slot("Break", "13:30", "14:00"),
            make_slot("Break", "15:00", "16:00"),
        ]
        assert hours(process_trainings(slots)) == [
            ("Training", "12:00", "13:30"),
            ("Break", "13:30", "14:00"),
            ("Training", "14:00", "15:00"),
            ("Break", "15:00", "16:00"),
            ("Training", "16:00", "21:00"),
        ]

    def test_break_in_another_room_does_not_split(self):
        slots = [
            make_slot("Training", "12:00", "15:00", room="training"),
            make_slot("Break", "13:00", "13:30", room="main"),
        ]
        assert hours(process_trainings(slots)) == [
            ("Training", "12:00", "15:00"),
            ("Break", "13:00", "13:30"),
        ]

    def test_break_at_the_edge_trims_the_training(self):
        slots = [
            make_slot("Training", "12:00", "15:00"),
            make_slot("Break", "11:30", "12:30"),
        ]
        assert hours(process_trainings(slots)) == [
            ("Break", "11:30", "12:30"),
            ("Training", "12:30", "15:00"),
        ]

    def test_long_training_without_break_keeps_first_and_last_hours(self):
        slots = [make_slot("Training", "12:00", "21:00")]
        assert hours(process_trainings(slots)) == [
            ("Training", "12:00", "16:00"),
            ("Training", "17:00", "21:00"),
        ]

    def test_short_training_without_break_is_kept(self):
        slots = [make_slot("Training", "12:00", "15:00")]
        assert process_trainings(slots) == slots

    def test_other_types_are_not_split(self):
        slots = [
            make_slot("Talk", "12:00", "21:00"),
            make_slot("Break", "15:00", "17:00"),
        ]
        assert hours(process_trainings(slots)) == hours(slots)

    def test_parts_keep_the_training_data(self):
        slots = [
            make_slot("Training", "12:00", "21:00", room="training"),
            make_slot("Break", "15:00", "17:00"),
        ]
        first, _, second = process_trainings(slots)
        assert first["title"] == second["title"] == "Training"
        assert (
            first["room"]
            == second["room"]
            == [{"token": "training", "title": "training"}]
        )
        assert first["start"] == slots[0]["start"]
        assert second["end"] == slots[0]["end"]
