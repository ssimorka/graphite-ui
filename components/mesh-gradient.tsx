'use client'

import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { makeRamps } from '@/lib/color.js'
import styles from './mesh-gradient.module.scss'

/**
 * Kit "Graphite Primitive Mesh Gradient", the backdrop behind 02 Component
 * wall (13535:15189, the neutralVariant variant) and 04 Theme (13535:15197,
 * the accent one).
 *
 * The kit builds it from primitives: a ramp's 900 as the field, then a few
 * enormous blurred ellipses in other stops of the same ramp. It is drawn from
 * the engine's ramps here rather than shipped as the kit's exported SVGs,
 * because those bake the hexes in and the whole point of the site is that
 * every surface repaints when the source colour moves. The ellipses are radial
 * gradients rather than blurred shapes, which paints once instead of running a
 * 500px Gaussian over a 3000px canvas.
 *
 * The kit also lays a grain texture over it at 10%. Left out: a black-on-alpha
 * speckle does not compress, and the export was 516KB for an effect drawn at a
 * tenth of its strength.
 *
 * Light mode is the code's own call. Primitives do not follow the mode, so a
 * literal port leaves both sections near-black under the kit's own on-surface
 * text once that text goes dark. The kit is silent on it; the ramp is mirrored
 * instead, 900 for 050 and so on, so the mesh follows the mode the way every
 * other panel on the page does.
 */
export type MeshFamily = 'neutralVariant' | 'accent'

// makeRamps orders stops 900 first and 050 last; these are the indexes the
// two variants reach for. Mirroring for light mode is `9 - index`.
const STOP = { 900: 0, 700: 2, 500: 4, 300: 6, 100: 8 } as const

const RECIPE: Record<MeshFamily, { a: number; b: number; c: number }> = {
  // 13535:15189: a 300 haze fading out, a 700 blob, and a 900 blob pulling the
  // field back down where they overlap.
  neutralVariant: { a: STOP[300], b: STOP[700], c: STOP[900] },
  // 13535:15197: the source stop itself as the glow, a 100 highlight, and 900
  // streaks darkening the rest.
  accent: { a: STOP[500], b: STOP[100], c: STOP[900] },
}

export function MeshGradient({ family }: { family: MeshFamily }) {
  const { sourceHex, theme } = useTheme()
  const stops = makeRamps(sourceHex || COVER_SOURCE_HEX)[family].stops
  const light = theme === 'white'
  const pick = (i: number) => stops[light ? 9 - i : i].hex
  const r = RECIPE[family]

  const vars = {
    ['--mesh-base' as string]: pick(STOP[900]),
    ['--mesh-a' as string]: pick(r.a),
    ['--mesh-b' as string]: pick(r.b),
    ['--mesh-c' as string]: pick(r.c),
  }

  return (
    <div
      className={`${styles.mesh} ${styles[family]}`}
      style={vars}
      aria-hidden="true"
    />
  )
}
