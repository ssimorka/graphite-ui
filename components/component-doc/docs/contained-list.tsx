import { ContainedList } from '@/components/ui/contained-list'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { readKitPage } from '@/lib/kit-page'
import type { ComponentDocConfig } from '../types'
import styles from './contained-list.module.scss'
import { ContainedListPreview } from './contained-list-preview'
import type { DemoRow } from './contained-list-preview'

const row = (props: { density?: 'compact' | 'default'; interactive?: boolean }) => (
  <div className={styles.list}>
    <ContainedList
      density={props.density}
      interactive={props.interactive}
      leading={<Tag>TK</Tag>}
      title="Row title"
      description="Row description"
    />
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
    lede: 'One row of a list: a title, an optional description, and room for a marker before it and a control after it. Use it for a flat list a reader scans; when the rows share columns worth comparing, use Data table.',
    description:
      'One row of a list, with leading, title, description and trailing slots. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'The row primitive Data table composes from. Its leading slot held an Avatar until #97 replaced it with a Tag.',
    livePreview: <ContainedListPreview rows={rows} />,
    install: "import { ContainedList } from '@/components/ui/contained-list'",
    anatomy: (
      <div className={styles.list}>
        <ContainedList
          leading={<Tag>TK</Tag>}
          title="Title"
          description="Description, one line, truncated when it runs long"
          trailing={<Button size="sm">Action</Button>}
        />
      </div>
    ),
    anatomyLede:
      'Four slots, of which only the title is required. Title and description each stay on one line and truncate, so a row never grows taller than its density allows.',
    variantsLede:
      'Density sets the row’s padding from the density steps; the height follows the content. Interactive is the other prop, and it only changes the hover, so it appears under States.',
    variants: [
      { label: 'Density: Default', node: row({ density: 'default' }) },
      { label: 'Density: Compact', node: row({ density: 'compact' }) },
    ],
    statesLede:
      'A row has one state change, and only when it is interactive: hover shifts surface to surface-variant, one tone step. Data table reuses exactly this shift for its rows.',
    states: [
      { label: 'Enabled', node: row({ interactive: true }) },
      { label: 'Hover', node: row({ interactive: true }), className: styles.forceHover },
    ],
    dos: [
      'Put a Tag, an icon or a short code in the leading slot. It is a marker, not a second title.',
      'Keep the trailing slot to one control cluster: a Tag, one Button, or a Menu.',
      'Set interactive only when clicking the row really does something, and supply that something: wrap the row in a link, or put the Button in the trailing slot.',
      'Build list views and table rows from this row, so a hover change lands everywhere at once.',
    ],
    donts: [
      'Stack two or three buttons in the trailing slot. When a row needs several actions, put a Menu there instead.',
      'Rely on the description to carry something essential. It truncates to one line.',
      'Set interactive on a row that only displays information. The hover tells the reader it will respond.',
      'Give a list its own row highlight. The hover is surface-variant, shared with Data table, so they cannot drift.',
    ],
    a11y: [
      ['Roles', 'The row is a plain container with no role. Wrap the rows in a list element, or a table, when the structure matters to the reader.'],
      ['Keyboard', 'The row itself is never focusable, even when interactive: the prop is visual only. Keyboard access comes from the link that wraps the row or the control in its trailing slot.'],
      ['Focus', 'Focus belongs to the caller’s link or the control in the trailing slot, which brings its own ring.'],
      ['Contrast', 'Title is on-surface and description on-surface-variant, one tone step lower. Both are measured against surface at the theme’s target.'],
      ['Truncation', 'Title and description clip with an ellipsis. The full text is still in the DOM, so assistive tech reads all of it.'],
    ],
    parityLede: `The kit's Contained list page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets. One is public; the rest are the private row, cell and title items it is built from. The code is the row alone and exposes two props, density and interactive.`,
    parity: [
      ['Type', 'On page · Disclosed', '—', 'Where the list’s title bar sits. The code is the row; the list and its heading are the caller’s.'],
      ['Size', 'Small · Medium · Large · Extra large', 'density', 'Drawn on the row item as four heights. The code has two density steps of padding and lets the content set the height.'],
      ['State', 'Enabled → Disabled', 'interactive', 'Hover is interactive plus :hover (governance rule 7). Focus, Active and Disabled have no counterpart, because the row is not itself a control.'],
      ['Slot', 'Leading · Title · Description · Trailing', 'leading · title · description · trailing', 'One prop per slot. The caller passes each slot’s content.'],
    ],
    related: [
      { href: '/docs/components/data-table', title: 'Data table', why: 'the same row, at scale' },
      { href: '/docs/components/menu', title: 'Menu', why: 'the trailing slot, when a row needs several actions' },
      { href: '/docs/components/tag', title: 'Tag', why: 'the leading marker' },
      { href: '/docs/components/accordion', title: 'Accordion', why: 'when each row hides its detail' },
    ],
  }
}
