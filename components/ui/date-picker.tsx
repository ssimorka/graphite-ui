'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { fieldMessage } from '@/lib/field-message'
import { TextInput } from './text-input'
import type { FieldSize } from './text-input'
import styles from './date-picker.module.scss'

/**
 * Contract: docs/contracts/date-picker.md (1.0.0)
 *
 * The kit's Date picker sets: Simple date, Single calendar and Range calendar,
 * each in Default and Fluid. The fields are the governed Text input; the
 * calendar is the kit's private _Date picker calendar, an overlay panel with
 * the ARIA grid pattern for its days. Dates are typed as mm/dd/yyyy.
 */

// ------------------------------------------------------------------- dates
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = [['S', 'Sunday'], ['M', 'Monday'], ['T', 'Tuesday'], ['W', 'Wednesday'], ['T', 'Thursday'], ['F', 'Friday'], ['S', 'Saturday']]

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
function addMonths(d: Date, n: number) {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last))
}
const pad = (n: number) => String(n).padStart(2, '0')
export const formatDate = (d: Date | null) => (d ? `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}` : '')

/** mm/dd/yyyy, as the kit's placeholder spells it. Anything else is not a date. */
export function parseDate(text: string): Date | null {
  const m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(text)
  if (!m) return null
  const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]))
  return d.getMonth() === Number(m[1]) - 1 ? d : null
}

const longLabel = (d: Date) =>
  `${WEEKDAYS[d.getDay()][1]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`

// ---------------------------------------------------------------- calendar
type CalendarProps = {
  /** The single date, or a range's ends. */
  selected: [Date | null, Date | null]
  range: boolean
  minDate?: Date
  maxDate?: Date
  onPick: (d: Date) => void
  onClose: () => void
  label: string
  style?: CSSProperties
}

/**
 * The kit's _Date picker calendar: 288 wide on elevation-01 with the overlay
 * shadow, padded 4 4 8 4. A 40 header with previous, month and year, next;
 * the weekday row; six rows of 40 × 40 days.
 */
