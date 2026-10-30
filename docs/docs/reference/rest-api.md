---
myst:
  html_meta:
    "description": "REST endpoints of Tech Event Support for Plone: @schedule, @sponsors and @registration on the event root, and @attendees on the Attendees database, with request and response shapes."
    "property=og:description": "REST endpoints of Tech Event Support for Plone: @schedule, @sponsors and @registration on the event root, and @attendees on the Attendees database, with request and response shapes."
    "property=og:title": "REST API"
    "keywords": "Plone, tech event, REST API, @schedule, @sponsors, @registration, @attendees, plone.restapi"
---

(rest-api)=

# REST API

The backend adds the `@schedule`, `@sponsors` and `@registration` endpoints to the event root.
The event root is the Plone site in single event mode, and a Tech Event item in multiple events mode.
With the attendee registration profile, it also adds `@attendees` to the Attendees database.

## `@schedule`

Returns the slots of the event, grouped by day.

**Permission:** `zope2.View`

**Request**

```http
GET /Plone/@schedule HTTP/1.1
Accept: application/json
```

**Response**

The response is an object with an `items` list.
Each item is one day, and it has these keys:

| Key | Description |
| --- | --- |
| `id` | The date of the day, as `YYYY-MM-DD`. |
| `items` | The slots of the day, sorted by start time. Each slot is a summary of the content, with the layout keys listed below. |
| `rooms` | The rooms used on the day, as a list of `[token, title]` pairs. Rooms that are not in the venue vocabulary come first. |

Each slot in `items` has the summary fields of the content, such as `@id`, `@type`, `title`, `start`, `end` and `room`.
The endpoint also adds these layout keys:

| Key | Description |
| --- | --- |
| `gridColumn` | The column of the slot, such as `room-1`, or `room-1 / room-all` for keynotes and for slots without a room. |
| `gridRow` | The rows of the slot, such as `time-0900 / time-1000`. Times are rounded up to the next quarter of an hour. |
| `gridHeight` | The duration of the slot, in quarters of an hour. |

Trainings that last more than four hours are split into two slots for the display.

The following example shows the structure of the response, with one slot.

```json
{
  "items": [
    {
      "id": "2027-05-10",
      "items": [
        {
          "@type": "Talk",
          "title": "Opening remarks",
          "start": "2027-05-10T09:00:00+00:00",
          "end": "2027-05-10T09:30:00+00:00",
          "room": [
            {
              "token": "main-room",
              "title": "Main room"
            }
          ],
          "gridColumn": "room-1",
          "gridRow": "time-0900 / time-0930",
          "gridHeight": 2
        }
      ],
      "rooms": [
        [
          "main-room",
          "Main room"
        ]
      ]
    }
  ]
}
```

## `@sponsors`

Returns the published sponsors, grouped by level, and the benefits of each level.

**Permission:** `zope2.Public`

**Request**

```http
GET /Plone/@sponsors HTTP/1.1
Accept: application/json
```

**Response**

| Key | Description |
| --- | --- |
| `@id` | URL of the sponsors database. |
| `items` | The sponsorship levels, in order. |
| `benefits` | The benefits of the event, with the value that each level gives to each benefit. |

Each level in `items` has these keys:

| Key | Description |
| --- | --- |
| `@id` | URL of the level. |
| `id` | ID of the level. |
| `title` | Title of the level. |
| `items` | The published sponsors of the level, as summaries. |
| `has_sponsors` | `true` when the level has at least one published sponsor. |
| `exclude_from_nav` | Whether the level is excluded from navigation. |
| `image_scales` | The image scales of the level. |

Each benefit in `benefits` has these keys:

| Key | Description |
| --- | --- |
| `id` | ID of the benefit. |
| `title` | Title of the benefit. |
| `description` | Description of the benefit. |
| `levels` | An object that maps the ID of each level to the value of the benefit for that level. |

The following example shows the structure of the response, with one level and one benefit.

