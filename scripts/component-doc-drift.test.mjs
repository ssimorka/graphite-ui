#!/usr/bin/env node
// Negative tests for scripts/component-doc-drift.mjs.
//
// Same reasoning as token-drift.test.mjs: a check nobody has watched fail is
// not a check, it is a script that prints OK. Each case takes the real
// snapshot, introduces one specific kind of drift in a temporary copy, and
// asserts the check fails with the message that names it. The real snapshot and
// the real docs are never written to — component-doc-drift.mjs takes both paths
// as arguments for exactly this reason.
//
//   node scripts/component-doc-drift.test.mjs
//
// The three cases below are the three ways docs/components/ goes stale, and
// the first is the one that actually happens: the kit gains a set and nobody
// writes it up. Eight of those were sitting in the repo when this check landed.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const REAL = 'docs/tokens/figma-components.json'
const original = JSON.parse(fs.readFileSync(REAL, 'utf8'))
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'component-doc-drift-'))

const run = (snapshot) => {
  const file = path.join(dir, 'snapshot.json')
  fs.writeFileSync(file, JSON.stringify(snapshot, null, 2))
  try {
    execFileSync(process.execPath, ['scripts/component-doc-drift.mjs', file], {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    return { ok: true, out: '' }
  } catch (e) {
    return { ok: false, out: `${e.stdout ?? ''}${e.stderr ?? ''}` }
  }
}

const clone = () => JSON.parse(JSON.stringify(original))

let failures = 0
const check = (name, { ok, out }, expect) => {
  if (ok) {
    console.error(`  x ${name}: check passed when it should have failed`)
    failures++
  } else if (!out.includes(expect)) {
    console.error(`  x ${name}: failed, but not for the expected reason`)
    console.error(`      wanted: ${expect}`)
    console.error(`      got:    ${out.trim().split('\n').slice(-3).join(' | ')}`)
    failures++
  } else {
    console.log(`  ok ${name}`)
  }
}

console.log('component-doc-drift self-test\n')

// The real thing must pass, or every case below proves nothing.
{
  const { ok, out } = run(original)
  if (ok) console.log('  ok the committed snapshot and docs agree')
  else {
    console.error(`  x baseline: the real snapshot already fails\n${out}`)
    failures++
  }
}

// 1. The kit gains a public set and no doc mentions it.
{
  const snap = clone()
  const page = snap.pages.find((p) => p.name.endsWith('Tile'))
  page.sets.push({ name: 'Tile - Sparkle', id: '99999:1', variants: 4, private: false })
  check('a new public set with no doc coverage', run(snap), 'neither names nor cites')
}

// 2. The same set, but private. Private sets are exempt, so this must pass.
{
  const snap = clone()
  const page = snap.pages.find((p) => p.name.endsWith('Tile'))
  page.sets.push({ name: '_Tile sparkle base', id: '99999:2', variants: 4, private: true })
  const { ok, out } = run(snap)
  if (ok) console.log('  ok a new private set is exempt')
  else {
    console.error(`  x private exemption: check failed on a private set\n${out}`)
    failures++
  }
}

// 3. A set is renamed, so its node id no longer resolves and the doc citing it
//    is pointing at nothing.
{
  const snap = clone()
  const page = snap.pages.find((p) => p.name.endsWith('Tile'))
  page.sets.find((s) => s.name === 'Tile').id = '99999:3'
  check('a doc citing a node id that no longer exists', run(snap), 'neither a page nor a component set')
}

// 4. The kit gains a whole page and nothing documents it.
{
  const snap = clone()
  snap.pages.push({
    id: '99999:4',
    name: '02 Components – Sparkline',
    sets: [{ name: 'Sparkline', id: '99999:5', variants: 3, private: false }],
  })
  check('a kit page with no doc at all', run(snap), 'no doc in docs/components/ covers this page')
}

fs.rmSync(dir, { recursive: true, force: true })

if (failures > 0) {
  console.error(`\nFAIL — ${failures} case${failures === 1 ? '' : 's'}`)
  process.exit(1)
}
console.log('\nOK — the check fails when it should')
