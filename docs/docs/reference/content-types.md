---
myst:
  html_meta:
    "description": "Content types of Tech Event Support for Plone: the event, the schedule, slots, sessions, presenters, locations and sponsors."
    "property=og:description": "Content types of Tech Event Support for Plone: the event, the schedule, slots, sessions, presenters, locations and sponsors."
    "property=og:title": "Content types"
    "keywords": "Plone, tech event, content types, Dexterity, reference"
---

(content-types)=

# Content types

The backend adds these Dexterity content types.
The portal type name is the name that the REST API and the Add menu use.

## Event

| Portal type | Description | Location |
| --- | --- | --- |
| Tech Event | One edition of the event. Available only when multiple events are enabled. | Site root |

## Schedule

| Portal type | Description | Contains |
| --- | --- | --- |
| Schedule | Container for the slots of the program. | Document, File, Image, Break, Keynote, LightningTalks, Meeting, OpenSpace, Slot, Talk, Training |
| Slot | General moment of the event, with a category: `slot`, `registration`, `meeting` or `photo`. | None |
| Break | Coffee break or lunch, with a category: `coffee-break` or `lunch`. | None |
| Talk | Talk with a duration from the event durations. | File, Image, Link |
| Keynote | Keynote with a duration from the event durations. | File, Image, Link |
| Training | Training with a duration, requirements and a number of seats. | File, Image, Link |
| LightningTalks | Group of short presentations, with a title and presenters for each. | File, Image, Link |
| OpenSpace | Open space session. | File, Image, Link |
| Meeting | Meeting, such as an annual general meeting. | File, Image, Link |

Each slot type has a start time, an end time and a room.
Each session type also has the fields of the session behavior, described in {doc}`behaviors`.

## People

| Portal type | Description | Fields |
| --- | --- | --- |
| Presenter | A person who takes part in the event. | Name, short biography, email address, categories |

The categories of a presenter come from the `presenter_labels` vocabulary.

## Locations

| Portal type | Description | Contains |
| --- | --- | --- |
| Venue | A place where the event happens. | Document, File, Image, Room |
| Room | A room of a venue. Rooms appear as the columns of the schedule. | Document, File, Image |

## Sponsors

| Portal type | Description | Contains |
| --- | --- | --- |
| SponsorsDB | The sponsorship package: the benefits, the levels and the sponsors. | Document, File, Image, SponsorLevel |
| SponsorLevel | A sponsorship level, with a color, an investment and a list of benefits. | Sponsor, File, Image |
| Sponsor | A sponsor, with a title, a summary and a text. | None |

A sponsor belongs to the level that contains it.
The level of a sponsor is indexed, so that the sponsors endpoint can group them by level.

## Attendees

These types come with the **Tech Event for Plone: Attendee support** profile, `collective.techevent.users:default`.

| Portal type | Description | Contains |
| --- | --- | --- |
| Attendees | The registrations of one event, with the registration settings: prefix, anonymous registration, confirmation policy and deadline. A page with blocks, which is the registration page of the event. At most one per event root. | Attendee, Ticket |
| Attendee | One registration: first name, last name, email address, ticket, and the account it belongs to. Its ID is the registration code. | None |
| Ticket | What registrants can choose for an event: title, summary, the period in which it is available, and whether it grants admission. It has no workflow, and follows its Attendees database. | None |

The Attendees workflow has the states `created`, `open` and `closed`.
An Attendees database is public in the `open` and `closed` states, and shows in the navigation; its registrations are not.
The Attendee workflow has the states `pending`, `registered`, `attended` and `cancelled`.
The email address and the account of an attendee are indexed without metadata columns, so search results never include them.
