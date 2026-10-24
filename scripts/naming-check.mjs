// Naming check: Graphite has one variable prefix, and it is --graphite-.
//
// The color engine came from another project, and its exporter kept that
// project's prefix and name long after everything else here was rebranded.
// The cost was concrete: Create handed out a theme under one prefix while the
// components read another, and the docs told adopters to rename the variables
// by hand. That is gone. This check keeps it gone, anywhere in the repo:
// code, docs, comments, tests, snapshots.
//
// It scans every tracked file rather than a list of folders, because the old
// name turned up in places no folder list would have covered (a comment in the
// generative art, a line in a component doc, the project notes).
//
// The patterns are assembled from pieces so this file does not match itself.
// Before scanning, the matcher is run against known positives and negatives:
// a check whose pattern silently stopped matching would pass forever.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const OLD_PREFIX = ['--', 'c', 't', 's', '-'].join('')
const OLD_NAME = ['token', 'studio'].join('[\\s_-]*')

const BANNED = [
  { label: `the ${OLD_PREFIX}* prefix`, re: new RegExp(OLD_PREFIX, 'i') },
  { label: "the engine's former project name", re: new RegExp(OLD_NAME, 'i') },
]

function offences(text) {
  return BANNED.filter((b) => b.re.test(text)).map((b) => b.label)
}

// ---------------------------------------------------------------- self-test

const MUST_MATCH = [
  `  ${OLD_PREFIX}primary: #000;`,
  `var(${OLD_PREFIX}focus-ring)`,
  ['Carbon', 'Token', 'Studio'].join(' '),
  ['carbon', 'token', 'studio'].join('-'),
  ['Token', 'Studio'].join(''),
]
const MUST_PASS = [
  '  --graphite-primary: #000;',
  'docs/contracts/button.md',
  'const facts = []',
  'the token panels in a studio apartment', // both words, not the name
]

// ------------------------------------------------------------ raw timing
//
// Motion has one source too: the kit's Motion collection, as
// --graphite-motion-*. A raw duration or easing in a stylesheet is a number
// the kit cannot see, and before the collection existed there were ninety of
// them, half of them past the 400ms cap or overshooting. So component and page
// styles may not write `120ms`, `0.3s`, `cubic-bezier(` or a keyword easing;
// they read a token. The token declarations themselves are the exception, and
// a line can opt out with `motion-allow: <reason>` in the comment directly
// above it, so the exemption is argued where it lives.
//
// Patterns are assembled from pieces for the same reason as above.
const TIMING_SCOPE = /^(app|components)\/.*\.(scss|css)$/
const TIMING = [
  { label: 'a raw duration', re: new RegExp('(?<![\\w.#-])\\d*\\.?\\d+m?s\\b') },
  { label: 'a raw cubic-bezier', re: new RegExp(['cubic', 'bezier\\('].join('-')) },
  { label: 'a raw steps() easing', re: new RegExp('(?<![\\w-])steps\\(') },
  { label: 'a keyword easing', re: new RegExp('(?<![\\w-])ease(-in-out|-in|-out)?(?![\\w-])') },
  { label: 'a keyword easing', re: new RegExp('(?<![\\w-])linear(?![\\w(-])') },
]
const MOTION_ALLOW = ['motion', 'allow:'].join('-')
const TOKEN_DECL = /^\s*--graphite-motion-[a-z-]+\s*:/

// Strips comments, so a duration explained in prose is not a duration used.
// Block comments are tracked across lines.
function stripComments(lines) {
  let inBlock = false
  return lines.map((line) => {
    let out = ''
    for (let i = 0; i < line.length; i++) {
      if (inBlock) {
        if (line.startsWith('*/', i)) { inBlock = false; i++ }
        continue
      }
      if (line.startsWith('/*', i)) { inBlock = true; i++; continue }
      if (line.startsWith('//', i) && line[i - 1] !== ':') break // keep url(https://…)
      out += line[i]
    }
    return out
  })
}

function timingOffences(text) {
  if (TOKEN_DECL.test(text)) return []
  return [...new Set(TIMING.filter((t) => t.re.test(text)).map((t) => t.label))]
}

/** Every raw timing in one stylesheet's source, as [line number, label]. */
function timingHits(src) {
  const raw = src.split('\n')
  const code = stripComments(raw)
  const allowed = (index) => {
    for (let i = index - 1; i >= 0; i -= 1) {
      const line = raw[i].trim()
      if (line === '' || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
        if (line.includes(MOTION_ALLOW)) return true
        continue
      }
      return false
    }
    return false
  }
  const out = []
  code.forEach((line, i) => {
    for (const label of timingOffences(line)) if (!allowed(i)) out.push([i + 1, label])
  })
  return out
}

