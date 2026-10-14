---
myst:
  html_meta:
    "description": "Set up the schedule of a tech event: event settings, rooms, durations and the slots that appear on the schedule."
    "property=og:description": "Set up the schedule of a tech event: event settings, rooms, durations and the slots that appear on the schedule."
    "property=og:title": "Set up the schedule"
    "keywords": "Plone, tech event, schedule, slot, room, duration, track"
---

# Set up the schedule

This guide shows you how to prepare the schedule of an event and add its slots.
Work through the steps in this order, because each step uses the values of the previous one.

## Set the event settings

Open the event root, which is the site or the Tech Event item, and edit it.
In the **Event Settings** fieldset, fill in these fields:

-   **Start time** and **End time** for the event.
    The schedule uses these dates to list the days of the event.
-   **Tracks**, with a code, a title and a color, for each track of the program.
-   **Session Levels** and **Session Audience**, with a code, a title and a color each.
-   **Keynote: Slot duration**, **Talk: Slot duration** and **Training: Slot duration**, with a code, a title, the duration in minutes and a color.
-   **Schedule: Additional states**, if you want the schedule to show content in other workflow states than published.

Save the form.

## Add the rooms

Add a **Venue** at the event root, and add a **Room** inside it for each room of the event.
The schedule shows the rooms in the order that they are listed in the venue.
A slot with a room appears in that room's column.

## Add the schedule

Add a **Schedule** at the event root.
The schedule is a container, so add the slots inside it.

## Add the slots

Add the slots inside the schedule.
Each slot needs a start time, an end time and, if the slot happens in a room, the room.

-   Add a **Talk**, a **Keynote**, a **Training**, a **Lightning Talks** item, an **Open Space** or a **Meeting** for each session.
    Choose the track, the level, the audience and the language, and link the presenters.
-   Add a **Break** for each coffee break and each lunch.
-   Add a **Slot** for general moments, such as the registration or the conference photo.

A session with the duration fields keeps the duration that you choose from the list.
Publish each slot that should appear on the schedule.

## Show the schedule on a page

Add a page and add a **Schedule** block.
Set the title, choose whether to show the day index, and filter the days that the block shows.
A block without a day filter shows all the days of the schedule.

The schedule endpoint returns the same data that the block uses.
See {doc}`/reference/rest-api` for its response.
