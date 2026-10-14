# Tech Event Support for Plone (@plone-collective/volto-techevent)

`@plone-collective/volto-techevent` is a Volto add-on with the components for a tech event site: conferences, symposiums and seminars.
It shows the schedule, the presenters, the sessions and the sponsors of an event.

It needs the backend add-on [collective.techevent](https://pypi.org/project/collective.techevent) in your Plone site.

Read the documentation at [collective.github.io/tech-event](https://collective.github.io/tech-event/).

## Features

### Views

The add-on provides views for these content types: Talk, Keynote, Training, Open Space, Lightning Talks, Presenter, Break, Slot, Meeting and Sponsor.

### Blocks

The blocks are in the **Event** and **Event Sponsors** groups of the block chooser.

-   **Schedule**: shows the schedule of the event, for one day or for several days.
-   **Sponsors Showcase**: shows the sponsors of all levels.
-   **Sponsor Level**: shows the sponsors of one level.
-   **Level Benefits**: shows the benefits of one level.
-   **Level Comparison**: compares the levels and their benefits.

### Listings

The Listing block has grid templates for presenters, keynotes, talks and trainings.

## Supported versions

Volto 19, with Plone 6.1 or 6.2.

## Installation

Install the add-on with pnpm.

```shell
pnpm add @plone-collective/volto-techevent
```

Add the add-on to the `addons` list in the `package.json` of your project.

```json
{
  "addons": [
    "@plone-collective/volto-techevent"
  ]
}
```

### Theme

The add-on does not depend on a theme.
Your project brings its own theme.
The add-on is tested with `@kitconcept/volto-light-theme` version 8.0.0, so add it to your project and list it in `addons` before the Tech Event add-on.

```shell
pnpm add @kitconcept/volto-light-theme@^8.0.0
```

### Backend

Install `collective.techevent` in the backend of your project, and install its profile in the Plone site.
See the [installation guide](https://collective.github.io/tech-event/how-to-guides/install-the-add-on.html) for the steps.

## Customize the styles

Override the CSS custom properties in your project's theme, for example in `src/theme/theme.css`.

```css
:root {
  /* Schedule */
  --techevent-schedule-color: rgb(1, 106, 173);
  --techevent-schedule-border-color: #ccc;
  --techevent-schedule-room-color: #000;
  --techevent-schedule-gap: 2px;

  /* Session tile */
  --techevent-sessionTile-background-color: #ecebeb;
  --techevent-sessionTile-color: #000;

  /* Sponsor tile */
  --techevent-sponsortile-border-radius: 0.5rem;
  --techevent-sponsortile-padding: 7px;
}
```

## Contribute

-   [Issue tracker](https://github.com/collective/tech-event/issues)
-   [Source code](https://github.com/collective/tech-event)

This add-on is developed with pnpm workspaces.
Run `make install` in the root of the repository, then `make frontend-start` to start Volto.

## License

MIT.

## Development

The `frontend` folder of the repository is the Volto project that develops and tests this add-on, in `packages/volto-techevent`.

### Prerequisites

-   An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned.
-   [nvm](https://6.docs.plone.org/install/create-project-cookieplone.html#nvm)
-   [Node.js 22 and pnpm](https://6.docs.plone.org/install/create-project.html#node-js)
-   [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
-   [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
-   [Docker](https://docs.docker.com/get-started/get-docker/) (optional)

### Install

Run the following commands in the root of the repository, not in this folder.

```shell
make install
```

### Start developing

Start the backend in one terminal.

```shell
make backend-start
```

In a second terminal, start the frontend at http://localhost:3000/.

```shell
make frontend-start
```

### Make commands

Run `make help` in this folder to list the commands.

| Command | Description |
| --- | --- |
| `make install` | Install the add-on in a development environment. |
| `make start` | Start Volto, with reloading of the add-on. |
| `make build` | Build a production bundle. |
| `make format` | Format the code with ESLint, Prettier and Stylelint, in fix mode. |
| `make lint` | Lint the code with ESLint, Prettier and Stylelint, in check mode. |
| `make typecheck` | Check the TypeScript types. |
| `make test` | Run the unit tests in watch mode. |
| `make ci-test` | Run the unit tests once, as CI does. |
| `make i18n` | Update the translation catalogs. |
| `make storybook-start` | Start Storybook on port 6006. |
| `make storybook-build` | Build the static Storybook. |

The add-on lives in `packages/volto-techevent`, and the `core` folder is the Volto checkout that mrs-developer manages.
