import type { SearchEntry } from '@/lib/search-index'
import { search, type SearchHit } from './search'

// Everything here runs in the browser over the static index. There is no model
// and no server: "understanding" a query means recognising the names the index
// already knows (pages, sections, props, tokens) and the everyday words people
// use for them. That is enough to make a question work like a search.

export type Category = 'Components' | 'Foundations' | 'Guides' | 'Tools'
export const CATEGORIES: Category[] = ['Components', 'Foundations', 'Guides', 'Tools']

export function categoryOf(e: SearchEntry): Category {
  if (e.href.startsWith('/docs/components/')) return 'Components'
  if (e.href.startsWith('/docs/foundations/')) return 'Foundations'
  if (e.href.startsWith('/create')) return 'Tools'
  return 'Guides'
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[?!.,:;]+/g, ' ')

// Words that carry the shape of a question but not its subject. Dropped before
// matching, so "how do I use the button?" searches for "button".
const STOP = new Set(
  'a an and are as at be by can could do does for from get give how i in into is it its me my need of on or show should tell than that the their them there these this to use used using want was what when where which who why will with you your'.split(
    ' ',
  ),
)

// Everyday words for the sections every component page has. A query that uses
// one is pointed at that section rather than required to contain the word.
const SECTION_WORDS: [string, string[]][] = [
  ['API reference', ['api', 'props', 'prop', 'properties', 'options', 'parameters', 'attributes', 'arguments']],
  ['Accessibility', ['accessibility', 'accessible', 'a11y', 'keyboard', 'screen', 'reader', 'aria', 'wcag', 'focus']],
  ['Design tokens', ['token', 'tokens', 'variable', 'variables', 'css']],
  ['Variants', ['variant', 'variants', 'sizes', 'size', 'kinds', 'types']],
  ['States', ['state', 'states', 'hover', 'disabled', 'error', 'pressed']],
  ['Usage', ['usage', 'guidelines', 'dos', 'donts', 'rules', 'practices']],
  ['Figma parity', ['figma', 'kit', 'parity']],
  ['Installation', ['install', 'installation', 'import', 'setup']],
  ['Anatomy', ['anatomy', 'slot', 'slots', 'parts', 'structure']],
  ['Live preview', ['example', 'examples', 'demo', 'preview']],
]
const SECTION_OF = new Map(SECTION_WORDS.flatMap(([s, ws]) => ws.map((w) => [w, s] as const)))

// Everyday words for things the docs name differently. Applied as a rewrite
// and shown to the reader ("dark mode" is read as "themes"), never silently.
const PHRASES: [string, string][] = [
  ['dark mode', 'themes'],
  ['light mode', 'themes'],
  ['dark theme', 'themes'],
  ['light theme', 'themes'],
  ['colour', 'color'],
  ['colours', 'color'],
  ['rounded corners', 'radius'],
  ['corners', 'radius'],
  ['padding', 'spacing'],
  ['margins', 'spacing'],
  ['fonts', 'typography'],
  ['font', 'typography'],
  ['breakpoints', 'layout'],
  ['grid', 'layout'],
  ['dialog', 'modal'],
  ['dropdown', 'select'],
  ['switch', 'toggle'],
  ['toast', 'notification'],
  ['alert', 'notification'],
  ['chip', 'tag'],
  ['textarea', 'text area'],
  ['input', 'text input'],
]

// Page names that are also the everyday word for a topic. "Which components
// trap focus?" is about components in general, not the Components gallery, so
// these only count as a page when nothing more specific is named.
const GENERIC_PAGES = new Set(['components', 'tokens', 'accessibility'])
// Words that say "the docs" rather than what in them.
const FILLER = new Set(['component', 'components', 'docs', 'documentation', 'page', 'pages', 'graphite', 'ui'])

export type Intent = {
  /** The page the query names, when it names one ("button", "radio buttons"). */
  page?: string
  /** The section its everyday words point at ("props" -> API reference). */
  section?: string
  /** The words left to match once those are taken out. */
  terms: string[]
  /** Everyday words read as the docs' own ("dark mode" -> "themes"). */
  rewrites: [string, string][]
  /** Words dropped because nothing in the docs matches them. */
  dropped: string[]
  /** It was phrased as a question or a sentence rather than keywords. */
  natural: boolean
}

