import type { ReactNode } from 'react'
import styles from './card-shell.module.scss'

/**
 * The frame every example on the Create page sits in: a surface field with a
 * subtle border, 24px inside, 16px between its parts (Graphite UI Site 13561:10102
 * and every "Preview" instance beside it).
 *
 * Examples are compositions of governed components with the page's own layout
 * around them. They are demo chrome, not system components, so nothing in
 * `components/create/cards` has a contract and none should be imported outside
 * the Create page.
 *
 * `id` is the anchor the card can be reached by (`/create#card-palette`).
 */
export function CardShell({
  id,
  children,
  className,
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  return (
    <article
      id={`card-${id}`}
      className={`${styles.card}${className ? ` ${className}` : ''}`}
    >
      {children}
    </article>
  )
}

/** The Title/3 plus Body/3 head most examples open with. */
export function CardHeader({
  title,
  description,
}: {
  title: ReactNode
  description?: ReactNode
}) {
  return (
    <header className={styles.header}>
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
    </header>
  )
}
