import fs from 'node:fs'
import path from 'node:path'
import { FREE_KIT_PAGES, KIT_FREE_FILE_URL, KIT_PRO_URL } from './kit-links'

export type KitPage = {
  /** The page's node id in the kit file. */
  id: string
  /**
   * Where a designer gets this component: the page in the free kit, or the
   * Pro listing when the component is Pro only. Never the working file.
   */
  url: string
  /** Which public edition carries the component. */
  edition: 'free' | 'pro'
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
    pages: {
      id: string
      name: string
      sets: { variants: number; private: boolean }[]
    }[]
  }
  const page = snap.pages.find((p) =>
    new RegExp(`\\s${title}$`).test(p.name),
  )
  if (!page) return null
  return {
    id: page.id,
    ...(FREE_KIT_PAGES.has(title)
      ? { url: `${KIT_FREE_FILE_URL}?node-id=${page.id.replace(':', '-')}`, edition: 'free' as const }
      : { url: KIT_PRO_URL, edition: 'pro' as const }),
    sets: page.sets.length,
    variants: page.sets.reduce((n, s) => n + s.variants, 0),
    publicSets: page.sets.filter((s) => !s.private).length,
  }
}
