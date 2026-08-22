'use client'

import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './input.module.scss'

export type FieldState = 'default' | 'disabled' | 'error' | 'invalid'
export type FieldSize = 'sm' | 'md' | 'lg'

/** Contract: docs/contracts/input.md (1.3.0) */
type InputProps = {
  /**
   * Supplied by Field when wrapped, which is the composition the contract
   * expects. Pass it explicitly only when using Input on its own — and then a
   * Label still has to associate with it.
   */
  id?: string
  size?: FieldSize
  /**
   * `focus` is in the contract's state list but is not a prop: focus is a real
   * browser state, so it lives in `:focus-visible` rather than being driven by
   * the caller. Setting it by hand would let the visual and actual focus
   * disagree.
   */
  state?: FieldState
  leading?: ReactNode
  trailing?: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'id'>

export function Input({
  id,
  size = 'md',
  state = 'default',
  leading,
  trailing,
  ...rest
}: InputProps) {
  const errored = state === 'error' || state === 'invalid'

  return (
    <span className={`${styles.wrap} ${styles[size]} ${errored ? styles.errored : ''}`}>
      {leading ? <span className={styles.affix}>{leading}</span> : null}
      <input
        {...rest}
        id={id}
        className={styles.input}
        disabled={state === 'disabled' || rest.disabled}
        aria-invalid={errored || undefined}
      />
      {trailing ? <span className={styles.affix}>{trailing}</span> : null}
    </span>
  )
}
