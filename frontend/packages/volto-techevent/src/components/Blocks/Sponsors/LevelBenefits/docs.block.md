---
block: levelBenefitsBlock
---

Shows the benefits of the sponsorship packages of the event as a list, with the benefits each package includes. The block stores only its title and the field for its comparison table. The benefits are read from the event when the block renders, so to change what it shows, change the benefits.

### Fields

- `title`: a heading above the list. Without a value, no heading is shown. The sidebar stores `Our Packages` when a block is opened without one, so the heading appears in a block stored before this field had a value once it is edited.
- `tableTitle`: stored with the block. The list does not show it. The sidebar stores `Compare` when a block is opened without one.

### Examples

```json
{ "@type": "levelBenefitsBlock" }
```

```json
{
  "@type": "levelBenefitsBlock",
  "title": "Our Packages",
  "tableTitle": "Compare"
}
```
