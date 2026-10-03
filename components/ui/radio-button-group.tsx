'use client'

import { useId } from 'react'
import { fieldMessage } from '@/lib/field-message'
import { FieldStatusIcon } from './field-status'
import styles from './radio-button-group.module.scss'

export type RadioOption = {
  value: string
  label: string
  disabled?: boolean
}

/** Contract: docs/contracts/radio-button-group.md (2.1.0) */
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
  /**
   * The kit's Position: which side of its label the radio sits on. Left (the
   * default) draws the radio then the label; right draws the label first.
   */
  controlPosition?: 'left' | 'right'
  /** Group-level; individual options can also opt out via `option.disabled`. */
  disabled?: boolean
  /**
   * The kit's Read-only: the answer can be reached and read, not changed. The
   * radios stay focusable and the group is announced as read-only.
   */
  readOnly?: boolean
  onChange?: (value: string) => void
  helpText?: string
  /** Its presence renders the message as an error. */
  errorText?: string
  /** Its presence renders the message as a warning, unless an error outranks it. */
  warningText?: string
}

export function RadioButtonGroup({
  name,
  label,
  options,
  value,
  orientation = 'vertical',
  controlPosition = 'left',
  disabled = false,
  readOnly = false,
  onChange,
  helpText,
  errorText,
  warningText,
}: RadioButtonGroupProps) {
  const auto = useId()
  const { errored, warned, tone, messageId, message, describedBy } = fieldMessage(
    auto,
    helpText,
    errorText,
    warningText,
  )
  const legendId = `${auto}-legend`

  return (
    <fieldset
      className={[
        styles.group,
        errored ? styles.errored : '',
        warned ? styles.warning : '',
        readOnly ? styles.readOnly : '',
      ].join(' ')}
      disabled={disabled}
      // radiogroup rather than fieldset's implicit group, because it is the
      // role aria-readonly is defined on.
      role="radiogroup"
      aria-labelledby={legendId}
      aria-readonly={readOnly || undefined}
      aria-invalid={errored || undefined}
      aria-describedby={describedBy}
    >
      <legend id={legendId} className={styles.legend}>{label}</legend>
      <div className={`${styles.options} ${styles[orientation]}`}>
        {options.map((option) => {
          const id = `${name}-${option.value}`
          return (
            <span
              key={option.value}
              className={`${styles.row} ${controlPosition === 'right' ? styles.right : ''}`}
            >
              <span className={styles.control}>
                {/* Native radios sharing a name enforce single selection in
                    the browser, so exclusivity is not left to the caller.
                    They are always controlled, so read-only only has to stop
                    reporting the change for the selection to stay put. */}
                <input
                  type="radio"
                  id={id}
                  name={name}
                  className={styles.native}
                  value={option.value}
                  checked={value === option.value}
                  disabled={option.disabled}
                  onChange={() => {
                    if (!readOnly) onChange?.(option.value)
                  }}
                />
                <span className={styles.dot} aria-hidden="true" />
              </span>
              <label htmlFor={id} className={styles.optionLabel}>
                {option.label}
              </label>
            </span>
          )
        })}
      </div>
      {message ? (
        <span
          id={messageId}
          className={tone === 'error' ? styles.error : tone === 'warning' ? styles.warningText : styles.help}
          role={tone === 'error' ? 'alert' : undefined}
        >
          {tone === 'help' ? null : <FieldStatusIcon className={styles.status} />}
          <span>{message}</span>
        </span>
      ) : null}
    </fieldset>
  )
}
