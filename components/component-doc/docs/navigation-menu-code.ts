import type { NavItem } from '@/components/ui/navigation-menu'
import type { Example } from '../example-file'

// Navigation Menu's Code tab: the items as the preview has them, current link
// included. The component holds no state; the caller says which link is
// current, so the example does too.

export const ORIENTATIONS = ['horizontal', 'vertical'] as const
export type Orientation = (typeof ORIENTATIONS)[number]

export const TOP = [
  { label: 'Overview', href: '#overview' },
  { label: 'Foundations', href: '#foundations' },
  { label: 'Components', href: '#components' },
]
export const NESTED = [
  { label: 'Button', href: '#button' },
  { label: 'Tabs', href: '#tabs' },
]

export function build(nested: boolean, current: string): [NavItem, ...NavItem[]] {
  return TOP.map((item) => ({
    ...item,
    ...(item.href === current ? { current: true } : {}),
    ...(nested && item.label === 'Components'
      ? {
          items: NESTED.map((c) => ({
            ...c,
            ...(c.href === current ? { current: true } : {}),
          })),
        }
      : {}),
  })) as [NavItem, ...NavItem[]]
}

export const controls = {
  orientation: ORIENTATIONS,
  nested: [false, true],
  // Runtime state: the link the reader last clicked.
  current: ['#overview', '#components', '#button'],
}

function line(i: { label: string; href: string; current?: boolean }) {
  return `label: '${i.label}', href: '${i.href}'${i.current ? ', current: true' : ''}`
}

type Values = { orientation: Orientation; nested: boolean; current: string }

export function exampleFor({ orientation, nested, current }: Values): Example {
  const rows = build(nested, current)
    .map((i) => {
      if (!i.items) return `    { ${line(i)} },`
      const kids = i.items.map((c) => `        { ${line(c)} },`).join('\n')
      return `    {\n      ${line(i)},\n      items: [\n${kids}\n      ],\n    },`
    })
    .join('\n')
  const o = orientation === 'horizontal' ? '' : `\n  orientation="${orientation}"`
  return {
    imports: { '@/components/ui/navigation-menu': ['NavigationMenu'] },
    jsx: `<NavigationMenu\n  label="Docs"${o}\n  items={[\n${rows}\n  ]}\n/>`,
  }
}
