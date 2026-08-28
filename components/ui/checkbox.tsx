'use client'

import { useEffect, useId, useRef } from 'react'
import { fieldMessage } from '@/lib/field-message'
import styles from './checkbox.module.scss'

/** Contract: docs/contracts/checkbox.md (2.0.0) */
type CheckboxProps = {
  /** Generated when omitted, so the label and message can always associate. */
  id?: string
  /**
   * Required. The contract has no bare control, and with Field gone there is
   * no wrapper left to supply one.
   */
  label: string
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  name?: string
  helpText?: string
  /** Its presence renders the message as an error. */
  errorText?: string
}

export function Checkbox({
  id,
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  name,
  helpText,
  errorText,
}: CheckboxProps) {
  const auto = useId()
  const inputId = id ?? auto
  const { errored, messageId, message, describedBy } = fieldMessage(
    inputId,
    helpText,
    errorText,
  )

  const ref = useRef<HTMLInputElement>(null)

  // `indeterminate` is a DOM property with no HTML attribute, so React cannot
  // set it declaratively — it has to be written to the node.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <span className={styles.row}>
      <span className={styles.control}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          name={name}
          className={styles.native}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          aria-describedby={describedBy}
        />
        <span className={styles.box} aria-hidden="true">
          {/* Indeterminate is its own glyph, not a recolored check: the
              contract requires it to read differently from both states. */}
          <span className={indeterminate ? styles.dash : styles.check} />
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