function pageNames(index: SearchEntry[]) {
  // Longest first, so "button group" wins over "button".
  return [...new Set(index.filter((e) => !e.section).map((e) => e.page))].sort(
    (a, b) => b.length - a.length,
  )
}

const singular = (w: string) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w)

/**
 * Where a page's name sits in the query's words: the whole name, or at least
 * its first two words ("radio buttons" names Radio button group). Plurals count.
 */
function findName(words: string[], name: string): [number, number] | null {
  const n = norm(name).replace(/&/g, ' ').split(/\s+/).filter(Boolean)
  const need = n.length > 2 ? 2 : n.length
  for (let i = 0; i < words.length; i++) {
    let k = 0
    while (k < n.length && i + k < words.length && singular(words[i + k]) === singular(n[k])) k++
    if (k >= need) return [i, k]
  }
  return null
}

/** Read a query into the page, section and words it is asking about. */
export function interpret(index: SearchEntry[], query: string): Intent {
  let raw = ` ${norm(query).replace(/\s+/g, ' ').trim()} `
  const rewrites: [string, string][] = []
  for (const [from, to] of PHRASES) {
    if (raw.includes(` ${from} `) && !raw.includes(` ${to} `)) {
      raw = raw.replace(` ${from} `, ` ${to} `)
      rewrites.push([from, to])
    }
  }
  let words = raw.split(/\s+/).filter(Boolean)
  const natural = words.length > 2 && words.some((w) => STOP.has(w))

  let page: string | undefined
  let generic: { name: string; at: [number, number] } | undefined
  for (const name of pageNames(index)) {
    const at = findName(words, name)
    if (!at) continue
    if (GENERIC_PAGES.has(norm(name))) {
      generic ??= { name, at }
      continue
    }
    page = name
    words = [...words.slice(0, at[0]), ...words.slice(at[0] + at[1])]
    break
  }

  let section: string | undefined
  const terms: string[] = []
  for (const w of words) {
    const s = SECTION_OF.get(w)
    if (s && !section) section = s
    else if (!STOP.has(w) && !SECTION_OF.has(w) && !FILLER.has(w)) terms.push(w)
  }
  // "tokens" or "accessibility" on its own is the page of that name.
  if (!page && generic && !terms.length && words.length === generic.at[1]) {
    page = generic.name
    section = undefined
  }
  return { page, section, terms, rewrites, dropped: [], natural }
}

export type Outcome = {
  intent: Intent
  hits: SearchHit[]
  /** How many hits each category has, before the category filter. */
  counts: Record<Category | 'All', number>
}

const whole = (own: SearchEntry[]) => own.map((entry) => ({ entry, snippet: entry.text.slice(0, 140) }))

/**
 * Search with the query understood. A named page narrows to that page, a
 * section word ranks that section first, and whatever is left is matched the
 * usual way. Words nothing matches are dropped and said so. If understanding
 * the query finds nothing, it falls back to the plain keyword search, so
 * interpretation can only add results, never lose one.
 */
