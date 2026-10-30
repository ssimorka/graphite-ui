'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/select'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { ERROR, exampleFor, HELP, OPTIONS } from './select-code'
import type { Size, State } from './select-code'
import styles from './select.module.scss'

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
          <Dropdown
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
          <Dropdown
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
      example={exampleFor({ size, state, value })}
    />
  )
}
