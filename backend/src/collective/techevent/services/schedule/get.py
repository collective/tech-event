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
from zope.component import getMultiAdapter


def dict_as_sorted_list(data: dict, enforceIso: bool = False) -> list[dict]:
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


def process_trainings(slots: list[dict]) -> list[dict]:
    """Break whole day training sessions as 2 slots."""
    response = []
    for slot in slots:
        raw_start = slot["start"]
        raw_end = slot["end"]
        if slot.get("@type") != "Training" or not (raw_start and raw_end):
            response.append(slot)
            continue
        start = parse(raw_start)
        end = parse(raw_end)
        if (end - start).seconds > 14400:
            # change the first slot end
            new_end = (start + timedelta(seconds=14400)).isoformat()
            slot["end"] = new_end
            response.append(slot)
            slot = deepcopy(slot)
            # change the second slot start
            new_start = (end - timedelta(seconds=14400)).isoformat()
            slot["start"] = new_start
            slot["end"] = raw_end
            response.append(slot)
        else:
            response.append(slot)
    return response


def round_time(dt: datetime) -> datetime:
    """Round datetime up to the next quarter (00, 15, 30, 45), ignoring seconds and microseconds."""
    minute = ((dt.minute + 14) // 15) * 15
    if minute == 60:
        dt = dt.replace(hour=(dt.hour + 1) % 24, minute=0, second=0, microsecond=0)
    else:
        dt = dt.replace(minute=minute, second=0, microsecond=0)
    return dt


def time_slot(value: datetime) -> str:
    return f"time-{round_time(value).strftime('%H%M')}"


def group_slots(slots: list[dict], rooms_vocab: dict[str, str]) -> list[dict]:
    response = []
    days = {}

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
                # Use room-# with index+1 of the slot's room in vocab_rooms (not ordered_rooms)
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

    def _serialize_brain(self, brain) -> dict[str, Any]:
        obj = brain.getObject()
        result = getMultiAdapter((obj, self.request), ISerializeToJsonSummary)()
        return result

    def get_rooms(self) -> dict[str, str]:
        rooms = get_vocabulary_for_attr("room", self.context)
        if not rooms:
            return {}
        return {room.token: room.title for room in rooms}

    def get_slots(self) -> list[dict[str, Any]]:
        portal = api.portal.get()
        review_states = getattr(self.context, "schedule_review_states", None)
        results = api.content.find(
            context=portal,
            object_provides=IScheduleSlot,
            review_state=list(set(review_states or []).union({"published"})),
            sort_on="start",
            sort_order="ascending",
        )
        return [self._serialize_brain(brain) for brain in results]

    def reply(self) -> dict[str, list[dict]]:
        rooms = self.get_rooms()
        raw_slots = self.get_slots()
        slots = group_slots(raw_slots, rooms)
        return json_compatible({"items": slots})
