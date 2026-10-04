import { ContainedList, ContainedListHeader } from '@/components/ui/contained-list'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { KitIcon } from '@/components/kit-icon'
import { readKitPage } from '@/lib/kit-page'
import type { ComponentDocConfig } from '../types'
import styles from './contained-list.module.scss'
import { ContainedListPreview } from './contained-list-preview'
import type { DemoRow } from './contained-list-preview'

type Size = 'sm' | 'md' | 'lg' | 'xl'
const ICON: Record<Size, 'icon-sm' | 'icon' | 'icon-lg'> = { sm: 'icon-sm', md: 'icon', lg: 'icon-lg', xl: 'icon-lg' }

const action = (size: Size) => (
  <Button variant="ghost" size={ICON[size]} aria-label="Row actions">
    <KitIcon name="menu-dots" />
  </Button>
)

const row = (props: { size?: Size; interactive?: boolean; disabled?: boolean; insetDivider?: boolean; description?: boolean } = {}) => (
  <div className={styles.list}>
    <ContainedList
      size={props.size}
      interactive={props.interactive}
      disabled={props.disabled}
      insetDivider={props.insetDivider}
      leading={<KitIcon name="database" />}
      title="Row title"
      description={props.description ? 'Row description' : undefined}
      trailing={action(props.size ?? 'lg')}
    />
  </div>
)

const list = (variant: 'on-page' | 'disclosed', size: Size = 'lg') => (
  <div className={styles.list}>
    <ContainedListHeader
      variant={variant}
      size={size}
      title="Components"
      action={variant === 'on-page' ? action(size === 'xl' ? 'lg' : size) : undefined}
    />
    <ContainedList size={size} leading={<Tag>BT</Tag>} title="Button" trailing={action(size)} />
    <ContainedList size={size} leading={<Tag>TB</Tag>} title="Tabs" trailing={action(size)} />
  </div>
)

