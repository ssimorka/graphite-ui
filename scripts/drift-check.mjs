#!/usr/bin/env node
// Drift check — governance rule 4.
//
// Reads each contract's declared token roles and verifies the component's
// actual code references only the CSS variables those roles produce, nothing
// else. Exits non-zero on mismatch so it can gate a build.
//
// The authority is lib/color.js itself: this imports the engine and asks it
// what it generates, rather than parsing a binding table out of a .tsx file.
// A role the engine does not produce cannot be declared by a contract, and a
// variable the engine does not emit cannot be referenced by a component.
//
//   contract frontmatter  on-surface        (kebab)
//   engine role key       onSurface         (camel)
//   emitted CSS variable  --graphite-on-surface
//
// --cds-* is Carbon's compatibility layer, not ours. Components may still
// reference it while Carbon components are in use, so it warns rather than
// fails.

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const CONTRACTS_DIR = 'docs/contracts'
const ENGINE = 'lib/color.js'
const STYLESHEET = 'app/globals.scss'
const IMPL_DIRS = ['components/ui', 'components', 'app']
const PROBE_HEX = '#5e44aa'

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

// Interaction states belong to the primary role rather than being roles of
// their own, so a contract declaring `primary` may reference them.
const PRIMARY_STATE_VARS = [
  '--graphite-primary-hover',
  '--graphite-primary-pressed',
  '--graphite-primary-selected',
  '--graphite-primary-disabled',
  '--graphite-primary-disabled-content',
  '--graphite-focus',
]

// Roles a contract may declare that the engine does not produce yet, by
// design. Each is tracked by open work; they warn rather than fail the build.
const PENDING_ROLES = new Map([
  ['overlay surface', 'Wave 5 — shared overlay surface token not defined yet'],
  ['scrim', 'Wave 5 — Dialog scrim opacity not defined yet'],
])

// ---------------------------------------------------------------- contracts
const frontmatter = (t) => (t.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [, ''])[1]

