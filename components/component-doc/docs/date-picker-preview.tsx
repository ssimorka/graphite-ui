'use client'

import { useState } from 'react'
import { DatePicker } from '@/components/ui/date-picker'
import type { FieldSize } from '@/components/ui/text-input'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './date-picker.module.scss'
import { ERROR, exampleFor, WARNING } from './date-picker-code'
import type { Mode, Status } from './date-picker-code'

/** Every set, both layouts, the sizes and the status states, live. */
export function DatePickerPreview() {
  const [mode, setMode] = useState<Mode>('single')
  const [layout, setLayout] = useState<'fixed' | 'fluid'>('fixed')
  const [size, setSize] = useState<FieldSize>('lg')
  const [status, setStatus] = useState<Status>('enabled')
  const [date, setDate] = useState<Date | null>(null)
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null])

  const common = {
    layout,
    size,
    errorText: status === 'error' ? ERROR : undefined,
    warningText: status === 'warning' ? WARNING : undefined,
    disabled: status === 'disabled',
    readOnly: status === 'read-only',
  }

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Set"
            size="sm"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            options={[
              { value: 'simple', label: 'Simple date' },
              { value: 'single', label: 'Single calendar' },
              { value: 'range', label: 'Range calendar' },
            ]}
          />
          <Dropdown
            label="Layout"
            size="sm"
            value={layout}
            onChange={(v) => setLayout(v as 'fixed' | 'fluid')}
            options={[
              { value: 'fixed', label: 'Default' },
              { value: 'fluid', label: 'Fluid' },
            ]}
          />
          <Dropdown
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as FieldSize)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
          <Dropdown
            label="State"
            size="sm"
            value={status}
            onChange={(v) => setStatus(v as Status)}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'error', label: 'Error' },
              { value: 'warning', label: 'Warning' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'read-only', label: 'Read-only' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.stage}>
          {mode === 'range' ? (
            <DatePicker mode="range" label="Start date" endLabel="End date" value={range} onChange={setRange} {...common} />
          ) : (
            <DatePicker
              mode={mode}
              label={mode === 'simple' ? 'Date (mm/dd/yyyy)' : 'Date'}
              value={date}
              onChange={setDate}
              {...common}
            />
          )}
        </div>
      }
      example={exampleFor({ mode, layout, size, status })}
    />
  )
}

/** A still the server-rendered page can place: it owns its own value. */
export function DatePickerStill({
  mode = 'single',
  layout = 'fixed',
  size,
  status = 'enabled',
  filled = false,
}: {
  mode?: Mode
  layout?: 'fixed' | 'fluid'
  size?: FieldSize
  status?: Status
  filled?: boolean
}) {
  const [date, setDate] = useState<Date | null>(filled ? new Date(2026, 9, 14) : null)
  const [range, setRange] = useState<[Date | null, Date | null]>(
    filled ? [new Date(2026, 9, 12), new Date(2026, 9, 16)] : [null, null],
  )
  const common = {
    layout,
    size,
    errorText: status === 'error' ? ERROR : undefined,
    warningText: status === 'warning' ? WARNING : undefined,
    disabled: status === 'disabled',
    readOnly: status === 'read-only',
  }
  return mode === 'range' ? (
    <DatePicker mode="range" label="Start date" endLabel="End date" value={range} onChange={setRange} {...common} />
  ) : (
    <DatePicker mode={mode} label={mode === 'simple' ? 'Date (mm/dd/yyyy)' : 'Date'} value={date} onChange={setDate} {...common} />
  )
}
