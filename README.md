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
