---
myst:
  html_meta:
    "description": "Install the backend and frontend add-ons of Tech Event Support for Plone in an existing Plone 6 and Volto project."
    "property=og:description": "Install the backend and frontend add-ons of Tech Event Support for Plone in an existing Plone 6 and Volto project."
    "property=og:title": "Install the add-on in an existing project"
    "keywords": "Plone, Volto, installation, collective.techevent, volto-techevent"
---

(install-the-add-on)=

# Install the add-on in an existing project

This guide shows you how to add Tech Event Support for Plone to a Plone 6 project that already runs Volto.
It assumes that you have a working project with the Plone backend and the Volto frontend.

Supported versions are Plone 6.1 and 6.2, Python 3.11 to 3.14 (Python 3.14 requires Plone 6.2), and Volto 19.

## Install the backend add-on

Add the backend package to your project's Python dependencies.
Use uv, as in the following command.

```shell
uv add collective.techevent
```

The add-on loads through the `plone.autoinclude.plugin` entry point, so you do not need to change your ZCML.
If your project loads its ZCML explicitly, add the include to your configuration.

```xml
<include package="collective.techevent" />
```

Restart the backend after installing the package.
ZCML changes only take effect after a restart.

Then install the profile in the Plone site.
In the Add-ons control panel, activate **Tech Event for Plone: Install**.

## Install the frontend add-on

Add the Volto add-on to your frontend project with `pnpm`.

```shell
pnpm add @plone-collective/volto-techevent
```

Add the add-on to the `addons` list in the project's `package.json`.

```json
{
  "addons": [
    "@plone-collective/volto-techevent"
  ]
}
```

Your project also brings its own theme.
See {doc}`configure-the-volto-add-on` for the theme that the add-on is tested with.

## Check the installation

Start the backend and the frontend.
Open the Plone site in the browser.
The **Schedule** and the sponsor blocks appear in the block chooser, in the **Event** and **Event Sponsors** groups.

```{note}
This guide describes the target state of version 1.0.0.
Check the release notes if you install an earlier version.
```
