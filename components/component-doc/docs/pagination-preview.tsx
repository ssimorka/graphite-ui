'use client'

import { useState } from 'react'
import { Pagination, PaginationNav } from '@/components/ui/pagination'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './pagination.module.scss'

type Size = 'sm' | 'md' | 'lg'
type Form = 'nav' | 'advanced' | 'simple' | 'unbound'

function codeFor(form: Form, size: Size) {
  const sizeProp = size === 'lg' ? '' : `\n  size="${size}"`
  if (form === 'nav') {
    return `const [page, setPage] = useState(1)\n\n<PaginationNav${sizeProp}\n  page={page}\n  totalPages={30}\n  onChange={setPage}\n/>`
  }
  const typeProp = form === 'advanced' ? '' : `\n  type="${form}"`
  const total = form === 'unbound' ? '\n  hasNext={page < 5}' : '\n  totalItems={243}'
  return `const [{ page, pageSize }, set] = useState({ page: 1, pageSize: 20 })\n\n<Pagination${typeProp}${sizeProp}\n  page={page}\n  pageSize={pageSize}${total}\n  onChange={set}\n/>`
}

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
          <Select
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
          <Select
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
      code={codeFor(form, size)}
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
