import fs from 'node:fs'
import path from 'node:path'

/**
 * Build-time readers for the Spacing, Radius and Layout pages.
 *
 * Every number those pages print comes through here: the custom properties
 * from app/globals.scss, the kit's own values from the committed Figma
 * snapshot, the contract front matter, and the layout geometry from the page
 * stylesheets that actually set it. A number typed into a page would drift the
 * first time a token moved, which is the failure lib/kit-stats.ts exists to
 * prevent for the home page.
 *
 * Server-only: it reads the repo, like lib/contracts.ts. It lives in the
 * Spacing route folder because the three pages share it and a route folder is
 * the scope they were written in; it has no page-specific knowledge.
 */

const ROOT = process.cwd()
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8')

// ------------------------------------------------------------------- units

/** px for a CSS length the scale uses: `0`, `Npx` or `Nrem` (at the kit's 16). */
export function toPx(value: string): number | null {
  const v = value.trim()
  if (v === '0') return 0
  const m = /^(-?[\d.]+)(px|rem)$/.exec(v)
  if (!m) return null
  return m[2] === 'rem' ? Number(m[1]) * 16 : Number(m[1])
}

// ------------------------------------------------------- globals.scss vars

export type RootVar = { name: string; suffix: string; value: string }

/**
 * `--graphite-<group>-*` as declared in globals.scss, in source order. Read by
 * regex rather than a Sass parser: the file uses interpolation, and the
 * declarations wanted here are one per line in the first :root block. The
 * first declaration wins, so the mobile type override further down can never
 * shadow a scale value.
 */
export function readRootVars(group: string): RootVar[] {
  const src = read('app/globals.scss')
  const re = new RegExp(`^\\s*(--graphite-${group}-([a-z0-9-]+))\\s*:\\s*([^;]+);`, 'gm')
  const seen = new Set<string>()
  const out: RootVar[] = []
  for (const m of src.matchAll(re)) {
    if (seen.has(m[1])) continue
    seen.add(m[1])
    out.push({ name: m[1], suffix: m[2], value: m[3].trim() })
  }
  return out
}

/** The `background-size` of a rule in globals.scss, e.g. `.page-bands__grid`. */
export function readGlobalBackgroundSize(selector: string): string | null {
  const src = read('app/globals.scss')
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const m = new RegExp(`^${esc}\\s*\\{[^}]*?background-size:\\s*([^;]+);`, 'm').exec(src)
  return m ? m[1].trim() : null
}

// ---------------------------------------------------------- kit snapshot

type SnapVar = { values: Record<string, { value: number }> }
type Snapshot = {
  collections: Record<string, { modes: string[]; variables: Record<string, SnapVar> }>
}

let snapshot: Snapshot | null = null
function snap(): Snapshot {
  snapshot ??= JSON.parse(read('docs/tokens/figma-snapshot.json')) as Snapshot
  return snapshot
}

/**
 * Spacing from the kit, keyed by the two-digit step. The kit names carry
 * their own index (`16px (1rem) (spacing-05)`), the same thing token-drift
 * reads.
 */
export function readKitSpacing(): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [name, v] of Object.entries(snap().collections.Spacing.variables)) {
    const step = /\(spacing-(\d{2})\)/.exec(name)?.[1]
    if (step) out[step] = Object.values(v.values)[0].value
  }
  return out
}

/** Radius from the kit, keyed the way the CSS suffix is (`none`, `2`, `full`). */
export function readKitRadius(): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [name, v] of Object.entries(snap().collections.Radius.variables)) {
    out[name.toLowerCase()] = Object.values(v.values)[0].value
  }
  return out
}

/**
 * The kit's breakpoint modes and the `Viewport size` each one holds, from
 * both collections: `Breakpoint` and the `Breakpoint LG–XL` it aliases into.
 */
export function readKitBreakpoints(): { collection: string; mode: string; px: number }[] {
  const out: { collection: string; mode: string; px: number }[] = []
  for (const name of ['Breakpoint', 'Breakpoint LG–XL']) {
    const c = snap().collections[name]
    const vp = c?.variables['Viewport size']
    if (!vp) continue
    for (const mode of c.modes) {
      const v = vp.values[mode]
      if (v) out.push({ collection: name, mode, px: v.value })
    }
  }
  return out
}

// ------------------------------------------------------------ contracts

export type FoundationContract = {
  foundation: string
  version: string
  source: string
  rules: string[]
  prohibitions: string[]
  /** `variables:` items as flat maps (name, value, count, unit, usage). */
  variables: Record<string, string>[]
}

