'use client'

import { useState } from 'react'
import { Select, type SelectOption } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './select.module.scss'

type Size = 'sm' | 'md' | 'lg'
type State = 'default' | 'disabled' | 'error'

const OPTIONS: [SelectOption, SelectOption, ...SelectOption[]] = [
  { value: 'eu', label: 'Europe' },
  { value: 'na', label: 'North America' },
  { value: 'sa', label: 'South America' },
  { value: 'apac', label: 'Asia Pacific' },
]
const HELP = 'Where your data is stored.'
const ERROR = 'This region is full. Choose another.'

function codeFor(size: Size, state: State, value: string) {
  const options = OPTIONS.map((o) => `    { value: '${o.value}', label: '${o.label}' },`).join('\n')
  const lines = [
    '  label="Region"',
    `  options={[\n${options}\n  ]}`,
    `  value="${value}"`,
  ]
  if (size !== 'md') lines.push(`  size="${size}"`)
  if (state !== 'default') lines.push(`  state="${state}"`)
  lines.push(state === 'error' ? `  errorText="${ERROR}"` : `  helpText="${HELP}"`)
  lines.push('  onChange={setRegion}')
  return `<Select\n${lines.join('\n')}\n/>`
}

/**
 * Size and State are the contract's two props, and the kit's two main axes.
 * Error pairs state with errorText, because an error border that does not say
 * what is wrong is half an error. The menu itself is the browser's.
 */
export function SelectPreview() {
  const [size, setSize] = useState<Size>('md')
  const [state, setState] = useState<State>('default')
  const [value, setValue] = useState('eu')

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
          <Select
            label="State"
            size="sm"
            value={state}
            onChange={(v) => setState(v as State)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'error', label: 'Error' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.field}>
          <Select
            label="Region"
            options={OPTIONS}
            value={value}
            size={size}
            state={state}
            helpText={state === 'error' ? undefined : HELP}
            errorText={state === 'error' ? ERROR : undefined}
            onChange={setValue}
          />
        </div>
      }
      code={codeFor(size, state, value)}
    />
  )
}
