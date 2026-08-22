#!/usr/bin/env node
// Token drift check — the Figma half of governance rule 4.
//
// scripts/drift-check.mjs answers "does the code use the tokens its contract
// declares". This answers the other question: "do those tokens still say what
// the design file says". It diffs the foundations declared in the stylesheet
// against docs/tokens/figma-snapshot.json and exits non-zero on a mismatch.
//
//   snapshot            the kit, as extracted by scripts/figma-extract.js
//   app/globals.scss    what the browser actually gets
//
// The snapshot is the authority. A value that differs is drift, whichever side
// moved — this cannot tell you which, only that they disagree.
//
// Three things drift here that a value diff cannot see, so they are checked
// separately and reported as warnings rather than failures:
//
//   1. A breakpoint written into a media query. Custom properties do not work
//      in @media, so those numbers are literals no token can govern.
//   2. A radius expressed with a spacing token. 4px is 4px, so every value
//      still matches the kit while the two scales stay tangled (#78).
//   3. Carbon consumed directly, bypassing the token layer entirely. Those
//      declarations inherit Carbon's scale, not the kit's.
//
// They warn rather than fail because all three describe work that is tracked
// and not yet done. Turning any of them into an error is the last step of the
// issue that fixes it, not a reason to hold this check back.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SNAPSHOT = 'docs/tokens/figma-snapshot.json'
// Overridable so the test suite can point the check at a mutated copy instead
// of editing the real stylesheet to prove the check fails when it should.
const STYLESHEET = process.argv[2] || 'app/globals.scss'
const SCAN_DIRS = ['components', 'app']

// The override may be absolute, so resolve once rather than joining ROOT onto
// something that already starts at the drive root.
const stylesheetPath = path.isAbsolute(STYLESHEET)
  ? STYLESHEET
  : path.join(ROOT, STYLESHEET)

// The stylesheet emits spacing and typography in rem and radius and
// breakpoints in px — deliberately, and for different reasons, each commented
// at its declarations. The check encodes that rather than normalising it away,
// because "everything in px" would silently accept a spacing scale that had
// stopped scaling with the reader's font size.
const ROOT_FONT_PX = 16

// The kit stores Figma style names; CSS needs numbers. globals.scss maps them
// once at the token, so this is the second copy and has to agree with it.
const WEIGHTS = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 }

// Which breakpoint the kit's Desktop/Mobile typography modes divide at. The
// kit does not say, so the stylesheet picks one; this is the same choice,
// stated once more so a change to either side shows up here.
const MOBILE_MAX_WIDTH = 671

const errors = []
const warnings = []

const snapshot = JSON.parse(fs.readFileSync(path.join(ROOT, SNAPSHOT), 'utf8'))
const css = fs.readFileSync(stylesheetPath, 'utf8')

const collection = (name) => {
  const c = snapshot.collections[name]
  if (!c) throw new Error(`${SNAPSHOT} has no "${name}" collection`)
  return c.variables
}

// ------------------------------------------------------------------ helpers
const toPx = (value) => {
  const n = parseFloat(value)
  if (Number.isNaN(n)) return null
  return value.includes('rem') ? n * ROOT_FONT_PX : n
}

const declarations = (src, re) => {
  const out = new Map()
  for (const m of src.matchAll(re)) out.set(m[1], m[2].trim())
  return out
}

// Pull out the `@media (max-width: Npx) { :root { ... } }` block by brace
// matching, so the two modes are read separately. Anchoring on the `:root`
// inside matters: the stylesheet has other media queries at the same width
// that style page chrome, and folding those in would misread the scale.
function splitModes(src) {
  const head = new RegExp(
    `@media\\s*\\(max-width:\\s*${MOBILE_MAX_WIDTH}px\\)\\s*\\{\\s*:root\\s*\\{`,
  )
  const m = head.exec(src)
  if (!m) return { desktop: src, mobile: '' }

  let depth = 2
  let i = m.index + m[0].length
  const start = i
  for (; i < src.length && depth > 0; i += 1) {
    if (src[i] === '{') depth += 1
    else if (src[i] === '}') depth -= 1
  }
  return {
    desktop: src.slice(0, m.index) + src.slice(i),
    mobile: src.slice(start, i),
  }
}

const { desktop, mobile } = splitModes(css)

// ------------------------------------------------------------------ spacing
// Kit names carry their own index: `16px (1rem) (spacing-05)`.
function checkSpacing() {
  const kit = new Map()
  for (const [name, v] of Object.entries(collection('Spacing'))) {
    const m = /\(spacing-(\d{2})\)/.exec(name)
    if (!m) {
      errors.push(`Spacing: cannot read a step index out of "${name}"`)
      continue
    }
    kit.set(m[1], v.values['Mode 1'].value)
  }

  const declared = declarations(
    desktop,
    /--graphite-space-(\d{2})\s*:\s*([^;]+);/g,
  )
  compare('spacing', kit, declared, (k) => `--graphite-space-${k}`)
}

