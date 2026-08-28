# Button

Primary CTA component. Use Primary for the main action on a screen, Secondary for alternatives, Ghost for tertiary actions, and Danger styles only for destructive actions (delete, remove).

**Figma:** [Button component set](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=1854-1776)
**Figma node ID:** `1854:1776` (component set, page "02 Components – Button")

## Variant properties

| Property | Options |
|---|---|
| Style | Primary, Secondary, Ghost, Danger primary, Danger ghost |
| Type | Text + Icon, Icon only |
| Size | Expressive, 2x large, Extra large, Large (default), Medium, Small |
| State | Enabled, Hover, Focus, Active, Disabled, Skeleton |

258 variants. Not every Style × Type × Size × State combination exists — Icon only is not built out at every size. Check the component set in Figma before assuming a combination is there.

## Geometry

Read from the component set, not from the contract. The frame itself carries no padding or radius: layout lives in an inner `Button content` frame.

| Size | Height | Font size / line-height |
|---|---|---|
| Small | 32px | 12 / 16 |
| Medium | 42px | 14 / 20 |
| Large | 50px | 14 / 20 |
| Expressive | 50px | 16 / 24 |
| Extra large | 66px | 14 / 20 |
| 2x large | 82px | 14 / 20 |

- **Padding** (`Button content`): `15px 64px 15px 16px`. The large right inset is deliberate — it is the space the trailing icon sits in, and it is what gives a Carbon button its left-aligned label rather than a centred one.
- **Corner radius:** `0` on every variant.
- **Gap:** `0`. The icon is positioned by the right padding, not by a gap.
- **Icon:** 24×24 frame at the trailing edge, holding an icon instance (`fi-rs-plus-small` in the shipped variants).

## Tokens

Resolved from the component set's bound variables — all semantic tier, never primitives. Names below are the Figma variable names; the token export prefixes these as `--cts-*`.

| Style | Fill | Label |
|---|---|---|
| Primary | `primary` | `onPrimary` |
| Secondary | `secondary` | `onPrimary` |
| Ghost | `transparent` | `primary` |
| Danger primary | `danger` | `onPrimary` |
| Danger ghost | `transparent` | `danger` |

No style carries a stroke. Secondary is a **filled** style in the kit, not an outline.

Interaction states resolve from the matching `state/*` roles — `state/primary-hover`, `state/primary-pressed`, `state/danger-hover`, and so on — plus `state/*-focus-ring` for focus and `state/*-disabled` / `state/*-disabled-content` for disabled.

**Typography:** `family/font-2` (IBM Plex Sans), weight `weight/medium`.

## When to use

- **Primary** — one per view for the main action.
- **Secondary** — alternative actions alongside a Primary button.
- **Ghost** — low-emphasis or tertiary actions, often paired with a Primary or Secondary button.
- **Danger primary / Danger ghost** — destructive actions only. Never use Danger styling for a non-destructive action.

## Do / Don't

- Do keep one Primary button per view or form.
- Do use the Skeleton state for loading placeholders, not a disabled Primary button.
- Don't mix button sizes within the same toolbar or form.
- Don't use Icon only without an accessible label (`aria-label` or equivalent) in code.

---
*Generated from Figma component set `1854:1776`, 2026-08-28 — regenerate if variant properties or tokens change.*
