// Engine test: the pairs the engine claims to measure are measured, and hold.
//
// Button keeps one label colour across its filled styles, so onPrimary sits on
// secondary and danger fills as well as on primary. Those two pairs are not a
// role on its own base, so they are easy to drop from the engine's table
// without anything else noticing. This sweeps the same 96 hues the
// Accessibility page does, at three saturations, both themes and both
// contrast targets, and fails if either pair goes missing, measures the wrong
// colours, or falls below the target on its fill or its hover and pressed
// states (the label does not change on those).
//
//   node scripts/color.test.mjs

import {
  buildStates,
  buildTheme,
  contrastRatio,
  hsvToHex,
  makeRamps,
} from '../lib/color.js'

const PAIRS = [
  { key: 'onPrimaryOnSecondary', fill: 'secondary' },
  { key: 'onPrimaryOnDanger', fill: 'danger' },
]
const SATURATIONS = [
  [0.6, 0.7],
  [0.3, 0.8],
  [0.9, 0.9],
]

const errors = []
const worst = Object.fromEntries(PAIRS.map((p) => [p.key, Infinity]))
let checked = 0

for (const [s, v] of SATURATIONS) {
  for (let i = 0; i < 96; i++) {
    const hex = hsvToHex({ h: (i * 360) / 96, s, v })
    const ramps = makeRamps(hex)
    for (const mode of ['light', 'dark']) {
      for (const level of ['AA', 'AAA']) {
        const theme = buildTheme(mode, ramps, level)
        const states = buildStates(theme.tokens, ramps, mode)
        const label = theme.tokens.onPrimary.hex
        for (const { key, fill } of PAIRS) {
          const c = theme.contrast[key]
          const where = `${key} at ${hex} ${mode} ${level}`
          if (!c) {
            errors.push(`${where}: not measured`)
            continue
          }
          if (c.on !== 'onPrimary' || c.against !== fill) {
            errors.push(`${where}: measures ${c.on} on ${c.against}`)
          }
          const fills = [theme.tokens[fill].hex, states[fill].hover.hex, states[fill].pressed.hex]
          for (const f of fills) {
            const ratio = contrastRatio(label, f)
            checked++
            worst[key] = Math.min(worst[key], ratio)
            if (ratio < c.target) errors.push(`${where}: ${ratio.toFixed(2)}:1 on ${f}, under ${c.target}:1`)
          }
          if (!c.passes) errors.push(`${where}: the engine reports a failure`)
        }
      }
    }
  }
}

if (errors.length) {
  console.error(`color test: ${errors.length} problem(s)`)
  for (const e of errors.slice(0, 20)) console.error(`  x ${e}`)
  process.exit(1)
}
const summary = PAIRS.map((p) => `${p.key} worst ${worst[p.key].toFixed(2)}:1`).join(', ')
console.log(`OK — Button's label pairs hold across ${checked} measurements (${summary})`)
