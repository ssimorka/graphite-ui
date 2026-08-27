# Tooltip

Shows contextual, nonessential information on hover, focus, or click. Standard and Definition tooltips have a max width of 288px; use a hard return for multiple lines.

**Figma:** [Tooltip](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=3684-40507)
**Figma node ID:** `3684:40507` — page "02 Components – Tooltip"
**Internal building blocks (do not use directly):** `_Tooltip caret item`, `_Tooltip definition item`, `Tooltip body item`

## Variant properties

| Property | Options |
|---|---|
| Type | Standard, Definition, Icon button |
| Position | Top, Bottom, Left, Right |
| Alignment | Center, Start, End |
| Visible | False, True |

## When to use

- **Standard** — brief label or clarification on hover/focus.
- **Definition** — underlined inline text that reveals a definition on hover/click.
- **Icon button** — tooltip specifically for icon-only triggers, since they lack a visible text label.

## Do / Don't

- Do keep tooltip content brief and genuinely nonessential — if the information is required to complete a task, it shouldn't be hidden in a tooltip.
- Don't rely on tooltips for content that needs to be accessible without hover (mobile/touch has no hover state) — pair with a visible alternative when the info matters.

---
*Generated from Figma component set `3684:40507` — regenerate if variant properties change.*
