# Data table

Complex tabular data component with header/body rows, sortable headers, selection (checkbox or radio), row expansion, batch actions, and a toolbar. The most compound component in the library — most parts are composed rather than used standalone.

**Figma:** [Data table](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=4630-268268)
**Figma node ID:** `4630:268268` — page "02 Components – Data table"

## Variant properties — Data table (top level)

| Property | Options |
|---|---|
| Type | Default, Select checkbox, Select radio, Expandable + Selectable, Batch actions, Expandable |
| Skeleton | False, True |

Also carries `Pagination`, `Toolbar`, `Slot`/`Swap slot`, and `Body` booleans to show/hide those sections.

## Key sub-components

| Component | Node ID | Purpose |
|---|---|---|
| Data table header cell item | `43292:32017` | Column headers, with `Sortable`/`Sorted` states |
| Data table row cell item | `6172:291044` | Standard body cell, supports a second text line |
| Data table select cell item | `43292:32873` | Checkbox/radio selection cell (internal — do not use directly) |
| Data table expand cell item | `43292:32955` | Row-expand chevron cell (internal — do not use directly) |
| Data table header row item | `62100:540870` | Full header row, with `Select type` (None/Dynamic/Expansion/Selection) |
| Data table body row item | `4547:163221` | Full body row, with Zebra style, Selectable, Expandable options |
| Data table toolbar item | `4487:180741` | Toolbar container (Large/Small size) |
| Data table batch actions bar item | `4487:181347` | Replaces toolbar when rows are selected |
| Data table batch actions button | `43082:290652` | Individual action button inside the batch bar |

## Important notes from the file

- You may need to detach the Data table instance to reorder rows.
- If applying `Zebra style`, turn off `Top border` on default rows — the two conflict visually.
- `Size` on header/row cells is fixed at "Extra large" in this file's built instances; the `Data table size` collection referenced in the guidelines (XL/LG/MD/SM/XS) governs overall table density, not per-cell variants.

## When to use

- **Default** — read-only tabular data.
- **Select checkbox / Select radio** — single or multi-row selection.
- **Expandable** — rows that reveal additional detail inline.
- **Expandable + Selectable** — both at once.
- **Batch actions** — pairs with Select checkbox; toolbar swaps to the batch actions bar once rows are selected.

## Do / Don't

- Do use `Batch actions` type together with a Select type — it has no meaning without selectable rows.
- Don't hand-build header/row cells from scratch — compose from the provided cell items so sort states, selection, and expansion stay consistent.

---
*Generated from Figma component sets under node `4630:268268` and related `43292:*` / `62100:*` / `4547:*` / `4487:*` nodes — regenerate if variant properties change.*
