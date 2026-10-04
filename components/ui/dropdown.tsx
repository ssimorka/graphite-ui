'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { KitIcon } from '@/components/kit-icon'
import { fieldMessage } from '@/lib/field-message'
import { CheckboxGlyph } from './checkbox'
import { FieldStatusIcon } from './field-status'
import { Tag } from './tag'
import styles from './dropdown.module.scss'

/**
 * Contract: docs/contracts/dropdown.md (1.2.2)
 *
 * The kit's Dropdown - Default (14032:290635) and - Fluid (14505:302528): a
 * single choice from a list the page draws itself. The ARIA select-only
 * combobox: focus stays on the trigger, the active option is
 * aria-activedescendant, and the list is a listbox on the overlay surface.
 * Select (select.md 3.0.0) opens the same list through useSelectOnly below;
 * the two differ in their triggers, and Dropdown carries the other kinds.
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

/** The keyboard's index for the "All" row, which sits above the options. */
const ALL = -2

/**
 * The kit's private _Dropdown menu list and list item, shared by every kind:
 * rows at the trigger's height, the rule 16 in at each top, hover and the
 * keyboard's row on surface-variant, a chosen row on primary-container. Single
 * choice trails the check; multi-select leads with the checkbox glyph and may
 * open with the kit's parent checkbox, "All". Focus never moves into it; the
 * trigger owns it.
 */
export function OptionList({
  id,
  labelledBy,
  size,
  options,
  indexes,
  active,
  isSelected,
  multi = false,
  all,
  onActive,
  onChoose,
  anchor,
  listRef,
}: {
  id: string
  labelledBy: string
  size: 'sm' | 'md' | 'lg'
  options: DropdownOption[]
  /** Which options to show, in order: all of them, or what a filter left. */
  indexes: number[]
  active: number
  isSelected: (i: number) => boolean
  multi?: boolean
  /** The parent checkbox row, for a multi-select that offers it. */
  all?: { state: 'checked' | 'indeterminate' | 'unchecked'; onToggle: () => void }
  onActive: (i: number) => void
  onChoose: (i: number) => void
  /**
   * The trigger's box. Given one, the list is drawn on <body> against it, so no
   * scrolling or clipping container it sits in can cut it off.
   */
  anchor?: RefObject<HTMLElement | null>
  listRef?: RefObject<HTMLUListElement | null>
}) {
  const place = useFloating(anchor, listRef)
  const list = (
    <ul
      ref={listRef}
      id={id}
      role="listbox"
      aria-labelledby={labelledBy}
      aria-multiselectable={multi || undefined}
      className={[styles.list, styles[size], anchor ? styles.floating : ''].join(' ')}
      style={place}
    >
      {all ? (
        <li
          id={`${id}-all`}
          role="option"
          aria-selected={all.state === 'checked'}
          aria-checked={all.state === 'indeterminate' ? 'mixed' : all.state === 'checked'}
          className={[styles.option, styles.allRow, active === ALL ? styles.active : ''].join(' ')}
          onPointerEnter={() => onActive(ALL)}
          onPointerDown={(e) => e.preventDefault()}
          onClick={all.onToggle}
        >
          <CheckboxGlyph state={all.state} className={styles.box} />
          <span className={styles.optionLabel}>All</span>
        </li>
      ) : null}
      {indexes.map((i) => {
        const o = options[i]
        const on = isSelected(i)
        return (
          <li
            key={o.value}
            id={`${id}-${i}`}
            role="option"
            aria-selected={on}
            aria-disabled={o.disabled || undefined}
            className={[styles.option, i === active ? styles.active : '', on ? styles.selected : ''].join(' ')}
            onPointerEnter={() => !o.disabled && onActive(i)}
            // Keep focus on the trigger: the listbox is never focused itself.
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => onChoose(i)}
          >
            {multi ? <CheckboxGlyph state={on ? 'checked' : 'unchecked'} className={styles.box} /> : null}
            <span className={styles.optionLabel}>{o.label}</span>
            {!multi && on ? <KitIcon name="check" className={styles.check} /> : null}
          </li>
        )
      })}
      {indexes.length === 0 ? <li className={styles.empty} role="presentation">No matches</li> : null}
    </ul>
  )
  return anchor ? createPortal(list, document.body) : list
}

/**
 * Where a list drawn on <body> goes: under its trigger, at least as wide as it,
 * and above it instead when there is no room below but there is above.
 * Followed through any scroll and resize while open.
 */
