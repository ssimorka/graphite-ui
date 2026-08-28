import styles from './tag.module.scss'

/** Contract: docs/contracts/tag.md (2.2.0) */
type TagProps = {
  /** Short text, or a number to be capped at `max`. */
  children: string | number
  variant?: 'neutral' | 'primary' | 'danger' | 'warning' | 'success'
  /** Numeric badges cap here rather than overflowing their container. */
  max?: number
}

export function Tag({ children, variant = 'neutral', max = 99 }: TagProps) {
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
