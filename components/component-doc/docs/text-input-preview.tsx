'use client'

import { TextInput } from '@/components/ui/text-input'
import type { FieldSize } from '@/components/ui/text-input'
import { Dropdown } from '@/components/ui/dropdown'
import { useState } from 'react'
import { DemoFrame } from '../demo-frame'
import { ERROR, exampleFor, HELP, LABEL } from './text-input-code'
import type { DemoState } from './text-input-code'

/**
 * Size and State: the two props the contract gives values for. `type` is a
 * native attribute and is fixed to email here, because that is the case where
 * an error message has something concrete to say.
 */
export function TextInputPreview() {
  const [size, setSize] = useState<FieldSize>('md')
  const [state, setState] = useState<DemoState>('default')

  return (
    <DemoFrame
      controls={
        <>
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
            value={state}
            onChange={(v) => setState(v as DemoState)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'error', label: 'Error' },
              { value: 'invalid', label: 'Invalid' },
            ]}
          />
        </>
      }
      preview={
        <TextInput
          label={LABEL}
          type="email"
          size={size}
          state={state === 'disabled' || state === 'invalid' ? state : 'default'}
          helpText={HELP}
          errorText={state === 'error' ? ERROR : undefined}
        />
      }
      example={exampleFor({ size, state })}
    />
  )
}
