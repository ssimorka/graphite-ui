'use client'

import { useState } from 'react'
import { ContainedList } from '@/components/ui/contained-list'
import { Select } from '@/components/ui/select'
import { Tag } from '@/components/ui/tag'
import { DemoFrame } from '../demo-frame'
import styles from './contained-list.module.scss'

type Density = 'compact' | 'default'
export type DemoRow = { id: string; tag: string; title: string; description: string; status: string }

function codeFor(density: Density, interactive: boolean, rows: DemoRow[]) {
  const densityProp = density === 'default' ? '' : `\n  density="${density}"`
  const interactiveProp = interactive ? '\n  interactive' : ''
  return rows
    .map(
      (r) =>
        `<ContainedList${densityProp}${interactiveProp}\n  leading={<Tag>${r.tag}</Tag>}\n  title="${r.title}"\n  description="${r.description}"\n  trailing={<Tag variant="success">${r.status}</Tag>}\n/>`,
    )
    .join('\n')
}

/**
 * Density and interactive, the contract's two props. Interactive only adds
 * the hover tone-step, so the control says what it does.
 */
export function ContainedListPreview({ rows }: { rows: DemoRow[] }) {
  const [density, setDensity] = useState<Density>('default')
  const [interactive, setInteractive] = useState(false)

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Density"
            size="sm"
            value={density}
            onChange={(v) => setDensity(v as Density)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'compact', label: 'Compact' },
            ]}
          />
          <Select
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
          {rows.map((r) => (
            <ContainedList
              key={r.id}
              density={density}
              interactive={interactive}
              leading={<Tag>{r.tag}</Tag>}
              title={r.title}
              description={r.description}
              trailing={<Tag variant="success">{r.status}</Tag>}
            />
          ))}
        </div>
      }
      code={codeFor(density, interactive, rows)}
    />
  )
}
