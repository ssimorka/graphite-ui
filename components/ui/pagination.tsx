'use client'

import { useId } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { Button } from './button'
import { Select } from './select'
import type { SelectOption } from './select'
import styles from './pagination.module.scss'

type Size = 'sm' | 'md' | 'lg'

const ICON_SIZE = { sm: 'icon-sm', md: 'icon', lg: 'icon-lg' } as const

/** The previous and next buttons both forms share: ghost, icon only, at the bar's size. */
function Step({ dir, size, disabled, onClick }: { dir: -1 | 1; size: Size; disabled: boolean; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size={ICON_SIZE[size]}
      aria-label={dir < 0 ? 'Previous page' : 'Next page'}
      disabled={disabled}
      onClick={onClick}
      className={styles.step}
    >
      <KitIcon name="angle-small-right" className={dir < 0 ? styles.flip : undefined} />
    </Button>
  )
}

const pages = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i)

/**
 * The page-number form's window: the first and last pages always, the current
 * page and its neighbours, and an ellipsis for each run left out. Never more
 * than `itemsShown` entries, ellipses included.
 */
function windowed(page: number, total: number, itemsShown: number): (number | 'start' | 'end')[] {
  const shown = Math.max(5, itemsShown)
  if (total <= shown) return pages(1, total)
  const middle = shown - 4 // slots between the two ends and the two ellipses
  let from = Math.max(2, page - Math.floor(middle / 2))
  let to = from + middle - 1
  if (page - 1 <= Math.ceil(middle / 2) + 1) {
    from = 2
    to = shown - 2
  } else if (total - page <= Math.ceil(middle / 2) + 1) {
    to = total - 1
    from = total - (shown - 3)
  }
  if (to >= total - 1) {
    to = total - 1
    from = total - (shown - 3)
  }
  const out: (number | 'start' | 'end')[] = [1]
  if (from > 2) out.push('start')
  out.push(...pages(from, to))
  if (to < total - 1) out.push('end')
  out.push(total)
  return out
}

/** Contract: docs/contracts/pagination.md (1.0.0) */
export function PaginationNav({
  page,
  totalPages,
  onChange,
  size = 'lg',
  itemsShown = 7,
  label = 'Pagination',
}: {
  /** 1-based. */
  page: number
  totalPages: number
  onChange: (page: number) => void
  /** The kit's Size: 48, 40 and 32 squares. */
  size?: Size
  /** The most entries shown between the arrows, ellipses included. The kit draws seven. */
  itemsShown?: number
  /** Names the navigation landmark. */
  label?: string
}) {
  const uid = useId()
  const items = windowed(page, totalPages, itemsShown)
  const hidden = (which: 'start' | 'end') => {
    const i = items.indexOf(which)
    const before = items[i - 1] as number
    const after = items[i + 1] as number
    return pages(before + 1, after - 1)
  }

  return (
    <nav aria-label={label} className={`${styles.nav} ${styles[size]}`}>
      <Step dir={-1} size={size} disabled={page <= 1} onClick={() => onChange(page - 1)} />
      <ul className={styles.items}>
        {items.map((it) =>
          typeof it === 'number' ? (
            <li key={it}>
              <button
                type="button"
                className={`${styles.item} ${it === page ? styles.current : ''}`}
                aria-current={it === page ? 'page' : undefined}
                aria-label={`Page ${it}`}
                onClick={() => onChange(it)}
              >
                {it}
              </button>
            </li>
          ) : (
            // The kit's Overflow item: the ellipsis opens the pages it hides,
            // as a native select so the platform supplies the list and keys.
            <li key={it} className={styles.overflow}>
              <span className={styles.item} aria-hidden="true">
                …
              </span>
              <label htmlFor={`${uid}-${it}`} className={styles.hidden}>
                {`Pages ${hidden(it)[0]} to ${hidden(it).at(-1)}`}
              </label>
              <select
                id={`${uid}-${it}`}
                className={styles.overflowSelect}
                value=""
                onChange={(e) => onChange(Number(e.target.value))}
              >
                <option value="" disabled hidden />
                {hidden(it).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </li>
          ),
        )}
      </ul>
      <Step dir={1} size={size} disabled={page >= totalPages} onClick={() => onChange(page + 1)} />
    </nav>
  )
}

/** Contract: docs/contracts/pagination.md (1.0.0) */
export function Pagination({
  type = 'advanced',
  page,
  pageSize,
  pageSizes = [10, 20, 50, 100],
  totalItems,
  onChange,
  size = 'lg',
  hasNext,
}: {
  /**
   * The kit's Type. Advanced: items per page, the range shown, a page picker
   * and its total. Simple: "Page n" and the arrows. Unbound: the same, for a
   * total that is not known, so Next follows hasNext rather than a count.
   */
  type?: 'advanced' | 'simple' | 'unbound'
  /** 1-based. */
  page: number
  pageSize: number
  pageSizes?: number[]
  /** Needed by Advanced and Simple; Unbound does without. */
  totalItems?: number
  onChange: (next: { page: number; pageSize: number }) => void
  /** The kit's Size: a 48, 40 or 32 row. */
  size?: Size
  /** Unbound only: whether there is a page after this one. */
  hasNext?: boolean
}) {
  const totalPages = totalItems !== undefined ? Math.max(1, Math.ceil(totalItems / pageSize)) : undefined
  const canNext = type === 'unbound' ? Boolean(hasNext) : totalPages !== undefined && page < totalPages
  const first = (page - 1) * pageSize + 1
  const last = totalItems !== undefined ? Math.min(page * pageSize, totalItems) : page * pageSize
  const go = (p: number) => onChange({ page: p, pageSize })

  const sizeOptions = pageSizes.map((n) => ({ value: String(n), label: String(n) })) as [SelectOption, SelectOption, ...SelectOption[]]
  const pageOptions = Array.from({ length: totalPages ?? 1 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))

  return (
    <div className={`${styles.bar} ${styles[size]}`} role="group" aria-label="Pagination">
      {type === 'advanced' ? (
        <>
          <span className={styles.section}>
            <Select
              label="Items per page:"
              layout="inline"
              size={size}
              options={sizeOptions.length > 1 ? sizeOptions : [sizeOptions[0], sizeOptions[0]]}
              value={String(pageSize)}
              onChange={(v) => onChange({ page: 1, pageSize: Number(v) })}
            />
          </span>
          <span className={`${styles.section} ${styles.range}`}>
            {totalItems !== undefined ? `${first}–${last} of ${totalItems} items` : `${first}–${last} items`}
          </span>
          <span className={`${styles.section} ${styles.pageSection}`}>
            {pageOptions.length > 1 ? (
              <Select
                label="Page"
                hideLabel
                layout="inline"
                size={size}
                options={pageOptions as [SelectOption, SelectOption, ...SelectOption[]]}
                value={String(page)}
                onChange={(v) => go(Number(v))}
              />
            ) : (
              <span className={styles.text}>{page}</span>
            )}
            <span className={styles.text}>{`of ${totalPages} ${totalPages === 1 ? 'page' : 'pages'}`}</span>
          </span>
        </>
      ) : (
        <span className={`${styles.section} ${styles.pageSection} ${styles.push}`}>
          <span className={styles.text}>{`Page ${page}`}</span>
        </span>
      )}
      <span className={styles.arrow}>
        <Step dir={-1} size={size} disabled={page <= 1} onClick={() => go(page - 1)} />
      </span>
      <span className={styles.arrow}>
        <Step dir={1} size={size} disabled={!canNext} onClick={() => go(page + 1)} />
      </span>
    </div>
  )
}
