---
component: Alert
version: 2.1.0
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
    values: [info, danger, warning, success]
tokens:
  - name: surface
    usage: Background.
  - name: on-surface
    usage: Text.
  - name: outline
    usage: Edge for the info variant.
  - name: spacing
    usage: Padding and gaps between icon, title, and body.
  - name: danger
    usage: Icon and edge on the danger variant.
  - name: warning
    usage: Icon and edge on the warning variant.
  - name: success
    usage: Icon and edge on the success variant.
  - name: danger-container
    usage: Background on the danger variant.
  - name: warning-container
    usage: Background on the warning variant.
  - name: success-container
    usage: Background on the success variant.
  - name: on-danger-container
    usage: Text on the danger variant.
  - name: on-warning-container
    usage: Text on the warning variant.
  - name: on-success-container
    usage: Text on the success variant.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Not a toast — Alert is inline and persistent until dismissed or the condition changes. Toast is a Tier 2 component with its own timing contract.
prohibitions:
  - No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex. Same constraint as Badge.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Alert
- **Slots:** Icon (optional), title (optional), body (required).
- **Props:** variant (info, danger, warning, success).
- **Tokens:** `surface` background, `on-surface` text, `outline` edge for the `info` variant; the spacing scale for padding and gaps. Status variants take `danger-container`/`warning-container`/`success-container` for background, the matching `on-*-container` for text, and the base `danger`/`warning`/`success` role for icon and edge.
- **Composition rules:** Not a toast — Alert is inline and persistent until dismissed or the condition changes. Toast is a Tier 2 component with its own timing contract.
- **Prohibitions:** No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex. Same constraint as Badge.
