# Tech Event Support for Plone (collective.techevent)

`collective.techevent` is a Plone add-on for building tech event sites: conferences, symposiums and seminars.
It provides the content types, the behaviors, the vocabularies and the REST endpoints that a tech event needs.

The add-on is designed to be used with the Volto add-on [@plone-collective/volto-techevent](https://www.npmjs.com/package/@plone-collective/volto-techevent), which provides the user interface.

Read the documentation at [collective.github.io/tech-event](https://collective.github.io/tech-event/).

## Features

-   **Event**: one edition of the event, with its dates, tracks, levels, audiences and durations.
    The site itself is the event, or each edition is a Tech Event item.
-   **Schedule**: a container for the slots of the program.
    Slots are talks, keynotes, trainings, lightning talks, open spaces, meetings, breaks and general slots.
-   **Presenters**: the people who take part in the event, with their biography, email address and labels.
-   **Locations**: venues, and rooms inside each venue.
-   **Sponsors**: a sponsors database with the benefits, the sponsorship levels and the sponsors.
-   **REST endpoints** on the event root:
    -   `@schedule` returns the published slots, grouped by day and by room.
    -   `@sponsors` returns the published sponsors, grouped by sponsorship level, with the benefits of each level.

## Supported versions

Plone 6.1 and 6.2, on Python 3.11 to 3.14 (Python 3.14 requires Plone 6.2).

## Installation

Add the package to your project's dependencies.

```shell
uv add collective.techevent
```

The add-on loads through the `plone.autoinclude.plugin` entry point.
If your project loads its ZCML explicitly, add the include to your configuration.

```xml
<include package="collective.techevent" />
```

Restart the backend after you install the package.

Then install the profile **Tech Event for Plone: Install** in the Add-ons control panel of the Plone site.
The profile **Tech Event for Plone: Demo content** adds example content, which is useful to explore the add-on.

## Frontend

Install the Volto add-on in your frontend project, with pnpm.

```shell
pnpm add @plone-collective/volto-techevent
```

Your project also brings its own Volto theme.
The add-on is tested with `@kitconcept/volto-light-theme` version 8.0.0.

## Documentation

-   [Concepts](https://collective.github.io/tech-event/concepts/): how an event site is built.
-   [Tutorial](https://collective.github.io/tech-event/tutorials/first-event.html): create your first event.
-   [How-to guides](https://collective.github.io/tech-event/how-to-guides/): install, configure and run an event.
-   [Reference](https://collective.github.io/tech-event/reference/): content types, behaviors, endpoints and settings.

## Contribute

-   [Issue tracker](https://github.com/collective/tech-event/issues)
-   [Source code](https://github.com/collective/tech-event)

To set up a development environment, clone the repository and run `make install` in the root of the repository.
Run `make test` in the `backend` folder to run the tests.

## License

GPL-2.0-only.
