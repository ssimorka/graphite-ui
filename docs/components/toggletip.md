# Toggletip

Reveals supplemental content when the user clicks a trigger, and stays open until explicitly dismissed — unlike Tooltip, which is hover/focus-driven and transient.

**Figma:** [Toggletip](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=9384-402406)
**Figma node ID:** `9384:402406` — page "02 Components – Toggletip"
**Internal building block (do not use directly):** `_Toggletip body item`

## Variant properties

| Property | Options |
|---|---|
| Position | Top, Bottom, Left, Right |
| Alignment | Center, Start, End |
| Visible | False, True |

## When to use

- Use when the supplemental content needs to persist while the user reads or interacts with it (vs. a Tooltip's hover-based flash).
- Common for form field help text that's too long for an inline hint but doesn't need a full Popover's interactivity.

## Do / Don't

- Do give Toggletip an explicit close action — it doesn't auto-dismiss on mouse-out like Tooltip.
- Don't use Toggletip for content requiring user input inside it — use Popover instead.

---
*Generated from Figma component set `9384:402406` — regenerate if variant properties change.*
