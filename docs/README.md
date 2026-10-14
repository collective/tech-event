# Tech Event Support for Plone: documentation

This folder contains the Sphinx documentation of Tech Event Support for Plone.
It is built with the [Plone Sphinx Theme](https://github.com/plone/plone-sphinx-theme) and written in MyST.

The documentation is published at [collective.github.io/tech-event](https://collective.github.io/tech-event/).

## Prerequisites

-   [uv](https://docs.astral.sh/uv/) manages the Python version and the dependencies of the documentation.
    The documentation requires Python 3.14.

Install uv with the following command, or follow the [uv installation page](https://docs.astral.sh/uv/getting-started/installation/).

```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Install the toolchain

The documentation depends on the backend package `collective.techevent`, installed in editable mode from `../backend`.
Install the toolchain with the following command, run from this folder or from the root of the repository.

```shell
make install
```

From the root of the repository, the equivalent command is `make docs-install`.

## Build the documentation

To build the HTML documentation, run the following command.
The output goes to `_build/html`.

```shell
make build
```

To treat warnings as errors, as the continuous integration does, run the following command.

```shell
make html SPHINXOPTS=-W
```

To build the documentation with live reload in the browser, run the following command.

```shell
make livehtml
```

## Check the documentation

To check for broken links, run the following command.

```shell
make linkcheckbroken
```

To check spelling, grammar and style, run the following command.
Vale reports errors and warnings.
The continuous integration fails on warnings, so run it with the same options.

```shell
make vale VALEOPTS="--minAlertLevel='warning'"
```

## Clean the build

To remove the build, run the following command.

```shell
make clean
```

To remove the build and the Python environment, and create the environment again, run the following command.

```shell
make init
```

To list all the commands, run the following command.

```shell
make help
```

## Structure

The pages follow the Diátaxis framework, in four sections: tutorials, how-to guides, concepts and reference.
The file `docs/conf.py` controls the configuration of the documentation.
Add a dependency to the `dev` group of `pyproject.toml`, with `uv add --dev <package>`, and then add its extension to the `extensions` list of `docs/conf.py`.
