'use client'

import { useState } from 'react'
import { CheckboxGroup } from '@/components/ui/checkbox-group'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Status = 'enabled' | 'error' | 'warning' | 'disabled' | 'read-only'

const OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Text message' },
  { value: 'push', label: 'Push notification' },
]

const ERROR = 'Choose at least one way to reach you'
const WARNING = 'Text messages may cost extra'

function codeFor(orientation: 'vertical' | 'horizontal', status: Status) {
  const props = [
    orientation === 'vertical' ? '' : '\n  orientation="horizontal"',
    status === 'error' ? `\n  errorText="${ERROR}"` : '',
    status === 'warning' ? `\n  warningText="${WARNING}"` : '',
    status === 'disabled' ? '\n  disabled' : '',
    status === 'read-only' ? '\n  readOnly' : '',
  ].join('')
  return `const [value, setValue] = useState<string[]>(['email'])\n\n<CheckboxGroup\n  label="Notify me by"\n  options={[\n    { value: 'email', label: 'Email' },\n    { value: 'sms', label: 'Text message' },\n    { value: 'push', label: 'Push notification' },\n  ]}${props}\n  value={value}\n  onChange={setValue}\n/>`
}

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
          <Select
            label="Horizontal"
            size="sm"
            value={orientation === 'horizontal' ? 'true' : 'false'}
            onChange={(v) => setOrientation(v === 'true' ? 'horizontal' : 'vertical')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
          />
          <Select
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
      code={codeFor(orientation, status)}
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
