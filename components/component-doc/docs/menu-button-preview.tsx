'use client'

import { useState } from 'react'
import { ComboButton, MenuButton, OverflowMenu } from '@/components/ui/menu-button'
import type { MenuItem } from '@/components/ui/menu'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './menu-button.module.scss'

type Form = 'menu' | 'combo' | 'overflow'
type Size = 'sm' | 'md' | 'lg'

const noop = () => {}
const ITEMS: [MenuItem, ...MenuItem[]] = [
  { label: 'Duplicate', onSelect: noop },
  { label: 'Rename', onSelect: noop },
  { label: 'Move to folder', onSelect: noop },
  { kind: 'separator' },
  { label: 'Delete', onSelect: noop, destructive: true },
]

function codeFor(form: Form, size: Size, placement: 'bottom' | 'top', align: 'start' | 'end') {
  const props = [
    size === 'lg' ? '' : `\n  size="${size}"`,
    placement === 'bottom' ? '' : '\n  placement="top"',
    form === 'overflow' && align === 'end' ? '\n  align="end"' : '',
  ].join('')
  if (form === 'menu') return `<MenuButton\n  label="Actions"${props}\n  items={items}\n/>`
  if (form === 'combo') return `<ComboButton\n  label="Save"\n  onClick={save}${props}\n  items={items}\n/>`
  return `<OverflowMenu${props}\n  items={items}\n/>`
}

/** The three sets, Size, Position and Alignment, live. */
export function MenuButtonPreview() {
  const [form, setForm] = useState<Form>('menu')
  const [size, setSize] = useState<Size>('lg')
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom')
  const [align, setAlign] = useState<'start' | 'end'>('start')
  const common = { items: ITEMS, size, placement }
  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Set"
            size="sm"
            value={form}
            onChange={(v) => setForm(v as Form)}
            options={[
              { value: 'menu', label: 'Menu button' },
              { value: 'combo', label: 'Combo button' },
              { value: 'overflow', label: 'Overflow' },
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
            label="Position"
            size="sm"
            value={placement}
            onChange={(v) => setPlacement(v as 'bottom' | 'top')}
            options={[
              { value: 'bottom', label: 'Bottom' },
              { value: 'top', label: 'Top' },
            ]}
          />
          <Select
            label="Alignment"
            size="sm"
            value={align}
            onChange={(v) => setAlign(v as 'start' | 'end')}
            options={[
              { value: 'start', label: 'Start' },
              { value: 'end', label: 'End' },
            ]}
          />
        </>
      }
      preview={
        <div className={`${styles.stage} ${placement === 'top' ? styles.top : ''} ${align === 'end' ? styles.end : ''}`}>
          {form === 'menu' ? (
            <MenuButton label="Actions" {...common} />
          ) : form === 'combo' ? (
            <ComboButton label="Save" onClick={noop} {...common} />
          ) : (
            <OverflowMenu align={align} {...common} />
          )}
        </div>
      }
      code={codeFor(form, size, placement, align)}
    />
  )
}

/** A still the server-rendered page can place. */
export function MenuButtonStill({ form = 'menu', size, disabled }: { form?: Form; size?: Size; disabled?: boolean }) {
  if (form === 'combo') return <ComboButton label="Save" onClick={noop} items={ITEMS} size={size} disabled={disabled} />
  if (form === 'overflow') return <OverflowMenu items={ITEMS} size={size} disabled={disabled} />
  return <MenuButton label="Actions" items={ITEMS} size={size} disabled={disabled} />
}