// ------------------------------------------------------------------- radius
// Kit names are the pixel value, plus the words None and full.
function checkRadius() {
  const kit = new Map()
  for (const [name, v] of Object.entries(collection('Radius'))) {
    kit.set(name === 'None' ? 'none' : name, v.values['Mode 1'].value)
  }
  const declared = declarations(
    desktop,
    /--graphite-radius-([a-z0-9-]+)\s*:\s*([^;]+);/g,
  )
  compare('radius', kit, declared, (k) => `--graphite-radius-${k}`)
}

// --------------------------------------------------------------- breakpoint
// The main collection aliases into `Breakpoint LG–XL` for the lg/xl modes;
// read both so the two tokens are checked against their real sources rather
// than against the alias fallback.
function checkBreakpoints() {
  const main = collection('Breakpoint')['Viewport size'].values
  const sub = collection('Breakpoint LG–XL')['Viewport size'].values

  const kit = new Map([
    ['sm', main['SM (320px)'].value],
    ['md', main['MD (672px)'].value],
    ['lg', sub['LG (1056px)'].value],
    ['xl', sub['XL (1312px)'].value],
    ['max', main['Max–Max plus (1584–1784px)'].value],
  ])

  const declared = declarations(
    desktop,
    /--graphite-breakpoint-([a-z]+)\s*:\s*([^;]+);/g,
  )
  compare('breakpoint', kit, declared, (k) => `--graphite-breakpoint-${k}`)
  return kit
}

