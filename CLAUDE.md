# Graphite UI (helix) — working notes

Next.js 16 App Router landing page for "Graphite UI" (originally scaffolded as
"Helix," fully rebranded). Themed live by its own color engine
(`lib/color.js`), with Carbon still underneath the site chrome.

## Dev server

**Must run with `--webpack`** — Turbopack breaks on this project's Sass.

```
npx next dev --webpack
```

Configured in `.claude/launch.json` under the name `dev`, port 3000 with
`autoPort: true`, so a second worktree's preview gets its own port instead of
colliding. It used to be hardcoded with no `autoPort`, and the second server
then silently attached to the first checkout, so verification tested the
wrong code. Nothing needs 3000 specifically (no OAuth callbacks or webhooks),
and the `dev` script carries no `--port` flag, so leave it that way. A tab
already open on 3000 may still be another checkout: check which one is serving
before trusting a browser result.

## Known, verified findings — don't re-derive these

- **Auto-fix never has anything to fix, and its toggle is gone.** Swept 96
  hues × light/dark × AA/AAA through `buildTheme` with auto-fix off: 6,144
  pairs, zero failures, so zero repairs. First found 2026-08-22; the
  Accessibility page (`/docs/accessibility`) now reruns that sweep at build
  time and prints the result. The "Auto-fix on-colors" toggle was removed as
  a control the visitor did not really have (see the comment in
  `components/color-picker.tsx`). `buildTheme` still defaults `autoFix` to
  true, so the repair path stays armed for an input the sweep does not
  cover. Don't reintroduce a toggle without first finding a hex that fails.
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
  surface while those overlays bound `Layer/layer-01` (since resolved:
  `layer-01` now aliases `elevation/01`, the same stops, so overlays bind
  `elevation-01` plus the kit's shadow, with no edge — `overlay.md` 2.0.0,
  D2 on #219); and the kit is simply
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
  permanently rather than pending — application shells (UI shell, Content
  switcher), Carbon's AI components, and Carbon idioms with no
  Graphite counterpart. Don't re-argue any of this per component: that
  piecemeal drift is exactly what #124 exists to stop.
  **Amended and done 2026-10-04 (#240, closed):** the other two buckets were
  built rather than left waiting for demand — G1 (Link, Search, Pagination,
  Slider, File uploader, Date picker and Time picker), Toast and Checkbox
  group carried from #219, and G2 (Password input, Number input, Menu buttons,
  Dropdown in four kinds), each splitting a fold off a governed contract.
  Every one met #219's definition of done, kit description stamp included;
  only the permanent three stay ungoverned, so the Navigation Menu settlement
  stands. That makes 36 contracts.
  **Tree view left the application shells on 2026-10-04** and is governed
  (`tree-view.md`, wave 4): the kit draws it as a primitive, and the docs
  sidebar is now one Tree view, groups as branches and pages as link leaves.
  That makes 37 contracts. Navigation Menu keeps the header's flat case, so
  its settlement (below) is unchanged. Contract `component:` names are display
  names ("Checkbox group", "Menu buttons"), never PascalCase: the gallery
  keys its previews and kit-page matching on them (#296). The gallery's
  no-contract tile is summed from the snapshot (35), not read from
  figma-only.md's 73, which records the 2026-08-28 walk.
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
  and a Tag replaced it; Typography is the type of its *required* title slot.
  It used to be the remedy in Progress bar's prohibition too, but Progress bar
  2.0.0 (#235) paints its own label, so that second dependency is gone and
  Contained list alone keeps it (D7 on #219). "The repo imports it" is not the
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
  **Dev Mode code syntax is snapshotted too**, separately: `scripts/figma-code-syntax.js`
  (one `use_figma` call, read-only) returns every in-scope variable's WEB code
  syntax; save it as `docs/tokens/figma-code-syntax.json` through
  `JSON.stringify(x, null, 2)`. token-drift fails unless every entry is
  `var(--graphite-…)` naming a variable the engine generates or `globals.scss`
  declares, and fails if the file is missing. Rewritten in the kit 2026-10-06:
  Semantic carried the retired export prefix (and `error` for danger), Spacing
  and Radius carried Carbon-style names; the 20 kit-only state variables
  (warning/success/info states, primary-container hover/active) have no CSS
  counterpart and carry no code syntax on purpose. Restamp after a kit rename.
  Two gotchas if you touch it: a set counts as documented if the doc cites its
  node id **or** names it (dropdown.md documents all 8 sets by id in a matrix
  and names none of them), and `page.loadAsync()` is what lets one `use_figma`
  call read many pages — `setCurrentPageAsync` is capped at one per call and
  `loadAllPagesAsync` is unsupported by the MCP tool.
- **Rules 5 and 6 are applied in the kit, and the stamps are manual.** Since
  2026-10-04 (#275) every public set on all 45 component pages ends its
  description with one line, after a blank line and the kit's own text:
  `Graphite: governed — docs/contracts/<name>.md <version>` (80) or
  `Graphite: ungoverned — see docs/contracts/kit/figma-only.md` (35, the
  permanent three buckets). `_`-prefixed sets carry none. The interim
  `Graphite: ungoverned, scheduled to build (#240)` form is retired; every set
  that held it now has a contract. Recorded in "What the kit says" in
  `docs/contracts/kit/figma-only.md`.
  **No check enforces the stamp**, so it lags every contract version bump until
  someone restamps, and consumers see it only after the library is republished.
  Read versions from the contract (the gallery badge does), never from the kit.
  When a contract bumps or lands, restamp in the same pass: strip any existing
  `Graphite:` line, append the new one, and write only when the result differs.
  Sub-sets on a governed page take that page's contract (Data table's ten item
  sets, Popover item, Tooltip body item and so on) unless another contract cites
  the set's node id, as `toast.md` and `checkbox-group.md` do. Ten of the
  snapshot's "sets" are standalone `COMPONENT`s (Breadcrumb, Accordion, Vertical
  tabs, Data table header item, six on ungoverned pages); they take a
  description the same way, so don't filter to `COMPONENT_SET` alone.
- **The docs header wash is capped by a contrast sweep, not by eye.** The
  accent mesh behind the top of docs pages measured 1.66:1 against body text
  at full strength in dark mode. Swept 2026-10-03: 288 sources (96 hues × 3
  saturations) through `makeRamps` / `buildTheme`, `onSurface`,
  `onSurfaceVariant` and `primary` against the wash at its worst point (full
  glow, fade ignored). The strengths in `WASH_OPACITY` (`docs-shell.tsx`) are
  tied to the visitor's contrast target: AA light 0.3 / dark 0.4 (worst 5.29 /
  5.11:1), AAA light 0.1 / dark 0.2 (worst 7.16 / 7.32:1). Don't raise them
  without rerunning the sweep.
- **A source color on a status hue collapses the two.** A red source
  resolves `primary` and `danger` to nearly the same value. Inherent to
  pinning hue; don't treat it as a bug, and never let color alone carry
  status meaning in the UI.

## Landing changes

**`main` is protected and you cannot push to it.** Enabled 2026-08-29 after a
long run of green governance runs made `governance` safe to require. Every
change goes through a PR, including one-line doc edits.

- A pull request is required. Approvals required: **0**, because a solo
  maintainer cannot approve their own PR and any higher number would be a
  lock-out rather than a gate.
- `governance` must pass. That is the workflow job in
  `.github/workflows/checks.yml`, not Vercel: Vercel proves the site builds,
  which is not the same claim.
- **`enforce_admins` is on**, so this binds the repo owner too. That is the
  entire point — the one unreviewed change in recent history (`e49b422`) was
  the owner pushing straight to `main` after a merge, and admin bypass would
  have permitted it.
- Force pushes and branch deletion are off; linear history is required, which
  the squash-merge habit already produced.
- `strict` (branch must be up to date before merging) is **off**, deliberately:
  with one PR in flight at a time it only buys needless rebases.

Verified by probe: an empty commit pushed directly to `main` is rejected with
"Changes must be made through a pull request" and "Required status check
'governance' is expected."

If CI is ever broken badly enough to block a fix, the escape hatch is to
disable protection, land the fix, and re-enable — a deliberate act that leaves
a trace, which is what "no bypass" is meant to cost.

## Architecture notes

- `components/theme-provider.tsx` is the single source of truth for
  `sourceHex`, `theme` (`'light' | 'dark'`, set on `<html>` as `data-theme`;
  Carbon's `white`/`g100` survive only as the zone class) and `level` (AA/AAA). (It used to
  hold `autoFix` too; the toggle was removed as a no-op, see above.) It
  computes `lightBundle`/`darkBundle` (tokens + contrast + states) via
  `lib/color.js` and stamps 117 CSS vars onto `<html>` on every change: 58
  `--graphite-*` (32 token roles, 6 states each for the `primary`,
  `secondary` and `danger` families from `STATE_FAMILIES`, `--graphite-focus`,
  `--graphite-scrim`, and the six ladder variables from `LADDERS`:
  `elevation-00`–`03`, `outline-subtle`, `outline-strong`) and 59 `--cds-*`.
  The ladders are not roles (the kit files them beside its 32), so "thirty-two
  roles" in the site copy stays true; drift-check binds `outline-*` to the
  `outline` role and `elevation-*` to a declarable `elevation`. Counts verified
  2026-10-03 by reading `<html>`'s inline style. The choice (`sourceHex`, `theme`, `level`)
  persists in `localStorage`, because most site links are plain anchors and
  every click is a full load; an inline `<head>` script re-applies the last
  stamped vars before first paint so there is no flash of the default (keys
  and script in `lib/theme-storage.ts`). The counts are worth keeping straight —
  `--graphite-*` is the primary namespace and is derived from the engine's
  token keys, so it cannot drift; `--cds-*` is Carbon's compatibility layer
  and is a hand-listed binding table that can. The Tokens foundation page
  (`/docs/foundations/tokens`) reads the stamped set back live.
- `COVER_SOURCE_HEX` (`#5e44aa`) is the seeded default source color,
  sampled from the kit cover image's dominant hue bucket — not
  arbitrary, and should stay in sync with `public/graphite/cover.jpg` if
  that image ever changes.
- **The provider imports nothing from Carbon.** The 59 `--cds-*`, the
  `cds--*` zone class and `GlobalTheme` live in `components/carbon-compat.tsx`
  and plug in through the provider's `extend` option, configured in
  `components/site-theme.tsx` (which also turns on `persist` and starts dark).
  An adopter's provider defaults to light, no persistence, and stamps only
  `--graphite-*`; `stampVars={false}` makes it a pure `data-theme` switcher for
  projects that import Create's theme file. token-drift finds `@carbon/grid`
  by module resolution through `@carbon/react` -> `@carbon/styles` and fails
  if it cannot.
- **The Tailwind bridge is generated, and holds no values.** `lib/tailwind-bridge.ts`
  names every `buildGraphiteVars` key and the foundations from `globals.scss` as
  Tailwind v4 tokens under `@theme inline` (inline, so a nested `data-theme`
  reaches utilities). Spacing is `p-space-05`, not `p-05`, because Tailwind's
  `p-5` is a different size. Breakpoints are literals in a plain `@theme` block
  and replace Tailwind's sm–xl. Compiled against Tailwind 4.3.3 on 2026-10-06:
  every mapped utility resolves to its `--graphite-*` variable. Offered as the
  Tailwind tab of Get the code.
- **Outside-project test, 2026-10-06** (fresh `create-next-app` 16.3.8 with
  Tailwind 4.3.3, Turbopack): Button, Text input and Modal render correctly in
  both themes beside Tailwind's preflight with zero edits to the copied files.
  Turbopack compiles the SCSS modules fine; `--webpack` is only needed here for
  Carbon's Sass. Three traps an adopter hits: the theme file is required even
  with the provider (the provider stamps colors only), Plex must be loaded under
  its real name (Fontsource works; `next/font` hashes the family name, so the
  theme never matches it), and the starter's `globals.css` rules override the
  theme. Next's default ESLint flags setState-in-effect, hence the scoped
  disable in the provider's restore effect.
- Token-rewrite flicker: `theme-provider.tsx` applies an `is-retheming`
  class for one frame while `--cds-*` vars are rewritten, because Carbon
  ships `transition: background 70ms` on buttons that otherwise strand
  mid-transition when the underlying CSS var changes value.
- `components/token-panels.tsx` holds the token display pieces (RampRow,
  SemanticTable, StatesMatrix, copy-to-clipboard + toast).
- **One variable name, enforced.** The provider and Create's CSS export both
  build `--graphite-*` from `buildGraphiteVars` in `lib/color.js`, so the file
  an adopter downloads names exactly what components read. The export used to
  carry a second prefix, inherited from the engine's origin, and the docs told
  people to rename it by hand; that prefix is gone, and `scripts/naming-check.mjs`
  fails CI if it reappears anywhere in the repo. Provenance (ramp, tone) lives
  in the JSON export only.
