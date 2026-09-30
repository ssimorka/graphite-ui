import { Breadcrumb } from '@/components/ui/breadcrumb'
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
      'There is no kind or size to pick: the separator is defined once for every trail. What changes is length, and past maxItems (4 by default) the middle collapses behind an ellipsis button rather than wrapping onto a second line. Pressing it expands the trail in place.',
    variants: [
      { label: 'Three crumbs', node: three },
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
      'Hover and Focus are forced here with the declarations their pseudo-classes carry: an underline, and the --graphite-focus ring the other components use.',
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
      'Set maxItems so low that the reader has to expand the trail to find the parent they need. The ellipsis reaches the hidden crumbs, but it is an extra step.',
    ],
    a11y: [
      ['Landmark', 'A nav landmark labelled “Breadcrumb”, with the crumbs in an ordered list, so a screen reader announces how many there are and where each sits.'],
      ['Current page', 'The last crumb carries aria-current="page" and is plain text, not a link, so it is announced as the current page and is not in the tab order.'],
      ['Separators', 'The slashes are aria-hidden. A screen reader hears the list, not the punctuation.'],
      ['Collapse', 'The ellipsis is a button named for what it hides, such as “Show 3 more breadcrumbs”. Enter or Space expands the trail in place and moves focus to the first crumb it revealed.'],
      ['Focus', <>Links and the ellipsis button draw the <code>--graphite-focus</code> ring on keyboard focus, the same ring the other components use.</>],
    ],
    parityLede:
      'The kit’s Breadcrumb set has a single variant and no variant axes: it is a leading icon and a row of item instances. The item’s own states live in a private build block, so this table maps the set’s structure instead.',
    parity: [
      ['Items', '4 shown · 8 in the set', 'items', 'The kit hides the extra instances; the code takes any number and collapses past maxItems.'],
      ['Icon', 'Leading icon', '—', 'No counterpart. The trail starts with its first crumb.'],
      ['Overflow', 'An item that opens a menu', 'maxItems', 'The code’s ellipsis is a button that expands the trail in place. The kit’s overflow item opens a menu of the hidden crumbs instead; matching it is open work.'],
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
