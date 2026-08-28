'use client'

import { useId } from 'react'
import { fieldMessage } from '@/lib/field-message'
import styles from './radio-button-group.module.scss'

export type RadioOption = {
  value: string
  label: string
  disabled?: boolean
}

/** Contract: docs/contracts/radio-button-group.md (2.0.0) */
type RadioButtonGroupProps = {
  /** Namespaces the option ids and binds the radios into one group. */
  name: string
  /**
   * The group label, rendered as a legend. Required: option labels alone do
   * not tell a screen reader what the group is asking.
   */
  label: string
  options: RadioOption[]
  value?: string
  orientation?: 'vertical' | 'horizontal'
  /** Group-level; individual options can also opt out via `option.disabled`. */
  disabled?: boolean
  onChange?: (value: string) => void
  helpText?: string
  /** Its presence renders the message as an error. */
  errorText?: string
}

export function RadioButtonGroup({
  name,
  label,
  options,
  value,
  orientation = 'vertical',
  disabled = false,
  onChange,
  helpText,
  errorText,
}: RadioButtonGroupProps) {
  const auto = useId()
  const { errored, messageId, message, describedBy } = fieldMessage(
    auto,
    helpText,
    errorText,
  )

  return (
    <fieldset
      className={styles.group}
      disabled={disabled}
      aria-describedby={describedBy}
    >
      <legend className={styles.legend}>{label}</legend>
      <div className={`${styles.options} ${styles[orientation]}`}>
        {options.map((option) => {
          const id = `${name}-${option.value}`
          return (
            <span key={option.value} className={styles.row}>
              <span className={styles.control}>
                {/* Native radios sharing a name enforce single selection in
                    the browser, so exclusivity is not left to the caller. */}
                <input
                  type="radio"
                  id={id}
                  name={name}
                  className={styles.native}
                  value={option.value}
                  checked={value === option.value}
                  disabled={option.disabled}
                  onChange={() => onChange?.(option.value)}
                />
                <span className={styles.dot} aria-hidden="true" />
              </span>
              <label htmlFor={id} className={styles.label}>
                {option.label}
              </label>
            </span>
          )
        })}
      </div>
      {message ? (
        <span
          id={messageId}
          className={errored ? styles.error : styles.help}
          role={errored ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </fieldset>
  )
}
