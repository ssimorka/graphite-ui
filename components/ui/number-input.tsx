'use client'

import { useState } from 'react'
import type { ComponentProps } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { Button } from './button'
import { TextInput } from './text-input'
import styles from './number-input.module.scss'

/**
 * Contract: docs/contracts/number-input.md (1.0.0)
 *
 * The kit's Number input - Default (19893:290998) and - Fluid (19893:291117):
 * the governed Text input as a native number field, its browser spinner
 * hidden, with the kit's stepper at the end: a decrement and an increment
 * Button, ghost and icon-only, square at the field's height, each after a
 * 1 × 20 divider.
 */

type NumberInputProps = Omit<
  ComponentProps<typeof TextInput>,
  'type' | 'trailing' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
> & {
  value: number | null
  onChange: (value: number | null) => void
  min?: number
  max?: number
  step?: number
}

const STEPPER_SIZE = { sm: 'icon-sm', md: 'icon', lg: 'icon-lg' } as const

/** Steps from a value and clamps it, without floating-point dust (0.1 + 0.2). */
function stepFrom(value: number, by: number, min?: number, max?: number) {
  const places = Math.max(0, ...[value, by].map((n) => (String(n).split('.')[1] ?? '').length))
  let next = Number((value + by).toFixed(places))
  if (min !== undefined) next = Math.max(min, next)
  if (max !== undefined) next = Math.min(max, next)
  return next
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  size = 'md',
  layout = 'fixed',
  disabled,
  readOnly,
  ...rest
}: NumberInputProps) {
  // What is typed stays as typed until it is a number; the caller checks the range.
  const [draft, setDraft] = useState<string | null>(null)
  const off = disabled || rest.state === 'disabled' || readOnly
  const current = value ?? 0

  const stepper = (
    <span className={styles.stepper}>
      <span className={styles.divider} aria-hidden="true" />
      <Button
        variant="ghost"
        size={layout === 'fluid' ? 'icon' : STEPPER_SIZE[size]}
        aria-label="Decrement"
        disabled={off || (min !== undefined && current <= min)}
        onClick={() => {
          setDraft(null)
          onChange(stepFrom(current, -step, min, max))
        }}
      >
        <KitIcon name="minus-small" />
      </Button>
      <span className={styles.divider} aria-hidden="true" />
      <Button
        variant="ghost"
        size={layout === 'fluid' ? 'icon' : STEPPER_SIZE[size]}
        aria-label="Increment"
        disabled={off || (max !== undefined && current >= max)}
        onClick={() => {
          setDraft(null)
          onChange(stepFrom(current, step, min, max))
        }}
      >
        <KitIcon name="plus-small" />
      </Button>
    </span>
  )

  return (
    <div className={styles.number}>
      <TextInput
        {...rest}
        type="number"
        inputMode="decimal"
        size={size}
        layout={layout}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
        value={draft ?? (value === null ? '' : String(value))}
        onChange={(e) => {
          setDraft(e.target.value)
          if (e.target.value !== '' && Number.isFinite(Number(e.target.value))) onChange(Number(e.target.value))
        }}
        onBlur={(e) => {
          if (e.target.value === '') onChange(null)
          setDraft(null)
          rest.onBlur?.(e)
        }}
        trailing={stepper}
      />
    </div>
  )
}
