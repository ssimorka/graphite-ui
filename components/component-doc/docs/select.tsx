import { Select, type SelectOption } from '@/components/ui/select'
import type { ComponentDocConfig } from '../types'
import styles from './select.module.scss'
import { SelectPreview } from './select-preview'

const OPTIONS: [SelectOption, SelectOption] = [
  { value: 'a', label: 'Option one' },
  { value: 'b', label: 'Option two' },
]

const field = (
  props: {
    size?: 'sm' | 'md' | 'lg'
    state?: 'default' | 'disabled' | 'error'
    helpText?: string
    errorText?: string
  } = {},
) => (
  <div className={styles.field}>
    <Select
      label="Label"
      options={OPTIONS}
      value="a"
      size={props.size}
      state={props.state}
      helpText={props.helpText}
      errorText={props.errorText}
    />
  </div>
)

export function selectDoc(): ComponentDocConfig {
  return {
    slug: 'select',
    name: 'Select',
    kitTitle: 'Select',
    figmaNode: '17650:274860',
    lede: 'A closed field that opens a list of options and holds one of them. Use it when the list is too long to show at once; when two or three options fit on screen, a radio button group shows them without a click.',
    description:
      'A labelled native select in three sizes, with disabled and error states. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Still a native select after Wave 5 landed: the platform menu keeps type-ahead, arrow keys and mobile pickers.',
    livePreview: <SelectPreview />,
    install: "import { Select, type SelectOption } from '@/components/ui/select'",
    anatomy: field({ helpText: 'Supporting text sits under the field.' }),
    anatomyLede:
      'The closed trigger is the only part the system draws. The option list is the browser’s own, so it takes no token from this system.',
    variantsLede:
      'Size is the one variant prop, and it shares its scale with Text input, so a select and the inputs beside it line up.',
    variants: [
      { label: 'Size: Small', node: field({ size: 'sm' }) },
      { label: 'Size: Medium', node: field({ size: 'md' }) },
      { label: 'Size: Large', node: field({ size: 'lg' }) },
    ],
    statesLede:
      'Disabled and error are values of the state prop; focus is a pseudo-class, so the page forces it here. The kit also draws Hover, and the code has no hover rule for it yet. Open is not drawn, because the open menu belongs to the browser.',
    states: [
      { label: 'Enabled', node: field() },
      { label: 'Focus', node: field(), className: styles.forceFocus },
      { label: 'Disabled', node: field({ state: 'disabled' }) },
      { label: 'Error', node: field({ state: 'error', errorText: 'Choose an option to continue.' }) },
    ],
    // The contract's first token row inherits Text input's set rather than
    // naming a role, so it has no swatch of its own to paint.
    swatches: { '': null },
    dos: [
      'Use a select for a long list of choices where only one can hold, such as a country or a region.',
      'Match its size to the text inputs in the same form. The two share one size scale.',
      'Show an error with errorText, so the red border always comes with the reason for it.',
      'Keep at least two options. The type rejects fewer, because a select with one choice is a statement.',
    ],
    donts: [
      'Swap the native menu for a custom list to match the brand. Type-ahead, arrow keys and mobile pickers go with it.',
      'Try to style the open option list. It is drawn by the browser and takes no token from this system.',
      'Use a select for two or three options that fit on screen. A radio button group shows them without a click.',
      'Set state="error" without errorText. The border says something is wrong without saying what.',
    ],
    a11y: [
      ['Keyboard', 'A native select: Tab reaches it, the arrow keys change the value, typing jumps to a matching option, and the platform opens its own menu.'],
      ['Roles', <>The browser supplies the roles. When the field is in error it carries <code>aria-invalid</code>.</>],
      ['Labels', <>The label is a real <code>label</code> tied to the select. Help and error text are linked with <code>aria-describedby</code>, and error text is announced as it appears.</>],
      ['Focus', <>The border and a 1px ring turn <code>primary</code> while the field has focus, replacing the browser outline. In error they stay <code>danger</code>.</>],
      ['Mobile', 'On touch devices the platform shows its own picker, sized for fingers, which a custom list would have to rebuild.'],
    ],
    parity: [
      ['Size', 'Small · Medium · Large', 'size', 'sm, md and lg. One to one.'],
      ['Style', 'Default · Inline', '—', 'Default only. The code has no inline select.'],
      ['State', 'Enabled · Disabled · Error', 'state', 'One to one. Error also follows from errorText.'],
      ['State', 'Focus · Hover', '—', 'Pseudo-classes (governance rule 7). Focus is :focus-within on the trigger. Hover has no rule in code yet.'],
      ['Open', 'False · True', '—', 'The kit also draws it as State=Open. The open menu is the browser’s, so it is runtime state with nothing to draw.'],
      ['State', 'Warning · Read-only · Skeleton', '—', 'No counterpart in code.'],
      ['Set', 'Select - Fluid', '—', 'No counterpart. The code has one field layout.'],
    ],
    related: [
      { href: '/docs/components/text-input', title: 'Text input', why: 'the trigger’s treatment and sizes' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'when the options fit on screen' },
      { href: '/docs/components/menu', title: 'Menu', why: 'for actions, not values' },
      { href: '/docs/components/overlay', title: 'Overlay', why: 'the surface its menu does not use' },
    ],
  }
}
