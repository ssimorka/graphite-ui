'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { ContractMeta } from '@/lib/contracts'
import type { KitStats } from '@/lib/kit-stats'
import type { IndexStats } from '@/lib/components-index'
import { StatusBadge } from '@/components/doc-blocks'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckboxGroup } from '@/components/ui/checkbox-group'
import { ContainedList } from '@/components/ui/contained-list'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { Notification } from '@/components/ui/notification'
import { DatePicker } from '@/components/ui/date-picker'
import { Dropdown } from '@/components/ui/dropdown'
import { FileUploader } from '@/components/ui/file-uploader'
import { Link } from '@/components/ui/link'
import { OverflowMenu } from '@/components/ui/menu-button'
import { NumberInput } from '@/components/ui/number-input'
import { PaginationNav } from '@/components/ui/pagination'
import { PasswordInput } from '@/components/ui/password-input'
import { ProgressBar } from '@/components/ui/progress-bar'
import { RadioButtonGroup } from '@/components/ui/radio-button-group'
import { Search } from '@/components/ui/search'
import { Slider } from '@/components/ui/slider'
import { TimePicker } from '@/components/ui/time-picker'
import { Toast } from '@/components/ui/toast'
import { Select } from '@/components/ui/select'
import { Tabs } from '@/components/ui/tabs'
import { Tag } from '@/components/ui/tag'
import { TextArea } from '@/components/ui/text-area'
import { TextInput } from '@/components/ui/text-input'
import { Toggle } from '@/components/ui/toggle'
import { TreeView } from '@/components/ui/tree-view'
import { Typography } from '@/components/ui/typography'
import { spell } from '@/lib/spell'
import styles from './components-index.module.scss'

type Filter =
  | 'all'
  | 'governed'
  | 'ungoverned'
  | 'actions'
  | 'primitives'
  | 'forms'
  | 'navigation'
  | 'overlays'
  | 'data'

// The category chips are the contracts' waves (docs/contracts/README.md), so
// every governed component falls in exactly one. Wave 3, form composition, is
// empty and has no chip. A wave records build order as much as kind; Menu
// buttons was moved to wave 0 (menu-button.md 1.0.1) so it files under Actions.
const WAVES: Partial<Record<Filter, string>> = {
  actions: '0',
  primitives: '1',
  forms: '2',
  navigation: '4',
  overlays: '5',
  data: '6',
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'governed', label: 'Governed' },
  { key: 'ungoverned', label: 'Ungoverned' },
  { key: 'actions', label: 'Actions' },
  { key: 'primitives', label: 'Primitives' },
  { key: 'forms', label: 'Forms' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'overlays', label: 'Overlays' },
  { key: 'data', label: 'Data' },
]

// Contracts with no surface of their own to draw. Overlay is the shared base
// Modal, Popover, Menu, Tooltip and Notification inherit from; it counts as
// governed but there is nothing to put in a card.
const NO_PREVIEW = new Set(['Overlay'])

// Every governed component has a page at /docs/components/<contract slug>.

const noop = () => {}

