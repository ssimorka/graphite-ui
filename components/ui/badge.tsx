import styles from './badge.module.scss'

/** Contract: docs/contracts/badge.md (2.1.0) */
type BadgeProps = {
  /** Short text, or a number to be capped at `max`. */
  children: string | number
  variant?: 'neutral' | 'primary' | 'danger' | 'warning' | 'success'
  /** Numeric badges cap here rather than overflowing their container. */
  max?: number
}

export function Badge({ children, variant = 'neutral', max = 99 }: BadgeProps) {
  const overflowed = typeof children === 'number' && children > max
  const label = overflowed ? `${max}+` : children

  return (
    <span
      className={`${styles.badge} ${styles[variant]}`}
      // The capped form is what a sighted reader sees; the real count still
      // reaches assistive tech.
      aria-label={overflowed ? String(children) : undefined}
    >
      {label}
    </span>
  )
}
