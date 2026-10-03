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
    controlPosition?: 'left' | 'right'
    disabled?: boolean
    readOnly?: boolean
    options?: RadioOption[]
    helpText?: string
    errorText?: string
    warningText?: string
  } = {},
) => (
  <RadioButtonGroup
    name={`doc-${name}`}
    label="Group label"
    options={props.options ?? OPTIONS}
    value="a"
    orientation={props.orientation ?? 'horizontal'}
    controlPosition={props.controlPosition}
    disabled={props.disabled}
    readOnly={props.readOnly}
    helpText={props.helpText}
    errorText={props.errorText}
    warningText={props.warningText}
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
      'Orientation is the main layout choice. Vertical is the default and scans best; horizontal suits two or three short options that fit on one line. Control position puts the radio after its label, the kit’s Position Right.',
    variants: [
      { label: 'Orientation: Vertical', node: group('vertical', { orientation: 'vertical' }) },
      { label: 'Orientation: Horizontal', node: group('horizontal') },
      { label: 'Control position: Right', node: group('right', { orientation: 'vertical', controlPosition: 'right' }) },
    ],
    statesLede:
      'Focus is a pseudo-class in the code and a variant in the kit, so the page forces it here on the first option. The kit draws no hover state and the code has none. Disabled works on the whole group or on one option, and a disabled selection keeps its dot. In error every option’s ring turns danger, as the kit draws its Invalid group, and the selected dot stays on-surface. Warning leaves the rings alone and puts the status icon on the message. Read-only quietens the rings but not the answer.',
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
      { label: 'Warning', node: group('warning', { warningText: 'Option one is being retired.' }) },
      { label: 'Read-only', node: group('read-only', { readOnly: true }) },
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
      ['Roles', <>A <code>fieldset</code> with the <code>radiogroup</code> role, labelled by its <code>legend</code>. Each option is a native radio with a real <code>label</code>. Read-only carries <code>aria-readonly</code>: the radios stay focusable, but the selection does not move.</>],
      ['Labels', <>Help and error text are linked to the fieldset with <code>aria-describedby</code>. Error text is announced as it appears.</>],
      ['Focus', <>A 2px ring in <code>--graphite-primary-focus</code> just outside the 20px frame, on keyboard focus only. The hit area reaches 6px past the frame, so it stays 32px.</>],
      ['Disabled', 'A disabled group disables every radio through the fieldset. A disabled option drops out of arrow-key order on its own.'],
    ],
    parityLede:
      'The kit’s Radio button page has two sets: the single Radio button and the Radio button group. The code ships only the group, because a lone radio is not a choice. This table is where those facts are reconciled instead of quietly diverging.',
    parity: [
      ['Group: Horizontal', 'False · True', 'orientation', 'False is vertical, True is horizontal.'],
      ['Selected', 'False · True', 'value', 'The group owns selection. An option is selected when its value matches.'],
      ['Position', 'Left · Right', 'controlPosition', 'The side the radio sits on. Right draws the label first.'],
      ['Group: State', 'Enabled · Invalid · Warning · Read-only', 'errorText · warningText · readOnly', 'Invalid rings every option in danger; Warning leaves the rings and leads the message with the status icon; Read-only quietens the rings and blocks changes.'],
      ['Radio: State', 'Focus · Disabled', 'disabled', 'Focus is :focus-visible, a pseudo-class (governance rule 7), a 2px ring outside the frame. Disabled is the group prop or option.disabled, and dims the label too.'],
      ['Radio: State', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Glyph', 'icon-primary ring and dot', '—', 'The ring and the 8px dot are on-surface, as the kit binds them. They were primary until 2.1.0.'],
      ['Group label', 'Inside the first option (vertical)', 'legend', 'The kit’s vertical groups draw the label in the first option rather than on the group, a slip with the same pixels. The code keeps one legend.'],
    ],
    related: [
      { href: '/docs/components/checkbox', title: 'Checkbox', why: 'when more than one can be chosen' },
      { href: '/docs/components/select', title: 'Select', why: 'when the list is long' },
      { href: '/docs/components/toggle', title: 'Toggle', why: 'a single on or off setting' },
      { href: '/docs/components/tabs', title: 'Tabs', why: 'choosing a view, not a value' },
    ],
  }
}
