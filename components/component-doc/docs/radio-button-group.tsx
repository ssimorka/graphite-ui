import { RadioButtonGroup, type RadioOption } from '@/components/ui/radio-button-group'
import type { ComponentDocConfig } from '../types'
import styles from './radio-button-group.module.scss'
import { RadioButtonGroupPreview } from './radio-button-group-preview'

const OPTIONS: RadioOption[] = [
  { value: 'a', label: 'Option one' },
  { value: 'b', label: 'Option two' },
]

// Each group needs its own name, or the browser would treat every group on the
// page as one and let a single selection span them.
const group = (
  name: string,
  props: {
    orientation?: 'vertical' | 'horizontal'
    disabled?: boolean
    options?: RadioOption[]
    helpText?: string
    errorText?: string
  } = {},
) => (
  <RadioButtonGroup
    name={`doc-${name}`}
    label="Group label"
    options={props.options ?? OPTIONS}
    value="a"
    orientation={props.orientation ?? 'horizontal'}
    disabled={props.disabled}
    helpText={props.helpText}
    errorText={props.errorText}
  />
)

export function radioButtonGroupDoc(): ComponentDocConfig {
  return {
    slug: 'radio-button-group',
    name: 'Radio button group',
    kitTitle: 'Radio button',
    figmaNode: '2927:28166',
    lede: 'A labelled set of options where exactly one can be chosen. Use it when the options are few enough to show at once; when more than one can be chosen use checkboxes, and when the list is long use a select.',
    description:
      'A labelled group of radio buttons with one selection, vertical or horizontal. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Exclusivity comes from native radios sharing a name, so the browser enforces it rather than caller state.',
    livePreview: <RadioButtonGroupPreview />,
    install: "import { RadioButtonGroup, type RadioOption } from '@/components/ui/radio-button-group'",
    anatomy: group('anatomy', {
      orientation: 'vertical',
      helpText: 'Supporting text sits under the options.',
    }),
    anatomyLede:
      'The group label is a legend and each option carries its own label. Both are required: the option labels say what each choice is, and the legend says what the question was.',
    variantsLede:
      'Orientation is the one layout choice. Vertical is the default and scans best; horizontal suits two or three short options that fit on one line.',
    variants: [
      { label: 'Orientation: Vertical', node: group('vertical', { orientation: 'vertical' }) },
      { label: 'Orientation: Horizontal', node: group('horizontal') },
    ],
    statesLede:
      'Focus is a pseudo-class in the code and a variant in the kit, so the page forces it here on the first option. The kit draws no hover state and the code has none. Disabled works on the whole group or on one option. In error every option’s ring turns danger, as the kit draws its Invalid group, and the selected one keeps its primary centre.',
    states: [
      { label: 'Enabled', node: group('enabled') },
      { label: 'Focus', node: group('focus'), className: styles.forceFocus },
      { label: 'Disabled group', node: group('disabled', { disabled: true }) },
      {
        label: 'Disabled option',
        node: group('disabled-option', {
          options: [OPTIONS[0], { ...OPTIONS[1], disabled: true }],
        }),
      },
      { label: 'Error', node: group('error', { errorText: 'Choose one to continue.' }) },
    ],
    dos: [
      'Give the group a label that states the question (“Shipping speed”), so each option can be one word.',
      'Keep horizontal for two or three short options. Once they wrap, the reader cannot tell which row a label belongs to.',
      'Disable a single option with option.disabled when only that choice is unavailable, and the whole group when the question does not apply.',
      'Put errorText on the group. The message belongs to the question, not to one of the answers.',
    ],
    donts: [
      'Rely on the option labels alone. Without the legend a screen reader hears “Express” and no question.',
      'Keep exclusivity in your own state. The radios share a name, so the browser already allows only one.',
      'Use a radio group when more than one answer can be true. That is a set of checkboxes.',
      'Use a radio group for a long list. Past a handful of options, a select takes less room.',
    ],
    a11y: [
      ['Keyboard', 'Native radios sharing a name: Tab enters the group once, the arrow keys move between options and select as they go, and Tab leaves.'],
      ['Roles', <>A <code>fieldset</code> with a <code>legend</code>, so the group label is announced with each option. Each option is a native radio with a real <code>label</code>.</>],
      ['Labels', <>Help and error text are linked to the fieldset with <code>aria-describedby</code>. Error text is announced as it appears.</>],
      ['Focus', <>A 2px outline in <code>--graphite-focus</code> around the focused radio, offset by 2px, on keyboard focus only.</>],
      ['Disabled', 'A disabled group disables every radio through the fieldset. A disabled option drops out of arrow-key order on its own.'],
    ],
    parityLede:
      'The kit’s Radio button page has two sets: the single Radio button and the Radio button group. The code ships only the group, because a lone radio is not a choice. This table is where those facts are reconciled instead of quietly diverging.',
    parity: [
      ['Group: Horizontal', 'False · True', 'orientation', 'False is vertical, True is horizontal.'],
      ['Selected', 'False · True', 'value', 'The group owns selection. An option is selected when its value matches.'],
      ['Position', 'Left · Right', '—', 'Which side the label sits on. The code always puts the label after the control.'],
      ['State', 'Enabled · Focus · Disabled', 'disabled', 'Focus is :focus-visible, a pseudo-class (governance rule 7). Disabled is the group prop or option.disabled.'],
      ['State', 'Invalid', 'errorText', 'Its presence is the error state. There is no separate flag to set. Every ring turns danger, as the kit draws it.'],
      ['State', 'Warning · Read-only · Skeleton', '—', 'No counterpart in code.'],
    ],
    related: [
      { href: '/docs/components/checkbox', title: 'Checkbox', why: 'when more than one can be chosen' },
      { href: '/docs/components/select', title: 'Select', why: 'when the list is long' },
      { href: '/docs/components/toggle', title: 'Toggle', why: 'a single on or off setting' },
      { href: '/docs/components/tabs', title: 'Tabs', why: 'choosing a view, not a value' },
    ],
  }
}
