# Search

Field for finding content by keyword, without relying on navigation.

**Figma:** [Search - Default](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=2805-21056)
**Figma node IDs:** `2805:21056` (Default), `15503:270751` (Fluid) — page "02 Components – Search"

## Variant properties — Search - Default

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| State | Enabled, Hover, Focus, Filled, Disabled, Skeleton |
| Expandable | False, True |
| Expanded | False, True |

## Variant properties — Search - Fluid

| Property | Options |
|---|---|
| State | Enabled, Hover, Focus, Disabled, Skeleton |
| Text filled | False, True |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Query text / Placeholder text | Text | filled vs empty content |

## When to use

- Use `Expandable` in space-constrained UI (e.g. a header) where Search collapses to an icon until activated.
- Use the non-expandable Default for a persistent search field (toolbars, page headers with room).

## Do / Don't

- Do use Search rather than a generic Text input when the field's purpose is keyword lookup — it carries the right icon and interaction pattern.
- Don't use Expanded=True as a static empty state — it's meant to represent the active/focused expansion.

---
*Generated from Figma component sets `2805:21056` / `15503:270751` — regenerate if variant properties change.*
