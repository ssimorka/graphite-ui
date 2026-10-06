import { buildStates, buildTheme, contrastRatio, hsvToHex, makeRamps } from '@/lib/color.js'
import type { ContrastLevel, ThemeMode } from '@/lib/color.js'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'

// A contrast sweep, run on the server when the page renders, so the figures on
// the Accessibility page are the engine's answer today rather than a note of
// what it said once. CLAUDE.md records the same sweep (96 hues, light and dark,
// AA and AAA) by hand; this recomputes it from lib/color.js directly.
//
// Sources are spaced evenly round the hue wheel at one fixed saturation and
// value. That is a choice, not a claim that every possible hex is covered, and
// the page says so.

const HUES = 96
export const SWEEP_SATURATION = 0.6
export const SWEEP_VALUE = 0.7
const MODES: ThemeMode[] = ['light', 'dark']
const LEVELS: ContrastLevel[] = ['AA', 'AAA']

export type Target = { kind: 'AA' | 'UI'; level: ContrastLevel; target: number }

export type Sweep = {
  hues: number
  modes: number
  levels: number
  pairsPerTheme: number
  pairs: number
  /** Pairs below target with auto-fix off: what the engine emits unaided. */
  failures: number
  /** Pairs auto-fix moved with it on. */
  repairs: number
  /** The pair that clears its target by the least, as ratio / target. */
  tightest: { role: string; against: string; mode: ThemeMode; level: ContrastLevel; source: string; ratio: number; target: number }
  /** Lowest contrast of --graphite-focus against surface or background. */
  focusMin: number
  /** The engine's own targets, read from its contrast entries. */
  targets: Target[]
}

export function runSweep(): Sweep {
  let pairs = 0
  let failures = 0
  let repairs = 0
  let focusMin = Infinity
  let pairsPerTheme = 0
  let tightest: Sweep['tightest'] | null = null
  const targets = new Map<string, Target>()

  for (let i = 0; i < HUES; i++) {
    const source = hsvToHex({ h: (i * 360) / HUES, s: SWEEP_SATURATION, v: SWEEP_VALUE })
    const ramps = makeRamps(source)
    for (const mode of MODES) {
      for (const level of LEVELS) {
        const raw = buildTheme(mode, ramps, level, false)
        const fixed = buildTheme(mode, ramps, level, true)
        const entries = Object.entries(raw.contrast)
        pairsPerTheme = entries.length
        for (const [role, c] of entries) {
          pairs++
          if (!c.passes) failures++
          if (fixed.contrast[role].fixed) repairs++
          targets.set(`${c.kind}-${level}`, { kind: c.kind, level, target: c.target })
          const margin = c.ratio / c.target
          if (!tightest || margin < tightest.ratio / tightest.target) {
            tightest = { role, against: c.against, mode, level, source, ratio: c.ratio, target: c.target }
          }
        }
        const states = buildStates(raw.tokens, ramps, mode)
        focusMin = Math.min(
          focusMin,
          contrastRatio(states.focus.hex, raw.tokens.surface.hex),
          contrastRatio(states.focus.hex, raw.tokens.background.hex),
        )
      }
    }
  }

  return {
    hues: HUES,
    modes: MODES.length,
    levels: LEVELS.length,
    pairsPerTheme,
    pairs,
    failures,
    repairs,
    tightest: tightest!,
    focusMin: Math.round(focusMin * 10) / 10,
    targets: [...targets.values()],
  }
}

/** The page-level focus ring at the seeded source: which ramp, which tone. */
export function focusAtSeed() {
  const ramps = makeRamps(COVER_SOURCE_HEX)
  return MODES.map((mode) => {
    const theme = buildTheme(mode, ramps, 'AA')
    const f = buildStates(theme.tokens, ramps, mode).focus
    return {
      mode,
      ramp: f.ramp,
      tone: f.tone,
      hex: f.hex,
      surface: Math.round(contrastRatio(f.hex, theme.tokens.surface.hex) * 10) / 10,
    }
  })
}
