import { Search } from '@/components/ui/search'
import type { ComponentDocConfig } from '../types'
import styles from './search.module.scss'
import { SearchFilled, SearchPreview } from './search-preview'

const field = (props: { size?: 'sm' | 'md' | 'lg'; layout?: 'default' | 'fluid'; disabled?: boolean; expandable?: boolean } = {}) => (
  <div className={styles.measure}>
    <Search
      label="Search components"
      placeholder="Search components"
      size={props.size}
      layout={props.layout}
      disabled={props.disabled}
      expandable={props.expandable}
    />
  </div>
)

export function searchDoc(): ComponentDocConfig {
  return {
    slug: 'search',
    name: 'Search',
    kitTitle: 'Search',
    figmaNode: '2805:21056',
    lede: 'A field for a word or phrase to find something by, rather than by navigating to it. Use it where there is a set worth searching; for a short list, a Select or the list itself is faster.',
    description:
      'A search field at three sizes, in the kit’s Default and Fluid forms, with an expandable variant and a clear. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s first wave. Contained list’s header takes it as its search mode, and Data table’s toolbar composes it.',
    livePreview: <SearchPreview />,
    install: "import { Search } from '@/components/ui/search'",
    anatomy: (
      <div className={styles.measure}>
        <SearchFilled />
      </div>
    ),
    anatomyLede:
      'The search icon, the value, and the clear once there is a value, on the shared field shell. The label is required: the Default set draws none, so it is the field’s only name for assistive tech.',
    variantsLede:
      'Size sets the height: 48, 40 or 32, with the icon 16, 12 or 8 in. Fluid is the kit’s second set, a 64px box with the label inside. Expandable collapses the field to its icon until it is pressed.',
    variants: [
      { label: 'Size: Large', node: field({ size: 'lg' }) },
      { label: 'Size: Medium', node: field({ size: 'md' }) },
      { label: 'Size: Small', node: field({ size: 'sm' }) },
      { label: 'Set: Fluid', node: field({ layout: 'fluid' }) },
      { label: 'Expandable, collapsed', node: field({ expandable: true }) },
    ],
    statesLede:
      'Hover lifts only the placeholder, as the kit draws it. Focus is the field shell’s 2px ring. Filled shows the clear. Disabled takes the disabled fill and drops the rule.',
    states: [
      { label: 'Enabled', node: field() },
      { label: 'Hover', node: field(), className: styles.forceHover },
      { label: 'Focus', node: field(), className: styles.forceFocus },
      { label: 'Filled', node: <div className={styles.measure}><SearchFilled /></div> },
      { label: 'Disabled', node: field({ disabled: true }) },
    ],
    dos: [
      'Give it a label that says what is being searched (“Search components”), even though Default does not show it.',
      'Act on the value as the reader types, or on Enter through onSubmit, and say what was found.',
      'Use the expandable form where a toolbar or a list header has no room for a field at rest.',
      'Use Fluid inside a Fluid form, so it lines up with the fields around it.',
    ],
    donts: [
      'Use it to choose one value from a short list. That is a Select.',
      'Leave out the label because the field shows a placeholder. The placeholder disappears as soon as anyone types.',
      'Hide the only way into the content behind an expandable search.',
      'Restyle the clear or the icon. They are the kit’s glyphs, so every Search reads the same.',
    ],
    a11y: [
      ['Roles', <>A <code>search</code> landmark around a native <code>input type=&quot;search&quot;</code>, named by the label. Fluid paints the label; Default puts it in <code>aria-label</code>.</>],
      ['Keyboard', 'Escape clears the value, and on an empty expandable field collapses it. Enter calls onSubmit. The clear is a button, named “Clear search”, and returns focus to the field.'],
      ['Expandable', <>Collapsed, it is a button named by the label with <code>aria-expanded</code>; pressing it opens the field and moves focus into it.</>],
      ['Focus', <>The field shell’s 2px <code>--graphite-primary-focus</code> ring, inside the field, while the input has focus.</>],
      ['Contrast', 'The value is on-surface on the field. The placeholder is outline-strong, the same as every other field’s.'],
    ],
    parityLede:
      'The kit’s Search page has two public sets, Default and Fluid. The code is one component with a layout prop for the two, and every axis of each.',
    parity: [
      ['Size', 'Large · Medium · Small', 'size', 'lg, md and sm: 48, 40 and 32 tall, the icon 16, 12 or 8 in.'],
      ['State', 'Enabled · Hover · Focus · Filled · Disabled', '—', 'Hover and Focus are pseudo-classes (governance rule 7). Filled is a value; the clear shows with it. Disabled is the prop.'],
      ['State', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Expandable · Expanded', 'False · True', 'expandable', 'Collapsed to the icon in a square that fills surface-variant on hover; expanded on press.'],
      ['Set', 'Search - Fluid', 'layout="fluid"', 'The 64px box: the label inside, the search icon at the right and the clear beside it.'],
      ['Placeholder', 'Disabled tone (Default)', '—', 'A kit slip: the Default set colours the placeholder in the disabled tone, the Fluid set and Text input in outline-strong. The code follows the field shell.'],
    ],
    related: [
      { href: '/docs/components/text-input', title: 'Text input', why: 'the same field shell' },
      { href: '/docs/components/contained-list', title: 'Contained list', why: 'its header’s search mode' },
      { href: '/docs/components/data-table', title: 'Data table', why: 'composed into its toolbar' },
      { href: '/docs/components/select', title: 'Select', why: 'when the choice is from a short list' },
    ],
  }
}
