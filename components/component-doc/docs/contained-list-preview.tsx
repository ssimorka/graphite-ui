'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ContainedList, ContainedListHeader } from '@/components/ui/contained-list'
import { Dropdown } from '@/components/ui/dropdown'
import { Tag } from '@/components/ui/tag'
import { KitIcon } from '@/components/kit-icon'
import { DemoFrame } from '../demo-frame'
import styles from './contained-list.module.scss'

type Size = 'sm' | 'md' | 'lg' | 'xl'
type Kind = 'on-page' | 'disclosed'
export type DemoRow = { id: string; tag: string; title: string; description: string; status: string }

const ICON_SIZE: Record<Size, 'icon-sm' | 'icon' | 'icon-lg'> = {
  sm: 'icon-sm',
  md: 'icon',
  lg: 'icon-lg',
  xl: 'icon-lg',
}

/** The kit's trailing action: a ghost icon button as tall as the row. */
const rowAction = (size: Size, label: string) => (
  <Button variant="ghost" size={ICON_SIZE[size]} aria-label={label}>
    <KitIcon name="menu-dots" />
  </Button>
)

function codeFor(size: Size, kind: Kind, interactive: boolean, rows: DemoRow[]) {
  const sizeProp = size === 'lg' ? '' : `\n  size="${size}"`
  const interactiveProp = interactive ? '\n  interactive' : ''
  const header = `<ContainedListHeader${kind === 'on-page' ? '' : ' variant="disclosed"'}${size === 'lg' ? '' : ` size="${size}"`} title="Components" />`
  return [
    header,
    ...rows.map(
      (r) =>
        `<ContainedList${sizeProp}${interactiveProp}\n  leading={<Tag>${r.tag}</Tag>}\n  title="${r.title}"\n  trailing={<Button variant="ghost" size="${ICON_SIZE[size]}" aria-label="${r.title} actions">…</Button>}\n/>`,
    ),
  ].join('\n')
}

/**
 * The kit's axes: the list's Type, the row's Size, and interactive, which
 * turns on the hover and active tone steps.
 */
export function ContainedListPreview({ rows }: { rows: DemoRow[] }) {
  const [size, setSize] = useState<Size>('lg')
  const [kind, setKind] = useState<Kind>('on-page')
  const [interactive, setInteractive] = useState(true)

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Type"
            size="sm"
            value={kind}
            onChange={(v) => setKind(v as Kind)}
            options={[
              { value: 'on-page', label: 'On page' },
              { value: 'disclosed', label: 'Disclosed' },
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
              { value: 'xl', label: 'Extra large' },
            ]}
          />
          <Dropdown
            label="Interactive"
            size="sm"
            value={interactive ? 'true' : 'false'}
            onChange={(v) => setInteractive(v === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.list}>
          <ContainedListHeader variant={kind} size={size} title="Components" />
          {rows.map((r) => (
            <ContainedList
              key={r.id}
              size={size}
              interactive={interactive}
              leading={<Tag>{r.tag}</Tag>}
              title={r.title}
              description={size === 'xl' ? r.description : undefined}
              trailing={rowAction(size, `${r.title} actions`)}
            />
          ))}
        </div>
      }
      code={codeFor(size, kind, interactive, rows)}
    />
  )
}