export function containedListDoc(): ComponentDocConfig {
  const kit = readKitPage('Contained list')

  const rows: DemoRow[] = [
    { id: 'button', tag: 'BT', title: 'Button', description: 'One primary action per group', status: 'Governed' },
    { id: 'tabs', tag: 'TB', title: 'Tabs', description: 'Peer views of the same content', status: 'Governed' },
    { id: 'tag', tag: 'TG', title: 'Tag', description: 'A short label or count', status: 'Governed' },
  ]

  return {
    slug: 'contained-list',
    name: 'Contained list',
    kitTitle: 'Contained list',
    figmaNode: '16193:272726',
    lede: 'A row of a list, and the title bar that heads the list: a title, room for a marker before it and a control after it, at one of four heights. Use it for a flat list a reader scans; when the rows share columns worth comparing, use Data table.',
    description:
      'A list row and its header, at four sizes, with leading, title, cells and trailing slots. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'The row primitive Data table composes from. Its leading slot held an Avatar until #97 replaced it with a Tag.',
    livePreview: <ContainedListPreview rows={rows} />,
    install: "import { ContainedList } from '@/components/ui/contained-list'",
    anatomy: list('on-page'),
    anatomyLede:
      'The header above, then rows: a 16-inset cell with the marker and the title, any further cells, and the trailing control flush to the right edge at the row’s height. A 1px rule sits under each row. Only the title is required, and it stays on one line and truncates.',
    variantsLede:
      'Size sets the row’s height: 32, 40, 48 or 64, with Extra large setting its content at the top, where the code’s description line fits. The list’s Type is its header: On page or Disclosed. Item 2 and 3 are further cells; Inset stops the divider 16 short of each end.',
    variants: [
      { label: 'Type: On page', node: list('on-page') },
      { label: 'Type: Disclosed', node: list('disclosed') },
      {
        label: 'Filterable search',
        node: (
          <div className={styles.list}>
            <ContainedListHeader title="Components" search={{ label: 'Search components', placeholder: 'Search components' }} />
            <ContainedList leading={<Tag>BT</Tag>} title="Button" trailing={action('lg')} />
            <ContainedList leading={<Tag>TB</Tag>} title="Tabs" trailing={action('lg')} />
          </div>
        ),
      },
      { label: 'Size: Small', node: row({ size: 'sm' }) },
      { label: 'Size: Medium', node: row({ size: 'md' }) },
      { label: 'Size: Large', node: row({ size: 'lg' }) },
      { label: 'Size: Extra large', node: row({ size: 'xl', description: true }) },
      {
        label: 'Item 2 and 3',
        node: (
          <div className={styles.list}>
            <ContainedList title="Button" cells={['Governed', '2.5.0']} trailing={action('lg')} />
          </div>
        ),
      },
      { label: 'Divider: Inset', node: row({ insetDivider: true }) },
    ],
    statesLede:
      'Hover climbs one rung of the elevation ladder and active two, the same tone-step move as Button’s hover; the divider steps aside while they show. Focus is a ring inside the row, drawn when the caller’s link round it takes focus. Disabled dims the text and marker.',
    states: [
      { label: 'Enabled', node: row({ interactive: true }) },
      { label: 'Hover', node: row({ interactive: true }), className: styles.forceHover },
      { label: 'Active', node: row({ interactive: true }), className: styles.forceActive },
      { label: 'Focus', node: row({ interactive: true }), className: styles.forceFocus },
      { label: 'Disabled', node: row({ disabled: true }) },
    ],
    dos: [
      'Put a Tag, an icon or a short code in the leading slot. It is a marker, not a second title.',
      'Keep the trailing slot to one control cluster: a ghost icon Button at the row’s size, a Tag, or a Menu.',
      'Set interactive only when clicking the row really does something, and supply that something: wrap the row in a link, or put the Button in the trailing slot.',
      'Build list views and table rows from this row, so a hover change lands everywhere at once.',
    ],
    donts: [
      'Stack two or three buttons in the trailing slot. When a row needs several actions, put a Menu there instead.',
      'Rely on the description to carry something essential. It is the code’s own, truncates to one line, and the kit does not draw it.',
      'Set interactive on a row that only displays information. The hover tells the reader it will respond.',
      'Give a list its own row highlight. Hover and active are the elevation ladder’s rungs, so every list moves together.',
    ],
    a11y: [
      ['Roles', 'The row is a plain container with no role. Wrap the rows in a list element, or a table, when the structure matters to the reader.'],
      ['Keyboard', 'The row itself is never focusable, even when interactive: the prop is visual only. Keyboard access comes from the link that wraps the row or the control in its trailing slot.'],
      ['Focus', 'A link wrapped round the row draws a 2px primary-focus ring inside it when it takes focus. The trailing control brings its own ring.'],
      ['Disabled', <>disabled dims the row and stops its hover, and sets <code>aria-disabled</code>; disable the link or control the row holds as well, since the row has none of its own.</>],
      ['Header', 'The header renders a real heading, h3 unless you pass another level, so the list sits in the page’s outline.'],
      ['Contrast', 'Title is on-surface and description on-surface-variant, one tone step lower. Both are measured against surface at the theme’s target.'],
      ['Truncation', 'Title and description clip with an ellipsis. The full text is still in the DOM, so assistive tech reads all of it.'],
    ],
    parityLede: `The kit's Contained list page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets. One is public; the rest are the private row, cell and title items it is built from. The code is the row and the header, on every axis.`,
    parity: [
      ['Type', 'On page · Disclosed', 'ContainedListHeader variant', 'The kit’s title item: Title/5 SemiBold on background at the rows’ height, or a 32px Caption/1 bar on elevation-01. One action at its right edge.'],
      ['Search · Filterable search', 'Boolean', 'ContainedListHeader search', 'The governed Search, expandable, sized to the bar. Filtering the rows is the caller’s.'],
      ['Size', 'Small · Medium · Large · Extra large', 'size', 'sm, md, lg and xl: 32, 40, 48 and 64. Extra large sets its content at the top.'],
      ['State', 'Enabled · Hover · Focus · Active · Disabled', 'interactive · disabled', 'Hover and Active are pseudo-classes on an interactive row (governance rule 7): elevation-02 and -03. Focus is the ring a wrapping link draws. Disabled dims text and marker; the kit keeps the icon bright, a slip.'],
      ['Item 2 · Item 3', 'Booleans', 'cells', 'Further text cells, each inset 16.'],
      ['Divider: Inset', 'True · False', 'insetDivider', 'The rule stops 16 short of each end.'],
      ['Description', 'Not drawn', 'description', 'The code’s own, at Caption/1. Extra large is laid out for a second line it never draws.'],
      ['Fill', 'Raw #ffffff', '—', 'An un-migrated Carbon value. surface, which reads the same in Light.'],
    ],
    related: [
      { href: '/docs/components/data-table', title: 'Data table', why: 'the same row, at scale' },
      { href: '/docs/components/menu', title: 'Menu', why: 'the trailing slot, when a row needs several actions' },
      { href: '/docs/components/tag', title: 'Tag', why: 'the leading marker' },
      { href: '/docs/components/accordion', title: 'Accordion', why: 'when each row hides its detail' },
    ],
  }
}
