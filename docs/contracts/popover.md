---
component: Popover
version: 1.3.0
wave: 5
slots:
  - name: Trigger
    required: true
  - name: Content
    required: true
    notes: Can include interactive elements.
props:
  - name: placement
  - name: modal
    values: boolean
    notes: Whether it traps focus.
  - name: defaultOpen
    values: boolean
    notes: Starts open. For documentation surfaces that need to show the open state; dismissal still comes from the shared Overlay base.
tokens:
  - name: surface-elevated
    usage: The shared overlay surface — surface at an elevated tone step.
  - name: outline
    usage: Edge.
  - name: spacing
    usage: Padding, radius, and offset from the trigger.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Inherits the shared Overlay dismiss pattern exactly — no custom close behavior per instance.
prohibitions:
  - No Popover nested inside another Popover.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Popover
- **Slots:** Trigger (required), content (required, can include interactive elements).
- **Props:** placement, modal (boolean — whether it traps focus), defaultOpen (boolean — starts open, for documentation surfaces).
- **Tokens:** `surface-elevated`, `outline` edge; the spacing scale for padding, radius and trigger offset.
- **Composition rules:** Inherits the shared Overlay dismiss pattern exactly — no custom close behavior per instance.
- **Prohibitions:** No Popover nested inside another Popover.
