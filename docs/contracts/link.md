---
component: Link
version: 1.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Says where the link goes. Never "click here".
  - name: Trailing icon
    required: false
    notes: The kit's Icon and Swap icon, a 20px glyph at Large and 16px at Medium and Small, 8 after the label (the kit draws fi-rs-arrow-right). Standalone only. Decorative.
props:
  - name: size
    values: [sm, md, lg]
    notes: The kit's Size, Caption/1, Body/3 or Body/2. Large by default, as the kit's set is.
  - name: inline
    values: boolean
    notes: The kit's Inline. Underlined and flowing as text, taking the surrounding type; it takes no icon.
  - name: inverse
    values: boolean
    notes: The kit's Inverse, for a link on the inverse fill.
  - name: icon
    notes: A kit icon name for the trailing glyph.
  - name: disabled
    values: boolean
    notes: Renders without an href and with aria-disabled, so it is announced but not followed.
  - name: href and the native anchor props
    notes: Passed through. Link is a native anchor.
tokens:
  - name: primary
    usage: The label and glyph at rest and visited, primary-hover on hover, primary-focus for the 1px focus and active ring, and primary-disabled-content when disabled (Link/link-primary and state/* in the kit).
  - name: on-surface
    usage: The label while pressed (Text/text-primary in the kit).
  - name: primary-container
    usage: The inverse label at rest. The kit's inverse/link stops sit on the accent ramp at tones the engine does not stamp; this is the stand-in Notification's inverse action already uses.
  - name: background
    usage: The inverse label on hover and while pressed, and the inverse focus ring, the inverse fill's own text.
  - name: text
    usage: Body/2, Body/3 and Caption/1.
  - name: spacing
    usage: The 8px gap before the glyph.
composition_rules:
  - Hover, Focus and Active are pseudo-classes, Visited is :visited; none is a prop (governance rule 7). The kit draws Visited the same as Enabled.
  - Inline links take the size of the text they sit in and are always underlined, so they are told apart from the copy by more than colour.
  - Breadcrumb does not compose Link. Its crumbs are the kit's own _Breadcrumb item set, the more specific artefact, and keep their own rules.
prohibitions:
  - No Link for an action that does not navigate. That is a Button.
  - No icon on an inline link.
---

### Link
- **Slots:** Label (required), trailing icon.
- **Props:** size (sm, md, lg), inline, inverse, icon, disabled; href and the native anchor props.
- **Tokens:** `primary` label with `primary-hover`, `primary-focus` ring and `primary-disabled-content`; `on-surface` while pressed; `primary-container` and `background` on the inverse fill.
- **Composition rules:** States are pseudo-classes; inline links are underlined; Breadcrumb keeps its own crumbs.
- **Prohibitions:** No Link for an action; no icon on an inline link.
- **Kit parity** (#266, 1.0.0): the one public set, Link (`50111:991`), on every axis. Recorded rather than copied: the Inline property shows a second, identical label with no underline, where the set's description says an inline link is underlined, so the code underlines it. The glyph is bound to icon-interactive in every state, so it stays primary while the label turns on-surface or disabled beside it; the code has it follow the label.
