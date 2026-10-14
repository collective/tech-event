---
myst:
  html_meta:
    "description": "Behaviors of Tech Event Support for Plone: event settings, schedule slot fields, session fields and presenter roles."
    "property=og:description": "Behaviors of Tech Event Support for Plone: event settings, schedule slot fields, session fields and presenter roles."
    "property=og:title": "Behaviors"
    "keywords": "Plone, tech event, behaviors, Dexterity, reference"
---

(behaviors)=

# Behaviors

The backend adds these behaviors to the content types.
A behavior adds fields to a content type without changing its class.

## Event settings

Name: `collective.techevent.event_settings`

This behavior turns the content it is enabled on into an event root.
The Plone site uses it in single event mode, and the Tech Event type uses it in multiple events mode.

| Field | Type | Description |
| --- | --- | --- |
| `start` | Date and time | Start time of the event. |
| `end` | Date and time | End time of the event. Must be later than the start time. |
| `days` | List of strings | Dates of the event, computed from the start and end times. Read-only. |
| `tracks` | List of tracks | Tracks of the program. Each track has an `id`, a `title` and a `color`. |
| `levels` | List of levels | Session levels. Each level has an `id`, a `title` and a `color`. |
| `audience` | List of audiences | Target audiences. Each audience has an `id`, a `title` and a `color`. |
| `durations_keynote` | List of durations | Slot durations for keynotes. Each duration has an `id`, a `title`, a `duration` in minutes and a `color`. |
| `durations_talk` | List of durations | Slot durations for talks. |
| `durations_training` | List of durations | Slot durations for trainings. |
| `schedule_review_states` | List of workflow states | States that the schedule shows in addition to `published`. |

## Schedule slot

Name: `collective.techevent.schedule`

This behavior is enabled on the slot types, and it adds the fields that place a slot on the schedule.

| Field | Type | Description |
| --- | --- | --- |
| `start` | Date and time | Start time of the slot. |
| `end` | Date and time | End time of the slot. |
| `room` | Set of rooms | Rooms where the slot takes place. The choices come from the `slot_rooms` vocabulary. |

## Session

Name: `collective.techevent.session`

This behavior is enabled on the session types.

| Field | Type | Description |
| --- | --- | --- |
| `title` | Text line | Title of the session. Required. |
| `description` | Text | Abstract of the session. Required. |
| `details` | Rich text | Details of the session. |
| `presenters` | Relation list | Presenters of the session. The choices come from the `presenters` vocabulary. |
| `session_level` | Set | Level of the session. |
| `session_audience` | Set | Target audience of the session. |
| `session_language` | Choice | Language of the session, from the supported content languages. |
| `session_track` | Set | Track of the session. |
| `session_video` | URI | Link to a video of the session. |

## Presenter local roles

The backend also registers a local role provider for presenters, the `PresenterRoleProvider` adapter.
It returns the local roles of a user on a presenter, based on the presenters that are linked from the sessions.
