'use client'

import { useState } from 'react'
import type { MouseEvent } from 'react'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import type { NavItem } from '@/components/ui/navigation-menu'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Orientation = 'horizontal' | 'vertical'

const TOP = [
  { label: 'Overview', href: '#overview' },
  { label: 'Foundations', href: '#foundations' },
  { label: 'Components', href: '#components' },
]
const NESTED = [
  { label: 'Button', href: '#button' },
  { label: 'Tabs', href: '#tabs' },
]

function build(nested: boolean, current: string): [NavItem, ...NavItem[]] {
  return TOP.map((item) => ({
    ...item,
    ...(item.href === current ? { current: true } : {}),
    ...(nested && item.label === 'Components'
      ? {
          items: NESTED.map((c) => ({
            ...c,
            ...(c.href === current ? { current: true } : {}),
          })),
        }
      : {}),
  })) as [NavItem, ...NavItem[]]
}

function line(i: { label: string; href: string; current?: boolean }) {
  return `label: '${i.label}', href: '${i.href}'${i.current ? ', current: true' : ''}`
}

function codeFor(items: NavItem[], orientation: Orientation) {
  const rows = items
    .map((i) => {
      if (!i.items) return `    { ${line(i)} },`
      const kids = i.items.map((c) => `        { ${line(c)} },`).join('\n')
      return `    {\n      ${line(i)},\n      items: [\n${kids}\n      ],\n    },`
    })
    .join('\n')
  const o = orientation === 'horizontal' ? '' : `\n  orientation="${orientation}"`
  return `<NavigationMenu\n  label="Docs"${o}\n  items={[\n${rows}\n  ]}\n/>`
}

/**
 * Orientation, the contract's one prop, and Nested, its optional slot. The
 * links are live: clicking one moves `current` to it, which is how a caller
 * drives the component (it holds no state of its own). The click handler sits
 * on a wrapper so the demo does not add a prop the component lacks.
 */
export function NavigationMenuPreview() {
  const [orientation, setOrientation] = useState<Orientation>('horizontal')
  const [nested, setNested] = useState(false)
  const [current, setCurrent] = useState('#overview')
  const items = build(nested, current)

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest('a')
    if (!a) return
    e.preventDefault()
    setCurrent(a.getAttribute('href') ?? current)
  }

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
            label="Nested items"
            size="sm"
            value={nested ? 'on' : 'off'}
            onChange={(v) => {
              setNested(v === 'on')
              // A nested link that disappears cannot stay current.
              if (v === 'off' && NESTED.some((c) => c.href === current)) setCurrent('#components')
            }}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
          />
        </>
      }
      preview={
        <div onClick={onClick}>
          <NavigationMenu label="Docs" orientation={orientation} items={items} />
        </div>
      }
      code={codeFor(items, orientation)}
    />
  )
}
