---
component: Button
version: 2.1.0
wave: 0
slots:
  - name: Children
    required: true
    notes: The label, and any icons, as children. Icons are children rather than named slots, so a caller composes them instead of choosing from a fixed pair.
props:
  - name: variant
    values: [primary, secondary, ghost, danger]
    notes: Defaults to secondary. A primary default would make breaking the one-primary rule the path of least resistance.
  - name: size
    values: [sm, md, lg, icon]
  - name: asChild
    values: boolean
    notes: Render the button's props onto its single child instead of emitting a button element.
  - name: className
    notes: Merged after the variant recipe, so a caller can extend without forking.
  - name: type
    values: [button, submit, reset]
    notes: Defaults to button, and only when this component owns the element.
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
  - name: motion
    usage: Transition duration and easing, shared with the pages so a button moves the way its surroundings do.
  - name: radius
    usage: Corner.
composition_rules:
  - "One primary action per group. A group of buttons — a Card footer, a Dialog footer, a toolbar — may contain at most one `primary`. Everything else is secondary, ghost, or danger. ButtonGroup enforces this, and Card and Dialog wrap their footers in it."
  - Hover and pressed are tone-step moves on the same ramp as the resting fill, never a different color. This is the logic Input's focus border, Switch's on state, and Dropdown Menu's item hover all refer back to.
  - Never smaller than the defined minimum touch target, whatever the size prop. Checkbox refers back to this.
  - Variants are declared once as a recipe and exported, so a sibling component can render something button-shaped without restating the rules or forking the styles.
prohibitions:
  - No two primary buttons in one group. The second one is not an emphasis choice, it is a missing decision about which action the group is for.
  - No destructive action on the primary variant. Destructive work takes `danger`, so that "the emphasised action" and "the dangerous action" never look like the same thing.
  - No button whose accessible name comes only from an icon. The `icon` size changes the shape, never the naming requirement.
---

### Button

The dependency that predates the waves, and the reference implementation for
the component API conventions in `README.md`.

- **Slots:** Children (required) — the label, plus any icons, composed by the
  caller rather than chosen from a fixed leading/trailing pair.
- **Props:** variant (primary, secondary, ghost, danger — defaults to
  secondary), size (sm, md, lg, icon), asChild, className, type.
- **Tokens:** `primary` with `on-primary` for the primary variant, `primary` as
  the border on secondary, `on-surface` for secondary and ghost labels,
  `surface-variant` for their hover and pressed states, `danger` with
  `on-danger` for the destructive variant; the spacing scale for padding, icon
  gaps and the minimum touch target; the motion tokens for transitions, so a
  button moves on the same curve as the page around it.
- **Composition rules:** One primary action per group — a Card footer, a Dialog
  footer or a toolbar may hold at most one, and ButtonGroup enforces it. Hover
  and pressed are tone-step moves on the resting fill's own ramp, never a new
  color; this is the logic Input's focus border, Switch's on state and Dropdown
  Menu's item hover all refer back to. The minimum touch target holds at every
  size, which is the rule Checkbox cites. The variant recipe is exported, so a
  sibling can render something button-shaped without restating the rules.
- **Prohibitions:** No two primary buttons in one group — the second is not an
  emphasis choice, it is a missing decision about what the group is for. No
  destructive action on the primary variant, so that "the emphasised action"
  and "the dangerous action" never look alike. No button whose accessible name
  comes only from an icon; the `icon` size changes the shape, not the naming
  requirement.
