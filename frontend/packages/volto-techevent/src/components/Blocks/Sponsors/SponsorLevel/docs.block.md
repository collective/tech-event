---
block: sponsorLevelBlock
---

Lists the sponsors of the sponsorship package of the page it is placed on, and can show a call to action below them. The block stores only its title, the call to action and how it is shown. The package is the one of the content item the block is on, and its sponsors are read from the event when the block renders, so to change the sponsors, change the package.

### Fields

- `title`: a heading above the list. Without a value, no heading is shown.
- `href`: a list with at most one `{ "@id": url }` object, where `url` is the path of an item or an external URL. It is the target of the call to action. Without a value, no call to action is shown.
- `displayCTA`: `true` shows the call to action when `href` is set. Without a value, it is not shown.
- `label`: the text of the call to action.
- `styles`: the styling options of the block, such as its alignment, as set by Volto's styling widget.

### Examples

```json
{ "@type": "sponsorLevelBlock" }
```

```json
{
  "@type": "sponsorLevelBlock",
  "title": "Sponsors",
  "href": [{ "@id": "/become-a-sponsor" }],
  "displayCTA": true,
  "label": "Become a sponsor"
}
```
