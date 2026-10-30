---
block: levelComparisonBlock
---

Shows a table that compares the sponsorship packages of the event, with a row for each benefit and a column for each package. The block stores only its title and the heading of its first column. The packages and benefits are read from the event when the block renders, so to change the table, change the packages and benefits.

### Fields

- `title`: a heading above the table. Without a value, no heading is shown. The sidebar stores `Our Packages` when a block is opened without one, so the heading appears in a block stored before this field had a value once it is edited.
- `tableTitle`: the heading of the first column of the table. Without a value, the column shows `Benefit`. The sidebar stores `Compare` when a block is opened without one, so the column heading changes in a block stored before this field had a value once it is edited.

### Examples

```json
{ "@type": "levelComparisonBlock" }
```

```json
{
  "@type": "levelComparisonBlock",
  "title": "Our Packages",
  "tableTitle": "Compare"
}
```
