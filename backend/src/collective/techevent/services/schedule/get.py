"""REST service returning the conference schedule."""

from collections.abc import Callable
from collective.techevent.behaviors.schedule import IScheduleSlot
from collective.techevent.utils.vocabularies import get_vocabulary_for_attr
from copy import deepcopy
from datetime import datetime
from datetime import timedelta
from dateutil.parser import parse
from plone import api
from plone.dexterity.content import DexterityContent
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.services import Service
from typing import Any
from typing import cast
from zope.component import getMultiAdapter


def dict_as_sorted_list(data: dict[str, Any], enforceIso: bool = False) -> list[dict]:
    """Sort a mapping by key and return it as a list of ``id``/``items`` dicts.

    :param data: The mapping to sort, keyed by slot start time.
    :param enforceIso: Normalize the keys to ISO 8601 before sorting.
    :returns: The sorted list of dicts.
    """
    keys = sorted(data.keys())
    local_data = deepcopy(data)
    if enforceIso:
        for raw_key in keys:
            key = parse(raw_key).strftime("%Y-%m-%dT%H:%M:%S%z")
            if key == raw_key:
                continue
            values = local_data.pop(raw_key)
            if key not in local_data:
                local_data[key] = {}
            local_data[key].update(values)
        keys = [parse(raw_key).strftime("%Y-%m-%dT%H:%M:%S%z") for raw_key in keys]
    response = []
    keys = sorted(local_data.keys())
    for key in keys:
        response.append({"id": key, "items": local_data[key]})
    return response


MAX_TRAINING_BLOCK = timedelta(hours=4)


def room_tokens(slot: dict) -> set[str]:
    """Return the room tokens of a serialized slot.

    :param slot: The serialized slot.
    :returns: The tokens; empty when the slot has no room.
    """
    return {r.get("token") for r in slot.get("room") or [] if r.get("token")}


def get_breaks(slots: list[dict]) -> list[tuple[datetime, datetime, set[str]]]:
    """Return the start, end and rooms of every dated Break.

    :param slots: The serialized slots.
    :returns: One ``(start, end, rooms)`` tuple per Break.
    """
    return [
        (parse(slot["start"]), parse(slot["end"]), room_tokens(slot))
        for slot in slots
        if slot.get("@type") == "Break" and slot.get("start") and slot.get("end")
    ]


def split_around_breaks(
    start: datetime,
    end: datetime,
    rooms: set[str],
    breaks: list[tuple[datetime, datetime, set[str]]],
) -> list[tuple[datetime, datetime]]:
    """Return the parts of ``start``-``end`` not covered by a break.

    A break counts when it overlaps the period and shares a room with it; a
    break or a period without a room is in every room.

    :param start: Start of the period.
    :param end: End of the period.
    :param rooms: Room tokens of the period.
    :param breaks: The ``(start, end, rooms)`` of the breaks.
    :returns: The uncovered parts, in order; the whole period when no break
        overlaps it.
    """
    overlapping = sorted(
        (max(b_start, start), min(b_end, end))
        for b_start, b_end, b_rooms in breaks
        if b_start < end
        and b_end > start
        and (not b_rooms or not rooms or b_rooms & rooms)
    )
    parts = []
    cursor = start
    for b_start, b_end in overlapping:
        if b_start > cursor:
            parts.append((cursor, b_start))
        cursor = max(cursor, b_end)
    if cursor < end:
        parts.append((cursor, end))
    return parts


def process_trainings(slots: list[dict]) -> list[dict]:
    """Split long trainings into the blocks shown in the schedule grid.

    A Training is cut around the Breaks that overlap it, so a whole day
    training with lunch in the middle becomes a morning and an afternoon
    block. A Training longer than four hours with no Break in it is shown as
    its first and its last four hours.

    :param slots: The serialized slots, sorted by start.
    :returns: The slots with the trainings split, sorted by start.
    """
    breaks = get_breaks(slots)
    response = []
    for slot in slots:
        raw_start = slot["start"]
        raw_end = slot["end"]
        if slot.get("@type") != "Training" or not (raw_start and raw_end):
            response.append(slot)
            continue
        start = parse(raw_start)
        end = parse(raw_end)
        parts = split_around_breaks(start, end, room_tokens(slot), breaks)
        if parts == [(start, end)] and end - start > MAX_TRAINING_BLOCK:
            parts = [
                (start, start + MAX_TRAINING_BLOCK),
                (end - MAX_TRAINING_BLOCK, end),
            ]
        for part_start, part_end in parts:
            part = deepcopy(slot)
            part["start"] = raw_start if part_start == start else part_start.isoformat()
            part["end"] = raw_end if part_end == end else part_end.isoformat()
            response.append(part)
    # The serializer returns every start as UTC ISO 8601, which sorts as text.
    return sorted(response, key=lambda slot: slot["start"] or "")


