---
myst:
  html_meta:
    "description": "Vocabularies of Tech Event Support for Plone: the names, sources and values of the selection lists of the event."
    "property=og:description": "Vocabularies of Tech Event Support for Plone: the names, sources and values of the selection lists of the event."
    "property=og:title": "Vocabularies"
    "keywords": "Plone, tech event, vocabularies, selection lists, reference"
---

(vocabularies)=

# Vocabularies

The backend registers these vocabularies under the `collective.techevent.vocabularies` prefix.
A vocabulary that reads its terms from the event comes from the nearest event root.

## Terms from the event settings

| Vocabulary | Source | Used by |
| --- | --- | --- |
| `session_tracks` | `tracks` of the event | Session track |
| `session_levels` | `levels` of the event | Session level |
| `session_audiences` | `audience` of the event | Session audience |
| `durations_keynote` | `durations_keynote` of the event | Keynote duration |
| `durations_talk` | `durations_talk` of the event | Talk duration |
| `durations_training` | `durations_training` of the event | Training duration |

## Terms from the content

| Vocabulary | Source | Used by |
| --- | --- | --- |
| `slot_rooms` | Rooms in the event, in position order | Room of a slot |
| `presenters` | Presenters in the event | Presenters of a session |
| `presenter_labels` | Fixed list | Categories of a presenter |
| `sponsorship_levels` | Levels of the sponsors database | Sponsor level |
| `sponsorship_benefits` | Benefits of the sponsors database | Benefit of a sponsorship level |

## Fixed terms

| Vocabulary | Terms |
| --- | --- |
| `slot_categories` | `slot`, `registration`, `meeting`, `photo` |
| `break_categories` | `coffee-break`, `lunch` |
| `session_categories` | `activity` |
| `presenter_labels` | `keynote-speaker`, `speaker`, `instructor`, `pf-member` |
