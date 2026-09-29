'use client'

import { useState } from 'react'
import { Tabs } from '@/components/ui/tabs'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Orientation = 'horizontal' | 'vertical'
export type DemoTab = { id: string; label: string; body: string }

function codeFor(orientation: Orientation, tabs: DemoTab[]) {
  const orientationProp = orientation === 'horizontal' ? '' : `\n  orientation="${orientation}"`
  const body = tabs
    .map((t) => `    { id: '${t.id}', label: '${t.label}', panel: <p>${t.body}</p> },`)
    .join('\n')
  return `<Tabs${orientationProp}\n  tabs={[\n${body}\n  ]}\n/>`
}

/**
 * Orientation is the one prop the contract offers. The selected tab is runtime
 * state, so it is left to the reader to click rather than turned into a control.
 */
export function TabsPreview({ tabs }: { tabs: [DemoTab, DemoTab, ...DemoTab[]] }) {
  const [orientation, setOrientation] = useState<Orientation>('horizontal')
  const [first, second, ...rest] = tabs.map((t) => ({
    id: t.id,
    label: t.label,
    panel: <p style={{ margin: 0 }}>{t.body}</p>,
  }))

  return (
    <DemoFrame
      controls={
        <Select
          label="Orientation"
          size="sm"
          value={orientation}
          onChange={(v) => setOrientation(v as Orientation)}
          options={[
            { value: 'horizontal', label: 'Horizontal' },
            { value: 'vertical', label: 'Vertical' },
          ]}
        />
      }
      preview={
        // Keyed on orientation so a switch starts from the first tab, as the
        // printed code would.
        <Tabs key={orientation} orientation={orientation} tabs={[first, second, ...rest]} />
      }
      code={codeFor(orientation, tabs)}
    />
  )
}
