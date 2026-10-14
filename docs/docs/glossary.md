---
myst:
  html_meta:
    "description": "Terms and definitions used in the documentation of Tech Event Support for Plone."
    "property=og:description": "Terms and definitions used in the documentation of Tech Event Support for Plone."
    "property=og:title": "Glossary"
    "keywords": "Plone, tech event, glossary, term, definition"
---

(glossary-label)=

# Glossary

```{glossary}
:sorted: true

Plone
    [Plone](https://plone.org/) is an open-source content management system that is used to create, edit, and manage digital content, like websites, intranets and custom solutions.
    It comes with over 20 years of growth, optimisations, and refinements.

add-on
    An add-on in Plone extends its functionality.
    It is code that is released as a package to make it easier to install.

    In Volto, an add-on is a JavaScript package.

    In Plone core, an add-on is a Python package.

Tech event
    One edition of a conference, symposium or seminar, with its program, its venues and its sponsors.

Event root
    The item that holds the settings of an event.
    It is the Plone site in single event mode, and a Tech Event item in multiple events mode.

Schedule
    The container for the slots of an event.
    The schedule is published through the `@schedule` endpoint.

Slot
    Anything with a start time, an end time and an optional room on the schedule.

Session
    A slot that is part of the program, such as a talk, a keynote or a training.

Presenter
    A person who takes part in an event.

Venue
    A place where an event happens.
    A venue holds rooms.

Room
    A room of a venue.
    Each room is a column of the schedule.

Track
    A theme of the program, with its own color.

SponsorsDB
    The container of the sponsorship levels, the sponsors and the benefits of an event.

Sponsorship level
    A group of sponsors that pay the same investment and receive the same benefits.

Sponsor
    A company or a person that supports an event.

Plone Sphinx Theme
plone-sphinx-theme
    [Plone Sphinx Theme](https://plone-sphinx-theme.readthedocs.io/) is a Sphinx theme for [Plone 6 Documentation](https://6.docs.plone.org/), [Plone Conference Training](https://training.plone.org/), and documentation of various Plone packages.
    This documentation uses Plone Sphinx Theme.

Markedly Structured Text
MyST
    [Markedly Structured Text (MyST)](https://myst-parser.readthedocs.io/en/latest/) is a rich and extensible flavor of Markdown, for authoring Plone Documentation.
    The pages of this documentation are written in MyST.

Sphinx
    [Sphinx](https://www.sphinx-doc.org/en/master/) is a tool that makes it easy to create intelligent and beautiful documentation.
    It can generate multiple output formats, including HTML and PDF, from a single source.
```
