'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { KitIcon } from '@/components/kit-icon'
import { useOverlay } from '@/components/ui/overlay'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import type { SearchEntry } from '@/lib/search-index'
import type { SearchHit } from './search'
import {
  CATEGORIES,
  categoryOf,
  complete,
  didYouMean,
  followUps,
  highlightTerms,
  reasonFor,
  run,
  suggestionsFor,
  type Category,
} from './understand'
import styles from './search-palette.module.scss'

// Fetched once, the first time the palette opens, and kept for the session. A
// failed fetch is forgotten so Retry fetches again rather than replaying it.
let cache: Promise<SearchEntry[]> | null = null
const loadIndex = () =>
  (cache ??= fetch('/search-index.json')
    .then((r) => {
      if (!r.ok) throw new Error(`search index ${r.status}`)
      return r.json() as Promise<SearchEntry[]>
    })
    .catch((err) => {
      cache = null
      throw err
    }))

// What an empty box offers: the pages people land on first. Titled here as
// well as in the index, so the error state can still link to them.
const START: [string, string][] = [
  ['/docs', 'Introduction'],
  ['/docs/quick-start', 'Quick start'],
  ['/docs/theming', 'Theming'],
  ['/gallery', 'Components'],
  ['/create', 'Create a theme'],
]

// Recent searches live in this browser only. Storage can be missing or throw
// (private windows, blocked site data), and search works the same without it.
const RECENT_KEY = 'graphite-search-recent'
function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 5) : []
  } catch {
    return []
  }
}
function writeRecent(list: string[]) {
  try {
    if (list.length) localStorage.setItem(RECENT_KEY, JSON.stringify(list))
    else localStorage.removeItem(RECENT_KEY)
  } catch {}
}

type Item =
  | { type: 'query'; text: string; icon: 'recent' | 'suggest' | 'next' }
  | { type: 'hit'; hit: SearchHit; reason?: string }
type Group = { label: string; items: Item[]; action?: ReactNode }

/** A query's words in bold inside a result's snippet. */
function highlight(text: string, words: string[]) {
  if (!words.length) return text
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}

/**
 * The documentation search: a dialog with one combobox and its results. Built
 * on the shared Overlay hook, so Escape, an outside press and focus return
 * behave as they do everywhere else. `onClose` must be stable (the hook re-runs
 * on a new one and would pull focus back to the trigger mid-search).
 *
 * It reads questions as well as keywords, but everything it does is the
 * keyword index plus the rules in ./understand, run in the browser. The copy
 * says so. The panel wears the AI layer's tinted background as a look, by
 * request, but not the AI label, which is the kit's actual claim that a model
 * is involved; "How search works" says plainly that none is.
 */
