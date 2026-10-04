---
component: Time picker
version: 1.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Default draws it over the row in Caption/1, on-surface-variant, 8 above. Fluid names the group with it and labels each box instead.
  - name: Time
    required: true
    notes: The kit's Time picker items - Fixed. The governed Text input, typed as hh:mm (the kit's placeholder), 76 wide in Default and 100 in Fluid; it takes the error ring and the status glyph and grows to 101 to hold it.
  - name: Clock
    required: true
    notes: The kit's Time picker items - Clock. The governed Select with AM and PM, 85 wide in Default and 100 in Fluid.
  - name: Timezone
    required: false
    notes: The kit's Time picker items - Timezone. The governed Select, 127 wide in Default and 200 in Fluid. Leaving it out is the kit's two-input Fluid form.
  - name: Supporting text
    required: false
    notes: Help, error or warning text, 8 under the row.
props:
  - name: value / onChange
    notes: Controlled. The time as typed, the period (AM or PM) and the timezone. Checking the time is the caller's, reported through errorText.
  - name: timezones
    notes: The Timezone options; without them there is no Timezone item.
  - name: layout
    values: [fixed, fluid]
    notes: The kit's Default and Fluid sets.
  - name: size
    values: [sm, md, lg]
    notes: Fixed only, 32, 40 or 48. Large by default.
  - name: label / timeLabel / clockLabel / timezoneLabel
    notes: The label is required. The items' labels default to Time, Clock and Timezone; Fluid shows them, Default keeps them as each field's accessible name.
  - name: helpText / errorText / warningText
    notes: Through the shared field-message rule. Error and warning flag the time alone, as the kit draws them; the Selects keep their rest state.
  - name: disabled
    values: boolean
  - name: readOnly
    values: boolean
tokens:
  - name: on-surface-variant
    usage: The label (Text/text-secondary).
  - name: on-surface
    usage: Warning text (Text/text-primary); the warning colour is carried by the time's status glyph.
  - name: outline
    usage: The rule between Fluid boxes, through the strong step (Border/border-strong-01).
  - name: danger
    usage: Error text.
  - name: primary
    usage: The disabled label, through primary-disabled-content.
  - name: text
    usage: Caption/1 for the label and supporting text.
  - name: spacing
    usage: The 8 gap.
composition_rules:
  - The time is the governed Text input and Clock and Timezone the governed Select. Time picker sizes and joins them; it does not restyle them.
  - The three are one group, named by the label.
prohibitions:
  - No time picker without a label.
  - No time picker that turns a typed time into another value silently. The caller checks it and says so.
---

### Time picker
- **Slots:** Label (required), time (required), clock (required), timezone, supporting text.
- **Props:** value / onChange, timezones, layout (fixed, fluid), size (sm, md, lg), label / timeLabel / clockLabel / timezoneLabel, helpText / errorText / warningText, disabled, readOnly.
- **Tokens:** `on-surface-variant` label; `outline-strong` Fluid rules; the fields' own.
- **Composition rules:** Text input and Select, sized and joined; one labelled group.
- **Prohibitions:** No unlabelled picker; no silent correction.
- **Kit parity** (#271, 1.0.0): both public sets, Time picker - Default (`17544:268301`) and - Fluid (`17544:268399`), with the three Time picker items sets, Fixed (`17544:266768`), Clock (`17544:266804`) and Timezone (`17544:266925`), on every axis but Skeleton, which has no counterpart by rule. Recorded rather than copied: the Fixed item's placeholder binds text-helper in Default and text-placeholder in Fluid; the code uses the field shell's one. The Fluid items carry a tooltip trigger beside their labels, which Text input's and Select's Fluid do not take.
