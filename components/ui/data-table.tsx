'use client'

import type { ReactNode } from 'react'
import styles from './data-table.module.scss'

export type Column<T> = {
  key: string
  header: string
  /** Per column, not per table — the contract makes sortability a column trait. */
  sortable?: boolean
  /** Return an Item here when a row needs leading or trailing content. */
  render?: (row: T) => ReactNode
}

export type Sort = { key: string; direction: 'asc' | 'desc' }

/** Contract: docs/contracts/data-table.md (1.2.0) */
type DataTableProps<T> = {
  /** Names the table for assistive tech. Not optional. */
  caption: string
  columns: [Column<T>, ...Column<T>[]]
  rows: T[]
  getRowKey: (row: T) => string
  density?: 'compact' | 'default'
  sort?: Sort
  onSortChange?: (key: string) => void
  footer?: ReactNode
}

export function DataTable<T>({
  caption,
  columns,
  rows,
  getRowKey,
  density = 'default',
  sort,
  onSortChange,
  footer,
}: DataTableProps<T>) {
  return (
    // The scroll container is part of the component, not the caller's problem:
    // the sticky header below only works if the overflow lives here.
    <div className={styles.scroll}>
      <table className={`${styles.table} ${styles[density]}`}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={`${styles.th} ${active ? styles.sorted : ''}`}
                  aria-sort={
                    active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                >
                  {col.sortable && onSortChange ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => onSortChange(col.key)}
                    >
                      {col.header}
                      <span className={styles.indicator} aria-hidden="true">
                        {active ? (sort.direction === 'asc' ? '▲' : '▼') : ''}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className={styles.row}>
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer ? (
          <tfoot>
            <tr>
              <td className={styles.td} colSpan={columns.length}>
                {footer}
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  )
}
