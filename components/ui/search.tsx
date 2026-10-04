'use client'

import { useId, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { KitIcon } from '@/components/kit-icon'
import styles from './search.module.scss'

/** Contract: docs/contracts/search.md (1.0.0) */
type SearchProps = {
  /** Generated when omitted. */
  id?: string
  /**
   * Required. The Default set draws no visible label, so this is the field's
   * accessible name; the Fluid set paints it inside the box.
   */
  label: string
  placeholder?: string
  /** The kit's Size: 48, 40 and 32 tall. Large by default, as the kit has it. */
  size?: 'sm' | 'md' | 'lg'
  /** The kit's two sets: Search - Default, or Search - Fluid (64 tall, label inside). */
  layout?: 'default' | 'fluid'
  /**
   * The kit's Expandable: collapsed to the search icon until pressed, and back
   * when it loses focus empty or Escape is pressed. Default layout only.
   */
  expandable?: boolean
  /** Starts expanded. Only matters with expandable. */
  defaultExpanded?: boolean
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Enter. The search itself is the caller's. */
  onSubmit?: (value: string) => void
  disabled?: boolean
  name?: string
}

export function Search({
  id,
  label,
  placeholder = 'Search',
  size = 'lg',
  layout = 'default',
  expandable = false,
  defaultExpanded = false,
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  disabled = false,
  name,
}: SearchProps) {
  const auto = useId()
  const inputId = id ?? auto
  const [own, setOwn] = useState(defaultValue)
  const query = value ?? own
  const set = (next: string) => {
    if (value === undefined) setOwn(next)
    onChange?.(next)
  }
  const fluid = layout === 'fluid'
  const canCollapse = expandable && !fluid
  const [open, setOpen] = useState(!canCollapse || defaultExpanded)
  const input = useRef<HTMLInputElement>(null)

  const expand = () => {
    setOpen(true)
    // After the field renders, so it can take focus.
    requestAnimationFrame(() => input.current?.focus())
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      // Escape clears first, then collapses an empty expandable field.
      if (query) set('')
      else if (canCollapse) setOpen(false)
      return
    }
    if (e.key === 'Enter') onSubmit?.(query)
  }

  if (canCollapse && !open) {
    return (
      <div role="search" className={`${styles.search} ${styles[size]} ${styles.isCollapsed}`}>
        <button
          type="button"
          className={styles.collapsed}
          aria-label={label}
          aria-expanded={false}
          aria-controls={inputId}
          disabled={disabled}
          onClick={expand}
        >
          <KitIcon name="search" />
        </button>
      </div>
    )
  }

  const clear = query ? (
    <button
      type="button"
      className={styles.clear}
      aria-label="Clear search"
      disabled={disabled}
      onClick={() => {
        set('')
        input.current?.focus()
      }}
    >
      <KitIcon name="cross-small" />
    </button>
  ) : null

  return (
    <div
      role="search"
      className={[styles.search, fluid ? styles.fluid : styles[size], disabled ? styles.isDisabled : ''].join(' ')}
    >
      <div className={styles.field}>
        {fluid ? (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        ) : (
          <span className={styles.icon} aria-hidden="true">
            <KitIcon name="search" />
          </span>
        )}
        <span className={styles.row}>
          <input
            ref={input}
            id={inputId}
            name={name}
            type="search"
            className={styles.input}
            aria-label={fluid ? undefined : label}
            placeholder={placeholder}
            value={query}
            disabled={disabled}
            autoComplete="off"
            onChange={(e: ChangeEvent<HTMLInputElement>) => set(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => {
              if (canCollapse && !query) setOpen(false)
            }}
          />
          {clear}
          {fluid ? (
            <span className={styles.fluidIcon} aria-hidden="true">
              <KitIcon name="search" />
            </span>
          ) : null}
        </span>
      </div>
    </div>
  )
}
