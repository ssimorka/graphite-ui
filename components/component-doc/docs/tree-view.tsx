import { TreeView } from '@/components/ui/tree-view'
import type { TreeNode } from '@/components/ui/tree-view'
import { readKitPage } from '@/lib/kit-page'
import type { ComponentDocConfig } from '../types'
import styles from './tree-view.module.scss'
import { TreeViewPreview } from './tree-view-preview'

// Four levels, as the kit's own Tree view draws: a branch at each depth and a
// leaf under each.
const NODES: TreeNode[] = [
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

// One short tree for the static sections: a branch open on a leaf.
const tree = (
  props: { size?: 'sm' | 'xs'; icons?: boolean; selected?: string; disabled?: boolean } = {},
) => (
  <div className={styles.tree}>
    <TreeView
      label="Example tree"
      size={props.size}
      icons={props.icons}
      selected={props.selected}
      defaultExpanded={['ui']}
      nodes={[
        {
          id: 'ui',
          label: 'ui',
          children: [
            { id: 'button', label: 'button.tsx', disabled: props.disabled },
            { id: 'tag', label: 'tag.tsx' },
          ],
        },
      ]}
    />
  </div>
)

export function treeViewDoc(): ComponentDocConfig {
  const kit = readKitPage('Tree view')

  return {
    slug: 'tree-view',
    name: 'Tree view',
    kitTitle: 'Tree view',
    figmaNode: '11948:286738',
    lede: 'A hierarchy a reader opens a level at a time: branches that open and close, and leaves under them. Use it for nested navigation, like this site’s sidebar, or a file tree; when the list is one level deep, a Contained list is enough.',
    description:
      'A navigable tree of branches and leaves at two sizes, with or without icons. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Came off rule 6’s application shells on 2026-10-04: the kit draws it as a primitive, and this site’s docs sidebar is one.',
    livePreview: <TreeViewPreview nodes={NODES} />,
    install: "import { TreeView, type TreeNode } from '@/components/ui/tree-view'",
    anatomy: tree({ selected: 'button' }),
    anatomyLede:
      'Rows of one height. Each starts at its level’s indent, then the caret on a branch, the icon, and the node text, 8 apart and 16 clear of the right edge. The selected row takes primary-container and a 4px primary bar at the left.',
    variantsLede:
      'Size sets the row’s height, 32 or 24, with the text at Body/3 in both. Icons adds the kit’s folder and document and widens the indent step from 16 to 24, as the kit’s spacers do.',
    variants: [
      { label: 'Size: Small', node: tree({ size: 'sm' }) },
      { label: 'Size: Extra small', node: tree({ size: 'xs' }) },
      { label: 'Icon: True', node: tree({ icons: true }) },
      { label: 'Icon: False', node: tree({ icons: false }) },
    ],
    statesLede:
      'Hover climbs one rung of the elevation ladder and pressing two, and the text and glyphs step from on-surface-variant to on-surface. Focus is a ring inside the row. A selected row keeps its fill on hover: the kit’s Selected + Hover step is one the engine does not generate.',
    states: [
      { label: 'Enabled', node: tree() },
      { label: 'Hover', node: tree(), className: styles.forceHover },
      { label: 'Active', node: tree(), className: styles.forceActive },
      { label: 'Focus', node: tree(), className: styles.forceFocus },
      { label: 'Selected', node: tree({ selected: 'button' }) },
      { label: 'Disabled', node: tree({ disabled: true }) },
    ],
    dos: [
      'Use it where the content really nests, and let the reader open only what they need.',
      'Pass the current page as selected in navigation, so its branch opens and the reader sees where they are.',
      'Give each node an href when it is a page, so it behaves as a link: middle-click, copy link and history all work.',
      'Name the tree with label. A screen reader announces it before the first node.',
    ],
    donts: [
      'Use it for a flat list. One level is a Contained list, or Navigation Menu for a site header.',
      'Put buttons or controls inside a node. The tree takes one tab stop and the arrow keys; a second focus target inside it breaks both.',
      'Rely on indent alone to show the levels. The tree announces them, but a reader skimming needs the carets too.',
      'Open every branch at once. A tree that shows everything is a long list with extra indentation.',
    ],
    a11y: [
      ['Roles', <>The ARIA tree: a <code>tree</code> named by label, <code>treeitem</code>s with <code>aria-level</code>, <code>aria-expanded</code> on a branch and a <code>group</code> for its children. A link node is the treeitem itself, and the current page carries <code>aria-current</code>.</>],
      ['Keyboard', 'One tab stop. Arrow Down and Up move between the nodes that are showing; Right opens a branch or steps into it; Left closes it or steps out to the parent; Home and End go to the ends; Enter and Space activate; a typed letter jumps to the next node that starts with it.'],
      ['Focus', 'A 2px ring inside the row, through primary’s focus step. The tab stop follows the last node focused, else the selected one, else the first.'],
      ['Selection', <>The selected node carries <code>aria-selected</code>. Its ancestors open, so it is always reachable.</>],
      ['Disabled', <>A disabled node dims, carries <code>aria-disabled</code>, and stays reachable by the arrow keys so it is announced, but does not activate.</>],
      ['Contrast', 'Text at rest is on-surface-variant on elevation-01, and on-surface on the hover, press and selected fills; each pair is measured at the theme’s target.'],
    ],
    parityLede: `The kit's Tree view page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets: Tree view and Branch node item, which are public, and the private Branch and Leaf spacers the rows indent with.`,
    parity: [
      ['Node', 'Branch · Leaf', 'children', 'A node with children is a Branch, with the caret; without, a Leaf.'],
      ['Size', 'Small · Extra small', 'size', 'sm and xs: 32 and 24.'],
      ['Icon', 'True · False', 'icons', 'The folder and the document, and the indent step: 24 with icons, 16 without.'],
      ['Open', 'False · True', 'defaultExpanded, then the reader', 'caret-right turns to caret-down. The selected node’s ancestors open.'],
      ['State', 'Enabled · Hover · Focus · Active · Disabled', 'disabled', 'Hover, Focus and Active are pseudo-classes (governance rule 7): elevation-02 and -03, and the inset ring.'],
      ['Selected', 'False · True', 'selected', 'primary-container and a 4px primary bar inside the left edge.'],
      ['State', 'Selected + Hover', '—', 'The kit fills state/primary-container-hover, which the engine does not generate. A selected row ignores hover, as Data table’s do.'],
      ['Show Badge indicator', 'Boolean', '—', 'Defined on the set, but no layer in any variant uses it. Nothing to build.'],
      ['Levels', 'Level 1 to 4', 'any depth', 'The kit’s spacers stop at four; the code keeps the same step past them.'],
    ],
    related: [
      { href: '/docs/components/navigation-menu', title: 'Navigation menu', why: 'the flat case, for a site header' },
      { href: '/docs/components/contained-list', title: 'Contained list', why: 'when the list is one level deep' },
      { href: '/docs/components/accordion', title: 'Accordion', why: 'when each level hides content, not more nodes' },
    ],
  }
}
