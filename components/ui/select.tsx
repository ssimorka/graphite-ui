'use client'

import type { FieldSize } from './input'
import { Label } from './label'
import styles from './select.module.scss'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

/** Contract: docs/contracts/select.md (1.0.0) */
type SelectProps = {
  id: string
  /** Required by contract. */
  label: string
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
  const errored = state === 'error'

  return (
    <span className={styles.field}>
      <Label htmlFor={id}>{label}</Label>
      <span className={`${styles.wrap} ${styles[size]} ${errored ? styles.errored : ''}`}>
        {/* A native select keeps type-ahead, arrow keys and the platform's own
            menu. Its contract forbids styling that trades those away, and the
            Wave 5 overlay surface is only needed once the menu is custom. */}
        <select
          id={id}
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
