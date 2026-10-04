import fs from 'node:fs'
import path from 'node:path'

/**
 * The ungoverned list and the public-ungoverned count on the Components index,
 * read from the committed kit snapshot. The other counts on that page (governed,
 * pages, sets) come from `readKitStats`. Governance rule 6's
 * whole point is that nothing in the kit is unlabelled, so the page that
 * labels them cannot be the one place a count is written by hand.
 *
 * Server-only: reads the repo, like `lib/contracts.ts`.
 */

type SnapshotSet = { name: string; id: string; variants: number; private: boolean }
type SnapshotPage = { id: string; name: string; sets: SnapshotSet[] }

export type UngovernedPage = { name: string; publicSets: number }

export type IndexStats = {
  /** Public sets on the kit pages no contract claims, summed from the snapshot. */
  publicUngoverned: number | null
  ungoverned: UngovernedPage[]
}

// The kit's page names do not always match a contract's `component:` field.
// Radio button is the one that is a plain difference of number: the page is the
// atom, the contract governs the group built from it.
const PAGE_ALIASES: Record<string, string> = {
  'Radio button': 'Radio button group',
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')

export function readComponentsIndex(governed: string[]): IndexStats {
  const root = process.cwd()
  const snap = JSON.parse(
    fs.readFileSync(path.join(root, 'docs/tokens/figma-components.json'), 'utf8'),
  ) as { pages: SnapshotPage[] }

  const claimed = new Set(governed.map(norm))
  const ungoverned: UngovernedPage[] = []

  for (const page of snap.pages) {
    // "02 Components – Button" → "Button"
    const title = page.name.replace(/^\d+\s+Components\s+[–-]\s+/, '')
    if (claimed.has(norm(PAGE_ALIASES[title] ?? title))) continue
    ungoverned.push({
      name: title,
      publicSets: page.sets.filter((s) => !s.private).length,
    })
  }

  // Summed from the same snapshot walk, so the tile moves as contracts land.
  // It used to read the `| — public | 73 |` row of
  // docs/contracts/kit/figma-only.md, the 2026-08-28 disposition count, which
  // stopped moving once #240 began governing those sets.
  const publicUngoverned: number | null = ungoverned.reduce((n, p) => n + p.publicSets, 0)

  return { publicUngoverned, ungoverned }
}
