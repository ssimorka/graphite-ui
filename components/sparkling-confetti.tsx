'use client'

import { KitIcon } from '@/components/kit-icon'
import styles from './sparkling-confetti.module.scss'

/**
 * The kit's confetti, which sparkles each time Regenerate is pressed and while
 * its button is hovered: the three stars twinkle in turn and the dots shimmer
 * across. Regenerate applies at once, so like the dice the sparkle is the
 * feedback that something was dealt.
 *
 * `play` is a count, as RollingDice's `roll` is (useDiceRoll supplies it): each
 * new value remounts the glyph, which restarts the animation mid-play. Zero
 * rests.
 */
export function SparklingConfetti({ play, size = 16 }: { play: number; size?: number }) {
  return (
    <KitIcon
      key={play}
      name="confetti"
      size={size}
      className={`${styles.confetti} ${play ? styles.play : ''}`}
      aria-hidden="true"
    />
  )
}
