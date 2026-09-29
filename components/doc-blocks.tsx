import type { ReactNode } from 'react'
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
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <aside className={styles.callout}>
      <p className={styles.calloutTitle}>{title}</p>
      <p className={styles.calloutBody}>{children}</p>
    </aside>
  )
}

export function NextCards({ children }: { children: ReactNode }) {
  return <ul className={styles.nextCards}>{children}</ul>
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
      <a className={styles.nextLink} href={href}>
        {title}
        <span aria-hidden="true">{'  →'}</span>
      </a>
      <p className={styles.nextBody}>{children}</p>
    </li>
  )
}
