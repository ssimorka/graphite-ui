'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { KitIcon } from '@/components/kit-icon'
import styles from './day-night.module.scss'

/**
 * The theme toggle's glyph as a sky: the kit's sun and moon ride opposite ends
 * of a wheel pivoting below the button, and each theme change turns it half a
 * revolution, always the same way. The body leaving sets to the right as the
 * other rises from the left, so going back and forth reads as days passing
 * rather than a swap. The button clips the wheel; only the risen body shows.
 *
 * Shows the current theme, as the kit's header does (fi-rs-moon on dark).
 */
export function DayNight({ dark }: { dark: boolean }) {
  // Half-turns so far. Odd is night. It only ever counts up, so every change
  // turns the wheel forward.
  const [turns, setTurns] = useState(dark ? 1 : 0)
  // The stored theme is restored just after mount; that should land, not
  // spin. So turns only animate once they pass the count the wheel had
  // settled on by then.
  const [settled, setSettled] = useState<number | null>(null)
  const turnsNow = useRef(turns)
  turnsNow.current = turns
  const mounted = useRef(false)

  useEffect(() => {
    if ((turns % 2 === 1) !== dark) setTurns((t) => t + 1)
  }, [dark, turns])

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true
    const id = window.setTimeout(() => setSettled(turnsNow.current), 300)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <span className={styles.sky} aria-hidden="true">
      {/* A keyframe animation rather than a transition: the provider switches
          transitions off for the frame the theme changes in (is-retheming),
          which is the very frame this angle changes. The key restarts it on
          every turn, even one made mid-turn. */}
      <span
        key={turns}
        className={`${styles.wheel} ${settled !== null && turns > settled ? styles.moving : ''}`}
        style={{ '--from': `${(turns - 1) * 180}deg`, '--to': `${turns * 180}deg` } as CSSProperties}
      >
        <span className={`${styles.body} ${styles.sun}`}>
          <KitIcon name="sun" size={16} />
        </span>
        <span className={`${styles.body} ${styles.moon}`}>
          <KitIcon name="moon" size={16} />
        </span>
      </span>
    </span>
  )
}
