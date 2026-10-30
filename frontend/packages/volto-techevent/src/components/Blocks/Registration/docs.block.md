---
block: eventRegistration
---

Shows a button that opens the registration form of the event in a modal, or the visitor's registration once there is one. The block stores only its texts. The state of registration, the deadline and the tickets are read from the `@registration` endpoint of the event when the block renders, so to change them, change the Attendees database of the event. Without an Attendees database, the block shows nothing to visitors.

When there is nothing to do, the block says why instead of showing the button: registration is not open, the deadline passed, no ticket is available, or the visitor must log in.

### Fields

- `title`: a heading above the button, also used as the title of the modal. Without a value, no heading is shown, and the modal has a default title.
- `buttonLabel`: the label of the button. Without a value, it is `Register`. Once registered, the button always reads `Your registration`.

### Examples

```json
{ "@type": "eventRegistration" }
```

```json
{
  "@type": "eventRegistration",
  "title": "Join us in November",
  "buttonLabel": "Get your ticket"
}
```
