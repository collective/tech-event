---
myst:
  html_meta:
    "description": "Add sponsors to a tech event: define the benefits, create the sponsorship levels and add each sponsor to its level."
    "property=og:description": "Add sponsors to a tech event: define the benefits, create the sponsorship levels and add each sponsor to its level."
    "property=og:title": "Add sponsors"
    "keywords": "Plone, tech event, sponsors, sponsorship levels, benefits"
---

# Add sponsors

This guide shows you how to set up the sponsors of an event.
The sponsors live in a Sponsors Database, which holds the benefits, the levels and the sponsors.

## Create the sponsors database

Add a **SponsorsDB** at the event root.
The event has only one sponsors database, so add it once for each edition.

## Define the benefits

Open the sponsors database and edit it.
Add a benefit for each item that a sponsorship can include, and give each benefit an ID, a title and a description.
The benefits are the rows of the comparison table of the sponsor levels.

Save the form.

## Create the sponsorship levels

Add a **SponsorLevel** inside the sponsors database for each level, for example Platinum, Gold and Silver.
Order the levels as you want them to appear, because the sponsors page shows them in that order.

For each level, fill in these fields:

-   **Color**, which the level uses in the page.
-   **Investment**, the price of the level as text.
-   **Benefits**, with one row for each benefit of the level.
    Choose the benefit, and add extra information if the benefit needs it.

A benefit that the level does not list is not shown as included in that level.

## Add the sponsors

Add a **Sponsor** inside the sponsorship level that the sponsor pays for.
Give the sponsor a title, a summary and a text.
The summary appears in the listings, and the text appears on the sponsor page.

Publish each sponsor that should appear on the event site.
The sponsors endpoint returns only the published sponsors.

## Show the sponsors on a page

Add a page and add one of these blocks, from the **Event Sponsors** group:

-   **Sponsors Showcase**, to show the sponsors of all levels.
-   **Sponsor Level**, to show the sponsors of one level.
-   **Level Benefits**, to show the benefits of one level.
-   **Level Comparison**, to show a table that compares the levels.

See {doc}`/reference/rest-api` for the data that the sponsors endpoint returns.
