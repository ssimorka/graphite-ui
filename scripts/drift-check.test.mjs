#!/usr/bin/env node
// Negative tests for scripts/drift-check.mjs's motion checks.
//
// Each case copies the real contracts to a temporary directory, breaks one
// thing about a `motion:` block, points the check at the copy through
// DRIFT_CHECK_CONTRACTS, and asserts it fails with the message that names the
// break. The real contracts are never written to.
//
//   node scripts/drift-check.test.mjs

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const REAL = 'docs/contracts'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-check-'))

const run = (dir) => {
  try {
    return {
      code: 0,
      out: execFileSync(
        process.execPath,
        ['--disable-warning=MODULE_TYPELESS_PACKAGE_JSON', 'scripts/drift-check.mjs'],
        { encoding: 'utf8', env: { ...process.env, DRIFT_CHECK_CONTRACTS: dir } },
      ),
    }
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') }
  }
}

// Only the top level: drift-check reads nothing below it.
const stage = (name, file, mutate) => {
  const dir = path.join(tmp, name.replace(/\W+/g, '-'))
  fs.mkdirSync(dir)
  for (const f of fs.readdirSync(REAL)) {
    const src = path.join(REAL, f)
    if (fs.statSync(src).isFile()) fs.copyFileSync(src, path.join(dir, f))
  }
  const target = path.join(dir, file)
  const before = fs.readFileSync(target, 'utf8')
  const after = mutate(before)
  if (after === before) return null
  fs.writeFileSync(target, after)
  return dir
}

const cases = [
  {
    name: 'a motion block names a token that does not exist',
    file: 'toggle.md',
    mutate: (s) => s.replace('    property: The thumb slides across\n    duration: duration-fast', '    property: The thumb slides across\n    duration: duration-glacial'),
    expect: /toggle\.md: motion entry 2 \("It is switched"\) names duration duration-glacial, which is not a declared motion token/,
  },
  {
    name: 'a motion block names an easing that does not exist',
    file: 'accordion.md',
    mutate: (s) => s.replace('easing: easing-in-out', 'easing: easing-bounce'),
    expect: /accordion\.md: motion entry 1 .* names easing easing-bounce/,
  },
  {
    name: 'a moving component loses its motion block',
    file: 'tabs.md',
    mutate: (s) => s.replace(/\nmotion:\n(?: {2,}.*\n)+/, '\n'),
    expect: /tabs\.md: components\/ui\/tabs\.tsx moves .* but the contract has no motion: block/,
  },
  {
    name: 'a motion entry drops its reduced-motion line',
    file: 'popover.md',
    mutate: (s) => s.replace(/\n {4}reduced: "?A fade; the scale rides[^\n]*/, ''),
    expect: /popover\.md: motion entry 1 \("It opens"\) has no reduced/,
  },
  {
    name: 'the code reads a token its block does not name',
    file: 'accordion.md',
    mutate: (s) => s.replace(/\n {2}- trigger: Hover on a trigger\n(?: {4}.*\n)+?(?= {2}- |\S)/, '\n'),
    expect: /components\/ui\/accordion\.tsx: reads --graphite-motion-duration-fast, which the motion: block in accordion\.md does not name/,
  },
  {
    name: 'an easing of none outside an instant step',
    file: 'menu.md',
    mutate: (s) => s.replace("    duration: duration-base\n    easing: easing-out", "    duration: duration-base\n    easing: none"),
    expect: /menu\.md: motion entry 1 .* names easing none/,
  },
]

const failures = []
let caught = 0
for (const c of cases) {
  const dir = stage(c.name, c.file, c.mutate)
  if (!dir) {
    failures.push(`${c.name}: the mutation changed nothing, so its anchor has moved`)
    continue
  }
  const r = run(dir)
  if (r.code === 0) failures.push(`${c.name}: the check PASSED when it should have failed`)
  else if (!c.expect.test(r.out)) {
    const reported = r.out.split('\n').filter((l) => l.trimStart().startsWith('x ')).join(' | ')
    failures.push(`${c.name}: failed, but not with the expected message\n      reported: ${reported}`)
  } else caught++
}

// And the real contracts pass through the same override, so a case cannot
// "fail" merely because the staging broke the check.
const control = stage('control', 'toggle.md', (s) => s + '\n')
const clean = run(control)
if (clean.code !== 0) failures.push(`control: an unmodified copy failed\n${clean.out}`)

fs.rmSync(tmp, { recursive: true, force: true })

console.log(`drift-check.test: ${caught}/${cases.length} motion drift classes detected`)
if (failures.length) {
  console.log('\nnot caught:')
  for (const f of failures) console.log(`  x ${f}`)
  process.exit(1)
}
console.log('\nOK — every motion drift class the check claims to catch, it catches')
