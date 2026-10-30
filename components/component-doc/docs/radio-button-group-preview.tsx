'use client'

import { useState } from 'react'
import { RadioButtonGroup } from '@/components/ui/radio-button-group'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { ERROR, exampleFor, OPTIONS } from './radio-button-group-code'
import type { Orientation, State } from './radio-button-group-code'

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
          <Dropdown
            label="Orientation"
            size="sm"
            value={orientation}
            onChange={(v) => setOrientation(v as Orientation)}
            options={[
              { value: 'vertical', label: 'Vertical' },
              { value: 'horizontal', label: 'Horizontal' },
            ]}
          />
          <Dropdown
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
      example={exampleFor({ orientation, state, value })}
    />
  )
}
