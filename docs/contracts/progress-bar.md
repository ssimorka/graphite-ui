---
component: Progress bar
version: 2.0.0
wave: 1
slots:
  - name: Label
    required: true
    notes: The task, painted above the track (beside it inline) and the bar's accessible name. hideLabel keeps the name and drops it from view.
  - name: Helper text
    required: false
    notes: Under the track, replaced by the success or error message once the task finishes. Not drawn inline.
props:
  - name: value
    values: 0–100
  - name: variant
    values: [determinate, indeterminate]
  - name: size
    values: [sm, lg]
    notes: The kit's Size, a 4px track (Small) or 8px (Big).
  - name: alignment
    values: [default, inline, indent]
    notes: The kit's Alignment. Default puts the label above and the helper below, 8 from the track; Inline puts the label beside a track that fills the rest, with no helper; Indent sets the label in Input Label type and indents label and helper 16.
  - name: status
    values: [active, success, error]
    notes: The kit's State. A finished task fills the track in success or danger, with the kit's status icon at the end of the label row and its message in place of the helper.
  - name: hideLabel
    values: boolean
  - name: helperText
  - name: successText
  - name: errorText
tokens:
  - name: outline
    usage: The track, through its subtle step (outline-subtle, the kit's border-subtle-00). It reads faintly against the page by design; the label and value carry the meaning.
  - name: primary
    usage: The fill while active.
  - name: success
    usage: The fill and the status icon once the task succeeds.
  - name: danger
    usage: The fill, the status icon and the message once the task fails.
  - name: on-surface
    usage: The label.
  - name: on-surface-variant
    usage: The helper and success messages.
  - name: text
    usage: The label at Body/3 (Input Label when indented), messages at 12/16.
  - name: spacing
    usage: Track height, the 8 between label, track and message, and the 16 indent and inline gap.
  - name: motion
    usage: Indeterminate sweep duration and easing, defined once and shared with Spinner.
  - name: radius
    usage: Track and indicator corner.
composition_rules:
  - Indeterminate variant uses a defined animation timing, not an arbitrary one — this should be specified once and reused by Spinner later (Tier 2) so the two don't drift into different motion languages.
prohibitions:
  - No fill color other than `primary` while the task runs. `success` and `danger` fill it only once the task has finished, as the kit draws Success and Error.
  - No text inside the track itself. The label and messages are the component's own, set around the track, never on it.
---

### Progress bar
- **Slots:** Label (required, painted above the track), helper text (optional).
- **Props:** value (0–100), variant (determinate, indeterminate), size (sm, lg), alignment (default, inline, indent), status (active, success, error), hideLabel, helperText, successText, errorText.
- **Tokens:** `outline-subtle` for the track, `primary` for the fill while active and `success` or `danger` once finished; the spacing scale for track height and the motion tokens for the indeterminate sweep.
- **Kit parity** (#235, 2.0.0, a major: the bar paints its own label and helper as the kit does, which retires the old "pair with Typography externally" remedy, and finished states may fill in `success` or `danger`). The indeterminate sweep is the kit's: a quarter of the track at a constant speed, so the shared easing token is now linear. The kit mixes a Carbon status icon set with Flaticon glyphs and Caption/1 with Helper Text for one 12/16 message; the code uses the kit's status icons for both outcomes and one message style.
- **Composition rules:** Indeterminate variant uses a defined animation timing, not an arbitrary one — this should be specified once and reused by Spinner later (Tier 2) so the two don't drift into different motion languages.
- **Prohibitions:** No fill color other than `primary` while the task runs. No text inside the track itself.
