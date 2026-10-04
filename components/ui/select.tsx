'use client'

import { useId } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { FieldLayout, FieldSize } from './text-input'
import { fieldMessage } from '@/lib/field-message'
import { KitIcon } from '@/components/kit-icon'
import { FieldStatusIcon } from './field-status'
import styles from './select.module.scss'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

/** Contract: docs/contracts/select.md (2.4.1) */
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
  /** The kit's Style axis (Default, Inline) and its Select - Fluid set. */
  layout?: FieldLayout
  state?: 'default' | 'disabled' | 'error' | 'warning'
  /**
   * The kit's Read-only. A native select has no readonly attribute, so this
   * keeps it focusable and announced as read-only while refusing to open or
   * change: the value can be reached and read, not edited.
   */
  readOnly?: boolean
  /**
   * Keeps the label as the select's accessible name and drops it from view,
   * for the kit's bare Select menu (Pagination's page picker draws only the
   * value). The label is still required.
   */
  hideLabel?: boolean
  onChange?: (value: string) => void
  name?: string
  helpText?: string
  /** Its presence forces the error state. The two cannot be separated. */
  errorText?: string
  /** Its presence forces the warning state, unless an error outranks it. */
  warningText?: string
}

// The keys that open a native select or step its value.
const OPENING_KEYS = new Set([' ', 'Enter', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'])

export function Select({
  id,
  label,
  options,
  value,
  size = 'md',
  layout = 'fixed',
  state = 'default',
  readOnly = false,
  hideLabel = false,
  onChange,
  name,
  helpText,
  errorText,
  warningText,
}: SelectProps) {
  const auto = useId()
  const selectId = id ?? auto
  const { errored: hasError, warned, tone, messageId, message, describedBy } = fieldMessage(
    selectId,
    helpText,
    errorText,
    warningText,
  )

  // Error text and error state resolve from the same value, so neither can be
  // shown without the other. Field used to guarantee this. Warning likewise.
  const errored = hasError || state === 'error'
  const warning = !errored && (warned || state === 'warning')
  const disabled = state === 'disabled'
  const fluid = layout === 'fluid'

  const labelEl = (
    <label htmlFor={selectId} className={hideLabel ? styles.hiddenLabel : styles.label}>
      {label}
    </label>
  )

  return (
    <span className={[styles.field, styles[layout], disabled ? styles.isDisabled : ''].join(' ')}>
      {fluid ? null : labelEl}
      <span
        className={[
          styles.wrap,
          fluid ? '' : styles[size],
          errored ? styles.errored : '',
          warning ? styles.warning : '',
          readOnly ? styles.readOnly : '',
        ].join(' ')}
      >
        {fluid ? labelEl : null}
        {/* A native select keeps type-ahead, arrow keys and the platform's own
            menu, which is also what the kit's Open state draws. Its contract
            forbids styling that trades those away. */}
        <select
          id={selectId}
          name={name}
          className={`${styles.select} ${errored || warning ? styles.withStatus : ''}`}
          value={value}
          disabled={disabled}
          aria-invalid={errored || undefined}
          aria-readonly={readOnly || undefined}
          aria-describedby={describedBy}
          onChange={(e) => {
            if (!readOnly) onChange?.(e.target.value)
          }}
          onMouseDown={readOnly ? (e: MouseEvent) => e.preventDefault() : undefined}
          onKeyDown={readOnly ? (e: KeyboardEvent) => { if (OPENING_KEYS.has(e.key)) e.preventDefault() } : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.icons} aria-hidden="true">
          {errored || warning ? <FieldStatusIcon className={styles.status} /> : null}
          <KitIcon name="angle-small-down" size={16} className={styles.chevron} set="regular" />
        </span>
      </span>
      {message ? (
        <span
          id={messageId}
          className={tone === 'error' ? styles.error : tone === 'warning' ? styles.warningText : styles.help}
          role={tone === 'error' ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </span>
  )
}
