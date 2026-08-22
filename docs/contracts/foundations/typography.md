---
foundation: Typography
version: 1.1.0
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

**Adoption is partial, and the remainder is principled (#85).** The site chrome
in `app/globals.scss` applied 58 Carbon type styles. 39 of them resolve to
exactly a kit step and now use the local `text()` mixin, which reads
`--graphite-text-*`:

| Carbon | kit step | uses |
|---|---|---|
| `label-01` | `caption-1` | 22 |
| `body-01` | `body-3` | 8 |
| `body-02` | `body-2` | 5 |
| `code-01` | `code-3` (+ `--graphite-font-mono`) | 4 |

19 stay on Carbon because the kit cannot express them, not because nobody got
to them:

- **8 fluid styles.** Carbon's `fluid-*` tokens compile to
  `calc(Nrem + Nvw)` with a different formula per breakpoint band — genuine
  continuous interpolation. The hero title ramps 32.6px → 60px across the
  viewport. Two discrete modes cannot reproduce that; forcing it would replace
  a ramp with a step.
- **11 at sizes with no kit step.** `heading-compact-01` and
  `body-compact-01` are 14/18, `heading-03` is 20/28, `heading-04` is 28/36.
  The kit has no 18px line height, and its sizes jump 18 → 24 → 32.

`token-drift` reports the 19 on every run so the exception stays visible.

**Letter-spacing has no token, and is carried by hand.** The kit models family,
weight, size and line height — not tracking. Carbon set small values on some
styles (0.32px on `label-01` and `code-01`, 0.16px on `body-01`), and the
`text()` mixin takes them as an argument so they survive the move rather than
being silently dropped. Worth knowing that most `caption-1` call sites override
it locally anyway with their own `0.08em`/`0.12em`; the preserved value only
actually applies where nothing else sets it, such as `.doc-table code`.

**Relationship to the component contract.** `docs/contracts/typography.md`
describes the `Typography` component — its variants, its tags, its
prohibitions. This file describes the scale that component draws from. The
component binds its seven variants to the title ladder, with only `display`
reaching into the heading ladder; that mapping is recorded there, since it is a
statement about the component rather than about the scale.
