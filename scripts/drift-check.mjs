#!/usr/bin/env node
// Drift check — governance rule 4.
//
// Reads each contract's declared token roles and verifies the component's
// actual code references only CSS variables backed by those roles, nothing
// else. Exits non-zero on mismatch so it can gate a build.
//
// Three namespaces are in play and the script reconciles them:
//   contract frontmatter  on-surface, primary, outline   (kebab)
//   color engine roles    onSurface, primary, outline    (camel, lib/color.js)
//   stamped CSS vars      --cds-text-primary, ...        (Carbon)
// The role -> var mapping is read from CARBON_VAR_BINDINGS rather than
// hardcoded here, so the engine stays the single source of truth.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const CONTRACTS_DIR = 'docs/contracts'
const BINDINGS_FILE = 'components/theme-provider.tsx'
const IMPL_DIRS = ['components/ui', 'components', 'app']

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

// ---------------------------------------------------------------- contracts
const frontmatter = (t) => (t.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [, ''])[1]

const scalar = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:[ \t]*(.+)$`, 'm'))
  return m ? m[1].trim() : null
}

// Lines indented under a top-level key, up to the next top-level key.
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
        wave: scalar(fm, 'wave'),
        roles, inherits,
      }
    })
}

// ----------------------------------------------------------------- bindings
// Parse CARBON_VAR_BINDINGS: ['--cds-x', (t) => t.role.hex]
// `primary.base` / `primary.hover` collapse to the `primary` role.
function readBindings() {
  const src = fs.readFileSync(path.join(ROOT, BINDINGS_FILE), 'utf8')
  const re = /\['(--cds-[a-z0-9-]+)',\s*\(_?\w+(?:,\s*\w+)?\)\s*=>\s*\w+\.([A-Za-z][A-Za-z0-9.]*)/g
  const roleToVars = new Map()
  const varToRole = new Map()
  let m
  while ((m = re.exec(src))) {
    const cssVar = m[1]
    const role = m[2].replace(/\.hex$/, '').split('.')[0]
    if (!roleToVars.has(role)) roleToVars.set(role, new Set())
    roleToVars.get(role).add(cssVar)
    varToRole.set(cssVar, role)
  }
  return { roleToVars, varToRole }
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
        else if (names.includes(e.name)) return path.relative(ROOT, p).split(path.sep).join("/")
      }
    }
  }
  return null
}

const varsUsedIn = (rel) => {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8')
  return new Set(src.match(/--cds-[a-z0-9-]+/g) || [])
}

// Roles a contract may declare that are not bound yet *by design*. Each is
// tracked by open work; they warn rather than fail the build, so the check can
// gate CI today instead of after Wave 0 and Wave 5 land.
const PENDING_ROLES = new Map([
  ["status role", "issue #42 — status color roles (Wave 0)"],
  ["overlay surface", "Wave 5 — shared overlay surface token not defined yet"],
  ["scrim", "Wave 5 — Dialog scrim opacity not defined yet"],
])

// --------------------------------------------------------------------- main
const contracts = readContracts()
const { roleToVars, varToRole } = readBindings()
const byComponent = new Map(contracts.map((c) => [c.component, c]))

// Declared roles, following `inherited_from: <Component>` one level up.
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
    if (!roleToVars.has(r)) {
      const pending = PENDING_ROLES.get(r)
      if (pending) warnings.push(`${c.file}: role "${r}" is unbound — expected, ${pending}`)
      else errors.push(`${c.file}: declares role "${r}" — no CSS variable is bound to it in ${BINDINGS_FILE}`)
    }
  }

  const impl = findImpl(c.slug)
  if (!impl) { pending++; continue }
  checked++

  const used = varsUsedIn(impl)
  for (const v of used) {
    if (!varToRole.has(v)) errors.push(`${impl}: uses ${v}, which ${BINDINGS_FILE} never stamps`)
    else if (!allowed.has(v)) {
      errors.push(`${impl}: uses ${v} (role "${varToRole.get(v)}"), not declared in ${c.file}`)
    }
  }
  for (const r of roles) {
    const vars = roleToVars.get(r)
    if (vars && ![...vars].some((v) => used.has(v))) {
      warnings.push(`${c.file}: declares role "${r}" but ${impl} never references it`)
    }
  }
}

const plural = (n, s) => `${n} ${s}${n === 1 ? '' : 's'}`
console.log(`drift-check: ${plural(contracts.length, 'contract')}, ` +
  `${plural(roleToVars.size, 'bound role')}, ${plural(varToRole.size, 'CSS variable')}`)
console.log(`  ${checked} implemented and checked, ${pending} awaiting implementation`)
if (warnings.length) { console.log('\nwarnings:'); for (const w of warnings) console.log(`  ! ${w}`) }
if (errors.length) {
  console.log('\nerrors:')
  for (const e of errors) console.log(`  x ${e}`)
  console.log(`\nFAIL — ${errors.length} mismatch${errors.length === 1 ? '' : 'es'}`)
  process.exit(1)
}
console.log('\nOK — no drift')
