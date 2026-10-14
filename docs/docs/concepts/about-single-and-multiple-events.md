---
myst:
  html_meta:
    "description": "Why a site can hold one tech event or many, and what changes between the single event and multiple events modes."
    "property=og:description": "Why a site can hold one tech event or many, and what changes between the single event and multiple events modes."
    "property=og:title": "About single and multiple events"
    "keywords": "Plone, tech event, multiple events, single event, support_multiple_events"
---

(about-single-and-multiple-events)=

# About single and multiple events

A Plone site can host one tech event, or it can host many editions of the event side by side.
The control panel setting Should we support multiple events chooses between these two modes.
The setting is stored as `collective.techevent.settings.support_multiple_events`.

## Single event

By default, the event settings belong to the Plone site.
The site itself is the event root, so the schedule, the sponsors and the rooms live directly under the site.
This mode suits an organization that runs one event on one website.

## Multiple events

When the setting is on, the site stops holding the event settings.
Instead, you add a Tech Event item for each edition, for example one for each year.
Each Tech Event holds its own dates, tracks, levels, schedule and sponsors.
This mode suits an organization that runs a yearly conference and keeps the earlier editions online.

## How content finds its event

Content that belongs to an event does not store a reference to its event.
It looks for the nearest event root, walking up through its parent folders until it finds an item that provides the event settings.
In single event mode, that is the Plone site.
In multiple events mode, it is the Tech Event that contains the content.

This lookup is why a Room, a Track or a Level always comes from the edition where it is placed.
Two editions never share their tracks, unless you create the same track in each of them.

## Trade-offs

The single event mode has less to configure, and its URLs are shorter.
The multiple events mode keeps the history of the site, but each edition has its own schedule and sponsors to maintain.
Choose the mode before you add content.
Moving content from one mode to the other is not covered by this documentation.
