---
myst:
  html_meta:
    "description": "Plan the content structure of a typical tech conference with Tech Event Support for Plone, from the about pages to the full schedule."
    "property=og:description": "Plan the content structure of a typical tech conference with Tech Event Support for Plone, from the about pages to the full schedule."
    "property=og:title": "Plan the content structure"
    "keywords": "Plone, tech conference, content structure, schedule, sponsors, venues"
---

# Plan the content structure

This guide shows you how to arrange the content of a typical tech conference, before you create it.
It describes one structure that works for a conference with training days, a main part with talks, and a sprint.
Use it as a starting point, and change it to fit your event.

The structure uses these abbreviations for content types.
CT stands for content type.

-   A typical conference has training days with parallel sessions, three main days of talks with one keynote per day, and a weekend sprint.
-   Each conference year gets its own website, or its own Tech Event item when you enable multiple events.
-   The training and the sprint can take place at a different venue than the main conference.

## The structure

The site starts with the pages that visitors need first.

-   **About**: CT Page, with text blocks and image blocks.
    -   **Venue**: CT Page, with a Listing block.
        -   **Main venue**: CT Venue, with a Listing block.
            -   **Main room**: CT Room.
    -   If you have only one venue, replace the Venue page with a single CT Venue.
-   **Sponsors**: CT SponsorsDB, with a Listing block that shows the levels, and a Sponsors block.
    -   **Organizers**: CT Sponsorship Level, with a Sponsor Level block.
        -   **Your organization**: CT Sponsor.
    -   **Other levels**, such as Platinum and Gold: CT Sponsorship Level, with a Sponsor Level block.
        -   Add a call to action that links to a page with a form or with information about how to become a sponsor.
        -   When someone becomes a sponsor, add a CT Sponsor inside the level.
-   **Travel**: CT Page, with text blocks about travel.
-   **Tickets**: CT Page, with text blocks about how to get tickets.

The schedule holds the program of the event.

-   **Schedule**: CT Schedule, with a Schedule block that shows the three main days.
    -   **Keynotes**: CT Page, with a Listing block.
        -   For each keynote, add a CT Keynote.
    -   **Talks**: CT Page, with a Search block that filters on the types Talk and Lightning Talks.
        -   For each talk, add a CT Talk.
        -   For each lightning talk session, add a CT Lightning Talks.
    -   **Speakers**: CT Page, with a Search block that filters on the type Presenter.
        -   For each speaker, add a CT Presenter.
    -   **Training**: CT Page, with a Schedule block that shows only the two training days.
        -   For each training, add a CT Training.
    -   **Open spaces**: CT Page, with a Search, Listing or Schedule block, depending on how many open spaces you have.
        Exclude the page from navigation, or delete it, if you have none.
        -   For each open space, add a CT Open Space.
    -   **Sprint**: CT Page, with a Listing block.
        -   For each sprint day, add a CT Page, or add text blocks to the sprint page.
    -   **Breaks**: CT Page, optionally with a Listing block, excluded from navigation.
        -   For each coffee break or lunch, add a CT Break.
    -   **Slots**: CT Page, optionally with a Listing block, excluded from navigation.
        -   For each general moment, such as registration or the conference photo, add a CT Slot.
    -   **Full schedule**: CT Page, with a Schedule block that does not filter on days.
    -   **Meetings**, optional: CT Page, with a Search block that filters on the type Meeting.
        -   For each meeting, add a CT Meeting.
        -   Use a meeting for an annual general meeting, or add the same content as a CT Talk.

```{seealso}
The Sponsors and the Schedule pages use the blocks and the content types described in {doc}`/reference/content-types` and {doc}`/reference/blocks-and-views`.
```
