import type { TreeNode } from '@/components/ui/tree-view'
import type { Example } from '../example-file'

// Tree view's Code tab. The nodes live here so the page, the preview and the
// printed file read one copy; selection is state, so the file starts on the
// node the preview has selected.

export const SIZES = ['sm', 'xs'] as const
export type Size = (typeof SIZES)[number]

export const NODES: TreeNode[] = [
  {
    id: 'components',
    label: 'components',
    children: [
      {
        id: 'ui',
        label: 'ui',
        children: [
          { id: 'button', label: 'button.tsx' },
          { id: 'tree-view', label: 'tree-view.tsx' },
          {
            id: 'parts',
            label: 'parts',
            children: [{ id: 'field-shell', label: '_field-shell.scss' }],
          },
        ],
      },
      { id: 'kit-icon', label: 'kit-icon.tsx' },
    ],
  },
  { id: 'docs', label: 'docs', children: [{ id: 'readme', label: 'README.md' }] },
  { id: 'package', label: 'package.json' },
]

/** The nodes as source, nested the way a person would write them. */
function printNodes(nodes: TreeNode[], depth: number): string {
  const pad = '  '.repeat(depth)
  return nodes
    .map((n) => {
      const head = `id: '${n.id}', label: '${n.label}'`
      if (!n.children?.length) return `${pad}{ ${head} },`
      return `${pad}{\n${pad}  ${head},\n${pad}  children: [\n${printNodes(n.children, depth + 2)}\n${pad}  ],\n${pad}},`
    })
    .join('\n')
}

export const controls = { size: SIZES, icons: [true, false], selected: ['button', 'readme'] }

export function exampleFor({ size, icons, selected }: { size: Size; icons: boolean; selected: string }): Example {
  const lines = ['  label="Project files"', '  nodes={nodes}']
  if (size !== 'sm') lines.push(`  size="${size}"`)
  if (!icons) lines.push('  icons={false}')
  lines.push('  selected={selected}', '  onSelect={setSelected}', "  defaultExpanded={['components']}")
  return {
    imports: {
      react: ['useState'],
      '@/components/ui/tree-view': ['TreeView', 'type TreeNode'],
    },
    module: `const nodes: TreeNode[] = [\n${printNodes(NODES, 1)}\n]`,
    body: `const [selected, setSelected] = useState('${selected}')`,
    jsx: `<TreeView\n${lines.join('\n')}\n/>`,
  }
}
