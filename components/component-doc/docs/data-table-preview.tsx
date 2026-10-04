'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ContainedList } from '@/components/ui/contained-list'
import { KitIcon } from '@/components/kit-icon'
import { Tag } from '@/components/ui/tag'
import { DataTable } from '@/components/ui/data-table'
import type { Column, Sort } from '@/components/ui/data-table'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './data-table.module.scss'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Kind = 'default' | 'checkbox' | 'radio' | 'expandable' | 'expandable-select' | 'batch'
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

function codeFor(size: Size, kind: Kind, sortable: boolean, sort: Sort) {
  const sizeProp = size === 'lg' ? '' : `\n  size="${size}"`
  const kindProps =
    kind === 'checkbox' || kind === 'batch'
      ? '\n  selectable="checkbox"'
      : kind === 'radio'
        ? '\n  selectable="radio"'
        : kind === 'expandable'
          ? '\n  expandable={(row) => <p>…</p>}'
          : kind === 'expandable-select'
            ? '\n  selectable="checkbox"\n  expandable={(row) => <p>…</p>}'
            : ''
  const batchProp = kind === 'batch' ? '\n  batchActions={(keys) => <Button variant="primary">Archive</Button>}' : ''
  const densityProp = `${sizeProp}${kindProps}${batchProp}`
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

const DETAIL = (row: DemoRow) => `${row.component} is on contract ${row.version}, wave ${row.wave}.`

/**
 * The kit's Type and Size, and sortable columns. Sorting itself is the
 * caller's: the table reports which header was pressed and renders the order
 * it is given, so the preview keeps the sort state here, as a page would.
 */
export function DataTablePreview({ rows }: { rows: DemoRow[] }) {
  const [size, setSize] = useState<Size>('lg')
  const [kind, setKind] = useState<Kind>('default')
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
            label="Type"
            size="sm"
            value={kind}
            onChange={(v) => setKind(v as Kind)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'checkbox', label: 'Select checkbox' },
              { value: 'radio', label: 'Select radio' },
              { value: 'expandable', label: 'Expandable' },
              { value: 'expandable-select', label: 'Expandable + Selectable' },
              { value: 'batch', label: 'Batch actions' },
            ]}
          />
          <Select
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={[
              { value: 'xs', label: 'Extra small' },
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra large' },
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
          key={kind}
          caption={CAPTION}
          description="Read from each component's own contract."
          size={size}
          selectable={kind === 'checkbox' || kind === 'batch' || kind === 'expandable-select' ? 'checkbox' : kind === 'radio' ? 'radio' : undefined}
          expandable={kind === 'expandable' || kind === 'expandable-select' ? (row) => <p style={{ margin: 0 }}>{DETAIL(row)}</p> : undefined}
          batchActions={
            kind === 'batch'
              ? () => (
                  <Button variant="primary">
                    Archive <KitIcon name="trash" />
                  </Button>
                )
              : undefined
          }
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
      code={codeFor(size, kind, sortable, sort)}
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
  size,
  sortable = false,
  sort,
  footer,
  withRow = false,
  description,
  kind = 'default',
  zebra,
  disabledFirst,
  selectedFirst,
  toolbar,
}: {
  rows: DemoRow[]
  size?: Size
  sortable?: boolean
  sort?: Sort
  footer?: ReactNode
  /** Render the first column as a Contained list, as the contract suggests. */
  withRow?: boolean
  description?: string
  kind?: Kind
  zebra?: boolean
  disabledFirst?: boolean
  selectedFirst?: boolean
  toolbar?: boolean
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
        description={description}
        size={size}
        zebra={zebra}
        selectable={kind === 'checkbox' || kind === 'batch' || kind === 'expandable-select' ? 'checkbox' : kind === 'radio' ? 'radio' : undefined}
        expandable={kind === 'expandable' || kind === 'expandable-select' ? (row) => DETAIL(row) : undefined}
        selectedKeys={selectedFirst || kind === 'batch' ? [rows[0].component] : undefined}
        batchActions={kind === 'batch' ? () => <Button variant="primary">Archive</Button> : undefined}
        isRowDisabled={disabledFirst ? (row) => row === rows[rows.length - 1] : undefined}
        toolbar={
          toolbar ? (
            <>
              <Button variant="ghost" size="icon-lg" aria-label="Settings">
                <KitIcon name="settings" />
              </Button>
              <Button variant="primary">Add</Button>
            </>
          ) : undefined
        }
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
