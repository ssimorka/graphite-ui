#!/usr/bin/env node
// Figma component snapshot — the node-side half of the component extraction
// pipeline, and the sibling of scripts/figma-snapshot.mjs.
//
// Reads the chunk payloads returned by scripts/component-extract.js (run
// through the Figma MCP `use_figma` tool) and merges them into one
// normalised, stably-ordered docs/tokens/figma-components.json.
//
//   node scripts/component-snapshot.mjs <chunk.json> [chunk.json ...]
//
// scripts/component-doc-drift.mjs reads the snapshot, never Figma. Nothing
// here touches the network.
//
// The two properties figma-snapshot.mjs calls out apply here for the same
// reasons:
//
//   Diffable. Nothing time-varying is written — no extraction timestamp, no
//   machine name. Pages and sets are sorted by code unit rather than locale,
//   so re-running against an unchanged Figma file produces a byte-identical
//   file. That is what makes the snapshot usable as a drift baseline instead
//   of just a dump, and it is why a kit change shows up as a reviewable diff.
//
//   Verified. EXPECTED_PAGES below is checked, so a chunk that silently
//   truncated in transit fails here instead of quietly landing a snapshot
//   that is missing pages — which would make component-doc-drift report those
//   pages as undocumented and send someone hunting the wrong problem.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = 'docs/tokens/figma-components.json'
const FILE_KEY = 'p2jyUgkFhJd6A5M7L39Ixo'

// The kit's component pages. A count rather than a list of names, because the
// names are what the snapshot is for; a mismatch here means a chunk is
// missing or the kit gained or lost a page, and both want a human to look.
const EXPECTED_PAGES = 45

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('usage: node scripts/component-snapshot.mjs <chunk.json> [...]')
  process.exit(2)
}

const byId = new Map()
for (const f of files) {
  let payload
  try {
    payload = JSON.parse(fs.readFileSync(path.resolve(ROOT, f), 'utf8'))
  } catch (e) {
    console.error(`x ${f}: ${e.message}`)
    process.exit(1)
  }
  if (!Array.isArray(payload)) {
    console.error(`x ${f}: expected an array of page objects`)
    process.exit(1)
  }
  for (const entry of payload) {
    if (entry.error) {
      console.error(`x ${f}: page ${entry.id} came back as "${entry.error}"`)
      process.exit(1)
    }
    if (!entry.id || !entry.page || !Array.isArray(entry.sets)) {
      console.error(`x ${f}: malformed entry ${JSON.stringify(entry).slice(0, 80)}`)
      process.exit(1)
    }
    // Later chunks win, but a page should only appear once; say so if not.
    if (byId.has(entry.id) && byId.get(entry.id).name !== entry.page) {
      console.error(`x page ${entry.id} appears twice under different names`)
      process.exit(1)
    }
    byId.set(entry.id, {
      id: entry.id,
      name: entry.page,
      sets: entry.sets.map(([name, variants, id]) => ({
        name,
        id,
        variants,
        // The kit's own public/private line: an underscore-prefixed set is a
        // build block, usually carrying "Do not edit this component" in its
        // description. docs/contracts/kit/figma-only.md explains why the two
        // do not carry the same obligation.
        private: name.startsWith('_'),
      })),
    })
  }
}

if (byId.size !== EXPECTED_PAGES) {
  console.error(
    `x expected ${EXPECTED_PAGES} pages, merged ${byId.size} — a chunk is missing, truncated, or the kit changed`,
  )
  process.exit(1)
}

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
const pages = [...byId.values()].sort((a, b) => cmp(a.name, b.name))
for (const p of pages) p.sets.sort((a, b) => cmp(a.name, b.name) || cmp(a.id, b.id))

const snapshot = { source: { file: FILE_KEY }, pages }
fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify(snapshot, null, 2) + '\n')

const sets = pages.reduce((n, p) => n + p.sets.length, 0)
const priv = pages.reduce((n, p) => n + p.sets.filter((s) => s.private).length, 0)
console.log(`${OUT}: ${pages.length} pages, ${sets} sets (${priv} private)`)
