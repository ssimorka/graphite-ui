import fs from 'node:fs'
import path from 'node:path'
import { readContractDoc } from '@/lib/contract-doc'
import { readFoundations, remToPx } from '../tokens/read-tokens'

/**
 * The type scale as the Typography page shows it, read at build time from the
 * three places that hold it: app/globals.scss (what the browser gets), the kit
 * snapshot (what Figma says) and the foundation contract (what the scale is
 * for). Nothing on the page is a typed copy of a value. Server-only.
 */

export type Step = {
  /** `body-2`, `component-button-1`. */
  step: string
  /** The first segment: display, heading, title, body, component, … */
  ladder: string
  size: string
  lineHeight: string
  /** Present only when the Mobile block restates the step. */
  mobile?: { size: string; lineHeight: string }
  /** Whether both modes agree with the snapshot, in px. */
  matchesKit: boolean
}

export type TypeFamily = { key: string; name: string; value: string; hasFallback: boolean; usage: string }

const ROOT = process.cwd()
const read = (...p: string[]) => fs.readFileSync(path.join(ROOT, ...p), 'utf8')

// Ladder order is the contract's own listing: "display, heading 1-6, title
// 1-5, body 1-3, component (…), footnote, caption 1-2 and code 1-3".
const LADDERS = ['display', 'heading', 'title', 'body', 'component', 'footnote', 'caption', 'code']

const stepNum = (s: string) => Number(s.match(/(\d+)$/)?.[1] ?? 0)

type Snapshot = {
  collections: Record<
    string,
    { variables: Record<string, { values: Record<string, { value: number | string }> }> }
  >
}