export function run(
  index: SearchEntry[],
  query: string,
  opts: {
    category?: Category
    /** Undo parts of the reading: the page, the section, or dropped words. */
    ignore?: { page?: boolean; section?: boolean; dropped?: boolean }
  } = {},
): Outcome {
  const found = interpret(index, query)
  const intent: Intent = {
    ...found,
    page: opts.ignore?.page ? undefined : found.page,
    section: opts.ignore?.section ? undefined : found.section,
  }
  // A dropped page goes back in as ordinary words.
  let terms = [...intent.terms, ...(found.page && !intent.page ? norm(found.page).split(/\s+/) : [])]
  const pool = intent.page ? index.filter((e) => e.page === intent.page) : index

  // Every word has to match, so one stray word sinks or skews the lot ("type
  // scale on mobile" finds one passing mention of all three). Words nothing
  // matches are dropped; so is one whose absence finds a far closer match.
  // Either way the reader is told, and can put it back.
  if (terms.length > 1 && !opts.ignore?.dropped) {
    const top = (ts: string[]) => search(pool, ts.join(' '), 1)[0]?.score ?? 0
    const all = top(terms)
    if (!all) {
      const kept = terms.filter((t) => search(pool, t, 1).length)
      intent.dropped = terms.filter((t) => !kept.includes(t))
      terms = kept
    } else if (terms.length > 2) {
      // Only from three words up: with two, dropping one changes the question.
      const without = terms.map((t) => ({ t, score: top(terms.filter((x) => x !== t)) }))
      const best = without.sort((a, b) => b.score - a.score)[0]
      if (best.score >= all * 3) {
        intent.dropped = [best.t]
        terms = terms.filter((x) => x !== best.t)
      }
    }
  }

  let hits: SearchHit[] = []
  if (terms.length) hits = search(pool, terms.join(' '), 40)
  if (!hits.length && intent.page) hits = whole(pool)
  if (!hits.length && !intent.page && intent.section) {
    // Only a section word ("keyboard", "tokens"): every page's section of that name.
    hits = whole(index.filter((e) => e.section === intent.section))
  }

  if (intent.section) {
    const first = hits.filter((h) => h.entry.section === intent.section)
    hits = [...first, ...hits.filter((h) => h.entry.section !== intent.section)]
  }
  if (!hits.length) {
    hits = search(index, query, 40)
    intent.dropped = []
  }

  const counts = { All: hits.length, Components: 0, Foundations: 0, Guides: 0, Tools: 0 }
  for (const h of hits) counts[categoryOf(h.entry)]++
  if (opts.category) hits = hits.filter((h) => categoryOf(h.entry) === opts.category)
  return { intent, hits: hits.slice(0, 20), counts }
}

const COMMON_SECTIONS = ['props', 'accessibility', 'tokens', 'variants']

/**
 * Completions while typing: whole queries the index can answer, and the one to
 * show as ghost text. Built from page names and the section words above, so
 * every suggestion is one that returns results.
 */
export function complete(index: SearchEntry[], query: string): { ghost: string; suggestions: string[] } {
  const q = norm(query).replace(/\s+/g, ' ').trimStart()
  if (!q.trim()) return { ghost: '', suggestions: [] }
  // Shortest first here, so "bu" completes to "button" before "button group".
  const names = pageNames(index).reverse()
  const out: string[] = []
  const add = (s: string) => {
    const key = (x: string) => norm(x).split(/\s+/).map(singular).join(' ')
    if (!out.some((o) => key(o) === key(s)) && key(s) !== key(q.trim())) out.push(s)
  }

  const intent = interpret(index, q)
  if (intent.page && !intent.section) {
    const isComponent = index.some((e) => e.page === intent.page && e.href.startsWith('/docs/components/'))
    if (isComponent)
      for (const s of COMMON_SECTIONS) {
        const full = `${intent.page.toLowerCase()} ${s}`
        if (full.startsWith(q) || q.endsWith(' ')) add(full)
      }
  }
  // Page names that start with, or have a word starting with, the last word typed.
  const last = q.split(' ').pop() ?? ''
  const head = q.slice(0, q.length - last.length)
  if (last.length >= 1) {
    for (const n of names) {
      const ln = n.toLowerCase()
      if (ln.startsWith(q.trim())) add(ln)
      else if (!intent.page && last.length >= 2 && ln.split(/\s+/).some((w) => w.startsWith(last)))
        add(`${head}${ln}`.trim())
    }
    // One word per section, so "pr" offers "props" once, not prop, props and properties.
    for (const [, ws] of SECTION_WORDS) {
      const w = last.length >= 2 ? ws.find((x) => x.startsWith(last) && x !== last) : undefined
      if (w) add(`${head}${w}`.trim())
    }
  }
  const suggestions = out.slice(0, 5)
  const lead = suggestions.find((s) => s.startsWith(q))
  return { ghost: lead ? lead.slice(q.length) : '', suggestions }
}

function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return d[a.length][b.length]
}

