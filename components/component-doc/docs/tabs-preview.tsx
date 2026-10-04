'use client'

import { useState } from 'react'
import { Tabs } from '@/components/ui/tabs'
import type { Tab } from '@/components/ui/tabs'
import type { KitIconName } from '@/lib/kit-icons'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Orientation = 'horizontal' | 'vertical'
type Variant = 'line' | 'contained'
type Kind = 'text' | 'icon'
export type DemoTab = { id: string; label: string; body: string; icon: KitIconName }

function codeFor(orientation: Orientation, variant: Variant, kind: Kind, tabs: DemoTab[]) {
  const props = [
    ...(orientation === 'horizontal' ? [] : [`  orientation="${orientation}"`]),
    ...(variant === 'line' || orientation === 'vertical' ? [] : [`  variant="${variant}"`]),
    ...(kind === 'icon' && orientation === 'horizontal' ? ['  iconOnly'] : []),
  ]
  const body = tabs
    .map(
      (t) =>
        `    { id: '${t.id}', label: '${t.label}',${kind === 'icon' ? ` icon: '${t.icon}',` : ''} panel: <p>${t.body}</p> },`,
    )
    .join('\n')
  const head = props.length ? `\n${props.join('\n')}` : ''
  return `<Tabs${head}\n  tabs={[\n${body}\n  ]}\n/>`
}

/**
 * Orientation, Style and Type. The selected tab is runtime state, so it is
 * left to the reader to click rather than turned into a control.
 */
export function TabsPreview({ tabs }: { tabs: [DemoTab, DemoTab, ...DemoTab[]] }) {
  const [orientation, setOrientation] = useState<Orientation>('horizontal')
  const [variant, setVariant] = useState<Variant>('line')
  const [kind, setKind] = useState<Kind>('text')
  const horizontal = orientation === 'horizontal'
  const [first, second, ...rest] = tabs.map((t) => ({
    id: t.id,
    label: t.label,
    icon: kind === 'icon' ? t.icon : undefined,
    panel: <p style={{ margin: 0 }}>{t.body}</p>,
  }))

  return (
    <DemoFrame
      controls={
        <>
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
          <Select
            label="Style"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            state={horizontal ? 'default' : 'disabled'}
            options={[
              { value: 'line', label: 'Line' },
              { value: 'contained', label: 'Contained' },
            ]}
          />
          <Select
            label="Type"
            size="sm"
            value={kind}
            onChange={(v) => setKind(v as Kind)}
            state={horizontal ? 'default' : 'disabled'}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'icon', label: 'Icon only' },
            ]}
          />
        </>
      }
      preview={
        // Keyed on orientation so a switch starts from the first tab, as the
        // printed code would.
        <Tabs
          key={orientation}
          orientation={orientation}
          variant={variant}
          iconOnly={kind === 'icon' && horizontal}
          tabs={[first, second, ...rest]}
        />
      }
      code={codeFor(orientation, variant, kind, tabs)}
    />
  )
}

const DISMISSIBLE: Tab[] = [
  { id: 'overview', label: 'Overview', panel: null },
  { id: 'tokens', label: 'Tokens', panel: null },
  { id: 'usage', label: 'Usage', panel: null },
  { id: 'history', label: 'History', panel: null },
]

/**
 * Dismissible tabs, live: the close glyph or Delete removes a tab, down to
 * the contract's minimum of two. A reload brings them back.
 */
export function DismissibleTabs() {
  const [tabs, setTabs] = useState(DISMISSIBLE)
  const [first, second, ...rest] = tabs
  return first && second ? (
    <Tabs
      tabs={[first, second, ...rest]}
      onDismiss={(id) => setTabs((all) => (all.length > 2 ? all.filter((t) => t.id !== id) : all))}
    />
  ) : null
}
