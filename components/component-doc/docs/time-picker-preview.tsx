'use client'

import { useState } from 'react'
import { Dropdown } from '@/components/ui/dropdown'
import type { FieldSize } from '@/components/ui/text-input'
import { TimePicker } from '@/components/ui/time-picker'
import type { TimeValue } from '@/components/ui/time-picker'
import { DemoFrame } from '../demo-frame'

type Status = 'enabled' | 'error' | 'warning' | 'disabled' | 'read-only'

const TIMEZONES: [{ value: string; label: string }, { value: string; label: string }, ...{ value: string; label: string }[]] = [
  { value: 'ET', label: 'Eastern time (ET)' },
  { value: 'CT', label: 'Central time (CT)' },
  { value: 'MT', label: 'Mountain time (MT)' },
  { value: 'PT', label: 'Pacific time (PT)' },
]

const ERROR = 'Enter a time as hh:mm'
const WARNING = 'This is outside office hours'
const VALID = /^(0?[1-9]|1[0-2]):[0-5]\d$/

function codeFor(layout: 'fixed' | 'fluid', size: FieldSize, zones: boolean, status: Status) {
  const props = [
    layout === 'fixed' ? '' : '\n  layout="fluid"',
    layout === 'fluid' || size === 'lg' ? '' : `\n  size="${size}"`,
    zones ? '\n  timezones={TIMEZONES}' : '',
    status === 'error' ? `\n  errorText="${ERROR}"` : '',
    status === 'warning' ? `\n  warningText="${WARNING}"` : '',
    status === 'disabled' ? '\n  disabled' : '',
    status === 'read-only' ? '\n  readOnly' : '',
  ].join('')
  return `const [value, setValue] = useState<TimeValue>({ time: '', period: 'AM', timezone: 'ET' })\n\n<TimePicker${props}\n  label="Choose a time"\n  value={value}\n  onChange={setValue}\n/>`
}

/** Both sets, the sizes, the two- and three-input forms and the states, live. */
export function TimePickerPreview() {
  const [layout, setLayout] = useState<'fixed' | 'fluid'>('fixed')
  const [size, setSize] = useState<FieldSize>('lg')
  const [zones, setZones] = useState(true)
  const [status, setStatus] = useState<Status>('enabled')
  const [value, setValue] = useState<TimeValue>({ time: '', period: 'AM', timezone: 'ET' })
  // The live picker checks what is typed, the way a page would.
  const typedWrong = value.time !== '' && !VALID.test(value.time)

  return (
    <DemoFrame
      controls={
        <>
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
            label="Inputs"
            size="sm"
            value={zones ? '3' : '2'}
            onChange={(v) => setZones(v === '3')}
            options={[
              { value: '3', label: '3' },
              { value: '2', label: '2' },
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
        <TimePicker
          label="Choose a time"
          layout={layout}
          size={size}
          timezones={zones ? TIMEZONES : undefined}
          errorText={status === 'error' || typedWrong ? ERROR : undefined}
          warningText={status === 'warning' ? WARNING : undefined}
          disabled={status === 'disabled'}
          readOnly={status === 'read-only'}
          value={value}
          onChange={setValue}
        />
      }
      code={codeFor(layout, size, zones, status)}
    />
  )
}

/** A still the server-rendered page can place: it owns its own value. */
export function TimePickerStill({
  layout = 'fixed',
  size,
  zones = true,
  status = 'enabled',
  filled = false,
}: {
  layout?: 'fixed' | 'fluid'
  size?: FieldSize
  zones?: boolean
  status?: Status
  filled?: boolean
}) {
  const [value, setValue] = useState<TimeValue>({ time: filled ? '09:30' : '', period: 'AM', timezone: 'ET' })
  return (
    <TimePicker
      label="Choose a time"
      layout={layout}
      size={size}
      timezones={zones ? TIMEZONES : undefined}
      errorText={status === 'error' ? ERROR : undefined}
      warningText={status === 'warning' ? WARNING : undefined}
      disabled={status === 'disabled'}
      readOnly={status === 'read-only'}
      value={value}
      onChange={setValue}
    />
  )
}
