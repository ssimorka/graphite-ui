---
component: Date picker
version: 1.0.0
wave: 2
slots:
  - name: Field
    required: true
    notes: The governed Text input, typed as mm/dd/yyyy (the kit's placeholder). One for Simple and Single, two for a Range (start and end, each labelled). Fixed or Fluid.
  - name: Calendar trigger
    required: false
    notes: The kit's 16px fi-rs-calendar at the end of the field, a button that opens the calendar. Single and Range only; Error and Warning swap it for the status glyph, as the kit draws them.
  - name: Calendar
    required: false
    notes: The kit's private _Date picker calendar, under the field. 288 wide on elevation-01 with the overlay shadow, padded 4 4 8 4. A 40 header (previous, month and year, next), the weekday row, and six rows of 40 × 40 days.
  - name: Supporting text
    required: false
    notes: Help, error or warning text; under a Range's two fields together.
props:
  - name: mode
    values: [simple, single, range]
    notes: The kit's Simple date, Single calendar and Range calendar sets. Single by default.
  - name: layout
    values: [fixed, fluid]
    notes: The kit's Default and Fluid sets. A Fluid range joins its two boxes with a 1px outline-strong rule.
  - name: size
    values: [sm, md, lg]
    notes: Fixed only, the Text input heights 32, 40 and 48. Large by default, as the kit's sets are.
  - name: value / onChange
    notes: Controlled. A date or null; for a range, a start and end pair. Typing commits on Enter or on leaving the field; a half-typed date stays as typed for the caller to flag.
  - name: label / endLabel
    notes: The label is required; endLabel names a range's end field ("End date" by default).
  - name: minDate / maxDate
    notes: Days outside are disabled in the calendar.
  - name: helpText / errorText / warningText
    notes: Through the shared field-message rule.
  - name: disabled
    values: boolean
  - name: readOnly
    values: boolean
    notes: The field's Read-only shell; the calendar glyph stays as a mark and does not open.
tokens:
  - name: elevation
    usage: The calendar panel, elevation-01 (Layer/layer-01); header and day hover and the year box while edited, elevation-02 (Layer/layer-hover-01).
  - name: shadow
    usage: The calendar's overlay shadow (Shadows/Menu).
  - name: on-surface
    usage: The calendar glyph, the month, year, weekdays and days (Icon/icon-primary, Text/text-primary).
  - name: on-surface-variant
    usage: Days of the months either side (Text/text-secondary).
  - name: primary
    usage: The selected day's fill (Button/button-primary), today's number and dot (Miscellaneous/interactive), the focus ring through primary-focus, and disabled days through primary-disabled-content.
  - name: on-primary
    usage: The selected day's number (Text/text-on-color).
  - name: primary-container
    usage: Days inside a range (Miscellaneous/highlight).
  - name: outline
    usage: A Fluid range's dividing rule, through the strong step (Border/border-strong-01).
  - name: danger
    usage: A range's error text.
  - name: text
    usage: Body/3 for days and weekdays, Title/5 for the month, year and today, Caption/1 for supporting text.
  - name: spacing
    usage: The panel's padding and gaps.
composition_rules:
  - The fields are the governed Text input; Date picker does not restyle them.
  - The calendar is a dialog holding an ARIA grid. Arrow keys move by day and week, Home and End to the week's ends, Page Up and Page Down by month (with Shift, by year), Enter or Space picks, Escape closes and returns focus to the trigger.
  - A range picks its start then its end; picking an end before the start swaps them.
prohibitions:
  - No date picker without a label.
  - No range built from two single pickers. A range shares one calendar and one value.
---

### Date picker
- **Slots:** Field (required), calendar trigger, calendar, supporting text.
- **Props:** mode (simple, single, range), layout (fixed, fluid), size (sm, md, lg), value / onChange, label / endLabel, minDate / maxDate, helpText / errorText / warningText, disabled, readOnly.
- **Tokens:** `elevation-01` panel with the overlay `shadow`; `elevation-02` hover; `primary` selected day and today; `primary-container` range; `on-surface` and `on-surface-variant` days.
- **Composition rules:** Text input for the fields; an ARIA grid in a dialog; a range picks start then end.
- **Prohibitions:** No unlabelled picker; no range from two singles.
- **Kit parity** (#271, 1.0.0): the six Date picker sets, Simple date, Single calendar and Range calendar in Default (`17544:266985`, `17544:267504`, `17544:268170`) and Fluid (`17544:267399`, `17544:267989`, `17544:268235`), with the private calendar, day item, month pagination and month year sets, on every axis but Skeleton, which has no counterpart by rule. The Time picker sets on the same page are a separate contract. Recorded rather than copied: Single calendar's placeholder binds text-helper at rest and text-placeholder in Error and Warning, where Simple date binds text-placeholder throughout; the code uses the field shell's one placeholder colour. The Fluid sets carry a tooltip trigger beside the label, which Text input's Fluid does not take; the label stands alone. Hover draws nothing on the field in any set, so the code draws nothing either.
