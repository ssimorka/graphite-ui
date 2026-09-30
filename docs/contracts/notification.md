---
component: Notification
version: 2.3.0
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
  - name: onClose
    type: "() => void"
    notes: Optional. When set, a close button labelled "Dismiss notification" renders at the trailing edge and calls it. Without it the notification has no close control and lasts until the caller stops rendering it.
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
  - name: info
    usage: Icon on the info variant. The edge stays outline; only the glyph takes the status role.
  - name: primary
    usage: The focus ring on the close button, through the page-level focus variable.
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
  - name: radius
    usage: Container corner.
composition_rules:
  - Not an overlay, though the source document lists it with them. It renders inline in the page flow, on plain `surface`, with nothing to trap focus in and no Escape or click-outside dismissal. Its one dismiss pattern is the explicit close control, present only when `onClose` is set.
  - Not a toast — Notification is inline and persistent until dismissed or the condition changes. Toast is a Tier 2 component with its own timing contract.
prohibitions:
  - No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex. Same constraint as Tag.
---

> **Shared Wave 5 overlay base** — quoted from the source document, which lists Notification among the five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.
>
> Notification does not inherit that base, and until 2.3.0 this contract wrongly said it did. It is inline and persistent, so it takes plain `surface` rather than the elevated one, has no focus to trap, and is dismissed only through its optional close control. Of the base's three dismiss patterns it keeps the explicit close control and nothing else.

### Notification
- **Slots:** Icon (optional), title (optional), body (required).
- **Props:** variant (info, danger, warning, success); `onClose` (optional), which renders a close button labelled "Dismiss notification".
- **Tokens:** `surface` background, `on-surface` text, `outline` edge for the `info` variant; the spacing scale for padding and gaps. Status variants take `danger-container`/`warning-container`/`success-container` for background, the matching `on-*-container` for text, and the base `danger`/`warning`/`success` role for icon and edge. The info variant colours its icon with `info` and keeps the `outline` edge. The close button inherits the text colour and draws the `--graphite-focus` ring.
- **Composition rules:** Not an overlay: inline, with no focus trap and no Escape or click-outside dismissal. Not a toast — Notification is inline and persistent until dismissed (through `onClose`, when the caller provides it) or the condition changes. Toast is a Tier 2 component with its own timing contract.
- **Prohibitions:** No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex. Same constraint as Tag.
