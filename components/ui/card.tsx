'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import styles from './card.module.scss'

// Presence of this context means we are already inside a Card.
const InsideCard = createContext(false)

/** Contract: docs/contracts/card.md (1.2.0) */
type CardProps = {
  body: ReactNode
  header?: ReactNode
  /**
   * Typically holds Button. Per the Button contract's "one primary action per
   * group" rule, a footer may not carry two primary buttons — that one cannot
   * be enforced here until Button lands in this set.
   */
  footer?: ReactNode
  density?: 'compact' | 'default' | 'spacious'
}

export function Card({ body, header, footer, density = 'default' }: CardProps) {
  const nested = useContext(InsideCard)

  // The prohibition, enforced rather than described. Pages prerender, so a
  // nested Card fails the build instead of shipping — the same posture the
  // drift check takes. Use Separator for grouping inside a Card.
  if (nested) {
    throw new Error(
      'Card: nested Cards are prohibited (docs/contracts/card.md). ' +
        'Use Separator to group content inside a Card.',
    )
  }

  return (
    <InsideCard.Provider value={true}>
      <section className={`${styles.card} ${styles[density]}`}>
        {header ? <div className={styles.header}>{header}</div> : null}
        <div className={styles.body}>{body}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </section>
    </InsideCard.Provider>
  )
}
