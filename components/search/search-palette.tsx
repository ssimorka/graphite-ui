'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from '@carbon/icons-react'
import { useOverlay } from '@/components/ui/overlay'
import type { SearchEntry } from '@/lib/search-index'
import { search } from './search'
import styles from './search-palette.module.scss'

// Fetched once, the first time the palette opens, and kept for the session.
let cache: Promise<SearchEntry[]> | null = null
const loadIndex = () =>
  (cache ??= fetch('/search-index.json').then((r) => {
    if (!r.ok) throw new Error(`search index ${r.status}`)
    return r.json() as Promise<SearchEntry[]>
  }))

// What an empty box offers: the pages people land on first.
const START = ['/docs/installation', '/docs', '/docs/foundations/color', '/gallery', '/create']

/**
 * The documentation search: a dialog with one combobox and its results. Built
 * on the shared Overlay hook, so Escape, an outside press and focus return
 * behave as they do everywhere else. `onClose` must be stable (the hook re-runs
 * on a new one and would pull focus back to the trigger mid-search).
 */
export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const ref = useOverlay<HTMLDivElement>({ open, onDismiss: onClose, trapFocus: true })
  const input = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    input.current?.focus()
    loadIndex().then(setIndex, () => setFailed(true))
  }, [open])

  const hits = useMemo(() => {
    if (!index) return []
    if (!query.trim()) {
      return START.map((href) => index.find((e) => e.href === href))
        .filter((e): e is SearchEntry => !!e)
        .map((entry) => ({ entry, snippet: entry.text }))
    }
    return search(index, query)
  }, [index, query])

  useEffect(() => setActive(0), [query])

  const go = useCallback(
    (href: string) => {
      onClose()
      router.push(href)
    },
    [onClose, router],
  )

  // Keep the active option in view as the arrow keys move it.
  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, listId])

  if (!open) return null

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, hits.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && hits[active]) {
      e.preventDefault()
      go(hits[active].entry.href)
    }
  }

  const status = failed
    ? 'Search could not load. Try again in a moment.'
    : !index
      ? 'Loading…'
      : query.trim() && !hits.length
        ? `No results for “${query.trim()}”.`
        : null

  return (
    <>
      <div className={styles.scrim} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        tabIndex={-1}
        className={styles.panel}
      >
        <div className={styles.field}>
          <Search size={16} className={styles.icon} aria-hidden="true" />
          <input
            ref={input}
            className={styles.input}
            type="text"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={listId}
            aria-activedescendant={hits.length ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            placeholder="Search documentation"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd className={styles.esc}>Esc</kbd>
        </div>

        {status ? (
          <p className={styles.status} role="status">
            {status}
          </p>
        ) : (
          <>
            {!query.trim() ? <p className={styles.groupLabel}>Start here</p> : null}
            <ul id={listId} role="listbox" aria-label="Results" className={styles.list}>
              {hits.map(({ entry, snippet }, i) => (
                <li
                  key={entry.href}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={styles.option}
                  onPointerMove={() => setActive(i)}
                  onClick={() => go(entry.href)}
                >
                  <span className={styles.title}>
                    {entry.page}
                    {entry.section ? (
                      <>
                        <span className={styles.sep} aria-hidden="true">
                          ›
                        </span>
                        {entry.section}
                      </>
                    ) : null}
                  </span>
                  <span className={styles.kind}>{entry.kind}</span>
                  {snippet ? <span className={styles.snippet}>{snippet}</span> : null}
                </li>
              ))}
            </ul>
          </>
        )}

        <p className={styles.footer} aria-hidden="true">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to move
          </span>
          <span>
            <kbd>Enter</kbd> to open
          </span>
        </p>
      </div>
    </>
  )
}
