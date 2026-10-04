'use client'

import { useState } from 'react'
import { ComboBox, Dropdown, MultiSelect } from '@/components/ui/dropdown'
import type { DropdownOption } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './dropdown.module.scss'

type Kind = 'dropdown' | 'combo' | 'multi' | 'filterable'
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

function codeFor(kind: Kind, layout: Layout, size: Size, status: Status) {
  const props = [
    layout === 'fixed' ? '' : `\n  layout="${layout}"`,
    layout === 'fluid' || size === 'lg' ? '' : `\n  size="${size}"`,
    status === 'error' ? `\n  errorText="${ERROR}"` : '',
    status === 'warning' ? `\n  warningText="${WARNING}"` : '',
    status === 'disabled' ? '\n  disabled' : '',
    status === 'read-only' ? '\n  readOnly' : '',
  ].join('')
  return `const [value, setValue] = ${kind === 'multi' || kind === 'filterable' ? 'useState<string[]>([])' : 'useState<string | null>(null)'}\n\n<${kind === 'combo' ? 'ComboBox' : kind === 'dropdown' ? 'Dropdown' : 'MultiSelect'}${kind === 'filterable' ? '\n  filterable' : ''}${kind === 'multi' || kind === 'filterable' ? '\n  selectAll' : ''}\n  label="Theme"\n  options={options}${props}\n  value={value}\n  onChange={setValue}\n/>`
}

/** Style, Size and the states, live. */
export function DropdownPreview() {
  const [kind, setKind] = useState<Kind>('dropdown')
  const [layout, setLayout] = useState<Layout>('fixed')
  const [size, setSize] = useState<Size>('lg')
  const [status, setStatus] = useState<Status>('enabled')
  const [value, setValue] = useState<string | null>(null)
  const [values, setValues] = useState<string[]>([])
  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Kind"
            size="sm"
            value={kind}
            onChange={(v) => setKind(v as Kind)}
            options={[
              { value: 'dropdown', label: 'Dropdown' },
              { value: 'combo', label: 'Combo box' },
              { value: 'multi', label: 'Multi-select' },
              { value: 'filterable', label: 'Filterable multi-select' },
            ]}
          />
          <Dropdown
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
          {kind === 'multi' || kind === 'filterable' ? (
            <MultiSelect
              label="Themes"
              options={OPTIONS}
              value={values}
              onChange={setValues}
              filterable={kind === 'filterable'}
              selectAll
              layout={kind === 'filterable' && layout === 'inline' ? 'fixed' : layout}
              size={size}
              helpText="Choose any number"
              errorText={status === 'error' ? ERROR : undefined}
              warningText={status === 'warning' ? WARNING : undefined}
              disabled={status === 'disabled'}
              readOnly={status === 'read-only'}
            />
          ) : kind === 'combo' ? (
            <ComboBox
              label="Theme"
              options={OPTIONS}
              value={value}
              onChange={setValue}
              layout={layout === 'inline' ? 'fixed' : layout}
              size={size}
              helpText="Type to filter"
              errorText={status === 'error' ? ERROR : undefined}
              warningText={status === 'warning' ? WARNING : undefined}
              disabled={status === 'disabled'}
              readOnly={status === 'read-only'}
            />
          ) : (
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
          )}
        </div>
      }
      code={codeFor(kind, layout, size, status)}
    />
  )
}

/** A still the server-rendered page can place: it owns its own value. */
export function DropdownStill({
  kind = 'dropdown',
  layout = 'fixed',
  size,
  status = 'enabled',
  chosen = false,
}: {
  kind?: Kind
  layout?: Layout
  size?: Size
  status?: Status
  chosen?: boolean
}) {
  const [value, setValue] = useState<string | null>(chosen ? 'dark' : null)
  const [values, setValues] = useState<string[]>(chosen ? ['dark', 'contrast'] : [])
  return (
    <div className={layout === 'inline' ? styles.wide : styles.measure}>
      {kind === 'multi' || kind === 'filterable' ? (
        <MultiSelect
            label="Themes"
            options={OPTIONS}
            value={values}
            onChange={setValues}
            filterable={kind === 'filterable'}
            selectAll
            layout={kind === 'filterable' && layout === 'inline' ? 'fixed' : layout}
            size={size}
            helpText="Choose any number"
            errorText={status === 'error' ? ERROR : undefined}
            warningText={status === 'warning' ? WARNING : undefined}
            disabled={status === 'disabled'}
            readOnly={status === 'read-only'}
        />
      ) : kind === 'combo' ? (
        <ComboBox
            label="Theme"
            options={OPTIONS}
            value={value}
            onChange={setValue}
            layout={layout === 'inline' ? 'fixed' : layout}
            size={size}
            helpText="Type to filter"
            errorText={status === 'error' ? ERROR : undefined}
            warningText={status === 'warning' ? WARNING : undefined}
            disabled={status === 'disabled'}
            readOnly={status === 'read-only'}
        />
      ) : (
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
      )}
    </div>
  )
}
