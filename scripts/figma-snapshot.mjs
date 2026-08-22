#!/usr/bin/env node
// Figma variable snapshot — the node-side half of the extraction pipeline.
//
// Reads the chunk payloads returned by scripts/figma-extract.js (run through
// the Figma MCP `use_figma` tool) and merges them into one normalised,
// stably-ordered docs/tokens/figma-snapshot.json.
//
//   node scripts/figma-snapshot.mjs <chunk.json> [chunk.json ...]
//
// Everything downstream — radius, typography, re-sourced spacing and
// breakpoint, the drift check — reads the snapshot, never Figma. Nothing here
// touches the network.
//
// Two properties matter more than anything else this file does:
//
//   Diffable. Nothing time-varying is written. Collections and variables are
//   sorted by code unit rather than locale, so the output does not depend on
//   the machine that produced it. Re-running against an unchanged Figma file
//   produces a byte-identical file, which is what makes the snapshot usable
//   as a drift baseline rather than just a dump.
//
//   Verified. Every collection's variable count is checked against EXPECTED
//   below, so a chunk that silently truncated in transit fails the build
//   instead of quietly landing a half-empty collection. The MCP transport
//   does truncate large responses, so this is a real failure mode, not a
//   theoretical one.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = 'docs/tokens/figma-snapshot.json'

const FILE_KEY = 'p2jyUgkFhJd6A5M7L39Ixo'

// Variable counts as read off the file. A mismatch means a chunk is missing,
// truncated, or the Figma file changed — all three want a human to look
// before the snapshot lands.
const EXPECTED = new Map([
  ['Graphite Primitives', 80],
  ['Graphite Semantic', 87],
  ['Graphite Theme', 183],
  ['Graphite Layer', 6],
  ['Graphite Typography', 65],
  ['Breakpoint', 4],
  ['Breakpoint LG–XL', 4],
  ['Radius', 8],
  ['Spacing', 14],
])

// ------------------------------------------------------------------ decoding
// figma-extract.js escapes everything outside printable ASCII to get past the
// MCP transport, which cannot carry a U+2028. Undo that here so the snapshot
// records real names — the en dashes in `Breakpoint LG–XL` reach this path on
// every run.
const decode = (s) =>
  typeof s === 'string'
    ? s.replace(/\\(\\|u[0-9a-fA-F]{4})/g, (_, esc) =>
        esc === '\\' ? '\\' : String.fromCharCode(parseInt(esc.slice(1), 16)),
      )
    : s

// ------------------------------------------------------------------- reading
const readChunk = (file) => {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!raw || !Array.isArray(raw.c))
    throw new Error(`${file}: not an extraction chunk`)
  if (raw.missing && raw.missing.length) {
    throw new Error(
      `${file}: extractor reported missing collections: ${raw.missing.join(', ')}`,
    )
  }
  return raw.c
}

// The wire format nests an alias as { a, m?, x } where x is either the next
// alias or the resolved value. Flatten that into a chain plus a single value,
// which is what a consumer actually wants to read.
const expandValue = (entry) => {
  if (entry === null || typeof entry !== 'object')
    return { value: decode(entry) }

  const chain = []
  let node = entry
  while (node !== null && typeof node === 'object') {
    const link = { ref: decode(node.a) }
    // `m` is recorded only when the alias target had more than one mode, so
    // its presence marks a mode that was chosen rather than implied.
    if (node.m !== undefined) link.mode = decode(node.m)
    if (node.u !== undefined) {
      link.unresolved = node.u
      chain.push(link)
      return { value: null, aliasChain: chain }
    }
    chain.push(link)
    node = node.x
  }
  return { value: decode(node), aliasChain: chain }
}

// --------------------------------------------------------------------- merge
const merge = (files) => {
  const collections = new Map()

  for (const file of files) {
    for (const c of readChunk(file)) {
      const name = decode(c.n)
      if (!collections.has(name)) {
        collections.set(name, {
          modes: c.m.map(decode),
          defaultMode: decode(c.d),
          variables: new Map(),
        })
      }
      const target = collections.get(name)
      for (const v of c.v) {
        const varName = decode(v.n)
        const values = {}
        // Iterate the collection's declared mode order rather than the key
        // order of the payload, so modes read Light/Dark, SM/MD/LG/Max — the
        // order they carry meaning in — instead of alphabetically.
        for (const mode of c.m) values[decode(mode)] = expandValue(v.v[mode])
        const next = { type: v.t, values }

        const prev = target.variables.get(varName)
        if (prev && JSON.stringify(prev) !== JSON.stringify(next)) {
          throw new Error(
            `${name}/${varName}: chunks disagree on this variable`,
          )
        }
        target.variables.set(varName, next)
      }
    }
  }

  return collections
}

// Sort on raw code units. localeCompare would order `Breakpoint LG–XL`
// differently depending on the machine's locale, which would show up as
// spurious diff churn.
const byCodeUnit = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

const verify = (collections) => {
  const problems = []

  for (const [name, expected] of EXPECTED) {
    const got = collections.get(name)
    if (!got) {
      problems.push(`${name}: missing entirely`)
      continue
    }
    if (got.variables.size !== expected) {
      problems.push(
        `${name}: expected ${expected} variables, got ${got.variables.size}`,
      )
    }
  }

  for (const name of collections.keys()) {
    if (!EXPECTED.has(name))
      problems.push(`${name}: not an in-scope collection`)
  }

  return problems
}

// --------------------------------------------------------------------- write
const files = process.argv.slice(2)
if (!files.length) {
  console.error(
    'usage: node scripts/figma-snapshot.mjs <chunk.json> [chunk.json ...]',
  )
  process.exit(2)
}

const collections = merge(files)
const problems = verify(collections)

if (problems.length) {
  console.error('Snapshot rejected:')
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}

const out = {
  source: {
    fileKey: FILE_KEY,
    file: `https://www.figma.com/design/${FILE_KEY}`,
  },
  collections: {},
}

for (const name of [...collections.keys()].sort(byCodeUnit)) {
  const c = collections.get(name)
  const variables = {}
  for (const varName of [...c.variables.keys()].sort(byCodeUnit)) {
    variables[varName] = c.variables.get(varName)
  }
  out.collections[name] = {
    modes: c.modes,
    defaultMode: c.defaultMode,
    variableCount: c.variables.size,
    variables,
  }
}

const dest = path.join(ROOT, OUT)
fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + '\n')

const total = [...collections.values()].reduce(
  (n, c) => n + c.variables.size,
  0,
)
console.log(`${OUT}: ${collections.size} collections, ${total} variables`)
