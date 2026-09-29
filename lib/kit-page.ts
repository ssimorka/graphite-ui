import fs from 'node:fs'
import path from 'node:path'

export type KitPage = {
  /** Component sets on the page, private build blocks included. */
  sets: number
  /** Variants across every set on the page. */
  variants: number
  /** Public sets only: the ones a designer picks from. */
  publicSets: number
}

/**
 * One kit component page, by its title ("Accordion"), from the committed
 * snapshot. The docs component pages quote these numbers in their header and
 * parity section, so they are read here and not written into the page.
 */
export function readKitPage(title: string): KitPage | null {
  const snap = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'docs', 'tokens', 'figma-components.json'),
      'utf8',
    ),
  ) as {
    pages: { name: string; sets: { variants: number; private: boolean }[] }[]
  }
  const page = snap.pages.find((p) =>
    new RegExp(`\\s${title}$`).test(p.name),
  )
  if (!page) return null
  return {
    sets: page.sets.length,
    variants: page.sets.reduce((n, s) => n + s.variants, 0),
    publicSets: page.sets.filter((s) => !s.private).length,
  }
}