// The contracts are notes and may use em dashes; the pages that quote them are
// copy and may not (CLAUDE.md). Every one in these files joins a clause to the
// sentence it explains, which is what a colon does.
const unquote = (s: string) =>
  s.trim().replace(/^['"]|['"]$/g, '').replace(/\s*—\s*/g, ': ')

/**
 * The YAML front matter of docs/contracts/foundations/<name>.md. The files
 * only use three shapes (scalars, lists of strings, lists of flat maps), so
 * this reads those three and nothing more.
 */
export function readFoundationContract(name: string): FoundationContract {
  const src = read(`docs/contracts/foundations/${name}.md`)
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const scalars: Record<string, string> = {}
  const lists: Record<string, (string | Record<string, string>)[]> = {}
  let key = ''

  for (const raw of fm.split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, '')
    if (!line.trim() || line.trim().startsWith('#')) continue
    const top = /^([a-z_]+):\s*(.*)$/.exec(line)
    if (top) {
      key = top[1]
      if (top[2]) scalars[key] = unquote(top[2])
      else lists[key] = []
      continue
    }
    const item = /^ {2}- (.*)$/.exec(line)
    if (item && lists[key]) {
      const kv = /^([a-z_]+):\s*(.*)$/.exec(item[1])
      lists[key].push(kv ? { [kv[1]]: unquote(kv[2]) } : unquote(item[1]))
      continue
    }
    const cont = /^ {4}([a-z_]+):\s*(.*)$/.exec(line)
    const last = lists[key]?.[lists[key].length - 1]
    if (cont && last && typeof last === 'object') last[cont[1]] = unquote(cont[2])
  }

  const strings = (k: string) => (lists[k] ?? []).filter((x): x is string => typeof x === 'string')
  return {
    foundation: scalars.foundation ?? name,
    version: scalars.version ?? '',
    source: scalars.source ?? '',
    rules: strings('composition_rules'),
    prohibitions: strings('prohibitions'),
    variables: (lists.variables ?? []).filter(
      (x): x is Record<string, string> => typeof x === 'object',
    ),
  }
}

// ------------------------------------------------- who consumes a token

export type Consumer = {
  /** The components/ui file stem, which is also the docs slug. */
  slug: string
  /** Whether a contract (and so a component page) exists for it. */
  governed: boolean
  /** The suffixes it references, e.g. `none`, `full`, `compact`. */
  suffixes: string[]
  /** Whether it also draws a `50%` circle, which is not a radius step. */
  circle: boolean
}

/**
 * Every governed component stylesheet that references `--graphite-<group>-*`,
 * found by reading components/ui. This is the list the pages link from, so a
 * component that starts or stops using a step moves on the page by itself.
 */
export function readConsumers(group: string): Consumer[] {
  const dir = path.join(ROOT, 'components', 'ui')
  const re = new RegExp(`var\\(--graphite-${group}-([a-z0-9]+)\\)`, 'g')
  const out: Consumer[] = []
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.module.scss')) continue
    const src = fs.readFileSync(path.join(dir, file), 'utf8')
    const suffixes = [...new Set([...src.matchAll(re)].map((m) => m[1]))]
    const circle = /border-radius:\s*50%/.test(src)
    if (!suffixes.length && !(group === 'radius' && circle)) continue
    const slug = file.replace(/\.module\.scss$/, '')
    out.push({
      slug,
      governed: fs.existsSync(path.join(ROOT, 'docs', 'contracts', `${slug}.md`)),
      suffixes,
      circle,
    })
  }
  return out
}

/** "contained-list" → "Contained list", the way the gallery titles a page. */
export const titleOf = (slug: string) =>
  slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')

// ---------------------------------------------- page stylesheet geometry

export type ScssDecl = { selector: string; at: string; prop: string; value: string }

/**
 * A flat reading of a CSS-module stylesheet: each declaration with the
 * selector that owns it and the media condition around it (`''` for none).
 * Handles the two shapes the page stylesheets use, a top-level @media around
 * rules and an @media nested inside a rule. Not a Sass parser: interpolation
 * and mixins are out of scope, and the files read here have neither.
 */
export function readScss(rel: string): ScssDecl[] {
  const src = read(rel)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
  const stack: string[] = []
  const out: ScssDecl[] = []
  let buf = ''

  const flush = () => {
    const text = buf.trim()
    buf = ''
    const m = /^([a-z-]+)\s*:\s*([\s\S]+)$/.exec(text)
    if (!m) return
    const at = stack.filter((s) => s.startsWith('@')).join(' and ')
    const selector = stack.filter((s) => !s.startsWith('@')).join(' ')
    out.push({ selector, at, prop: m[1], value: m[2].replace(/\s+/g, ' ').trim() })
  }

  for (const ch of src) {
    if (ch === '{') {
      stack.push(buf.trim().replace(/\s+/g, ' '))
      buf = ''
    } else if (ch === ';') {
      flush()
    } else if (ch === '}') {
      flush()
      stack.pop()
    } else {
      buf += ch
    }
  }
  return out
}

/** One property of one selector, in source order, with its media condition. */
export function pick(decls: ScssDecl[], selector: string, prop: string) {
  return decls.filter((d) => d.selector === selector && d.prop === prop)
}

/**
 * `min-width: 672px` → 672. `''` (no condition) → 0, the mobile-first base.
 * Anything else (a max-width, a mixin) is not a step of this reading → null.
 */
export function minWidthOf(at: string): number | null {
  if (!at) return 0
  const m = /^@media \(min-width: (\d+)px\)$/.exec(at)
  return m ? Number(m[1]) : null
}

/**
 * A length or a shorthand, resolved to px for display: `var(--graphite-space-05)`
 * through the scale, rem at 16. `1.25rem var(--graphite-space-05) 3rem` →
 * `20 / 16 / 48`. Anything it cannot resolve is kept as written.
 */
export function resolvePx(value: string): string {
  const space = Object.fromEntries(readRootVars('space').map((v) => [v.name, v.value]))
  return value
    .split(' ')
    .map((part) => {
      const ref = /^var\((--graphite-space-\d{2})\)$/.exec(part)?.[1]
      const px = toPx(ref ? (space[ref] ?? '') : part)
      return px === null ? part : String(px)
    })
    .join(' / ')
}
