---
component: Contained list
version: 2.1.0
wave: 4
slots:
  - name: Leading
    required: false
    notes: An icon, tag or other short marker.
  - name: Title
    required: true
    notes: Typography, set in Body/3.
  - name: Description
    required: false
    notes: The code's own second line at Caption/1; the kit draws none. Extra large is the size laid out for it.
  - name: Cells
    required: false
    notes: The kit's Item 2 and Item 3, further text cells after the title, each inset 16.
  - name: Trailing
    required: false
    notes: Tag, Button, or a control, flush to the row's right edge. The kit draws a ghost icon Button at the row's height.
  - name: Header
    required: false
    notes: The kit's list title item, a separate export that sits directly above the rows. On page is a Title/5 heading on the page's background at the rows' height, with the rule under it; Disclosed is a 32px Caption/1 bar on elevation-01. It takes one action at its right edge, and the kit's Filterable search, an expandable Search sized to the bar (2.1.0, #267).
props:
  - name: size
    values: [sm, md, lg, xl]
    notes: The kit's row Size, 32, 40, 48 and 64 tall. Large by default, as the kit's list uses it. Extra large sets the content at the top.
  - name: interactive
    type: boolean
    default: "false"
    notes: Visual only. Adds the pointer cursor and the hover and active tone steps. The row takes no role, no tab stop and no click handler, so the caller supplies the interactive element; a link wrapped round the row draws the focus ring inside it.
  - name: disabled
    type: boolean
    notes: The kit's Disabled. Text and marker dim and the row stops responding; the caller disables its link or control too.
  - name: insetDivider
    type: boolean
    notes: The kit's divider Inset. The rule under the row stops 16 short of each end.
tokens:
  - name: on-surface
    usage: Title, and the On page header.
  - name: surface
    usage: Resting row background. The kit fills a raw white, un-migrated Carbon; surface reads the same in Light and works in Dark.
  - name: elevation
    usage: Hover (elevation-02) and active (elevation-03), the kit's layer-hover-01 and layer-active-01, one and two rungs up the ladder. The Disclosed header sits on elevation-01.
  - name: outline
    usage: The row divider and the header rule, through the subtle step (outline-subtle, the kit's border-subtle-00). It steps aside on hover, active and focus.
  - name: background
    usage: The On page header, the kit's Background/background.
  - name: primary
    usage: The focus ring inside the row, through the family's focus step; and disabled text, through its disabled-content step.
  - name: on-surface-variant
    usage: Description text, and the Disclosed header.
  - name: text
    usage: The title at Body/3, the description at Caption/1, the On page header at Title/5 SemiBold.
  - name: spacing
    usage: Row heights and padding, the 16 inset and the gaps between slots.
composition_rules:
  - This is the row primitive Data table and any future list views should compose from, not reimplement.
  - The kit's list Search mode is the governed Search, expandable, in the header (2.1.0, #267). Filtering the rows is the caller's: the header reports the query and filters nothing.
  - "`interactive` is a visual signal, not behavior. A row that responds to a click gets that from an element the caller supplies: wrap the row in a link when the whole row goes somewhere, or put the Button in the trailing slot when the row has one action. Setting `interactive` without one of those promises a click that nothing answers."
prohibitions:
  - No more than one trailing control cluster — if multiple actions are needed, use Menu (Wave 5) as the trailing slot instead of stacking buttons.
---

### Contained list
- **Slots:** Leading (optional — an icon, tag or other short marker), title (required, Typography), description (optional), cells (optional), trailing (optional — Tag, Button, or a control); and the list's header, a separate export above the rows.
- **Props:** size (sm, md, lg, xl); `interactive` (boolean, default false), which adds the hover and active tone steps and pointer and nothing else; disabled; insetDivider.
- **Tokens:** `on-surface` for title, `surface` at rest with `elevation-02` and `elevation-03` as the hover and active steps if the item is interactive, `outline-subtle` for the divider, `on-surface-variant` for the description; the spacing scale for heights, padding and slot gaps.
- **Kit parity** (#238, 2.0.0, a major: `density` gives way to the kit's four sizes, and the row draws its divider). Recorded rather than copied: the kit's rows and header action fill a raw white; Disabled keeps the icon at full strength while the text dims (dimmed together here, as Accordion does); the Extra large row is laid out for a second line it never draws, which is where the code's description fits.
- **Composition rules:** This is the row primitive Data table and any future list views should compose from, not reimplement. `interactive` is visual only: the row has no role, focus or click handler of its own, so the link or button that answers the click is the caller's.
- **Prohibitions:** No more than one trailing control cluster — if multiple actions are needed, use Menu (Wave 5) as the trailing slot instead of stacking buttons.
