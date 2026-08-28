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

// Interaction states belong to their family's role rather than being roles of
// their own, so a contract declaring `primary` or `secondary` may reference
// that family's states. Built from the family name so the two stay in step.
const familyStateVars = (family) => [
  `--graphite-${family}-hover`,
  `--graphite-${family}-pressed`,
  `--graphite-${family}-selected`,
  `--graphite-${family}-disabled`,
  `--graphite-${family}-disabled-content`,
  `--graphite-${family}-focus`,
]

// --graphite-focus is the page-level ring: it belongs to no family, so any
// contract that declares primary may reach for it.

// Roles a contract may declare that the engine does not produce yet, by
// design. Each is tracked by open work; they warn rather than fail the build.
const PENDING_ROLES = new Map([])

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
  for (let j = i + 1; j < lines.length && !/^\S/.test(lines[j]); j++)
    out.push(lines[j])
  return out
}

function readContracts() {
  return fs
    .readdirSync(path.join(ROOT, CONTRACTS_DIR))
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort()
    .map((file) => {
      const fm = frontmatter(
        fs.readFileSync(path.join(ROOT, CONTRACTS_DIR, file), 'utf8'),
      )
      const roles = []
      const inherits = []
      for (const line of block(fm, 'tokens')) {
        let m = line.match(/^\s*-\s*name:\s*(.+?)\s*$/)
        if (m) {
          roles.push(m[1])
          continue
        }
        m = line.match(/^\s*-\s*inherited_from:\s*(.+?)\s*$/)
        if (m) inherits.push(m[1])
      }
      return {
        file,
        slug: file.replace(/\.md$/, ''),
        component: scalar(fm, 'component'),
        version: scalar(fm, 'version'),
        roles,
        inherits,
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
  for (const role of Object.keys(theme.tokens))
    bind(role, `--graphite-${kebab(role)}`)
  // Driven off the engine's own family list, so a family added there is bound
  // here without a second edit. --graphite-focus is primary's ring rather than
  // a family of its own, so it is bound separately.
  for (const family of mod.STATE_FAMILIES)
    for (const v of familyStateVars(family)) bind(family, v)
  bind('primary', '--graphite-focus')
  const statics = readStaticVars()
  for (const v of statics.spacing) bind('spacing', v)
  for (const v of statics.radius) bind('radius', v)
  for (const v of statics.breakpoint) bind('breakpoint', v)
  for (const v of statics.font) bind('font', v)
  for (const v of statics.text) bind('text', v)
  for (const v of statics.density) bind('density', v)
  for (const v of statics.motion) bind('motion', v)
  for (const v of statics.scrim) bind('scrim', v)
  return { roleToVars, varToRole }
}

// These foundations are not generated — they have no ramp to sample — so
// their variables are declared statically in the stylesheet rather than
// produced by the engine. Read the declarations (not var() references) so the
// check covers them too and rule 4 is not silently color-only.
//
// Radius reads `[a-z0-9-]` rather than spacing's `\d{2}` because its suffix is
// the pixel value, so it is unpadded and includes the words none and full.
function readStaticVars() {
  const src = fs.readFileSync(path.join(ROOT, STYLESHEET), 'utf8')
  const decls = (re) => [...new Set(src.match(re) || [])]
  return {
    spacing: decls(/--graphite-space-\d{2}(?=\s*:)/g),
    radius: decls(/--graphite-radius-[a-z0-9-]+(?=\s*:)/g),
    breakpoint: decls(/--graphite-breakpoint-[a-z]+(?=\s*:)/g),
    font: decls(/--graphite-font-[a-z0-9-]+(?=\s*:)/g),
    text: decls(/--graphite-text-[a-z0-9-]+(?=\s*:)/g),
    density: decls(/--graphite-density-[a-z-]+(?=\s*:)/g),
    motion: decls(/--graphite-motion-[a-z-]+(?=\s*:)/g),
    scrim: decls(/--graphite-scrim(?=\s*:)/g),
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
        else if (names.includes(e.name))
          return path.relative(ROOT, p).split(path.sep).join('/')
      }
    }
  }
  return null
}

// Follows `@use './x'` from a stylesheet into the partial it pulls in, so a
// token reached through a shared mixin is still attributed to the component
// using it. Without this, moving a rule into a partial hides it from rule 4
// entirely: when Label and Field were absorbed into the form controls their
// shared parts moved to _form-parts.scss, and four roles went invisible
// across six components with the check still green.
const readWithPartials = (abs, seen = new Set()) => {
  if (seen.has(abs) || !fs.existsSync(abs)) return ''
  seen.add(abs)
  const src = fs.readFileSync(abs, 'utf8')
  const dir = path.dirname(abs)
  let out = src
  for (const m of src.matchAll(/@use\s+'\.\/([A-Za-z0-9_-]+)'/g)) {
    // Sass resolves `./form-parts` to `_form-parts.scss`.
    for (const cand of [`_${m[1]}.scss`, `${m[1]}.scss`]) {
      const p = path.join(dir, cand)
      if (fs.existsSync(p)) {
        out += '\n' + readWithPartials(p, seen)
        break
      }
    }
  }
  return out
}

const scan = (rel) => {
  // A component's styles are part of its code, so the co-located module counts
  // -- and so does anything that module @uses.
  const sheet = rel.replace(/\.(tsx|jsx|ts)$/, '.module.scss')
  const src =
    fs.readFileSync(path.join(ROOT, rel), 'utf8') +
    '\n' +
    readWithPartials(path.join(ROOT, sheet))
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
    if (why)
      warnings.push(
        `${c.file}: role "${r}" not generated yet — expected, ${why}`,
      )
    else
      errors.push(
        `${c.file}: declares role "${r}", which ${ENGINE} does not generate`,
      )
  }

  const impl = findImpl(c.slug)
  if (!impl) {
    pending++
    continue
  }

  // Governance rule 3 versions every contract, and rule 5 has the Figma
  // component carry that number. The component's own docblock is the third
  // copy, and nothing was comparing them: seven had fallen behind, two of
  // them by two minor versions, before #78 went looking.
  const implSrc = fs.readFileSync(path.join(ROOT, impl), 'utf8')
  const stamped = new RegExp(`${c.slug}\\.md \\((\\d+\\.\\d+\\.\\d+)\\)`).exec(
    implSrc,
  )
  if (!stamped) {
    warnings.push(`${impl}: no "Contract: ${c.file} (version)" docblock`)
  } else if (stamped[1] !== c.version) {
    errors.push(
      `${impl}: docblock says ${c.slug}.md (${stamped[1]}), but ${c.file} is ${c.version}`,
    )
  }
  checked++

  const used = scan(impl)
  for (const v of used.graphite) {
    if (!varToRole.has(v))
      errors.push(`${impl}: uses ${v}, which the engine never emits`)
    else if (!allowed.has(v)) {
      errors.push(
        `${impl}: uses ${v} (role "${varToRole.get(v)}"), not declared in ${c.file}`,
      )
    }
  }
  for (const v of used.cds) {
    warnings.push(
      `${impl}: uses Carbon's ${v} — prefer the --graphite-* equivalent`,
    )
  }
  for (const r of roles) {
    const vars = roleToVars.get(r)
    if (vars && ![...vars].some((v) => used.graphite.has(v))) {
      warnings.push(
        `${c.file}: declares role "${r}" but ${impl} never references it`,
      )
    }
  }
}

