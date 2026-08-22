---
component: Dialog
version: 1.4.0
wave: 5
slots:
  - name: Title
    required: true
  - name: Body
    required: true
  - name: Footer actions
    required: false
    notes: Typically Button.
props:
  - name: size
    values: [sm, md, lg]
  - name: dismissible
    values: boolean
tokens:
  - name: surface-elevated
    usage: The shared overlay surface — surface at an elevated tone step.
  - name: scrim
    usage: Full-screen scrim at a defined opacity over the base surface.
  - name: on-surface
    usage: Title and body text.
  - name: outline
    usage: Footer divider.
  - name: spacing
    usage: Padding and size steps.
  - name: radius
    usage: Panel corner.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Always traps focus, always returns focus to the trigger on close.
  - Footer follows Button's one-primary-action rule, same as Card, and is wrapped in the same ButtonGroup that enforces it.
prohibitions:
  - No Dialog opened from within another Dialog — stack depth of one.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Dialog
- **Slots:** Title (required), body (required), footer actions (optional, typically Button).
- **Props:** size (sm, md, lg), dismissible (boolean).
- **Tokens:** `surface-elevated`, `on-surface` text, `outline` footer divider, and a full-screen `scrim` at a defined opacity over the base surface; the spacing scale for padding and size steps.
- **Composition rules:** Always traps focus, always returns focus to the trigger on close. Footer follows Button's one-primary-action rule, same as Card, wrapped in the same ButtonGroup that enforces it.
- **Prohibitions:** No Dialog opened from within another Dialog — stack depth of one.
