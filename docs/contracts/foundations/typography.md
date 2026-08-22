---
foundation: Typography
version: 1.0.0
source: Graphite UI Kit › Graphite Typography (65 variables, Desktop/Mobile)
snapshot: docs/tokens/figma-snapshot.json
declared_in: app/globals.scss
checked_by: scripts/token-drift.mjs
# Verified against app/globals.scss by token-drift.mjs, so this cannot go stale
# the way the counts in the parent README did.
variable_count: 65  # 3 --graphite-font-*, 4 weights, 58 step values
implemented_by: docs/contracts/typography.md (the Typography component, 1.1.0)
variables:
  - name: --graphite-font-1
    usage: Display, headings and titles 1-2. IBM Plex Sans.
  - name: --graphite-font-2
    usage: Titles 3-5, body and component text. IBM Plex Sans.
  - name: --graphite-font-mono
    usage: Code and technical values. IBM Plex Mono.
  - name: --graphite-text-weight-regular | -medium | -semibold | -bold
    count: 4
    usage: 400 / 500 / 600 / 700.
  - name: --graphite-text-<step>-size and -line-height
    count: 58
    unit: rem
    usage: 29 steps across display, heading 1-6, title 1-5, body 1-3, component (button/input/tooltip/table), footnote, caption 1-2 and code 1-3.
composition_rules:
  - The kit keeps two ladders. heading/* is the editorial scale and runs to 64px; title/* is the UI scale. A component-level heading is a UI title — map it to title/*, not to the heading of the same number.
  - font-1 and font-2 hold the same family today and are still two tokens. They are distinct roles, per the kit's own descriptions, so the pair can diverge without a rename sweep.
  - 15 of the 29 steps change between Desktop and Mobile. The other 14 are restated nowhere; a step with identical modes must not carry an override.
prohibitions:
  - Do not feed --graphite-text-weight-* back to Figma. The kit stores style names, and the Plugin API's string for this face is "Semi Bold" with a space, not the "SemiBold" the kit uses.
  - Do not convert sizes to px. Type is the case where answering to the reader's root font size matters most.
  - Do not collapse font-1 and font-2 because they are equal today.
---

### Typography

**Source.** The kit's `Graphite Typography` collection, in both modes.

**Unit.** rem, at the kit's px ÷ 16 — the same conversion as spacing, and for
the strongest version of the same reason: this is the scale that has to answer
when a reader turns their font size up.

**Weights map once, at the token.** The kit stores Figma style names
(`"SemiBold"`); CSS needs numbers. The mapping lives in `app/globals.scss` and
is re-encoded in `token-drift.mjs` so the two must agree.

**The mode boundary is ours, not the kit's.** The kit gives Desktop and Mobile
modes but does not say what separates them. The stylesheet applies Mobile below
672px — one below `md`, matching the boundary the rest of the file already
used. It is stated in one place so that if it is wrong, it is wrong once.

**Two upstream fixes.** Landing this required correcting the source first,
since generating from a file means inheriting its mistakes:

- `component/input/2` and `/3` carried a 12px line height on 12px text, a 1.00x
  ratio that clips descenders. Every other 12px step in the kit is 16px. Both
  were set to 16 in Figma, and their descriptions — which asserted the old
  ratio — updated with them.
- `family/font-1` and `font-2` looked like a duplicate and are not. Their
  descriptions define distinct roles. Left alone; see the composition rule
  above.

**Relationship to the component contract.** `docs/contracts/typography.md`
describes the `Typography` component — its variants, its tags, its
prohibitions. This file describes the scale that component draws from. The
component binds its seven variants to the title ladder, with only `display`
reaching into the heading ladder; that mapping is recorded there, since it is a
statement about the component rather than about the scale.
