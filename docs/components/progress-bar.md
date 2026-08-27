# Progress bar

Horizontal, determinate or indeterminate progress indicator with label, helper text, and success/error messaging.

**Figma:** [Progress bar](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=9506-402924)
**Figma node ID:** `9506:402924` — page "02 Components – Progress bar"

## Variant properties

| Property | Options |
|---|---|
| State | Active, Success, Error |
| Progress | 0%, 25%, 50%, 75%, Success, Error, Indeterminate |
| Alignment | Default, Inline, Indent |
| Size | Big, Small |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Label text | Text | progress bar heading |
| Helper text | Text | supporting copy during progress |
| Success text / Error text | Text | shown when the corresponding state is reached |

## When to use

- Use `Indeterminate` when the total duration or completion percentage is unknown.
- Use `Inline` or `Indent` alignment when the bar sits within a denser layout (e.g. inside a list row) rather than standalone.

## Do / Don't

- Do swap `Helper text` for `Success text`/`Error text` when the corresponding state is reached, rather than leaving generic helper copy in place.
- Don't use Progress bar for a step-by-step flow — that's Progress indicator's job; Progress bar communicates continuous completion of one task.

---
*Generated from Figma component set `9506:402924` — regenerate if variant properties change.*