// ------------------------------------- components that no contract declares
// Governance rule 1: every component has one contract file. The loop above is
// contract-driven, so a component nothing declares is never visited — which is
// how ButtonGroup shipped. button.md, card.md and dialog.md all named it as
// the mechanism enforcing the one-primary rule while it had no contract of its
// own (#93).
//
// The signal is an intersection, and that is what keeps it quiet: a name some
// contract's text refers to, that components/ui exports, and that no contract
// declares. Multi-part exports like CardHeader are exported but never referred
// to as components in contract text; work that does not exist yet, like
// Spinner and Toast, is referred to but not exported. Only something being
// leaned on without a spec satisfies all three.
const UI_DIR = 'components/ui'

const exportedComponents = () => {
  const out = new Map()
  const abs = path.join(ROOT, UI_DIR)
  if (!fs.existsSync(abs)) return out
  for (const e of fs.readdirSync(abs)) {
    if (!/\.(tsx|jsx|ts)$/.test(e)) continue
    const src = fs.readFileSync(path.join(abs, e), 'utf8')
    for (const m of src.matchAll(/export\s+(?:function|const)\s+([A-Z][A-Za-z0-9]*)/g))
      if (!out.has(m[1])) out.set(m[1], `${UI_DIR}/${e}`)
  }
  return out
}

{
  const exported = exportedComponents()
  // "Dropdown Menu" in frontmatter is DropdownMenu in code.
  const declared = new Set(
    contracts.map((c) => (c.component || '').replace(/\s+/g, '')),
  )
  const seen = new Map()
  for (const c of contracts) {
    const text = fs.readFileSync(path.join(ROOT, CONTRACTS_DIR, c.file), 'utf8')
    for (const m of text.matchAll(/\b[A-Z][A-Za-z0-9]+\b/g)) {
      const name = m[0]
      if (exported.has(name) && !declared.has(name) && !seen.has(name))
        seen.set(name, c.file)
    }
  }
  for (const [name, from] of seen) {
    errors.push(
      `${exported.get(name)}: exports ${name}, which ${from} leans on but no ` +
        `contract declares — governance rule 1`,
    )
  }
}

const plural = (n, s) => `${n} ${s}${n === 1 ? '' : 's'}`
console.log(
  `drift-check: ${plural(contracts.length, 'contract')}, ` +
    `${plural(roleToVars.size, 'role')}, ${plural(varToRole.size, 'declared variable')}`,
)
console.log(
  `  ${checked} implemented and checked, ${pending} awaiting implementation`,
)
if (warnings.length) {
  console.log('\nwarnings:')
  for (const w of warnings) console.log(`  ! ${w}`)
}
if (errors.length) {
  console.log('\nerrors:')
  for (const e of errors) console.log(`  x ${e}`)
  console.log(
    `\nFAIL — ${errors.length} mismatch${errors.length === 1 ? '' : 'es'}`,
  )
  process.exit(1)
}
console.log('\nOK — no drift')
