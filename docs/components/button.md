# Button

Primary CTA component. Use Primary for the main action on a screen, Secondary for alternatives, Ghost for tertiary actions, and Danger styles only for destructive actions (delete, remove).

**Figma:** [Button component set](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=1854-1776)
**Figma node ID:** `1854:1776` (component set, page "02 Components – Button")

## Variant properties

| Property | Options |
|---|---|
| Style | Primary, Secondary, Ghost, Danger primary, Danger ghost |
| Type | Text + Icon, Icon only |
| Size | 2x large, Extra large, Large (default), Medium, Small |
| State | Enabled, Hover, Focus, Active, Disabled, Skeleton |

Not every Style × Type × Size combination has a variant defined — Icon only is currently only built out at Extra large and Large. Check the component set in Figma before assuming a combination exists.

## Tokens

Resolved from the component set's bound variables. All are semantic/theme-tier — never bind to primitives directly.

| Token | Value (light) | Used for |
|---|---|---|
| `--cts-primary` | `#4c2f93` | Primary style fill (Enabled) |
| `--cts-primary-hover` | `#340b74` | Primary style fill (Hover) |
| `--cts-primary-pressed` | `#1a0044` | Primary style fill (Active) |
| `--cts-primary-disabled` | `#dedde2` | Primary/Secondary fill (Disabled) |
| `--cts-on-primary` | `#f8f7ff` | Text/icon on Primary fill |
| `--cts-secondary` | `#005543` | Secondary style border/text |
| `--cts-secondary-hover` | `#00372a` | Secondary style (Hover) |
| `--cts-secondary-pressed` | `#001c14` | Secondary style (Active) |
| `--cts-error` | `#880c06` | Danger primary fill (Enabled) |
| `--cts-error-hover` | `#5d0000` | Danger primary (Hover) |
| `--cts-error-pressed` | `#330000` | Danger primary (Active) |
| `--cts-focus-ring` | `#5e44aa` | Focus ring, all styles except danger |
| `--cts-error-focus-ring` | `#aa3428` | Focus ring, danger styles |
| `--cts-disabled-content` | `#808084` | Disabled label/icon color |

**Typography:** bound to `family/font-2` (IBM Plex Sans), weight `weight/medium`. Font size steps with size: `16/24` (Large+), `14/20` (Medium), `12/16` (Small) — size/line-height in px.

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
*Generated from Figma component set `1854:1776` — regenerate if variant properties or tokens change.*
