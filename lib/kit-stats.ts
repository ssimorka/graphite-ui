import fs from 'node:fs'
import path from 'node:path'

export type KitStats = {
  /** Components carrying a versioned contract. */
  governed: number
  /** Component sets in the kit snapshot, private internals included. */
  sets: number
  /** Kit pages the snapshot covers. */
  pages: number
  /** Governance checks wired into CI. */
  checks: number
}

// The three Figma-backed / contract-backed checks the governance job runs.
// Named rather than counted from the workflow: the job also runs typecheck and
// two self-tests, which are not drift checks.
const CI_CHECKS = ['drift-check', 'token-drift', 'component-doc-drift']

/**
 * Kit dimensions read from the repo at build time.
 *
 * The home page quotes these numbers in its copy. Deriving them is the whole
 * point: CLAUDE.md records that the page once read "33 mapped variables" while
 * the table had grown to 42, and the kit's own design has the same problem
 * (it draws Toggle at a contract version that has since moved on).
 *
 * Server-only — it reads the repo, so call it from a server component.
 */
export function readKitStats(): KitStats {
  const contractDir = path.join(process.cwd(), 'docs', 'contracts')
  const governed = fs
    .readdirSync(contractDir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md').length

  const snapshot = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'docs', 'tokens', 'figma-components.json'),
      'utf8',
    ),
  ) as { pages: { sets: { name: string }[] }[] }

  const sets = snapshot.pages.reduce((n, p) => n + (p.sets?.length ?? 0), 0)

  return { governed, sets, pages: snapshot.pages.length, checks: CI_CHECKS.length }
}