export function SearchPalette({
  open,
  onClose,
  anchor,
}: {
  open: boolean
  onClose: () => void
  /** The control the panel drops from. Without one it centres under the bar. */
  anchor?: () => HTMLElement | null
}) {
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const ref = useOverlay<HTMLDivElement>({ open, onDismiss: onClose, trapFocus: true })

  // Hung under the trigger, its caret on the trigger's centre, and slid along
  // to stay 16px inside the viewport. Measured before paint so the drop starts
  // from the right place. Below md the panel is full screen and ignores this.
  const [place, setPlace] = useState<CSSProperties | undefined>()
  useLayoutEffect(() => {
    if (!open) return
    const measure = () => {
      const a = anchor?.()
      const panel = ref.current
      if (!a || !panel) return setPlace(undefined)
      const r = a.getBoundingClientRect()
      const mid = r.left + r.width / 2
      const w = panel.offsetWidth
      const left = Math.min(Math.max(16, mid - w / 2), window.innerWidth - 16 - w)
      setPlace({
        '--top': `${r.bottom + 12}px`,
        '--left': `${left}px`,
        '--caret': `${mid - left}px`,
      } as CSSProperties)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [open, anchor, ref])
  const input = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [index, setIndex] = useState<SearchEntry[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | undefined>()
  const [ignore, setIgnore] = useState<{ page?: boolean; section?: boolean; dropped?: boolean }>({})
  const [recent, setRecent] = useState<string[]>([])
  const [active, setActive] = useState(0)
  const [caretAtEnd, setCaretAtEnd] = useState(true)

  const load = useCallback(() => {
    setFailed(false)
    loadIndex().then(setIndex, () => setFailed(true))
  }, [])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setRecent(readRecent())
    input.current?.focus()
    load()
  }, [open, load])

  // A new query starts unrefined: filters belong to the query they narrowed.
  const ask = useCallback((text: string) => {
    setQuery(text)
    setCategory(undefined)
    setIgnore({})
    input.current?.focus()
  }, [])

  const q = query.trim()
  const outcome = useMemo(
    () => (index && q ? run(index, q, { category, ignore }) : null),
    [index, q, category, ignore],
  )
  const completion = useMemo(
    () => (index && query ? complete(index, query) : { ghost: '', suggestions: [] }),
    [index, query],
  )
  const suggested = useMemo(() => suggestionsFor(pathname, index), [pathname, index])
  const fix = useMemo(
    () => (index && outcome && !outcome.hits.length ? didYouMean(index, q) : null),
    [index, outcome, q],
  )

  const groups = useMemo((): Group[] => {
    if (!index) return []
    if (!q) {
      const out: Group[] = []
      if (recent.length)
        out.push({
          label: 'Recent',
          items: recent.map((text) => ({ type: 'query', text, icon: 'recent' })),
        })
      out.push({ label: 'Try asking', items: suggested.map((text) => ({ type: 'query', text, icon: 'suggest' })) })
      out.push({
        label: 'Start here',
        items: START.flatMap(([href]) => {
          const entry = index.find((e) => e.href === href)
          return entry ? [{ type: 'hit' as const, hit: { entry, snippet: entry.text } }] : []
        }),
      })
      return out
    }
    if (!outcome) return []
    const out: Group[] = []
    // Whole queries the index can answer, above the results they would give.
    const typing = completion.suggestions.filter((s) => s.toLowerCase() !== q.toLowerCase()).slice(0, 3)
    if (typing.length)
      out.push({ label: 'Suggestions', items: typing.map((text) => ({ type: 'query', text, icon: 'suggest' })) })
    if (!outcome.hits.length) {
      if (fix) out.push({ label: 'Did you mean', items: [{ type: 'query', text: fix, icon: 'suggest' }] })
      out.push({ label: 'Try one of these', items: suggested.map((text) => ({ type: 'query', text, icon: 'suggest' })) })
      return out
    }
    const [best, ...rest] = outcome.hits
    out.push({ label: 'Best match', items: [{ type: 'hit', hit: best, reason: reasonFor(best, outcome.intent) }] })
    // The rest grouped by category, in the order their best hit ranks.
    const order = [...new Set(rest.map((h) => categoryOf(h.entry)))]
    for (const c of order)
      out.push({ label: c, items: rest.filter((h) => categoryOf(h.entry) === c).map((hit) => ({ type: 'hit', hit })) })
    const next = followUps(index, outcome).slice(0, 4)
    if (next.length) out.push({ label: 'Related searches', items: next.map((text) => ({ type: 'query', text, icon: 'next' })) })
    return out
  }, [index, q, query, recent, suggested, outcome, completion, fix])

  const items = useMemo(() => groups.flatMap((g) => g.items), [groups])

  // Enter opens the best match, so the first result starts active, not a
  // suggestion above it. With nothing typed, the first starting point does.
  const firstHit = items.findIndex((i) => i.type === 'hit')
  useEffect(() => setActive(q && firstHit >= 0 ? firstHit : 0), [q, firstHit, category, ignore])

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, listId])

  const remember = useCallback(
    (text: string) => {
      if (text.length < 2) return
      const next = [text, ...recent.filter((r) => r.toLowerCase() !== text.toLowerCase())].slice(0, 5)
      setRecent(next)
      writeRecent(next)
    },
    [recent],
  )

  const choose = useCallback(
    (item: Item) => {
      if (item.type === 'query') return ask(item.text)
      if (q) remember(q)
      onClose()
      router.push(item.hit.entry.href)
    },
    [ask, q, remember, onClose, router],
  )

  if (!open) return null

  const ghost = caretAtEnd && completion.ghost && query ? completion.ghost : ''
  const acceptGhost = () => {
    setQuery(query + ghost)
    setCategory(undefined)
    setIgnore({})
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && items[active]) {
      e.preventDefault()
      choose(items[active])
    } else if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'ArrowRight') {
      // The ghost text is a suggestion to accept, the way a shell or an
      // address bar offers one. Tab only takes it when there is one, so Tab
      // still moves focus otherwise.
      if (ghost) {
        e.preventDefault()
        acceptGhost()
      }
    }
  }

  const intent = outcome?.intent
  const scoped = !!(intent && (intent.page || intent.section))
  const status = failed
    ? 'Search is unavailable.'
    : !index
      ? 'Loading the search index.'
      : !q
        ? ''
        : outcome && outcome.hits.length && category
          ? `${outcome.counts[category]} of ${outcome.counts.All} results, ${category} only.`
          : outcome && outcome.hits.length
          ? `${outcome.counts.All} ${outcome.counts.All === 1 ? 'result' : 'results'}${
              intent?.page ? ` in ${intent.page}` : ''
            }${intent?.section ? `, ${intent.section} first` : ''}.`
          : `No results for ${q}.${fix ? ` Did you mean ${fix}?` : ''}`

  const onComponentPage = pathname.match(/^\/docs\/components\/([^/#?]+)/)?.[1]
  const pageName = onComponentPage && index?.find((e) => e.href === `/docs/components/${onComponentPage}`)?.page
  const placeholder = pageName ? `Ask about ${pageName}, or search all docs` : 'Search or ask a question'

  let n = -1
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
        data-anchored={place ? '' : undefined}
        style={place}
      >
        <div className={styles.field}>
          <KitIcon name="search" size={16} className={styles.icon} aria-hidden="true" />
          <div className={styles.inputWrap}>
            {ghost ? (
              <span className={styles.ghost} aria-hidden="true">
                <span className={styles.typed}>{query}</span>
                {ghost}
              </span>
            ) : null}
            <input
              ref={input}
              className={styles.input}
              type="text"
              role="combobox"
              aria-expanded={items.length > 0}
              aria-controls={listId}
              aria-activedescendant={items.length ? `${listId}-${active}` : undefined}
              aria-autocomplete="both"
              aria-describedby={`${listId}-hint`}
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setCategory(undefined)
                setIgnore({})
                setCaretAtEnd(e.target.selectionStart === e.target.value.length)
              }}
              onSelect={(e) =>
                setCaretAtEnd(e.currentTarget.selectionStart === e.currentTarget.value.length)
              }
              onKeyDown={onKeyDown}
            />
          </div>
          {query ? (
            <button type="button" className={styles.clear} aria-label="Clear search" onClick={() => ask('')}>
              <KitIcon name="cross-small" size={16} aria-hidden="true" />
            </button>
          ) : null}
          <kbd className={styles.esc}>Esc</kbd>
          <Button variant="ghost" size="sm" className={styles.cancel} onClick={onClose}>
            Cancel
          </Button>
        </div>
        <p id={`${listId}-hint`} className={styles.visuallyHidden}>
          Type a word or a question. Arrow keys move through suggestions and results. Tab accepts the
          suggested completion.
        </p>

        {/* Refining: what the query was read as, each part removable, then the
            categories the results fall into, each with its count. */}
        {outcome && (scoped || ignore.page || ignore.section || intent!.rewrites.length || intent!.dropped.length || CATEGORIES.filter((c) => outcome.counts[c]).length > 1) ? (
          <div className={styles.refine}>
            {scoped || ignore.page || ignore.section ? (
              <div className={styles.understood}>
                <span className={styles.refineLabel}>{scoped ? 'Looking in' : 'Searching all docs'}</span>
                {intent!.page ? (
                  <button
                    type="button"
                    className={styles.chip}
                    aria-label={`Stop limiting to ${intent!.page}`}
                    onClick={() => setIgnore((v) => ({ ...v, page: true }))}
                  >
                    {intent!.page}
                    <KitIcon name="cross-small" size={16} aria-hidden="true" />
                  </button>
                ) : null}
                {intent!.section ? (
                  <button
                    type="button"
                    className={styles.chip}
                    aria-label={`Stop putting ${intent!.section} first`}
                    onClick={() => setIgnore((v) => ({ ...v, section: true }))}
                  >
                    {intent!.section}
                    <KitIcon name="cross-small" size={16} aria-hidden="true" />
                  </button>
                ) : null}
                {ignore.page || ignore.section ? (
                  <button type="button" className={styles.textButton} onClick={() => setIgnore({})}>
                    Undo
                  </button>
                ) : null}
              </div>
            ) : null}
            {intent!.rewrites.length || intent!.dropped.length ? (
              <p className={styles.note}>
                {intent!.rewrites.map(([from, to]) => `Read “${from}” as “${to}”.`).join(' ')}
                {intent!.rewrites.length && intent!.dropped.length ? ' ' : ''}
                {intent!.dropped.length
                  ? `Showing results without ${intent!.dropped.map((w) => `“${w}”`).join(' or ')}. `
                  : ''}
                {intent!.dropped.length ? (
                  <button
                    type="button"
                    className={styles.textButton}
                    onClick={() => setIgnore((v) => ({ ...v, dropped: true }))}
                  >
                    Search every word instead
                  </button>
                ) : null}
              </p>
            ) : null}
            {CATEGORIES.filter((c) => outcome.counts[c]).length > 1 ? (
              <div className={styles.filters} role="group" aria-label="Filter results">
                {(['All', ...CATEGORIES] as const)
                  .filter((c) => outcome.counts[c])
                  .map((c) => {
                    const on = (category ?? 'All') === c
                    return (
                      <button
                        key={c}
                        type="button"
                        className={styles.filter}
                        aria-pressed={on}
                        onClick={() => setCategory(c === 'All' ? undefined : c)}
                      >
                        {c}
                        <span className={styles.count}>{outcome.counts[c]}</span>
                      </button>
                    )
                  })}
              </div>
            ) : null}
          </div>
        ) : null}

        <p className={styles.visuallyHidden} role="status" aria-live="polite">
          {status}
        </p>

        {failed ? (
          <div className={styles.message}>
            <p className={styles.messageTitle}>Search is unavailable right now</p>
            <p className={styles.messageBody}>
              The search index did not load. Check your connection and try again, or go straight to a
              page.
            </p>
            <Button variant="secondary" size="sm" onClick={load}>
              Try again
              <KitIcon name="refresh" size={16} aria-hidden="true" />
            </Button>
            <ul className={styles.quickLinks}>
              {START.map(([href, title]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault()
                      onClose()
                      router.push(href)
                    }}
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : !index ? (
          // Processing: the one real wait is fetching the index on first open.
          // Typing never waits, so it never shows a spinner it does not need.
          <div className={styles.loading} aria-hidden="true">
            <p className={styles.loadingLabel}>
              <span className={styles.spinner} />
              Loading the search index
            </p>
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.skeleton}>
                <span />
                <span />
              </div>
            ))}
          </div>
        ) : (
          <div id={listId} role="listbox" aria-label="Suggestions and results" className={styles.list}>
            {q && outcome && !outcome.hits.length ? (
              <div className={styles.empty}>
                <p className={styles.messageTitle}>Nothing matches “{q}”</p>
                <p className={styles.messageBody}>
                  {category
                    ? `No ${category.toLowerCase()} match. `
                    : 'Search looks at page and section titles, prop and token names, and page text. '}
                  Try fewer words, a component name, or one of these.
                </p>
              </div>
            ) : null}
            {groups.map((g) => (
              <div key={g.label} role="group" aria-labelledby={`${listId}-g-${g.label}`} className={styles.group}>
                <div className={styles.groupHead} role="presentation">
                  <span id={`${listId}-g-${g.label}`} className={styles.groupLabel}>
                    {g.label}
                  </span>
                  {g.label === 'Recent' ? (
                    <button
                      type="button"
                      className={styles.textButton}
                      onClick={() => {
                        setRecent([])
                        writeRecent([])
                        input.current?.focus()
                      }}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                {g.items.map((item) => {
                  const i = ++n
                  const props = {
                    id: `${listId}-${i}`,
                    role: 'option',
                    'aria-selected': i === active,
                    onPointerMove: () => setActive(i),
                    onClick: () => choose(item),
                  } as const
                  if (item.type === 'query') {
                    const icon = item.icon === 'recent' ? 'time-past' : item.icon === 'next' ? 'arrow-right' : 'search'
                    return (
                      <div key={`q-${item.text}`} {...props} className={styles.queryOption}>
                        <KitIcon name={icon} className={styles.icon} />
                        <span>{item.text}</span>
                      </div>
                    )
                  }
                  const { entry, snippet } = item.hit
                  const words = intent ? highlightTerms(intent) : []
                  return (
                    <div
                      key={entry.href}
                      {...props}
                      className={`${styles.option} ${item.reason ? styles.best : ''}`}
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
                      {/* Under a category heading the tag would only repeat it. */}
                      {(CATEGORIES as string[]).includes(g.label) ? <span /> : <Tag>{categoryOf(entry).replace(/s$/, '')}</Tag>}
                      {snippet ? <span className={styles.snippet}>{highlight(snippet, words)}</span> : null}
                      {item.reason ? <span className={styles.reason}>{item.reason}</span> : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <p className={styles.keys} aria-hidden="true">
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> move
            </span>
            <span>
              <kbd>Enter</kbd> open
            </span>
            <span>
              <kbd>Tab</kbd> complete
            </span>
          </p>
          {/* The kit's footer action. It does what Enter does: opens the
              highlighted result, or runs the highlighted suggestion. */}
          <Button
            variant="primary"
            size="lg"
            className={styles.footerAction}
            onClick={() => (items[active] ? choose(items[active]) : input.current?.focus())}
          >
            Search
            <KitIcon name="arrow-small-right" />
          </Button>
        </div>
      </div>
    </>
  )
}
