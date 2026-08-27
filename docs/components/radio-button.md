# Radio button

Selection control for choosing exactly one option from a set.

**Figma:** [Radio button component set](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=2930-23442)
**Figma node ID:** `2930:23442` (component set, page "02 Components – Radio button")
**Related:** `Radio button group` — `2927:28166` (same page)

## Variant properties — Radio button

| Property | Options |
|---|---|
| State | Enabled, Focus, Disabled, Skeleton, Read-only, Invalid, Warning |
| Position | Left, Right |
| Selected | False, True |

## Variant properties — Radio button group

| Property | Options |
|---|---|
| State | Enabled, Invalid, Read-only, Warning |
| Horizontal | False, True |

## Other properties

| Property | Type | Default |
|---|---|---|
| Label / Value | Boolean + Text | shows/hides and sets label and value copy |
| Error / Warning / Helper message | Boolean + Text | shows/hides and sets supporting text |

## When to use

- Use `Radio button group` to lay out the full set with shared label and validation text, rather than composing individual radios.
- `Position = Right` for layouts where the control sits after the label (e.g. right-aligned settings rows).

## Do / Don't

- Do always show more than one radio option — a single radio button implies a checkbox instead.
- Don't use Radio button for multi-select — use Checkbox.

---
*Generated from Figma component set `2930:23442` — regenerate if variant properties change.*
