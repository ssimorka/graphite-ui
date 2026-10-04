---
component: NumberInput
version: 1.0.0
wave: 2
slots:
  - name: Field
    required: true
    notes: The governed Text input as a native number field, its browser spinner hidden. Every size, layout (fixed, inline, fluid), label, supporting text and state is Text input's.
  - name: Stepper
    required: true
    notes: The kit's two action items at the end of the field, decrement then increment. Each is a ghost icon-only Button, square at the field's height (32, 40 or 48; 40 in Fluid), with the kit's 16px minus-small and plus-small, after a 1 × 20 outline divider. They are named "Decrement" and "Increment" and disable at the bounds. In Error and Warning the status glyph comes before them.
props:
  - name: value / onChange
    notes: Controlled. A number, or null when the field is empty. What is typed stays as typed until it is a number; checking it against the range is the caller's.
  - name: min / max / step
    notes: Passed to the native field, so the arrow keys step and clamp as the stepper does. step is 1 by default.
  - name: Text input's other props
    notes: size, layout, label, helpText, errorText, warningText, disabled, readOnly and the rest. readOnly and disabled both disable the stepper.
tokens:
  - name: outline
    usage: The dividers before each stepper button (the kit's Medium binds outline).
  - name: spacing
    usage: The stepper running to the field's right edge, past the shell's 16 inset.
composition_rules:
  - The field is the governed Text input and the stepper the governed Button. Number input arranges them; it restyles neither. The stepper's glyph colour is the ghost Button's primary (Icon/icon-interactive).
  - Text input keeps type="number" for a bare numeric field. Use Number input when the value moves in steps.
  - The stepper never takes the value past min or max.
prohibitions:
  - No number input without a label.
  - No stepper button that steps past a bound. It disables there instead.
---

### NumberInput
- **Slots:** Field (required), stepper (required).
- **Props:** value / onChange, min / max / step; Text input's size, layout, label, supporting text, disabled and readOnly.
- **Tokens:** `outline` dividers; the field's and Button's own.
- **Composition rules:** Text input and two ghost Buttons; Text input keeps a bare number field; the stepper clamps.
- **Prohibitions:** No unlabelled input; no stepping past a bound.
- **Kit parity** (#285, 1.0.0): both public sets, Number input - Default (`19893:290998`) and - Fluid (`19893:291117`), with the private base and action item sets, on every axis but Skeleton, which has no counterpart by rule. Recorded rather than copied: the Large action item's divider binds Border/border-subtle-01, which resolves to no variable in the kit, where Medium's binds outline; the code uses outline at every size. The AI slug and Revert action items belong to the permanently ungoverned AI sets and are not built. The Fluid label's tooltip trigger is not drawn, as Text input's Fluid does not take one. The kit has no Hover on the Default set; hover is the shell's and the Buttons' own.
