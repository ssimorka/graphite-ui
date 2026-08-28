'use client'

import { useId } from 'react'
import { Label } from './label'
import styles from './toggle.module.scss'

/** Contract: docs/contracts/toggle.md (1.3.0) */
type ToggleProps = {
  /** Supplied by Field when wrapped. Required when used on its own. */
  id?: string
  /**
   * Supplied by Field when wrapped. Required otherwise — Toggle throws without
   * one, because the contract has no unlabelled control. Optional in the types
   * only so Field can inject it; the guard is what enforces it.
   *
   * Names the setting being controlled ("Notifications"), never the state
   * ("On"/"Off") — the switch position already communicates that. Only for
   * changes that reverse immediately; anything else is a Button.
   */
  label?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  name?: string
}

export function Toggle({
  id,
  label,
  checked = false,
  disabled = false,
  onChange,
  name,
}: ToggleProps) {
  const auto = useId()
  const inputId = id ?? auto
  if (!label) {
    throw new Error(
      'Toggle: a label is required (docs/contracts/switch.md). ' +
        'Wrap it in a Field or pass label.',
    )
  }

  return (
    <span className={styles.row}>
      <span className={styles.control}>
        <input
          type="checkbox"
          role="switch"
          id={inputId}
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
      <Label htmlFor={inputId}>{label}</Label>
    </span>
  )
}


// Field reads this to know the label belongs here rather than above the
// control: Toggle places its own, because its label sits beside the control
// rather than over it. See docs/contracts/field.md.
Toggle.ownsLabel = true as const
