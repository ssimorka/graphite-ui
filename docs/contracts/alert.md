---
component: Alert
version: 1.1.0
wave: 5
slots:
  - name: Icon
    required: false
  - name: Title
    required: false
  - name: Body
    required: true
props:
  - name: variant
    values: [informational]
    blocked_values: [success, warning, error]
    blocked_on: Wave 0
tokens:
  - name: surface
    usage: Background.
  - name: on-surface
    usage: Text.
  - name: outline
    usage: Edge for the informational variant.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Not a toast — Alert is inline and persistent until dismissed or the condition changes. Toast is a Tier 2 component with its own timing contract.
prohibitions:
  - No status-colored Alert variants until Wave 0 ships — ship informational only, same constraint as Badge.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Alert
- **Slots:** Icon (optional), title (optional), body (required).
- **Props:** variant (informational now; success/warning/error **[blocked on Wave 0]**).
- **Tokens:** `surface` background, `on-surface` text, `outline` edge for the informational variant.
- **Composition rules:** Not a toast — Alert is inline and persistent until dismissed or the condition changes. Toast is a Tier 2 component with its own timing contract.
- **Prohibitions:** No status-colored Alert variants until Wave 0 ships — ship informational only, same constraint as Badge.
