import { Tabs } from '@/components/ui/tabs'
import type { Tab } from '@/components/ui/tabs'
import { readKitPage } from '@/lib/kit-page'
import type { ComponentDocConfig } from '../types'
import styles from './tabs.module.scss'
import { DismissibleTabs, TabsPreview } from './tabs-preview'
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

const cell = (variant: 'line' | 'contained' = 'line') => (
  <div className={styles.full}>
    <Tabs
      variant={variant}
      tabs={[
        { id: 'one', label: 'Selected', panel: null },
        { id: 'two', label: 'Enabled', panel: null },
        { id: 'three', label: 'Disabled', panel: null, disabled: true },
      ]}
    />
  </div>
)

const ICONS: [Tab, Tab, ...Tab[]] = [
  { id: 'list', label: 'List', icon: 'menu-dots', panel: null },
  { id: 'search', label: 'Search', icon: 'search', panel: null, badge: true },
  { id: 'settings', label: 'Settings', icon: 'settings', panel: null },
]

const variant = (props: Partial<Parameters<typeof Tabs>[0]>, tabs?: [Tab, Tab, ...Tab[]], narrow = false) => (
  <div className={narrow ? styles.narrow : styles.full}>
    <Tabs
      {...props}
      tabs={
        tabs ?? [
          { id: 'overview', label: 'Overview', panel: null },
          { id: 'tokens', label: 'Tokens', panel: null },
          { id: 'usage', label: 'Usage', panel: null },
        ]
      }
    />
  </div>
)

