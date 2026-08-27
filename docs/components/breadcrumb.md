# Breadcrumb

Shows the user's location within a hierarchy and lets them navigate back up it.

**Figma:** [Breadcrumb item](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=3136-29234)
**Figma node ID:** `3136:29234` (item component — a full breadcrumb is composed of these) — page "02 Components – Breadcrumb"

## Variant properties

| Property | Options |
|---|---|
| Type | Link, Overflow |
| State | Enabled, Hover, Focus, Active, Skeleton, Current, Open |
| Current | False, True |
| Open | False, True |

## When to use

- Compose a breadcrumb trail from multiple `Link`-type items, with the final item set to `Current = True`.
- Use `Overflow` type when the trail has more segments than fit — collapses middle segments behind an overflow trigger.

## Do / Don't

- Do mark exactly one item `Current` — the page the user is on, not a link.
- Don't make the Current item clickable/styled as a link — its state exists specifically to look inert.

---
*Generated from Figma component `3136:29234` — regenerate if variant properties change.*
