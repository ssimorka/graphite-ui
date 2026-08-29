# Graphite UI (helix) — working notes

Next.js 16 App Router landing page for "Graphite UI" (originally scaffolded as
"Helix," fully rebranded). Themed live off Carbon Design System via a color
engine ported from `carbon-token-studio`.

## Dev server

**Must run with `--webpack`** — Turbopack breaks on this project's Sass.

```
npx next dev --webpack
```

Configured in `.claude/launch.json` under the name `dev`, port 3000. The
port is hardcoded with no `autoPort`, so parallel worktrees collide on it:
the second server silently attaches to the first checkout, and verification
then tests the wrong code. Check which checkout is serving before trusting
a browser result.

## Known, verified findings — don't re-derive these

- **Auto-fix on-colors toggle is a no-op.** Swept 96 hues × light/dark ×
  AA/AAA through `buildTheme` — no pairing ever fails, so `autoFix` never
  has anything to fix. Re-verified 2026-08-22 with the secondary family
  added: 6144 pairs, still zero failures and zero repairs. The wiring is correct (flows into `buildTheme`,
  re-renders on toggle); the *engine* just never produces a failing pair
  at any tested input. Confirmed correct behavior, not a bug — but don't
  assume the toggle does something visible without retesting the actual
  input hex.
- **`tsc --noEmit` is clean (0 errors).** This note previously recorded 39
  pre-existing errors from `lib/color.js` being untyped; `lib/color.d.ts`
  now exists and clears them. Verified 2026-08-19.
- **Prettier has no project config, and the flags are not enough.**
  Running it directly reformats to double-quotes/semicolons, against the
  codebase's actual style (single quotes, no semicolons), so it needs
  `--no-semi --single-quote` explicitly. But even with those flags it
  rewrites code it was not pointed at: `prettier --write
  components/generative-art.tsx` produced 453 insertions / 190 deletions
  for a 6-line change, because that file hand-packs arrays (`STANDARD`,
  `SPAN_OPTIONS`) onto shared lines and Prettier explodes them one per
  line. Verified 2026-08-23. Match the surrounding style by hand instead,
  and sanity-check `git diff --numstat` against the size of the actual
  edit. To undo a Prettier run, restore with `git show HEAD:<path>` and
  re-apply the edit.
- **No em dashes in user-facing copy.** PR #10 removed every one and the
  convention holds: recast as a colon where the second half explains the
  first, a comma or full stop where it joins clauses, parentheses where it
  brackets an aside. Code comments are exempt, as is the `—` a token table
  falls back to for a missing value, which is a null state rather than
  copy. This file is notes, not copy, so em dashes are fine here.
- **`--cds-support-*` are now generated**, bound to the `danger` /
  `warning` / `success` / `info` roles. This used to be Carbon's fixed
  green and was a standing trap — several early passes left "success
  green" chrome that read as a foreign color. Status hue is pinned per
  status (so red still reads as danger whatever the source is) while
  chroma tracks the source, clamped 0.10–0.20. Chrome that should
  track the source but carries no status meaning still belongs on
  `--cds-interactive` / `--cds-button-primary`.
- **The secondary ramp is verified against the kit, including its one
  mismatch.** `secondary` is source-derived (hue − 120°, chroma × 0.585)
  and reproduces `Graphite Primitives/secondary/*` from
  `docs/tokens/figma-snapshot.json` within 1/255 at nine of ten stops. The
  tenth is the source-tone stop, off by 3 — and the engine is the more
  correct one: its hue is 0.17° from the intended `source − 120°` where
  Figma's baked value is 1.19° off, at a tone where red sits at the sRGB
  gamut edge. Don't "fix" that delta toward Figma.
- **Secondary shares accent's tone ladder, not neutral's.** In the kit,
  accent and secondary sample at the pinned source tone while neutral,
  neutralVariant and all four status ramps sample at a round 50. That is
  why `makeRamps` pins the source tone for secondary — and why it then
  clears the `source` flag, which means "this stop is the source hex" and
  is false for a hue 120° away.