```json
{
  "@id": "https://example.org/Plone/sponsors-db",
  "items": [
    {
      "@id": "https://example.org/Plone/sponsors-db/gold",
      "id": "gold",
      "title": "Gold",
      "items": [],
      "has_sponsors": false,
      "exclude_from_nav": false,
      "image_scales": {}
    }
  ],
  "benefits": [
    {
      "id": "booth",
      "title": "Booth",
      "description": "A booth in the sponsors area.",
      "levels": {
        "gold": "Large"
      }
    }
  ]
}
```

## `@registration`

Tells whether the event takes registrations, and lets visitors register, cancel and confirm their email address.
It answers `404` when the event has no Attendees database.

**Permission:** `zope2.Public`

### Get the registration status

```http
GET /Plone/@registration HTTP/1.1
Accept: application/json
```

| Key | Description |
| --- | --- |
| `state` | The state of the Attendees database: `created`, `open` or `closed`. |
| `open` | `true` when the event takes registrations: the database is open and the deadline has not passed. |
| `closes_at` | The registration deadline, in ISO 8601, or `null`. |
| `expired` | `true` once the deadline has passed, even while `state` is still `open`. |
| `allow_anonymous_registration` | Whether visitors without an account can register. |
| `registration_confirmation` | `automatic`, `email` or `manual`. |
| `requires_ticket` | `true` when the event has tickets. |
| `tickets` | The tickets available now, in the order of the Attendees database. |
| `registration` | The registration of the current user, or `null`. |
| `defaults` | For a logged-in user without a registration: the first name, last name and email address of the account. |

A ticket has the keys `UID`, `title`, `description` and `admission`.

A registration has the keys `code`, `state`, `first_name`, `last_name`, `email`, `email_verified` and `ticket`.
Its `ticket` is `null` when it has none.

### Register

```http
POST /Plone/@registration HTTP/1.1
Accept: application/json
Content-Type: application/json

{
  "first_name": "Ada",
  "last_name": "Lovelace",
  "email": "ada@example.org"
}
```

A logged-in user may leave out any field to use the value of the account.
For an event with tickets, send the `UID` of the chosen ticket as `ticket`; with only one available, you may leave it out.
The answer is `201`, with the registration.

| Status | Error type | When |
| --- | --- | --- |
| `400` | `BadRequest` | A field is missing, the email address is invalid, or the ticket is not available. |
| `401` | `Unauthorized` | An anonymous visitor, when anonymous registration is off. |
| `403` | `RegistrationClosed` | The Attendees database is not open. |
| `403` | `RegistrationDeadlinePassed` | The registration deadline has passed. |
| `403` | `TicketsUnavailable` | The event has tickets, but none is available now. |
| `404` | `NotFound` | The event has no Attendees database. |
| `409` | `Conflict` | The email address, or the account, is already registered for the event. |

### Cancel a registration

`POST /Plone/@registration/cancel` cancels the registration of the logged-in user.
It answers `401` for anonymous visitors, `404` without a registration, and `409` once the attendee checked in.

### Confirm an email address

`POST /Plone/@registration/verify` with `{"token": "…"}` confirms the email address of a registration.
The token comes from the link in the email and expires after 48 hours.
Under the `automatic` and `email` policies, this also confirms the registration.
It answers `400` with the `InvalidToken` error type for an invalid or expired token.

A registration whose email address was confirmed is linked to the account with that email address the next time its owner uses the endpoint while logged in.

## `@attendees`

Lists the registrations of an Attendees database, with their email addresses, for the organizers.

**Permission:** `Modify portal content` or `Review portal content` on the Attendees database.
The database is public once opened, so viewing it is not enough; other users get `401`.
Only an Attendees database has this endpoint; anywhere else it answers `404`.

```http
GET /Plone/registrations/@attendees?review_state=pending HTTP/1.1
Accept: application/json
```

The optional `review_state` parameter lists only the registrations in that state.
The answer has the keys of the registration status, and these:

| Key | Description |
| --- | --- |
| `items` | The registrations, sorted by name, each with `title`, `UID` and `ticket`. |
| `items_total` | The number of registrations listed. |
| `counts` | The number of registrations in each state. |
| `can_review` | Whether the current user can change the state of the registrations. |
