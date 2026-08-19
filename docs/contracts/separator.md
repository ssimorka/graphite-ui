---
component: Separator
version: 1.0.0
wave: 1
slots: []
props:
  - name: orientation
    values: [horizontal, vertical]
tokens:
  - name: outline
    usage: Rendered at a low tone-step for visibility without competing with content.
composition_rules:
  - Never used as a spacing hack — spacing comes from the layout scale (Wave 0), not from stacking separators.
prohibitions:
  - No color role other than `outline`.
---

### Separator
- **Slots:** None. Purely structural.
- **Props:** orientation (horizontal, vertical).
- **Tokens:** `outline` at a low tone-step for visibility without competing with content.
- **Composition rules:** Never used as a spacing hack — spacing comes from the layout scale (Wave 0), not from stacking separators.
- **Prohibitions:** No color role other than `outline`.
