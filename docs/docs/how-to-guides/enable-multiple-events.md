---
myst:
  html_meta:
    "description": "Enable multiple events in a Plone site, so that each year of a tech event gets its own Tech Event item."
    "property=og:description": "Enable multiple events in a Plone site, so that each year of a tech event gets its own Tech Event item."
    "property=og:title": "Enable multiple events"
    "keywords": "Plone, tech event, multiple events, Tech Event, control panel"
---

# Enable multiple events

This guide shows you how to run several editions of your tech event in one Plone site.
For the difference between the two modes, see {ref}`about-single-and-multiple-events`.

## Turn on the setting

1.  Open the Site Setup and choose **TechEvent Settings**.
2.  Check **Should we support multiple events**.
3.  Save the form.

The setting is stored as `collective.techevent.settings.support_multiple_events`.

## What changes when you save

Saving the setting applies the configuration right away.
In multiple events mode, the Plone site no longer holds the event settings, the Tech Event content type becomes addable, and the permissions move to the events.
Turning the setting off again restores single event mode.

```{warning}
Changing the mode changes the content type settings and the permissions of the site.
Make a backup before you change it on a site with content.
```

## Add an edition

1.  Add a **Tech Event** at the root of the site, titled with the year of the edition, for example `Tech Event 2027`.
2.  Open the edition and fill in the **Event Settings** fieldset: the start and end time, tracks, levels, audiences and durations.
3.  Add the **Schedule**, the venues and the sponsors inside the edition.

Each edition keeps its own settings and its own content.
Content in one edition does not use the tracks or the rooms of another edition.

## Check the mode

Open the **Add** menu at the root of the site.
In multiple events mode, the **Tech Event** type is available.
In single event mode, you add the schedule and the other event content directly to the site.
