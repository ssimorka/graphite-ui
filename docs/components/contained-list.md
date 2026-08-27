# Contained list

A bordered/contained list block with a title row (optional search or action) and interactive row items — for grouped, self-contained lists within a page (vs. List's plain in-content list).

**Figma:** [Contained list](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=16193-272726)
**Figma node ID:** `16193:272726` — page "02 Components – Contained list"

## Variant properties

| Property | Options |
|---|---|
| Type | On page, Disclosed |

Also carries a `Search` boolean for showing a search field in the title bar.

## Key sub-components

| Component | Purpose |
|---|---|
| `_List title actions - On page` | Title-bar action — Overflow menu, Ghost icon button, Primary icon button, Link, or Tag |
| `_Contained list title item` | Title row itself, with Style (On page/Disclosed) and Size options |
| `_Contained list row item` | Body row, with Size (Extra large/Large/Medium/Small) and State |
| `_Contained list row cell item` | Individual cell content within a row |

## When to use

- **On page** — list sits directly on the page background.
- **Disclosed** — list sits within a distinct container (e.g. inside a card or panel), affecting the title styling.
- Set the title action to `Filterable search` (via `_Contained list title item`'s Action type) when the list needs in-place filtering.

## Do / Don't

- Do match `Size` across the title item and row items within one list — they're meant to scale together.
- Don't use Contained list for large datasets needing sort/pagination — that's Data table's job.

---
*Generated from Figma component set `16193:272726` and related `16193:*` / `16888:*` nodes — regenerate if variant properties change.*
