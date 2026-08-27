# Popover

Floating container for richer, potentially interactive content anchored to a trigger element. A `Tab tip` variant provides an alternate visual treatment (flat edge instead of a caret).

**Figma node IDs (page "02 Components – Popover"):**

| Component | Node ID |
|---|---|
| Popover | `9125:400576` |
| Popover - Tab tip | `9826:402965` |

**Figma:** [Popover](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=9125-400576)
**Internal building block (do not use directly):** `Popover item`

## Variant properties — Popover

| Property | Options |
|---|---|
| Position | Top, Bottom, Right, Left |
| Alignment | Center, Start, End |
| Visible | False, True |

## Variant properties — Popover - Tab tip

| Property | Options |
|---|---|
| Alignment | Start, End |
| Open | False, True |
| Shadow | False, True |

## When to use

- Use for interactive or richer content than Tooltip/Toggletip support — forms, lists of options, nested actions.
- Use `Tab tip` variant when the popover visually attaches to a tab or segment control rather than floating freely.

## Do / Don't

- Do turn `Shadow` off when the popover sits inside another elevated surface (e.g. already inside a Modal) to avoid stacked shadows.
- Don't use Popover for simple text hints — that's Tooltip or Toggletip's job; reserve Popover for genuinely richer content.

---
*Generated from Figma component sets `9125:400576` / `9826:402965` — regenerate if variant properties change.*