/** A spelling the index knows, for a query that found nothing. */
export function didYouMean(index: SearchEntry[], query: string): string | null {
  const vocab = new Set<string>()
  for (const e of index) {
    for (const w of norm(`${e.page} ${e.section}`).split(/\s+/)) if (w.length > 3) vocab.add(w)
    for (const k of e.keywords) for (const w of norm(k).split(/\s+/)) if (w.length > 3) vocab.add(w)
  }
  for (const [, ws] of SECTION_WORDS) ws.forEach((w) => vocab.add(w))
  let changed = false
  const fixed = norm(query)
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      if (w.length < 4 || vocab.has(w) || STOP.has(w)) return w
      let best = w
      let bestD = w.length > 6 ? 3 : 2
      for (const v of vocab) {
        if (Math.abs(v.length - w.length) > 2) continue
        const dd = distance(w, v)
        if (dd < bestD) {
          bestD = dd
          best = v
        }
      }
      if (best !== w) changed = true
      return best
    })
    .join(' ')
  return changed ? fixed : null
}

/**
 * Where to go next from a set of results: the other sections of the page the
 * query is about, and the pages that page lists as related. Every one is a
 * query that returns results.
 */
export function followUps(index: SearchEntry[], outcome: Outcome): string[] {
  const top = outcome.intent.page ?? outcome.hits[0]?.entry.page
  if (!top) return []
  const out: string[] = []
  const isComponent = index.some((e) => e.page === top && e.href.startsWith('/docs/components/'))
  if (isComponent) {
    for (const s of ['keyboard', 'props', 'tokens', 'variants', 'figma'])
      if (SECTION_OF.get(s) !== outcome.intent.section) out.push(`${top.toLowerCase()} ${s}`)
    const related = index.find((e) => e.page === top && e.section === 'Related')
    for (const r of related?.keywords ?? []) out.push(r.toLowerCase())
  } else {
    for (const e of index.filter((x) => x.page === top && x.section).slice(0, 4)) out.push(`${top.toLowerCase()} ${e.section.toLowerCase()}`)
  }
  return [...new Set(out)].slice(0, 6)
}

/** Starting points before anything is typed, tuned to the page you are on. */
export function suggestionsFor(pathname: string, index: SearchEntry[] | null): string[] {
  const slug = pathname.match(/^\/docs\/components\/([^/#?]+)/)?.[1]
  const name = slug && index?.find((e) => e.href === `/docs/components/${slug}`)?.page
  if (name) {
    const n = name.toLowerCase()
    return [`${n} props`, `How do I use ${n} with a keyboard?`, `Which tokens does ${n} use?`, 'How does theming work?']
  }
  if (pathname.startsWith('/docs/foundations')) {
    return ['spacing scale', 'type scale', 'dark mode', 'How does theming work?']
  }
  return ['How does theming work?', 'button props', 'Which components trap focus?', 'dark mode']
}

/**
 * One line on why a result is where it is, from what actually matched. It is
 * the ranking's own reason, so it never claims more than the match did.
 */
export function reasonFor(hit: SearchHit, intent: Intent): string {
  const { page, section, keywords, text } = hit.entry
  if (intent.page === page && intent.section && intent.section === section)
    return `The ${section} section of ${page}, which your search asked about.`
  if (intent.page === page && !section) return `The ${page} page, which your search named.`
  if (intent.page === page) return `A section of ${page}, which your search named.`
  const words = intent.terms
  const kw = keywords.find((k) => words.some((w) => norm(k).trim() === w))
  if (kw) return `Lists ${kw} by name.`
  const inTitle = words.find((w) => norm(`${page} ${section}`).includes(w))
  if (inTitle) return `The title matches “${inTitle}”.`
  if (intent.section && section === intent.section) return `Its ${section} section is what your search asked about.`
  const inText = words.find((w) => norm(text).includes(w))
  return inText ? `Mentions “${inText}”.` : 'Closest match in the docs.'
}

/** The words worth highlighting in a result for this query. */
export function highlightTerms(intent: Intent): string[] {
  return intent.terms.filter((w) => w.length >= 3)
}
