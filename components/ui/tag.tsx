import styles from './tag.module.scss'

/** Contract: docs/contracts/tag.md (2.4.0) */
type TagProps = {
  /** Short text, or a number to be capped at `max`. */
  children: string | number
  variant?: 'neutral' | 'primary' | 'danger' | 'warning' | 'success'
  /** Numeric badges cap here rather than overflowing their container. */
  max?: number
}

export function Tag({ children, variant = 'neutral', max = 99 }: TagProps) {
  const overflowed = typeof children === 'number' && children > max

  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {overflowed ? (
        // The capped form is what a sighted reader sees; the real count reaches
        // assistive tech as text. aria-label on a role-less span was skipped by
        // some screen readers, and text is read by all of them.
        <>
          <span aria-hidden="true">{`${max}+`}</span>
          <span className={styles.visuallyHidden}>{children}</span>
        </>
      ) : (
        children
      )}
    </span>
  )
}
