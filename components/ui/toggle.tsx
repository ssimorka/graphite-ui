'use client'

import { useId } from 'react'
import { fieldMessage } from '@/lib/field-message'
import { KitIcon } from '@/components/kit-icon'
import styles from './toggle.module.scss'

/** Contract: docs/contracts/toggle.md (3.0.0) */
type ToggleProps = {
  /** Generated when omitted, so the label and message can always associate. */
  id?: string
  /**
   * Required. The contract has no unlabelled control, and with Field gone
   * there is no wrapper left to supply one.
   *
   * Names the setting being controlled ("Notifications"), never the state
   * ("On"/"Off") — the value text beside the switch says that. Only for
   * changes that reverse immediately; anything else is a Button.
   */
  label: string
  checked?: boolean
  disabled?: boolean
  /**
   * The kit's Read-only: the setting can be reached and read, not changed.
   * The switch stays focusable and is announced as read-only.
   */
  readOnly?: boolean
  /** The kit's Size: Default is 48 by 24, Small 32 by 16. */
  size?: 'default' | 'sm'
  /**
   * The kit's Toggle only: a bare switch. The label is still required and
   * still names it; it is hidden from view, not from assistive tech.
   */
  hideLabel?: boolean
  /** The kit's Show value: the state as text beside the switch. On by default, as the kit has it. */
  showValue?: boolean
  /** The value text. Decorative: the switch already announces its state. */
  valueText?: { on: string; off: string }
  onChange?: (checked: boolean) => void
  name?: string
  helpText?: string
  /** Its presence renders the message as an error. */
  errorText?: string
}

export function Toggle({
  id,
  label,
  checked = false,
  disabled = false,
  readOnly = false,
  size = 'default',
  hideLabel = false,
  showValue = true,
  valueText = { on: 'On', off: 'Off' },
  onChange,
  name,
  helpText,
  errorText,
}: ToggleProps) {
  const auto = useId()
  const inputId = id ?? auto
  const { errored, messageId, message, describedBy } = fieldMessage(
    inputId,
    helpText,
    errorText,
  )

  // The kit's stack: the label above, then the switch with its value text
  // beside it, then the message. Toggle only drops the label from view and
  // the value with it.
  return (
    <span
      className={[
        styles.field,
        styles[size],
        errored ? styles.errored : '',
        disabled ? styles.isDisabled : '',
        readOnly ? styles.readOnly : '',
      ].join(' ')}
    >
      <label htmlFor={inputId} className={hideLabel ? styles.hidden : styles.label}>
        {label}
      </label>
      <span className={styles.row}>
        <span className={styles.control}>
          <input
            type="checkbox"
            role="switch"
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
          <span className={styles.track} aria-hidden="true">
            <span className={styles.thumb}>
              {/* The Small thumb carries the kit's check when on. */}
              {size === 'sm' && checked ? <KitIcon name="check" size={6} className={styles.check} /> : null}
            </span>
          </span>
        </span>
        {showValue && !hideLabel ? (
          <span className={styles.value} aria-hidden="true">
            {checked ? valueText.on : valueText.off}
          </span>
        ) : null}
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
