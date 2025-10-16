# Tech Event Support for Plone (collective.techevent)

Content types, behaviors, and REST endpoints to build tech event sites (conference/symposium/seminar) in Plone.

Important: This backend package requires a Volto frontend with the addon `@plone-collective/volto-techevent` installed. The frontend consumes the endpoints and provides the UI for schedules, sessions, sponsors, and more.

## Features

### Content types

#### Event root
- Tech Event: Represents an event edition. Available if the site supports multiple editions, otherwise the Plone Site acts as the event root.

#### Location
- **Venue**: Location where the event takes place.
- **Room**: A room/auditorium inside a venue.

#### Event schedule
- **Schedule**: Folderish content to organize the event schedule.
- **Keynote**: Main presentation of the event.
- **Talk**: A session presentation.
- **Training**: A training/tutorial.
- **Open Space**: Open space session.
- **Lightning Talks**: Lightning talks session (supports listing each short presentation).
- **Meeting**: Meetings (e.g., Plone Foundation Annual Membership Meeting).
- **Slot**: Generic slot in the schedule (Registration, Group Photo, Party, etc.).
- **Break**: Coffee break or lunch time slot.
- **Presenter**: Presenter profile.

#### Sponsor support
- **SponsorsDB**: Folderish container for sponsoring information.
- **SponsorLevel**: Sponsoring package/level available for the event.
- **Sponsor**: Sponsor/supporter entry.

### Behaviors
- `collective.techevent.event_settings`: Event configuration; marks content as IEventRoot.
- `collective.techevent.schedule`: Scheduling support for content items.
- `collective.techevent.session`: Basic session information.
- `collective.techevent.presenter_roles`: Presenter roles on a content item.

### REST endpoints
- `/@schedule` (on event root): Returns the complete event schedule.
- `/@sponsors` (on event root): Lists all sponsors, grouped by package level.

## See it in action

- [Python Cerrado 2025](https://2025.pythoncerrado.org)
- [Plone Conference 2025](https://2025.ploneconf.org)
- [Python Brasil 2025](https://2025.pythonbrasil.org.br)

## Installation

Considering you have a Plone project created with latest `cookieplone`, add `collective.techevent` as a dependency on the `backend/pyproject.toml`.

```toml
[project]
dependencies = [
  # ...existing dependencies...
  "collective.techevent",
]
```

Then run the installation with:

```shell
make install
```

Load the package ZCML (if not using auto-include) in dependencies.zcml:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configure xmlns="http://namespaces.zope.org/zope">
  <!-- ...existing includes... -->
  <include package="collective.techevent" />
</configure>
```

Ensure the GenericSetup profile is installed (e.g., from your policy package metadata.xml):

```xml
<?xml version="1.0" encoding="utf-8"?>
<metadata>
  <version>1000</version>
  <dependencies>
    <!-- ...existing dependencies... -->
    <dependency>profile-collective.techevent:default</dependency>
  </dependencies>
</metadata>
```

Create your Plone site as usual and install the “Tech Event” add-on in the Add-ons control panel if not auto-installed.

### Frontend requirement

This package is intended to be used with a Volto frontend:
- Install @plone-collective/volto-techevent in your Volto app.
- The Volto addon integrates with the endpoints and content types provided here.

## Contribute

- [Issue tracker](https://github.com/collective/tech-event/issues)
- [Source code](https://github.com/collective/tech-event/)

### Prerequisites ✅

-   An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned.
-   [uv](https://6.docs.plone.org/install/create-project-cookieplone.html#uv)
-   [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
-   [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
-   [Docker](https://docs.docker.com/get-started/get-docker/) (optional)

### Installation 🔧

1.  Clone this repository.

    ```shell
    git clone git@github.com:collective/tech-event.git
    ```

2.  Install this code base.

    ```shell
    make install
    ```

## License

GPLv2

## Credits and acknowledgements 🙏

Generated from the [`cookieplone-templates`  template](https://github.com/plone/cookieplone-templates/tree/main/) on 2025-05-14 00:29:28.. A special thanks to all contributors and supporters!
