# Content switcher

Segmented control for toggling between mutually exclusive views without a full navigation change.

**Figma:** [Content switcher](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=10151-402486)
**Figma node ID:** `10151:402486` — page "02 Components – Content switcher"
**Internal building blocks (do not use directly):** `_Content switcher text item`, `_Content switcher icon item`

## Variant properties

| Property | Options |
|---|---|
| Type | Default, Icon only |
| Size | Large, Medium, Small |
| Disabled | False, True |
| Low contrast | False, True |

## Item properties

| Property | Options |
|---|---|
| Position | Left, Middle, Right |
| Contrast | Low contrast, Default |
| State | Enabled, Hover, Disabled, Focus |
| Selected | False, True |

Per the component's own note: adjust the switcher's width so the longest section label has 16px of right padding, and hide/show sections as needed rather than deleting them.

## When to use

- Use for 2–4 closely related views where only one is visible at a time (e.g. List/Grid toggle, Day/Week/Month).
- Use `Icon only` type in compact toolbars where labels aren't needed.
- Use `Low contrast` on already-colored or busy backgrounds.

## Do / Don't

- Do keep option count small — Content switcher isn't meant for long lists; use Tabs for more than a handful of options.
- Don't use Content switcher for navigation between unrelated pages — it implies the views are variations of the same content.

---
*Generated from Figma component set `10151:402486` — regenerate if variant properties change.*
