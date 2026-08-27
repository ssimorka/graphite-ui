# Text area

Multi-line form field. Use when the expected input is more than one sentence.

**Figma:** [Text area - Default](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=14494-263111)
**Figma node IDs:** `14494:263111` (Default), `18791:274643` (Fluid) — page "02 Components – Text area"

## Variant properties — Text area - Default

| Property | Options |
|---|---|
| State | Enabled, Focus, Error, Warning, Disabled, Skeleton, Read-only |
| Text filled | False, True |

## Variant properties — Text area - Fluid

| Property | Options |
|---|---|
| State | Warning, Enabled, Error, Disabled, Focus, Read-only |
| Text filled | False, True |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Label text / Show label | Text + Boolean | field label |
| Placeholder text / Body text | Text | empty vs filled content |
| Helper / Error / Warning text | Text + Boolean | supporting/validation copy |
| Show count / Count text | Boolean + Text | character counter |

## When to use

- Use Default for standard forms with a fixed layout width.
- Use Fluid for full-width layouts, matching Text input's Fixed/Fluid split.

## Do / Don't

- Do use the character count for fields with a hard limit.
- Don't use Text area for single-line values — use Text input instead, it has more compact size options.

---
*Generated from Figma component sets `14494:263111` / `18791:274643` — regenerate if variant properties change.*
