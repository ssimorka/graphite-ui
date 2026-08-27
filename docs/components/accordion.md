# Accordion

Delivers large amounts of content in a small space through progressive disclosure — users see key details and can expand for more.

**Figma:** [Accordion item](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=2154-8478)
**Figma node ID:** `2154:8478` (a full accordion is composed of these items) — page "02 Components – Accordion"

## Variant properties

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| State | Enabled, Hover, Focus, Disabled, Skeleton |
| Alignment | Right, Left |
| Flush | False, True |
| Expanded | False, True |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Title text | Text | header row label |
| Content text | Text | expanded body copy |
| Slot / Swap slot | Boolean + Instance swap | custom content in place of plain text |

## When to use

- Stack multiple Accordion items to build a full accordion group.
- Use `Alignment = Left` when the expand chevron should lead rather than trail the title (matches some list-style layouts).
- Use `Flush = True` when the accordion sits directly against a container edge with no outer padding.

## Do / Don't

- Do keep accordion titles scannable — they're the only visible content when collapsed.
- Don't nest an Accordion inside another Accordion item's content — it gets confusing to navigate; consider Tabs or a separate page section instead.

---
*Generated from Figma component set `2154:8478` — regenerate if variant properties change.*
