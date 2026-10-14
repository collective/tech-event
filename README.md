# Tech Event Support for Plone

Tech Event Support for Plone helps you build tech event sites (conference, symposium or seminar) with Plone 6 and Volto.
It is a monorepo with a backend add-on, a frontend add-on and the documentation.

- The backend, [collective.techevent](https://pypi.org/project/collective.techevent), is a Plone add-on.
  It provides the content types, the behaviors and the REST endpoints `@schedule` and `@sponsors`.
- The frontend, [@plone-collective/volto-techevent](https://www.npmjs.com/package/@plone-collective/volto-techevent), is a Volto add-on.
  It provides the views, the blocks and the listings for the schedule and the sponsors.
- The documentation is at [collective.github.io/tech-event](https://collective.github.io/tech-event/).

The frontend needs the backend.
The backend is designed to be used with the frontend.

[![CI](https://github.com/collective/tech-event/actions/workflows/main.yml/badge.svg)](https://github.com/collective/tech-event/actions/workflows/main.yml)
[![Docs](https://github.com/collective/tech-event/actions/workflows/docs.yaml/badge.svg)](https://github.com/collective/tech-event/actions/workflows/docs.yaml)
[![PyPI](https://img.shields.io/pypi/v/collective.techevent)](https://pypi.org/project/collective.techevent)
[![npm](https://img.shields.io/npm/v/@plone-collective/volto-techevent)](https://www.npmjs.com/package/@plone-collective/volto-techevent)
[![Built with Cookieplone](https://img.shields.io/badge/built%20with-Cookieplone-0083be.svg?logo=cookiecutter)](https://github.com/plone/cookieplone-templates/)

## Supported versions

| Component | Versions |
| --- | --- |
| Plone | 6.1 and 6.2 |
| Python | 3.11 to 3.14 (3.14 requires Plone 6.2) |
| Volto | 19 |

## Quick start

### Prerequisites

-   An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned.
-   [uv](https://docs.astral.sh/uv/)
-   [Node.js 22 and pnpm](https://6.docs.plone.org/install/create-project.html#node-js)
-   [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
-   [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
-   [Docker](https://docs.docker.com/get-started/get-docker/) (optional)

### Install the code base

Clone the repository and change into it.

```shell
git clone git@github.com:collective/tech-event.git
cd tech-event
```

Install the backend and the frontend.

```shell
make install
```

### Start the servers

Create a Plone site on your first run.
The site comes with example content.

```shell
make backend-create-site
```

Start the backend at http://localhost:8080/.

```shell
make backend-start
```

In a new terminal, start the frontend at http://localhost:3000/.

```shell
make frontend-start
```

To learn more, follow the [first event tutorial](https://collective.github.io/tech-event/tutorials/first-event.html).

## Local stack deployment

The Docker Compose stack runs the backend and the frontend behind a Traefik router, with a Postgres database.
It is accessible at http://tech-event.localhost.

```shell
make stack-start
make stack-create-site
```

## Project structure

-   `backend/`: the Python package `collective.techevent`, with the content types, behaviors, vocabularies and REST endpoints.
-   `frontend/`: the Volto project and the add-on package `frontend/packages/volto-techevent`.
-   `docs/`: the Sphinx documentation, published on GitHub Pages.

## Development commands

Run `make help` to list all the commands.

| Command | Description |
| --- | --- |
| `make install` | Install the backend and the frontend. |
| `make backend-create-site` | Create a Plone site, with the example content. |
| `make backend-start` | Start the backend at http://localhost:8080/. |
| `make frontend-start` | Start the frontend at http://localhost:3000/. |
| `make format` | Format the backend and the frontend. |
| `make lint` | Lint the backend and the frontend. |
| `make check` | Format and lint the code base. |
| `make test` | Run the backend and the frontend tests. |
| `make docs-install` | Install the documentation toolchain. |
| `make docs-build` | Build the documentation, with warnings as errors. |
| `make docs-livehtml` | Build the documentation, with live reload in the browser. |
| `make docs-clean` | Remove the documentation build. |

### Code quality

The backend uses Ruff, Pyroma, check-python-versions and zpretty.
The frontend uses ESLint, Prettier and Stylelint.
Each section can also be formatted and linted from its own folder.

## Documentation

The documentation covers the concepts, the tutorial, the how-to guides and the reference.
It also shows how to plan the content of a conference, and how to use the example content.

Build it locally with the following command.

```shell
make docs-build
```

## Credits and acknowledgements

Generated using [Cookieplone](https://github.com/plone/cookieplone) and [cookieplone-templates](https://github.com/plone/cookieplone-templates/).
A special thanks to all contributors and supporters!
