import { Tabs } from '@/components/ui/tabs'
import { readKitPage } from '@/lib/kit-page'
import type { ComponentDocConfig } from '../types'
import styles from './tabs.module.scss'
import { TabsPreview } from './tabs-preview'
import type { DemoTab } from './tabs-preview'

const three = (orientation: 'horizontal' | 'vertical' = 'horizontal') => (
  <div className={styles.full}>
    <Tabs
      orientation={orientation}
      tabs={[
        { id: 'overview', label: 'Overview', panel: <p className={styles.tallPanel}>Panel content.</p> },
        { id: 'tokens', label: 'Tokens', panel: <p className={styles.tallPanel}>Panel content.</p> },
        { id: 'usage', label: 'Usage', panel: <p className={styles.tallPanel}>Panel content.</p> },
      ]}
    />
  </div>
)

const cell = () => (
  <div className={styles.full}>
    <Tabs
      tabs={[
        { id: 'one', label: 'Selected', panel: null },
        { id: 'two', label: 'Inactive', panel: null },
        { id: 'three', label: 'Inactive', panel: null },
      ]}
    />
  </div>
)

export function tabsDoc(): ComponentDocConfig {
  const kit = readKitPage('Tabs')
  const tabs: [DemoTab, DemoTab, ...DemoTab[]] = [
    {
      id: 'source',
      label: 'Source',
      body: 'One hex value. Everything else on the page is derived from it.',
    },
    {
      id: 'ramps',
      label: 'Ramps',
      body: 'Tonal ramps sampled from the source, one for each colour family.',
    },
    {
      id: 'roles',
      label: 'Roles',
      body: 'The named colours components bind to, checked for contrast at AA or AAA.',
    },
  ]

  return {
    slug: 'tabs',
    name: 'Tabs',
    kitTitle: 'Tabs',
    figmaNode: '3890:50605',
    lede: 'A row of labels that switches between peer views of the same content, one visible at a time. Use it when the views are alternatives, never for steps a reader has to take in order.',
    description:
      'A row of labels that switches between peer views of the same content. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Used by every page in these docs: the Preview and Code switch above each live preview is this component.',
    livePreview: <TabsPreview tabs={tabs} />,
    install: "import { Tabs } from '@/components/ui/tabs'\nimport type { Tab } from '@/components/ui/tabs'",
    anatomy: three(),
    anatomyLede:
      'Two slots: the tab list and one panel per tab. The type of the tabs array is a tuple of at least two, so a single tab is a compile error rather than a review comment.',
    variantsLede:
      'Orientation is the only prop. The kit draws vertical tabs as a separate set; the code makes them a value of one component, so a layout change is not a component swap.',
    variants: [
      { label: 'Orientation: Horizontal', node: three('horizontal') },
      { label: 'Orientation: Vertical', node: three('vertical') },
    ],
    statesLede:
      'The selected tab changes tone and carries the indicator bar, so its state never rests on colour alone. The code has no hover style and no disabled tab: a tab that cannot be chosen should not be in the list.',
    states: [
      { label: 'Enabled', node: cell() },
      { label: 'Focus', node: cell(), className: styles.forceFocus },
    ],
    dos: [
      'Use tabs for peer views of one thing, like Preview and Code on this page, where a reader might want either first.',
      'Put a form inside a panel if it belongs there. Every panel stays mounted, so switching away and back keeps what was typed.',
      'Keep labels to a word or two, so the list fits its container without scrolling.',
      'Switch to vertical when the list outgrows the width, or when the tabs sit beside a panel that is taller than it is wide.',
    ],
    donts: [
      'Use tabs for a sequence. If step two depends on step one, a reader should not be able to jump straight to it.',
      'Ship a single tab. With nothing to switch to, it is a heading pretending to be a control.',
      'Restyle the indicator away and leave the selected tab marked by colour alone.',
      'Key a panel on the active tab or render it conditionally yourself. That remounts the panel and throws away any form state inside it.',
    ],
    a11y: [
      ['Keyboard', 'Only the selected tab is in the Tab order. Left and Right (Up and Down when vertical) select the previous or next tab and wrap at the ends. Home and End are not bound.'],
      ['Roles', <>The list is a <code>tablist</code> with <code>aria-orientation</code>. Each tab is a button with <code>role=&quot;tab&quot;</code>, <code>aria-selected</code> and <code>aria-controls</code>; each panel is a <code>tabpanel</code> labelled by its tab.</>],
      ['Focus', <>The focus ring is <code>--graphite-focus</code>, inset so it stays inside the tab. The arrow keys change the selection but do not yet move focus with it, so the ring can sit on a tab that is no longer selected.</>],
      ['Contrast', 'The selected label is on-surface and the rest are on-surface-variant, one tone step lower. Both are measured against surface at the theme’s target.'],
      ['Panels', 'Inactive panels are hidden with the hidden attribute, not unmounted, so assistive tech skips them and their state survives.'],
      ['Motion', 'Nothing animates. The indicator moves instantly, so there is nothing for reduced motion to switch off.'],
    ],
    parityLede: `The kit's Tabs page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets, most of them the private tab items the two public sets are built from. The code exposes one prop. This table is where those two facts are reconciled instead of quietly diverging.`,
    parity: [
      ['Style', 'Line · Contained', '—', 'The code draws Line. Contained has no counterpart yet.'],
      ['Type', 'Text + Icon · Icon only', 'label', 'A label is a string, so a tab is always text. Icon only would need an accessible name the type does not carry.'],
      ['Alignment', 'Auto-width · Grid aware', '—', 'Tabs size to their labels, which is Auto-width. Grid aware is only drawn for Contained.'],
      ['Vertical tabs', 'Separate set', 'orientation', 'A set in the kit, a value in the code. Kept as a prop because the capability exists in the kit and removing a prop is breaking.'],
      ['Selected', 'False · True', 'defaultTabId', 'Runtime state. The prop picks which tab starts selected; after that the component owns it.'],
      ['State', 'Enabled → Skeleton', '—', 'Drawn on the tab item. Focus is a pseudo-class in code (governance rule 7). Hover, Disabled and Skeleton have no counterpart.'],
    ],
    related: [
      { href: '/docs/components/accordion', title: 'Accordion', why: 'the other disclosure' },
      { href: '/docs/components/navigation-menu', title: 'Navigation Menu', why: 'when each view is its own page' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'when the choice is a value, not a view' },
    ],
  }
}
