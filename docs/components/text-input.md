# Text input

Single-line form field for short text entries. Two layout styles: Default (Fixed/Inline widths) and Fluid (full-width, stacked label).

**Figma:** [Text input - Default](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=15784-271032)
**Figma node IDs:** `15784:271032` (Default — Fixed/Inline), `15784:271289` (Fluid) — page "02 Components – Text input"

## Variant properties — Text input - Default

| Property | Options |
|---|---|
| Style | Inline, Fixed |
| Size | Large, Medium, Small |
| State | Enabled, Focus, Error, Warning, Disabled, Skeleton, Read-only |
| Text filled | False, True |

## Variant properties — Text input - Fluid

| Property | Options |
|---|---|
| State | Enabled, Focus, Error, Warning, Disabled, Skeleton, Read-only |
| Text filled | False, True |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Label text | Text | field label |
| Placeholder text / Input text | Text | empty vs filled content |
| Helper / Error / Warning text | Text + Boolean | supporting/validation copy |
| Show count / Count text | Boolean + Text | character counter, e.g. "0/100" |
| Show tooltip (Fluid only) | Boolean | inline help tooltip next to label |

## When to use

- **Fixed** — default choice for most forms; width is set by the layout, not the content.
- **Inline** — compact, single-line contexts (inline editing, table cells).
- **Fluid** — full-width fields, typically paired with a tooltip instead of persistent helper text.
- Default size is Large for the Fixed style, per the design system guidelines.

## Do / Don't

- Do reserve `Error` / `Warning` states for real validation feedback, not styling variety.
- Don't hand-build a text field from primitives — every state (including Skeleton and Read-only) already exists as a variant.

---
*Generated from Figma component sets `15784:271032` / `15784:271289` — regenerate if variant properties change.*
