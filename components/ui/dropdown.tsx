'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { fieldMessage } from '@/lib/field-message'
import { FieldStatusIcon } from './field-status'
import styles from './dropdown.module.scss'

/**
 * Contract: docs/contracts/dropdown.md (1.0.0)
 *
 * The kit's Dropdown - Default (14032:290635) and - Fluid (14505:302528): a
 * single choice from a list the page draws itself, which a native select
 * cannot. The ARIA select-only combobox: focus stays on the trigger, the
 * active option is aria-activedescendant, and the list is a listbox on the
 * overlay surface. Select stays the native single choice; this is for when the
 * options need the kit's list.
 */

export type DropdownOption = { value: string; label: string; disabled?: boolean }

type DropdownProps = {
  label: string
  options: DropdownOption[]
  value: string | null
  onChange: (value: string) => void
  /** The kit's Prompt text, shown until something is chosen. */
  placeholder?: string
  /** The kit's Size: 32, 40 or 48, the trigger and the list's rows together. */
  size?: 'sm' | 'md' | 'lg'
  /** The kit's Style (Fixed, Inline) and its Fluid set. */
  layout?: 'fixed' | 'inline' | 'fluid'
  helpText?: string
  errorText?: string
  warningText?: string
  disabled?: boolean
  /** The value can be read and not changed; an empty one reads "No option selected". */
  readOnly?: boolean
  id?: string
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'Choose an option',
  size = 'lg',
  layout = 'fixed',
  helpText,
  errorText,
  warningText,
  disabled = false,
  readOnly = false,
  id,
}: DropdownProps) {
  const auto = useId()
  const baseId = id ?? auto
  const labelId = `${baseId}-label`
  const valueId = `${baseId}-value`
  const listId = `${baseId}-list`
  const { errored, warned, tone, messageId, message, describedBy } = fieldMessage(baseId, helpText, errorText, warningText)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const root = useRef<HTMLDivElement>(null)
  const typed = useRef({ text: '', at: 0 })

  const selected = options.findIndex((o) => o.value === value)
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0)
  const step = (from: number, by: 1 | -1) => {
    const at = enabled.indexOf(from)
    if (at < 0) return by === 1 ? enabled[0] : enabled[enabled.length - 1]
    return enabled[Math.min(enabled.length - 1, Math.max(0, at + by))]
  }

  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  // Keep the active option in view as it moves.
  useEffect(() => {
    if (open && active >= 0) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, listId])

  const openList = (at = selected >= 0 ? selected : enabled[0]) => {
    if (disabled || readOnly) return
    setActive(at ?? -1)
    setOpen(true)
  }
  const choose = (i: number) => {
    if (i < 0 || options[i]?.disabled) return
    onChange(options[i].value)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled || readOnly) return
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList(e.key === 'ArrowUp' ? (selected >= 0 ? selected : enabled[enabled.length - 1]) : undefined)
      }
      return
    }
    const moves: Record<string, () => number> = {
      ArrowDown: () => step(active, 1),
      ArrowUp: () => step(active, -1),
      Home: () => enabled[0],
      End: () => enabled[enabled.length - 1],
    }
    if (moves[e.key]) {
      e.preventDefault()
      setActive(moves[e.key]())
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(active)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'Tab') {
      setOpen(false)
    } else if (e.key.length === 1) {
      // Type-ahead: the next option starting with what was typed.
      const now = Date.now()
      typed.current = { text: now - typed.current.at < 600 ? typed.current.text + e.key.toLowerCase() : e.key.toLowerCase(), at: now }
      const t = typed.current.text
      const after = enabled.filter((i) => i > active).concat(enabled.filter((i) => i <= active))
      const hit = after.find((i) => options[i].label.toLowerCase().startsWith(t))
      if (hit !== undefined) setActive(hit)
    }
  }

  const shown = selected >= 0 ? options[selected].label : readOnly ? 'No option selected' : placeholder
  const status = errored || warned

  const trigger = (
    <div
      id={baseId}
      className={[styles.trigger, styles[size], errored ? styles.errored : '', open ? styles.open : ''].join(' ')}
      role="combobox"
      tabIndex={disabled ? -1 : 0}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listId}
      aria-labelledby={`${labelId} ${valueId}`}
      aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
      aria-describedby={describedBy}
      aria-invalid={errored || undefined}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      onClick={() => (open ? setOpen(false) : openList())}
      onKeyDown={onKeyDown}
    >
      {layout === 'fluid' ? (
        <span id={labelId} className={styles.fluidLabel}>
          {label}
        </span>
      ) : null}
      <span className={styles.row}>
        <span id={valueId} className={[styles.value, selected < 0 && !readOnly ? styles.prompt : ''].join(' ')}>
          {shown}
        </span>
        {status ? <FieldStatusIcon className={warned ? `${styles.status} ${styles.warnGlyph}` : styles.status} /> : null}
        <KitIcon name="angle-small-down" className={styles.chevron} />
      </span>
    </div>
  )

  return (
    <div
      ref={root}
      className={[
        styles.dropdown,
        styles[layout],
        disabled ? styles.isDisabled : '',
        readOnly ? styles.isReadOnly : '',
      ].join(' ')}
    >
      {layout === 'fluid' ? null : (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <div className={styles.anchor}>
        {trigger}
        {open ? (
          <ul id={listId} role="listbox" aria-labelledby={labelId} className={[styles.list, styles[size]].join(' ')}>
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === selected}
                aria-disabled={o.disabled || undefined}
                className={[styles.option, i === active ? styles.active : '', i === selected ? styles.selected : ''].join(' ')}
                onPointerEnter={() => !o.disabled && setActive(i)}
                // Keep focus on the trigger: the listbox is never focused itself.
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
              >
                <span className={styles.optionLabel}>{o.label}</span>
                {i === selected ? <KitIcon name="check" className={styles.check} /> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {message ? (
        <span
          id={messageId}
          className={tone === 'error' ? styles.error : tone === 'warning' ? styles.warningText : styles.help}
          role={tone === 'error' ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
