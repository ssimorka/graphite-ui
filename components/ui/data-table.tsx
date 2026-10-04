'use client'

import { Fragment, useId, useState } from 'react'
import type { ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { Button } from './button'
import { Checkbox } from './checkbox'
import styles from './data-table.module.scss'

export type Column<T> = {
  key: string
  header: string
  /** Per column, not per table — the contract makes sortability a column trait. */
  sortable?: boolean
  /** Return a Contained list here when a row needs leading or trailing content. */
  render?: (row: T) => ReactNode
}

export type Sort = { key: string; direction: 'asc' | 'desc' }

/** Contract: docs/contracts/data-table.md (2.0.1) */
type DataTableProps<T> = {
  /** The kit's table title, painted above the table, and its accessible name. */
  caption: string
  /** The kit's header description, under the title. */
  description?: ReactNode
  columns: [Column<T>, ...Column<T>[]]
  rows: T[]
  getRowKey: (row: T) => string
  /** The kit's size modes: rows of 24, 32, 40, 48 and 64. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  sort?: Sort
  onSortChange?: (key: string) => void
  /** The kit's Zebra style: alternate rows on surface-variant, no row rules. */
  zebra?: boolean
  /** The kit's row cell Disabled. Disabled rows dim and cannot be selected. */
  isRowDisabled?: (row: T) => boolean
  /** The kit's Select checkbox and Select radio types. */
  selectable?: 'checkbox' | 'radio'
  /** Selected row keys. Uncontrolled when left out. */
  selectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  /**
   * The kit's Batch actions: shown in place of the toolbar while rows are
   * selected, on a primary bar with the count and a Cancel that clears the
   * selection. Pass primary Buttons.
   */
  batchActions?: (keys: string[]) => ReactNode
  /** The kit's Expandable type: the content under a row when it opens. */
  expandable?: (row: T) => ReactNode
  /** The kit's Toolbar: a 48px bar above the header row. */
  toolbar?: ReactNode
  /** The kit's Pagination: the bar under the table. */
  footer?: ReactNode
}

export function DataTable<T>({
  caption,
  description,
  columns,
  rows,
  getRowKey,
  size = 'lg',
  sort,
  onSortChange,
  zebra = false,
  isRowDisabled,
  selectable,
  selectedKeys,
  onSelectionChange,
  batchActions,
  expandable,
  toolbar,
  footer,
}: DataTableProps<T>) {
  const id = useId()
  const [ownSelection, setOwnSelection] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const selected = selectedKeys ?? ownSelection
  const select = (keys: string[]) => {
    if (selectedKeys === undefined) setOwnSelection(keys)
    onSelectionChange?.(keys)
  }

  const enabledKeys = rows.filter((r) => !isRowDisabled?.(r)).map(getRowKey)
  const allSelected = enabledKeys.length > 0 && enabledKeys.every((k) => selected.includes(k))
  const someSelected = !allSelected && enabledKeys.some((k) => selected.includes(k))
  const leadCells = (expandable ? 1 : 0) + (selectable ? 1 : 0)
  const span = columns.length + leadCells
  const batching = Boolean(batchActions) && selected.length > 0

  return (
    <div className={`${styles.wrap} ${styles[size]} ${zebra ? styles.zebra : ''}`}>
      <div className={styles.header}>
        <span id={`${id}-title`} className={styles.title}>
          {caption}
        </span>
        {description ? (
          <span id={`${id}-description`} className={styles.description}>
            {description}
          </span>
        ) : null}
      </div>

      {batching ? (
        <div className={styles.batch} role="region" aria-label="Batch actions">
          <span className={styles.batchCount} aria-live="polite">
            {selected.length} {selected.length === 1 ? 'item' : 'items'} selected
          </span>
          <span className={styles.batchActions}>
            {batchActions?.(selected)}
            <Button variant="primary" onClick={() => select([])}>
              Cancel
            </Button>
          </span>
        </div>
      ) : toolbar ? (
        <div className={styles.toolbar}>{toolbar}</div>
      ) : null}

      {/* The scroll container is part of the component, not the caller's
          problem: the sticky header below only works if the overflow lives
          here. */}
      <div className={styles.scroll}>
        <table
          className={styles.table}
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-description` : undefined}
        >
          <thead>
            <tr>
              {expandable ? (
                <th className={`${styles.th} ${styles.expandCell}`}>
                  <span className={styles.hidden}>Expand</span>
                </th>
              ) : null}
              {selectable ? (
                <th className={`${styles.th} ${styles.selectCell}`}>
                  {selectable === 'checkbox' ? (
                    <Checkbox
                      label="Select all rows"
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={(on) => select(on ? enabledKeys : [])}
                    />
                  ) : (
                    <span className={styles.hidden}>Select</span>
                  )}
                </th>
              ) : null}
              {columns.map((col) => {
                const active = sort?.key === col.key
                const sortable = col.sortable && onSortChange
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`${styles.th} ${sortable ? styles.sortableTh : ''} ${active ? styles.sorted : ''}`}
                    aria-sort={
                      active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                    }
                  >
                    {sortable ? (
                      <button
                        type="button"
                        className={styles.sortButton}
                        onClick={() => onSortChange(col.key)}
                      >
                        <span>{col.header}</span>
                        <KitIcon
                          name={
                            active
                              ? sort.direction === 'asc'
                                ? 'arrow-small-up'
                                : 'arrow-small-down'
                              : 'apps-sort'
                          }
                          className={active ? styles.glyph : `${styles.glyph} ${styles.idle}`}
                          aria-hidden="true"
                        />
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
            {rows.map((row) => {
              const key = getRowKey(row)
              const disabled = Boolean(isRowDisabled?.(row))
              const isSelected = selected.includes(key)
              const isOpen = expanded.includes(key)
              const name = String((row as Record<string, unknown>)[columns[0].key] ?? key)
              return (
                <Fragment key={key}>
                  <tr
                    className={[
                      styles.row,
                      isSelected ? styles.selected : '',
                      disabled ? styles.disabled : '',
                      isOpen ? styles.open : '',
                    ].join(' ')}
                    aria-selected={selectable ? isSelected : undefined}
                    aria-disabled={disabled || undefined}
                  >
                    {expandable ? (
                      <td className={`${styles.td} ${styles.expandCell}`}>
                        <button
                          type="button"
                          className={styles.expandButton}
                          aria-expanded={isOpen}
                          aria-controls={`${id}-${key}-content`}
                          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${name}`}
                          onClick={() =>
                            setExpanded((e) => (e.includes(key) ? e.filter((k) => k !== key) : [...e, key]))
                          }
                        >
                          <KitIcon name="angle-small-down" className={styles.chevron} />
                        </button>
                      </td>
                    ) : null}
                    {selectable ? (
                      <td className={`${styles.td} ${styles.selectCell}`}>
                        {selectable === 'checkbox' ? (
                          <Checkbox
                            label={`Select ${name}`}
                            checked={isSelected}
                            disabled={disabled}
                            onChange={(on) =>
                              select(on ? [...selected, key] : selected.filter((k) => k !== key))
                            }
                          />
                        ) : (
                          <input
                            type="radio"
                            name={`${id}-select`}
                            className={styles.radio}
                            aria-label={`Select ${name}`}
                            checked={isSelected}
                            disabled={disabled}
                            onChange={() => select([key])}
                          />
                        )}
                      </td>
                    ) : null}
                    {columns.map((col) => (
                      <td key={col.key} className={styles.td}>
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                  {expandable && isOpen ? (
                    <tr className={styles.expandedRow}>
                      <td id={`${id}-${key}-content`} className={styles.expandedContent} colSpan={span}>
                        {expandable(row)}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  )
}
