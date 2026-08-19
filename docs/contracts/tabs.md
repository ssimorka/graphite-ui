---
component: Tabs
version: 1.0.0
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
    usage: At a lower tone-step for inactive labels.
composition_rules:
  - Active indicator position is always a tone-step-driven color change plus position, never color alone — same principle as the video's point about visuals over text, applied to state, not onboarding.
prohibitions:
  - No tab content lazy-unmounts in a way that loses form state — if a Field lives inside a tab panel, switching tabs cannot silently clear it.
---

### Tabs
- **Slots:** Tab list (required, minimum 2 tabs), panel content per tab (required).
- **Props:** orientation (horizontal, vertical).
- **Tokens:** `primary` underline/indicator on active tab, `on-surface` at a lower tone-step for inactive labels.
- **Composition rules:** Active indicator position is always a tone-step-driven color change plus position, never color alone — same principle as the video's point about visuals over text, applied to state, not onboarding.
- **Prohibitions:** No tab content lazy-unmounts in a way that loses form state — if a Field lives inside a tab panel, switching tabs cannot silently clear it.
