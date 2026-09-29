'use client'

import { useState } from 'react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import type { Crumb } from '@/components/ui/breadcrumb'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

// Six levels of a plausible product, deepest last. The trail takes the first
// n of them, so the last one shown is always the page "you are on".
const LEVELS = ['Home', 'Projects', 'Graphite', 'Settings', 'Members', 'Invitations']

function trail(length: number): [Crumb, ...Crumb[]] {
  const labels = LEVELS.slice(0, length)
  return labels.map((label, i) =>
    i === labels.length - 1 ? { label } : { label, href: '#' },
  ) as [Crumb, ...Crumb[]]
}

function codeFor(items: Crumb[], maxItems: number) {
  const rows = items
    .map((c) =>
      c.href ? `    { label: '${c.label}', href: '${c.href}' },` : `    { label: '${c.label}' },`,
    )
    .join('\n')
  const max = maxItems === 4 ? '' : `\n  maxItems={${maxItems}}`
  return `<Breadcrumb\n  items={[\n${rows}\n  ]}${max}\n/>`
}

/**
 * Length and Max items. The contract's one prop, separator style, is fixed by
 * design and so has no control. Length against maxItems is what the contract's
 * prohibition is about: past the limit the middle collapses rather than wraps.
 */
export function BreadcrumbPreview() {
  const [length, setLength] = useState(4)
  const [maxItems, setMaxItems] = useState(4)
  const items = trail(length)

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Length"
            size="sm"
            value={String(length)}
            onChange={(v) => setLength(Number(v))}
            options={[
              { value: '2', label: '2 crumbs' },
              { value: '4', label: '4 crumbs' },
              { value: '6', label: '6 crumbs' },
            ]}
          />
          <Select
            label="Max items"
            size="sm"
            value={String(maxItems)}
            onChange={(v) => setMaxItems(Number(v))}
            options={[
              { value: '3', label: '3' },
              { value: '4', label: '4 (default)' },
              { value: '6', label: '6' },
            ]}
          />
        </>
      }
      preview={<Breadcrumb items={items} maxItems={maxItems} />}
      code={codeFor(items, maxItems)}
    />
  )
}
