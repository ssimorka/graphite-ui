'use client'

import { useEffect, useRef } from 'react'
import { Label } from './label'
import styles from './checkbox.module.scss'

/** Contract: docs/contracts/checkbox.md (1.1.0) */
type CheckboxProps = {
  id: string
  /** Required. The contract has no bare checkbox: one is always paired. */
  label: string
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
          id={id}
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
      <Label htmlFor={id}>{label}</Label>
    </span>
  )
}
