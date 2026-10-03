'use client'

import { useId, useState } from 'react'
import type { ChangeEvent, TextareaHTMLAttributes } from 'react'
import type { FieldState } from './text-input'
import { fieldMessage } from '@/lib/field-message'
import { FieldStatusIcon } from './field-status'
import styles from './text-area.module.scss'

/** Contract: docs/contracts/text-area.md (3.0.0) — inherits Text input's contract, except size and Inline. */
type TextAreaProps = {
  /** Generated when omitted, so the label and message can always associate. */
  id?: string
  /** Required, for the same reason it is on Text input: the kit has no
   *  standalone label to pair one with. */
  label: string
  /** The kit's Text area - Default (fixed) or Text area - Fluid. */
  layout?: 'fixed' | 'fluid'
  state?: FieldState
  helpText?: string
  /** Its presence forces the error state. The two cannot be separated. */
  errorText?: string
  /** Its presence forces the warning state, unless an error outranks it. */
  warningText?: string
  /**
   * The kit's Show count, which the kit has on by default: a running "n/max"
   * in the label row, shown whenever maxLength is set.
   */
  showCount?: boolean
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
  layout = 'fixed',
  state = 'default',
  helpText,
  errorText,
  warningText,
  showCount = true,
  required = false,
  resize = 'vertical',
  onChange,
  ...rest
}: TextAreaProps) {
  const auto = useId()
  const fieldId = id ?? auto
  const { errored: hasError, warned, tone, messageId, message, describedBy } = fieldMessage(
    fieldId,
    helpText,
    errorText,
    warningText,
  )
  const [typed, setTyped] = useState(String(rest.defaultValue ?? ''))
  const length = rest.value !== undefined ? String(rest.value).length : typed.length

  const resolved: FieldState = hasError ? 'error' : warned ? 'warning' : state
  const errored = resolved === 'error' || resolved === 'invalid'
  const warning = resolved === 'warning'
  const disabled = resolved === 'disabled' || rest.disabled
  const fluid = layout === 'fluid'

  const labelRow = (
    <span className={styles.labelRow}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.indicator} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {showCount && rest.maxLength !== undefined ? (
        <span className={styles.count} aria-hidden="true">
          {`${length}/${rest.maxLength}`}
        </span>
      ) : null}
    </span>
  )
  const status = errored || warning ? <FieldStatusIcon className={styles.status} /> : null
  const messageEl = message ? (
    <span
      id={messageId}
      className={tone === 'error' ? styles.error : tone === 'warning' ? styles.warningText : styles.help}
      // Error text announces on appearance; help and warning text are static
      // and are reached through aria-describedby instead.
      role={tone === 'error' ? 'alert' : undefined}
    >
      {message}
    </span>
  ) : null

  return (
    <div className={[styles.field, styles[layout], disabled ? styles.isDisabled : ''].join(' ')}>
      {fluid ? null : labelRow}
      <div className={[styles.wrap, styles[resize], errored ? styles.errored : '', warning ? styles.warning : ''].join(' ')}>
        {fluid ? labelRow : null}
        <textarea
          {...rest}
          id={fieldId}
          className={`${styles.textarea} ${status && !fluid ? styles.withStatus : ''}`}
          required={required}
          disabled={disabled}
          aria-invalid={errored || undefined}
          aria-describedby={describedBy}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setTyped(e.target.value)
            onChange?.(e)
          }}
        />
        {fluid ? (
          // Fluid keeps its message inside the box, under a divider, with the
          // status icon at the end of the message row.
          messageEl ? (
            <span className={styles.fluidMessage}>
              {messageEl}
              {status}
            </span>
          ) : null
        ) : (
          status
        )}
      </div>
      {fluid ? null : messageEl}
    </div>
  )
}
