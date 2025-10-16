# Tech Event Support for Plone (@plone-collective/volto-techevent)

Volto components to implement a tech event (conference / symposium / seminar) frontend for the Plone CMS.

[![npm](https://img.shields.io/npm/v/@plone-collective/volto-techevent)](https://www.npmjs.com/package/@plone-collective/volto-techevent)
[![](https://img.shields.io/badge/-Storybook-ff4785?logo=Storybook&logoColor=white&style=flat-square)](https://collective.github.io/tech-event/)
[![CI](https://github.com/collective/tech-event/actions/workflows/main.yml/badge.svg)](https://github.com/collective/tech-event/actions/workflows/main.yml)


## Features

### Content type views

- `Keynote`, `Talk`, `Training`, `Open Space`
- `Lightning Talks`
- `Presenter`
- `Break`, `Slot`, `Meeting`
- `Sponsor`

The content types `Venue`, `Room`, `SponsorsDB`, `SponsorLevel`, and `Schedule` use blocks.

### Blocks
- **Schedule Block**: present the schedule of a day — or multiple days — of the event.
- **Packages and Sponsors**: list sponsors grouped by package level.
- **Package Comparison**: comparison of package level benefits.
- **Package Benefits**: list benefits of a package level.
- **Sponsors List**: list of sponsors for a package level.

### Grid listing variations
- Content types: Talk, Training, Keynote, Presenter

### Actions and reducers
- Support for sponsors and registration endpoints.

## See it in action

- [Python Cerrado 2025](https://2025.pythoncerrado.org)
- [Plone Conference 2025](https://2025.ploneconf.org)
- [Python Brasil 2025](https://2025.pythonbrasil.org.br)

## Installation

To install this addon a project, add `@plone-collective/volto-techevent` to the `package.json` to the main package of your project.

```json
"addons": {
    "@plone-collective/volto-techevent"
},
"dependencies": {
    "@plone-collective/volto-techevent": "*"
}
```

Ensure `@kitconcept/volto-light-theme` as the default theme on your project by editing `volto.config.js`.

```javascript
const theme = '@kitconcept/volto-light-theme';
```

### Backend add-on

`@plone-collective/volto-techevent` requires the installation of its sibling add-on, `collective.techevent` on the backend.

### Test installation

Visit http://localhost:3000/ in a browser, login, and check the awesome new features.

## Customize it in your project

The easiest way to customize the design of this package is by using CSS Custom Properties (CSS variables).
Override these variables in your project's theme (for example, src/theme/theme.css or app.less).

```css
:root {
  /* SponsorTile */
  --techevent-sponsortile-background-main: transparent;
  --techevent-sponsortile-min-width: 200px;
  --techevent-sponsortile-max-width: 400px;
  --techevent-sponsortile-align-items: center;
  --techevent-sponsortile-justify-content: center;
  --techevent-sponsortile-border-width: 1px;
  --techevent-sponsortile-border-style: solid;
  /* --techevent-sponsortile-border-color: <color>; */
  --techevent-sponsortile-border-radius: 0.5rem;
  --techevent-sponsortile-margin: 0.5rem;
  /* --techevent-sponsortile-box-shadow: 0px 3px 16px 0px #000; */
  --techevent-sponsortile-padding: 7px;

  /* SponsorTile (hover) */
  --techevent-sponsortile-hover-border-width: 1px;
  --techevent-sponsortile-hover-border-style: solid;
  /* --techevent-sponsortile-hover-border-color: <color>; */
  --techevent-sponsortile-hover-border-radius: 0.5rem;
  --techevent-sponsortile-hover-margin: 0.5rem;
  /* --techevent-sponsortile-hover-box-shadow: 0px 3px 16px 0px #000; */

  /* SponsorLevel */
  /* Title */
  /* --techevent-sponsorlevel-title-color: <color>; */
  /* --techevent-sponsorlevel-title-border-color: <color>; */
  /* --techevent-sponsorlevel-title-before-background: <color>; */
  --techevent-sponsorlevel-title-padding: 0 0 1rem 0;
  --techevent-sponsorlevel-title-margin: 1.2rem 0;
  --techevent-sponsorlevel-title-border-bottom-style: solid;
  --techevent-sponsorlevel-title-border-bottom-width: 1px;
  --techevent-sponsorlevel-title-before-height: 3px;
  --techevent-sponsorlevel-title-before-width: 400px;

  /* Presenter */
  /* PresenterCategory */
  --techevent-presenter-category-background-color: #ccc;
  --techevent-presenter-category-color: #000;

  --techevent-vocabulary-foreground-color: #fff;
  /* Track foreground color */
  --techevent-session-track-foreground-color: #fff;

  /* Schedule */
  --techevent-schedule-color: rgb(1, 106, 173);
  --techevent-schedule-border-color: #ccc;
  --techevent-schedule-room-color: #000;
  --techevent-schedule-secondary-color: #ccc;
  --techevent-schedule-reverse-color: #fff;
  --techevent-schedule-gap: 2px;

  /* SessionTile */
  --techevent-sessionTile-background-color: #ecebeb;
  --techevent-sessionTile-color: #000;
}
```

## Contribute

This add-on is developed with pnpm workspaces and targets Volto 18. It requires pnpm for development.

### Prerequisites ✅

-   An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned.
-   [nvm](https://6.docs.plone.org/install/create-project-cookieplone.html#nvm)
-   [Node.js and pnpm](https://6.docs.plone.org/install/create-project.html#node-js) 22
-   [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
-   [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
-   [Docker](https://docs.docker.com/get-started/get-docker/) (optional)

### Installation 🔧

1. Clone this repository, then change your working directory.

    ```shell
    git clone git@github.com:collective/tech-event.git
    cd tech-event
    ```

2. Install this code base.

    ```shell
    make install
    ```

### Make convenience commands

Run `make help` to list the available Make commands.

### Start developing

Start the backend.

```shell
make backend-start
```

In a separate terminal session, start the frontend.

```shell
make frontend-start
```

### Lint code

Run ESLint, Prettier, and Stylelint in check mode.

```shell
make lint
```

### Format code

Run ESLint, Prettier, and Stylelint in fix mode.

```shell
make format
```

### i18n

Extract translation messages.

```shell
make i18n
```

### Unit tests

Run unit tests.

```shell
make test
```

## License

The project is licensed under the MIT license.
