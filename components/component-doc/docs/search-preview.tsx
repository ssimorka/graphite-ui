'use client'

import { useState } from 'react'
import { Search } from '@/components/ui/search'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './search.module.scss'

type Size = 'sm' | 'md' | 'lg'
type Layout = 'default' | 'fluid'

const LABEL = 'Search components'

function codeFor(size: Size, layout: Layout, expandable: boolean) {
  const props = [
    `  label="${LABEL}"`,
    '  placeholder="Search components"',
    ...(layout === 'fluid' ? ['  layout="fluid"'] : size === 'lg' ? [] : [`  size="${size}"`]),
    ...(expandable && layout === 'default' ? ['  expandable'] : []),
    '  value={query}',
    '  onChange={setQuery}',
  ]
  return `const [query, setQuery] = useState('')\n\n<Search\n${props.join('\n')}\n/>`
}

/**
 * The kit's axes: Size, the two sets (Default and Fluid) and Expandable. The
 * value is real state here, so the clear and Escape work as they do in use.
 */
export function SearchPreview() {
  const [size, setSize] = useState<Size>('lg')
  const [layout, setLayout] = useState<Layout>('default')
  const [expandable, setExpandable] = useState(false)
  const [query, setQuery] = useState('')
  const fluid = layout === 'fluid'

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Set"
            size="sm"
            value={layout}
            onChange={(v) => setLayout(v as Layout)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'fluid', label: 'Fluid' },
            ]}
          />
          <Dropdown
            label="Size"
            size="sm"
            value={size}
            disabled={fluid}
            onChange={(v) => setSize(v as Size)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
          <Dropdown
            label="Expandable"
            size="sm"
            value={expandable ? 'true' : 'false'}
            disabled={fluid}
            onChange={(v) => setExpandable(v === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.measure}>
          <Search
            key={`${layout}-${expandable}`}
            label={LABEL}
            placeholder="Search components"
            size={size}
            layout={layout}
            expandable={expandable}
            value={query}
            onChange={setQuery}
          />
        </div>
      }
      code={codeFor(size, layout, expandable)}
    />
  )
}

/** A still with a value, so the clear shows. */
export function SearchFilled(props: { size?: Size; layout?: Layout; disabled?: boolean }) {
  const [query, setQuery] = useState('Tabs')
  return (
    <Search
      label={LABEL}
      placeholder="Search components"
      size={props.size}
      layout={props.layout}
      disabled={props.disabled}
      value={query}
      onChange={setQuery}
    />
  )
}
