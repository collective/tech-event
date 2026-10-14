---
myst:
  html_meta:
    "description": "Reference for Tech Event Support for Plone: content types, behaviors, REST endpoints, control panel, vocabularies, blocks and views."
    "property=og:description": "Reference for Tech Event Support for Plone: content types, behaviors, REST endpoints, control panel, vocabularies, blocks and views."
    "property=og:title": "Tech Event Support for Plone reference"
    "keywords": "Plone, Tech Event Support for Plone, reference, API, content types"
---

# Reference

This part of the documentation contains reference material, including content types, behaviors, REST endpoints, configuration values and the frontend components.

> Reference guides are technical descriptions of the machinery and how to operate it.
> Reference material is information-oriented.

```{seealso}
https://diataxis.fr/reference/
```

```{toctree}
:maxdepth: 1
:hidden: true

content-types
behaviors
rest-api
control-panel
vocabularies
blocks-and-views
frontend-settings
```

`````{grid} 1 1 2 2
:gutter: 3

````{grid-item-card} 🧱 Content types
:link: content-types
:link-type: doc

The event, the schedule, slots, sessions, presenters, locations and sponsors.
````

````{grid-item-card} 🧩 Behaviors
:link: behaviors
:link-type: doc

Event settings, schedule slot fields, session fields and presenter roles.
````

````{grid-item-card} 🔗 REST API
:link: rest-api
:link-type: doc

The `@schedule` and `@sponsors` endpoints, with request and response shapes.
````

````{grid-item-card} ⚙️ Control panel
:link: control-panel
:link-type: doc

The TechEvent Settings form and its registry record.
````

````{grid-item-card} 🔤 Vocabularies
:link: vocabularies
:link-type: doc

The names, sources and values of the event's selection lists.
````

````{grid-item-card} 🖼️ Blocks and views
:link: blocks-and-views
:link-type: doc

The blocks, views and listing templates of the Volto add-on.
````

````{grid-item-card} 🎛️ Frontend settings
:link: frontend-settings
:link-type: doc

The settings of the Volto add-on, from `config/settings.ts`.
````
`````

