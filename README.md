# Tech Event Support for Plone 🚀

Monorepo for building tech event sites (conference/symposium/seminar) with Plone 6 and Volto.

- Backend: [collective.techevent](https://pypi.org/project/collective.techevent) (Plone add-on) provides content types, behaviors, and REST endpoints (e.g., /@schedule, /@sponsors).
- Frontend: [@plone-collective/volto-techevent](https://www.npmjs.com/package/@plone-collective/volto-techevent) (Volto add-on) provides the UI: views, blocks, schedule, sponsors, listings, etc.
- Relationship:
  - The frontend requires the backend to be installed and activated in Plone.
  - The backend is intended to be used with the Volto addon for the full UX.

[![Built with Cookieplone](https://img.shields.io/badge/built%20with-Cookieplone-0083be.svg?logo=cookiecutter)](https://github.com/plone/cookieplone-templates/)
[![CI](https://github.com/collective/tech-event/actions/workflows/main.yml/badge.svg)](https://github.com/collective/tech-event/actions/workflows/main.yml)


## Quick Start 🏁

### Prerequisites ✅

- An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned
- [uv](https://6.docs.plone.org/install/create-project-cookieplone.html#uv)
- [nvm](https://6.docs.plone.org/install/create-project-cookieplone.html#nvm)
- [Node.js 22 and pnpm](https://6.docs.plone.org/install/create-project.html#node-js)
- [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
- [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
- [Docker](https://docs.docker.com/get-started/get-docker/) (optional)

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

### Fire Up the Servers 🔥

1. Create a new Plone site on your first run.

    ```shell
    make backend-create-site
    ```

2. Start the backend at http://localhost:8080/.

    ```shell
    make backend-start
    ```

3. In a new shell session, start the frontend at http://localhost:3000/.

    ```shell
    make frontend-start
    ```

Voilà! Your Plone site should be live and kicking! 🎉

### Example content structure

This example is useful for a typical Plone conference:

* first two days of training, with parallel training sessions
* then the main part with three days of talks, and one keynote per day
* then a weekend with a sprint (coding and organising together)
* each conference year gets its own website
* multiple venues: typically training and sprint are in a different location than the main conference

The next content structure would work for this.
We will use CT as abbreviation for "content type".

* About: CT Page.  So: create an instance of content type Page, with as title: "About".  Add some text blocks and image blocks, etc, in here.
  * Venue: CT Page, with a Listing block
    * Main venue: CT Venue with a Listing block
      * Main room: CT Room
    * If you have only one venue, you can replace the "Venue" CT Page with a single CT Venue.
* Sponsors: CT Sponsors Database, with Listing block (to show the levels) and Packages & Sponsors block
  * Organizers: CT Sponsorship Level, with Sponsor Level block
    * Your organization: CT Sponsor
  * Other levels (Platinum, Gold, ...): CT Sponsorship Level, with Sponsor Level block.  In this block you can optionally configure a Call To Action pointing to a page with a form or info on how to become a sponsor.
    * If someone becomes a sponsor, you would add a CT Sponsor within the Sponsorship Level.
* Travel: CT Page, with Text blocks with travel information.
* Tickets: CT Page, with Text blocks explaining how to get tickets.
* Schedule: CT Schedule, with a Schedule block configured to show the 3 main days
  * Keynotes: CT Page, with a Listing block
    * For each keynote: a CT Keynote
  * Talks: CT Page, with Search block with as criterion: Type = Talk or Lightning Talk
    * For each talk add a CT Talk.
    * For each lightning talk session add a CT Lightning Talk
  * Speakers: CT Page, with Search block with as criterion: Type = Presenter
    * For each speaker a CT Presenter
  * Training: CT Page, with a Schedule block configured to only show the two training days
    * For each training: a CT training
  * Open spaces: CT Page, with Search block or Listing block or Schedule block, depending on how many open spaces you have, if any.  You can exclude this from navigation or delete the Page if you don't have any.
    * For each open space, add a CT Open space
  * Sprint: CT Page, with a Listing block
    * For each sprint day: add a CT Sprint
    * or simply add some text blocks in the CT Page
  * Breaks: CT Page, optionally with Listing block, excluded from navigation
    * For each coffee or lunch break, add a CT Break
  * Slots: CT Page, optionally with Listing block, excluded from navigation
    * For each non-talk moment, add a CT Slot.
      This is for general slots like Registration and taking a conference photo.
  * Full schedule: CT Page, with a Schedule block not filtering on days
  * Optionally Meetings: CT Page, with a Search block with criterion Type = Meeting.
    * For each meeting add a CT Meeting.
    * This can be used for the Plone Foundation Annual General Meeting, but you can also create this as a CT Talk.


### Local Stack Deployment 📦

Deploy a local `Docker Compose` environment that includes:

- Docker images for Backend and Frontend 🖼️
- A stack with a Traefik router and a Postgres database 🗃️
- Accessible at [http://tech-event.localhost](http://tech-event.localhost) 🌐

Execute the following:

```shell
make stack-start
make stack-create-site
```

And... you're all set! Your Plone site is up and running locally! 🚀

## Project Structure 🏗️

This monorepo consists of the following sections:

- backend
  - Python package collective.techevent (Plone add-on)
  - Provides content types (Talk, Keynote, Training, Presenter, Schedule, Sponsor, etc.), behaviors, and REST endpoints (/@schedule, /@sponsors)
  - Intended to be used with the Volto addon for the UI
- frontend
  - Volto addon @plone-collective/volto-techevent
  - Provides blocks (Schedule, Sponsors, Packages), views, listings, and integrations
  - Requires the backend add-on to be installed in Plone
- docs
  - Project documentation

## Code Quality Assurance 🧐

To automatically format your code and ensure it adheres to quality standards, execute:

```shell
make check
```

### Format the codebase

To format the codebase, run:

```shell
make format
```

| Section | Tool | Description | Configuration |
| --- | --- | --- | --- |
| backend | Ruff | Python code formatting, imports sorting | [`backend/pyproject.toml`](./backend/pyproject.toml) |
| backend | zpretty | XML and ZCML formatting | -- |
| frontend | ESLint | Fixes most common frontend issues | [`frontend/.eslintrc.js`](./frontend/.eslintrc.js) |
| frontend | Prettier | Format JS and TypeScript code | [`frontend/.prettierrc`](./frontend/.prettierrc) |
| frontend | Stylelint | Format styles (CSS, Less, Sass) | [`frontend/.stylelintrc`](./frontend/.stylelintrc) |

Formatters can also be run within the backend or frontend folders.

### Linting the codebase

To lint the codebase, run:

```shell
make lint
```

| Section | Tool | Description | Configuration |
| --- | --- | --- | --- |
| backend | Ruff | Checks code formatting, imports sorting | [`backend/pyproject.toml`](./backend/pyproject.toml) |
| backend | Pyroma | Checks Python package metadata | -- |
| backend | check-python-versions | Checks Python version information | -- |
| backend | zpretty | Checks XML and ZCML formatting | -- |
| frontend | ESLint | Checks JS / TypeScript lint | [`frontend/.eslintrc.js`](./frontend/.eslintrc.js) |
| frontend | Prettier | Checks JS / TypeScript formatting | [`frontend/.prettierrc`](./frontend/.prettierrc) |
| frontend | Stylelint | Checks styles (CSS, Less, Sass) formatting | [`frontend/.stylelintrc`](./frontend/.stylelintrc) |

Linters can be run individually within the backend or frontend folders.

## Internationalization 🌐

Generate translation files for Plone and Volto with ease:

```shell
make i18n
```

## Credits and Acknowledgements 🙏

Generated using [Cookieplone (0.9.7)](https://github.com/plone/cookieplone) and [cookieplone-templates (27a6b7b)](https://github.com/plone/cookieplone-templates/commit/27a6b7bd7b0ba9a77b04109d73c4ee975ab95cc3) on 2025-05-13 21:27:39.934395. A special thanks to all contributors and supporters!
