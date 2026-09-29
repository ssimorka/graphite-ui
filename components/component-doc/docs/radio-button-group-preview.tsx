'use client'

import { useState } from 'react'
import { RadioButtonGroup, type RadioOption } from '@/components/ui/radio-button-group'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Orientation = 'vertical' | 'horizontal'
type State = 'enabled' | 'disabled' | 'error'

const OPTIONS: RadioOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
]
const ERROR = 'Overnight is not available for this address.'

function codeFor(orientation: Orientation, state: State, value: string) {
  const options = OPTIONS.map((o) => `    { value: '${o.value}', label: '${o.label}' },`).join('\n')
  const lines = [
    '  name="shipping"',
    '  label="Shipping speed"',
    `  options={[\n${options}\n  ]}`,
    `  value="${value}"`,
  ]
  if (orientation === 'horizontal') lines.push('  orientation="horizontal"')
  if (state === 'disabled') lines.push('  disabled')
  if (state === 'error') lines.push(`  errorText="${ERROR}"`)
  lines.push('  onChange={setSpeed}')
  return `<RadioButtonGroup\n${lines.join('\n')}\n/>`
}

/**
 * Orientation is the contract's one variant prop. State covers the group-level
 * disabled flag and the error message. Picking an option updates the value in
 * the code, because the group is controlled.
 */
export function RadioButtonGroupPreview() {
  const [orientation, setOrientation] = useState<Orientation>('vertical')
  const [state, setState] = useState<State>('enabled')
  const [value, setValue] = useState('standard')

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Orientation"
            size="sm"
            value={orientation}
            onChange={(v) => setOrientation(v as Orientation)}
            options={[
              { value: 'vertical', label: 'Vertical' },
              { value: 'horizontal', label: 'Horizontal' },
            ]}
          />
          <Select
            label="State"
            size="sm"
            value={state}
            onChange={(v) => setState(v as State)}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'error', label: 'Error' },
            ]}
          />
        </>
      }
      preview={
        <RadioButtonGroup
          name="preview-shipping"
          label="Shipping speed"
          options={OPTIONS}
          value={value}
          orientation={orientation}
          disabled={state === 'disabled'}
          errorText={state === 'error' ? ERROR : undefined}
          onChange={setValue}
        />
      }
      code={codeFor(orientation, state, value)}
    />
  )
}
