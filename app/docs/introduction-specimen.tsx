'use client'

import { useMemo } from 'react'
import { makeRamps } from '@/lib/color.js'
import type { RampName } from '@/lib/color.js'
import { useTheme } from '@/components/theme-provider'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import styles from './introduction.module.scss'

/**
 * Every ramp the engine emits for the source in the header, drawn small.
 *
 * The point of the specimen is the claim in the lede: one hex in, the whole
 * palette out. So it reads the ramps straight from the engine (the provider's,
 * or the seed's before the provider has one) and lists them in the engine's own
 * key order rather than a list typed here, so a ninth ramp would appear without
 * an edit. The outlined stop is the one that is literally the source hex.
 */
export function IntroductionSpecimen() {
  const { ramps: live, sourceHex } = useTheme()
  const hex = (sourceHex || COVER_SOURCE_HEX).toUpperCase()
  const ramps = useMemo(() => live ?? makeRamps(hex), [live, hex])
  const names = Object.keys(ramps) as RampName[]

  return (
    <figure className={styles.specimen}>
      <div className={styles.specimenRows}>
        {names.map((name) => (
          <div key={name} className={styles.specimenRow}>
            <span className={styles.specimenName}>{name}</span>
            <div
              className={styles.specimenStops}
              role="img"
              aria-label={`${name} ramp, ${ramps[name].stops.length} stops from ${ramps[name].stops[0].hex} to ${ramps[name].stops[ramps[name].stops.length - 1].hex}`}
            >
              {ramps[name].stops.map((s) => (
                <span
                  key={s.tone}
                  className={`${styles.specimenStop} ${s.source ? styles.specimenSource : ''}`}
                  style={{ background: s.hex }}
                  title={`${name} ${s.tone}: ${s.hex}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption className={styles.specimenCaption}>
        {`Source ${hex}. Change it with the swatch in the header and every row redraws. The outlined stop is the source itself.`}
      </figcaption>
    </figure>
  )
}
