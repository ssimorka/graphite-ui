#!/usr/bin/env node
// Component doc drift — checks docs/components/*.md against the kit.
//
//   node scripts/component-doc-drift.mjs [snapshot.json] [docs-dir]
//
// Both arguments default to the real paths and exist so
// component-doc-drift.test.mjs can point the check at a mutated copy without
// ever writing to the real ones — the same reason token-drift.mjs takes its
// stylesheet path.
//
// The third governance check, alongside drift-check.mjs (components against
// their contracts) and token-drift.mjs (foundations against the token
// snapshot). This one closes the gap docs/components/README.md admits to:
//
//   "Files here are regenerated manually, not synced automatically. [...]
//    No tooling enforces this yet — it's a manual checklist item for now."
//
// A manual checklist item that nothing runs is a checklist item nobody does.
// Every one of the kit findings in docs/contracts/kit/figma-only.md was
// invisible to CI before this existed.
//
// Like token-drift, this reads a committed snapshot and never Figma, so it
// runs offline in CI. That means it catches a doc drifting from the snapshot,
// not the snapshot drifting from Figma — re-extracting the snapshot is still
// the manual step (scripts/component-extract.js, then
// scripts/component-snapshot.mjs). The division is deliberate and the same one
// token-drift makes: the snapshot is a reviewable record of the kit, and its
// diff is where a kit change becomes visible.
//
// What it checks:
//
//   1. Every Figma node id a doc cites resolves to a page or a component set
//      that still exists. This is what catches a renamed or deleted set.
//   2. Every public set on a page a doc covers is either named or cited by
//      node id in that doc. This is what catches the kit gaining a set that
//      nobody wrote up — README.md's staleness cause #1, and the most common
//      one.
//
//      Either/or, because docs anchor a set both ways and both are legitimate.
//      dropdown.md documents all eight of its sets in a Default/Fluid matrix
//      keyed by node id, so the literal string "Dropdown - Combo box - Default"
//      appears nowhere in it; requiring the name would have failed a doc that
//      is in fact complete.
//   3. Every component page in the kit has a doc covering it.
//
// Private sets — the kit's underscore-prefixed build blocks — are deliberately
// exempt from #2. They carry "Do not edit this component" rather than a spec,
// and documenting all 91 of them would bury the 115 that matter. See
// docs/contracts/kit/figma-only.md.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DOCS_DIR = process.argv[3] ?? 'docs/components'
const SNAPSHOT = process.argv[2] ?? 'docs/tokens/figma-components.json'

// Figma writes some set names with a stray double space. A doc that renders
// the name sensibly should not fail for reproducing it sensibly.
const norm = (s) => s.replace(/\s+/g, ' ').trim()

const snap = JSON.parse(fs.readFileSync(path.resolve(ROOT, SNAPSHOT), 'utf8'))

const pageById = new Map()
const setById = new Map()
for (const page of snap.pages) {
  pageById.set(page.id, page)
  for (const set of page.sets) setById.set(set.id, { set, page })
}

const docs = fs
  .readdirSync(path.resolve(ROOT, DOCS_DIR))
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .sort()

const errors = []
const covered = new Map() // page id -> [doc, ...]

for (const file of docs) {
  const rel = `${DOCS_DIR}/${file}`
  const text = fs.readFileSync(path.resolve(ROOT, rel), 'utf8')
  const flat = norm(text)

  const ids = new Set(
    [...new Set(text.match(/`\d+:\d+`/g) ?? [])].map((m) => m.slice(1, -1)),
  )
  if (ids.size === 0) {
    errors.push(`${rel}: cites no Figma node ids, so nothing anchors it to the kit`)
    continue
  }

  const pages = new Set()
  for (const id of ids) {
    if (pageById.has(id)) {
      pages.add(id)
    } else if (setById.has(id)) {
      pages.add(setById.get(id).page.id)
    } else {
      errors.push(
        `${rel}: node ${id} is neither a page nor a component set in the kit — renamed, deleted, or never a set`,
      )
    }
  }

  for (const pid of pages) {
    covered.set(pid, [...(covered.get(pid) ?? []), rel])
    for (const set of pageById.get(pid).sets) {
      if (set.private) continue
      if (!ids.has(set.id) && !flat.includes(norm(set.name))) {
        errors.push(
          `${rel}: kit page "${pageById.get(pid).name}" has a public set "${set.name}" (${set.variants} variants, ${set.id}) that this doc neither names nor cites`,
        )
      }
    }
  }
}

for (const page of snap.pages) {
  if (!covered.has(page.id)) {
    errors.push(`${page.name}: no doc in ${DOCS_DIR}/ covers this page`)
  }
}

const publicSets = snap.pages.reduce((n, p) => n + p.sets.filter((s) => !s.private).length, 0)
console.log(
  `component-doc-drift: ${docs.length} docs, ${snap.pages.length} kit pages, ${publicSets} public sets checked`,
)

if (errors.length > 0) {
  console.error('\nerrors:')
  for (const e of errors) console.error(`  x ${e}`)
  console.error(`\nFAIL — ${errors.length} mismatch${errors.length === 1 ? '' : 'es'}`)
  process.exit(1)
}

console.log('\nOK — no drift')
