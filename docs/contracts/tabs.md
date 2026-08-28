---
component: Tabs
version: 1.1.0
wave: 4
slots:
  - name: Tab list
    required: true
    notes: Minimum 2 tabs.
  - name: Panel content per tab
    required: true
props:
  - name: orientation
    values: [horizontal, vertical]
tokens:
  - name: primary
    usage: Underline/indicator on active tab.
  - name: on-surface
    usage: Active tab label.
  - name: on-surface-variant
    usage: Inactive labels — the lower tone-step of on-surface.
  - name: outline
    usage: The rule the tab list sits on, which the active indicator overlaps.
  - name: spacing
    usage: Tab padding and list gaps.
composition_rules:
  - Active indicator position is always a tone-step-driven color change plus position, never color alone — same principle as the video's point about visuals over text, applied to state, not onboarding.
prohibitions:
  - No tab content lazy-unmounts in a way that loses form state — if a form field lives inside a tab panel, switching tabs cannot silently clear it.
---

### Tabs
- **Slots:** Tab list (required, minimum 2 tabs), panel content per tab (required).
- **Props:** orientation (horizontal, vertical).
- **Tokens:** `primary` underline/indicator on active tab, `on-surface` for the active label and `on-surface-variant` — its lower tone-step — for inactive ones; `outline` for the rule the list sits on; the spacing scale for padding and gaps.
- **Composition rules:** Active indicator position is always a tone-step-driven color change plus position, never color alone — same principle as the video's point about visuals over text, applied to state, not onboarding.
- **Prohibitions:** No tab content lazy-unmounts in a way that loses form state — if a form field lives inside a tab panel, switching tabs cannot silently clear it.
