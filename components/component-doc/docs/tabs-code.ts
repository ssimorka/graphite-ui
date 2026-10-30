import type { KitIconName } from '@/lib/kit-icons'
import type { Example } from '../example-file'

// Tabs' Code tab. The tab data lives here so the page, the preview and the
// printed file all read one copy.

export const ORIENTATIONS = ['horizontal', 'vertical'] as const
export type Orientation = (typeof ORIENTATIONS)[number]
export const VARIANTS = ['line', 'contained'] as const
export type Variant = (typeof VARIANTS)[number]
export const KINDS = ['text', 'icon'] as const
export type Kind = (typeof KINDS)[number]

export type DemoTab = { id: string; label: string; body: string; icon: KitIconName }

export const TABS: [DemoTab, DemoTab, ...DemoTab[]] = [
  {
    id: 'source',
    label: 'Source',
    icon: 'settings',
    body: 'One hex value. Everything else on the page is derived from it.',
  },
  {
    id: 'ramps',
    label: 'Ramps',
    icon: 'database',
    body: 'Tonal ramps sampled from the source, one for each colour family.',
  },
  {
    id: 'roles',
    label: 'Roles',
    icon: 'user',
    body: 'The named colours components bind to, checked for contrast at AA or AAA.',
  },
]

export const controls = { orientation: ORIENTATIONS, variant: VARIANTS, kind: KINDS, tabs: [TABS] }

type Values = { orientation: Orientation; variant: Variant; kind: Kind; tabs: DemoTab[] }

export function exampleFor({ orientation, variant, kind, tabs }: Values): Example {
  const props = [
    ...(orientation === 'horizontal' ? [] : [`  orientation="${orientation}"`]),
    ...(variant === 'line' || orientation === 'vertical' ? [] : [`  variant="${variant}"`]),
    ...(kind === 'icon' && orientation === 'horizontal' ? ['  iconOnly'] : []),
  ]
  const body = tabs
    .map(
      (t) =>
        `    { id: '${t.id}', label: '${t.label}',${kind === 'icon' ? ` icon: '${t.icon}',` : ''} panel: <p>${t.body}</p> },`,
    )
    .join('\n')
  const head = props.length ? `\n${props.join('\n')}` : ''
  return {
    imports: { '@/components/ui/tabs': ['Tabs'] },
    jsx: `<Tabs${head}\n  tabs={[\n${body}\n  ]}\n/>`,
  }
}
