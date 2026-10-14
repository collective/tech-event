---
myst:
  html_meta:
    "description": "Configure the Volto add-on of Tech Event Support for Plone with the theme it is tested with, @kitconcept/volto-light-theme 8.0.0."
    "property=og:description": "Configure the Volto add-on of Tech Event Support for Plone with the theme it is tested with, @kitconcept/volto-light-theme 8.0.0."
    "property=og:title": "Configure the Volto add-on"
    "keywords": "Volto, theme, volto-light-theme, volto-techevent, configuration"
---

(configure-the-theme)=

# Configure the Volto add-on

This guide shows you how to configure the Volto add-on so that it works with the theme of your project.
The add-on does not depend on a theme.
Your project chooses the theme.

## Choose the theme

The tested theme is `@kitconcept/volto-light-theme`, version 8.0.0.
Add it to your project, and list it in the `addons` key of `package.json`, before the Tech Event add-on.

```shell
pnpm add @kitconcept/volto-light-theme@^8.0.0
```

```json
{
  "addons": [
    "@kitconcept/volto-light-theme",
    "@plone-collective/volto-techevent"
  ]
}
```

Any other theme may work, but only the combination above is tested.

## Check the styles

The add-on styles its own components, such as the schedule, the presenter pages and the sponsor pages.
If your theme changes the colors or the fonts, check these pages after you change the theme.

## Keep the peer dependencies in sync

The Volto add-on lists the theme as a peer dependency.
Install a version of the theme that satisfies that range.
Use the same Volto version in the whole project, as the add-on targets Volto 19.
