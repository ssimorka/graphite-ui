'use client'

import { useId } from 'react'
import { fieldMessage } from '@/lib/field-message'
import styles from './toggle.module.scss'

/** Contract: docs/contracts/toggle.md (2.0.0) */
type ToggleProps = {
  /** Generated when omitted, so the label and message can always associate. */
  id?: string
  /**
   * Required. The contract has no unlabelled control, and with Field gone
   * there is no wrapper left to supply one.
   *
   * Names the setting being controlled ("Notifications"), never the state
   * ("On"/"Off") — the switch position already communicates that. Only for
   * changes that reverse immediately; anything else is a Button.
   */
  label: string
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  name?: string
  helpText?: string
  /** Its presence renders the message as an error. */
  errorText?: string
}

export function Toggle({
  id,
  label,
  checked = false,
  disabled = false,
  onChange,
  name,
  helpText,
  errorText,
}: ToggleProps) {
  const auto = useId()
  const inputId = id ?? auto
  const { errored, messageId, message, describedBy } = fieldMessage(
    inputId,
    helpText,
    errorText,
  )

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
          aria-describedby={describedBy}
        />
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
      </span>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      {message ? (
        <span
          id={messageId}
          className={errored ? styles.error : styles.help}
          role={errored ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </span>
  )
}
