'use client'

import { useState } from 'react'
import { Pagination, PaginationNav } from '@/components/ui/pagination'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './pagination.module.scss'
import { exampleFor } from './pagination-code'
import type { Form, Size } from './pagination-code'

/** The kit's two sets, the bar's three types, and Size, all live. */
export function PaginationPreview() {
  const [form, setForm] = useState<Form>('nav')
  const [size, setSize] = useState<Size>('lg')
  const [nav, setNav] = useState(1)
  const [bar, setBar] = useState({ page: 1, pageSize: 20 })

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Form"
            size="sm"
            value={form}
            onChange={(v) => setForm(v as Form)}
            options={[
              { value: 'nav', label: 'Nav' },
              { value: 'advanced', label: 'Table bar: Advanced' },
              { value: 'simple', label: 'Table bar: Simple' },
              { value: 'unbound', label: 'Table bar: Unbound' },
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
            ]}
          />
        </>
      }
      preview={
        <div className={styles.measure}>
          {form === 'nav' ? (
            <PaginationNav page={nav} totalPages={30} onChange={setNav} size={size} />
          ) : (
            <Pagination
              type={form}
              size={size}
              page={bar.page}
              pageSize={bar.pageSize}
              totalItems={form === 'unbound' ? undefined : 243}
              hasNext={bar.page < 5}
              onChange={setBar}
            />
          )}
        </div>
      }
      example={exampleFor({ form, size })}
    />
  )
}

/** A still the server-rendered page can place: it owns its own state. */
export function PaginationStill({ form = 'nav', size, page = 1 }: { form?: Form; size?: Size; page?: number }) {
  const [nav, setNav] = useState(page)
  const [bar, setBar] = useState({ page, pageSize: 20 })
  return (
    <div className={styles.measure}>
      {form === 'nav' ? (
        <PaginationNav page={nav} totalPages={30} onChange={setNav} size={size} />
      ) : (
        <Pagination
          type={form}
          size={size}
          page={bar.page}
          pageSize={bar.pageSize}
          totalItems={form === 'unbound' ? undefined : 243}
          hasNext
          onChange={setBar}
        />
      )}
    </div>
  )
}