function Calendar({ selected, range, minDate, maxDate, onPick, onClose, label, style }: CalendarProps) {
  const today = startOfDay(new Date())
  const [start, end] = selected
  const [focus, setFocus] = useState<Date>(() => startOfDay(start ?? end ?? today))
  const [hover, setHover] = useState<Date | null>(null)
  const [yearText, setYearText] = useState<string | null>(null)
  const grid = useRef<HTMLTableElement>(null)
  const moved = useRef(false)

  const month = new Date(focus.getFullYear(), focus.getMonth(), 1)
  const first = addDays(month, -month.getDay())
  const days = Array.from({ length: 42 }, (_, i) => addDays(first, i))
  const outOfBounds = (d: Date) => (minDate && d < startOfDay(minDate)) || (maxDate && d > startOfDay(maxDate))

  // Move DOM focus with the roving date, once the reader has started moving it.
  useEffect(() => {
    if (!moved.current) return
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${formatDate(focus)}"]`)?.focus()
  }, [focus])

  const go = (d: Date) => {
    moved.current = true
    setFocus(d)
  }

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      Home: () => addDays(focus, -focus.getDay()),
      End: () => addDays(focus, 6 - focus.getDay()),
      PageUp: () => addMonths(focus, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focus, e.shiftKey ? 12 : 1),
    }
    if (keys[e.key]) {
      e.preventDefault()
      go(keys[e.key]())
    }
  }

  // While a range has its start and no end, the days up to the one under the
  // pointer preview the range, as the kit's End range hover draws it.
  const pickingEnd = range && start && !end
  const lo = pickingEnd && hover ? (hover < start ? hover : start) : start
  const hi = pickingEnd && hover ? (hover < start ? start : hover) : end

  return (
    <div
      className={styles.panel}
      style={style}
      role="dialog"
      aria-label={`${label}: choose date`}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose()
        }
      }}
    >
      <div className={styles.header}>
        <button type="button" className={styles.nav} aria-label="Previous month" onClick={() => go(addMonths(focus, -1))}>
          <KitIcon name="angle-small-right" className={styles.flip} />
        </button>
        <div className={styles.title} aria-live="polite">
          <span>{MONTHS[focus.getMonth()]}</span>
          <span className={styles.yearBox}>
            <input
              className={styles.year}
              aria-label="Year"
              inputMode="numeric"
              value={yearText ?? String(focus.getFullYear())}
              onChange={(e) => {
                setYearText(e.target.value)
                if (/^\d{4}$/.test(e.target.value)) {
                  setFocus(new Date(Number(e.target.value), focus.getMonth(), Math.min(focus.getDate(), 28)))
                }
              }}
              onBlur={() => setYearText(null)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  setYearText(null)
                  setFocus(addMonths(focus, e.key === 'ArrowUp' ? 12 : -12))
                }
              }}
            />
            <KitIcon name="apps-sort" className={styles.yearCaret} aria-hidden="true" />
          </span>
        </div>
        <button type="button" className={styles.nav} aria-label="Next month" onClick={() => go(addMonths(focus, 1))}>
          <KitIcon name="angle-small-right" />
        </button>
      </div>
      <table ref={grid} className={styles.grid} role="grid" aria-label={`${MONTHS[focus.getMonth()]} ${focus.getFullYear()}`} onKeyDown={onKey}>
        <thead>
          <tr>
            {WEEKDAYS.map(([short, long], i) => (
              <th key={i} scope="col" abbr={long} className={styles.weekday}>
                {short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody onMouseLeave={() => setHover(null)}>
          {Array.from({ length: 6 }, (_, row) => (
            <tr key={row}>
              {days.slice(row * 7, row * 7 + 7).map((d) => {
                const isSel = sameDay(d, start) || sameDay(d, end)
                const inRange = !!lo && !!hi && d > lo && d < hi
                const disabled = !!outOfBounds(d)
                return (
                  <td key={d.toISOString()} role="gridcell" aria-selected={isSel || inRange || undefined}>
                    <button
                      type="button"
                      data-date={formatDate(d)}
                      tabIndex={sameDay(d, focus) ? 0 : -1}
                      disabled={disabled}
                      aria-label={longLabel(d)}
                      aria-current={sameDay(d, today) ? 'date' : undefined}
                      className={[
                        styles.day,
                        d.getMonth() !== focus.getMonth() ? styles.outside : '',
                        sameDay(d, today) ? styles.today : '',
                        inRange ? styles.inRange : '',
                        isSel ? styles.selected : '',
                        pickingEnd && sameDay(d, hover) ? styles.endHover : '',
                      ].join(' ')}
                      onMouseEnter={() => setHover(d)}
                      onFocus={() => setFocus(d)}
                      onClick={() => onPick(d)}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ------------------------------------------------------------------ picker
type Common = {
  /** Required. For a range, the start field's label. */
  label: string
  layout?: 'fixed' | 'fluid'
  /** Fixed layout only: 32, 40 or 48. */
  size?: FieldSize
  minDate?: Date
  maxDate?: Date
  helpText?: string
  errorText?: string
  warningText?: string
  disabled?: boolean
  readOnly?: boolean
  id?: string
}

type SimpleProps = Common & { mode: 'simple'; value: Date | null; onChange: (d: Date | null) => void }
type SingleProps = Common & { mode?: 'single'; value: Date | null; onChange: (d: Date | null) => void }
type RangeProps = Common & {
  mode: 'range'
  value: [Date | null, Date | null]
  onChange: (v: [Date | null, Date | null]) => void
  /** The end field's label. */
  endLabel?: string
}
export type DatePickerProps = SimpleProps | SingleProps | RangeProps

/** One typed field. Commits on Enter or on leaving it; a half-typed date stays as typed. */
function DateField({
  label,
  value,
  onCommit,
  calendarButton,
  onOpenKey,
  ...field
}: {
  label: string
  value: Date | null
  onCommit: (d: Date | null) => void
  calendarButton: ReactNode
  onOpenKey: () => void
  layout: 'fixed' | 'fluid'
  size: FieldSize
  state: 'default' | 'error' | 'warning'
  helpText?: string
  errorText?: string
  warningText?: string
  disabled?: boolean
  readOnly?: boolean
  describedBy?: string
  id: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const commit = () => {
    if (draft === null) return
    if (draft.trim() === '') onCommit(null)
    else {
      const d = parseDate(draft)
      if (!d) return
      onCommit(d)
    }
    setDraft(null)
  }
  const flagged = field.state !== 'default' || !!field.errorText || !!field.warningText
  return (
    <TextInput
      id={field.id}
      label={label}
      layout={field.layout}
      size={field.size}
      state={field.state}
      helpText={field.helpText}
      errorText={field.errorText}
      warningText={field.warningText}
      disabled={field.disabled}
      readOnly={field.readOnly}
      aria-describedby={field.describedBy}
      placeholder="mm/dd/yyyy"
      autoComplete="off"
      value={draft ?? formatDate(value)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit()
        if (e.key === 'ArrowDown' && calendarButton) {
          e.preventDefault()
          onOpenKey()
        }
      }}
      // The kit swaps the calendar glyph for the status glyph in Error and Warning.
      trailing={flagged ? undefined : calendarButton}
    />
  )
}

export function DatePicker(props: DatePickerProps) {
  const {
    label,
    layout = 'fixed',
    size = 'lg',
    minDate,
    maxDate,
    helpText,
    errorText,
    warningText,
    disabled = false,
    readOnly = false,
    id,
  } = props
  const mode = props.mode ?? 'single'
  const auto = useId()
  const baseId = id ?? auto
  const [open, setOpen] = useState(false)
  const [panelTop, setPanelTop] = useState(0)
  const root = useRef<HTMLDivElement>(null)

  const range = mode === 'range'
  const [start, end] = range ? (props as RangeProps).value : [(props as SingleProps).value, null]

  // A range's message sits under both fields, so the fields only take its state.
  const shared = fieldMessage(baseId, helpText, errorText, warningText)
  const state = shared.tone === 'error' ? 'error' : shared.tone === 'warning' ? 'warning' : 'default'

  // Close on a pointer outside the picker.
  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  // The panel hangs from the bottom of the field, above any message under it.
  useLayoutEffect(() => {
    if (!open || !root.current) return
    const input = root.current.querySelector('input')
    const shell = input?.parentElement?.parentElement
    if (shell) setPanelTop(shell.getBoundingClientRect().bottom - root.current.getBoundingClientRect().top)
  }, [open])

  const openAndFocus = () => {
    setOpen(true)
    requestAnimationFrame(() =>
      root.current?.querySelector<HTMLButtonElement>('[role=grid] button[tabindex="0"]')?.focus(),
    )
  }

  const close = () => {
    setOpen(false)
    root.current?.querySelector<HTMLButtonElement>('[data-part="calendar-button"]')?.focus()
  }

  const calendarButton =
    mode === 'simple' ? null : readOnly || disabled ? (
      <span className={styles.icon} aria-hidden="true">
        <KitIcon name="calendar" />
      </span>
    ) : (
      <button
        type="button"
        className={styles.trigger}
        data-part="calendar-button"
        aria-label={`Choose ${range ? 'dates' : 'date'}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openAndFocus())}
      >
        <KitIcon name="calendar" />
      </button>
    )

  const pick = (d: Date) => {
    if (!range) {
      ;(props as SingleProps).onChange(d)
      close()
      return
    }
    const set = (props as RangeProps).onChange
    if (!start || end) set([d, null])
    else {
      set(d < start ? [d, start] : [start, d])
      close()
    }
  }

  const fieldProps = {
    layout,
    size,
    disabled,
    readOnly,
    calendarButton,
    onOpenKey: openAndFocus,
  }

  return (
    <div
      ref={root}
      className={[styles.picker, styles[mode], layout === 'fluid' ? styles.fluid : ''].join(' ')}
      role={range ? 'group' : undefined}
      aria-label={range ? `${label} to ${(props as RangeProps).endLabel ?? 'End date'}` : undefined}
    >
      {range ? (
        <>
          <div className={styles.fields}>
            <DateField
              {...fieldProps}
              id={`${baseId}-start`}
              label={label}
              value={start}
              state={state}
              describedBy={shared.describedBy}
              onCommit={(d) => (props as RangeProps).onChange([d, end])}
            />
            {layout === 'fluid' ? <span className={styles.divider} aria-hidden="true" /> : null}
            <DateField
              {...fieldProps}
              id={`${baseId}-end`}
              label={(props as RangeProps).endLabel ?? 'End date'}
              value={end}
              state={state}
              describedBy={shared.describedBy}
              onCommit={(d) => (props as RangeProps).onChange([start, d])}
            />
          </div>
          {shared.message ? (
            <span
              id={shared.messageId}
              className={shared.tone === 'error' ? styles.error : shared.tone === 'warning' ? styles.warningText : styles.help}
              role={shared.tone === 'error' ? 'alert' : undefined}
            >
              {shared.message}
            </span>
          ) : null}
        </>
      ) : (
        <DateField
          {...fieldProps}
          id={baseId}
          label={label}
          value={start}
          state="default"
          helpText={helpText}
          errorText={errorText}
          warningText={warningText}
          onCommit={(d) => (props as SingleProps).onChange(d)}
        />
      )}
      {open ? (
        <Calendar
          label={label}
          selected={[start, end]}
          range={range}
          minDate={minDate}
          maxDate={maxDate}
          onPick={pick}
          onClose={close}
          style={{ top: panelTop }}
        />
      ) : null}
    </div>
  )
}
