'use client'

import { useState } from 'react'
import { CheckboxGroup } from '@/components/ui/checkbox-group'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { ERROR, exampleFor, OPTIONS, WARNING } from './checkbox-group-code'
import type { Status } from './checkbox-group-code'

/** Horizontal and every state, live. Clearing every box shows the error, as a page would. */
export function CheckboxGroupPreview() {
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical')
  const [status, setStatus] = useState<Status>('enabled')
  const [value, setValue] = useState<string[]>(['email'])
  const empty = value.length === 0

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Horizontal"
            size="sm"
            value={orientation === 'horizontal' ? 'true' : 'false'}
            onChange={(v) => setOrientation(v === 'true' ? 'horizontal' : 'vertical')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
          />
          <Dropdown
            label="State"
            size="sm"
            value={status}
            onChange={(v) => setStatus(v as Status)}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'error', label: 'Invalid' },
              { value: 'warning', label: 'Warning' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'read-only', label: 'Read-only' },
            ]}
          />
        </>
      }
      preview={
        <CheckboxGroup
          label="Notify me by"
          options={OPTIONS}
          value={value}
          onChange={setValue}
          orientation={orientation}
          errorText={status === 'error' || empty ? ERROR : undefined}
          warningText={status === 'warning' ? WARNING : undefined}
          disabled={status === 'disabled'}
          readOnly={status === 'read-only'}
        />
      }
      example={exampleFor({ orientation, status })}
    />
  )
}

/** A still the server-rendered page can place: it owns its own value. */
export function CheckboxGroupStill({
  orientation = 'vertical',
  status = 'enabled',
}: {
  orientation?: 'vertical' | 'horizontal'
  status?: Status
}) {
  const [value, setValue] = useState<string[]>(['email', 'push'])
  return (
    <CheckboxGroup
      label="Notify me by"
      options={OPTIONS}
      value={value}
      onChange={setValue}
      orientation={orientation}
      errorText={status === 'error' ? ERROR : undefined}
      warningText={status === 'warning' ? WARNING : undefined}
      disabled={status === 'disabled'}
      readOnly={status === 'read-only'}
    />
  )
}
