'use client'

import { useEffect, useId, useRef } from 'react'
import { fieldMessage } from '@/lib/field-message'
import { FieldStatusIcon } from './field-status'
import styles from './checkbox.module.scss'

/** Contract: docs/contracts/checkbox.md (3.1.0) */
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
  /**
   * The kit's Read-only. Native checkboxes ignore `readonly`, so this keeps
   * the box focusable and announced as read-only and never reports a change.
   */
  readOnly?: boolean
  /** The kit's Indented: the row steps in 28, one box and its gap. */
  indented?: boolean
  onChange?: (checked: boolean) => void
  name?: string
  helpText?: string
  /** Its presence renders the message as an error. */
  errorText?: string
  /**
   * The error state without a message of its own, for a box whose group
   * carries the message (Checkbox group, #273).
   */
  invalid?: boolean
  /** Its presence renders the message as a warning, unless an error outranks it. */
  warningText?: string
}

// The kit's three Carbon glyphs on its 20px frame: a 15px box at 2.5 with a
// 1.25 corner. Filled glyphs knock the tick and the dash out of the box with
// evenodd, so the hole shows whatever the box sits on, as the kit's does.
const BOX = 'M3.75 2.5H16.25A1.25 1.25 0 0 1 17.5 3.75V16.25A1.25 1.25 0 0 1 16.25 17.5H3.75A1.25 1.25 0 0 1 2.5 16.25V3.75A1.25 1.25 0 0 1 3.75 2.5Z'
const RING = `${BOX}M3.75 3.75V16.25H16.25V3.75Z`
const TICK = 'M8.75 13.4375L5.625 10.3392L6.61925 9.375L8.75 11.466L13.3804 6.875L14.3753 7.86075Z'
const DASH = 'M6.25 8.75H13.75V11.25H6.25Z'

export function Checkbox({
  id,
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  readOnly = false,
  indented = false,
  onChange,
  name,
  helpText,
  errorText,
  warningText,
  invalid = false,
}: CheckboxProps) {
  const auto = useId()
  const inputId = id ?? auto
  const { errored: hasErrorText, tone, messageId, message, describedBy } = fieldMessage(
    inputId,
    helpText,
    errorText,
    warningText,
  )

  const errored = hasErrorText || invalid
  const ref = useRef<HTMLInputElement>(null)

  // `indeterminate` is a DOM property with no HTML attribute, so React cannot
  // set it declaratively — it has to be written to the node.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  // Indeterminate is its own glyph, not a recolored check: the contract
  // requires it to read differently from both states.
  const mark = indeterminate ? DASH : checked ? TICK : null

  // The message sits under the row rather than inside it, which is where the
  // kit draws Helper / Error text. Inside the no-wrap row it landed beside the
  // label and pushed long copy off the side.
  return (
    <span
      className={[
        styles.field,
        errored ? styles.errored : '',
        readOnly ? styles.readOnly : '',
        disabled ? styles.isDisabled : '',
        indented ? styles.indented : '',
      ].join(' ')}
    >
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
            onChange={(e) => {
              if (!readOnly) onChange?.(e.target.checked)
            }}
            aria-invalid={errored || undefined}
            aria-readonly={readOnly || undefined}
            aria-describedby={describedBy}
          />
          <svg className={styles.glyph} width={20} height={20} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            {mark === null ? (
              <path data-part="ring" d={RING} fillRule="evenodd" />
            ) : readOnly ? (
              // Read-only draws the empty box with the mark on it, not the fill.
              <>
                <path data-part="ring" d={RING} fillRule="evenodd" />
                <path data-part="mark" d={mark} />
              </>
            ) : (
              <>
                <path data-part="fill" d={`${BOX}${mark}`} fillRule="evenodd" />
                {/* Invalid keeps the fill and lays the danger ring over it. */}
                {errored ? <path data-part="ring" d={RING} fillRule="evenodd" /> : null}
              </>
            )}
          </svg>
        </span>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      </span>
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
    </span>
  )
}
