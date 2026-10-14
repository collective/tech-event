---
myst:
  html_meta:
    "description": "Frontend settings of the Volto add-on Tech Event Support for Plone, from config/settings.ts."
    "property=og:description": "Frontend settings of the Volto add-on Tech Event Support for Plone, from config/settings.ts."
    "property=og:title": "Frontend settings"
    "keywords": "Volto, tech event, settings, apiExpanders, reference"
---

(frontend-settings)=

# Frontend settings

The Volto add-on changes the Volto configuration in `src/config/settings.ts`.

## Expand the event settings

The add-on adds one entry to `config.settings.apiExpanders`.
The entry matches every content path, and it asks `plone.restapi` to expand the behavior `collective.techevent.event_settings`.
The expansion is merged with the `expand.inherit.behaviors` value of the request, when the request already has one.

As a result, every content item returns the event settings, such as the tracks, levels and dates of the event.

```{note}
The expander uses the `inherit` expansion of `plone.restapi`.
Your project must keep this expansion enabled.
```
