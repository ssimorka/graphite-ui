# AI layer

Background and field treatments that identify AI-related surfaces at a glance — a visual layer distinct from baseline styling, for consistent recognition across the product wherever AI is present.

**Figma node IDs (page "02 Components – AI layer"):**

| Component | Node ID |
|---|---|
| AI layer - Background | `51447:122453` |
| AI layer - Field | `55928:174` |
| AI layer - Shadow | `51447:122527` |
| AI layer - Border | `51447:122528` |

**Figma:** [AI layer - Background](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=51447-122453)

## Variant properties — Background

| Property | Options |
|---|---|
| Level | Background, Layer 01, Layer 02 |
| State | Enabled, Hover, Selected, Selected + Hover, Active |

## Variant properties — Field

| Property | Options |
|---|---|
| Level | Background, Layer 01, Layer 02 |
| State | Enabled, Hover |

`AI layer - Shadow` and `AI layer - Border` are the two single-component pieces
the layer is assembled from. Neither has variants or properties: they are the
raw treatments that Background and Field switch on and off, which is what the
`Show Background layer` boolean below is switching.

Both carry a `Show Background layer` boolean. By default both the background layer and border are visible — remove one or both depending on the component's needs.

## When to use

- **Background** — wraps a whole component or section that's AI-driven (a card, panel, or data table row).
- **Field** — applies the AI treatment specifically to form fields with AI-generated or AI-assisted values.
- Use `Level` (Background/Layer 01/Layer 02) to match the surrounding elevation context, same logic as Graphite's standard layering tokens.

## Do / Don't

- Do pair AI layer with an AI label where the AI involvement isn't otherwise obvious — the layer alone is a visual cue, not a full disclosure.
- Don't leave both background and border on by default without checking whether the specific component actually needs both — the file explicitly calls this out as something to adjust per use.

---
*Generated from Figma component sets `51447:122453` / `55928:174` / `51447:122527` / `51447:122528` — regenerate if variant properties change.*
