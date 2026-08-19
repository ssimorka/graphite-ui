---
component: Card
version: 1.0.0
wave: 4
slots:
  - name: Header
    required: false
  - name: Body
    required: true
  - name: Footer
    required: false
    notes: Typically holds Button.
props:
  - name: padding density
    values: [compact, default, spacious]
    blocked_on: Wave 0
    interim: Ship default only until spacing tokens exist.
tokens:
  - name: surface
    usage: Background.
  - name: outline
    usage: Border or shadow-equivalent edge.
composition_rules:
  - Footer actions follow the Button contract's "one primary action per group" rule — a Card footer can't have two primary buttons.
prohibitions:
  - No nested Cards. If content needs visual grouping inside a Card, use Separator, not a second Card.
---

### Card
- **Slots:** Header (optional), body (required), footer (optional, typically holds Button).
- **Props:** padding density (compact, default, spacious) **[blocked on Wave 0 spacing scale — ship default only until spacing tokens exist]**.
- **Tokens:** `surface` background, `outline` border or shadow-equivalent edge.
- **Composition rules:** Footer actions follow the Button contract's "one primary action per group" rule — a Card footer can't have two primary buttons.
- **Prohibitions:** No nested Cards. If content needs visual grouping inside a Card, use Separator, not a second Card.
