# Checkbox

Selection control for choosing one or more options from a set, or a single standalone on/off choice.

**Figma:** [Checkbox component set](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=11506-27302)
**Figma node ID:** `11506:27302` (component set, page "02 Components – Checkbox")
**Related:** `Checkbox group` — `11506:27535` (same page)

## Variant properties — Checkbox

| Property | Options |
|---|---|
| State | Enabled, Focus, Disabled, Skeleton, Read-only, Invalid, Warning |
| Selection | Unchecked, Checked, Indeterminate |

## Variant properties — Checkbox group

| Property | Options |
|---|---|
| State | Enabled, Read-only, Invalid, Warning |
| Horizontal | False, True |

## Other properties

| Property | Type | Default |
|---|---|---|
| Value / Label | Boolean + Text | shows/hides and sets the label copy |
| Error / Warning / Helper message | Boolean + Text | shows/hides and sets supporting text |
| Indented | Boolean | false |

## When to use

- Use `Indeterminate` for a parent checkbox representing a partially-selected group.
- Use `Checkbox group` to lay out a labeled set with shared helper/error/warning text, rather than composing individual checkboxes by hand.
- Use `Invalid` / `Warning` states to reflect form validation, not just `Disabled`.

## Do / Don't

- Do keep helper/error/warning text mutually exclusive — only one should show at a time.
- Don't use Checkbox for a single binary on/off action outside a form — use Toggle instead.

---
*Generated from Figma component set `11506:27302` — regenerate if variant properties change.*
