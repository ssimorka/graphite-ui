import fs from 'node:fs'
import path from 'node:path'

export type ContractMeta = {
  component: string
  version: string
  wave: string
  slug: string
}

/**
 * Versions are read from the contract files at build time rather than written
 * out by hand. Governance rule 5 wants the contract version visible next to the
 * thing implementing it; a number typed by hand would drift the first time a
 * contract was bumped, which is the exact failure the gallery exists to catch.
 *
 * Shared by the gallery and the home page's component wall, which both label
 * live specimens with the contract they implement. Server-only: it reads the
 * repo, so it must be called from a server component.
 */
export function readContracts(): Record<string, ContractMeta> {
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
