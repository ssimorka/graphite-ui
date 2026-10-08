'use client'

import { useCallback, useState } from 'react'
import { KitIcon } from '@/components/kit-icon'
import styles from './rolling-dice.module.scss'

/**
 * The kit's dice, which tumbles each time its button is pressed. Surprise me
 * applies at once, so the roll is the feedback that something was dealt.
 *
 * `roll` is a count: each new value remounts the glyph, which restarts the
 * animation even on a press made mid-roll. Zero is the resting dice.
 */
export function RollingDice({ roll, size = 16 }: { roll: number; size?: number }) {
  return (
    <KitIcon
      key={roll}
      name="dice"
      size={size}
      className={roll ? styles.roll : undefined}
      aria-hidden="true"
    />
  )
}

/** The count for RollingDice, and the function that bumps it. */
export function useDiceRoll() {
  const [roll, setRoll] = useState(0)
  const bump = useCallback(() => setRoll((n) => n + 1), [])
  return [roll, bump] as const
}
