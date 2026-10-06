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

const selfTestFailures = [
  ...MUST_MATCH.filter((s) => offences(s).length === 0).map((s) => `missed: ${s}`),
  ...MUST_PASS.filter((s) => offences(s).length > 0).map((s) => `false positive: ${s}`),
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
let scanned = 0
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
  const lines = buf.toString('utf8').split('\n')
  lines.forEach((line, i) => {
    for (const label of offences(line)) hits.push(`${rel}:${i + 1}: ${label}`)
  })
}

if (hits.length) {
  console.error(`naming-check: ${hits.length} banned name(s) in ${scanned} files`)
  for (const h of hits) console.error(`  x ${h}`)
  console.error('\nGraphite variables are --graphite-* only. See CLAUDE.md, "One variable name, enforced".')
  process.exit(1)
}

console.log(`naming-check: ${scanned} files clean, matcher self-test passed`)
