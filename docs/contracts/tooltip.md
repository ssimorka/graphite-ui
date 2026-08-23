---
component: Tooltip
version: 1.4.0
wave: 5
slots:
  - name: Trigger
    required: true
    notes: Any focusable element.
  - name: Content
    required: true
    notes: Short text only.
props:
  - name: placement
    values: [top, bottom, left, right]
  - name: delay
tokens:
  - name: surface-elevated
    usage: The shared overlay surface — surface at an elevated tone step.
  - name: on-surface
    usage: Text.
  - name: outline
    usage: Edge. Required, not decorative — in Light the elevated surface resolves to the same value as `surface`, so the border is the only thing separating the bubble from the page.
  - name: spacing
    usage: Padding and offset from the trigger.
  - name: radius
    usage: Bubble corner.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Never contains interactive content — a Tooltip you can click into is a Popover.
prohibitions:
  - No tooltip as the only source of critical information — it must be supplementary to visible content.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Tooltip
- **Slots:** Trigger (required, any focusable element), content (required, short text only).
- **Props:** placement (top, bottom, left, right), delay.
- **Tokens:** `surface-elevated`, `on-surface` text, `outline` for the edge; the spacing scale for padding and trigger offset.
- **Composition rules:** Never contains interactive content — a Tooltip you can click into is a Popover.
- **Prohibitions:** No tooltip as the only source of critical information — it must be supplementary to visible content.
