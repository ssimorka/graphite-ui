import fs from 'node:fs'
import path from 'node:path'
import { readContracts } from '@/lib/contracts'
import { readContractDoc } from '@/lib/contract-doc'

// Build-time reads for the Governance page. Server-only. Each one reads the
// file that is the authority for what it reports, so the page cannot quote a
// count or a CI step that has since moved.

const read = (...p: string[]) => fs.readFileSync(path.join(process.cwd(), ...p), 'utf8')

/**
 * The numbered rules under "**Rules:**" in docs/contracts/README.md. The page
 * words them itself (the README's own phrasing leans on em dashes, which the
 * site's copy does not use), so it reads the numbers back to notice when the
 * README gains or loses one.
 */
export function readRuleNumbers(): number[] {
  const src = read('docs', 'contracts', 'README.md')
  const start = src.indexOf('**Rules:**')
  if (start === -1) return []
  const rest = src.slice(start)
  const end = rest.search(/\n#{2,3} /)
  const block = end === -1 ? rest : rest.slice(0, end)
  return [...block.matchAll(/^(\d+)\. /gm)].map((m) => Number(m[1]))
}

export type ContractRow = {
  slug: string
  component: string
  version: string
  wave: string
  slots: number
  props: number
  tokens: number
  rules: number
  prohibitions: number
}

/** Every contract, in wave order then by name, with the size of each list. */
export function readContractRows(): ContractRow[] {
  return Object.values(readContracts())
    .map((m) => {
      const d = readContractDoc(m.slug)
      return {
        slug: m.slug,
        component: m.component,
        version: m.version,
        wave: m.wave,
        slots: d.slots.length,
        props: d.props.length,
        tokens: d.tokens.length,
        rules: d.compositionRules.length,
        prohibitions: d.prohibitions.length,
      }
    })
    .sort((a, b) => Number(a.wave) - Number(b.wave) || a.component.localeCompare(b.component))
}

export type CiStep = { name: string; run: string }

/** The named steps of the `governance` job in .github/workflows/checks.yml. */
export function readCiSteps(): CiStep[] {
  const src = read('.github', 'workflows', 'checks.yml')
  const job = src.slice(src.indexOf('governance:'))
  const steps: CiStep[] = []
  const re = /- name:\s*"?([^"\n]+)"?\n(?:\s+if:[^\n]*\n)?\s+run:\s*([^\n]+)/g
  for (const m of job.matchAll(re)) steps.push({ name: m[1].trim(), run: m[2].trim() })
  return steps
}

export type Unclaimed = { pages: number; sets: number; public: number; private: number; date: string }

/**
 * The disposition walk's totals, from the table at the head of
 * docs/contracts/kit/figma-only.md. That walk covers the 27 pages no contract
 * claims and is dated; the snapshot counts (readKitStats) cover all 45.
 */
export function readUnclaimed(): Unclaimed | null {
  const src = read('docs', 'contracts', 'kit', 'figma-only.md')
  const num = (label: RegExp) => {
    const m = src.match(new RegExp(`^\\|\\s*${label.source}\\s*\\|\\s*\\**(\\d+)\\**\\s*\\|`, 'm'))
    return m ? Number(m[1]) : NaN
  }
  const out = {
    pages: num(/Unclaimed pages/),
    sets: num(/Component sets on them/),
    public: num(/\W+ public/),
    private: num(/\W+ private \(`_`-prefixed\)/),
    date: src.match(/\*\*Derived (\d{4}-\d{2}-\d{2})\*\*/)?.[1] ?? '',
  }
  return Object.values(out).some((v) => typeof v === 'number' && Number.isNaN(v)) ? null : out
}
