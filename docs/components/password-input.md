# Password input

Single-line masked field for password entry, with a show/hide text toggle.

**Figma:** [Password input - Default](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=5621-280380)
**Figma node IDs:** `5621:280380` (Default), `68771:7312` (Fluid) — page "02 Components – Password input"
**Internal building block (do not use directly):** `_Password input base` (`5519:272447`)

## Variant properties — Password input - Default

| Property | Options |
|---|---|
| Style | Inline, Fixed |
| Size | Large, Medium, Small |
| State | Enabled, Focus, Error, Warning, Disabled, Skeleton |
| Filled | False, True |
| Show text | False, True |

## Variant properties — Password input - Fluid

| Property | Options |
|---|---|
| State | Enabled, Focus, Error, Warning, Disabled, Skeleton |
| Filled | False, True |
| Show text | True, False |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Label text | Text | field label |
| Helper / Error / Warning text | Text + Boolean | supporting/validation copy |

## When to use

- Follows the same Fixed/Fluid split as Text input — use Fixed for standard form layouts, Fluid for full-width.
- `Show text = True` renders the visible-password state; wire it to the show/hide toggle in code, not a separate component.

## Do / Don't

- Do show a visibility toggle by default — it's built into the component, not optional to add later.
- Don't build a custom masked Text input — use this component so masking behavior stays consistent.

---
*Generated from Figma component sets `5621:280380` / `68771:7312` — regenerate if variant properties change.*
