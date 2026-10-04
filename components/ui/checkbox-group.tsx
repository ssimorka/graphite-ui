'use client'

import { useId } from 'react'
import { fieldMessage } from '@/lib/field-message'
import { Checkbox } from './checkbox'
import { FieldStatusIcon } from './field-status'
import styles from './checkbox-group.module.scss'

/**
 * Contract: docs/contracts/checkbox-group.md (1.0.0)
 *
 * The kit's Checkbox group (11506:27535): a labelled set of the governed
 * Checkbox, vertical or across, with one message for the group. The kit draws
 * the group label inside its first Checkbox; here it is the fieldset's legend,
 * so it belongs to the group and names it.
 */

export type CheckboxOption = {
  value: string
  label: string
  disabled?: boolean
}

type CheckboxGroupProps = {
  /** Required: the options' labels alone do not say what the group asks. */
  label: string
  options: CheckboxOption[]
  /** The checked options' values. */
  value: string[]
  onChange: (value: string[]) => void
  /** The kit's Horizontal. Vertical rows are 8 apart; across, 16. */
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  /** The kit's Read-only, passed to every box. */
  readOnly?: boolean
  helpText?: string
  /** Its presence rings every box in danger and renders the message as an error. */
  errorText?: string
  /** Its presence renders the message as a warning, unless an error outranks it. */
  warningText?: string
  name?: string
  id?: string
}

export function CheckboxGroup({
  label,
  options,
  value,
  onChange,
  orientation = 'vertical',
  disabled = false,
  readOnly = false,
  helpText,
  errorText,
  warningText,
  name,
  id,
}: CheckboxGroupProps) {
  const auto = useId()
  const baseId = id ?? auto
  const { errored, tone, messageId, message, describedBy } = fieldMessage(baseId, helpText, errorText, warningText)
  const legendId = `${baseId}-legend`

  return (
    <fieldset
      className={styles.group}
      disabled={disabled}
      aria-labelledby={legendId}
      aria-describedby={describedBy}
    >
      <legend id={legendId} className={styles.legend}>
        {label}
      </legend>
      <div className={`${styles.options} ${styles[orientation]}`}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            id={`${baseId}-${option.value}`}
            name={name}
            label={option.label}
            checked={value.includes(option.value)}
            disabled={disabled || option.disabled}
            readOnly={readOnly}
            invalid={errored}
            onChange={(checked) =>
              onChange(checked ? [...value, option.value] : value.filter((v) => v !== option.value))
            }
          />
        ))}
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
