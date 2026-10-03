---
component: Text area
version: 3.0.0
wave: 2
inherits: Text input
slots:
  - inherited_from: Text input
props:
  - name: label
    notes: Required, as on Text input.
  - name: state
    values: [default, focus, disabled, error, invalid, warning]
  - name: layout
    values: [fixed, fluid]
    notes: The kit's Text area - Default and Text area - Fluid. The kit draws no Inline Text area, so it has none.
  - name: helpText
    notes: Suppressed while errorText or warningText is present.
  - name: errorText
    notes: Resolves the error state, as on Text input.
  - name: warningText
    notes: Resolves the warning state, outranked by an error.
  - name: showCount
    notes: The kit's Show count, on by default in the kit, so on by default here; the count shows whenever maxLength is set.
  - name: resize
    values: [vertical, none]
    notes: Never horizontal, which breaks layout containers.
tokens:
  - inherited_from: Text input
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - inherited_from: Text input
prohibitions:
  - inherited_from: Text input
  - No auto-resize beyond a defined max-height without an explicit scroll affordance.
---

### Text area
- Text input's contract (shell, tokens, focus, error, warning, read-only), with these differences:
- **No `size`** (3.0.0, D5 on #219). The kit draws Text area at one height, 142 at least, with the value in Body/3, and no Size axis. Following it removes the prop: a breaking change. The kit draws no maximum; the code's is 320, set well clear of the minimum so the field can grow.
- **Status icon** 16 from the top and right, the text column making room for it.
- **Count on by default**, as the kit has it, whenever maxLength is set.
- **Fluid** is the kit's Text area - Fluid: the label row inside the box, and the message inside too, under a divider with the status icon at the end of its row.
- **Props:** resize (vertical, none) — never horizontal, which breaks layout containers. The grip is the browser's own; the kit's 8px diagonal can only be styled through a non-standard selector.
- **Prohibitions:** No auto-resize beyond a defined max-height without an explicit scroll affordance.