export function readType() {
  const f = readFoundations()
  const val = (decls: typeof f.desktop, name: string) => decls.find((d) => d.name === name)?.value

  const snap = JSON.parse(read('docs', 'tokens', 'figma-snapshot.json')) as Snapshot
  const kit = snap.collections['Graphite Typography'].variables
  const kitPx = (kind: 'size' | 'lineHeight', step: string, mode: 'Desktop' | 'Mobile') =>
    kit[`${kind}/${step.replace(/-/g, '/')}`]?.values[mode]?.value

  const names = f.desktop
    .map((d) => d.name.match(/^--graphite-text-(?!weight-)([a-z0-9-]+)-size$/)?.[1])
    .filter((s): s is string => !!s)

  const steps: Step[] = names.map((step) => {
    const size = val(f.desktop, `--graphite-text-${step}-size`)!
    const lineHeight = val(f.desktop, `--graphite-text-${step}-line-height`) ?? ''
    const mSize = val(f.mobile, `--graphite-text-${step}-size`)
    const mLine = val(f.mobile, `--graphite-text-${step}-line-height`)
    const mobile = mSize || mLine ? { size: mSize ?? size, lineHeight: mLine ?? lineHeight } : undefined
    const m = mobile ?? { size, lineHeight }
    const matchesKit =
      remToPx(size) === kitPx('size', step, 'Desktop') &&
      remToPx(lineHeight) === kitPx('lineHeight', step, 'Desktop') &&
      remToPx(m.size) === kitPx('size', step, 'Mobile') &&
      remToPx(m.lineHeight) === kitPx('lineHeight', step, 'Mobile')
    return { step, ladder: step.split('-')[0], size, lineHeight, mobile, matchesKit }
  })

  const rank = (l: string) => {
    const i = LADDERS.indexOf(l)
    return i === -1 ? LADDERS.length : i
  }
  steps.sort(
    (a, b) =>
      rank(a.ladder) - rank(b.ladder) ||
      a.step.replace(/-\d+$/, '').localeCompare(b.step.replace(/-\d+$/, '')) ||
      stepNum(a.step) - stepNum(b.step),
  )

  // ---------------------------------------------------------- the contract
  const contractSrc = read('docs', 'contracts', 'foundations', 'typography.md')
  const usageOf = (name: string) =>
    contractSrc.match(
      new RegExp(`- name: ${name.replace(/[|]/g, '\\|')}\\s*\\n(?:\\s+\\w+:.*\\n)*?\\s+usage:\\s*(.*)`),
    )?.[1] ?? ''
  const contract = readContractDoc('foundations/typography')

  const families: TypeFamily[] = f.desktop
    .filter((d) => d.name.startsWith('--graphite-font-'))
    .map((d) => ({
      key: d.name.replace('--graphite-font-', ''),
      name: d.name,
      value: d.value,
      // A stack is a comma list. A lone quoted family has nothing to fall back
      // to but the browser default, which is usually a serif.
      hasFallback: d.value.includes(','),
      usage: usageOf(d.name),
    }))

  const weights = f.desktop
    .filter((d) => d.name.startsWith('--graphite-text-weight-'))
    .map((d) => ({ name: d.name, key: d.name.replace('--graphite-text-weight-', ''), value: d.value, note: d.note }))
    .sort((a, b) => Number(a.value) - Number(b.value))

  // ------------------------------------------ what the Typography component binds
  const typeScss = read('components', 'ui', 'typography.module.scss')
  // The tag each variant renders, from the component's own TAG_FOR map.
  const typeTsx = read('components', 'ui', 'typography.tsx')
  const tags = new Map(
    [...(typeTsx.match(/TAG_FOR[^{]*\{([^}]*)\}/)?.[1] ?? '').matchAll(/'?([a-z0-9-]+)'?:\s*'([a-z0-9]+)'/g)].map(
      (m) => [m[1], m[2]],
    ),
  )
  const variants = [...typeScss.matchAll(/^\.([a-z0-9-]+)\s*\{([^}]*)\}/gm)]
    .map((m) => ({
      variant: m[1],
      tag: tags.get(m[1]) ?? '',
      family: m[2].match(/var\(--graphite-font-([a-z0-9-]+)\)/)?.[1],
      step: m[2].match(/var\(--graphite-text-([a-z0-9-]+)-size\)/)?.[1],
    }))
    .filter((v): v is { variant: string; tag: string; family: string; step: string } => !!v.family && !!v.step)

  // ------------------------------------ how the governed components set type
  const uiDir = path.join(ROOT, 'components', 'ui')
  const scan = (file: string) => {
    const src = fs.readFileSync(path.join(uiDir, file), 'utf8')
    return {
      src,
      steps: new Set(
        [...src.matchAll(/--graphite-text-(?!weight-)([a-z0-9-]+?)-(?:size|line-height)\b/g)].map((m) => m[1]),
      ),
      literals: new Set([...src.matchAll(/font-size:\s*([\d.]+rem)/g)].map((m) => m[1])),
    }
  }
  const formParts = fs.existsSync(path.join(uiDir, '_form-parts.scss')) ? scan('_form-parts.scss') : null
  const components = fs
    .readdirSync(uiDir)
    .filter((f) => f.endsWith('.module.scss'))
    .map((file) => {
      const s = scan(file)
      const viaParts = formParts && /@use '\.\/form-parts'/.test(s.src)
      const literals = new Set([...s.literals, ...(viaParts ? formParts.literals : [])])
      return {
        slug: file.replace('.module.scss', ''),
        steps: [...s.steps],
        literals: [...literals].sort((a, b) => parseFloat(a) - parseFloat(b)),
      }
    })

  // ----------------------------------------------------- the site's own chrome
  const globals = read('app', 'globals.scss')
  const mixinSteps = [...globals.matchAll(/@include\s+text\('?([a-z0-9-]+)/g)].map((m) => m[1])
  // The same count token-drift warns about: Carbon type styles still applied
  // directly, because the kit cannot express them.
  let carbonStyles = 0
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else if (/\.(scss|css)$/.test(e.name)) {
        carbonStyles += (fs.readFileSync(p, 'utf8').match(/type\.type-style\('[a-z0-9-]+'/g) ?? []).length
      }
    }
  }
  walk(path.join(ROOT, 'components'))
  walk(path.join(ROOT, 'app'))

  return {
    steps,
    families,
    weights,
    variants,
    components,
    mixinUses: mixinSteps.length,
    mixinSteps: [...new Set(mixinSteps)],
    carbonStyles,
    mobileMaxWidth: f.mobileMaxWidth,
    contract: {
      version: contract.version,
      rules: contract.compositionRules,
      prohibitions: contract.prohibitions,
      variableCount: Number(contractSrc.match(/^variable_count:\s*(\d+)/m)?.[1] ?? 0),
    },
    variableCount: f.desktop.filter((d) => /^--graphite-(font|text)-/.test(d.name)).length,
  }
}
