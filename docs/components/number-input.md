# Number input

Single-line numeric field with increment/decrement actions built in.

**Figma:** [Number input - Default](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=19893-290998)
**Figma node IDs:** `19893:290998` (Default), `19893:291117` (Fluid) — page "02 Components – Number input"
**Internal building blocks (do not use directly):** `_Number input action item`, `_AI slug action item`, `_Revert button action item`, `_Number input base`

## Variant properties — Number input - Default

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| State | Enabled, Focus, Disabled, Error, Warning, Skeleton, Read-only |

## Variant properties — Number input - Fluid

| Property | Options |
|---|---|
| State | Enabled, Hover, Focus, Error, Warning, Disabled, Skeleton, Read-only |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Label text / Show label | Text + Boolean | field label |
| Helper / Error / Warning text | Text + Boolean | supporting/validation copy |

## When to use

- Use for bounded or steppable numeric values (quantity, price, count) where increment/decrement buttons help.
- For free-form numeric entry without stepping, Text input with numeric validation may be simpler.

## Do / Don't

- Do pair with min/max constraints in code — the design doesn't encode them, only the visual state.
- Don't repurpose Number input for non-numeric content.

---
*Generated from Figma component sets `19893:290998` / `19893:291117` — regenerate if variant properties change.*
