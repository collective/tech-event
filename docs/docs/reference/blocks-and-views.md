---
myst:
  html_meta:
    "description": "Blocks, views and listing templates of the Volto add-on Tech Event Support for Plone."
    "property=og:description": "Blocks, views and listing templates of the Volto add-on Tech Event Support for Plone."
    "property=og:title": "Blocks and views"
    "keywords": "Volto, tech event, blocks, views, listing, reference"
---

(blocks-and-views)=

# Blocks and views

The Volto add-on `@plone-collective/volto-techevent` registers these blocks, views and listing templates.

## Blocks

The blocks are in two groups: **Event** and **Event Sponsors**.

| Block | Group | Block type | Description |
| --- | --- | --- | --- |
| Schedule | Event | `scheduleBlock` | Shows the schedule from the `@schedule` endpoint. Options: title, show the day index, filter by day. |
| Sponsors Showcase | Event Sponsors | `sponsorsShowcaseBlock` | Shows the sponsors of all levels. |
| Sponsor Level | Event Sponsors | `sponsorLevelBlock` | Shows the sponsors of one level. |
| Level Benefits | Event Sponsors | `levelBenefitsBlock` | Shows the benefits of one level. |
| Level Comparison | Event Sponsors | `levelComparisonBlock` | Shows a table that compares the levels and their benefits. |

The sponsor blocks read the data from the `@sponsors` endpoint.
The Schedule block reads the data from the `@schedule` endpoint.

## Views

Each content type has a view.
The views are registered for these portal types.

| Portal type | View |
| --- | --- |
| Break | Slot view |
| Keynote | Session view |
| LightningTalks | Lightning talks view |
| Meeting | Slot view |
| OpenSpace | Session view |
| Presenter | Presenter view |
| Slot | Slot view |
| Sponsor | Sponsor view |
| Talk | Session view |
| Training | Session view |

## Listing templates

The Listing block can show presenters and sessions in a grid.
These templates are registered for the types below.

| Portal type | Template |
| --- | --- |
| Presenter | Presenter grid item |
| Keynote | Session grid item |
| Talk | Session grid item |
| Training | Session grid item |

## Routes

The add-on registers the route `/attendee-login`, which is also excluded from the content routes.