// --------------------------------------------------------------- typography
function checkTypography() {
  const kit = collection('Graphite Typography')

  const families = declarations(
    desktop,
    /--graphite-font-([a-z0-9-]+)\s*:\s*([^;]+);/g,
  )
  const weights = declarations(
    desktop,
    /--graphite-text-weight-([a-z]+)\s*:\s*([^;]+);/g,
  )
  const dSize = declarations(
    desktop,
    /--graphite-text-([a-z0-9-]+)-size\s*:\s*([^;]+);/g,
  )
  const dLine = declarations(
    desktop,
    /--graphite-text-([a-z0-9-]+)-line-height\s*:\s*([^;]+);/g,
  )
  const mSize = declarations(
    mobile,
    /--graphite-text-([a-z0-9-]+)-size\s*:\s*([^;]+);/g,
  )
  const mLine = declarations(
    mobile,
    /--graphite-text-([a-z0-9-]+)-line-height\s*:\s*([^;]+);/g,
  )

  const kitSteps = new Set()

  for (const [name, v] of Object.entries(kit)) {
    const D = v.values.Desktop.value
    const M = v.values.Mobile.value

    if (name.startsWith('family/')) {
      // `family/font-1` -> `--graphite-font-1`; `family/mono` -> `--graphite-font-mono`
      const key = name.replace('family/', '').replace(/^font-/, '')
      const got = (families.get(key) || '').replace(/^'|'$/g, '')
      if (!families.has(key))
        errors.push(`typography: --graphite-font-${key} is not declared`)
      else if (got !== D)
        errors.push(
          `typography: --graphite-font-${key} is ${got}, kit says ${D}`,
        )
      continue
    }

    if (name.startsWith('weight/')) {
      const key = name.replace('weight/', '')
      const want = WEIGHTS[D]
      if (want === undefined) {
        errors.push(
          `typography: kit weight "${D}" has no CSS number in this check`,
        )
      } else if (!weights.has(key)) {
        errors.push(`typography: --graphite-text-weight-${key} is not declared`)
      } else if (Number(weights.get(key)) !== want) {
        errors.push(
          `typography: --graphite-text-weight-${key} is ${weights.get(key)}, "${D}" maps to ${want}`,
        )
      }
      continue
    }

    const m = /^(size|lineHeight)\/(.+)$/.exec(name)
    if (!m) {
      errors.push(`typography: unclassified kit variable "${name}"`)
      continue
    }
    const step = m[2].replace(/\//g, '-')
    kitSteps.add(step)
    const suffix = m[1] === 'size' ? 'size' : 'line-height'
    const dMap = m[1] === 'size' ? dSize : dLine
    const mMap = m[1] === 'size' ? mSize : mLine
    const varName = `--graphite-text-${step}-${suffix}`

    if (!dMap.has(step)) {
      errors.push(`typography: ${varName} is not declared`)
      continue
    }
    const gotD = toPx(dMap.get(step))
    if (gotD !== D) {
      errors.push(
        `typography: ${varName} is ${dMap.get(step)} (${gotD}px), kit says ${D}px`,
      )
    }

    // A mode override has to exist exactly when the kit's modes differ. A
    // missing one silently serves desktop type on a phone; a spurious one
    // pins a value that was meant to follow.
    if (D !== M) {
      if (!mMap.has(step)) {
        errors.push(
          `typography: ${varName} has no mobile override, kit says ${M}px below ${MOBILE_MAX_WIDTH + 1}px`,
        )
      } else {
        const gotM = toPx(mMap.get(step))
        if (gotM !== M) {
          errors.push(
            `typography: ${varName} mobile is ${mMap.get(step)} (${gotM}px), kit says ${M}px`,
          )
        }
      }
    } else if (mMap.has(step)) {
      errors.push(
        `typography: ${varName} has a mobile override but the kit's modes are identical (${D}px)`,
      )
    }
  }

  for (const step of [...dSize.keys(), ...dLine.keys()]) {
    if (!kitSteps.has(step))
      errors.push(
        `typography: --graphite-text-${step}-* has no counterpart in the kit`,
      )
  }
}

// Shared value comparison for the flat, single-mode foundations.
function compare(label, kit, declared, varName) {
  for (const [key, want] of [...kit].sort()) {
    if (!declared.has(key)) {
      errors.push(`${label}: ${varName(key)} is not declared`)
      continue
    }
    const raw = declared.get(key)
    const got = toPx(raw)
    if (got !== want)
      errors.push(
        `${label}: ${varName(key)} is ${raw} (${got}px), kit says ${want}px`,
      )
  }
  for (const key of declared.keys()) {
    if (!kit.has(key))
      errors.push(`${label}: ${varName(key)} has no counterpart in the kit`)
  }
}

// ------------------------------------------------------- what values cannot say
function scanFiles() {
  const out = []
  const stack = SCAN_DIRS.map((d) => path.join(ROOT, d)).filter((d) =>
    fs.existsSync(d),
  )
  while (stack.length) {
    const cur = stack.pop()
    for (const e of fs.readdirSync(cur, { withFileTypes: true })) {
      const p = path.join(cur, e.name)
      if (e.isDirectory()) stack.push(p)
      else if (/\.(scss|css)$/.test(e.name)) out.push(p)
    }
  }
  return out
}

// 1. Breakpoints written into media queries, which no token can reach.
function checkMediaQueries(kitBreakpoints) {
  const known = new Set()
  for (const px of kitBreakpoints.values()) {
    known.add(px) // min-width lands on the breakpoint
    known.add(px - 1) // max-width bounds sit one below the next one up
  }

  for (const file of scanFiles()) {
    const src = fs.readFileSync(file, 'utf8')
    const rel = path.relative(ROOT, file).split(path.sep).join('/')
    for (const m of src.matchAll(
      /@media[^{]*?\((min|max)-width:\s*(\d+)px\)/g,
    )) {
      const px = Number(m[2])
      if (!known.has(px)) {
        warnings.push(
          `${rel}: @media ${m[1]}-width ${px}px matches no kit breakpoint`,
        )
      }
    }
  }
}

// 2. Radius expressed with a spacing token — a category error the values agree on.
function checkRadiusCategory() {
  let count = 0
  const files = new Set()
  for (const file of scanFiles()) {
    const src = fs.readFileSync(file, 'utf8')
    for (const m of src.matchAll(/border-radius:\s*([^;]+);/g)) {
      if (/--graphite-space-/.test(m[1])) {
        count += 1
        files.add(path.relative(ROOT, file).split(path.sep).join('/'))
      }
    }
  }
  if (count) {
    warnings.push(
      `${count} border-radius declarations across ${files.size} files use a spacing token ` +
        `instead of --graphite-radius-* — values match the kit, so this is invisible to the diff above (#78)`,
    )
  }
}

// 3. Carbon consumed directly, bypassing the token layer.
function checkDirectCarbon() {
  const src = fs.readFileSync(stylesheetPath, 'utf8')
  // Occurrences, not lines: `padding: spacing.$spacing-03 spacing.$spacing-05`
  // is one declaration reaching past the token layer twice.
  const uses = (src.match(/spacing\.\$spacing-\d{2}/g) || []).length
  const declared = (src.match(/--graphite-space-\d{2}\s*:/g) || []).length
  if (uses > 0) {
    warnings.push(
      `${STYLESHEET}: ${uses} uses of Carbon's spacing.$spacing-NN reach past --graphite-space-* ` +
        `(${declared} tokens declared) — those inherit Carbon's scale, not the kit's`,
    )
  }
}

// --------------------------------------------------------------------- main
checkSpacing()
checkRadius()
const kitBreakpoints = checkBreakpoints()
checkTypography()
checkMediaQueries(kitBreakpoints)
checkRadiusCategory()
checkDirectCarbon()

const counted = {
  spacing: Object.keys(collection('Spacing')).length,
  radius: Object.keys(collection('Radius')).length,
  breakpoint: kitBreakpoints.size,
  typography: Object.keys(collection('Graphite Typography')).length,
}
const total = Object.values(counted).reduce((a, b) => a + b, 0)

console.log(
  `token-drift: ${total} kit variables checked against ${STYLESHEET} ` +
    `(${counted.spacing} spacing, ${counted.radius} radius, ${counted.breakpoint} breakpoint, ${counted.typography} typography)`,
)

if (warnings.length) {
  console.log('\nwarnings:')
  for (const w of warnings) console.log(`  ! ${w}`)
}

if (errors.length) {
  console.log('\nerrors:')
  for (const e of errors) console.log(`  x ${e}`)
  console.log(
    `\nFAIL — ${errors.length} value${errors.length === 1 ? '' : 's'} drifted from the kit`,
  )
  process.exit(1)
}

console.log('\nOK — no drift from the kit')
