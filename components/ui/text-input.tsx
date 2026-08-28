'use client'

import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { fieldMessage } from '@/lib/field-message'
import styles from './text-input.module.scss'

export type FieldState = 'default' | 'disabled' | 'error' | 'invalid'
export type FieldSize = 'sm' | 'md' | 'lg'

/** Contract: docs/contracts/text-input.md (2.0.0) */
type TextInputProps = {
  /** Generated when omitted, so the label and message can always associate. */
  id?: string
  /**
   * Required. The kit builds the label into Text input as a `Label text`
   * property rather than shipping a standalone label, so there is no shape in
   * which this control exists without one.
   */
  label: string
  size?: FieldSize
  /**
   * `focus` is in the contract's state list but is not a prop: focus is a real
   * browser state, so it lives in `:focus-visible` rather than being driven by
   * the caller. Setting it by hand would let the visual and actual focus
   * disagree.
   */
  state?: FieldState
  /** Supporting copy. Suppressed while errorText is present. */
  helpText?: string
  /** Its presence forces the error state. The two cannot be separated. */
  errorText?: string
  required?: boolean
  leading?: ReactNode
  trailing?: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'id' | 'required'>

export function TextInput({
  id,
  label,
  size = 'md',
  state = 'default',
  helpText,
  errorText,
  required = false,
  leading,
  trailing,
  ...rest
}: TextInputProps) {
  const auto = useId()
  const inputId = id ?? auto
  const { errored: hasError, messageId, message, describedBy } = fieldMessage(
    inputId,
    helpText,
    errorText,
  )

  // Error text and error state resolve from the same value, which is what stops
  // a caller showing one without the other. This was Field's rule; it survives
  // Field.
  const resolved: FieldState = hasError ? 'error' : state
  const errored = resolved === 'error' || resolved === 'invalid'

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.indicator} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <span className={`${styles.wrap} ${styles[size]} ${errored ? styles.errored : ''}`}>
        {leading ? <span className={styles.affix}>{leading}</span> : null}
        <input
          {...rest}
          id={inputId}
          className={styles.input}
          required={required}
          disabled={resolved === 'disabled' || rest.disabled}
          aria-invalid={errored || undefined}
          aria-describedby={describedBy}
        />
        {trailing ? <span className={styles.affix}>{trailing}</span> : null}
      </span>
      {message ? (
        <span
          id={messageId}
          className={hasError ? styles.error : styles.help}
          // Error text announces on appearance; help text is static and is
          // reached through aria-describedby instead.
          role={hasError ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
