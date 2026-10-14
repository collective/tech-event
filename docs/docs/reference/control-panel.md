---
myst:
  html_meta:
    "description": "Control panel settings of Tech Event Support for Plone: the TechEvent Settings form and its registry record."
    "property=og:description": "Control panel settings of Tech Event Support for Plone: the TechEvent Settings form and its registry record."
    "property=og:title": "Control panel"
    "keywords": "Plone, tech event, control panel, registry, settings"
---

(control-panel)=

# Control panel

The backend adds one control panel form to Site Setup.

## TechEvent Settings

The form is in the **General** category of Site Setup, with the label **TechEvent Settings**.
It stores one setting in the Plone registry.

| Field | Registry record | Type | Default | Description |
| --- | --- | --- | --- | --- |
| Should we support multiple events | `collective.techevent.settings.support_multiple_events` | Boolean | `False` | When selected, the site adds the Tech Event content type. |

The interface class is `collective.techevent.controlpanel.tech_event.ITechEventSettings`.
Its registry prefix is `collective.techevent.settings`.

The setting selects the mode of the site.
For what each mode changes, see {ref}`about-single-and-multiple-events`.

```{note}
Saving the setting applies the configuration of the selected mode immediately, as described in {doc}`/how-to-guides/enable-multiple-events`.
```