const TIMING_MUST_MATCH = [
  '  transition: opacity 160ms ease;',
  '  animation: spin 0.7s linear infinite;',
  '  animation-delay: 140ms;',
  `  transition: transform 1s ${['cubic', 'bezier(0.2, 0, 0, 1)'].join('-')};`,
  '  transition-timing-function: ease-in-out;',
  '  animation-timing-function: steps(4);',
  '@include drop.cascade($count: 4, $start: 420ms, $step: 90ms);',
]
const TIMING_MUST_PASS = [
  '  transition: opacity var(--graphite-motion-duration-fast) var(--graphite-motion-easing-out);',
  '  --graphite-motion-duration-fast: 120ms;',
  `  --graphite-motion-easing-out: ${['cubic', 'bezier(0.2, 0, 0, 1)'].join('-')};`,
  '  background: linear-gradient(to top, red, blue);',
  '  font-family: IBM Plex Sans;',
  '  animation-iteration-count: 2;',
  '  grid-template-columns: 1fr 2fr;',
  '  width: 0.5rem;',
  '  .icon-s { color: red; }',
]
// A comment explaining a number is not a use of it; a marker exempts the line
// below it and nothing further.
const TIMING_STAGED = [
  { src: '// Was 700ms.\n.a { transition: opacity var(--x); }\n', hits: 0 },
  { src: '/* 300ms\n   ease */\n.a { color: red; }\n', hits: 0 },
  { src: `// ${MOTION_ALLOW} a loop, not a transition\n.a { animation: spin 3s; }\n.b { animation: spin 3s; }\n`, hits: 1 },
]

const selfTestFailures = [
  ...MUST_MATCH.filter((s) => offences(s).length === 0).map((s) => `missed: ${s}`),
  ...MUST_PASS.filter((s) => offences(s).length > 0).map((s) => `false positive: ${s}`),
  ...TIMING_MUST_MATCH.filter((s) => timingOffences(s).length === 0).map((s) => `timing missed: ${s}`),
  ...TIMING_MUST_PASS.filter((s) => timingOffences(s).length > 0).map((s) => `timing false positive: ${s}`),
  ...TIMING_STAGED.filter((c) => timingHits(c.src).length !== c.hits).map(
    (c) => `timing scan expected ${c.hits} hit(s): ${JSON.stringify(c.src)}`,
  ),
]
if (selfTestFailures.length) {
  console.error('naming-check: the matcher failed its own self-test')
  for (const f of selfTestFailures) console.error(`  x ${f}`)
  process.exit(1)
}

// --------------------------------------------------------------------- scan

const files = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)

const hits = []
const timing = []
let scanned = 0
let timingScanned = 0
for (const rel of files) {
  const abs = path.join(ROOT, rel)
  let buf
  try {
    buf = fs.readFileSync(abs)
  } catch {
    continue // deleted in the working tree but still in the index
  }
  if (buf.includes(0)) continue // binary
  scanned++
  // The file's own path counts too: a file named after the old project is a
  // mention of it.
  for (const label of offences(rel)) hits.push(`${rel}: path uses ${label}`)
  const text = buf.toString('utf8')
  const lines = text.split('\n')
  lines.forEach((line, i) => {
    for (const label of offences(line)) hits.push(`${rel}:${i + 1}: ${label}`)
  })
  if (TIMING_SCOPE.test(rel)) {
    timingScanned++
    for (const [n, label] of timingHits(text)) timing.push(`${rel}:${n}: ${label}`)
  }
}

if (hits.length) {
  console.error(`naming-check: ${hits.length} banned name(s) in ${scanned} files`)
  for (const h of hits) console.error(`  x ${h}`)
  console.error('\nGraphite variables are --graphite-* only. See CLAUDE.md, "One variable name, enforced".')
}

if (timing.length) {
  console.error(`naming-check: ${timing.length} raw timing value(s) in ${timingScanned} stylesheets`)
  for (const h of timing) console.error(`  x ${h}`)
  console.error(
    `\nRead a --graphite-motion-* token instead, or argue the exception with \`${MOTION_ALLOW} <reason>\`` +
      ' in the comment above. See docs/contracts/foundations/motion.md.',
  )
}

if (hits.length || timing.length) process.exit(1)

console.log(
  `naming-check: ${scanned} files clean, ${timingScanned} stylesheets free of raw timing, matcher self-test passed`,
)
