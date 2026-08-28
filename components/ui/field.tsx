'use client'

import { cloneElement } from 'react'
import type { ReactElement } from 'react'
import type { FieldState } from './text-input'
import { Label } from './label'
import styles from './field.module.scss'

/** Contract: docs/contracts/field.md (1.2.0) */
type FieldProps = {
  id: string
  label: string
  /**
   * Any input-family atom. Field always owns the label *content*; where that
   * content is rendered depends on the atom.
   *
   * TextInput and Textarea take a label above the control, so Field renders one.
   * Checkbox, Switch, Select and Radio Group place theirs in their own shape
   * and mark themselves with a static `ownsLabel`; for those Field passes the
   * text down rather than rendering a second label.
   *
   * Either way exactly one label exists and Field decides what it says, which
   * is what "the only place Label + input + error text compose" has to mean
   * once the atoms have different shapes.
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
  // Atoms that render their own label say so on the component itself, so
  // Field does not have to keep a list of which ones do.
  const ownsLabel =
    typeof children.type !== 'string' &&
    (children.type as { ownsLabel?: boolean }).ownsLabel === true

  const errored = Boolean(errorText)
  const resolvedState: FieldState = errored ? 'error' : state
  const messageId = `${id}-message`
  const message = errorText ?? helpText

  const control = cloneElement(children, {
    id,
    state: resolvedState,
    required,
    'aria-describedby': message ? messageId : undefined,
    // The label text goes to the atom when the atom is the one rendering it.
    ...(ownsLabel ? { label } : {}),
  })

  return (
    <div className={styles.field}>
      {ownsLabel ? null : (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
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
