---
block: sponsorsShowcaseBlock
---

Shows the sponsorship packages of the event and the sponsors in each package. The block stores only its title and how it is shown. The packages and sponsors are read from the event when the block renders, so to change what it shows, change the sponsors.

### Fields

- `title`: a heading above the packages. Without a value, no heading is shown.
- `styles`: the styling options of the block, such as its alignment, as set by Volto's styling widget.

### Examples

```json
{ "@type": "sponsorsShowcaseBlock" }
```

```json
{ "@type": "sponsorsShowcaseBlock", "title": "Our sponsors" }
```
