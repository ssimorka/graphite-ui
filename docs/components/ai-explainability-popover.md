# AI explainability popover

Appears when the user interacts with an AI label, and gives detailed information about how AI-generated content was produced (function, model, and training data details).

**Figma:** [AI explainability popover](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=57561-3508)
**Figma node ID:** `57561:3508` — page "02 Components – AI explainability popover"

## Variant properties

| Property | Options |
|---|---|
| Type | Primary explanation, Secondary explanation |

## Other properties

| Property | Type | Notes |
|---|---|---|
| AI title | Text | feature name |
| AI description | Text | 1–2 sentence summary of how AI is used in this UI |
| Function details / Model details / Training data | Boolean | show/hide each explainability section |
| Slot 1–4 / Swap slot 1–4 | Boolean + Instance swap | up to 4 custom content slots |
| Confidence | Boolean | shows a confidence score in the heading |
| Actions | Boolean | footer action row |
| Top caret / Bottom caret / Push caret right / Push caret left | Boolean | positions the popover's pointer |

The heading supports two type-token options — **Confidence score** (shows a percentage) and **Detail** (more background copy) — switched via the Callout heading modifier in Figma.

## When to use

- Trigger this popover from an `AI label`'s interactive state (Hover/Focus/Active).
- Use `Confidence` when a meaningful confidence percentage exists for the AI output; use the Detail heading instead when there isn't one.
- Use up to 4 slots for structured supporting content (sources, related data points) beyond the standard Function/Model/Training data sections.

## Do / Don't

- Do fill in genuine Function/Model/Training data content — this component exists specifically to satisfy AI transparency requirements, not as generic popover chrome.
- Don't show a `Confidence` score you can't actually back with a real value — it implies precision the AI output may not have.

---
*Generated from Figma component set `57561:3508` — regenerate if variant properties change.*
