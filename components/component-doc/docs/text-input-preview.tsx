'use client'

import { TextInput } from '@/components/ui/text-input'
import type { FieldSize } from '@/components/ui/text-input'
import { Dropdown } from '@/components/ui/dropdown'
import { useState } from 'react'
import { DemoFrame } from '../demo-frame'

type DemoState = 'default' | 'disabled' | 'error' | 'invalid'

const LABEL = 'Email address'
const HELP = 'We only use it to send the receipt.'
const ERROR = 'Enter an email address with an @ in it.'

function codeFor(size: FieldSize, state: DemoState) {
  const lines = [`  label="${LABEL}"`, '  type="email"']
  if (size !== 'md') lines.push(`  size="${size}"`)
  if (state === 'disabled' || state === 'invalid') lines.push(`  state="${state}"`)
  lines.push(`  helpText="${HELP}"`)
  // Error is shown the way the component wants it shown: by passing the
  // message, which resolves the state. state="error" alone is not the idiom.
  if (state === 'error') lines.push(`  errorText="${ERROR}"`)
  return `<TextInput\n${lines.join('\n')}\n/>`
}

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
      code={codeFor(size, state)}
    />
  )
}
