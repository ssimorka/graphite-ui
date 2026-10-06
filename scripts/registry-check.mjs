// Registry check: every item `npx shadcn add` can ask for builds, and every
// dependency it names exists.
//
// The registry (lib/registry.ts) is built from the repo on request, so a
// mistake shows up only when someone installs: a component that imports a
// helper no item provides throws, and a dependency URL that names no item
// leaves the CLI with a 404 halfway through an install. This runs the same
// generator in CI, through Node's own type stripping and an alias hook, so
// those failures land on the pull request instead.
//
//   node --import ./scripts/lib/register-alias.mjs scripts/registry-check.mjs

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const BASE = 'https://registry.check/r'
const reg = await import(pathToFileURL(path.join(ROOT, 'lib', 'registry.ts')).href)
const { COVER_SOURCE_HEX } = await import(pathToFileURL(path.join(ROOT, 'lib', 'cover-source.ts')).href)

const errors = []
const names = reg.registryNames()
const known = new Set(names)
let files = 0

for (const name of names) {
  let item
  try {
    item = reg.registryItem(name, BASE)
  } catch (e) {
    errors.push(`${name}: ${e.message}`)
    continue
  }
  if (!item) {
    errors.push(`${name}: listed in the index but builds no item`)
    continue
  }
  if (item.name !== name) errors.push(`${name}: item is named ${item.name}`)
  for (const url of item.registryDependencies ?? []) {
    const dep = url.startsWith(`${BASE}/`) && url.endsWith('.json') ? url.slice(BASE.length + 1, -5) : null
    if (!dep || !known.has(dep)) errors.push(`${name}: depends on ${url}, which is not an item`)
  }
  for (const f of item.files) {
    files++
    if (!f.content) errors.push(`${name}: ${f.path} is empty`)
    if (f.type === 'registry:file' && !f.target) errors.push(`${name}: ${f.path} is registry:file with no target`)
    // A stylesheet typed anything else goes through the CLI's TSX transformer.
    if (f.path.endsWith('.scss') && f.type !== 'registry:file')
      errors.push(`${name}: ${f.path} must be registry:file, or the CLI parses Sass as TSX`)
  }
}

// Every contract names a component the registry serves.
for (const file of fs.readdirSync(path.join(ROOT, 'docs', 'contracts'))) {
  if (!file.endsWith('.md') || file === 'README.md') continue
  const slug = file.replace(/\.md$/, '')
  if (!known.has(slug)) errors.push(`docs/contracts/${file}: no registry item named ${slug}`)
}

// The theme endpoint builds for the default source, and refuses junk.
const theme = reg.themeItem(COVER_SOURCE_HEX, 'AA')
if (!theme || !theme.files[0].content.includes('--graphite-primary:'))
  errors.push(`theme/${COVER_SOURCE_HEX.slice(1)}: does not build a theme file`)
if (reg.themeItem('nothex', 'AA') !== null) errors.push('theme/nothex: should be refused')

if (errors.length) {
  console.error(`registry-check: ${errors.length} problem(s)`)
  for (const e of errors) console.error(`  x ${e}`)
  process.exit(1)
}
console.log(`registry-check: ${names.length} items, ${files} files, every dependency resolves`)
