---
component: Tag
version: 2.3.0
wave: 1
slots:
  - name: Label
    required: true
    notes: Short text or number.
props:
  - name: variant
    values: [neutral, primary, danger, warning, success]
tokens:
  - name: danger-container
    usage: Background on the danger variant.
  - name: warning-container
    usage: Background on the warning variant.
  - name: success-container
    usage: Background on the success variant.
  - name: spacing
    usage: Padding.
  - name: on-danger-container
    usage: Text on the danger variant.
  - name: on-warning-container
    usage: Text on the warning variant.
  - name: on-success-container
    usage: Text on the success variant.
  - name: radius
    usage: Pill shape, via `full` — the badge radius has always equalled its height.
  - name: surface-variant
    usage: Fill on the neutral tag. The kit's Gray tag binds surfaceVariant, not surface.
  - name: on-surface-variant
    usage: Label on the neutral tag.
  - name: primary-container
    usage: Fill on the primary tag. Every colour in the kit's Tag - Read-only is a container role, so a tag never reads as heavy as a filled Button.
  - name: on-primary-container
    usage: Label on the primary tag.
composition_rules:
  - Numeric badges cap display at a defined max (e.g. "99+") rather than overflowing their container.
prohibitions:
  - The warning variant has no counterpart in the kit. Tag - Read-only ships Blue, Teal, Green, Purple, Red, Gray, High contrast and Outline, and no orange among them. It is kept rather than dropped, because removing a variant is breaking, but it is the one colour here the kit does not vouch for.
  - No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex.
---

### Tag
- **Slots:** Label (required, short text or number).
- **Props:** variant (neutral, primary, danger, warning, success).
- **Tokens:** `primary` with `on-primary` for the emphasis variant, `on-surface`/`surface` for neutral, and `danger-container`/`warning-container`/`success-container` with the matching `on-*-container` for status variants.
- **Composition rules:** Numeric badges cap display at a defined max (e.g. "99+") rather than overflowing their container.
- **Prohibitions:** No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex.
