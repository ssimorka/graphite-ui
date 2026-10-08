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
// Most cases drift the stylesheet. The Carbon breakpoint check is the
// exception: it reads Carbon's own grid config rather than the stylesheet, so
// its cases stage a bad config path through TOKEN_DRIFT_CARBON_GRID instead.
// It earns coverage because it is fatal — the whole point of promoting it from
// a warning was that removing @carbon/react must not silence it quietly.
//
// The remaining warning-only checks (radius-via-spacing, direct Carbon
// spacing and type styles) are still not covered. They read the component tree
// rather than the stylesheet argument, and they are deliberately non-fatal, so
// there is no exit code to assert on.

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

const run = (file, env) => {
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
        { encoding: 'utf8', env: { ...process.env, ...env } },
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
        "--graphite-font-mono: 'IBM Plex Mono',",
        "--graphite-font-mono: 'Courier New',",
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
    name: 'a foundation contract count goes stale',
    mutate: (s) =>
      s.replace(
        '--graphite-radius-20: 20px;',
        '--graphite-radius-20: 20px;\n  --graphite-radius-24: 24px;',
      ),
    expect: /foundations\/radius\.md says variable_count: 8, but .* declares 9/,
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

  // The three ways the Carbon breakpoint check can fail to read its config.
  // All three are fatal rather than advisory so that dropping @carbon/react
  // cannot leave the breakpoint.breakpoint() media queries unverified behind a
  // green CI run. `stage` returns the environment; unlike `mutate` it leaves
  // the stylesheet alone, because the config is what these drift.
  {
    name: "Carbon's grid config is missing",
    stage: () => ({ TOKEN_DRIFT_CARBON_GRID: 'nope/does-not-exist.scss' }),
    expect:
      /cannot verify Carbon's breakpoint map — nope\/does-not-exist\.scss not found[\s\S]*breakpoint\.breakpoint\(\) media queries are unverified/,
  },
  {
    name: "Carbon's grid config declares no breakpoint map",
    stage: (dir) => {
      const f = path.join(dir, 'no-decl.scss')
      fs.writeFileSync(f, '$spacing: (\n  spacing-01: 0.125rem,\n) !default;\n')
      return { TOKEN_DRIFT_CARBON_GRID: f }
    },
    expect:
      /could not find the \$grid-breakpoints declaration[\s\S]*media queries are unverified/,
  },
  {
    name: "Carbon's breakpoint map does not parse",
    stage: (dir) => {
      const f = path.join(dir, 'empty-decl.scss')
      fs.writeFileSync(f, '$grid-breakpoints: (\n) !default;\n')
      return { TOKEN_DRIFT_CARBON_GRID: f }
    },
    expect:
      /could not parse Carbon's breakpoint map out of[\s\S]*media queries are unverified/,
  },

  // Dev Mode's code syntax. Staged through TOKEN_DRIFT_CODE_SYNTAX, since the
  // snapshot file is what drifts. The first case is the exact state the kit
  // was in before 2026-10-06.
  {
    name: 'Dev Mode shows a retired prefix',
    stage: (dir) => {
      const f = path.join(dir, 'code-syntax-stale.json')
      fs.writeFileSync(f, JSON.stringify({ collections: { 'Graphite Semantic': { danger: 'var(' + '--c' + 'ts-error)' } } }))
      return { TOKEN_DRIFT_CODE_SYNTAX: f }
    },
    expect: /code syntax: Graphite Semantic\/danger shows Dev Mode "var\(--c.s-error\)", not var\(--graphite-\*\)/,
  },
  {
    name: 'Dev Mode names a variable the code does not declare',
    stage: (dir) => {
      const f = path.join(dir, 'code-syntax-unknown.json')
      fs.writeFileSync(f, JSON.stringify({ collections: { 'Graphite Semantic': { 'state/warning-hover': 'var(--graphite-warning-hover)' } } }))
      return { TOKEN_DRIFT_CODE_SYNTAX: f }
    },
    expect: /code syntax: Graphite Semantic\/state\/warning-hover shows Dev Mode --graphite-warning-hover, which the code does not declare/,
  },
  {
    name: 'the code syntax snapshot is missing',
    stage: () => ({ TOKEN_DRIFT_CODE_SYNTAX: 'nope/figma-code-syntax.json' }),
    expect: /code syntax: nope\/figma-code-syntax\.json not found/,
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

// The media query check reads the component tree rather than the stylesheet
// argument. So these stage one SCSS file in a temporary directory, point the
// scan at it through TOKEN_DRIFT_SCAN_DIRS, and assert on the message, plus
// the exit code where a query should fail. A case that should pass carries a
// sentinel at 123px, so it cannot pass just because its file was never scanned.
const SENTINEL = '@media (min-width: 123px) { .s { color: red; } }'
const mediaCases = [
  {
    name: 'an off-breakpoint decimal px is flagged',
    query: '@media (max-width: 599.98px) { .a { color: red; } }',
    flagged: /@media max-width 599\.98px matches no kit breakpoint/,
  },
  {
    name: 'an off-breakpoint rem is flagged',
    query: '@media (min-width: 30rem) { .a { color: red; } }',
    flagged: /@media min-width 30rem \(480px\) matches no kit breakpoint/,
  },
  {
    name: '671.98px, 0.02px below md, passes',
    query: '@media (max-width: 671.98px) { .a { color: red; } }',
    clean: /671\.98px matches no kit breakpoint/,
  },
  {
    name: '66rem, the kit lg at 1056px, passes',
    query: '@media (min-width: 66rem) { .a { color: red; } }',
    clean: /66rem \(1056px\) matches no kit breakpoint/,
  },
]

let caught = 0
const failures = []

for (const c of cases) {
  let r
  if (c.stage) {
    r = run(REAL, c.stage(path.dirname(tmp)))
  } else {
    const mutated = c.mutate(original)
    if (mutated === original) {
      failures.push(
        `${c.name}: the mutation changed nothing — its anchor has moved`,
      )
      continue
    }
    fs.writeFileSync(tmp, mutated)
    r = run(tmp)
  }

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

mediaCases.forEach((c, n) => {
  const dir = path.join(path.dirname(tmp), `media-${n}`)
  fs.mkdirSync(dir)
  // A flagged query fails the run on its own, so only the cases that should
  // pass carry the sentinel; for them it proves the file was read.
  const body = c.flagged ? `${c.query}\n` : `${c.query}\n${SENTINEL}\n`
  fs.writeFileSync(path.join(dir, 'case.scss'), body)
  const r = run(REAL, { TOKEN_DRIFT_SCAN_DIRS: dir })
  if (c.flagged && !c.flagged.test(r.out))
    failures.push(`${c.name}: the query was not flagged`)
  else if (c.flagged && r.code === 0)
    failures.push(`${c.name}: the check PASSED when it should have failed`)
  else if (c.clean && !/@media min-width 123px matches no kit breakpoint/.test(r.out))
    failures.push(`${c.name}: the staged file was not scanned`)
  else if (c.clean && c.clean.test(r.out))
    failures.push(`${c.name}: the query was flagged when it sits on the scale`)
  else caught++
})

fs.rmSync(path.dirname(tmp), { recursive: true, force: true })

const total = cases.length + mediaCases.length
console.log(`token-drift.test: ${caught}/${total} drift classes detected`)
if (failures.length) {
  console.log('\nnot caught:')
  for (const f of failures) console.log(`  x ${f}`)
  console.log(
    `\nFAIL — the check would miss ${failures.length} kind${failures.length === 1 ? '' : 's'} of drift`,
  )
  process.exit(1)
}
console.log('\nOK — every drift class the check claims to catch, it catches')
