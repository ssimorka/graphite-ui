# Structured list

Simpler tabular layout than Data table — for presenting structured rows of content without sorting, pagination, or batch actions. Comes in a plain and a Selectable variant.

**Figma node IDs (page "02 Components – Structured list"):**

| Component | Node ID |
|---|---|
| Structured list | `11797:285083` |
| Structured list - Selectable | `61653:7458` |

**Figma:** [Structured list](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=11797-285083)

## Variant properties — Structured list

| Property | Options |
|---|---|
| Size | Default, Condensed |
| Flush | False, True |

## Variant properties — Structured list - Selectable

| Property | Options |
|---|---|
| Size | Default, Condensed |
| v12 feature flag | False, True |

## Key sub-components

| Component | Purpose |
|---|---|
| `_Structured list header row item` | Column headers |
| `_Structured list row item` / `_Structured list row item - Selectable` | Body rows |
| `_Structured list select cell base` | Checkmark or radio-button selection indicator |

Per the file's note: you may need to detach the instance to adjust column width or order.

## When to use

- Use for simpler structured content than Data table needs — no sorting, no pagination, no batch actions.
- Use `Flush = True` to remove the list's outer padding when it sits flush against a container edge.
- Use Selectable when rows need single/multi selection without the full Data table machinery.

## Do / Don't

- Do use Data table instead once you need sorting, pagination, or row expansion — Structured list isn't built for those.
- Don't mix Default and Condensed sizes within the same list.

---
*Generated from Figma component sets `11797:285083` / `61653:7458` — regenerate if variant properties change.*
