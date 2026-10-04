import { Link } from '@/components/ui/link'
import type { ComponentDocConfig } from '../types'
import styles from './link.module.scss'
import { LinkPreview } from './link-preview'

const HREF = '/docs/components'

const standalone = (size: 'sm' | 'md' | 'lg' = 'lg', disabled = false) => (
  <Link href={HREF} size={size} icon="arrow-right" disabled={disabled}>
    View all components
  </Link>
)

const inverse = (disabled = false) => (
  <div className={styles.inverseFill}>
    <Link href={HREF} icon="arrow-right" inverse disabled={disabled}>
      View all components
    </Link>
  </div>
)

export function linkDoc(): ComponentDocConfig {
  return {
    slug: 'link',
    name: 'Link',
    kitTitle: 'Link',
    figmaNode: '50111:991',
    lede: 'Takes the reader somewhere else: another page, a section, a resource. Use it on its own for “View all” and “Learn more”, or inline inside a sentence. For an action that changes something, use a Button.',
    description:
      'Standalone and inline links at three sizes, with an optional trailing glyph and an inverse form. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s first wave. Breadcrumb keeps its own crumbs, the kit’s more specific set.',
    livePreview: <LinkPreview />,
    install: "import { Link } from '@/components/ui/link'",
    anatomy: standalone(),
    anatomyLede:
      'The label in primary, with no underline, and an optional trailing glyph 8 after it. An inline link drops the glyph, takes an underline and the size of the text around it.',
    variantsLede:
      'Size sets the type: Body/2, Body/3 or Caption/1, with a 20px glyph at Large and 16px below. Inline is underlined and sits in running text. Inverse is for the inverse fill.',
    variants: [
      { label: 'Size: Large', node: standalone('lg') },
      { label: 'Size: Medium', node: standalone('md') },
      { label: 'Size: Small', node: standalone('sm') },
      { label: 'Standalone, no icon', node: <Link href={HREF}>View all components</Link> },
      {
        label: 'Inline',
        node: (
          <p className={styles.copyMd}>
            Read about <Link href={HREF} inline>every component</Link> in the gallery.
          </p>
        ),
      },
      { label: 'Inverse', node: inverse() },
    ],
    statesLede:
      'Hover darkens the label to primary-hover. Focus is a 1px ring outside the label; Active keeps the ring and turns the label on-surface. Visited is drawn the same as Enabled. Disabled is primary-disabled-content and is not followed.',
    states: [
      { label: 'Enabled', node: standalone() },
      { label: 'Hover', node: standalone(), className: styles.forceHover },
      { label: 'Focus', node: standalone(), className: styles.forceFocus },
      { label: 'Active', node: standalone(), className: styles.forceActive },
      { label: 'Disabled', node: standalone('lg', true) },
      { label: 'Inverse: Enabled', node: inverse() },
      { label: 'Inverse: Hover', node: inverse(), className: styles.forceHover },
      { label: 'Inverse: Focus', node: inverse(), className: styles.forceFocus },
      { label: 'Inverse: Disabled', node: inverse(true) },
    ],
    dos: [
      'Write the label as the destination: “View all components”, not “Click here”.',
      'Use an inline link inside a sentence, where the underline tells it apart from the copy.',
      'Use the trailing arrow on a standalone link that leads onward, such as “Learn more”.',
      'Use the inverse form on the inverse fill, such as a high-contrast Notification.',
    ],
    donts: [
      'Use a Link for an action that does not navigate. That is a Button.',
      'Put an icon on an inline link.',
      'Rely on colour alone to show a link inside text. Inline links keep their underline.',
      'Restyle Breadcrumb’s crumbs as Links. They are the kit’s own set.',
    ],
    a11y: [
      ['Roles', <>A native <code>a</code> with an <code>href</code>. Disabled drops the <code>href</code> and keeps <code>role=&quot;link&quot;</code> with <code>aria-disabled</code>, so it is announced but not followed or focused.</>],
      ['Keyboard', 'Tab reaches it and Enter follows it, as any anchor.'],
      ['Names', 'The label is the name. The glyph is decorative and hidden from assistive tech.'],
      ['Focus', <>A 1px <code>--graphite-primary-focus</code> ring outside the label, in <code>--graphite-background</code> on the inverse fill.</>],
      ['Contrast', 'Inline links are underlined, so colour is never the only cue.'],
    ],
    parityLede: 'The kit’s Link page has one public set, Link. The code is one component with every axis.',
    parity: [
      ['Size', 'Large · Medium · Small', 'size', 'Body/2 with a 20px glyph, Body/3 and Caption/1 with 16px.'],
      ['State', 'Enabled · Hover · Focus · Active · Visited · Disabled', 'disabled', 'Hover, Focus and Active are pseudo-classes (governance rule 7). Visited is drawn the same as Enabled, so there is no rule for it.'],
      ['Inverse', 'False · True', 'inverse', 'The kit’s inverse/link stops are tones the engine does not stamp: primary-container at rest, background on hover and press.'],
      ['Icon / Swap icon', 'Boolean · instance', 'icon', 'A kit icon name; the kit’s default is fi-rs-arrow-right. The kit keeps the glyph primary in every state; here it follows the label.'],
      ['Inline', 'Boolean', 'inline', 'The kit’s property shows a second, identical label with no underline. The set’s description says inline is underlined, so the code underlines it.'],
    ],
    related: [
      { href: '/docs/components/button', title: 'Button', why: 'for an action rather than a destination' },
      { href: '/docs/components/breadcrumb', title: 'Breadcrumb', why: 'its own link crumbs' },
      { href: '/docs/components/notification', title: 'Notification', why: 'the inverse fill' },
    ],
  }
}