const scalar = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:[ \t]*(.+)$`, 'm'))
  return m ? m[1].trim() : null
}

const block = (fm, key) => {
  const lines = fm.split(/\r?\n/)
  const i = lines.findIndex((l) => new RegExp(`^${key}:`).test(l))
  if (i === -1) return []
  const out = []
  for (let j = i + 1; j < lines.length && !/^\S/.test(lines[j]); j++) out.push(lines[j])
  return out
}

function readContracts() {
  return fs
    .readdirSync(path.join(ROOT, CONTRACTS_DIR))
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort()
    .map((file) => {
      const fm = frontmatter(fs.readFileSync(path.join(ROOT, CONTRACTS_DIR, file), 'utf8'))
      const roles = []
      const inherits = []
      for (const line of block(fm, 'tokens')) {
        let m = line.match(/^\s*-\s*name:\s*(.+?)\s*$/)
        if (m) { roles.push(m[1]); continue }
        m = line.match(/^\s*-\s*inherited_from:\s*(.+?)\s*$/)
        if (m) inherits.push(m[1])
      }
      return {
        file, slug: file.replace(/\.md$/, ''),
        component: scalar(fm, 'component'),
        version: scalar(fm, 'version'),
        roles, inherits,
      }
    })
}

// ------------------------------------------------------------------- engine
// Ask the engine what it generates. Role -> the variables that role emits.
async function readTokenModel() {
  const mod = await import(pathToFileURL(path.join(ROOT, ENGINE)).href)
  const ramps = mod.makeRamps(PROBE_HEX)
  const theme = mod.buildTheme('light', ramps, 'AA', true)
  const roleToVars = new Map()
  const varToRole = new Map()
  const bind = (role, v) => {
    if (!roleToVars.has(role)) roleToVars.set(role, new Set())
    roleToVars.get(role).add(v)
    varToRole.set(v, role)
  }
  for (const role of Object.keys(theme.tokens)) bind(role, `--graphite-${kebab(role)}`)
  for (const v of PRIMARY_STATE_VARS) bind('primary', v)
  const space = readSpacingVars()
  for (const v of space.spacing) bind('spacing', v)
  for (const v of space.density) bind('density', v)
  return { roleToVars, varToRole }
}

// Spacing is not generated — it has no ramp to sample — so its variables are
// declared statically in the stylesheet rather than produced by the engine.
// Read the declarations (not var() references) so the check covers spacing too
// and rule 4 is not silently color-only.
function readSpacingVars() {
  const src = fs.readFileSync(path.join(ROOT, STYLESHEET), 'utf8')
  const decls = (re) => [...new Set(src.match(re) || [])]
  return {
    spacing: decls(/--graphite-space-\d{2}(?=\s*:)/g),
    density: decls(/--graphite-density-[a-z-]+(?=\s*:)/g),
  }
}

// ------------------------------------------------------------ implementation
function findImpl(slug) {
  const names = [`${slug}.tsx`, `${slug}.jsx`, `${slug}.ts`]
  for (const dir of IMPL_DIRS) {
    const abs = path.join(ROOT, dir)
    if (!fs.existsSync(abs)) continue
    const stack = [abs]
    while (stack.length) {
      const cur = stack.pop()
      for (const e of fs.readdirSync(cur, { withFileTypes: true })) {
        const p = path.join(cur, e.name)
        if (e.isDirectory()) stack.push(p)
        else if (names.includes(e.name)) return path.relative(ROOT, p).split(path.sep).join('/')
      }
    }
  }
  return null
}

const scan = (rel) => {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8')
  return {
    graphite: new Set(src.match(/--graphite-[a-z0-9-]+/g) || []),
    cds: new Set(src.match(/--cds-[a-z0-9-]+/g) || []),
  }
}

// --------------------------------------------------------------------- main
const contracts = readContracts()
const { roleToVars, varToRole } = await readTokenModel()
const byComponent = new Map(contracts.map((c) => [c.component, c]))

function declaredRoles(c, seen = new Set()) {
  const out = new Set(c.roles.map(camel))
  for (const parentName of c.inherits) {
    if (seen.has(parentName)) continue
    seen.add(parentName)
    const parent = byComponent.get(parentName)
    if (parent) for (const r of declaredRoles(parent, seen)) out.add(r)
  }
  return out
}

const errors = []
const warnings = []
let checked = 0
let pending = 0

for (const c of contracts) {
  const roles = declaredRoles(c)
  const allowed = new Set()
  for (const r of roles) for (const v of roleToVars.get(r) || []) allowed.add(v)

  for (const r of roles) {
    if (roleToVars.has(r)) continue
    const why = PENDING_ROLES.get(r)
    if (why) warnings.push(`${c.file}: role "${r}" not generated yet — expected, ${why}`)
    else errors.push(`${c.file}: declares role "${r}", which ${ENGINE} does not generate`)
  }

  const impl = findImpl(c.slug)
  if (!impl) { pending++; continue }
  checked++

  const used = scan(impl)
  for (const v of used.graphite) {
    if (!varToRole.has(v)) errors.push(`${impl}: uses ${v}, which the engine never emits`)
    else if (!allowed.has(v)) {
      errors.push(`${impl}: uses ${v} (role "${varToRole.get(v)}"), not declared in ${c.file}`)
    }
  }
  for (const v of used.cds) {
    warnings.push(`${impl}: uses Carbon's ${v} — prefer the --graphite-* equivalent`)
  }
  for (const r of roles) {
    const vars = roleToVars.get(r)
    if (vars && ![...vars].some((v) => used.graphite.has(v))) {
      warnings.push(`${c.file}: declares role "${r}" but ${impl} never references it`)
    }
  }
}

const plural = (n, s) => `${n} ${s}${n === 1 ? '' : 's'}`
console.log(`drift-check: ${plural(contracts.length, 'contract')}, ` +
  `${plural(roleToVars.size, 'role')}, ${plural(varToRole.size, 'declared variable')}`)
console.log(`  ${checked} implemented and checked, ${pending} awaiting implementation`)
if (warnings.length) { console.log('\nwarnings:'); for (const w of warnings) console.log(`  ! ${w}`) }
if (errors.length) {
  console.log('\nerrors:')
  for (const e of errors) console.log(`  x ${e}`)
  console.log(`\nFAIL — ${errors.length} mismatch${errors.length === 1 ? '' : 'es'}`)
  process.exit(1)
}
console.log('\nOK — no drift')
