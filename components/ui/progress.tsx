import styles from './progress.module.scss'

/** Contract: docs/contracts/progress.md (1.1.0) */
type ProgressProps = {
  /** 0-100. Ignored, and omitted from ARIA, when indeterminate. */
  value?: number
  variant?: 'determinate' | 'indeterminate'
  /**
   * Accessible name. No text is ever painted inside the bar — pair with
   * Typography externally if a percentage needs to be visible.
   */
  label: string
}

const clamp = (n: number) => Math.min(100, Math.max(0, n))

export function Progress({
  value = 0,
  variant = 'determinate',
  label,
}: ProgressProps) {
  const determinate = variant === 'determinate'
  const pct = clamp(value)

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? 100 : undefined}
      // Omitting aria-valuenow is what marks a progressbar as indeterminate.
      aria-valuenow={determinate ? pct : undefined}
    >
      <div
        className={`${styles.fill} ${determinate ? styles.determinate : styles.indeterminate}`}
        style={determinate ? { width: `${pct}%` } : undefined}
      />
    </div>
  )
}
