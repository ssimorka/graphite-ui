import type { ReactNode } from 'react'
import styles from './label.module.scss'

/** Contract: docs/contracts/label.md (1.1.0) */
type LabelProps = {
  /**
   * Id of the one form control this labels. Required by contract: a Label
   * always associates with exactly one control and never floats free.
   */
  htmlFor: string
  children: ReactNode
  /** Inherit from the paired input where possible rather than setting by hand. */
  size?: 'sm' | 'md' | 'lg'
  /** Shows the required-field indicator. The control still carries `required`. */
  required?: boolean
}

export function Label({
  htmlFor,
  children,
  size = 'md',
  required = false,
}: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`${styles.label} ${styles[size]}`}>
      {children}
      {required ? (
        // Decorative: the control's own `required` is what assistive tech reads.
        <span className={styles.indicator} aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  )
}
