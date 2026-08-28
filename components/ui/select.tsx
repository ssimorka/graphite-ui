'use client'

import { useId } from 'react'
import type { FieldSize } from './text-input'
import { Label } from './label'
import styles from './select.module.scss'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

/** Contract: docs/contracts/select.md (1.2.0) */
type SelectProps = {
  /** Supplied by Field when wrapped. Required when used on its own. */
  id?: string
  /**
   * Supplied by Field when wrapped. Required otherwise — Select throws without
   * one. Optional in the types only so Field can inject it.
   */
  label?: string
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
}: SelectProps) {
  const auto = useId()
  const selectId = id ?? auto
  if (!label) {
    throw new Error(
      'Select: a label is required (docs/contracts/select.md). ' +
        'Wrap it in a Field or pass label.',
    )
  }

  const errored = state === 'error'

  return (
    <span className={styles.field}>
      <Label htmlFor={selectId}>{label}</Label>
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
    </span>
  )
}


// Field reads this to know the label belongs here rather than above the
// control: Select places its own, because its label sits beside the control
// rather than over it. See docs/contracts/field.md.
Select.ownsLabel = true as const
