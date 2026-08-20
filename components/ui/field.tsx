'use client'

import { cloneElement } from 'react'
import type { ReactElement } from 'react'
import type { FieldState } from './input'
import { Label } from './label'
import styles from './field.module.scss'

/** Contract: docs/contracts/field.md (1.1.0) */
type FieldProps = {
  id: string
  label: string
  /**
   * One input-family atom. Field owns the label, so this should be an atom
   * that does not render its own — Input or Textarea today.
   *
   * Checkbox, Switch, Select and Radio Group each carry a required label of
   * their own per their contracts, which collides with Field's required Label
   * slot. That conflict is a contract question, not something to paper over
   * here, so it is tracked rather than silently resolved.
   */
  children: ReactElement<Record<string, unknown>>
  helpText?: string
  /** Its presence forces the child into `error`. The two cannot be separated. */
  errorText?: string
  required?: boolean
  state?: FieldState
}

export function Field({
  id,
  label,
  children,
  helpText,
  errorText,
  required = false,
  state = 'default',
}: FieldProps) {
  // The prohibition made structural: error text and error state are derived
  // from the same value, so no caller can show one without the other.
  const errored = Boolean(errorText)
  const resolvedState: FieldState = errored ? 'error' : state
  const messageId = `${id}-message`
  const message = errorText ?? helpText

  const control = cloneElement(children, {
    id,
    state: resolvedState,
    required,
    'aria-describedby': message ? messageId : undefined,
  })

  return (
    <div className={styles.field}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {control}
      {message ? (
        <span
          id={messageId}
          className={errored ? styles.error : styles.help}
          // Error text announces on appearance; help text is static and is
          // reached through aria-describedby instead.
          role={errored ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
