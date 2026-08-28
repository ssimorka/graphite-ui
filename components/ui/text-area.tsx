'use client'

import type { TextareaHTMLAttributes } from 'react'
import type { FieldSize, FieldState } from './text-input'
import styles from './text-area.module.scss'

/** Contract: docs/contracts/text-area.md (1.0.0) — inherits TextInput's contract. */
type TextAreaProps = {
  /** Supplied by Field when wrapped. See TextInput. */
  id?: string
  size?: FieldSize
  state?: FieldState
  /**
   * Never `horizontal`, and never `both`: the contract rules them out because
   * a user-widened textarea breaks its layout container.
   */
  resize?: 'vertical' | 'none'
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'style'>

export function TextArea({
  id,
  size = 'md',
  state = 'default',
  resize = 'vertical',
  ...rest
}: TextAreaProps) {
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
