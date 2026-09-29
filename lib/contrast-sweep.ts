import { buildTheme, hsvToHex, makeRamps } from '@/lib/color.js'

export type ContrastSweep = {
  hues: number
  pairings: number
  failures: number
}

/**
 * Sweep the source hue across both themes and both targets and count how many
 * generated pairings fail their contrast target. The Create page's contrast
 * report quotes the result, because "there is no auto-fix switch" is a claim
 * about this number: it is only true while the count is zero, and this is what
 * says so.
 *
 * Auto-fix is off, so it measures what the engine produces on its own. Runs at
 * build time (the Create page is a server component), so the client never pays
 * for 384 theme builds. Server-only by intent.
 */
export function sweepContrast(hues = 96): ContrastSweep {
  let pairings = 0
  let failures = 0
  for (let i = 0; i < hues; i++) {
    const ramps = makeRamps(hsvToHex({ h: i * (360 / hues), s: 0.7, v: 0.7 }))
    for (const mode of ['light', 'dark'] as const) {
      for (const level of ['AA', 'AAA'] as const) {
        const theme = buildTheme(mode, ramps, level, false)
        for (const check of Object.values(theme.contrast)) {
          pairings++
          if (!check.passes) failures++
        }
      }
    }
  }
  return { hues, pairings, failures }
}
