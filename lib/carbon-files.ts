import fs from 'node:fs'
import path from 'node:path'

/**
 * The files under app/ and components/ that still import @carbon/react,
 * relative to the repo root and sorted. Read at build time, so the Carbon
 * migration page cannot quote a count the repo has moved past.
 *
 * Server-only: it reads the repo.
 */
export function readCarbonFiles(): string[] {
  const root = process.cwd()
  const hits: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(p)
      else if (/\.tsx?$/.test(entry.name) && /from '@carbon\/react'/.test(fs.readFileSync(p, 'utf8')))
        hits.push(path.relative(root, p).split(path.sep).join('/'))
    }
  }
  for (const d of ['app', 'components']) walk(path.join(root, d))
  return hits.sort()
}