- **The 10% of the 60/30/10 rhythm is `secondary`, deliberately.** It was
  `neutralVariant` until #90. `buildPalette` in `components/generative-art.tsx`
  now samples `secondary` at the same two tone stops neutralVariant held
  (80 dark, 50 light), so the pool's light/dark split by `luminance > 0.45`
  is unchanged and only the chroma moves. The consequence is that
  neutralVariant no longer appears in the composition palette at all — it is
  still the fourth ramp in the ramp stack and still drives `outline`, so
  that absence is intended, not an omission to repair. The ratio bar in
  `pattern-guide.tsx` reads the `secondary` / `onSecondary` roles to match.
- **The Figma kit is canonical, not the contracts.** Reversed 2026-08-28.
  Governance rule 7 in `docs/contracts/README.md`: where the kit and a contract
  disagree, the kit wins and the *contract* is corrected. Contracts are still
  the written spec the code is checked against — `drift-check` is unchanged —
  but they describe the kit rather than outrank it. The practical rule is that
  the site's components should look like the kit's, which for Button meant
  square corners, Carbon's asymmetric `0 64px 0 16px` inset, a filled
  secondary, and `primary` as ghost's label. Don't reason from the old
  precedence: both READMEs said "contracts win" until this date.
- **The kit contradicts itself, and rule 7 has a tie-break for it.** Three
  times in one pass: the type specimen says `Input Label` is 12/12 while every
  component renders 12/16; `surfaceElevated` is described as the overlay
  surface while those overlays bind `Layer/layer-01`; and the kit is simply
  silent where the code has behaviour Figma cannot express. The rule is *the
  more specific artefact wins*, and *where the kit has no opinion the code
  keeps its own* — see "When the kit is not of one mind" in
  `docs/contracts/README.md`. Don't resolve one of these from first principles
  again; the precedents are recorded next to the values they explain.
- **Carbon-only sets in the kit are labelled, not deleted.** Governance
  rule 6 (`docs/contracts/README.md`, "Carbon-only sets in the kit") settles
  what happens to the 27 component pages no contract claims: a set is
  *governed* if a contract declares it and *ungoverned* otherwise, ungoverned
  sets stay in the file and say so in their description, and movement is
  one-way. Deleting is off the table while the library is published, because
  removal is a breaking change for consumers. Three classes are ungoverned
  permanently rather than pending — application shells (UI shell, Tree view,
  Content switcher), Carbon's AI components, and Carbon idioms with no
  Graphite counterpart. Don't re-argue any of this per component: that
  piecemeal drift is exactly what #124 exists to stop.
