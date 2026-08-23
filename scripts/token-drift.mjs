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

  // Not every media query is a breakpoint. A rule can be keyed to the width at
  // which its own content stops fitting — a content threshold — which by
  // definition will not land on the kit's scale, and forcing it onto the
  // nearest stop breaks the layout rather than aligning it. Such a rule opts
  // out with `token-drift-allow:` in the comment directly above it, which has
  // to carry the reason, so the exemption is argued in the source rather than
  // hidden in this script.
  const ALLOW = 'token-drift-allow:'

  for (const file of scanFiles()) {
    const src = fs.readFileSync(file, 'utf8')
    const rel = path.relative(ROOT, file).split(path.sep).join('/')
    const lines = src.split('\n')

    const allowed = (index) => {
      // Walk back over the contiguous comment block immediately above.
      for (let i = index - 1; i >= 0; i -= 1) {
        const line = lines[i].trim()
        if (line === '' || line.startsWith('//')) {
          if (line.includes(ALLOW)) return true
          continue
        }
        return false
      }
      return false
    }

    lines.forEach((line, i) => {
      const m = /@media[^{]*?\((min|max)-width:\s*(\d+)px\)/.exec(line)
      if (!m) return
      const px = Number(m[2])
      if (known.has(px) || allowed(i)) return
      warnings.push(
        `${rel}:${i + 1}: @media ${m[1]}-width ${px}px matches no kit breakpoint ` +
          `— align it to the scale, or mark it \`${ALLOW} <reason>\` if it is a content threshold`,
      )
    })
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

// 2b. Carbon's breakpoint mixin. `@include breakpoint.breakpoint(lg)` is the
// correct tool — a custom property does not resolve in an @media condition, so
// --graphite-breakpoint-* cannot replace it — but it compiles to a media query
// at build time, which means the scan above never sees the number it produces.
// Check the map it reads from instead.
function checkCarbonBreakpoints(kitBreakpoints) {
  const config =
    'node_modules/.pnpm/@carbon+grid@11.56.0/node_modules/@carbon/grid/scss/_config.scss'
  const abs = path.join(ROOT, config)
  if (!fs.existsSync(abs)) {
    warnings.push(
      `cannot verify Carbon's breakpoint map — ${config} not found (version bump?). ` +
        `The ${countMixinUses()} breakpoint.breakpoint() media queries are unverified.`,
    )
    return
  }

  // Read only the `$grid-breakpoints: ( … ) !default;` declaration. Further
  // down, a `map.merge` block re-lists lg/xlg/max to override their column
  // counts; scanning the whole file picks those up and silently mis-assigns
  // the widths.
  const whole = fs.readFileSync(abs, 'utf8')
  const decl = /\$grid-breakpoints:\s*\(([\s\S]*?)\n\)\s*!default;/.exec(whole)
  if (!decl) {
    warnings.push(
      `could not find the $grid-breakpoints declaration in ${config}`,
    )
    return
  }

  // Each entry is a nested map with `columns` and `margin` before `width`, and
  // `margin` itself contains a to-rem() call — so match the block first, then
  // pull the width out of it, rather than trying to skip over parentheses.
  // The lookbehind matters: without it `lg` also matches inside `xlg`, and the
  // later match silently overwrites the real lg with xlg's width.
  const carbon = new Map()
  for (const block of decl[1].matchAll(
    /(?<![a-z])(sm|md|lg|xlg|max):\s*\(([\s\S]*?)\n\s*\),/g,
  )) {
    const w = /width:\s*convert\.to-rem\((\d+)px\)/.exec(block[2])
    if (w) carbon.set(block[1], Number(w[1]))
  }

  // Carbon calls the 1312px stop `xlg`; the kit and our tokens call it `xl`.
  const CARBON_NAME = { sm: 'sm', md: 'md', lg: 'lg', xl: 'xlg', max: 'max' }
  if (carbon.size === 0) {
    warnings.push(`could not parse Carbon's breakpoint map out of ${config}`)
    return
  }

  for (const [name, kitPx] of kitBreakpoints) {
    const key = CARBON_NAME[name]
    if (!carbon.has(key)) {
      warnings.push(
        `Carbon has no "${key}" breakpoint; the kit's ${name} is ${kitPx}px`,
      )
    } else if (carbon.get(key) !== kitPx) {
      errors.push(
        `breakpoint: Carbon's ${key} is ${carbon.get(key)}px but the kit's ${name} is ${kitPx}px — ` +
          `every breakpoint.breakpoint(${key}) media query follows Carbon, not the kit`,
      )
    }
  }
}

const countMixinUses = () => {
  let n = 0
  for (const file of scanFiles()) {
    n += (
      fs
        .readFileSync(file, 'utf8')
        .match(/@include\s+breakpoint\.breakpoint\(/g) || []
    ).length
  }
  return n
}

// 2c. Carbon type styles still applied directly. These are deliberate — the
// kit cannot express a fluid ramp, and four style names sit at sizes the kit
// has no step for (#85) — but "deliberate" decays into "forgotten" without
// something saying the number out loud on every run.
function checkCarbonTypeStyles() {
  const uses = new Map()
  for (const file of scanFiles()) {
    const src = fs.readFileSync(file, 'utf8')
    for (const m of src.matchAll(
      /type\.type-style\('([a-z0-9-]+)'(,\s*true)?\)/g,
    )) {
      const key = m[1] + (m[2] ? ' (fluid)' : '')
      uses.set(key, (uses.get(key) || 0) + 1)
    }
  }
  if (!uses.size) return

  const total = [...uses.values()].reduce((a, b) => a + b, 0)
  const fluid = [...uses]
    .filter(([k]) => k.includes('fluid'))
    .reduce((a, [, n]) => a + n, 0)
  warnings.push(
    `${total} Carbon type styles still applied directly (${fluid} fluid, ${total - fluid} at sizes the kit has no step for) ` +
      `— see docs/contracts/foundations/typography.md; the rest moved to --graphite-text-* in #85`,
  )
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

// ------------------------------------------------------- contracts stay true
// Each foundation contract states how many variables its foundation declares.
// That number is exactly the kind of fact that rots: the counts in the parent
// contracts README had drifted by twelve before anyone noticed. Checking it
// here means a token added without a contract update fails the build rather
// than quietly making the documentation wrong.
const FOUNDATION_VARS = {
  spacing: [
    /--graphite-space-\d{2}(?=\s*:)/g,
    /--graphite-density-[a-z-]+(?=\s*:)/g,
  ],
  radius: [/--graphite-radius-[a-z0-9-]+(?=\s*:)/g],
  breakpoint: [/--graphite-breakpoint-[a-z]+(?=\s*:)/g],
  typography: [
    /--graphite-font-[a-z0-9-]+(?=\s*:)/g,
    /--graphite-text-[a-z0-9-]+(?=\s*:)/g,
  ],
}

function checkFoundationContracts() {
  const dir = path.join(ROOT, 'docs/contracts/foundations')
  if (!fs.existsSync(dir)) return

  for (const [name, patterns] of Object.entries(FOUNDATION_VARS)) {
    const file = path.join(dir, `${name}.md`)
    if (!fs.existsSync(file)) {
      warnings.push(
        `docs/contracts/foundations/${name}.md is missing — the foundation is undocumented`,
      )
      continue
    }
    const declared = new Set()
    for (const re of patterns)
      for (const v of css.match(re) || []) declared.add(v)

    const m = /^variable_count:\s*(\d+)/m.exec(fs.readFileSync(file, 'utf8'))
    if (!m) {
      warnings.push(
        `docs/contracts/foundations/${name}.md declares no variable_count`,
      )
      continue
    }
    const stated = Number(m[1])
    if (stated !== declared.size) {
      errors.push(
        `docs/contracts/foundations/${name}.md says variable_count: ${stated}, ` +
          `but ${STYLESHEET} declares ${declared.size}`,
      )
    }
  }
}

// --------------------------------------------------------------------- main
checkSpacing()
checkRadius()
const kitBreakpoints = checkBreakpoints()
checkTypography()
checkFoundationContracts()
checkMediaQueries(kitBreakpoints)
checkCarbonBreakpoints(kitBreakpoints)
checkCarbonTypeStyles()
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
