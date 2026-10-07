import fs from 'node:fs'
import path from 'node:path'

/**
 * A contract read as documentation. `lib/contracts.ts` reads only the four
 * fields the gallery labels with; the component pages need the tables too, so
 * their API, slot and token sections are the contract rather than a copy of it.
 * The point of that (and of the kit's "Generated from the contract") is that a
 * page cannot describe a prop the component does not have.
 *
 * The frontmatter is a small YAML subset (top-level lists of `- key: value`
 * items, with a following indented `key: value` continuing the item) and this
 * reads exactly that, so it stays free of a YAML dependency. Server-only.
 */

export type ContractSlot = {
  name: string
  required: boolean
  notes: string
  /** The contract this row was inherited from, when it was. */
  inheritedFrom?: string
}
export type ContractProp = {
  name: string
  type: string
  default: string
  notes: string
  inheritedFrom?: string
}
export type ContractToken = {
  name: string
  usage: string
  /** The contract this row was inherited from, when it was. An
   *  `inherited_from` that names no contract file (Select's "Text input" does;
   *  "Wave 5 shared Overlay base" does not) stays a single row of its own with
   *  an empty `name`. */
  inheritedFrom?: string
}

export type ContractDoc = {
  component: string
  version: string
  wave: string
  slots: ContractSlot[]
  props: ContractProp[]
  tokens: ContractToken[]
  compositionRules: string[]
  prohibitions: string[]
}

const unquote = (v: string) => v.replace(/^(['"])(.*)\1$/, '$2')

type Item = Record<string, string>

// Most contracts list a prop's options as `values` (`[sm, md, lg]`, `boolean`)
// rather than a `type`. Rendered as the TypeScript union the component takes.
function typeFromValues(values: string | undefined): string {
  if (!values) return ''
  const list = values.match(/^\[(.*)\]$/)
  if (!list) return values
  return list[1]
    .split(',')
    .map((v) => v.trim().replace(/^["']|["']$/g, ''))
    .map((v) => (v === 'etc.' ? '…' : `'${v}'`))
    .join(' | ')
}

function readList(lines: string[], key: string): Item[] {
  const start = lines.findIndex((l) => new RegExp(`^${key}:\\s*$`).test(l))
  if (start === -1) return []
  const items: Item[] = []
  for (let i = start + 1; i < lines.length && !/^\S/.test(lines[i]); i++) {
    const line = lines[i]
    const first = line.match(/^\s*-\s+([\w]+):\s*(.*)$/)
    if (first) {
      items.push({ [first[1]]: unquote(first[2].trim()) })
      continue
    }
    const more = line.match(/^\s+([\w]+):\s*(.*)$/)
    if (more && items.length) items[items.length - 1][more[1]] = unquote(more[2].trim())
  }
  return items
}

function readStrings(lines: string[], key: string): string[] {
  const start = lines.findIndex((l) => new RegExp(`^${key}:\\s*$`).test(l))
  if (start === -1) return []
  const out: string[] = []
  for (let i = start + 1; i < lines.length && !/^\S/.test(lines[i]); i++) {
    const m = lines[i].match(/^\s*-\s+(.*)$/)
    if (m) out.push(m[1].trim())
  }
  return out
}

const slugOf = (component: string) => component.toLowerCase().replace(/\s+/g, '-')

const contractPath = (slug: string) =>
  path.join(process.cwd(), 'docs', 'contracts', `${slug}.md`)

/**
 * Expand `- inherited_from: X` rows into X's own rows, each marked with where it
 * came from, so Text area's page lists Text input's slots, props and tokens
 * rather than a blank row. Recursive, with a guard against a cycle. A name with
 * no contract file is left as the single marker row.
 */
function expand<T extends { name: string; inheritedFrom?: string }>(
  items: Item[],
  map: (item: Item) => T,
  pick: (doc: ContractDoc) => T[],
  seen: Set<string>,
): T[] {
  const rows = items.flatMap((item): T[] => {
    const from = item.inherited_from
    if (!from) return [map(item)]
    const slug = slugOf(from)
    if (seen.has(slug) || !fs.existsSync(contractPath(slug))) {
      return [{ ...map(item), inheritedFrom: from }]
    }
    return pick(readContract(slug, new Set([...seen, slug]))).map((row) => ({
      ...row,
      inheritedFrom: row.inheritedFrom ?? from,
    }))
  })
  // A component's own row outranks one it inherited under the same name
  // (Select restates on-surface-variant with its own usage). Between two
  // inherited rows of one name, the first contract listed wins: two parents
  // that share a role (Text input and Dropdown both bind outline, primary,
  // danger...) would otherwise list it twice, under one React key.
  const own = new Set(rows.filter((r) => !r.inheritedFrom && r.name).map((r) => r.name))
  const taken = new Set<string>()
  return rows.filter((r) => {
    if (!r.inheritedFrom || !r.name) return true
    if (own.has(r.name) || taken.has(r.name)) return false
    taken.add(r.name)
    return true
  })
}

export function readContractDoc(slug: string): ContractDoc {
  return readContract(slug, new Set([slug]))
}

function readContract(slug: string, seen: Set<string>): ContractDoc {
  const src = fs.readFileSync(contractPath(slug), 'utf8')
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const lines = fm.split(/\r?\n/)
  const scalar = (k: string) =>
    lines.find((l) => l.startsWith(`${k}:`))?.slice(k.length + 1).trim() ?? ''

  return {
    component: scalar('component'),
    version: scalar('version'),
    wave: scalar('wave'),
    slots: expand<ContractSlot>(
      readList(lines, 'slots'),
      (s) => ({ name: s.name ?? '', required: s.required === 'true', notes: s.notes ?? '' }),
      (d) => d.slots,
      seen,
    ),
    props: expand<ContractProp>(
      readList(lines, 'props'),
      (p) => ({ name: p.name ?? '', type: p.type ?? typeFromValues(p.values), default: p.default ?? '', notes: p.notes ?? '' }),
      (d) => d.props,
      seen,
    ),
    tokens: expand<ContractToken>(
      readList(lines, 'tokens'),
      (t) => ({ name: t.name ?? '', usage: t.usage ?? '' }),
      (d) => d.tokens,
      seen,
    ),
    compositionRules: readStrings(lines, 'composition_rules'),
    prohibitions: readStrings(lines, 'prohibitions'),
  }
}
