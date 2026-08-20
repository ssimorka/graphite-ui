import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { Gallery } from '@/components/sections/gallery'
import { SiteFooter } from '@/components/sections/site-footer'

export const metadata: Metadata = {
  title: 'Components · Graphite UI',
  description:
    'Every Tier 1 component rendered live from the same tokens the rest of the system uses, each labelled with the version of the contract it implements.',
}

export type ContractMeta = {
  component: string
  version: string
  wave: string
  slug: string
}

/**
 * Versions are read from the contract files at build time rather than written
 * out here. Governance rule 5 wants the contract version visible next to the
 * thing implementing it; a number typed by hand would drift the first time a
 * contract was bumped, which is the exact failure this page exists to catch.
 */
function readContracts(): Record<string, ContractMeta> {
  const dir = path.join(process.cwd(), 'docs', 'contracts')
  const out: Record<string, ContractMeta> = {}

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md') || file === 'README.md') continue
    const src = fs.readFileSync(path.join(dir, file), 'utf8')
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
    const field = (key: string) =>
      fm.match(new RegExp(`^${key}:[ \t]*(.+)$`, 'm'))?.[1]?.trim() ?? ''

    const component = field('component')
    if (!component) continue
    out[component] = {
      component,
      version: field('version'),
      wave: field('wave'),
      slug: file.replace(/\.md$/, ''),
    }
  }
  return out
}

export default function GalleryPage() {
  return (
    <main id="main-content" className="page-main">
      <Gallery contracts={readContracts()} />
      <SiteFooter />
    </main>
  )
}
