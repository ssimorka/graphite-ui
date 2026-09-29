'use client'

import { useMemo } from 'react'
import { makeRamps } from '@/lib/color.js'
import type { RampName } from '@/lib/color.js'
import { useTheme } from '@/components/theme-provider'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { RampRow, Toast, useCopy } from '@/components/studio'
import { StatusBadge } from '@/components/doc-blocks'
import styles from './color-page.module.scss'

/** The hex the engine is resolving right now, upper-cased as the kit writes it. */
function useSource() {
  const { sourceHex } = useTheme()
  return (sourceHex || COVER_SOURCE_HEX).toUpperCase()
}

/**
 * The first badge in the page header. It follows the header's source control,
 * so the page says which colour it is showing instead of always saying the seed.
 */
export function SourceBadge() {
  return <StatusBadge tone="primary">{`Source ${useSource()}`}</StatusBadge>
}

const SECTIONS: { ramp: RampName; id: string; title: string }[] = [
  { ramp: 'accent', id: 'accent', title: 'Accent' },
  { ramp: 'secondary', id: 'secondary', title: 'Secondary' },
  { ramp: 'neutral', id: 'neutral', title: 'Neutral' },
  { ramp: 'neutralVariant', id: 'neutral-variant', title: 'Neutral variant' },
]

/**
 * The four ramps, live. Each swatch is what the engine resolves from the source
 * in the header, so changing it repaints the page: it is the tokens rather than
 * a picture of them. The kit draws the same thing bound to its Graphite
 * Primitives variables, which hold these values at the seeded source (the
 * comparison below the ramps says exactly where they part).
 *
 * The strip, weights, source marker and copy-to-clipboard are `RampRow`, the
 * home page's; only the section headings and the scroll wording are this
 * page's.
 */
export function RampSet() {
  const hex = useSource()
  const ramps = useMemo(() => makeRamps(hex), [hex])
  const { copiedKey, toast, copy } = useCopy()

  return (
    <div className={styles.ramps}>
      {SECTIONS.map(({ ramp, id, title }) => (
        <section key={id} id={id} className={styles.ramp} aria-label={`${title} ramp`}>
          <RampRow
            name={ramp}
            ramp={ramps[ramp]}
            copiedKey={copiedKey}
            onCopy={copy}
            scrollHint="scrolls horizontally  →"
          />
        </section>
      ))}
      <p className={styles.hint}>
        Select any swatch to copy its hex. The outlined stop is where your source
        color landed.
      </p>
      <Toast message={toast} />
    </div>
  )
}
