from collective.techevent.services.schedule.get import round_time
from collective.techevent.services.schedule.get import time_slot
from collective.techevent.utils import find_event_root
from datetime import datetime
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
