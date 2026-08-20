'use client'

import { useEffect, useId, useRef } from 'react'
import { Label } from './label'
import styles from './checkbox.module.scss'

/** Contract: docs/contracts/checkbox.md (1.1.0) */
type CheckboxProps = {
  /** Supplied by Field when wrapped. Required when used on its own. */
  id?: string
  /**
   * Supplied by Field when wrapped. Required otherwise — Checkbox throws without
   * one, because the contract has no bare control. Optional in the types only
   * so Field can inject it; the guard below is what actually enforces it.
   */
  label?: string
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  name?: string
}

export function Checkbox({
  id,
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  name,
}: CheckboxProps) {
  const auto = useId()
  const inputId = id ?? auto
  if (!label) {
    throw new Error(
      'Checkbox: a label is required — a bare checkbox is prohibited ' +
        '(docs/contracts/checkbox.md). Wrap it in a Field or pass label.',
    )
  }

  const ref = useRef<HTMLInputElement>(null)

  // `indeterminate` is a DOM property with no HTML attribute, so React cannot
  // set it declaratively — it has to be written to the node.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
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
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className={styles.box} aria-hidden="true">
          {/* Indeterminate is its own glyph, not a recolored check: the
              contract requires it to read differently from both states. */}
          <span className={indeterminate ? styles.dash : styles.check} />
        </span>
      </span>
      <Label htmlFor={inputId}>{label}</Label>
    </span>
  )
}


// Field reads this to know the label belongs here rather than above the
// control: Checkbox places its own, because its label sits beside the control
// rather than over it. See docs/contracts/field.md.
Checkbox.ownsLabel = true as const
