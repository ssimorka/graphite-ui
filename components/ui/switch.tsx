'use client'

import { Label } from './label'
import styles from './switch.module.scss'

/** Contract: docs/contracts/switch.md (1.1.0) */
type SwitchProps = {
  id: string
  /**
   * Names the setting being controlled ("Notifications"), never the state
   * ("On"/"Off") — the switch position already communicates that.
   *
   * Only for changes that take effect immediately and reverse just as fast.
   * Anything needing confirmation, or that cannot be undone, is a Button.
   */
  label: string
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  name?: string
}

export function Switch({
  id,
  label,
  checked = false,
  disabled = false,
  onChange,
  name,
}: SwitchProps) {
  return (
    <span className={styles.row}>
      <span className={styles.control}>
        <input
          type="checkbox"
          role="switch"
          id={id}
          name={name}
          className={styles.native}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
      </span>
      <Label htmlFor={id}>{label}</Label>
    </span>
  )
}
