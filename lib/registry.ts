import fs from 'node:fs'
import path from 'node:path'
import { buildStates, buildTheme, makeRamps, normalizeHex } from '@/lib/color.js'
import type { ContrastLevel, ExportBundle } from '@/lib/color.js'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { buildThemeFile } from '@/lib/theme-file'
import { buildTailwindBridge } from '@/lib/tailwind-bridge'
import { readFoundations } from '@/app/docs/foundations/tokens/read-tokens'

/**
 * The shadcn-style registry, built from the repo on request.
 *
 * Every item is derived from the code: a component's files are its .tsx and
 * .module.scss in components/ui, and its dependencies are whatever those files
 * import. Nothing is listed by hand, so a component that gains an import gains
 * the dependency here too, and the registry cannot drift from the source.
 *
 * Two rules from the shadcn CLI shape the file types (see the comment on
 * `fileEntry`): a .tsx is registry:ui, so the CLI rewrites its `@/` imports to
 * the project's aliases; every stylesheet is registry:file with a target, so
 * the CLI copies it verbatim instead of running its TSX transformer over Sass.
 *
 * Server-only: it reads the repo.
 */

export type RegistryFile = {
  path: string
  type: string
  target?: string
  content: string
}

export type RegistryItem = {
  $schema: string
  name: string
  type: string
  title: string
  description: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
}

const SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json'
const ROOT = () => process.cwd()
const read = (rel: string) => fs.readFileSync(path.join(ROOT(), rel), 'utf8')
const exists = (rel: string) => fs.existsSync(path.join(ROOT(), rel))

// Helpers that are not components but that components import. Each is an item
// of its own, so two components that share one install it once.
const HELPERS: Record<string, { title: string; files: string[]; description: string }> = {
  cn: { title: 'cn', files: ['lib/cn.ts'], description: 'Class name merge (clsx).' },
  'field-message': {
    title: 'Field message',
    files: ['lib/field-message.ts'],
    description: 'Picks the message a form field shows for its state.',
  },
  'kit-icons': {
    title: 'Kit icons',
    files: ['lib/kit-icons.ts'],
    description: 'The Figma kit’s icon paths, in Regular, Bold and Solid.',
  },
  'kit-icon': {
    title: 'Kit icon',
    files: ['components/kit-icon.tsx'],
    description: 'Renders one of the kit’s icons.',
  },
  'form-parts': {
    title: 'Form parts',
    files: ['components/ui/_form-parts.scss'],
    description: 'Shared Sass for form labels, help and messages.',
  },
  'field-shell': {
    title: 'Field shell',
    files: ['components/ui/_field-shell.scss'],
    description: 'Shared Sass for the box around text fields.',
  },
}

// Bare imports that the project already has, so they are never declared.
const PROVIDED = new Set(['react', 'react-dom', 'next'])

/** What a file imports, split into the three kinds the registry cares about. */
function importsOf(rel: string) {
  const src = read(rel)
  const specs = rel.endsWith('.scss')
    ? [...src.matchAll(/^@use\s+'([^']+)'/gm)].map((m) => m[1])
    : [...src.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1])
  const items = new Set<string>()
  const npm = new Set<string>()
  for (const s of specs) {
    if (s.endsWith('.module.scss')) continue // the component's own stylesheet
    if (s.startsWith('./')) items.add(s.slice(2).replace(/^_/, ''))
    else if (s === '@/lib/cn') items.add('cn')
    else if (s === '@/lib/field-message') items.add('field-message')
    else if (s === '@/lib/kit-icons') items.add('kit-icons')
    else if (s === '@/components/kit-icon') items.add('kit-icon')
    else if (s.startsWith('@/')) throw new Error(`registry: ${rel} imports ${s}, which no item provides`)
    else {
      const pkg = s.startsWith('@') ? s.split('/').slice(0, 2).join('/') : s.split('/')[0]
      if (!PROVIDED.has(pkg)) npm.add(pkg)
    }
  }
  return { items, npm }
}

/**
 * One file as the CLI should receive it.
 *
 * - components/ui/*.tsx: registry:ui. The CLI writes it to the project's ui
 *   alias and rewrites `@/lib/...` and `@/components/...` to its aliases.
 * - *.scss: registry:file with an `@ui/` target. The CLI skips its transformer
 *   for registry:file (which parses content as TSX) and resolves `@ui/` to the
 *   same ui directory, so the stylesheet lands beside its component and the
 *   relative `./x.module.scss` import still resolves.
 * - lib/*: registry:lib, written to the project's lib alias.
 * - components/*.tsx outside ui: registry:component.
 */
function fileEntry(rel: string): RegistryFile {
  const content = read(rel)
  const base = path.basename(rel)
  if (rel.endsWith('.scss')) return { path: rel, type: 'registry:file', target: `@ui/${base}`, content }
  if (rel.startsWith('components/ui/')) return { path: rel, type: 'registry:ui', content }
  if (rel.startsWith('lib/')) return { path: rel, type: 'registry:lib', content }
  return { path: rel, type: 'registry:component', content }
}

function itemUrl(base: string, name: string) {
  return `${base}/${name}.json`
}

/** A component's first docblock line, as its description. */
function describe(rel: string, fallback: string) {
  const m = read(rel).match(/\/\*\*\s*\n\s*\*\s*([^\n]+)/)
  return m ? m[1].replace(/\s*\*\/$/, '').trim() : fallback
}

const titleCase = (slug: string) =>
  slug.replace(/(^|-)([a-z])/g, (_, sep, c) => (sep ? ' ' : '') + c.toUpperCase())

