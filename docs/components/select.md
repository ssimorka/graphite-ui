# Select

Native-style selection input — one option chosen from a list, relying on the browser's native select behavior. Use Select for native browser behavior; use Dropdown when you need custom styling, combo box, or multi-select behavior.

**Figma:** [Select - Default](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=17650-274860)
**Figma node IDs:** `17650:274860` (Default), `17650:275243` (Fluid) — page "02 Components – Select"
**Internal building blocks (do not use directly):** `_Select menu default base`, `_Select menu inline base`, `_Select menu chrome menu items`

## Variant properties — Select - Default

| Property | Options |
|---|---|
| Style | Inline, Default |
| Size | Large, Medium, Small |
| State | Enabled, Hover, Focus, Open, Error, Warning, Disabled, Read-only, Skeleton |
| Open | False, True |

## Variant properties — Select - Fluid

| Property | Options |
|---|---|
| State | Enabled, Hover, Focus, Open, Error, Warning, Disabled, Read-only, Skeleton |
| Open | False, True |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Label text / Show label | Text + Boolean | field label |
| Helper / Error / Warning text | Text + Boolean | supporting/validation copy |
| Read-only Input text | Text | shown value when State = Read-only |

## When to use

- Use for &lt;10 options where native OS picker behavior is acceptable.
- Use Dropdown instead for filterable, multi-select, or combo box needs.

## Do / Don't

- Do rely on this for accessibility — native `<select>` semantics come for free.
- Don't use Select where users need to filter or multi-select — reach for Dropdown.

---
*Generated from Figma component sets `17650:274860` / `17650:275243` — regenerate if variant properties change.*
