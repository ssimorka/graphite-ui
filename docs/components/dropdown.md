# Dropdown

Custom selection component covering single-select, combo box (filterable single), multi-select, and filterable multi-select — each in Default and Fluid layouts. Use Dropdown for &lt;10 options when you need behavior beyond native Select (filtering, multi-select).

**Figma node IDs (page "02 Components – Dropdown"):**

| Variant | Default | Fluid |
|---|---|---|
| Single select | `14032:290635` | `14505:302528` |
| Combo box (filterable single) | `14032:290976` | `14505:304219` |
| Multi-select | `14032:291311` | `14530:300220` |
| Filterable multi-select | `14032:291673` | `45988:11486` |

**Figma:** [Dropdown - Default](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=14032-290635)

## Variant properties — Single select (Default)

| Property | Options |
|---|---|
| Style | Fixed, Inline |
| Size | Large, Medium, Small |
| State | Enabled, Hover, Focus, Disabled, Error, Warning, Skeleton, Read-only |
| Open | False, True |
| Selected | False, True |

## Variant properties — Combo box, Multi-select, Filterable multi-select

All three follow the same Size / State / Open / Selected shape as Single select, with State option lists varying slightly per variant (check the Figma component set directly before assuming parity — Combo box drops Hover/Warning from its State list, for example).

## Other properties (common across variants)

| Property | Type | Notes |
|---|---|---|
| Label text / Show helper | Text + Boolean | field label and helper visibility |
| Helper / Error / Warning message | Text | supporting/validation copy |
| Selected text / Unselected text / Prompt text | Text | content states |
| Filter text | Text | Combo box / Filterable multi-select only |

## When to use

- **Single select** — one option, custom styling needed beyond native Select.
- **Combo box** — one option, with type-to-filter.
- **Multi-select** — multiple options via checkboxes, no filtering.
- **Filterable multi-select** — multiple options with type-to-filter, for longer lists.

## Do / Don't

- Do check the specific variant's State list in Figma before coding — they aren't perfectly identical across the four types.
- Don't use Dropdown for a short static list where native Select would do — it's heavier to implement and maintain.

---
*Generated from Figma component sets under node `14032:*` / `14505:*` / `14530:*` / `45988:*` — regenerate if variant properties change.*