def round_time(dt: datetime) -> datetime:
    """Round datetime up to the next quarter (00, 15, 30, 45).

    Seconds and microseconds are ignored.
    """
    minute = ((dt.minute + 14) // 15) * 15
    if minute == 60:
        dt = dt.replace(hour=(dt.hour + 1) % 24, minute=0, second=0, microsecond=0)
    else:
        dt = dt.replace(minute=minute, second=0, microsecond=0)
    return dt


def time_slot(value: datetime) -> str:
    """Return the grid row name for a time, rounded to the quarter hour.

    :param value: The datetime to convert.
    :returns: The row name, e.g. ``time-0930``.
    """
    return f"time-{round_time(value).strftime('%H%M')}"


def group_slots(slots: list[dict], rooms_vocab: dict[str, str]) -> list[dict]:
    """Group the slots by day and compute their grid positioning.

    :param slots: The serialized slots.
    :param rooms_vocab: The room titles keyed by room token.
    :returns: The days, each with its rooms and positioned items.
    """
    response = []
    days: dict[str, list[dict]] = {}

    # Pre-process training slots to split long sessions
    slots = process_trainings(slots)
    for slot in slots:
        start = slot.get("start", "")
        if not start:
            continue
        day = start[0:10]  # Extract date part (YYYY-MM-DD)
        days.setdefault(day, []).append(slot)

    # Convert grouped days dict to a sorted list of dicts
    response = dict_as_sorted_list(days)
    for day in response:
        rooms = set()

        # Collect all room tokens and slot types for the day
        for slot in day["items"]:
            room_tokens = (
                [r.get("token") for r in slot.get("room", [])]
                if slot.get("room")
                else []
            )
            rooms.update(room_tokens or ["_all_"])

        # Order rooms: first those not in vocab, then those in vocab order
        other_rooms = [room for room in rooms if room not in rooms_vocab]
        vocab_rooms = [room for room in rooms_vocab if room in rooms]  # in vocab order
        ordered_rooms = other_rooms + vocab_rooms
        day["rooms"] = [[room, rooms_vocab.get(room, room)] for room in ordered_rooms]

        # Assign grid positioning for each slot (for UI layout)
        for slot in day["items"]:
            start_dt = parse(slot.get("start")) if slot.get("start") else None
            end_dt = parse(slot.get("end")) if slot.get("end") else None
            room_tokens = (
                [r.get("token") for r in slot.get("room", [])]
                if slot.get("room")
                else []
            )
            # Assign gridColumn: which track/room the slot belongs to
            if slot.get("@type") == "Keynote":
                slot["gridColumn"] = "room-1 / room-all"
            elif room_tokens:
                # Use room-# with index+1 of the slot's room in vocab_rooms
                # (not ordered_rooms)
                token = room_tokens[0]
                if token in vocab_rooms:
                    track_index = vocab_rooms.index(token) + 1
                    slot["gridColumn"] = f"room-{track_index}"
                else:
                    slot["gridColumn"] = "room-1"
            else:
                # If no room, span all tracks
                slot["gridColumn"] = "room-1 / room-all"
            # Assign gridRow: time slot range for the slot
            if start_dt and end_dt:
                slot["gridRow"] = f"{time_slot(start_dt)} / {time_slot(end_dt)}"
            else:
                slot["gridRow"] = ""
            # Assign gridHeight: duration of the slot in grid units
            slot["gridHeight"] = round(
                ((end_dt - start_dt).seconds // 60 if start_dt and end_dt else 0) / 15
            )

    return response


class ScheduleGet(Service):
    """Service to get the conference schedule."""

    context: DexterityContent

    def _serialize_brain(self, brain: Any) -> dict[str, Any]:
        """Serialize a catalog brain of a schedule slot.

        :param brain: The catalog brain to serialize.
        :returns: The JSON summary of the slot.
        """
        obj = brain.getObject()
        serializer = cast(
            Callable[[], dict[str, Any]],
            getMultiAdapter((obj, self.request), ISerializeToJsonSummary),
        )
        result = serializer()
        return result

    def get_rooms(self) -> dict[str, str]:
        """Return the room titles keyed by room token.

        :returns: The room titles.
        """
        rooms = get_vocabulary_for_attr("room", self.context)
        if not rooms:
            return {}
        return {room.token: room.title for room in rooms}  # type: ignore[attr-defined]  # zope-stubs omit IVocabulary.__iter__

    def get_slots(self) -> list[dict[str, Any]]:
        """Return the serialized published schedule slots of this event.

        :returns: The JSON summaries of the slots, sorted by start.
        """
        review_states = getattr(self.context, "schedule_review_states", None)
        results = api.content.find(
            context=self.context,
            object_provides=IScheduleSlot,
            review_state=list(set(review_states or []).union({"published"})),
            sort_on="start",
            sort_order="ascending",
        )
        return [self._serialize_brain(brain) for brain in results]

    def reply(self) -> dict[str, list[dict]]:
        """Return the conference schedule grouped by day.

        :returns: The schedule items.
        """
        rooms = self.get_rooms()
        raw_slots = self.get_slots()
        slots = group_slots(raw_slots, rooms)
        return json_compatible({"items": slots})
