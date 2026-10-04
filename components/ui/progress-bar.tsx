import { useId } from 'react'
import styles from './progress-bar.module.scss'

/** Contract: docs/contracts/progress-bar.md (2.0.0) */
type ProgressBarProps = {
  /** 0-100. Ignored, and omitted from ARIA, when indeterminate. */
  value?: number
  variant?: 'determinate' | 'indeterminate'
  /**
   * The task, painted above the track (beside it when inline) and the bar's
   * accessible name. Never painted inside the track.
   */
  label: string
  /** Keeps the label as the accessible name and drops it from view. */
  hideLabel?: boolean
  /** The kit's Helper text, under the track. Not drawn inline. */
  helperText?: string
  /** The kit's Size: Small is a 4px track, Big 8px. */
  size?: 'sm' | 'lg'
  /** The kit's Alignment: label above, beside, or above and indented 16. */
  alignment?: 'default' | 'inline' | 'indent'
  /**
   * The kit's State. A finished task fills the track: success or danger,
   * with the kit's status icon beside the label and its message under it.
   */
  status?: 'active' | 'success' | 'error'
  /** The message under a successful bar, in place of the helper. */
  successText?: string
  /** The message under a failed bar, in place of the helper. */
  errorText?: string
}

const clamp = (n: number) => Math.min(100, Math.max(0, n))

// The kit's Status icon set (Succeeded, Failed) at 16: a filled circle with
// the check or the cross cut out of it.
const STATUS_PATHS = {
  success:
    'M8 1A7 7 0 1 0 8 15A7 7 0 1 0 8 1ZM7 10.8L4.5 8.3L5.3 7.5L7 9.2L10.71 5.5L11.5 6.29L7 10.8Z',
  error:
    'M8 0A8 8 0 1 0 8 16A8 8 0 1 0 8 0ZM11.14 10.2L10.2 11.14L8 8.94L5.8 11.14L4.86 10.2L7.06 8L4.86 5.8L5.8 4.86L8 7.06L10.2 4.86L11.14 5.8L8.94 8L11.14 10.2Z',
}

export function ProgressBar({
  value = 0,
  variant = 'determinate',
  label,
  hideLabel = false,
  helperText,
  size = 'sm',
  alignment = 'default',
  status = 'active',
  successText,
  errorText,
}: ProgressBarProps) {
  const id = useId()
  const finished = status !== 'active'
  // A finished bar is full, whatever it was given: the kit's Success and
  // Error both fill the track.
  const determinate = finished || variant === 'determinate'
  const pct = finished ? 100 : clamp(value)
  const inline = alignment === 'inline'
  const message =
    status === 'success' ? successText : status === 'error' ? errorText : helperText
  const showMessage = Boolean(message) && !inline

  return (
    <div
      className={[styles.bar, styles[alignment], styles[size], styles[status]].join(' ')}
    >
      <div className={hideLabel ? styles.hidden : styles.labelRow}>
        <span id={`${id}-label`} className={styles.label}>
          {label}
        </span>
        {finished ? (
          <svg className={styles.status} width={16} height={16} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d={STATUS_PATHS[status]} fillRule="evenodd" />
          </svg>
        ) : null}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-labelledby={`${id}-label`}
        aria-describedby={showMessage ? `${id}-message` : undefined}
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
      {showMessage ? (
        // Success and error are outcomes worth announcing when they arrive;
        // helper text is static and reached through aria-describedby.
        <span id={`${id}-message`} className={styles.message} role={finished ? 'status' : undefined}>
          {message}
        </span>
      ) : null}
    </div>
  )
}
