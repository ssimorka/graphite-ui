'use client'

import { useState } from 'react'
import { PasswordInput } from '@/components/ui/password-input'
import { Select } from '@/components/ui/select'
import type { FieldLayout, FieldSize } from '@/components/ui/text-input'
import { DemoFrame } from '../demo-frame'

type Status = 'enabled' | 'error' | 'warning' | 'disabled' | 'read-only'

const ERROR = 'Use at least 12 characters'
const WARNING = 'Caps Lock is on'

function codeFor(layout: FieldLayout, size: FieldSize, status: Status) {
  const props = [
    layout === 'fixed' ? '' : `\n  layout="${layout}"`,
    layout === 'fluid' || size === 'md' ? '' : `\n  size="${size}"`,
    status === 'error' ? `\n  errorText="${ERROR}"` : '',
    status === 'warning' ? `\n  warningText="${WARNING}"` : '',
    status === 'disabled' ? '\n  disabled' : '',
    status === 'read-only' ? '\n  readOnly' : '',
  ].join('')
  return `<PasswordInput\n  label="Password"${props}\n  helpText="At least 12 characters"\n  value={value}\n  onChange={(e) => setValue(e.target.value)}\n/>`
}

/** Every layout, size and state, live. The eye shows what was typed. */
export function PasswordInputPreview() {
  const [layout, setLayout] = useState<FieldLayout>('fixed')
  const [size, setSize] = useState<FieldSize>('lg')
  const [status, setStatus] = useState<Status>('enabled')
  const [value, setValue] = useState('correct horse')
  const short = value.length > 0 && value.length < 12

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Style"
            size="sm"
            value={layout}
            onChange={(v) => setLayout(v as FieldLayout)}
            options={[
              { value: 'fixed', label: 'Fixed' },
              { value: 'inline', label: 'Inline' },
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
          <PasswordInput
            label="Password"
            layout={layout}
            size={size}
            helpText="At least 12 characters"
            errorText={status === 'error' || short ? ERROR : undefined}
            warningText={status === 'warning' ? WARNING : undefined}
            disabled={status === 'disabled'}
            readOnly={status === 'read-only'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      }
      code={codeFor(layout, size, status)}
    />
  )
}
