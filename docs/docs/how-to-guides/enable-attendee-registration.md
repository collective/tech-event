---
myst:
  html_meta:
    "description": "Let people register for a tech event: install the attendee registration profile, add the Attendees database, offer tickets, open registration, set a deadline, and check attendees in."
    "property=og:description": "Let people register for a tech event: install the attendee registration profile, add the Attendees database, offer tickets, open registration, set a deadline, and check attendees in."
    "property=og:title": "Enable attendee registration"
    "keywords": "Plone, tech event, registration, attendees, tickets, check-in, deadline"
---

# Enable attendee registration

This guide shows you how to let people register for an event.
Each registration gets a registration code, such as `PYC26-7KQ3M9XD`, that the attendee shows at the registration desk.

Registration works with any way of logging in to the site: regular Plone accounts, or any other authentication plugin.
An attendee is a registration record linked to an account, not an account of its own.

## Install the registration profile

Attendee registration has its own profile, so sites that do not need it get no extra content types.
In the **Add-ons** control panel, install **Tech Event for Plone: Attendee support**.

## Add the Attendees database

Add an **Attendees** item at the event root: the site in single event mode, or the Tech Event in multiple events mode.
An event has at most one Attendees database, and an event without one takes no registrations.

The Attendees database is also the registration page of the event.
It is a page with blocks, which starts with a title block and an **Event Registration** block.
Edit it like any other page, for instance to explain the fees or the code of conduct.

Fill in its settings:

Registration prefix
:   The start of every registration code of the event, with 2 to 12 upper-case letters and digits, such as `PYC26`.

Allow anonymous registration
:   Lets visitors without an account register.
    They must confirm their email address before the registration counts.

Registration confirmation
:   How a registration gets confirmed:

    -   **Automatic**: registrations from logged-in users are confirmed at once.
    -   **Email**: every registration waits until the registrant follows the link sent by email.
    -   **Manual**: an organizer confirms each registration.

    Anonymous registrations always wait for the email confirmation first.

Registration deadline
:   Registration ends at this date and time, even while the database is open.
    Leave it empty to close registration by hand.

## Offer tickets

Tickets are optional.
An Attendees database without tickets takes registrations as usual.

To offer tickets, add **Ticket** items to the Attendees database, for instance **Full conference** and **Tutorials only**:

Title and summary
:   What registrants read when they choose a ticket.

Available from and Available until
:   The period in which registrants can choose the ticket.
    Leave them empty to offer it for as long as registration is open.

Grants admission
:   Whether the ticket grants entry to the event.

Once an event has tickets, each registration holds one.
Registrants choose it in the registration form, and when only one ticket is available, they get it without choosing.
When no ticket is available, registration is refused, although the database stays **Open**.

Organizers can change the ticket of a registration by editing it, and may pick any ticket of the event.
Keep a ticket you no longer offer, and end its period instead of deleting it: the registrations holding a deleted ticket no longer show one.

## Open registration

A new Attendees database is in the **Created** state, and takes no registrations.
Use the **Open registration** transition to start taking registrations, and **Close registration** to stop.

Once opened, the Attendees database is public and shows in the navigation, so visitors find its registration page.
It stays public in the **Closed** state, and takes no more registrations.
The registrations themselves stay private: only organizers, with the Reviewer, Editor, Site Administrator or Manager role, see them.
In the **Created** state, only organizers can see the database.

When a registration deadline passes, registration ends at once, although the database stays **Open**.
Plone has no scheduler, so the deadline is checked whenever someone registers.
You can close the database by hand afterward.

## Add the registration block

The registration page of the Attendees database already has an **Event Registration** block.
Add one to any other page of the event as well, such as the home page.

The block shows a button that opens the registration form in a modal.
Its settings are a title, shown above the button and as the title of the modal, and the label of the button, **Register** when empty.
Depending on the visitor and the state of registration, the block shows:

-   the **Register** button, which opens the form, pre-filled from the account for logged-in users, with a choice of ticket when several are available;
-   a **Your registration** button once registered, which opens the registration code, ticket and state, and a button to cancel;
-   a link to log in, when anonymous registration is off;
-   a message, when registration is not open, the deadline passed, or no ticket is available.

The block shows nothing to visitors when the event has no Attendees database.

The confirmation link in the emails leads to the `registration/verify` route of the event, such as `https://example.org/event/registration/verify`.
The emails use the frontend address from the `VOLTO_FRONTEND_DOMAIN` environment variable or the `volto.frontend_domain` registry record, and the backend address without them.
Configure the mail settings of the site, otherwise the emails are only logged.

## Check attendees in

Organizers open the registration desk from the **Manage registrations** button of the toolbar.
The button shows only on the Attendees database, and only for its organizers.
The desk is the `manage-registrations` route of the Attendees database, such as `https://example.org/registrations/manage-registrations`.
Anywhere else, the route answers that the page does not exist.

The desk lists the registrations, with their code, name, email address and state, and their ticket when the event has tickets.
Filter them by state, or search by name, email address or code.
Each code links to the page of the registration.

Each registration moves through these states:

| State | Meaning |
| --- | --- |
| Pending | Received, not confirmed yet. |
| Registered | Confirmed. |
| Attended | Checked in at the event. The attendee can no longer edit the registration. |
| Cancelled | Cancelled by the attendee or the organizers. |

Organizers with the Reviewer role can confirm, check in, cancel and revert registrations from the table.
Attendees can cancel their own registration while it is pending or registered.

## Replace the registration form

The registration block takes its modal and its form from the component registry, under these names:

`TechEventRegistrationModal`
:   The modal: the form, or the registration of the user.
    It gets the `RegistrationModalProps` of `types/registration`.

`TechEventRegistrationForm`
:   The form, inside the modal.
    It gets the `RegistrationFormProps` of `types/registration`, which include the available `tickets`, and calls `onSubmit` with the registration data.
With several tickets available, send the `UID` of the chosen one as `ticket`.

To replace one, register your component under its name in the configuration of your add-on, which loads after this one:

```ts
import MyRegistrationForm from './components/MyRegistrationForm';

export default function applyConfig(config) {
  config.registerComponent({
    name: 'TechEventRegistrationForm',
    component: MyRegistrationForm,
  });
  return config;
}
```

To change the default form instead of replacing it, wrap it: import `RegistrationForm` from `@plone-collective/volto-techevent/components/Registration/RegistrationForm` and render it inside your component.
The backend stores only the first name, last name, email address and ticket of a registration, so a form that asks for more also needs the backend to store it.

## Limit abuse

There is no CAPTCHA.
If you allow anonymous registration, limit the rate of `POST` requests to `@registration` in your proxy.
Anonymous registrations count only after the email address is confirmed.

## Upgrade from a Membrane-based installation

Earlier versions used `Products.membrane` to turn each attendee into a user with a one-time password.
That is gone, along with the `users` extra and the `/attendee-login` route.

Before you upgrade the package, uninstall Products.membrane in the **Add-ons** control panel.
Otherwise its `membrane_tool` is left as a broken object.
Then run the upgrade step of **Tech Event for Plone: Attendee support**.

The upgrade step:

-   puts each existing Attendees database in the **Closed** state, which is public but takes no registrations, so you decide when to open it;
-   sets its registration prefix from the ID of its event root, and logs the value;
-   adds the Ticket type, which existing events can ignore;
-   keeps existing attendees in their state, registered or cancelled.

The profile no longer creates an `attendees` folder at the site root.