// One small live rendering per component, drawn from the real thing so a
// source-colour change moves the index with the rest of the site. Overlays are
// shown by their trigger: opening one inside a card would fight the card.
const PREVIEWS: Record<string, () => ReactNode> = {
  Accordion: () => (
    <Accordion size="sm" defaultValue="a" style={{ width: '100%' }}>
      <AccordionItem value="a" title="Section">
        Panel content.
      </AccordionItem>
      <AccordionItem value="b" title="Section" />
    </Accordion>
  ),
  Button: () => <Button variant="primary">Button</Button>,
  'Button Group': () => (
    <ButtonGroup>
      <Button size="sm">Cancel</Button>
      <Button size="sm" variant="primary">Save</Button>
    </ButtonGroup>
  ),
  Breadcrumb: () => (
    <Breadcrumb
      items={[{ label: 'Home', href: '#' }, { label: 'Docs', href: '#' }, { label: 'Current' }]}
    />
  ),
  Checkbox: () => <Checkbox id="ix-cb" label="Checkbox label" checked onChange={noop} />,
  'Checkbox group': () => (
    <CheckboxGroup
      id="ix-cbg"
      label="Group label"
      orientation="horizontal"
      options={[
        { value: 'a', label: 'One' },
        { value: 'b', label: 'Two' },
      ]}
      value={['a']}
      onChange={noop}
    />
  ),
  'Contained list': () => (
    <ContainedList
      leading={<Tag>AD</Tag>}
      title="List title"
      description="List description"
    />
  ),
  // The row primitive the table is built from, twice.
  'Data table': () => (
    <>
      <ContainedList leading={<Tag>Ad</Tag>} title="Ada" />
      <ContainedList leading={<Tag>Gr</Tag>} title="Grace" />
    </>
  ),
  'Date picker': () => <DatePicker id="ix-dp" label="Date" size="md" value={null} onChange={noop} />,
  Dropdown: () => (
    <Dropdown
      id="ix-dd"
      label="Label"
      size="md"
      options={[
        { value: 'a', label: 'Option 1' },
        { value: 'b', label: 'Option 2' },
      ]}
      value="a"
      onChange={noop}
    />
  ),
  'File uploader': () => (
    <FileUploader id="ix-fu" size="sm" label="Upload files" files={[{ id: 'a', name: 'cover.png' }]} onAdd={noop} onRemove={noop} />
  ),
  Link: () => (
    <Link href="/docs/components" size="md" icon="arrow-right">
      View all
    </Link>
  ),
  Menu: () => <Button>Open menu</Button>,
  'Menu buttons': () => <OverflowMenu size="md" items={[{ label: 'Rename', onSelect: noop }]} />,
  Modal: () => <Button variant="primary">Open dialog</Button>,
  'Navigation Menu': () => (
    <NavigationMenu
      orientation="vertical"
      items={[{ label: 'System', href: '#', current: true }, { label: 'Docs', href: '#' }]}
    />
  ),
  Notification: () => <Notification variant="info" title="Title" body="Message" />,
  'Number input': () => <NumberInput id="ix-num" label="Guests" value={4} onChange={noop} />,
  Pagination: () => <PaginationNav page={1} totalPages={8} itemsShown={5} size="sm" onChange={noop} />,
  'Password input': () => <PasswordInput id="ix-pw" label="Password" defaultValue="correct horse" />,
  Popover: () => <Button>Open popover</Button>,
  'Progress bar': () => <ProgressBar value={62} label="Progress bar label" />,
  'Radio button group': () => (
    <RadioButtonGroup
      name="ix-radio"
      label="Legend"
      value="a"
      onChange={noop}
      options={[{ value: 'a', label: 'First' }, { value: 'b', label: 'Second' }]}
    />
  ),
  Select: () => (
    <Select
      id="ix-sel"
      label="Select label"
      options={[{ value: '1', label: 'First' }, { value: '2', label: 'Second' }]}
    />
  ),
  Slider: () => <Slider id="ix-slider" label="Label" value={40} showInputs={false} onChange={noop} />,
  Tabs: () => (
    <Tabs
      tabs={[
        { id: 'a', label: 'First', panel: null },
        { id: 'b', label: 'Second', panel: null },
      ]}
    />
  ),
  Tag: () => <Tag variant="primary">Tag</Tag>,
  'Text area': () => <TextArea id="ix-ta" label="Label" defaultValue="" />,
  Search: () => <Search id="ix-search" label="Search" placeholder="Search input text" size="md" />,
  'Text input': () => <TextInput id="ix-in" label="Label" placeholder="Placeholder text" />,
  'Time picker': () => <TimePicker id="ix-tp" label="Choose a time" size="md" value={{ time: '', period: 'AM' }} onChange={noop} />,
  Toast: () => <Toast variant="success" title="Changes saved" />,
  Toggle: () => <Toggle id="ix-sw" label="Label" checked onChange={noop} />,
  Tooltip: () => <Button>Hover or focus</Button>,
  'Tree view': () => (
    <TreeView
      label="Example tree"
      selected="button"
      nodes={[{ id: 'ui', label: 'ui', children: [{ id: 'button', label: 'button.tsx' }, { id: 'tag', label: 'tag.tsx' }] }]}
    />
  ),
  Typography: () => (
    <div>
      <Typography variant="heading-3">Heading</Typography>
      <Typography>Body text</Typography>
    </div>
  ),
}

// Ungoverned pages have no code to render live, so their previews are renders
// of the kit: each page's main set at its default variant, framed on the kit's
// background in Light and in Dark, at 2x, under public/images/kit/. They are
// the kit's own colours, so they do not follow the source the visitor picks.
// A page missing from this list (one the kit adds later) falls back to its
// set count until someone renders it.
const KIT_PREVIEWS = new Set([
  'ai-explainability-popover', 'ai-label', 'ai-layer', 'code-snippet',
  'content-switcher', 'form', 'list', 'loading', 'progress-indicator',
  'structured-list', 'tile', 'toggletip', 'ui-shell-header',
  'ui-shell-left-panel', 'ui-shell-right-panel',
])

const kitSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

type Card =
  | { kind: 'governed'; name: string; meta: ContractMeta }
  | { kind: 'ungoverned'; name: string; publicSets: number }

export function ComponentsIndex({
  contracts,
  stats,
  index,
}: {
  contracts: Record<string, ContractMeta>
  stats: KitStats
  index: IndexStats
}) {
  const [filter, setFilter] = useState<Filter>('all')

  const governed: Card[] = Object.values(contracts)
    .filter((c) => !NO_PREVIEW.has(c.component))
    .map((meta) => ({ kind: 'governed', name: meta.component, meta }))
  const ungoverned: Card[] = index.ungoverned.map((p) => ({
    kind: 'ungoverned',
    name: p.name,
    publicSets: p.publicSets,
  }))

  const visible = [...governed, ...ungoverned]
    .filter((c) => {
      if (filter === 'all') return true
      if (filter === 'governed') return c.kind === 'governed'
      if (filter === 'ungoverned') return c.kind === 'ungoverned'
      if (c.kind !== 'governed') return false
      return c.meta.wave === WAVES[filter]
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className={styles.index}>
      <header className={styles.header}>
        <h1 className={styles.title}>Components</h1>
        <p className={styles.lede}>
          {spell(stats.governed)} components carry a versioned contract and are
          checked against the kit on every build. The kit ships more than that,
          and the ones it ships without a contract are listed here too, labelled
          rather than hidden.
        </p>
      </header>

      <ul className={styles.counts} aria-label="Governance counts">
        <li className={styles.count}>
          <span className={`${styles.figure} ${styles.figureGoverned}`}>{stats.governed}</span>
          <span className={styles.caption}>governed components</span>
        </li>
      </ul>

      <div className={styles.filterBar}>
        <ul className={styles.filters} aria-label="Filter components">
          {FILTERS.map((f) => (
            <li key={f.key}>
              <button
                type="button"
                className={styles.chip}
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.sorted}>
          Sorted A–Z · {visible.length} shown
        </p>
      </div>

      <ul className={styles.grid}>
        {visible.map((card) => (
          <li
            key={`${card.kind}-${card.name}`}
            className={`${styles.card} ${card.kind === 'governed' ? styles.cardLinked : ''}`}
          >
            <div className={styles.preview}>
              {card.kind === 'governed' && PREVIEWS[card.name] ? (
                <div className={styles.previewInner} aria-hidden="true" inert>
                  {PREVIEWS[card.name]()}
                </div>
              ) : card.kind === 'ungoverned' && KIT_PREVIEWS.has(kitSlug(card.name)) ? (
                <figure className={styles.kitPreview}>
                  {/* Both themes ship; the stylesheet shows the one the
                      page is in. Decorative: the card's name says what it is. */}
                  <img
                    className={styles.kitLight}
                    src={`/images/kit/${kitSlug(card.name)}-light.png`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    className={styles.kitDark}
                    src={`/images/kit/${kitSlug(card.name)}-dark.png`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className={styles.absent}>
                    {`Kit render · ${card.publicSets} public ${card.publicSets === 1 ? 'set' : 'sets'}`}
                  </figcaption>
                </figure>
              ) : (
                <p className={styles.absent}>
                  {card.kind === 'ungoverned'
                    ? `${card.publicSets} public ${card.publicSets === 1 ? 'set' : 'sets'} in the kit`
                    : 'No preview'}
                </p>
              )}
            </div>
            {/* The card's foot: the status badge, then the component's name as
                the filled corner action. Governed, that action is the link,
                and its overlay stretches over the card. Ungoverned, there is
                no page to open, so the same block stands disabled. */}
            <div className={styles.meta}>
              {card.kind === 'governed' ? (
                <StatusBadge tone="success">{`Contract ${card.meta.version}`}</StatusBadge>
              ) : (
                <StatusBadge tone="neutral">Ungoverned</StatusBadge>
              )}
              <h2 className={styles.ctaHeading}>
                {card.kind === 'governed' ? (
                  <a className={styles.cta} href={`/docs/components/${card.meta.slug}`}>
                    {card.name}
                    <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <span className={`${styles.cta} ${styles.ctaDisabled}`}>
                    {card.name}
                  </span>
                )}
              </h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
