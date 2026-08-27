# Date picker & Time picker

Date and time selection components. Date picker has three modes: Simple date (typed entry only), Single calendar (typed entry + calendar popup), and Range calendar (two-ended range selection). Time picker is a separate but related component on the same page.

**Figma node IDs (page "02 Components – Date picker"):**

| Component | Default | Fluid |
|---|---|---|
| Date picker – Simple date | `17544:266985` | `17544:267399` |
| Date picker – Single calendar | `17544:267504` | `17544:267989` |
| Date picker – Range calendar | `17544:268170` | `17544:268235` |
| Time picker | `17544:268301` | `17544:268399` |

**Figma:** [Date picker - Single calendar - Default](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=17544-267504)

## Variant properties — Date picker - Single calendar - Default

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| State | Enabled, Hover, Focus, Focus + Open, Active, Active + Open, Disabled, Error, Warning, Skeleton, Read-only |
| Open | False, True |
| Date filled | False, True |

## Variant properties — Date picker - Range calendar - Default

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| State | Enabled, Open, Skeleton, Read-only |

⚠️ Per the component's own Figma note: avoid toggling `Open` on the End-date range picker directly — change `State` to Focus or Active instead.

## Variant properties — Time picker - Default

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| State | Enabled, Read-only, Error, Disabled, Skeleton, Warning |

## Variant properties — Time picker - Fluid

| Property | Options |
|---|---|
| State | Enabled, Error, Warning, Skeleton, Disabled, Read-only |
| Inputs | 3, 2 |

## When to use

- **Simple date** — fastest entry, no calendar UI, for users who know the exact date.
- **Single calendar** — typed entry plus a calendar for browsing.
- **Range calendar** — start/end date selection (bookings, reports).
- **Time picker** — pair with Date picker for full date+time entry, or use standalone.

## Do / Don't

- Do keep the date format hint (e.g. "mm/dd/yyyy") visible in the label or helper text — it's built into the component's text properties, not implied by the input alone.
- Don't build a custom range picker from two Single calendar instances — use Range calendar, which manages the shared range state.

---
*Generated from Figma component sets under node `17544:*` — regenerate if variant properties change.*
