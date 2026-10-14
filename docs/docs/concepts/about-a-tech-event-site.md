---
myst:
  html_meta:
    "description": "What a tech event site is made of: the event, the schedule, the slots, presenters, locations and sponsors."
    "property=og:description": "What a tech event site is made of: the event, the schedule, the slots, presenters, locations and sponsors."
    "property=og:title": "About a tech event site"
    "keywords": "Plone, tech event, schedule, slot, presenter, venue, room, sponsor"
---

(about-a-tech-event-site)=

# About a tech event site

A tech event site describes one edition of a conference, symposium, or seminar.
It holds the program of the event, the people who present in it, the places where it happens, and the companies that sponsor it.
Tech Event Support for Plone models these parts as Plone content types, so editors work with them in the same way as with any other content.

## The event

The event holds the settings for one edition.
These settings are the start and end dates, the list of tracks, session levels and target audiences, the possible durations for keynotes, talks and trainings, and the workflow states that the schedule shows in addition to published content.

The event is either the Plone site itself or a Tech Event item, depending on how the site is configured.
See {ref}`about-single-and-multiple-events` for the difference.

## The schedule

A Schedule is a container for the program of the event.
It holds the slots, which are the items placed on a day and in a room.
The schedule is published through the `@schedule` endpoint and the Schedule block, which both group the slots by day and by room.

## Slots

A slot is anything with a start time, an end time and, optionally, a room.
The backend provides these slot types:

-   Session types, for the program: Talk, Keynote, Training, Lightning Talks, Open Space, and Meeting.
    A session has a title, an abstract, presenters, a level, an audience, a track, a language and an optional video.
-   Break, for coffee breaks and lunches.
-   Slot, for general moments such as registration or a conference photo.
    Its category tells the reader what kind of moment it is.

A Talk, Keynote, Training and Open Space are sessions.
A Break and a Slot are not sessions, and they do not need presenters.

## Presenters

A Presenter is a person who takes part in the event.
A presenter has a name, a short biography, an email address and one or more labels, such as speaker, keynote speaker or instructor.
Sessions link to presenters, so one presenter can appear in several sessions.

## Locations

A Venue is a place where the event happens.
A Room belongs to a venue, and rooms are the columns of the schedule.
Rooms are listed in the order that the event defines them, and the schedule places each slot in the column of its room.

## Sponsors

A SponsorsDB holds the sponsorship package for the event.
It has a list of benefits that every sponsorship level can offer.
Each sponsorship level, such as Gold or Platinum, has a price, a color and the value of each benefit.
A Sponsor belongs to one level and is shown with the other sponsors of that level.

## Why the schedule works as a grid

The schedule is a grid.
The columns are the rooms, and the rows are the time slots of the day.
The endpoint computes the position of each slot in that grid from its start time, its end time and its room, so the frontend only needs to draw the result.
Slots without a room span all the columns, and keynotes always span all the columns.
A training longer than four hours is split into two slots for the display, so that long trainings do not hide the rest of the day.
