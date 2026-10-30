// Code tab check: every component page's Code tab is a file that compiles.
//
// A Code tab used to print a fragment: JSX that named state, setters and
// handlers it never declared, with no imports. Pasted, it failed. Each page
// now builds a complete file (components/component-doc/example-file.ts) from
// its controls, in components/component-doc/docs/<slug>-code.ts, which exports
//
//   controls     every value each control can take, as arrays
//   exampleFor   (values) => Example
//
// This runs every combination of every page's controls through its builder,
// writes the files, and type-checks them against components/ui with the
// repo's own tsconfig. It also fails if a page with a live preview has no
// code module, or a code module has no page.
//
//   node --import ./scripts/lib/register-alias.mjs scripts/code-tab-check.mjs

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const DOCS = path.join(ROOT, 'components', 'component-doc', 'docs')
const { exampleFile, combinations } = await import(
  pathToFileURL(path.join(ROOT, 'components', 'component-doc', 'example-file.ts')).href
)

const errors = []
const previews = fs.readdirSync(DOCS).filter((f) => f.endsWith('-preview.tsx')).map((f) => f.slice(0, -'-preview.tsx'.length))
const modules = fs.readdirSync(DOCS).filter((f) => f.endsWith('-code.ts')).map((f) => f.slice(0, -'-code.ts'.length))
for (const p of previews) if (!modules.includes(p)) errors.push(`${p}: has a live preview but no ${p}-code.ts`)
for (const m of modules) if (!previews.includes(m)) errors.push(`${m}-code.ts: no ${m}-preview.tsx uses it`)

// Fresh directory inside the repo, so `@/` resolves through tsconfig paths.
const OUT = fs.mkdtempSync(path.join(ROOT, '.code-tab-check-'))
const index = {}
let total = 0

try {
  for (const slug of modules.sort()) {
    const mod = await import(pathToFileURL(path.join(DOCS, `${slug}-code.ts`)).href)
    if (!mod.controls || typeof mod.exampleFor !== 'function') {
      errors.push(`${slug}-code.ts: must export controls and exampleFor`)
      continue
    }
    const seen = new Map()
    for (const combo of combinations(mod.controls)) {
      let text
      try {
        text = exampleFile(mod.exampleFor(combo))
      } catch (e) {
        errors.push(`${slug} ${JSON.stringify(combo)}: builder threw: ${e.message}`)
        continue
      }
      if (seen.has(text)) continue
      const file = `${slug}-${seen.size + 1}.tsx`
      seen.set(text, file)
      index[file] = { slug, combo }
      fs.writeFileSync(path.join(OUT, file), text)
    }
    total += seen.size
  }

  const rel = (p) => path.relative(OUT, path.join(ROOT, p))
  fs.writeFileSync(
    path.join(OUT, 'tsconfig.json'),
    JSON.stringify(
      {
        extends: rel('tsconfig.json'),
        compilerOptions: { incremental: false, noEmit: true, noUnusedLocals: true },
        include: [rel('next-env.d.ts'), './*.tsx'],
        // The root config excludes these folders from `pnpm typecheck`; an
        // inherited exclude would drop every file here and pass on nothing.
        exclude: [],
      },
      null,
      2,
    ),
  )

  if (total) {
    try {
      execFileSync(path.join(ROOT, 'node_modules', '.bin', 'tsc'), ['-p', path.join(OUT, 'tsconfig.json')], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: 'pipe',
      })
    } catch (e) {
      const out = `${e.stdout ?? ''}${e.stderr ?? ''}`
      const byFile = new Map()
      for (const line of out.split('\n')) {
        const m = line.match(/([\w-]+\.tsx)\((\d+),\d+\): error (TS\d+: .*)/)
        if (!m) continue
        if (!byFile.has(m[1])) byFile.set(m[1], [])
        byFile.get(m[1]).push(`  line ${m[2]}: ${m[3]}`)
      }
      if (!byFile.size) errors.push(`tsc failed:\n${out}`)
      for (const [file, lines] of byFile) {
        const { slug, combo } = index[file] ?? {}
        const text = fs.readFileSync(path.join(OUT, file), 'utf8')
        errors.push(
          `${slug} with ${JSON.stringify(combo)} does not compile:\n${lines.join('\n')}\n\n${text
            .split('\n')
            .map((l, i) => `  ${String(i + 1).padStart(3)} | ${l}`)
            .join('\n')}`,
        )
      }
    }
  }
} finally {
  if (!process.env.CODE_TAB_KEEP) fs.rmSync(OUT, { recursive: true, force: true })
  else console.log(`Kept ${path.relative(ROOT, OUT)}`)
}

if (errors.length) {
  console.error(`Code tab check: ${errors.length} problem(s)\n`)
  for (const e of errors) console.error(`${e}\n`)
  process.exit(1)
}
console.log(`Code tab check: ${modules.length} pages, ${total} distinct examples, all compile.`)
