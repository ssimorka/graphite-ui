import type { ReactNode } from 'react'
import styles from './contained-list.module.scss'

/** Contract: docs/contracts/contained-list.md (1.3.0) */
type ContainedListProps = {
  /** Typography by convention; the row does not impose a variant on it. */
  title: ReactNode
  /** An icon, Tag, or other short marker. Named Avatar until #97 removed it. */
  leading?: ReactNode
  description?: ReactNode
  /**
   * One control cluster, never several. When a row needs more than one action
   * the contract sends you to Dropdown Menu (Wave 5) in this slot rather than
   * letting buttons stack up.
   */
  trailing?: ReactNode
  density?: 'compact' | 'default'
  /**
   * Visual only: the hover tone-step and a pointer. The row takes no role,
   * focus or click handler, because it has no onClick path to give one to. The
   * caller supplies the link or button that answers the click.
   */
  interactive?: boolean
}

export function ContainedList({
  title,
  leading,
  description,
  trailing,
  density = 'default',
  interactive = false,
}: ContainedListProps) {
  return (
    <div
      className={`${styles.item} ${styles[density]} ${interactive ? styles.interactive : ''}`}
    >
      {leading ? <span className={styles.leading}>{leading}</span> : null}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description ? (
          <span className={styles.description}>{description}</span>
        ) : null}
      </span>
      {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
    </div>
  )
}
