import fs from 'node:fs'
import path from 'node:path'

/**
 * The foundation tokens, read out of app/globals.scss at build time.
 *
 * The Tokens and Typography pages quote these values rather than carrying
 * copies, so a change to the stylesheet changes the pages. The parsing follows
 * scripts/token-drift.mjs on purpose: the `:root` block is Desktop, and the
 * `@media (max-width: …) { :root { … } }` block is the Mobile override list, so
 * both pages read the scale the same way the governance check does.
 *
 * Server-only: it reads the repo.
 */

export type Decl = {
  /** The full custom property name, `--graphite-…`. */
  name: string
  value: string
  /** The trailing `// 16px` comment, where the stylesheet gives one. */
  note?: string
}

export type Foundations = {
  desktop: Decl[]
  mobile: Decl[]
  /** The max-width the Mobile block applies below, in px. */
  mobileMaxWidth: number | null
}

const STYLESHEET = path.join(process.cwd(), 'app', 'globals.scss')

/** From just after `head` (which ends on an opening brace) to its matching close. */
function blockAfter(src: string, head: RegExp, depth = 1) {
  const m = head.exec(src)
  if (!m) return null
  let i = m.index + m[0].length
  const start = i
  let d = depth
  for (; i < src.length && d > 0; i += 1) {
    if (src[i] === '{') d += 1
    else if (src[i] === '}') d -= 1
  }
  return { match: m, body: src.slice(start, i - 1) }
}

function declarations(body: string): Decl[] {
  const out: Decl[] = []
  for (const m of body.matchAll(
    /^\s*(--graphite-[a-z0-9-]+)\s*:\s*([^;]+);[ \t]*(?:\/\/[ \t]*(.*))?$/gm,
  )) {
    out.push({ name: m[1], value: m[2].trim(), note: m[3]?.trim() || undefined })
  }
  return out
}

export function readFoundations(): Foundations {
  const src = fs.readFileSync(STYLESHEET, 'utf8')
  // The bare top-level `:root {`, not the `:root, :root.cds--white` pair above
  // it, which only includes Carbon's theme.
  const root = blockAfter(src, /^:root\s*\{/m)
  const mobile = blockAfter(
    src,
    /@media\s*\(max-width:\s*(\d+)px\)\s*\{\s*:root\s*\{/,
    2,
  )
  return {
    desktop: root ? declarations(root.body) : [],
    mobile: mobile ? declarations(mobile.body) : [],
    mobileMaxWidth: mobile ? Number(mobile.match[1]) : null,
  }
}

/** rem to px at the 16px root the stylesheet assumes, for display only. */
export function remToPx(value: string): number | null {
  const n = parseFloat(value)
  if (Number.isNaN(n)) return null
  if (value.endsWith('rem')) return n * 16
  if (value.endsWith('px') || n === 0) return n
  return null
}

// ------------------------------------------------------------------ groups

export type FoundationGroup = {
  id: string
  title: string
  /** Matches the declarations that belong to the group. */
  test: RegExp
}

// Order and titles are the page's. Membership is by prefix, so a token added to
// the stylesheet lands in its group without an edit here.
const GROUPS: FoundationGroup[] = [
  { id: 'space', title: 'Space', test: /^--graphite-space-/ },
  { id: 'density', title: 'Density', test: /^--graphite-density-/ },
  { id: 'radius', title: 'Radius', test: /^--graphite-radius-/ },
  { id: 'breakpoint', title: 'Breakpoint', test: /^--graphite-breakpoint-/ },
  { id: 'motion', title: 'Motion', test: /^--graphite-motion-/ },
  { id: 'font', title: 'Font family', test: /^--graphite-font-/ },
  { id: 'weight', title: 'Font weight', test: /^--graphite-text-weight-/ },
  {
    id: 'text',
    title: 'Type steps',
    test: /^--graphite-text-(?!weight-)[a-z0-9-]+-(size|line-height)$/,
  },
  { id: 'scrim', title: 'Scrim', test: /^--graphite-scrim$/ },
]

export function groupFoundations(decls: Decl[]) {
  return GROUPS.map((g) => ({ ...g, decls: decls.filter((d) => g.test.test(d.name)) }))
}

// ---------------------------------------------------------------- snapshot

export type SnapshotCollection = {
  name: string
  modes: string[]
  count: number
  /** Whether scripts/token-drift.mjs reads this collection. */
  checked: boolean
}

/**
 * The collections in docs/tokens/figma-snapshot.json, and which of them
 * token-drift compares. "Checked" is read out of the script's own
 * `collection('…')` calls rather than listed here, so the table cannot claim a
 * check the script does not make.
 */
export function readSnapshot() {
  const snap = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'docs', 'tokens', 'figma-snapshot.json'), 'utf8'),
  ) as {
    source: { file: string }
    collections: Record<string, { modes: string[]; variables: Record<string, unknown> }>
  }
  const script = fs.readFileSync(
    path.join(process.cwd(), 'scripts', 'token-drift.mjs'),
    'utf8',
  )
  const read = new Set([...script.matchAll(/collection\('([^']+)'\)/g)].map((m) => m[1]))
  const collections: SnapshotCollection[] = Object.entries(snap.collections).map(
    ([name, c]) => ({
      name,
      modes: c.modes,
      count: Object.keys(c.variables).length,
      checked: read.has(name),
    }),
  )
  return { file: snap.source.file, collections }
}
