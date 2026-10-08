import type { CSSProperties, ReactNode } from 'react'
import { KitIcon } from './kit-icon'
import { Button } from './ui/button'
import styles from './doc-blocks.module.scss'

// Docs-site chrome, from the kit's "Site" pages (Graphite UI Site, node
// 11814:17). Server components: nothing here needs state. Shared by every docs
// page, so none of it knows what the page is about.

/** One heading plus an optional supporting line: the head of every block. */
export function SectionHeading({
  id,
  title,
  lede,
}: {
  id?: string
  title: string
  lede?: ReactNode
}) {
  return (
    <div className={styles.sectionHeading}>
      <h2 id={id} className={styles.sectionTitle}>
        {title}
      </h2>
      {lede ? <p className={styles.sectionLede}>{lede}</p> : null}
    </div>
  )
}

type BadgeTone = 'success' | 'neutral' | 'primary'

/** Square, outlined status chip. Not Tag: the kit draws these as site chrome. */
export function StatusBadge({
  tone,
  children,
}: {
  tone: BadgeTone
  children: string
}) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}

/** A numbered step: the 20px marker, a title, prose, then whatever follows. */
export function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: ReactNode
}) {
  return (
    <div className={styles.step}>
      <span className={styles.marker} aria-hidden="true">
        {n}
      </span>
      <div className={styles.stepBody}>
        <h3 className={styles.stepTitle}>
          <span className={styles.srOnly}>Step {n}: </span>
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}

/** The rule a reader should leave the section with. */
export function Callout({
  title,
  tone = 'primary',
  children,
}: {
  title: string
  /** `warning` marks a known gap the reader should not "fix". */
  tone?: 'primary' | 'warning'
  /** One node per paragraph, so a callout can carry more than one. */
  children: ReactNode
}) {
  return (
    <aside className={`${styles.callout} ${tone === 'warning' ? styles.calloutWarning : ''}`}>
      <p className={styles.calloutTitle}>{title}</p>
      {Array.isArray(children) ? (
        children.map((c, i) => (
          <p key={i} className={styles.calloutBody}>
            {c}
          </p>
        ))
      ) : (
        <p className={styles.calloutBody}>{children}</p>
      )}
    </aside>
  )
}

/**
 * `columns` is the count abreast from 672 up; three unless a caller asks.
 * `condensed` tightens the cards round a 32px corner action.
 */
export function NextCards({
  columns,
  condensed,
  children,
}: {
  columns?: number
  condensed?: boolean
  children: ReactNode
}) {
  return (
    <ul
      className={
        condensed ? `${styles.nextCards} ${styles.condensed}` : styles.nextCards
      }
      style={
        columns
          ? ({ '--next-columns': columns } as CSSProperties)
          : undefined
      }
    >
      {children}
    </ul>
  )
}

export function NextCard({
  href,
  title,
  children,
}: {
  href: string
  title: string
  children: string
}) {
  return (
    <li className={styles.nextCard}>
      {/* The title is the link, and its overlay makes the whole card the
          target. The corner block is the filled action the search panel and
          the Create bar wear, as an arrow only: nine cards saying "Read" was
          one word nine times. It is for the eye: it sits under the overlay,
          so it is not a second link to the same place. */}
      <a className={styles.nextLink} href={href}>
        {title}
      </a>
      <p className={styles.nextBody}>{children}</p>
      <Button asChild variant="primary" size="icon-lg" className={styles.nextCta}>
        <span aria-hidden="true">
          <KitIcon name="arrow-small-right" />
        </span>
      </Button>
    </li>
  )
}
