'use client'

import { useState } from 'react'
import { ComboBox, Dropdown, MultiSelect } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './dropdown.module.scss'
import { ERROR, exampleFor, HELP, layoutFor, OPTIONS, WARNING } from './dropdown-code'
import type { Kind, Layout, Size, Status } from './dropdown-code'

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
              layout={layoutFor(kind, layout)}
              size={size}
              helpText={HELP[kind]}
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
              layout={layoutFor(kind, layout)}
              size={size}
              helpText={HELP[kind]}
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
            helpText={HELP[kind]}
            errorText={status === 'error' ? ERROR : undefined}
            warningText={status === 'warning' ? WARNING : undefined}
            disabled={status === 'disabled'}
            readOnly={status === 'read-only'}
          />
          )}
        </div>
      }
      example={exampleFor({ kind, layout, size, status })}
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
            layout={layoutFor(kind, layout)}
            size={size}
            helpText={HELP[kind]}
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
            layout={layoutFor(kind, layout)}
            size={size}
            helpText={HELP[kind]}
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
        helpText={HELP[kind]}
        errorText={status === 'error' ? ERROR : undefined}
        warningText={status === 'warning' ? WARNING : undefined}
        disabled={status === 'disabled'}
        readOnly={status === 'read-only'}
      />
      )}
    </div>
  )
}
