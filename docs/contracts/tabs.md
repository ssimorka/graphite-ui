---
component: Tabs
version: 2.0.0
wave: 4
slots:
  - name: Tab list
    required: true
    notes: Minimum 2 tabs.
  - name: Panel content per tab
    required: true
  - name: Previous and Next
    required: false
    notes: The kit's overflow buttons. Shown only while the list overflows, each disabled at its end; the list scrolls under them rather than wrapping.
props:
  - name: orientation
    values: [horizontal, vertical]
  - name: variant
    values: [line, contained]
    notes: The kit's Style. Horizontal only; vertical tabs are their own set in the kit and their own look in the code.
  - name: size
    values: [md, lg]
    notes: The kit's item Size, 40 and 48. Contained is always 48.
  - name: iconOnly
    values: boolean
    notes: The kit's Type=Icon only. Every tab needs an icon, and its label becomes the tab's aria-label, so a tab is never unnamed.
  - name: fullWidth
    values: boolean
    notes: The kit's Alignment=Grid aware. The tabs share the width equally.
  - name: onDismiss
    notes: The kit's Dismissible. Each tab carries the close glyph, and Delete on a focused tab dismisses it; the caller removes the tab from the list. dismissOnHover is the kit's Hover Dismissible.
  - name: tabs
    notes: Each tab takes id, label and panel, and the kit's item options, icon (trailing, or the whole of an icon-only tab), disabled, secondaryLabel (the kit's 2nd label, Contained) and badge (the kit's Badge indicator, icon only).
tokens:
  - name: primary
    usage: The selected tab's indicator (the bottom rule on Line, the top rule on Contained, the left bar on vertical); the focus ring, through the family's focus step; and disabled tabs, through its disabled and disabled-content steps.
  - name: on-surface
    usage: The selected and hovered label, and the overflow buttons' chevrons.
  - name: on-surface-variant
    usage: Labels at rest and the 2nd label, the lower tone-step of on-surface.
  - name: outline
    usage: Each Line tab's own 2px rule at rest, Contained's dividers, and the vertical items' rules and resting indicator.
  - name: surface
    usage: The selected Contained tab, and vertical items at rest.
  - name: surface-variant
    usage: Contained tabs at rest, Contained's overflow buttons, vertical hover, and the close glyph's hover square.
  - name: background
    usage: Line's overflow buttons and the 16px fade they draw over the list.
  - name: danger
    usage: The badge dot.
  - name: text
    usage: Labels at Body/3, SemiBold when selected; the 2nd label at 12/16.
  - name: spacing
    usage: Tab heights and padding, list gaps, and the badge inset.
composition_rules:
  - The kit's Tabs set carries no orientation axis — its axes are Style (Contained, Line), Type and Alignment, and vertical tabs live in a separate internal `_Vertical tabs items` component. The `orientation` prop is kept anyway: the capability exists in the kit, only structured differently, and removing a prop is breaking. Worth revisiting if that set is ever rebuilt.
  - Active indicator position is always a tone-step-driven color change plus position, never color alone — same principle as the video's point about visuals over text, applied to state, not onboarding. The selected label also takes SemiBold, as the kit draws it.
  - Disabled tabs are stepped over by the arrow keys and can never be the selected tab; a dismissed or disabled selection falls back to the first tab that can hold it.
prohibitions:
  - No tab content lazy-unmounts in a way that loses form state — if a form field lives inside a tab panel, switching tabs cannot silently clear it.
---

### Tabs
- **Slots:** Tab list (required, minimum 2 tabs), panel content per tab (required).
- **Props:** orientation (horizontal, vertical), variant (line, contained), size (md, lg), iconOnly, fullWidth, onDismiss, dismissOnHover; per tab icon, disabled, secondaryLabel, badge.
- **Tokens:** `primary` indicator on the selected tab, `on-surface` for selected and hovered labels and `on-surface-variant` — its lower tone-step — for the rest; `outline` for each tab's own rule; `surface` and `surface-variant` for Contained and vertical fills; the spacing scale for padding and gaps.
- **Kit parity** (#234, 2.0.0, a major: the list no longer draws one rule under itself, each tab draws its own, and the vertical indicator moved to the left). Three kit slips are recorded rather than copied: the overflow buttons' glyph is a plus placeholder (built as a chevron), Line's overflow fade is a raw white (built from `background`), and Contained Auto-width items are 50 tall where Grid aware are 48 (built at 48, Carbon's).
- **Composition rules:** Active indicator position is always a tone-step-driven color change plus position, never color alone — same principle as the video's point about visuals over text, applied to state, not onboarding.
- **Prohibitions:** No tab content lazy-unmounts in a way that loses form state — if a form field lives inside a tab panel, switching tabs cannot silently clear it.
