'use client'

import { useState } from 'react'
import { PasswordInput } from '@/components/ui/password-input'
import { Dropdown } from '@/components/ui/dropdown'
import type { FieldLayout, FieldSize } from '@/components/ui/text-input'
import { DemoFrame } from '../demo-frame'
import { ERROR, exampleFor, WARNING } from './password-input-code'
import type { Status } from './password-input-code'

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
          <Dropdown
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
      example={exampleFor({ layout, size, status })}
    />
  )
}
