'use client'

import { useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import type { FieldSize, FieldState } from './text-input'
import { fieldMessage } from '@/lib/field-message'
import styles from './text-area.module.scss'

/** Contract: docs/contracts/text-area.md (2.0.0) — inherits Text input's contract. */
type TextAreaProps = {
  /** Generated when omitted, so the label and message can always associate. */
  id?: string
  /** Required, for the same reason it is on Text input: the kit has no
   *  standalone label to pair one with. */
  label: string
  size?: FieldSize
  state?: FieldState
  helpText?: string
  /** Its presence forces the error state. The two cannot be separated. */
  errorText?: string
  required?: boolean
  /**
   * Never `horizontal`, and never `both`: the contract rules them out because
   * a user-widened textarea breaks its layout container.
   */
  resize?: 'vertical' | 'none'
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'style' | 'required'>

export function TextArea({
  id,
  label,
  size = 'md',
  state = 'default',
  helpText,
  errorText,
  required = false,
  resize = 'vertical',
  ...rest
}: TextAreaProps) {
  const auto = useId()
  const fieldId = id ?? auto
  const { errored: hasError, messageId, message, describedBy } = fieldMessage(
    fieldId,
    helpText,
    errorText,
  )

  const resolved: FieldState = hasError ? 'error' : state
  const errored = resolved === 'error' || resolved === 'invalid'

  return (
    <div className={styles.field}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.indicator} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <textarea
        {...rest}
        id={fieldId}
        className={`${styles.textarea} ${styles[size]} ${styles[resize]} ${errored ? styles.errored : ''}`}
        required={required}
        disabled={resolved === 'disabled' || rest.disabled}
        aria-invalid={errored || undefined}
        aria-describedby={describedBy}
      />
      {message ? (
        <span
          id={messageId}
          className={hasError ? styles.error : styles.help}
          role={hasError ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