- **Navigation Menu is deliberately un-inverted, and that is settled.** #113
  looked like the last open Wave 4 item and was not: rule 6 (#128) puts
  Carbon's six UI shell sets out of scope by construction as application
  shells, which leaves the kit *silent* on `navigation-menu.md` rather than
  disagreeing with it, and rule 7's tie-break (#141) then says the code keeps
  its own. It is kept rather than removed because it passes rule 6's demand
  test where Separator, Avatar and Card failed it: `site-header.tsx` still
  renders Carbon's `Header` / `HeaderNavigation` / `SideNav`, and step 1 of
  `docs/SHADCN-MIGRATION.md` is de-Carboning exactly that. Contract went to
  2.0.0 for the added "not an application shell" prohibition; the only code
  change is the version docblock, which `drift-check` verifies against the
  contract. Don't re-open this as deferred work.
- **Rule 8 settles whether a component with no kit counterpart exists.**
  Ratified in #133 and written up as "When the kit has nothing" in
  `docs/contracts/README.md`. Rules 6 and 7 answer *who wins a disagreement*;
  neither answers *what should exist*, and #133's original corollary conflated
  the two. Its authority half is ratified (where the kit has nothing, the
  contract is authoritative) and its existence half is struck (it read "rule 7
  does not reach this" as "therefore keep").
  Three questions in order: does the kit have a counterpart (invert, rule 7) →
  does the kit answer the same need inside something else it governs (absorb,
  as Label and Field were) → does it say nothing at all (rule 6's demand test
  decides). All six cases are sorted in the table there: Separator/Avatar/Card
  removed, Label/Field absorbed, Navigation Menu and Typography kept.
  **The distinction that does the work is dependency versus illustration** — if
  the reference still reads correctly after substituting something else, it was
  an illustration. Avatar was named in Contained list's *optional* leading slot
  and a Tag replaced it; Typography is the type of its *required* title slot and
  is the remedy in Progress bar's prohibition. "The repo imports it" is not the
  test: only the gallery imports Typography.
- **The kit's 27 unclaimed pages hold 132 component sets, not "~40".** Walked
  2026-08-28 through the Plugin API and published as
  `docs/contracts/kit/figma-only.md` (#124 Part B; it lives in `kit/` because
  `drift-check` treats every top-level `.md` in `docs/contracts/` as a component
  contract). 73 public, 59 private, 2,106
  variants; Dropdown and Date picker carry 16 sets each. Don't re-derive from
  page names — they understate by ~5x.
  **The `_` prefix is the kit's own public/private line** and rule 6's labelling
  applies to the 73 public sets only; `_`-prefixed sets carry "🚫 Do not edit"
  and are load-bearing internals (Dropdown alone instances 3,139 of them).
  Two traps recorded there: the AI sets are instanced *inside* Dropdown's
  variants (246 `AI layer - Field`, 201 `AI label`), so "drop the AI components"
  is not self-contained; and `_Structured list header row item` exists **twice**
  as two distinct sets, which defeats the name-based lookup the gallery badge
  and #134/#136 failures depend on.
- **There are three governance checks now, not two.**
  `component-doc-drift.mjs` joins `drift-check.mjs` (components vs contracts)
  and `token-drift.mjs` (foundations vs token snapshot). It checks
  `docs/components/*.md` against `docs/tokens/figma-components.json` — 45 pages,
  206 sets — and closes the "no tooling enforces this yet" gap that README
  admitted to. It found 8 undocumented public sets on the day it landed.
  Both Figma-backed checks read a committed snapshot and never the network, so
  they run offline in CI; **re-extracting the snapshot is still manual**
  (`scripts/component-extract.js` through the MCP, then `pnpm
  component-snapshot`). So the check catches a *doc* drifting from the
  snapshot, not the *snapshot* drifting from Figma.
  Two gotchas if you touch it: a set counts as documented if the doc cites its
  node id **or** names it (dropdown.md documents all 8 sets by id in a matrix
  and names none of them), and `page.loadAsync()` is what lets one `use_figma`
  call read many pages — `setCurrentPageAsync` is capped at one per call and
  `loadAllPagesAsync` is unsupported by the MCP tool.
- **A source color on a status hue collapses the two.** A red source
  resolves `primary` and `danger` to nearly the same value. Inherent to
  pinning hue; don't treat it as a bug, and never let color alone carry
  status meaning in the UI.

## Architecture notes

- `components/theme-provider.tsx` is the single source of truth for
  `sourceHex`, `theme` (`'white' | 'g100'`), `level` (AA/AAA), and
  `autoFix`. It computes `lightBundle`/`darkBundle` (tokens + contrast +
  states) via `lib/color.js` and stamps 101 CSS vars onto `<html>` on every
  change: 45 `--graphite-*` (32 token roles, plus 6 states each for the
  `primary` and `secondary` families, plus `--graphite-focus`) and 56
  `--cds-*`. The counts are worth keeping straight — `--graphite-*` is the
  primary namespace and is derived from the engine's token keys, so it
  cannot drift; `--cds-*` is Carbon's compatibility layer and is a
  hand-listed binding table that can.
- `COVER_SOURCE_HEX` (`#5e44aa`) is the seeded default source color,
  sampled from the kit cover image's dominant hue bucket — not
  arbitrary, and should stay in sync with `public/graphite/cover.jpg` if
  that image ever changes.
- Token-rewrite flicker: `theme-provider.tsx` applies an `is-retheming`
  class for one frame while `--cds-*` vars are rewritten, because Carbon
  ships `transition: background 70ms` on buttons that otherwise strand
  mid-transition when the underlying CSS var changes value.
- `components/studio.tsx` holds the Carbon Token Studio–parity pieces
  (RampRow, SemanticTable, StatesMatrix, copy-to-clipboard + toast) —
  ported to match `carbon-token-studio/src/App.jsx` functionally, not
  just visually. If asked to add Studio parity again, diff against that
  file directly rather than guessing.
- Light/Dark tabs in the Contrast panel *are* the site theme switch
  (`modeIndex` derives from `theme`, not separate local state) — by
  design, per explicit request.
