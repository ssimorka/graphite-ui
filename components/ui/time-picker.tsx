'use client'

import { useId } from 'react'
import { fieldMessage } from '@/lib/field-message'
import { Select } from './select'
import type { SelectOption } from './select'
import { TextInput } from './text-input'
import type { FieldSize } from './text-input'
import styles from './time-picker.module.scss'

/**
 * Contract: docs/contracts/time-picker.md (1.0.0)
 *
 * The kit's Time picker - Default (17544:268301) and - Fluid (17544:268399),
 * built from its Time picker items: Fixed (the time), Clock (AM or PM) and
 * Timezone. The time is the governed Text input; Clock and Timezone are the
 * governed Select.
 */

export type TimeValue = {
  /** As typed, hh:mm. Checking it is the caller's, reported through errorText. */
  time: string
  period: 'AM' | 'PM'
  timezone?: string
}

type TimePickerProps = {
  /** Required. Default draws it over the row; Fluid names the group with it. */
  label: string
  value: TimeValue
  onChange: (value: TimeValue) => void
  /** The Timezone item. Leave it out for the kit's two-input form. */
  timezones?: [SelectOption, SelectOption, ...SelectOption[]]
  layout?: 'fixed' | 'fluid'
  /** Fixed only: 32, 40 or 48. */
  size?: FieldSize
  /** The items' own labels, which Fluid shows and Default keeps for assistive tech. */
  timeLabel?: string
  clockLabel?: string
  timezoneLabel?: string
  helpText?: string
  errorText?: string
  warningText?: string
  disabled?: boolean
  readOnly?: boolean
  id?: string
}

const PERIODS: [SelectOption, SelectOption] = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
]

export function TimePicker({
  label,
  value,
  onChange,
  timezones,
  layout = 'fixed',
  size = 'lg',
  timeLabel = 'Time',
  clockLabel = 'Clock',
  timezoneLabel = 'Timezone',
  helpText,
  errorText,
  warningText,
  disabled = false,
  readOnly = false,
  id,
}: TimePickerProps) {
  const auto = useId()
  const baseId = id ?? auto
  const labelId = `${baseId}-label`
  const { tone, messageId, message, describedBy } = fieldMessage(baseId, helpText, errorText, warningText)
  const fluid = layout === 'fluid'
  // The kit flags the time alone: the Selects keep their rest state.
  const timeState = tone === 'error' ? 'error' : tone === 'warning' ? 'warning' : 'default'
  const selectState = disabled ? 'disabled' : 'default'

  return (
    <div
      className={[styles.picker, fluid ? styles.fluid : '', disabled ? styles.isDisabled : ''].join(' ')}
      role="group"
      aria-labelledby={fluid ? undefined : labelId}
      aria-label={fluid ? label : undefined}
    >
      {fluid ? null : (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <div className={styles.row}>
        <span className={[styles.time, timeState === 'default' || fluid ? '' : styles.flagged].join(' ')}>
          <TextInput
            id={`${baseId}-time`}
            label={timeLabel}
            hideLabel={!fluid}
            layout={fluid ? 'fluid' : 'fixed'}
            size={size}
            placeholder="hh:mm"
            inputMode="numeric"
            autoComplete="off"
            maxLength={5}
            state={timeState}
            disabled={disabled}
            readOnly={readOnly}
            aria-describedby={describedBy}
            value={value.time}
            onChange={(e) => onChange({ ...value, time: e.target.value })}
          />
        </span>
        <span className={styles.clock}>
          <Select
            id={`${baseId}-clock`}
            label={clockLabel}
            hideLabel={!fluid}
            layout={fluid ? 'fluid' : 'fixed'}
            size={size}
            options={PERIODS}
            value={value.period}
            state={selectState}
            readOnly={readOnly}
            onChange={(v) => onChange({ ...value, period: v as TimeValue['period'] })}
          />
        </span>
        {timezones ? (
          <span className={styles.zone}>
            <Select
              id={`${baseId}-zone`}
              label={timezoneLabel}
              hideLabel={!fluid}
              layout={fluid ? 'fluid' : 'fixed'}
              size={size}
              options={timezones}
              value={value.timezone ?? timezones[0].value}
              state={selectState}
              readOnly={readOnly}
              onChange={(v) => onChange({ ...value, timezone: v })}
            />
          </span>
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
