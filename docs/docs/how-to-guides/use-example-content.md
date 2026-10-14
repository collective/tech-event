---
myst:
  html_meta:
    "description": "Use the example content of Tech Event Support for Plone to explore the add-on, and create a site with or without it."
    "property=og:description": "Use the example content of Tech Event Support for Plone to explore the add-on, and create a site with or without it."
    "property=og:title": "Use the example content"
    "keywords": "Plone, tech event, example content, demo, profile"
---

# Use the example content

This guide shows you how to load the example content that the add-on ships, and how to create a site without it.
The example content lets you explore the add-on before you add your own event.

## Load the example content in a new site

The script that creates the development site loads the example content by default.
Run the target with its default settings.

```shell
make backend-create-site
```

To create the site without the example content, set the `EXAMPLE_CONTENT` variable to `0` before you run the target.

```shell
EXAMPLE_CONTENT=0 make backend-create-site
```

## Load the demo profile in an existing site

The example content is a separate profile.
Apply it with the `portal_setup` tool, using the profile id `profile-collective.techevent:demo`.
The profile is titled **Tech Event for Plone: Demo content** in the profile list.

```{warning}
The demo profile adds content to the site.
Apply it only on a site that you use for testing, or on a site where the content is welcome.
```

## Export your own content

The example content lives in the backend package.
To update it with the content of your development site, run the following target.
It overwrites the example content that the package ships, so review the changes before you commit them.

```shell
make backend-update-example-content
```

## Remove the example content

Delete the example items from the site when you start your own event.
The example items are ordinary content, so you can delete them with the usual Plone tools.
