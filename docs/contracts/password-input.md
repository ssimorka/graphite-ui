---
component: Password input
version: 1.0.0
wave: 2
slots:
  - name: Field
    required: true
    notes: The governed Text input, masked, with all of its sizes, layouts (fixed, inline, fluid), label, supporting text and states.
  - name: Show toggle
    required: true
    notes: The kit's 16px fi-rs-eye at the end of the value row, 16 after the value; fi-rs-eye-crossed while the text shows. A button named "Show password" with aria-pressed. In Error and Warning the status glyph comes before it, as the kit draws them.
props:
  - name: Text input's props
    notes: Everything Text input takes except type and trailing, which Password input owns.
  - name: Show text
    notes: The kit's Show text axis is the reader's toggle, not a prop; the field starts masked.
tokens:
  - name: on-surface
    usage: The eye (Icon/icon-primary).
  - name: primary
    usage: The eye's focus ring, through primary-focus, and its disabled tone, through primary-disabled-content (Icon/icon-disabled).
composition_rules:
  - The field is the governed Text input. Password input adds the toggle and nothing else.
  - Text input keeps type="password" for a plain masked field. Use Password input when the reader may need to check what they typed.
  - The toggle works on a read-only field, since showing is reading; it is disabled with a disabled field.
prohibitions:
  - No password field without a label.
  - No toggle that changes its accessible name with its state. The name stays "Show password"; aria-pressed carries the state.
---

### Password input
- **Slots:** Field (required), show toggle (required).
- **Props:** Text input's, less type and trailing; Show text is the reader's.
- **Tokens:** `on-surface` eye; `primary-focus` ring; `primary-disabled-content` when disabled.
- **Composition rules:** Text input plus the toggle; Text input keeps a plain masked field.
- **Prohibitions:** No unlabelled field; no renaming toggle.
- **Kit parity** (#284, 1.0.0): both public sets, Password input - Default (`5621:280380`) and - Fluid (`68771:7312`), on every axis but Skeleton, which has no counterpart by rule. Recorded rather than copied: the Default set's label binds Caption/1 where every other field's binds Input Label (the same 12/16); the code uses Text input's label. The Fluid label's tooltip trigger is not drawn, as Text input's Fluid does not take one.
