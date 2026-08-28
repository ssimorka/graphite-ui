'use client'

import { useId } from 'react'
import type { FieldSize } from './text-input'
import { fieldMessage } from '@/lib/field-message'
import styles from './select.module.scss'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

/** Contract: docs/contracts/select.md (2.0.0) */
type SelectProps = {
  /** Generated when omitted, so the label and message can always associate. */
  id?: string
  /** Required. With Field gone there is no wrapper left to supply one. */
  label: string
  /**
   * The tuple shape enforces the contract's two-option minimum at compile
   * time: a Select with one choice is a statement, not a choice.
   */
  options: [SelectOption, SelectOption, ...SelectOption[]]
  value?: string
  size?: FieldSize
  state?: 'default' | 'disabled' | 'error'
  onChange?: (value: string) => void
  name?: string
  helpText?: string
  /** Its presence forces the error state. The two cannot be separated. */
  errorText?: string
}

export function Select({
  id,
  label,
  options,
  value,
  size = 'md',
  state = 'default',
  onChange,
  name,
  helpText,
  errorText,
}: SelectProps) {
  const auto = useId()
  const selectId = id ?? auto
  const { errored: hasError, messageId, message, describedBy } = fieldMessage(
    selectId,
    helpText,
    errorText,
  )

  // Error text and error state resolve from the same value, so neither can be
  // shown without the other. Field used to guarantee this.
  const errored = hasError || state === 'error'

  return (
    <span className={styles.field}>
      <label htmlFor={selectId} className={styles.label}>
        {label}
      </label>
      <span className={`${styles.wrap} ${styles[size]} ${errored ? styles.errored : ''}`}>
        {/* A native select keeps type-ahead, arrow keys and the platform's own
            menu. Its contract forbids styling that trades those away, and the
            Wave 5 overlay surface is only needed once the menu is custom. */}
        <select
          id={selectId}
          name={name}
          className={styles.select}
          value={value}
          disabled={state === 'disabled'}
          aria-invalid={errored || undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true" />
      </span>
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
