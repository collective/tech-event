---
myst:
  html_meta:
    "description": "How the backend add-on collective.techevent and the Volto add-on @plone-collective/volto-techevent fit together."
    "property=og:description": "How the backend add-on collective.techevent and the Volto add-on @plone-collective/volto-techevent fit together."
    "property=og:title": "About the backend and the frontend"
    "keywords": "Plone, Volto, collective.techevent, volto-techevent, plone.restapi, backend, frontend"
---

(about-backend-and-frontend)=

# About the backend and the frontend

Tech Event Support for Plone has two parts that you install together.
The backend is the Plone add-on `collective.techevent`.
The frontend is the Volto add-on `@plone-collective/volto-techevent`.

## The backend

The backend stores the event.
It provides the content types, the behaviors that add event fields to existing content, the vocabularies that feed the selection lists, and the control panel.
It also provides two REST endpoints on the event root: `@schedule` and `@sponsors`.

The backend works without the frontend, because the REST endpoints return all the data as JSON.
The user interface, however, is only provided by the frontend.

## The frontend

The frontend shows the event.
It provides the views for each content type, the blocks that editors add to pages, such as the Schedule block and the sponsor blocks, and the listing templates that show presenters and sessions in a grid.

The frontend needs the backend.
Without the backend content types, the views have no content to show, and the blocks cannot read the schedule or the sponsors.

## How they talk to each other

The frontend requests content from Plone through `plone.restapi`, as any Volto add-on does.
For the event settings, it asks `plone.restapi` to expand the `collective.techevent.event_settings` behavior on every content item.
That is how a page knows the tracks, levels and dates of the event without a second request.

The schedule and sponsor blocks call `@schedule` and `@sponsors` on the event root.
The frontend does not compute the schedule layout itself, because the backend already returns the day groups, the room columns and the grid positions.

## Theme and styling

The Volto add-on adds its own styles for the schedule, the sponsors and the presenters.
It does not bring a theme.
Your project brings its own theme, and the tested theme is `@kitconcept/volto-light-theme` version 8.0.0.
See {doc}`/how-to-guides/configure-the-volto-add-on` for the details.
