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

export type ContractSlot = { name: string; required: boolean; notes: string }
export type ContractProp = {
  name: string
  type: string
  default: string
  notes: string
}
export type ContractToken = {
  name: string
  usage: string
  /** Set when the contract borrows another component's tokens wholesale
   *  (`- inherited_from: Text input`) rather than naming a role. */
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

export function readContractDoc(slug: string): ContractDoc {
  const src = fs.readFileSync(
    path.join(process.cwd(), 'docs', 'contracts', `${slug}.md`),
    'utf8',
  )
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const lines = fm.split(/\r?\n/)
  const scalar = (k: string) =>
    lines.find((l) => l.startsWith(`${k}:`))?.slice(k.length + 1).trim() ?? ''

  return {
    component: scalar('component'),
    version: scalar('version'),
    wave: scalar('wave'),
    slots: readList(lines, 'slots').map((s) => ({
      name: s.name ?? '',
      required: s.required === 'true',
      notes: s.notes ?? '',
    })),
    props: readList(lines, 'props').map((p) => ({
      name: p.name ?? '',
      type: p.type ?? '',
      default: p.default ?? '',
      notes: p.notes ?? '',
    })),
    tokens: readList(lines, 'tokens').map((t) => ({
      name: t.name ?? '',
      usage: t.usage ?? '',
      ...(t.inherited_from ? { inheritedFrom: t.inherited_from } : {}),
    })),
    compositionRules: readStrings(lines, 'composition_rules'),
    prohibitions: readStrings(lines, 'prohibitions'),
  }
}
