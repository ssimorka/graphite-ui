import { Tag } from '@/components/ui/tag'
import { readContractDoc } from '@/lib/contract-doc'
import { readKitPage } from '@/lib/kit-page'
import type { ComponentDocConfig } from '../types'
import { TagPreview } from './tag-preview'

export function tagDoc(): ComponentDocConfig {
  const kit = readKitPage('Tag')
  const props = readContractDoc('tag').props.length

  return {
    slug: 'tag',
    name: 'Tag',
    kitTitle: 'Tag',
    figmaNode: '16031:269750',
    lede: 'A short, read-only label for a status, a category or a count. If clicking it should do something, it is a Button, and if the status needs a sentence, it is a Notification.',
    description:
      'A short, read-only label for a status, a category or a count. Anatomy, variants, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Every colour is a container role, so a tag never reads as heavy as a filled Button. Used for status across the site’s example cards.',
    livePreview: <TagPreview />,
    install: "import { Tag } from '@/components/ui/tag'",
    anatomy: <Tag variant="primary">Label</Tag>,
    anatomyLede:
      'One slot: a short string or a number. The pill shape comes from the full radius, so the ends stay round at any label length.',
    variantsLede:
      'Five variants, each a container role and its matching on-container label. Neutral is the default. A number over the cap shows as 99+.',
    variants: [
      { label: 'Variant: Neutral (default)', node: <Tag>Draft</Tag> },
      { label: 'Variant: Primary', node: <Tag variant="primary">New</Tag> },
      { label: 'Variant: Danger', node: <Tag variant="danger">Failed</Tag> },
      { label: 'Variant: Warning', node: <Tag variant="warning">Expiring</Tag> },
      { label: 'Variant: Success', node: <Tag variant="success">Paid</Tag> },
      { label: 'Count over max (128)', node: <Tag variant="primary">{128}</Tag> },
    ],
    dos: [
      'Keep the label to a word or two. A tag names a state, it does not explain it.',
      'Say the status in the label text. "Failed" on danger reads without the colour; a red dot does not.',
      'Pass a count as a number, not a string, so it caps at 99+ instead of widening the row.',
      'Use neutral for categories that carry no status, so the status colours keep their meaning.',
    ],
    donts: [
      'Make a tag clickable. It has no hover, focus or pressed state, because it is not a control.',
      'Pick a variant for its hue. With a red source colour, primary and danger look nearly the same.',
      'Reach for warning casually. It is the one variant the kit does not vouch for.',
      'Set a colour by hand for a status the variants do not cover. Use a generated role or use neutral.',
    ],
    a11y: [
      ['Roles', 'A plain span with no role, read inline as text. There is nothing to operate, so it takes no tab stop.'],
      ['Colour', 'The variant colour is a second signal, never the only one. A source colour near a status hue collapses primary and danger, so the label text has to carry the meaning.'],
      ['Counts', 'When a count is capped, the full number goes into aria-label. A span with no role is not reliably named by every screen reader, so where the exact figure matters, state it in text as well.'],
      ['Contrast', 'Each variant pairs a container role with its own on-container role, and those pairs are measured at the theme’s target, AA or AAA.'],
    ],
    parityLede: `The kit's Tag page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets, one of them a private close button. The code exposes ${props} prop. This table is where those two facts are reconciled instead of quietly diverging.`,
    parity: [
      ['Color', 'Blue · Teal · Green · Purple · Red · Gray · High contrast · Outline', 'variant', 'From Tag - Read-only. Gray is neutral, Purple is primary, Red is danger, Green is success. Blue, Teal, High contrast and Outline have no counterpart. Warning has no kit colour.'],
      ['Size', 'Small · Medium · Large', '—', 'One size in code, 24px high, which is the kit’s Medium.'],
      ['State', 'Enabled · Disabled · Skeleton', '—', 'No counterpart. A read-only label has nothing to disable and nothing loads into it.'],
      ['Tag - Operational', 'Enabled · Hover · Focus · Disabled · Skeleton', '—', 'Not implemented. Tag is read-only in code, so these interactive states have nowhere to land.'],
      ['Tag - Selectable', 'Selected: False · True', '—', 'Not implemented. Tag has no selected state and no way to toggle one.'],
    ],
    related: [
      { href: '/docs/components/button', title: 'Button', why: 'when clicking should do something' },
      { href: '/docs/components/notification', title: 'Notification', why: 'when the status needs a sentence' },
      { href: '/docs/components/contained-list', title: 'Contained list', why: 'takes a tag in its leading or trailing slot' },
      { href: '/docs/components/data-table', title: 'Data table', why: 'status in a row' },
    ],
  }
}
