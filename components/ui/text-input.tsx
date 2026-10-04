'use client'

import { useId, useState } from 'react'
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import { fieldMessage } from '@/lib/field-message'
import { FieldStatusIcon } from './field-status'
import styles from './text-input.module.scss'

export type FieldState = 'default' | 'disabled' | 'error' | 'invalid' | 'warning'
export type FieldSize = 'sm' | 'md' | 'lg'
/** The kit's Style axis (Fixed, Inline) and its second set, Fluid. */
export type FieldLayout = 'fixed' | 'inline' | 'fluid'

/** Contract: docs/contracts/text-input.md (2.3.1) */
type TextInputProps = {
  /** Generated when omitted, so the label and message can always associate. */
  id?: string
  /**
   * Required. The kit builds the label into Text input as a `Label text`
   * property rather than shipping a standalone label, so there is no shape in
   * which this control exists without one.
   */
  label: string
  /**
   * Keeps the label as the accessible name but hides it from view, for a field
   * the kit draws bare (Slider's value inputs, #269). Fixed layout only.
   */
  hideLabel?: boolean
  size?: FieldSize
  /**
   * Fixed puts the label above the field; Inline beside it, with the message
   * to the field's right; Fluid inside a 64px box. Fluid has one height, so
   * `size` does not apply to it.
   */
  layout?: FieldLayout
  /**
   * `focus` is in the contract's state list but is not a prop: focus is a real
   * browser state, so it lives in `:focus-visible` rather than being driven by
   * the caller. Setting it by hand would let the visual and actual focus
   * disagree.
   */
  state?: FieldState
  /** Supporting copy. Suppressed while errorText or warningText is present. */
  helpText?: string
  /** Its presence forces the error state. The two cannot be separated. */
  errorText?: string
  /** Its presence forces the warning state, unless an error outranks it. */
  warningText?: string
  /** The kit's Show count: a running "n/max" in the label row. Needs maxLength. */
  showCount?: boolean
  required?: boolean
  leading?: ReactNode
  trailing?: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'id' | 'required'>

export function TextInput({
  id,
  label,
  hideLabel = false,
  size = 'md',
  layout = 'fixed',
  state = 'default',
  helpText,
  errorText,
  warningText,
  showCount = false,
  required = false,
  leading,
  trailing,
  onChange,
  ...rest
}: TextInputProps) {
  const auto = useId()
  const inputId = id ?? auto
  const { errored: hasError, warned, tone, messageId, message, describedBy } = fieldMessage(
    inputId,
    helpText,
    errorText,
    warningText,
  )
  // Uncontrolled inputs have no value to read, so the count tracks typing
  // itself; a controlled value wins when there is one.
  const [typed, setTyped] = useState(String(rest.defaultValue ?? ''))
  const length = rest.value !== undefined ? String(rest.value).length : typed.length

  // Error text and error state resolve from the same value, which is what stops
  // a caller showing one without the other. This was Field's rule; it survives
  // Field. Warning works the same way, outranked by an error.
  const resolved: FieldState = hasError ? 'error' : warned ? 'warning' : state
  const errored = resolved === 'error' || resolved === 'invalid'
  const warning = resolved === 'warning'
  const disabled = resolved === 'disabled' || rest.disabled

  const labelEl = (
    <label htmlFor={inputId} className={hideLabel && layout !== 'fluid' ? styles.hiddenLabel : styles.label}>
      {label}
      {required ? (
        <span className={styles.indicator} aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  )
  const count =
    showCount && rest.maxLength !== undefined ? (
      <span className={styles.count} aria-hidden="true">
        {`${length}/${rest.maxLength}`}
      </span>
    ) : null

  return (
    <div
      className={[styles.field, styles[layout], disabled ? styles.isDisabled : ''].join(' ')}
    >
      {layout === 'fluid' ? null : count ? (
        <span className={styles.labelRow}>
          {labelEl}
          {count}
        </span>
      ) : (
        labelEl
      )}
      <span
        className={[
          styles.wrap,
          layout === 'fluid' ? '' : styles[size],
          errored ? styles.errored : '',
          warning ? styles.warning : '',
        ].join(' ')}
      >
        {layout === 'fluid' ? (
          <span className={styles.fluidLabel}>
            {labelEl}
            {count}
          </span>
        ) : null}
        <span className={styles.row}>
          {leading ? <span className={styles.affix}>{leading}</span> : null}
          <input
            {...rest}
            id={inputId}
            className={styles.input}
            required={required}
            disabled={disabled}
            aria-invalid={errored || undefined}
            aria-describedby={[describedBy, rest['aria-describedby']].filter(Boolean).join(' ') || undefined}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTyped(e.target.value)
              onChange?.(e)
            }}
          />
          {trailing ? <span className={styles.affix}>{trailing}</span> : null}
          {errored || warning ? <FieldStatusIcon className={styles.status} /> : null}
        </span>
      </span>
      {message ? (
        <span
          id={messageId}
          className={tone === 'error' ? styles.error : tone === 'warning' ? styles.warningText : styles.help}
          // Error text announces on appearance; help and warning text are
          // static and are reached through aria-describedby instead.
          role={tone === 'error' ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
