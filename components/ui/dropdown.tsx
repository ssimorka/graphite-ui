'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { fieldMessage } from '@/lib/field-message'
import { FieldStatusIcon } from './field-status'
import styles from './dropdown.module.scss'

/**
 * Contract: docs/contracts/dropdown.md (1.1.0)
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

/**
 * The kit's private _Dropdown menu list and list item, shared by every kind:
 * rows at the trigger's height, the rule 16 in at each top, hover and the
 * keyboard's row on surface-variant, the chosen row on primary-container with
 * the check. Focus never moves into it; the trigger owns it.
 */
function OptionList({
  id,
  labelledBy,
  size,
  options,
  indexes,
  active,
  selected,
  onActive,
  onChoose,
}: {
  id: string
  labelledBy: string
  size: 'sm' | 'md' | 'lg'
  options: DropdownOption[]
  /** Which options to show, in order: all of them, or what a filter left. */
  indexes: number[]
  active: number
  selected: number
  onActive: (i: number) => void
  onChoose: (i: number) => void
}) {
  return (
    <ul id={id} role="listbox" aria-labelledby={labelledBy} className={[styles.list, styles[size]].join(' ')}>
      {indexes.map((i) => {
        const o = options[i]
        return (
          <li
            key={o.value}
            id={`${id}-${i}`}
            role="option"
            aria-selected={i === selected}
            aria-disabled={o.disabled || undefined}
            className={[styles.option, i === active ? styles.active : '', i === selected ? styles.selected : ''].join(' ')}
            onPointerEnter={() => !o.disabled && onActive(i)}
            // Keep focus on the trigger: the listbox is never focused itself.
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => onChoose(i)}
          >
            <span className={styles.optionLabel}>{o.label}</span>
            {i === selected ? <KitIcon name="check" className={styles.check} /> : null}
          </li>
        )
      })}
      {indexes.length === 0 ? <li className={styles.empty} role="presentation">No matches</li> : null}
    </ul>
  )
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
          <OptionList
            id={listId}
            labelledBy={labelId}
            size={size}
            options={options}
            indexes={options.map((_, i) => i)}
            active={active}
            selected={selected}
            onActive={setActive}
            onChoose={choose}
          />
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

/**
 * The kit's Dropdown - Combo box - Default (14032:290976) and - Fluid
 * (14505:304219): a single choice found by typing. The editable ARIA combobox
 * with list autocomplete: the input filters the list as the reader types, the
 * active option is its aria-activedescendant, and a chosen value can be
 * cleared. Only a listed option can be the value; leaving the field puts the
 * chosen option's label back.
 */
export function ComboBox({
  label,
  options,
  value,
  onChange,
  placeholder = 'Filter...',
  size = 'lg',
  layout = 'fixed',
  helpText,
  errorText,
  warningText,
  disabled = false,
  readOnly = false,
  id,
}: Omit<DropdownProps, 'onChange'> & { onChange: (value: string | null) => void }) {
  const auto = useId()
  const baseId = id ?? auto
  const labelId = `${baseId}-label`
  const listId = `${baseId}-list`
  const { errored, warned, tone, messageId, message, describedBy } = fieldMessage(baseId, helpText, errorText, warningText)
  const selected = options.findIndex((o) => o.value === value)
  const [text, setText] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const shownText = text ?? (selected >= 0 ? options[selected].label : '')
  const query = (text ?? '').trim().toLowerCase()
  const visible = options.map((_, i) => i).filter((i) => !query || options[i].label.toLowerCase().includes(query))
  const enabled = visible.filter((i) => !options[i].disabled)

  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  })

  useEffect(() => {
    if (open && active >= 0) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, listId])

  const close = () => {
    setOpen(false)
    setText(null)
  }
  const openList = () => {
    if (disabled || readOnly) return
    setActive(selected >= 0 && enabled.includes(selected) ? selected : (enabled[0] ?? -1))
    setOpen(true)
  }
  const choose = (i: number) => {
    if (i < 0 || options[i]?.disabled) return
    onChange(options[i].value)
    close()
  }
  const step = (by: 1 | -1) => {
    const at = enabled.indexOf(active)
    if (at < 0) return by === 1 ? enabled[0] : enabled[enabled.length - 1]
    return enabled[Math.min(enabled.length - 1, Math.max(0, at + by))]
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) openList()
      else setActive(step(e.key === 'ArrowDown' ? 1 : -1) ?? -1)
    } else if (e.key === 'Enter' && open) {
      e.preventDefault()
      choose(active)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      // Escape closes an open list; on a closed one it clears what was typed.
      if (open) close()
      else setText(null)
    }
  }

  const status = errored || warned

  return (
    <div
      ref={root}
      className={[styles.dropdown, styles[layout], disabled ? styles.isDisabled : '', readOnly ? styles.isReadOnly : ''].join(' ')}
    >
      {layout === 'fluid' ? null : (
        <label id={labelId} htmlFor={baseId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.anchor}>
        <div
          className={[styles.trigger, styles.combo, styles[size], errored ? styles.errored : '', open ? styles.open : ''].join(' ')}
          onClick={() => input.current?.focus()}
        >
          {layout === 'fluid' ? (
            <label id={labelId} htmlFor={baseId} className={styles.fluidLabel}>
              {label}
            </label>
          ) : null}
          <span className={styles.row}>
            <input
              ref={input}
              id={baseId}
              className={styles.input}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
              aria-describedby={describedBy}
              aria-invalid={errored || undefined}
              autoComplete="off"
              placeholder={readOnly && selected < 0 ? 'No option selected' : placeholder}
              disabled={disabled}
              readOnly={readOnly}
              value={shownText}
              onChange={(e) => {
                setText(e.target.value)
                const q = e.target.value.trim().toLowerCase()
                const first = options.findIndex((o) => !o.disabled && (!q || o.label.toLowerCase().includes(q)))
                setActive(first)
                if (!open) setOpen(true)
              }}
              onClick={() => (open ? undefined : openList())}
              onKeyDown={onKeyDown}
            />
            {status ? <FieldStatusIcon className={warned ? `${styles.status} ${styles.warnGlyph}` : styles.status} /> : null}
            {selected >= 0 && !disabled && !readOnly ? (
              <>
                <button
                  type="button"
                  className={styles.clear}
                  aria-label="Clear selected item"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(null)
                    setText(null)
                    input.current?.focus()
                  }}
                >
                  <KitIcon name="cross-small" />
                </button>
                <span className={styles.divider} aria-hidden="true" />
              </>
            ) : null}
            <button
              type="button"
              className={styles.toggle}
              tabIndex={-1}
              aria-label={open ? 'Close list' : 'Open list'}
              disabled={disabled || readOnly}
              onClick={(e) => {
                e.stopPropagation()
                if (open) close()
                else openList()
                input.current?.focus()
              }}
            >
              <KitIcon name="angle-small-down" className={styles.chevron} />
            </button>
          </span>
        </div>
        {open ? (
          <OptionList
            id={listId}
            labelledBy={labelId}
            size={size}
            options={options}
            indexes={visible}
            active={active}
            selected={selected}
            onActive={setActive}
            onChoose={choose}
          />
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
