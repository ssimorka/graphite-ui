import type { Example } from '../example-file'

// Contained list's Code tab, from Type, Size and Interactive. The rows arrive
// from the page, so the check builds from a sample of the same shape.

export const SIZES = ['sm', 'md', 'lg', 'xl'] as const
export type Size = (typeof SIZES)[number]
export const KINDS = ['on-page', 'disclosed'] as const
export type Kind = (typeof KINDS)[number]
export type DemoRow = { id: string; tag: string; title: string; description: string; status: string }

/** The trailing icon button, a size the row can hold. */
export const ICON_SIZE: Record<Size, 'icon-sm' | 'icon' | 'icon-lg'> = {
  sm: 'icon-sm',
  md: 'icon',
  lg: 'icon-lg',
  xl: 'icon-lg',
}

const SAMPLE: DemoRow[] = [
  { id: 'button', tag: 'BT', title: 'Button', description: 'One filled button per group', status: 'Governed' },
  { id: 'tabs', tag: 'TB', title: 'Tabs', description: 'Peer views of the same content', status: 'Governed' },
]

export const controls = { size: SIZES, kind: KINDS, interactive: [false, true], rows: [SAMPLE] }

type Values = { size: Size; kind: Kind; interactive: boolean; rows: DemoRow[] }

export function exampleFor({ size, kind, interactive, rows }: Values): Example {
  const xl = size === 'xl'
  const data = rows
    .map(
      (r) =>
        `  { id: '${r.id}', tag: '${r.tag}', title: '${r.title}'${xl ? `, description: '${r.description}'` : ''} },`,
    )
    .join('\n')
  const header = [
    '<ContainedListHeader',
    kind === 'disclosed' ? ' variant="disclosed"' : '',
    size === 'lg' ? '' : ` size="${size}"`,
    ' title="Components" />',
  ].join('')
  const props = [
    '      key={row.id}',
    ...(size === 'lg' ? [] : [`      size="${size}"`]),
    ...(interactive ? ['      interactive'] : []),
    '      leading={<Tag>{row.tag}</Tag>}',
    '      title={row.title}',
    ...(xl ? ['      description={row.description}'] : []),
    '      trailing={',
    `        <Button variant="ghost" size="${ICON_SIZE[size]}" aria-label={\`\${row.title} actions\`}>`,
    '          <KitIcon name="menu-dots" />',
    '        </Button>',
    '      }',
  ]
  return {
    imports: {
      '@/components/ui/button': ['Button'],
      '@/components/ui/contained-list': ['ContainedList', 'ContainedListHeader'],
      '@/components/ui/tag': ['Tag'],
      '@/components/kit-icon': ['KitIcon'],
    },
    module: `const rows = [\n${data}\n]`,
    jsx: `<>\n  ${header}\n  {rows.map((row) => (\n    <ContainedList\n${props.join('\n')}\n    />\n  ))}\n</>`,
  }
}
