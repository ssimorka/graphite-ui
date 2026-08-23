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
