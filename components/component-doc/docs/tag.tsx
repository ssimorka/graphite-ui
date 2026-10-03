import { Tag } from '@/components/ui/tag'
import { KitIcon } from '@/components/kit-icon'
import { TagForms } from './tag-forms'
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
    lede: 'A short label for a status, a category or a count. It can be read-only, dismissible, selectable or operational, as the kit draws it. If the status needs a sentence, it is a Notification.',
    description:
      'A short, read-only label for a status, a category or a count. Anatomy, variants, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Every colour is a container role, so a tag never reads as heavy as a filled Button. Used for status across the site’s example cards.',
    livePreview: <TagPreview />,
    install: "import { Tag, SelectableTag, OperationalTag } from '@/components/ui/tag'",
    anatomy: <Tag variant="primary">Label</Tag>,
    anatomyLede:
      'One slot: a short string or a number. The pill shape comes from the full radius, so the ends stay round at any label length.',
    variantsLede:
      'The kit’s eight Read-only colours plus warning, three sizes, an optional leading icon and a dismiss button, and the kit’s two interactive forms: selectable and operational. Neutral and Medium are the defaults. A number over max (99 by default) shows as 99+.',
    variants: [
      { label: 'Variant: Neutral (default)', node: <Tag>Draft</Tag> },
      { label: 'Variant: Primary', node: <Tag variant="primary">New</Tag> },
      { label: 'Variant: Secondary', node: <Tag variant="secondary">Design</Tag> },
      { label: 'Variant: Info', node: <Tag variant="info">Beta</Tag> },
      { label: 'Variant: Success', node: <Tag variant="success">Paid</Tag> },
      { label: 'Variant: Danger', node: <Tag variant="danger">Failed</Tag> },
      { label: 'Variant: Warning', node: <Tag variant="warning">Expiring</Tag> },
      { label: 'Variant: High contrast', node: <Tag variant="high-contrast">Pinned</Tag> },
      { label: 'Variant: Outline', node: <Tag variant="outline">Archived</Tag> },
      { label: 'Size: Small · Medium · Large', node: <TagForms show="sizes" /> },
      { label: 'With a leading icon', node: <Tag variant="primary" icon={<KitIcon name="check" size={16} />}>Verified</Tag> },
      { label: 'Dismissible', node: <TagForms show="dismissible" /> },
      { label: 'Disabled', node: <Tag variant="primary" disabled>Paused</Tag> },
      { label: 'Selectable', node: <TagForms show="selectable" /> },
      { label: 'Operational', node: <TagForms show="operational" /> },
      { label: 'Count over max (128)', node: <Tag variant="primary">{128}</Tag> },
    ],
    dos: [
      'Keep the label to a word or two. A tag names a state, it does not explain it.',
      'Say the status in the label text. "Failed" on danger reads without the colour; a red dot does not.',
      'Pass a count as a number, not a string, so it caps at 99+ instead of widening the row.',
      'Use neutral for categories that carry no status, so the status colours keep their meaning.',
    ],
    donts: [
      'Wrap a read-only tag in a link or click handler. A tag that does something is the operational form, which is a real button with a focus ring.',
      'Pick a variant for its hue. With a red source colour, primary and danger look nearly the same.',
      'Reach for warning casually. It is the one variant the kit does not vouch for.',
      'Set a colour by hand for a status the variants do not cover. Use a generated role or use neutral.',
    ],
    a11y: [
      ['Roles', 'A read-only tag is a plain span, read inline as text, with no tab stop. The selectable form is a toggle button carrying aria-pressed; the operational form is a button; the dismiss control is a button named “Remove” and the label.'],
      ['Focus', 'The interactive forms draw the kit’s Tag focus: a 2px primary ring 1px outside the pill, and a 1px primary ring inside the close button.'],
      ['Colour', 'The variant colour is a second signal, never the only one. A source colour near a status hue collapses primary and danger, so the label text has to carry the meaning.'],
      ['Counts', 'When a count is capped, the visible 99+ is aria-hidden and the full number is rendered as visually hidden text, so every screen reader reads the exact figure.'],
      ['Contrast', 'Each variant pairs a container role with its own on-container role, and those pairs are measured at the theme’s target, AA or AAA.'],
    ],
    parityLede: `The kit's Tag page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets, one of them a private close button. The code exposes ${props} ${props === 1 ? 'prop' : 'props'}. This table is where those two facts are reconciled instead of quietly diverging.`,
    parity: [
      ['Color', 'Blue · Teal · Green · Purple · Red · Gray · High contrast · Outline', 'variant', 'All eight: Gray is neutral, Purple primary, Teal secondary, Blue info, Green success, Red danger, plus high-contrast and outline. Warning has no kit colour.'],
      ['Size', 'Small · Medium · Large', 'size', 'One to one: 18, 24 and 32px, the label 12/16 Regular at every size, inset 8 (12 at Large).'],
      ['Icon · Dismissible', 'Booleans', 'icon · onDismiss', 'The leading 16px icon and the trailing close button, as the kit stacks them.'],
      ['State', 'Enabled · Disabled · Skeleton', 'disabled', 'Disabled is a prop. Skeleton has no counterpart: nothing loads into a tag.'],
      ['Tag - Selectable', 'Selected: False · True', 'SelectableTag', 'A toggle with aria-pressed. Hover is drawn identical to rest in the kit and is left that way.'],
      ['Tag - Operational', 'Enabled · Hover · Focus · Disabled · Skeleton', 'OperationalTag', 'A button. The kit fills on hover only for Purple and Red; the other four are drawn identical to rest and left that way. The kit binds Purple’s hover label to the disabled tone, a slip; the code uses on-primary.'],
    ],
    related: [
      { href: '/docs/components/button', title: 'Button', why: 'when clicking should do something' },
      { href: '/docs/components/notification', title: 'Notification', why: 'when the status needs a sentence' },
      { href: '/docs/components/contained-list', title: 'Contained list', why: 'takes a tag in its leading or trailing slot' },
      { href: '/docs/components/data-table', title: 'Data table', why: 'status in a row' },
    ],
  }
}