/** Names of every item the registry serves, components first. */
export function registryNames(): string[] {
  const ui = fs
    .readdirSync(path.join(ROOT(), 'components', 'ui'))
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => f.replace(/\.tsx$/, ''))
    .sort()
  return ['init', ...ui, ...Object.keys(HELPERS), 'theme-provider', 'tailwind']
}

/** One item by name, with dependencies as absolute URLs under `base`. */
export function registryItem(name: string, base: string): RegistryItem | null {
  let files: string[]
  let title: string
  let description: string
  let type = 'registry:ui'

  if (HELPERS[name]) {
    ;({ files, title, description } = HELPERS[name])
    type = files[0].startsWith('lib/') ? 'registry:lib' : files[0].endsWith('.scss') ? 'registry:item' : 'registry:component'
  } else if (name === 'theme-provider') {
    files = ['components/theme-provider.tsx', 'lib/color.js', 'lib/color.d.ts', 'lib/cover-source.ts', 'lib/theme-storage.ts']
    title = 'Theme provider'
    description =
      'Switches light and dark, and can generate the theme from a source color at runtime. Optional: the theme file from Create needs no runtime.'
    type = 'registry:component'
  } else if (name === 'tailwind') {
    return tailwindItem()
  } else if (name === 'init') {
    return initItem()
  } else if (exists(`components/ui/${name}.tsx`)) {
    files = [`components/ui/${name}.tsx`]
    if (exists(`components/ui/${name}.module.scss`)) files.push(`components/ui/${name}.module.scss`)
    title = titleCase(name)
    description = describe(files[0], title)
  } else {
    return null
  }

  const items = new Set<string>()
  const npm = new Set<string>()
  // The provider's imports are the other files in its own item.
  const analyse = name === 'theme-provider' ? [] : files
  for (const f of analyse) {
    if (!/\.(tsx?|scss)$/.test(f) || f.endsWith('.d.ts')) continue
    const i = importsOf(f)
    i.items.forEach((x) => x !== name && items.add(x))
    i.npm.forEach((x) => npm.add(x))
    if (f.endsWith('.scss')) npm.add('sass')
  }

  return {
    $schema: SCHEMA,
    name,
    type,
    title,
    description,
    ...(npm.size ? { dependencies: [...npm].sort() } : {}),
    ...(items.size ? { registryDependencies: [...items].sort().map((i) => itemUrl(base, i)) } : {}),
    files: files.map(fileEntry),
  }
}

/** The bundle the engine exports for a source, both themes. */
function bundleFor(hex: string, level: ContrastLevel): ExportBundle {
  const ramps = makeRamps(hex)
  const light = buildTheme('light', ramps, level)
  const dark = buildTheme('dark', ramps, level)
  return {
    hex,
    ramps,
    light,
    lightStates: buildStates(light.tokens, ramps, 'light'),
    dark,
    darkStates: buildStates(dark.tokens, ramps, 'dark'),
  }
}

// Where the CLI writes the theme and the bridge: beside the global stylesheet
// of a create-next-app project. `~/` is the project root.
const THEME_TARGET = '~/app/graphite-theme.css'
const TAILWIND_TARGET = '~/app/graphite-tailwind.css'

/** The Tailwind bridge. It holds no values, so it is the same for every source. */
function tailwindItem(): RegistryItem {
  const content = buildTailwindBridge({
    bundle: bundleFor(COVER_SOURCE_HEX, 'AA'),
    foundations: readFoundations(),
  })
  return {
    $schema: SCHEMA,
    name: 'tailwind',
    type: 'registry:item',
    title: 'Tailwind bridge',
    description: 'Names the Graphite variables as Tailwind v4 tokens: bg-surface, text-on-primary, p-space-05.',
    files: [{ path: 'graphite-tailwind.css', type: 'registry:file', target: TAILWIND_TARGET, content }],
  }
}

/**
 * A minimal components.json, so the CLI will add components without running
 * `shadcn init`. Init would write shadcn's own theme into globals.css, whose
 * --color-background and friends override the Tailwind bridge. The aliases are
 * create-next-app's. `tailwind.css` names the stylesheet only because the
 * schema wants one: no Graphite item carries cssVars, so it is never edited.
 *
 * A single registry:file with a target installs without a components.json,
 * which is the point: this is the file that creates it.
 */
function initItem(): RegistryItem {
  const config = {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'new-york',
    rsc: true,
    tsx: true,
    tailwind: { config: '', css: 'app/globals.css', baseColor: 'neutral', cssVariables: true, prefix: '' },
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
      ui: '@/components/ui',
      lib: '@/lib',
      hooks: '@/hooks',
    },
  }
  return {
    $schema: SCHEMA,
    name: 'init',
    type: 'registry:item',
    title: 'Set up a project for Graphite components',
    description: 'Writes a components.json with create-next-app’s aliases, without touching globals.css.',
    files: [{ path: 'components.json', type: 'registry:file', target: '~/components.json', content: JSON.stringify(config, null, 2) + '\n' }],
  }
}

/** The theme file for one source color, as Create's Get the code writes it. */
export function themeItem(rawHex: string, level: ContrastLevel): RegistryItem | null {
  if (!/^#?[0-9a-fA-F]{6}$/.test(rawHex)) return null
  const hex = normalizeHex(rawHex)
  const content = buildThemeFile({ bundle: bundleFor(hex, level), level, foundations: readFoundations() })
  return {
    $schema: SCHEMA,
    name: `theme-${hex.slice(1)}`,
    type: 'registry:item',
    title: `Graphite theme ${hex}`,
    description: `A whole theme from ${hex}, contrast target ${level}, in light and dark. Plain CSS: no runtime.`,
    files: [{ path: 'graphite-theme.css', type: 'registry:file', target: THEME_TARGET, content }],
  }
}
