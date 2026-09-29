import fs from 'node:fs'
import path from 'node:path'
import { makeRamps } from '@/lib/color.js'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import type { RampName } from '@/lib/color.js'

/**
 * The four source-derived ramps compared with the kit's Graphite Primitives, at
 * the seeded source. The kit bakes these values in; the engine computes them.
 * `docs/tokens/figma-snapshot.json` holds the kit's side, so the comparison
 * runs offline like the other governance checks.
 *
 * The Color ramps page quotes the result instead of carrying it as prose,
 * because the page's claim is a measurement: it goes stale the moment the
 * engine or the kit moves, and this is what says so. Server-only.
 */

export const SOURCE_RAMPS = [
  'accent',
  'secondary',
  'neutral',
  'neutralVariant',
] as const satisfies readonly RampName[]

// Stops run from tone 10 to tone 98, which the kit names 900 down to 050.
export const WEIGHTS = ['900', '800', '700', '600', '500', '400', '300', '200', '100', '050']

const CHANNELS = ['red', 'green', 'blue'] as const
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

export type StopDiff = {
  ramp: RampName
  weight: string
  engine: string
  kit: string
  /** The largest single-channel difference, out of 255. */
  delta: number
  channel: (typeof CHANNELS)[number]
}

export type RampSampling = {
  ramp: RampName
  /** The tone the middle stop is sampled at. */
  midTone: number
  /** Whether one stop is literally the source hex. */
  hasSourceStop: boolean
}

export type Divergence = {
  seed: string
  total: number
  exact: number
  /** Differing by 1/255 or less, which is not visible. */
  near: number
  /** Differing by more than that. */
  far: StopDiff[]
  /** Every ramp with at least one difference. */
  rampsAffected: RampName[]
  sampling: RampSampling[]
}

export function readDivergence(): Divergence {
  const kit = (
    JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'docs', 'tokens', 'figma-snapshot.json'),
        'utf8',
      ),
    ) as {
      collections: {
        'Graphite Primitives': {
          variables: Record<string, { values: { Value: { value: string } } }>
        }
      }
    }
  ).collections['Graphite Primitives'].variables

  const ramps = makeRamps(COVER_SOURCE_HEX)
  let exact = 0
  let near = 0
  const far: StopDiff[] = []
  const affected = new Set<RampName>()
  const sampling: RampSampling[] = []

  for (const ramp of SOURCE_RAMPS) {
    const { stops } = ramps[ramp]
    sampling.push({
      ramp,
      midTone: stops[4].tone,
      hasSourceStop: stops.some((s) => s.source),
    })
    stops.forEach((stop, i) => {
      const kitHex = kit[`${ramp}/${WEIGHTS[i]}`].values.Value.value
      const diffs = rgb(stop.hex).map((v, c) => Math.abs(v - rgb(kitHex)[c]))
      const delta = Math.max(...diffs)
      if (delta === 0) return void exact++
      affected.add(ramp)
      if (delta <= 1) return void near++
      far.push({
        ramp,
        weight: WEIGHTS[i],
        engine: stop.hex,
        kit: kitHex,
        delta,
        channel: CHANNELS[diffs.indexOf(delta)],
      })
    })
  }

  return {
    seed: COVER_SOURCE_HEX,
    total: SOURCE_RAMPS.length * WEIGHTS.length,
    exact,
    near,
    far,
    rampsAffected: [...affected],
    sampling,
  }
}
