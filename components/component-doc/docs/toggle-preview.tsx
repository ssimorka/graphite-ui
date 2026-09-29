'use client'

import { useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type State = 'enabled' | 'disabled'
type Message = 'none' | 'help' | 'error'

const LABEL = 'Email notifications'
const HELP = 'A summary of new comments, once a day.'
const ERROR = 'Add an email address to turn this on.'

function codeFor(checked: boolean, state: State, message: Message) {
  const lines = [`  label="${LABEL}"`]
  if (checked) lines.push('  checked')
  if (state === 'disabled') lines.push('  disabled')
  if (message === 'help') lines.push(`  helpText="${HELP}"`)
  if (message === 'error') lines.push(`  errorText="${ERROR}"`)
  lines.push('  onChange={setNotify}')
  return `<Toggle\n${lines.join('\n')}\n/>`
}

/**
 * The switch itself is the on/off control, so there is no Toggled selector
 * here: flip it and the code follows. State and supporting text are what is
 * left of the contract's props.
 */
export function TogglePreview() {
  const [checked, setChecked] = useState(true)
  const [state, setState] = useState<State>('enabled')
  const [message, setMessage] = useState<Message>('none')

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="State"
            size="sm"
            value={state}
            onChange={(v) => setState(v as State)}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'disabled', label: 'Disabled' },
            ]}
          />
          <Select
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
          helpText={message === 'help' ? HELP : undefined}
          errorText={message === 'error' ? ERROR : undefined}
          onChange={setChecked}
        />
      }
      code={codeFor(checked, state, message)}
    />
  )
}
