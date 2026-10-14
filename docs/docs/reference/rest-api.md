---
myst:
  html_meta:
    "description": "REST endpoints of Tech Event Support for Plone: the @schedule and @sponsors endpoints on the event root, with request and response shapes."
    "property=og:description": "REST endpoints of Tech Event Support for Plone: the @schedule and @sponsors endpoints on the event root, with request and response shapes."
    "property=og:title": "REST API"
    "keywords": "Plone, tech event, REST API, @schedule, @sponsors, plone.restapi"
---

(rest-api)=

# REST API

The backend adds two endpoints to the event root.
The event root is the Plone site in single event mode, and a Tech Event item in multiple events mode.
Both endpoints are available with `GET` and need no request body.

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
