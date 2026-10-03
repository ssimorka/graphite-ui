import { Breadcrumb } from '@/components/ui/breadcrumb'
import { KitIcon } from '@/components/kit-icon'
import type { ComponentDocConfig } from '../types'
import shared from '../component-doc.module.scss'
import styles from './breadcrumb.module.scss'
import { BreadcrumbPreview } from './breadcrumb-preview'

const three = (
  <Breadcrumb
    items={[
      { label: 'Projects', href: '#' },
      { label: 'Graphite', href: '#' },
      { label: 'Settings' },
    ]}
  />
)

export function breadcrumbDoc(): ComponentDocConfig {
  return {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    kitTitle: 'Breadcrumb',
    figmaNode: '11479:54258',
    lede: 'A trail of links from the top of a hierarchy down to the current page. Use it where pages nest at least two levels deep; on a flat site it only repeats the navigation.',
    description:
      'A trail of links to the current page, with a fixed separator and a collapsing middle. Anatomy, length, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'It heads every docs page, this one included: Docs, Components, then the page you are on.',
    livePreview: <BreadcrumbPreview />,
    install:
      "import { Breadcrumb } from '@/components/ui/breadcrumb'\nimport type { Crumb } from '@/components/ui/breadcrumb'",
    anatomy: (
      <span className={styles.trail}>
        <span className={`${shared.marker} ${styles.markList}`} aria-hidden="true">1</span>
        <span className={`${shared.marker} ${styles.markCurrent}`} aria-hidden="true">2</span>
        {three}
      </span>
    ),
    variantsLede:
      'There is no kind or size to pick: the separator is defined once for every trail. What changes is length, and past maxItems (4 by default) the middle collapses behind the kit’s overflow button rather than wrapping onto a second line. Pressing it opens a menu of the hidden crumbs. The kit’s optional leading icon is the icon prop.',
    variants: [
      { label: 'Three crumbs', node: three },
      {
        label: 'With the kit’s leading icon',
        node: (
          <Breadcrumb
            icon={<KitIcon name="bread-slice" size={16} />}
            items={[
              { label: 'Home', href: '#' },
              { label: 'Projects', href: '#' },
              { label: 'Graphite' },
            ]}
          />
        ),
      },
      {
        label: 'Six crumbs, collapsed at maxItems 4',
        node: (
          <Breadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Projects', href: '#' },
              { label: 'Graphite', href: '#' },
              { label: 'Settings', href: '#' },
              { label: 'Members', href: '#' },
              { label: 'Invitations' },
            ]}
          />
        ),
      },
    ],
    statesLede:
      'Hover and Focus are forced here with the declarations their pseudo-classes carry: primary’s hover step, and the kit’s 1px focus ring outside the label.',
    states: [
      { label: 'Enabled', node: three },
      { label: 'Hover', node: three, className: styles.forceHover },
      { label: 'Focus', node: three, className: styles.forceFocus },
      { label: 'Current only', node: <Breadcrumb items={[{ label: 'Home' }]} /> },
    ],
    dos: [
      'Mirror where the page lives in the hierarchy, not the path the reader took to get there.',
      'Use each page’s own title for its crumb, shortened if you must, so the trail and the headings agree.',
      'Set maxItems for the narrowest layout the trail appears in, since it never wraps.',
      'Keep the trail near the top of the page, above the title it ends on.',
    ],
    donts: [
      'Link the last crumb. Any href on it is ignored, because it stands for “here”, not somewhere to go.',
      'Let a long trail wrap onto a second line. Collapse the middle with maxItems instead.',
      'Style a separator per instance. It is defined once so that every trail in the product reads the same.',
      'Set maxItems so low that the reader has to open the overflow menu to find the parent they need. It reaches the hidden crumbs, but it is an extra step.',
    ],
    a11y: [
      ['Landmark', 'A nav landmark labelled “Breadcrumb”, with the crumbs in an ordered list, so a screen reader announces how many there are and where each sits.'],
      ['Current page', 'The last crumb carries aria-current="page" and is plain text, not a link, so it is announced as the current page and is not in the tab order.'],
      ['Separators', 'The slashes are aria-hidden. A screen reader hears the list, not the punctuation.'],
      ['Collapse', 'The overflow is a menu button named for what it hides, such as “Show 3 more breadcrumbs”. Enter, Space or the arrow keys open a menu of the hidden crumbs; selecting one goes there, and Escape closes it and returns focus to the button.'],
      ['Focus', <>Links and the overflow button draw the kit’s 1px <code>--graphite-focus</code> ring outside the label on keyboard focus.</>],
    ],
    parityLede:
      'The kit’s Breadcrumb set has a single variant and no variant axes: it is a leading icon and a row of item instances. The item’s own states live in a private build block, so this table maps the set’s structure instead.',
    parity: [
      ['Items', '4 shown · 8 in the set', 'items', 'The kit hides the extra instances; the code takes any number and collapses past maxItems.'],
      ['Icon', 'Show Icon', 'icon', 'The kit’s optional leading glyph, 16px and on-surface, 8px before the first crumb. The kit draws fi-rs-bread-slice; any icon can be passed.'],
      ['Overflow', 'An item that opens a menu', 'maxItems', 'One to one: the kit’s 12px menu-dots button, on the baseline, opening a Menu of the hidden crumbs.'],
      ['Underline', 'Every link state, and Current', '—', 'Links are underlined at rest, as the item set draws them. The kit also underlines the current page, which would make “here” look clickable, so the code leaves it plain and records the slip.'],
      ['Current', 'Last item', 'the last of items', 'Not a prop. The last crumb is always current, so the choice cannot be made wrong.'],
    ],
    related: [
      { href: '/docs/components/navigation-menu', title: 'Navigation Menu', why: 'the way around, not the way up' },
      { href: '/docs/components/tabs', title: 'Tabs', why: 'views inside one page' },
      { href: '/docs/components/menu', title: 'Menu', why: 'what an overflow opens in the kit' },
      { href: '/docs/components/typography', title: 'Typography', why: 'the page title the trail ends on' },
    ],
  }
}
