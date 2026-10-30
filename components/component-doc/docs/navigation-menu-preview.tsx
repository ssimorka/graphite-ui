'use client'

import { useState } from 'react'
import type { MouseEvent } from 'react'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { build, exampleFor, NESTED } from './navigation-menu-code'
import type { Orientation } from './navigation-menu-code'

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
          <Dropdown
            label="Orientation"
            size="sm"
            value={orientation}
            onChange={(v) => setOrientation(v as Orientation)}
            options={[
              { value: 'horizontal', label: 'Horizontal' },
              { value: 'vertical', label: 'Vertical' },
            ]}
          />
          <Dropdown
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
      example={exampleFor({ orientation, nested, current })}
    />
  )
}
