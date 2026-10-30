'use client'

import { useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { ERROR, exampleFor, HELP, LABEL } from './toggle-code'
import type { Message, Size, State } from './toggle-code'

/**
 * The switch itself is the on/off control, so there is no Toggled selector
 * here: flip it and the code follows. State, Size, Toggle only and the
 * supporting text are the rest of the kit's axes.
 */
export function TogglePreview() {
  const [checked, setChecked] = useState(true)
  const [state, setState] = useState<State>('enabled')
  const [message, setMessage] = useState<Message>('none')
  const [size, setSize] = useState<Size>('default')
  const [only, setOnly] = useState(false)

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="State"
            size="sm"
            value={state}
            onChange={(v) => setState(v as State)}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'read-only', label: 'Read-only' },
            ]}
          />
          <Dropdown
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'sm', label: 'Small' },
            ]}
          />
          <Dropdown
            label="Toggle only"
            size="sm"
            value={only ? 'true' : 'false'}
            onChange={(v) => setOnly(v === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
          />
          <Dropdown
            label="Supporting text"
            size="sm"
            value={message}
            onChange={(v) => setMessage(v as Message)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'help', label: 'Help text' },
              { value: 'error', label: 'Error text' },
            ]}
          />
        </>
      }
      preview={
        <Toggle
          label={LABEL}
          checked={checked}
          disabled={state === 'disabled'}
          readOnly={state === 'read-only'}
          size={size}
          hideLabel={only}
          helpText={message === 'help' ? HELP : undefined}
          errorText={message === 'error' ? ERROR : undefined}
          onChange={setChecked}
        />
      }
      example={exampleFor({ checked, state, message, size, only })}
    />
  )
}