export function tabsDoc(): ComponentDocConfig {
  const kit = readKitPage('Tabs')
  const tabs: [DemoTab, DemoTab, ...DemoTab[]] = [
    {
      id: 'source',
      label: 'Source',
      icon: 'settings',
      body: 'One hex value. Everything else on the page is derived from it.',
    },
    {
      id: 'ramps',
      label: 'Ramps',
      icon: 'database',
      body: 'Tonal ramps sampled from the source, one for each colour family.',
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: 'user',
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
      'Line and Contained are the kit’s two styles; Icon only, Grid aware, the trailing icon, the 2nd label, the badge and dismissible tabs are its item options. The kit draws vertical tabs as a separate set; the code makes them a value of one component, so a layout change is not a component swap. When the list is wider than its container it scrolls under the kit’s Previous and Next buttons.',
    variants: [
      { label: 'Style: Line', node: three('horizontal') },
      { label: 'Style: Contained', node: variant({ variant: 'contained' }) },
      { label: 'Contained, Grid aware', node: variant({ variant: 'contained', fullWidth: true }) },
      { label: 'Line, Large', node: variant({ size: 'lg' }) },
      { label: 'Type: Icon only', node: variant({ iconOnly: true }, ICONS) },
      { label: 'Type: Icon only, Large', node: variant({ iconOnly: true, size: 'lg' }, ICONS) },
      {
        label: 'Text + Icon',
        node: variant({}, [
          { id: 'a', label: 'Overview', icon: 'info', panel: null },
          { id: 'b', label: 'Tokens', icon: 'database', panel: null },
        ]),
      },
      {
        label: '2nd label',
        node: variant({ variant: 'contained' }, [
          { id: 'a', label: 'Overview', secondaryLabel: '12 items', panel: null },
          { id: 'b', label: 'Tokens', secondaryLabel: '58 variables', panel: null },
        ]),
      },
      {
        label: 'Dismissible',
        node: (
          <div className={styles.full}>
            <DismissibleTabs />
          </div>
        ),
      },
      { label: 'Overflow', node: variant({}, undefined, true) },
      { label: 'Orientation: Vertical', node: three('vertical') },
    ],
    statesLede:
      'The selected tab changes tone, takes SemiBold and carries the indicator, so its state never rests on colour alone. Hover lifts a label to on-surface. Focus is a ring inside the tab that replaces its rule. A disabled tab dims and is stepped over by the arrow keys.',
    states: [
      { label: 'Line', node: cell() },
      { label: 'Line, Hover', node: cell(), className: styles.forceHover },
      { label: 'Line, Focus', node: cell(), className: styles.forceFocus },
      { label: 'Contained', node: cell('contained') },
      { label: 'Contained, Focus', node: cell('contained'), className: styles.forceFocus },
    ],
    dos: [
      'Use tabs for peer views of one thing, like Preview and Code on this page, where a reader might want either first.',
      'Put a form inside a panel if it belongs there. Every panel stays mounted, so switching away and back keeps what was typed.',
      'Keep labels to a word or two, so the list fits its container. It scrolls under Previous and Next when it does not, but a list that fits needs no hunting.',
      'Switch to vertical when the list outgrows the width, or when the tabs sit beside a panel that is taller than it is wide.',
    ],
    donts: [
      'Use tabs for a sequence. If step two depends on step one, a reader should not be able to jump straight to it.',
      'Ship a single tab. With nothing to switch to, it is a heading pretending to be a control.',
      'Restyle the indicator away and leave the selected tab marked by colour alone.',
      'Key a panel on the active tab or render it conditionally yourself. That remounts the panel and throws away any form state inside it.',
    ],
    a11y: [
      ['Keyboard', 'Only the selected tab is in the Tab order. Left and Right (Up and Down when vertical) select the previous or next tab and wrap at the ends. Home and End select the first and last. Selection follows focus, so the panel changes as soon as a tab is reached.'],
      ['Roles', <>The list is a <code>tablist</code> with <code>aria-orientation</code>. Each tab is a button with <code>role=&quot;tab&quot;</code>, <code>aria-selected</code> and <code>aria-controls</code>; each panel is a <code>tabpanel</code> labelled by its tab.</>],
      ['Focus', <>The focus ring is <code>--graphite-primary-focus</code>, inset so it stays inside the tab. The arrow keys move focus and the selection together, skipping disabled tabs, so the ring is always on the selected tab.</>],
      ['Icon only', <>The label becomes the tab’s <code>aria-label</code>, so an icon-only tab is never unnamed.</>],
      ['Dismissing', <>Delete on a focused tab dismisses it, announced through <code>aria-keyshortcuts</code>; the close glyph is for the pointer. The overflow buttons are out of the Tab order: the arrow keys scroll the selected tab into view.</>],
      ['Contrast', 'The selected label is on-surface and SemiBold, and the rest are on-surface-variant, one tone step lower. Both are measured against surface at the theme’s target.'],
      ['Panels', 'Inactive panels are hidden with the hidden attribute, not unmounted, so assistive tech skips them and their state survives.'],
      ['Motion', 'Nothing animates. The indicator moves instantly, so there is nothing for reduced motion to switch off.'],
    ],
    parityLede: `The kit's Tabs page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets, most of them the private tab items the two public sets are built from. The code covers every axis of the public set and of the items it is built from, as props on Tabs and options on each tab.`,
    parity: [
      ['Style', 'Line · Contained', 'variant', 'Line: each tab its own 2px rule, a pixel apart. Contained: 48 tall, surface-variant with a divider, the selected tab on surface with a 2px primary rule on top. The kit’s Contained Auto-width items are 50 tall, a slip; built at 48.'],
      ['Type', 'Text + Icon · Icon only', 'iconOnly · tab.icon', 'Icon only squares the tab (40 or 48) and makes the label its aria-label. A text tab with an icon carries it 8 after the label.'],
      ['Size', 'Medium · Large', 'size', '40 and 48. Contained is always Large.'],
      ['Alignment', 'Auto-width · Grid aware', 'fullWidth', 'Grid aware shares the width equally.'],
      ['Item options', 'Dismissible · Hover Dismissible · 2nd label · Badge indicator', 'onDismiss · dismissOnHover · secondaryLabel · badge', 'The close glyph (and Delete); the 12/16 second line; the 8px danger dot over an icon.'],
      ['Previous · Next', 'Booleans, and the Tabs button item', '—', 'Shown when the list overflows. The kit’s glyph is a plus placeholder and Line’s fade a raw white; built as a chevron and from background.'],
      ['Vertical tabs', 'Separate set', 'orientation', 'A set in the kit, a value in the code. Kept as a prop because the capability exists in the kit and removing a prop is breaking.'],
      ['Selected', 'False · True', 'defaultTabId', 'Runtime state. The prop picks which tab starts selected; after that the component owns it.'],
      ['State', 'Enabled · Hover · Focus · Selected · Disabled', 'tab.disabled', 'Hover and Focus are pseudo-classes (governance rule 7). Disabled is per tab. Skeleton has no counterpart by rule.'],
    ],
    related: [
      { href: '/docs/components/accordion', title: 'Accordion', why: 'the other disclosure' },
      { href: '/docs/components/navigation-menu', title: 'Navigation Menu', why: 'when each view is its own page' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'when the choice is a value, not a view' },
    ],
  }
}
