import { NavigationMenu } from '@/components/ui/navigation-menu'
import type { ComponentDocConfig } from '../types'
import styles from './navigation-menu.module.scss'
import { NavigationMenuPreview } from './navigation-menu-preview'

const row = (props: { current?: boolean }) => (
  <NavigationMenu
    label="State example"
    items={[
      { label: 'Overview', href: '#', current: props.current },
      { label: 'Foundations', href: '#' },
      { label: 'Components', href: '#' },
    ]}
  />
)

export function navigationMenuDoc(): ComponentDocConfig {
  return {
    slug: 'navigation-menu',
    name: 'Navigation Menu',
    kitTitle: null,
    lede: 'A list of links to a site’s sections, laid out in a row or a column, with at most one nested level. It is the list only: a header bar, an action rail or a collapsible side panel around it is site chrome.',
    description:
      'A horizontal or vertical list of links with one optional nested level. Anatomy, orientations, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'No kit page, by design. The kit’s only counterpart is its UI shell, which is out of scope as an application shell (#113). The docs sidebar is built from it.',
    livePreview: <NavigationMenuPreview />,
    install:
      "import { NavigationMenu } from '@/components/ui/navigation-menu'\nimport type { NavItem, NavChild } from '@/components/ui/navigation-menu'",
    anatomyLede:
      'Top-level items, and nested items under any of them. The type stops there: a nested item has no items of its own, so a third level cannot be written.',
    anatomy: (
      <NavigationMenu
        label="Anatomy example"
        orientation="vertical"
        items={[
          { label: 'Top-level item', href: '#' },
          {
            label: 'Top-level item with nested items',
            href: '#',
            items: [
              { label: 'Nested item', href: '#', current: true },
              { label: 'Nested item', href: '#' },
            ],
          },
        ]}
      />
    ),
    variantsLede:
      'Orientation is the one prop. Horizontal wraps onto a new row when it runs out of room rather than scrolling; vertical is what a sidebar uses. Nested items render inline, open, in both.',
    variants: [
      {
        label: 'Orientation: Horizontal',
        node: (
          <NavigationMenu
            label="Horizontal example"
            items={[
              { label: 'Overview', href: '#', current: true },
              { label: 'Foundations', href: '#' },
              { label: 'Components', href: '#' },
            ]}
          />
        ),
      },
      {
        label: 'Orientation: Vertical',
        node: (
          <NavigationMenu
            label="Vertical example"
            orientation="vertical"
            items={[
              { label: 'Overview', href: '#', current: true },
              { label: 'Foundations', href: '#' },
              { label: 'Components', href: '#' },
            ]}
          />
        ),
      },
      {
        label: 'Vertical, with nested items',
        node: (
          <NavigationMenu
            label="Nested example"
            orientation="vertical"
            items={[
              { label: 'Overview', href: '#' },
              {
                label: 'Components',
                href: '#',
                items: [
                  { label: 'Button', href: '#', current: true },
                  { label: 'Tabs', href: '#' },
                ],
              },
            ]}
          />
        ),
      },
    ],
    statesLede:
      'Focus is forced on the first link with the declarations :focus-visible carries. There is no Hover row because links have no hover style. Current is data, not a pseudo-class: the caller sets it on one item.',
    states: [
      { label: 'Enabled', node: row({}) },
      { label: 'Focus', node: row({}), className: styles.forceFocus },
      { label: 'Current', node: row({ current: true }) },
    ],
    dos: [
      'Mark one item current per menu, and let the inset bar show it. It is a shape as well as a colour.',
      'Use vertical in a sidebar and horizontal where every item fits on one row.',
      'Pass a distinct label to each menu when a page has more than one, as the docs sidebar does per group.',
      'Keep nested items to the pages of their parent section, and few enough to leave the list open.',
    ],
    donts: [
      'Nest a third level. The contract says it becomes its own page, and the type cannot express it.',
      'Fold a header bar, an action rail or a collapsible panel into it. That is site chrome, and it lives outside components/ui.',
      'Replace the inset bar with a colour change alone. Colour never carries meaning on its own here.',
      'Expect nested items to open as a flyout. That waits on the Wave 5 overlay surface; today they sit inline.',
    ],
    a11y: [
      ['Landmark', 'A nav landmark named by label, which defaults to “Main”. Give each menu on a page its own name.'],
      ['Current page', 'The current item carries aria-current="page", and a 2px inset bar in primary as well as the colour change.'],
      ['Keyboard', 'Plain links in lists. Tab moves through them in order, nested items included; there is no arrow-key handling to learn.'],
      ['Focus', <>A 2px <code>--graphite-focus</code> outline inside the link, on :focus-visible only.</>],
      ['Structure', 'Nested items are a list inside their parent’s list item, so the hierarchy a screen reader announces is the one on screen.'],
    ],
    related: [
      { href: '/docs/components/breadcrumb', title: 'Breadcrumb', why: 'where the page sits' },
      { href: '/docs/components/tabs', title: 'Tabs', why: 'views inside one page' },
      { href: '/docs/components/menu', title: 'Menu', why: 'actions, not destinations' },
    ],
  }
}
