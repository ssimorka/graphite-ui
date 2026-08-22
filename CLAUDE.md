# Graphite UI (helix) — working notes

Next.js 16 App Router landing page for "Graphite UI" (originally scaffolded as
"Helix," fully rebranded). Themed live off Carbon Design System via a color
engine ported from `carbon-token-studio`.

## Dev server

**Must run with `--webpack`** — Turbopack breaks on this project's Sass.

```
npx next dev --webpack
```

Configured in `.claude/launch.json` under the name `helix`, port 3001.

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
- **Prettier has no project config.** Running it directly reformats to
  double-quotes/semicolons, against the codebase's actual style (single
  quotes, no semicolons). Always run with
  `--no-semi --single-quote` explicitly.
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
- **A source color on a status hue collapses the two.** A red source
  resolves `primary` and `danger` to nearly the same value. Inherent to
  pinning hue; don't treat it as a bug, and never let color alone carry
  status meaning in the UI.

## Architecture notes

- `components/theme-provider.tsx` is the single source of truth for
  `sourceHex`, `theme` (`'white' | 'g100'`), `level` (AA/AAA), and
  `autoFix`. It computes `lightBundle`/`darkBundle` (tokens + contrast +
  states) via `lib/color.js` and stamps ~33 `--cds-*` CSS vars onto
  `<html>` on every change.
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
