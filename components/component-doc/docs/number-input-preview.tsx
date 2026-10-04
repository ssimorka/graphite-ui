'use client'

import { useState } from 'react'
import { NumberInput } from '@/components/ui/number-input'
import { Select } from '@/components/ui/select'
import type { FieldLayout, FieldSize } from '@/components/ui/text-input'
import { DemoFrame } from '../demo-frame'

type Status = 'enabled' | 'error' | 'warning' | 'disabled' | 'read-only'

const MIN = 0
const MAX = 10
const ERROR = `Enter a number from ${MIN} to ${MAX}`
const WARNING = 'More than 8 may take a while'

function codeFor(layout: 'fixed' | 'fluid', size: FieldSize, status: Status) {
  const props = [
    layout === 'fixed' ? '' : '\n  layout="fluid"',
    layout === 'fluid' || size === 'md' ? '' : `\n  size="${size}"`,
    status === 'error' ? `\n  errorText="${ERROR}"` : '',
    status === 'warning' ? `\n  warningText="${WARNING}"` : '',
    status === 'disabled' ? '\n  disabled' : '',
    status === 'read-only' ? '\n  readOnly' : '',
  ].join('')
  return `const [value, setValue] = useState<number | null>(4)\n\n<NumberInput\n  label="Guests"\n  min={${MIN}}\n  max={${MAX}}${props}\n  value={value}\n  onChange={setValue}\n/>`
}

/** Both sets, the sizes and the states, live. A typed number out of range shows the error. */
export function NumberInputPreview() {
  const [layout, setLayout] = useState<'fixed' | 'fluid'>('fixed')
  const [size, setSize] = useState<FieldSize>('lg')
  const [status, setStatus] = useState<Status>('enabled')
  const [value, setValue] = useState<number | null>(4)
  const outOfRange = value !== null && (value < MIN || value > MAX)

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Set"
            size="sm"
            value={layout}
            onChange={(v) => setLayout(v as 'fixed' | 'fluid')}
            options={[
              { value: 'fixed', label: 'Default' },
              { value: 'fluid', label: 'Fluid' },
            ]}
          />
          <Select
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
          <Select
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
        <div style={{ width: '18rem', maxWidth: '100%' }}>
          <NumberInput
            label="Guests"
            helpText={`From ${MIN} to ${MAX}`}
            min={MIN}
            max={MAX}
            layout={layout}
            size={size}
            errorText={status === 'error' || outOfRange ? ERROR : undefined}
            warningText={status === 'warning' ? WARNING : undefined}
            disabled={status === 'disabled'}
            readOnly={status === 'read-only'}
            value={value}
            onChange={setValue}
          />
        </div>
      }
      code={codeFor(layout, size, status)}
    />
  )
}

/** A still the server-rendered page can place: it owns its own value. */
export function NumberInputStill({
  layout = 'fixed' as FieldLayout,
  size = 'lg' as FieldSize,
  status = 'enabled' as Status,
  start = 4,
}: {
  layout?: FieldLayout
  size?: FieldSize
  status?: Status
  start?: number
}) {
  const [value, setValue] = useState<number | null>(start)
  return (
    <div style={{ width: '18rem', maxWidth: '100%' }}>
      <NumberInput
        label="Guests"
        helpText={`From ${MIN} to ${MAX}`}
        min={MIN}
        max={MAX}
        layout={layout}
        size={size}
        errorText={status === 'error' ? ERROR : undefined}
        warningText={status === 'warning' ? WARNING : undefined}
        disabled={status === 'disabled'}
        readOnly={status === 'read-only'}
        value={value}
        onChange={setValue}
      />
    </div>
  )
}
