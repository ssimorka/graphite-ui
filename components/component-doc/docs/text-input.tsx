import { Close, Search } from '@carbon/icons-react'
import { TextInput } from '@/components/ui/text-input'
import type { ComponentDocConfig } from '../types'
import styles from './text-input.module.scss'
import { TextInputPreview } from './text-input-preview'

const cell = (props: { state?: 'disabled' | 'invalid'; errorText?: string }) => (
  <TextInput
    label="Label"
    placeholder="Placeholder text"
    helpText={props.errorText ? undefined : 'Helper text'}
    state={props.state}
    errorText={props.errorText}
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
      'Size is the one axis that is a prop. It changes the field’s height and type size together; the label and supporting text stay at 12/16 in every size.',
    variants: [
      { label: 'Size: Small', node: <TextInput size="sm" label="Label" placeholder="Placeholder text" /> },
      { label: 'Size: Medium', node: <TextInput size="md" label="Label" placeholder="Placeholder text" /> },
      { label: 'Size: Large', node: <TextInput size="lg" label="Label" placeholder="Placeholder text" /> },
    ],
    statesLede:
      'Focus is forced here with the declarations :focus-within carries; it is never a prop. There is no Hover row because the field has no hover style. Error comes from passing errorText, and Invalid is the same styling without a message.',
    states: [
      { label: 'Enabled', node: cell({}) },
      { label: 'Focus', node: cell({}), className: styles.forceFocus },
      { label: 'Disabled', node: cell({ state: 'disabled' }) },
      { label: 'Error', node: cell({ errorText: 'Error message' }) },
      { label: 'Invalid', node: cell({ state: 'invalid' }) },
    ],
    dos: [
      'Write the label as the thing being asked for, and keep it short enough to stay on one line.',
      'Pass errorText to show an error. The red border and the message come from the same value, so they arrive together and leave together.',
      'Set type to match the answer (email, password, number), so a phone shows the right keyboard.',
      'Use the trailing slot for an action on the value, like clearing it, and give that button its own accessible name.',
    ],
    donts: [
      'Use the placeholder as the label. It disappears as soon as someone types, and the contract requires a visible label.',
      'Mark a field invalid with nothing nearby to say why. A red border says something is wrong, not what.',
      'Wrap the control in a label or field of your own. The label is built in, and a second one gets read twice.',
      'Give focus a colour of its own. The focus border is a tone step on primary, the same move Button makes on hover.',
    ],
    a11y: [
      ['Labels', 'The label is a real label element tied to the input by id. An id is generated when you do not pass one, so the two always associate.'],
      ['Supporting text', 'Help or error text is linked through aria-describedby. Error text also carries role="alert", so it is announced when it appears.'],
      ['Validity', 'Error and Invalid both set aria-invalid. The required asterisk is hidden from assistive tech; the native required attribute is what gets read.'],
      ['Focus', 'Focus is the browser’s own, drawn as a primary border through :focus-within. Nothing sets it by hand, so the ring and the real focus cannot disagree.'],
      ['Disabled', 'Disabled uses the native attribute, so the field leaves the tab order and is not submitted with the form.'],
    ],
    parity: [
      ['Style', 'Fixed · Inline', '—', 'Fixed only: the label sits above the field. Inline puts the label beside the field and has no counterpart in code.'],
      ['Size', 'Small · Medium · Large', 'size', 'One to one.'],
      ['State', 'Enabled · Focus · Error · Warning · Disabled · Read-only · Skeleton', 'state', 'Disabled and Error map to prop values, and Error also follows errorText. Focus is :focus-within, per governance rule 7. Warning and Skeleton have no counterpart. readOnly passes through to the input but has no style of its own. Invalid is the code’s own value and has no kit variant.'],
      ['Text filled', 'False · True', '—', 'Runtime state: whether the field has a value. The kit draws it because a Figma frame cannot be typed into.'],
      ['Fluid (set)', 'Enabled → Read-only', '—', 'The kit’s second public set, with the label inside the field. No counterpart: it is a different layout, not a value of a prop the code has.'],
    ],
    related: [
      { href: '/docs/components/text-area', title: 'Text area', why: 'when the answer runs past a line' },
      { href: '/docs/components/select', title: 'Select', why: 'when the answer is from a list' },
      { href: '/docs/components/checkbox', title: 'Checkbox', why: 'when the answer is yes or no' },
      { href: '/docs/components/button', title: 'Button', why: 'the submit it sits beside' },
    ],
  }
}
