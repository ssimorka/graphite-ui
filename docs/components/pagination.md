# Pagination

Two forms: `Pagination - Nav` (page-number links) and `Pagination - Table bar` (compact page/item count control for data tables).

**Figma node IDs (page "02 Components – Pagination"):**

| Component | Node ID |
|---|---|
| Pagination - Nav | `2799:20761` |
| Pagination - Table bar | `3889:50204` |

**Figma:** [Pagination - Nav](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=2799-20761)
**Internal building block (do not use directly):** `_Pagination - Nav page item` (`5730:281784`)

## Variant properties — Pagination - Nav

| Property | Options |
|---|---|
| Size | Large, Medium, Small |

Composed from individual page-number items (`Overflow` boolean flag controls whether an item shows as a numbered page or an ellipsis trigger).

## Variant properties — Pagination - Table bar

| Property | Options |
|---|---|
| Type | Advanced, Simple, Unbound |
| Size | Large, Medium, Small |

## When to use

- **Nav** — standalone page navigation (search results, article lists).
- **Table bar** — attached to a Data table, showing item counts and page controls inline with table actions.
- Within Table bar: `Advanced` shows full page/item counts, `Simple` is more compact, `Unbound` for cases where the total count isn't known upfront.

## Do / Don't

- Do use Table bar pagination specifically with Data table — it's designed to sit in that toolbar context.
- Don't build custom page-number controls — compose from `_Pagination - Nav page item` variants (Enabled, Hover, Focus, Selected).

---
*Generated from Figma component sets `2799:20761` / `3889:50204` — regenerate if variant properties change.*
