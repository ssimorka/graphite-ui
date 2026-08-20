'use client'

import { Label } from './label'
import styles from './radio-group.module.scss'

export type RadioOption = {
  value: string
  label: string
  disabled?: boolean
}

/** Contract: docs/contracts/radio-group.md (1.1.0) */
type RadioGroupProps = {
  /** Namespaces the option ids and binds the radios into one group. */
  name: string
  /**
   * Required. Option labels alone do not tell a screen reader what the group
   * is asking, so the contract forbids rendering without one.
   */
  legend: string
  options: RadioOption[]
  value?: string
  orientation?: 'vertical' | 'horizontal'
  /** Group-level; individual options can also opt out via `option.disabled`. */
  disabled?: boolean
  onChange?: (value: string) => void
}

export function RadioGroup({
  name,
  legend,
  options,
  value,
  orientation = 'vertical',
  disabled = false,
  onChange,
}: RadioGroupProps) {
  return (
    <fieldset className={styles.group} disabled={disabled}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={`${styles.options} ${styles[orientation]}`}>
        {options.map((option) => {
          const id = `${name}-${option.value}`
          return (
            <span key={option.value} className={styles.row}>
              <span className={styles.control}>
                {/* Native radios sharing a name enforce single selection in
                    the browser, so exclusivity is not left to the caller. */}
                <input
                  type="radio"
                  id={id}
                  name={name}
                  className={styles.native}
                  value={option.value}
                  checked={value === option.value}
                  disabled={option.disabled}
                  onChange={() => onChange?.(option.value)}
                />
                <span className={styles.dot} aria-hidden="true" />
              </span>
              <Label htmlFor={id}>{option.label}</Label>
            </span>
          )
        })}
      </div>
    </fieldset>
  )
}
