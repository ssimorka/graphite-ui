import { Close, Search } from '@carbon/icons-react'
import { TextInput } from '@/components/ui/text-input'
import type { ComponentDocConfig } from '../types'
import styles from './text-input.module.scss'
import { TextInputPreview } from './text-input-preview'

const cell = (props: { state?: 'disabled' | 'invalid'; errorText?: string; warningText?: string; readOnly?: boolean }) => (
  <TextInput
    label="Label"
    placeholder="Placeholder text"
    helpText={props.errorText || props.warningText ? undefined : 'Helper text'}
    state={props.state}
    errorText={props.errorText}
    warningText={props.warningText}
    readOnly={props.readOnly}
    defaultValue={props.readOnly ? 'Read-only value' : undefined}
  />
)

export function textInputDoc(): ComponentDocConfig {
  return {
    slug: 'text-input',
    name: 'Text input',
    kitTitle: 'Text input',
    figmaNode: '15784:271032',
    lede: 'A single-line field for a short answer the reader types: a name, an email, a search term. When the answer comes from a known list, use Select; when it runs past a line, use Text area.',
    description:
      'A single-line field for a short typed answer, with its label and supporting text built in. Anatomy, sizes, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'It absorbed Label and Field (#94, #107): the label and supporting text are now the control’s own, as they are in the kit.',
    livePreview: <TextInputPreview />,
    install:
      "import { TextInput } from '@/components/ui/text-input'\nimport type { FieldSize, FieldState } from '@/components/ui/text-input'",
    anatomyLede:
      'Slots come from the contract. The label and supporting text are part of the control, not a wrapper around it, so there is no way to render the field without a name.',
    anatomy: (
      <TextInput
        label="Label"
        defaultValue="Value"
        helpText="Supporting text"
        leading={<Search size={16} aria-hidden="true" />}
        trailing={<Close size={16} aria-hidden="true" />}
      />
    ),
    variantsLede:
      'Size changes the field’s height only: the value is Body/3 at every size, and the label and supporting text stay at 12/16. Layout gives the kit’s three shapes: Fixed, Inline and Fluid. showCount adds the kit’s character count.',
    variants: [
      { label: 'Size: Small', node: <TextInput size="sm" label="Label" placeholder="Placeholder text" /> },
      { label: 'Size: Medium', node: <TextInput size="md" label="Label" placeholder="Placeholder text" /> },
      { label: 'Size: Large', node: <TextInput size="lg" label="Label" placeholder="Placeholder text" /> },
      { label: 'Layout: Inline', node: <TextInput layout="inline" label="Label" placeholder="Placeholder text" helpText="Helper text" /> },
      { label: 'Layout: Fluid', node: <TextInput layout="fluid" label="Label" placeholder="Placeholder text" /> },
      { label: 'Character count', node: <TextInput label="Label" placeholder="Placeholder text" maxLength={100} showCount /> },
    ],
    statesLede:
      'Focus is forced here with the declarations :focus-within carries; it is never a prop. There is no Hover row because the field has no hover style. Error and Warning come from passing errorText or warningText and draw the kit’s status icon; Invalid is the error ring without a message. Read-only is the native attribute.',
    states: [
      { label: 'Enabled', node: cell({}) },
      { label: 'Focus', node: cell({}), className: styles.forceFocus },
      { label: 'Disabled', node: cell({ state: 'disabled' }) },
      { label: 'Error', node: cell({ errorText: 'Error message' }) },
      { label: 'Warning', node: cell({ warningText: 'Warning message' }) },
      { label: 'Read-only', node: cell({ readOnly: true }) },
      { label: 'Invalid', node: cell({ state: 'invalid' }) },
    ],
    dos: [
      'Write the label as the thing being asked for, and keep it short enough to stay on one line.',
      'Pass errorText to show an error. The red ring and the message come from the same value, so they arrive together and leave together.',
      'Set type to match the answer (email, password, number), so a phone shows the right keyboard.',
      'Use the trailing slot for an action on the value, like clearing it, and give that button its own accessible name.',
    ],
    donts: [
      'Use the placeholder as the label. It disappears as soon as someone types, and the contract requires a visible label.',
      'Mark a field invalid with nothing nearby to say why. A red ring says something is wrong, not what.',
      'Wrap the control in a label or field of your own. The label is built in, and a second one gets read twice.',
      'Give focus a colour of its own. The focus ring is the primary family’s focus step, the same ring Button draws.',
    ],
    a11y: [
      ['Labels', 'The label is a real label element tied to the input by id. An id is generated when you do not pass one, so the two always associate.'],
      ['Supporting text', 'Help, warning or error text is linked through aria-describedby. Error text also carries role="alert", so it is announced when it appears. The status icon is decorative; the message carries the meaning.'],
      ['Validity', 'Error and Invalid both set aria-invalid. The required asterisk is hidden from assistive tech; the native required attribute is what gets read.'],
      ['Focus', 'Focus is the browser’s own, drawn as the kit’s 2px ring inside the field through :focus-within. Nothing sets it by hand, so the ring and the real focus cannot disagree.'],
      ['Disabled', 'Disabled uses the native attribute, so the field leaves the tab order and is not submitted with the form.'],
    ],
    parity: [
      ['Style', 'Fixed · Inline', 'layout', 'Both. Inline puts the label beside the field and the message to its right, built at the Fixed heights; the kit’s Inline Medium at 48 reads as a Carbon leftover.'],
      ['Size', 'Small · Medium · Large', 'size', 'One to one: 32, 40 and 48, with the value Body/3 at every size.'],
      ['State', 'Enabled · Focus · Error · Warning · Disabled · Read-only · Skeleton', 'state', 'Error and Warning follow errorText and warningText and draw the kit’s status icon. Disabled maps to the prop and the native attribute; Read-only is the native readOnly. Focus is :focus-within, per governance rule 7. Skeleton has no counterpart. Invalid is the code’s own value.'],
      ['Show count', 'Boolean', 'showCount', 'The kit’s “n/max” at the right of the label row, driven by maxLength.'],
      ['Text filled', 'False · True', '—', 'Runtime state: whether the field has a value. The kit draws it because a Figma frame cannot be typed into.'],
      ['Fluid (set)', 'Enabled → Read-only', 'layout="fluid"', 'The kit’s second public set: one 64px box with the label inside, a plain outline rule on the bottom.'],
    ],
    related: [
      { href: '/docs/components/text-area', title: 'Text area', why: 'when the answer runs past a line' },
      { href: '/docs/components/select', title: 'Select', why: 'when the answer is from a list' },
      { href: '/docs/components/checkbox', title: 'Checkbox', why: 'when the answer is yes or no' },
      { href: '/docs/components/button', title: 'Button', why: 'the submit it sits beside' },
    ],
  }
}