function useFloating(
  anchor: RefObject<HTMLElement | null> | undefined,
  list: RefObject<HTMLUListElement | null> | undefined,
): CSSProperties | undefined {
  const [place, setPlace] = useState<CSSProperties>()
  useLayoutEffect(() => {
    if (!anchor) return
    const update = () => {
      const a = anchor.current?.getBoundingClientRect()
      if (!a) return
      const h = list?.current?.offsetHeight ?? 0
      const above = a.bottom + h > window.innerHeight && a.top - h >= 0
      setPlace({ top: above ? a.top - h : a.bottom, left: a.left, minWidth: a.width })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [anchor, list])
  return place
}

/**
 * The select-only combobox's behaviour: open and close, the keyboard's row,
 * type-ahead, choosing, and closing on a pointer outside. Dropdown and Select
 * (select.md 3.0.0) share it, so the two answer the keyboard identically and
 * only their triggers differ. Focus stays on the trigger throughout.
 */
export function useSelectOnly<T extends HTMLElement>({
  options,
  value,
  onChange,
  disabled,
  readOnly,
  listId,
}: {
  options: DropdownOption[]
  value: string | null | undefined
  onChange: (value: string) => void
  disabled: boolean
  readOnly: boolean
  listId: string
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const root = useRef<T>(null)
  // The trigger's box the list hangs from, and the list itself, which is drawn
  // on <body> and so is not inside root.
  const anchor = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
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
      const t = e.target as Node
      if (!root.current?.contains(t) && !listRef.current?.contains(t)) setOpen(false)
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

  const toggle = () => (open ? setOpen(false) : openList())

  return { root, anchor, listRef, open, active, setActive, selected, choose, onKeyDown, toggle }
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
  const { root, anchor, listRef, open, active, setActive, selected, choose, onKeyDown, toggle } = useSelectOnly<HTMLDivElement>({
    options,
    value,
    onChange,
    disabled,
    readOnly,
    listId,
  })

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
      onClick={toggle}
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
      <div ref={anchor as RefObject<HTMLDivElement>} className={styles.anchor}>
        {trigger}
        {open ? (
          <OptionList
            anchor={anchor}
            listRef={listRef}
            id={listId}
            labelledBy={labelId}
            size={size}
            options={options}
            indexes={options.map((_, i) => i)}
            active={active}
            isSelected={(i) => i === selected}
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
            isSelected={(i) => i === selected}
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
 * The kit's Dropdown - Multi-select (14032:291311, 14530:300220) and
 * Dropdown - Filterable multi-select (14032:291673, 45988:11486): many choices
 * from the kit's list, each row leading with the checkbox glyph. The trigger
 * counts what is chosen in a dismissible high-contrast Tag that clears them
 * all. Filterable makes the trigger a text input that filters the list, as the
 * combo box's does; the plain one is a select-only combobox. Choosing keeps the
 * list open, so several can be chosen in a row.
 */
export function MultiSelect({
  label,
  options,
  value,
  onChange,
  filterable = false,
  selectAll = false,
  placeholder,
  selectedText = 'Options selected',
  size = 'lg',
  layout = 'fixed',
  helpText,
  errorText,
  warningText,
  disabled = false,
  readOnly = false,
  id,
}: Omit<DropdownProps, 'value' | 'onChange'> & {
  value: string[]
  onChange: (value: string[]) => void
  /** The kit's Filterable multi-select: type to narrow the list. */
  filterable?: boolean
  /** The kit's parent checkbox, an "All" row at the top of the list. */
  selectAll?: boolean
  /** The kit's Selected text, beside the count once something is chosen. */
  selectedText?: string
}) {
  const auto = useId()
  const baseId = id ?? auto
  const labelId = `${baseId}-label`
  const valueId = `${baseId}-value`
  const listId = `${baseId}-list`
  const { errored, warned, tone, messageId, message, describedBy } = fieldMessage(baseId, helpText, errorText, warningText)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [text, setText] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const chosen = new Set(value)
  const query = text.trim().toLowerCase()
  const visible = options.map((_, i) => i).filter((i) => !filterable || !query || options[i].label.toLowerCase().includes(query))
  const enabled = visible.filter((i) => !options[i].disabled)
  const withAll = selectAll && !query
  const order = withAll ? [ALL, ...enabled] : enabled
  const pickable = options.filter((o) => !o.disabled)
  const allState = pickable.every((o) => chosen.has(o.value))
    ? 'checked'
    : pickable.some((o) => chosen.has(o.value))
      ? 'indeterminate'
      : 'unchecked'
  const prompt = placeholder ?? (filterable ? 'Filter...' : 'Choose options')

  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) {
        setOpen(false)
        setText('')
      }
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  useEffect(() => {
    if (!open || active === -1) return
    document.getElementById(active === ALL ? `${listId}-all` : `${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, listId])

  const openList = () => {
    if (disabled || readOnly) return
    setActive(order[0] ?? -1)
    setOpen(true)
  }
  const close = () => {
    setOpen(false)
    setText('')
  }
  const toggle = (i: number) => {
    if (i === ALL) {
      onChange(allState === 'checked' ? [] : pickable.map((o) => o.value))
      return
    }
    const o = options[i]
    if (!o || o.disabled) return
    onChange(chosen.has(o.value) ? value.filter((v) => v !== o.value) : [...value, o.value])
  }
  const step = (by: 1 | -1) => {
    const at = order.indexOf(active)
    if (at < 0) return by === 1 ? order[0] : order[order.length - 1]
    return order[Math.min(order.length - 1, Math.max(0, at + by))]
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled || readOnly) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) openList()
      else setActive(step(e.key === 'ArrowDown' ? 1 : -1) ?? -1)
    } else if (e.key === 'Home' && open && !filterable) {
      e.preventDefault()
      setActive(order[0] ?? -1)
    } else if (e.key === 'End' && open && !filterable) {
      e.preventDefault()
      setActive(order[order.length - 1] ?? -1)
    } else if (e.key === 'Enter' || (e.key === ' ' && !filterable)) {
      e.preventDefault()
      if (!open) openList()
      else if (active !== -1) toggle(active)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      if (open) close()
      else setText('')
    } else if (e.key === 'Tab') {
      close()
    }
  }

  const status = errored || warned
  const count = value.length
  const activeId = open && active !== -1 ? (active === ALL ? `${listId}-all` : `${listId}-${active}`) : undefined

  const countTag =
    count > 0 ? (
      <span className={styles.count}>
        <Tag
          variant="high-contrast"
          size="md"
          disabled={disabled}
          onDismiss={readOnly ? undefined : () => onChange([])}
          dismissLabel="Clear all selected items"
        >
          {count}
        </Tag>
      </span>
    ) : null

  const trailing = (
    <>
      {status ? <FieldStatusIcon className={warned ? `${styles.status} ${styles.warnGlyph}` : styles.status} /> : null}
      {filterable && text && !disabled && !readOnly ? (
        <>
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear filter"
            onClick={(e) => {
              e.stopPropagation()
              setText('')
              input.current?.focus()
            }}
          >
            <KitIcon name="cross-small" />
          </button>
          <span className={styles.divider} aria-hidden="true" />
        </>
      ) : null}
    </>
  )

  const fluidLabel =
    layout === 'fluid' ? (
      filterable ? (
        <label id={labelId} htmlFor={baseId} className={styles.fluidLabel}>
          {label}
        </label>
      ) : (
        <span id={labelId} className={styles.fluidLabel}>
          {label}
        </span>
      )
    ) : null

  const trigger = filterable ? (
    <div
      className={[styles.trigger, styles.combo, styles[size], errored ? styles.errored : '', open ? styles.open : ''].join(' ')}
      onClick={() => input.current?.focus()}
    >
      {fluidLabel}
      <span className={styles.row}>
        {countTag}
        <input
          ref={input}
          id={baseId}
          className={styles.input}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-describedby={describedBy}
          aria-invalid={errored || undefined}
          autoComplete="off"
          placeholder={count > 0 ? selectedText : readOnly ? 'No option selected' : prompt}
          disabled={disabled}
          readOnly={readOnly}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            const q = e.target.value.trim().toLowerCase()
            setActive(options.findIndex((o) => !o.disabled && (!q || o.label.toLowerCase().includes(q))))
            if (!open) setOpen(true)
          }}
          onClick={() => (open ? undefined : openList())}
          onKeyDown={onKeyDown}
        />
        {trailing}
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
  ) : (
    <div
      id={baseId}
      className={[styles.trigger, styles[size], errored ? styles.errored : '', open ? styles.open : ''].join(' ')}
      role="combobox"
      tabIndex={disabled ? -1 : 0}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listId}
      aria-labelledby={`${labelId} ${valueId}`}
      aria-activedescendant={activeId}
      aria-describedby={describedBy}
      aria-invalid={errored || undefined}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      onClick={(e) => {
        // The count tag's own close button clears without opening.
        if ((e.target as HTMLElement).closest('button')) return
        if (open) close()
        else openList()
      }}
      onKeyDown={onKeyDown}
    >
      {fluidLabel}
      <span className={styles.row}>
        {countTag}
        <span id={valueId} className={styles.value}>
          {count > 0 ? selectedText : readOnly ? 'No option selected' : prompt}
        </span>
        {trailing}
        <KitIcon name="angle-small-down" className={styles.chevron} />
      </span>
    </div>
  )

  return (
    <div
      ref={root}
      className={[styles.dropdown, styles[layout], disabled ? styles.isDisabled : '', readOnly ? styles.isReadOnly : ''].join(' ')}
    >
      {layout === 'fluid' ? null : filterable ? (
        <label id={labelId} htmlFor={baseId} className={styles.label}>
          {label}
        </label>
      ) : (
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
            indexes={visible}
            active={active}
            isSelected={(i) => chosen.has(options[i].value)}
            multi
            all={withAll ? { state: allState, onToggle: () => toggle(ALL) } : undefined}
            onActive={setActive}
            onChoose={toggle}
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
