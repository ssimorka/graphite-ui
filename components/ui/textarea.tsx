'use client'

import type { TextareaHTMLAttributes } from 'react'
import type { FieldSize, FieldState } from './input'
import styles from './textarea.module.scss'

/** Contract: docs/contracts/textarea.md (1.0.0) — inherits Input's contract. */
type TextareaProps = {
  /** Supplied by Field when wrapped. See Input. */
  id?: string
  size?: FieldSize
  state?: FieldState
  /**
   * Never `horizontal`, and never `both`: the contract rules them out because
   * a user-widened textarea breaks its layout container.
   */
  resize?: 'vertical' | 'none'
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'style'>

export function Textarea({
  id,
  size = 'md',
  state = 'default',
  resize = 'vertical',
  ...rest
}: TextareaProps) {
  const errored = state === 'error' || state === 'invalid'

  return (
    <textarea
      {...rest}
      id={id}
      className={`${styles.textarea} ${styles[size]} ${styles[resize]} ${errored ? styles.errored : ''}`}
      disabled={state === 'disabled' || rest.disabled}
      aria-invalid={errored || undefined}
    />
  )
}
