/**
 * A Code tab example as one complete file: the thing a reader pastes into
 * `app/example.tsx` and runs, not a fragment that names state it never
 * declares.
 *
 * Each page's `<slug>-code.ts` builds an Example from the same control values
 * its preview renders, so the code still follows the controls. This file turns
 * one into source text. Pure TypeScript with no JSX and no React import, so
 * scripts/code-tab-check.mjs can run every page's builder in Node, over every
 * combination of its controls, and type-check what comes out.
 *
 * Imports name what an adopter has after `npx shadcn add`: `@/components/ui/*`
 * for components and `@/components/kit-icon` for icons. Never this site's own
 * helpers, and never a package the registry does not install.
 */

export type Example = {
  /** Module -> named imports, in the order they print. `react` always prints
   *  first. Write `type Foo` for a type-only import. */
  imports: Record<string, string[]>
  /** Module-level code: data, stub handlers, a child component. */
  module?: string
  /** The component body above `return`: state, hooks. */
  body?: string
  /** What the component returns. One root element, or a fragment. */
  jsx: string
  /** The exported component's name. Defaults to `Example`. */
  name?: string
}

/**
 * Whether the example only runs in a client component: it calls a hook,
 * passes a function (an arrow, a render prop) or wires an event handler.
 * Pasted into an App Router page without `'use client'`, such an example fails
 * the build with "Functions cannot be passed directly to Client Components".
 */
export function needsClient(code: string) {
  return /\buse[A-Z]\w*\(/.test(code) || /=>/.test(code) || /\bon[A-Z]\w*=\{/.test(code)
}

const indent = (text: string, by: string) =>
  text
    .split('\n')
    .map((l) => (l ? by + l : l))
    .join('\n')

function importLines(imports: Example['imports']) {
  const mods = Object.keys(imports).sort((a, b) => (a === 'react' ? -1 : b === 'react' ? 1 : 0))
  return mods.map((mod) => {
    const names = imports[mod]
    const allTypes = names.every((n) => n.startsWith('type '))
    const list = allTypes ? names.map((n) => n.slice(5)) : names
    return `import ${allTypes ? 'type ' : ''}{ ${list.join(', ')} } from '${mod}'`
  })
}

export function exampleFile(e: Example): string {
  const client = needsClient([e.module, e.body, e.jsx].filter(Boolean).join('\n'))
  const out: string[] = []
  if (client) out.push("'use client'", '')
  out.push(...importLines(e.imports), '')
  if (e.module) out.push(e.module.trim(), '')
  out.push(`export default function ${e.name ?? 'Example'}() {`)
  if (e.body) out.push(indent(e.body.trim(), '  '), '')
  out.push('  return (', indent(e.jsx.trim(), '    '), '  )', '}')
  return out.join('\n') + '\n'
}

/** Every combination of a page's control values, for the check. */
export function combinations<T extends Record<string, readonly unknown[]>>(
  controls: T,
): { [K in keyof T]: T[K][number] }[] {
  let out: Record<string, unknown>[] = [{}]
  for (const [key, values] of Object.entries(controls)) {
    out = out.flatMap((combo) => values.map((v) => ({ ...combo, [key]: v })))
  }
  return out as { [K in keyof T]: T[K][number] }[]
}
