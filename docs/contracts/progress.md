---
component: Progress
version: 1.1.0
wave: 1
slots: []
props:
  - name: value
    values: 0–100
  - name: variant
    values: [determinate, indeterminate]
tokens:
  - name: outline
    usage: Track.
  - name: primary
    usage: Fill.
  - name: spacing
    usage: Track height.
  - name: motion
    usage: Indeterminate sweep duration and easing, defined once and shared with Spinner.
composition_rules:
  - Indeterminate variant uses a defined animation timing, not an arbitrary one — this should be specified once and reused by Spinner later (Tier 2) so the two don't drift into different motion languages.
prohibitions:
  - No fill color other than `primary`.
  - No text label baked into the bar itself — pair with Typography externally if a percentage needs to show.
---

### Progress
- **Slots:** None (value-driven, no children).
- **Props:** value (0–100), variant (determinate, indeterminate).
- **Tokens:** `outline` for track, `primary` for fill; the spacing scale for track height and the motion tokens for the indeterminate sweep.
- **Composition rules:** Indeterminate variant uses a defined animation timing, not an arbitrary one — this should be specified once and reused by Spinner later (Tier 2) so the two don't drift into different motion languages.
- **Prohibitions:** No fill color other than `primary`. No text label baked into the bar itself — pair with Typography externally if a percentage needs to show.
