---
component: Button
version: 1.0.0
wave: 0
slots:
  - name: Label
    required: true
    notes: Text. An icon-only button still carries an accessible name.
  - name: Leading icon
    required: false
  - name: Trailing icon
    required: false
props:
  - name: variant
    values: [primary, secondary, ghost, danger]
  - name: size
    values: [sm, md, lg]
  - name: disabled
    values: boolean
  - name: type
    values: [button, submit, reset]
tokens:
  - name: primary
    usage: Fill on the primary variant, and the border on secondary.
  - name: on-primary
    usage: Label on the primary variant.
  - name: on-surface
    usage: Label on the secondary and ghost variants.
  - name: surface-variant
    usage: Hover and pressed background on secondary and ghost.
  - name: danger
    usage: Fill on the destructive variant.
  - name: on-danger
    usage: Label on the destructive variant.
  - name: spacing
    usage: Padding, gap to icons, and the minimum touch target.
composition_rules:
  - "One primary action per group. A group of buttons — a Card footer, a Dialog footer, a toolbar — may contain at most one `primary`. Everything else is secondary, ghost, or danger."
  - Hover and pressed are tone-step moves on the same ramp as the resting fill, never a different color. This is the logic Input's focus border, Switch's on state, and Dropdown Menu's item hover all refer back to.
  - Never smaller than the defined minimum touch target, whatever the size prop. Checkbox refers back to this.
prohibitions:
  - No two primary buttons in one group. The second one is not an emphasis choice, it is a missing decision about which action the group is for.
  - No destructive action on the primary variant. Destructive work takes `danger`, so that "the emphasised action" and "the dangerous action" never look like the same thing.
  - No button whose accessible name comes only from an icon.
---

### Button

The dependency that predates the waves. The source document describes Button as
already done and sitting underneath Wave 4 and Wave 5, but no contract for it
existed and no implementation shipped, while six other contracts referred to its
behavior as settled precedent. This contract writes down what those references
already assume.

- **Slots:** Label (required), leading icon (optional), trailing icon (optional).
- **Props:** variant (primary, secondary, ghost, danger), size (sm, md, lg),
  disabled, type.
- **Tokens:** `primary` with `on-primary` for the primary variant, `primary` as
  the border on secondary, `on-surface` for secondary and ghost labels,
  `surface-variant` for their hover and pressed states, `danger` with
  `on-danger` for the destructive variant; the spacing scale for padding, icon
  gaps and the minimum touch target.
- **Composition rules:** One primary action per group — a Card footer, a Dialog
  footer or a toolbar may hold at most one. Hover and pressed are tone-step
  moves on the resting fill's own ramp, never a new color; this is the logic
  Input's focus border, Switch's on state and Dropdown Menu's item hover all
  refer back to. The minimum touch target holds at every size, which is the rule
  Checkbox cites.
- **Prohibitions:** No two primary buttons in one group — the second is not an
  emphasis choice, it is a missing decision about what the group is for. No
  destructive action on the primary variant, so that "the emphasised action" and
  "the dangerous action" never look alike. No button whose accessible name comes
  only from an icon.
