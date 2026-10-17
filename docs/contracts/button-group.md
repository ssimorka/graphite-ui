---
component: Button Group
version: 2.0.0
wave: 0
slots:
  - name: Actions
    required: true
    notes: Two or more Buttons. A group of one is a Button, and needs no wrapper.
props:
  - name: className
    notes: Merged after the group class, so a caller can extend without forking.
tokens:
  - name: spacing
    usage: Gap between actions.
composition_rules:
  - "Enforces Button's pairing rules by refusing to render. It throws, naming the problem and pointing at this contract, when a group holds more than one filled button (primary, secondary or danger), when it mixes the violet family (primary, outlined, ghost) with the green one (secondary, secondary-outlined, secondary-ghost), or when its filled button is not last. A Button with no variant counts as secondary, its default, because it renders filled. Fragments are unwrapped before checking, so a footer passed as `<>...</>` is checked button by button. Any other wrapper element is read as itself and hides what is inside it, so Buttons go in as direct children or inside fragments. The rules are checked, not documented and hoped for."
  - Modal wraps its footer in this rather than trusting each caller, so the rule holds wherever a footer is used instead of only where someone remembers it.
  - Horizontal by definition. A vertical stack of actions is a layout decision belonging to whatever contains the group.
prohibitions:
  - No second filled button, no mixed families, and no filled button anywhere but last. The check is a throw rather than a warning, because a silently-wrong emphasis hierarchy is the failure this component exists to prevent.
  - No orientation prop. See the note below — a vertical variant would make "which action is primary" a question of reading order rather than of emphasis.
  - No spacing override per instance. The gap is the scale's, so two footers in one product cannot disagree about how far apart their actions sit.
---

### Button Group

The component three other contracts already named as their enforcement
mechanism, and which had no contract of its own until #93. `button.md`,
`card.md` and `dialog.md` all say ButtonGroup enforces the one-primary rule;
governance rule 1 says every component has one contract file; this is that
file.

- **Slots:** Actions (required) — two or more Buttons. One button needs no
  wrapper.
- **Props:** `className`, merged after the group class. Everything else spreads
  to the underlying `div`.
- **Tokens:** the spacing scale for the gap between actions. It introduces no
  color of its own: a group is an arrangement, and the buttons inside it carry
  every visual decision.
- **Composition rules:** A second filled button, a mixed family or a filled
  button that is not last throws (2.0.0, 2026-10-17: it used to check
  primaries only, so primary beside a filled secondary passed). A Button with
  no variant counts as the filled secondary it renders. Fragments are unwrapped
  before the check (Modal's callers pass their footer
  as one); any other wrapper element hides its contents from the check, so
  Buttons go in directly. Modal wraps its footer in this, so the rule holds wherever a
  footer is used. Horizontal by definition.
- **Prohibitions:** No second filled button, no mixed families, filled last. No
  orientation prop. No per-instance
  spacing override.

### Two notes on what this deliberately does not have

**No orientation prop**, though the F1 issue proposed one. The implementation
never had one, and adding it to the contract first would have meant inventing
API to match a plan rather than describing the component. It is also the right
answer on its own terms: in a horizontal group, emphasis says which action is
primary, and in a vertical one, position starts saying it too. A vertical
arrangement of actions is a layout the container owns, not a variant here.

**The check throws rather than warns.** A warning would let a build ship two
primary buttons, which is exactly the outcome the rule exists to prevent, and
the second primary is not a style bug — the contract's own words are that it
"is not an emphasis choice, it is a missing decision about what the group is
for." A decision that has not been made should not render.
