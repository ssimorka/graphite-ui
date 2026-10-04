'use client'

import { useState } from 'react'
import { Dropdown } from '@/components/ui/dropdown'
import type { DropdownOption } from '@/components/ui/dropdown'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './dropdown.module.scss'

type Layout = 'fixed' | 'inline' | 'fluid'
type Size = 'sm' | 'md' | 'lg'
type Status = 'enabled' | 'error' | 'warning' | 'disabled' | 'read-only'

const OPTIONS: DropdownOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Match the system' },
  { value: 'contrast', label: 'High contrast' },
  { value: 'sepia', label: 'Sepia', disabled: true },
  { value: 'print', label: 'Print' },
]

const ERROR = 'Choose a theme'
const WARNING = 'High contrast overrides your source colour'

function codeFor(layout: Layout, size: Size, status: Status) {
  const props = [
    layout === 'fixed' ? '' : `\n  layout="${layout}"`,
    layout === 'fluid' || size === 'lg' ? '' : `\n  size="${size}"`,
    status === 'error' ? `\n  errorText="${ERROR}"` : '',
    status === 'warning' ? `\n  warningText="${WARNING}"` : '',
    status === 'disabled' ? '\n  disabled' : '',
    status === 'read-only' ? '\n  readOnly' : '',
  ].join('')
  return `const [value, setValue] = useState<string | null>(null)\n\n<Dropdown\n  label="Theme"\n  options={options}${props}\n  value={value}\n  onChange={setValue}\n/>`
}

/** Style, Size and the states, live. */
export function DropdownPreview() {
  const [layout, setLayout] = useState<Layout>('fixed')
  const [size, setSize] = useState<Size>('lg')
  const [status, setStatus] = useState<Status>('enabled')
  const [value, setValue] = useState<string | null>(null)
  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Style"
            size="sm"
            value={layout}
            onChange={(v) => setLayout(v as Layout)}
            options={[
              { value: 'fixed', label: 'Fixed' },
              { value: 'inline', label: 'Inline' },
              { value: 'fluid', label: 'Fluid' },
            ]}
          />
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
            value={status}
            onChange={(v) => setStatus(v as Status)}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'error', label: 'Error' },
              { value: 'warning', label: 'Warning' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'read-only', label: 'Read-only' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.stage}>
          <Dropdown
            label="Theme"
            options={OPTIONS}
            value={value}
            onChange={setValue}
            layout={layout}
            size={size}
            helpText="Applies to every page"
            errorText={status === 'error' ? ERROR : undefined}
            warningText={status === 'warning' ? WARNING : undefined}
            disabled={status === 'disabled'}
            readOnly={status === 'read-only'}
          />
        </div>
      }
      code={codeFor(layout, size, status)}
    />
  )
}

/** A still the server-rendered page can place: it owns its own value. */
export function DropdownStill({
  layout = 'fixed',
  size,
  status = 'enabled',
  chosen = false,
}: {
  layout?: Layout
  size?: Size
  status?: Status
  chosen?: boolean
}) {
  const [value, setValue] = useState<string | null>(chosen ? 'dark' : null)
  return (
    <div className={layout === 'inline' ? styles.wide : styles.measure}>
      <Dropdown
        label="Theme"
        options={OPTIONS}
        value={value}
        onChange={setValue}
        layout={layout}
        size={size}
        helpText="Applies to every page"
        errorText={status === 'error' ? ERROR : undefined}
        warningText={status === 'warning' ? WARNING : undefined}
        disabled={status === 'disabled'}
        readOnly={status === 'read-only'}
      />
    </div>
  )
}
