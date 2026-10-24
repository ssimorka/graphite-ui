import fs from 'node:fs'
import path from 'node:path'
import { readRootVars, titleOf } from '../spacing/read-foundation'

/**
 * Build-time readers for the Motion page.
 *
 * The tokens come from app/globals.scss (checked against the kit by
 * token-drift), the rules from the Motion foundation contract, and the
 * component map from each component contract's `motion:` block (checked
 * against the code by drift-check). Nothing on the page is typed in twice.
 *
 * Server-only: it reads the repo.
 */

const ROOT = process.cwd()

export type MotionToken = {
  /** `--graphite-motion-duration-fast` */
  name: string
  /** `duration-fast`, the name a contract's motion: block uses */
  key: string
  /** `duration`, `delay`, `easing` or `spring` */
  family: string
  value: string
  /** The Tailwind bridge's class for it. */
  tailwind: string
  /** Components whose motion: block names it. */
  usedBy: { slug: string; title: string }[]
}

const tailwindFor = (family: string, suffix: string) =>
  family === 'duration'
    ? `duration-graphite-${suffix}`
    : family === 'delay'
      ? `delay-graphite-${suffix}`
      : family === 'easing'
        ? `ease-graphite-${suffix}`
        : `ease-graphite-spring-${suffix}`

/** Each component contract's motion: block, as the token keys it names. */
function readComponentMotion(): { slug: string; title: string; keys: Set<string> }[] {
  const dir = path.join(ROOT, 'docs', 'contracts')
  const out: { slug: string; title: string; keys: Set<string> }[] = []
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.md') || file === 'README.md') continue
    const src = fs.readFileSync(path.join(dir, file), 'utf8')
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
    const lines = fm.split(/\r?\n/)
    const start = lines.indexOf('motion:')
    if (start === -1) continue
    const keys = new Set<string>()
    for (let i = start + 1; i < lines.length && !/^\S/.test(lines[i]); i++) {
      const m = /^\s+(duration|easing):\s*"?(.*?)"?\s*$/.exec(lines[i])
      if (m) for (const k of m[2].split(/\s*[+,]\s*/)) if (k && k !== 'none') keys.add(k)
    }
    const component = /^component:\s*(.+)$/m.exec(fm)?.[1].trim()
    const slug = file.replace(/\.md$/, '')
    out.push({ slug, title: component ?? titleOf(slug), keys })
  }
  return out
}

/** The kit's ten motion tokens, in the stylesheet's order, with who uses each. */
export function readMotionTokens(): MotionToken[] {
  const components = readComponentMotion()
  return readRootVars('motion')
    .map((v) => {
      const m = /^(duration|delay|easing|spring)-(.+)$/.exec(v.suffix)
      if (!m) return null
      return {
        name: v.name,
        key: v.suffix,
        family: m[1],
        value: v.value,
        tailwind: tailwindFor(m[1], m[2]),
        usedBy: components.filter((c) => c.keys.has(v.suffix)).map(({ slug, title }) => ({ slug, title })),
      }
    })
    .filter((t): t is MotionToken => t !== null)
}

/** The rules and prohibitions from docs/contracts/foundations/motion.md. */
export function readMotionContract(): { version: string; rules: string[]; prohibitions: string[] } {
  const src = fs.readFileSync(path.join(ROOT, 'docs', 'contracts', 'foundations', 'motion.md'), 'utf8')
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const list = (key: string) => {
    const lines = fm.split(/\r?\n/)
    const start = lines.indexOf(`${key}:`)
    if (start === -1) return []
    const out: string[] = []
    for (let i = start + 1; i < lines.length && !/^\S/.test(lines[i]); i++) {
      const m = /^ {2}- (.*)$/.exec(lines[i])
      if (m) out.push(m[1].trim().replace(/^"(.*)"$/, '$1'))
    }
    return out
  }
  return {
    version: /^version:\s*(.+)$/m.exec(fm)?.[1].trim() ?? '',
    rules: list('rules'),
    prohibitions: list('prohibitions'),
  }
}
