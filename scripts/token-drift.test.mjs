#!/usr/bin/env node
// Negative tests for scripts/token-drift.mjs.
//
// A check nobody has watched fail is not a check — it is a script that prints
// OK. Each case takes the real stylesheet, introduces one specific kind of
// drift in a temporary copy, and asserts the check fails with the message that
// names it. The real file is never written to: token-drift.mjs takes the
// stylesheet path as an argument for exactly this reason.
//
//   node scripts/token-drift.test.mjs
//
// The warning-only checks (media queries, radius-via-spacing, direct Carbon)
// are not covered here. They read the component tree rather than the
// stylesheet argument, and they are deliberately non-fatal, so there is no
// exit code to assert on.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const REAL = 'app/globals.scss'
const original = fs.readFileSync(REAL, 'utf8')
const tmp = path.join(
  fs.mkdtempSync(path.join(os.tmpdir(), 'token-drift-')),
  'globals.scss',
)

const run = (file) => {
  try {
    return {
      code: 0,
      out: execFileSync(
        process.execPath,
        [
          '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON',
          'scripts/token-drift.mjs',
          file,
        ],
        { encoding: 'utf8' },
      ),
    }
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') }
  }
}

const cases = [
  {
    name: 'spacing value drifts',
    mutate: (s) =>
      s.replace('--graphite-space-05: 1rem;', '--graphite-space-05: 1.5rem;'),
    expect: /spacing: --graphite-space-05 is 1\.5rem \(24px\), kit says 16px/,
  },
  {
    name: 'radius value drifts',
    mutate: (s) =>
      s.replace('--graphite-radius-8: 8px;', '--graphite-radius-8: 9px;'),
    expect: /radius: --graphite-radius-8 is 9px \(9px\), kit says 8px/,
  },
  {
    name: 'breakpoint value drifts',
    mutate: (s) =>
      s.replace(
        '--graphite-breakpoint-lg: 1056px;',
        '--graphite-breakpoint-lg: 1024px;',
      ),
    expect:
      /breakpoint: --graphite-breakpoint-lg is 1024px \(1024px\), kit says 1056px/,
  },
  {
    name: 'typography desktop value drifts',
    mutate: (s) =>
      s.replace(
        '--graphite-text-body-2-size: 1rem;',
        '--graphite-text-body-2-size: 1.125rem;',
      ),
    expect:
      /typography: --graphite-text-body-2-size is 1\.125rem \(18px\), kit says 16px/,
  },
  {
    name: 'weight mapping drifts',
    mutate: (s) =>
      s.replace(
        '--graphite-text-weight-semibold: 600;',
        '--graphite-text-weight-semibold: 500;',
      ),
    expect: /--graphite-text-weight-semibold is 500, "SemiBold" maps to 600/,
  },
  {
    name: 'family drifts',
    mutate: (s) =>
      s.replace(
        "--graphite-font-mono: 'IBM Plex Mono';",
        "--graphite-font-mono: 'Courier New';",
      ),
    expect: /--graphite-font-mono is Courier New, kit says IBM Plex Mono/,
  },
  {
    name: 'a token is deleted',
    mutate: (s) => s.replace('--graphite-radius-full: 999px;', ''),
    expect: /radius: --graphite-radius-full is not declared/,
  },
  {
    name: 'a token with no kit counterpart is added',
    mutate: (s) =>
      s.replace(
        '--graphite-radius-full: 999px;',
        '--graphite-radius-full: 999px;\n  --graphite-radius-13: 13px;',
      ),
    expect: /radius: --graphite-radius-13 has no counterpart in the kit/,
  },
  {
    name: 'a mobile override goes missing',
    mutate: (s) =>
      s.replace(/\n\s*--graphite-text-body-2-size: 0\.875rem;[^\n]*/, ''),
    expect: /--graphite-text-body-2-size has no mobile override, kit says 14px/,
  },
  {
    name: 'a spurious mobile override pins a value',
    mutate: (s) =>
      s.replace(
        '    --graphite-text-body-2-size: 0.875rem;',
        '    --graphite-text-body-2-size: 0.875rem;\n    --graphite-text-caption-1-size: 0.5rem;',
      ),
    expect:
      /--graphite-text-caption-1-size has a mobile override but the kit's modes are identical \(12px\)/,
  },
]

// If the unmutated stylesheet does not pass, every negative below is
// meaningless — a check that always fails would "catch" all of them.
const baseline = run(REAL)
if (baseline.code !== 0) {
  console.error(
    'BASELINE FAILS — the negative tests below would prove nothing:\n' +
      baseline.out,
  )
  process.exit(1)
}

let caught = 0
const failures = []

for (const c of cases) {
  const mutated = c.mutate(original)
  if (mutated === original) {
    failures.push(
      `${c.name}: the mutation changed nothing — its anchor has moved`,
    )
    continue
  }
  fs.writeFileSync(tmp, mutated)
  const r = run(tmp)

  if (r.code === 0)
    failures.push(`${c.name}: the check PASSED when it should have failed`)
  else if (!c.expect.test(r.out)) {
    const reported = r.out
      .split('\n')
      .filter((l) => l.trimStart().startsWith('x '))
      .join(' | ')
    failures.push(
      `${c.name}: failed, but not with the expected message\n      reported: ${reported}`,
    )
  } else caught++
}

fs.rmSync(path.dirname(tmp), { recursive: true, force: true })

console.log(
  `token-drift.test: ${caught}/${cases.length} drift classes detected`,
)
if (failures.length) {
  console.log('\nnot caught:')
  for (const f of failures) console.log(`  x ${f}`)
  console.log(
    `\nFAIL — the check would miss ${failures.length} kind${failures.length === 1 ? '' : 's'} of drift`,
  )
  process.exit(1)
}
console.log('\nOK — every drift class the check claims to catch, it catches')
