'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { ContainedList } from '@/components/ui/contained-list'
import { Tag } from '@/components/ui/tag'
import { DataTable } from '@/components/ui/data-table'
import type { Column, Sort } from '@/components/ui/data-table'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './data-table.module.scss'

type Density = 'compact' | 'default'
export type DemoRow = { component: string; wave: string; version: string }

const CAPTION = 'Governed components'
const HEADERS: [keyof DemoRow, string][] = [
  ['component', 'Component'],
  ['wave', 'Wave'],
  ['version', 'Contract'],
]

function sorted(rows: DemoRow[], sort: Sort | undefined) {
  if (!sort) return rows
  const key = sort.key as keyof DemoRow
  const out = [...rows].sort((a, b) => a[key].localeCompare(b[key], undefined, { numeric: true }))
  return sort.direction === 'asc' ? out : out.reverse()
}

function codeFor(density: Density, sortable: boolean, sort: Sort) {
  const densityProp = density === 'default' ? '' : `\n  density="${density}"`
  const cols = HEADERS.map(
    ([key, header]) =>
      `    { key: '${key}', header: '${header}'${sortable ? ', sortable: true' : ''} },`,
  ).join('\n')
  const state = sortable
    ? `// The table renders rows in the order it is given. sortRows is yours.\nconst [sort, setSort] = useState<Sort>({ key: '${sort.key}', direction: '${sort.direction}' })\n\n`
    : ''
  const sortProps = sortable
    ? `\n  sort={sort}\n  onSortChange={(key) =>\n    setSort((s) => ({\n      key,\n      direction: s.key === key && s.direction === 'asc' ? 'desc' : 'asc',\n    }))\n  }`
    : ''
  return `${state}<DataTable\n  caption="${CAPTION}"${densityProp}\n  columns={[\n${cols}\n  ]}\n  rows={${sortable ? 'sortRows(rows, sort)' : 'rows'}}\n  getRowKey={(row) => row.component}${sortProps}\n/>`
}

/**
 * The contract's two props, density and sortable columns. Sorting itself is
 * the caller's: the table reports which header was pressed and renders the
 * order it is given, so the preview keeps the sort state here, as a page would.
 */
export function DataTablePreview({ rows }: { rows: DemoRow[] }) {
  const [density, setDensity] = useState<Density>('default')
  const [sortable, setSortable] = useState(true)
  const [sort, setSort] = useState<Sort>({ key: 'component', direction: 'asc' })

  const columns = HEADERS.map(([key, header]) => ({ key, header, sortable })) as [
    Column<DemoRow>,
    ...Column<DemoRow>[],
  ]

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
            label="Sortable columns"
            size="sm"
            value={sortable ? 'true' : 'false'}
            onChange={(v) => setSortable(v === 'true')}
            options={[
              { value: 'true', label: 'True' },
              { value: 'false', label: 'False' },
            ]}
          />
        </>
      }
      preview={
        <DataTable
          caption={CAPTION}
          density={density}
          columns={columns}
          rows={sortable ? sorted(rows, sort) : rows}
          getRowKey={(row) => row.component}
          sort={sortable ? sort : undefined}
          onSortChange={
            sortable
              ? (key) =>
                  setSort((s) => ({
                    key,
                    direction: s.key === key && s.direction === 'asc' ? 'desc' : 'asc',
                  }))
              : undefined
          }
        />
      }
      code={codeFor(density, sortable, sort)}
    />
  )
}

/**
 * A static table for the anatomy, variants and states. DataTable is a client
 * component that takes functions (getRowKey, render), which a server config
 * cannot pass across the boundary, so the functions are built here instead.
 */
export function DataTableSample({
  rows,
  density,
  sortable = false,
  sort,
  footer,
  withRow = false,
}: {
  rows: DemoRow[]
  density?: Density
  sortable?: boolean
  sort?: Sort
  footer?: ReactNode
  /** Render the first column as a Contained list, as the contract suggests. */
  withRow?: boolean
}) {
  const columns = HEADERS.map(([key, header], i) => ({
    key,
    header,
    sortable,
    render:
      withRow && i === 0
        ? (row: DemoRow) => (
            <ContainedList
              size="sm"
              leading={<Tag>{row.component.slice(0, 2).toUpperCase()}</Tag>}
              title={row.component}
            />
          )
        : undefined,
  })) as [Column<DemoRow>, ...Column<DemoRow>[]]

  return (
    <div className={styles.measure}>
      <DataTable
        caption={CAPTION}
        density={density}
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.component}
        sort={sort}
        onSortChange={sortable ? () => {} : undefined}
        footer={footer}
      />
    </div>
  )
}
