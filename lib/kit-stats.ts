import fs from 'node:fs'
import path from 'node:path'

export type KitStats = {
  /** Components carrying a versioned contract. */
  governed: number
  /** Component sets in the kit snapshot, private internals included. */
  sets: number
  /**
   * Sets without the kit's `_` prefix, which is its own public/private line.
   * These are the ones component-doc-drift holds to a doc.
   */
  publicSets: number
  /** Kit pages the snapshot covers. */
  pages: number
  /** Component docs the drift check reads, README excluded as it does. */
  docs: number
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

  const allSets = snapshot.pages.flatMap((p) => p.sets ?? [])
  // Same two exclusions component-doc-drift makes, so the numbers the roles
  // slide quotes are the ones that check reports rather than a near miss: the
  // kit's `_` prefix marks a private internal, and README.md is not a doc.
  const publicSets = allSets.filter((s) => !s.name.startsWith('_')).length

  const docs = fs
    .readdirSync(path.join(process.cwd(), 'docs', 'components'))
    .filter((f) => f.endsWith('.md') && f !== 'README.md').length

  return {
    governed,
    sets: allSets.length,
    publicSets,
    pages: snapshot.pages.length,
    docs,
    checks: CI_CHECKS.length,
  }
}
