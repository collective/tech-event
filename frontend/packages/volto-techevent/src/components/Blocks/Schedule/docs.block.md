---
block: scheduleBlock
---

Shows the sessions and breaks of the event as a schedule, one day at a time. The block stores only its title and how it is shown. The sessions are read from the event when the block renders, so to change what it shows, change the sessions.

### Fields

- `title`: a heading above the schedule. Without a value, no heading is shown.
- `displayDayIndex`: `true` shows an index of the days above the schedule. Without a value, the index is not shown. The sidebar stores `true` when a block is opened without one, so the index appears in a block stored before this field existed once it is edited.
- `filterByDay`: a list of day values to show. An empty list, the default, shows every day. The day values are the days of the event, taken from the event settings. Outside the sidebar, where there is no event, the schema lists no choices, but any day value can be stored.
- `styles`: the styling options of the block, such as its alignment, as set by Volto's styling widget.

### Examples

```json
{ "@type": "scheduleBlock" }
```

```json
{
  "@type": "scheduleBlock",
  "title": "Programme",
  "displayDayIndex": true,
  "filterByDay": []
}
```
