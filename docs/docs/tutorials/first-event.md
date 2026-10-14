---
myst:
  html_meta:
    "description": "Build a first tech event with Tech Event Support for Plone: add a venue, a room, a schedule and a talk, then check the schedule endpoint."
    "property=og:description": "Build a first tech event with Tech Event Support for Plone: add a venue, a room, a schedule and a talk, then check the schedule endpoint."
    "property=og:title": "Create your first tech event"
    "keywords": "Plone, Volto, tech event, tutorial, schedule, talk"
---

# Create your first tech event

In this tutorial we will set up the development environment of this repository and build a small event.
You will add a venue with a room, create a schedule, add a talk to it, and then check that the schedule endpoint returns the talk.

It takes about twenty minutes.

## Before you start

You need [uv](https://docs.astral.sh/uv/), Node.js 22 with `pnpm`, Make and Git.
The [README](https://github.com/collective/tech-event#readme) lists the operating system requirements.

## Install the development environment

Clone the repository and change into it.

```shell
git clone git@github.com:collective/tech-event.git
cd tech-event
```

Install the backend and the frontend.

```shell
make install
```

Create a Plone site.
The site comes with example content, so you can look around before you build your own event.

```shell
make backend-create-site
```

Start the backend.
Leave this terminal open.

```shell
make backend-start
```

In a new terminal, start the frontend.

```shell
make frontend-start
```

Open http://localhost:3000/ in your browser and log in as `admin`.
You see the Plone site with its example content.

## Create a venue and a room

In this part we create the place where the event happens.
We will build the event in a new folder, so the example content stays as it is.

1.  Add a **Folder** at the root of the site, titled `My Event`, and save it.
2.  Open `My Event` and add a **Venue**, titled `Main venue`, and save it.
3.  Open `Main venue` and add a **Room**, titled `Main room`, and save it.

The room now appears in the list of rooms that the schedule can use.

## Create a schedule

1.  Open `My Event` and add a **Schedule**, titled `Schedule`, and save it.
2.  Open `Schedule` and add a **Talk**, titled `Opening remarks`.
3.  In the **Event Settings** fieldset, set the start and the end time of the talk.
    Choose a time on a day that is inside the event dates.
4.  Choose `Main room` in the **Room** field.
5.  Save the talk.
6.  From the talk's **State** menu, choose **Publish**.

You should see the talk on the schedule, in the column of `Main room`.

```{note}
The schedule only shows slots in the published state, unless the event settings list more states.
Publishing the talk is therefore required.
```

## Check the schedule endpoint

The schedule is also available as JSON.
Open http://localhost:8080/Plone/@schedule in your browser.
The response has an `items` list with one entry for each day that contains a slot.
Each day lists its slots and the rooms it uses, and your talk appears under its start date.

Your first event is now running.
You created a venue, a room, a schedule and a talk, and you checked the data that the frontend draws.
To set up a real event, continue with {doc}`/how-to-guides/set-up-the-schedule` and {doc}`/how-to-guides/add-sponsors`.
