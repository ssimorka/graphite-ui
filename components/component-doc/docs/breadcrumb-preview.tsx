'use client'

import { useState } from 'react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { exampleFor, trail } from './breadcrumb-code'

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
          <Dropdown
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
          <Dropdown
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
      example={exampleFor({ length, maxItems })}
    />
  )
}
