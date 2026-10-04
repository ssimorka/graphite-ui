# Select

Single-choice field: one option chosen from a list. The trigger is the field shell; since select.md 3.0.0 it opens the kit's own list (Dropdown's), not the browser's. Use Dropdown for the Dropdown sets' own trigger, or for combo box and multi-select behavior.

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

- Use as the default single choice in a form, sized to match the text inputs beside it.
- Use Dropdown instead for filterable, multi-select, or combo box needs.

## Do / Don't

- Do rely on its keyboard: it is the ARIA select-only combobox, the same behavior Dropdown has (arrows, Home/End, type-ahead, Escape).
- Don't use Select where users need to filter or multi-select — reach for Dropdown.

---
*Generated from Figma component sets `17650:274860` / `17650:275243` — regenerate if variant properties change.*
