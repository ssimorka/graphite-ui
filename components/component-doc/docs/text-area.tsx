import { TextArea } from '@/components/ui/text-area'
import type { ComponentDocConfig } from '../types'
import styles from './text-area.module.scss'
import { TextAreaPreview } from './text-area-preview'

const cell = (props: { state?: 'disabled' | 'invalid'; errorText?: string }) => (
  <TextArea
    label="Label"
    placeholder="Placeholder text"
    helpText={props.errorText ? undefined : 'Helper text'}
    state={props.state}
    errorText={props.errorText}
  />
)

export function textAreaDoc(): ComponentDocConfig {
  return {
    slug: 'text-area',
    name: 'Text area',
    kitTitle: 'Text area',
    figmaNode: '14494:263111',
    lede: 'A multi-line field for an answer that needs a few sentences: feedback, a description, a note. For anything that fits on one line, use Text input, which is quicker to scan in a form.',
    description:
      'A multi-line field that inherits Text input’s contract and adds vertical resize. Anatomy, sizes, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Inherits Text input’s contract and adds one prop, resize. Used in the feedback, bug report and profile cards on the Create page.',
    livePreview: <TextAreaPreview />,
    install:
      "import { TextArea } from '@/components/ui/text-area'\nimport type { FieldSize, FieldState } from '@/components/ui/text-input'",
    anatomyLede:
      'A label, the value and supporting text, inherited from Text input. Text area has no leading or trailing slot: the code offers neither.',
    anatomy: (
      <TextArea
        label="Label"
        defaultValue="Value. The field grows as you drag its corner, up to a fixed height, and scrolls after that."
        helpText="Supporting text"
      />
    ),
    variantsLede:
      'Size sets the starting height and the type size. Resize decides whether the reader can drag it taller; it can never be dragged wider.',
    variants: [
      { label: 'Size: Small', node: <TextArea size="sm" label="Label" placeholder="Placeholder text" /> },
      { label: 'Size: Medium', node: <TextArea size="md" label="Label" placeholder="Placeholder text" /> },
      { label: 'Size: Large', node: <TextArea size="lg" label="Label" placeholder="Placeholder text" /> },
      { label: 'Resize: None', node: <TextArea resize="none" label="Label" placeholder="Placeholder text" /> },
    ],
    statesLede:
      'Focus is forced here with the declarations :focus-visible carries; it is never a prop. There is no Hover row because the field has no hover style. Error comes from passing errorText, and Invalid is the same styling without a message.',
    states: [
      { label: 'Enabled', node: cell({}) },
      { label: 'Focus', node: cell({}), className: styles.forceFocus },
      { label: 'Disabled', node: cell({ state: 'disabled' }) },
      { label: 'Error', node: cell({ errorText: 'Error message' }) },
      { label: 'Invalid', node: cell({ state: 'invalid' }) },
    ],
    dos: [
      'Pick the size from the answer you expect. A large field invites a longer answer, a small one a sentence.',
      'Leave resize on vertical unless the layout below the field cannot move.',
      'Say in the helper text what a good answer includes, like steps to reproduce, rather than repeating the label.',
      'Pass errorText to show an error, so the message and the red border arrive together.',
    ],
    donts: [
      'Allow horizontal or both-way resize. The prop does not offer it, because a wider field breaks its container.',
      'Let the field grow without limit. It stops at a fixed height and scrolls, and a style override that removes that limit breaks the contract.',
      'Use the placeholder as the label. It disappears as soon as someone types.',
      'Use a text area for a one-line answer like a name. The height suggests more is expected.',
    ],
    a11y: [
      ['Labels', 'The label is a real label element tied to the textarea by id, generated when you do not pass one.'],
      ['Supporting text', 'Help or error text is linked through aria-describedby. Error text carries role="alert", so it is announced when it appears.'],
      ['Validity', 'Error and Invalid both set aria-invalid. The required asterisk is hidden; the native required attribute is what gets read.'],
      ['Focus', 'A primary border on :focus-visible, drawn by the browser’s real focus rather than a prop.'],
      ['Overflow', 'Past its maximum height the field scrolls, so long text stays reachable by keyboard and by scroll without moving the page.'],
    ],
    parity: [
      ['State', 'Enabled · Focus · Error · Warning · Disabled · Read-only · Skeleton', 'state', 'Disabled and Error map to prop values, and Error also follows errorText. Focus is :focus-visible, per governance rule 7. Warning and Skeleton have no counterpart. readOnly passes through but has no style of its own.'],
      ['Text filled', 'False · True', '—', 'Runtime state: whether the field has a value.'],
      ['Fluid (set)', 'Enabled → Read-only', '—', 'The kit’s second public set, with the label inside the field. No counterpart in code.'],
      ['Size', '—', 'size', 'The kit draws one height. The code keeps three, inherited from Text input: where the kit has no opinion, the code keeps its own.'],
      ['Resize handle', 'Private build block', 'resize', 'The kit draws the handle; the code turns it on or off. Vertical is the only direction either one offers.'],
    ],
    related: [
      { href: '/docs/components/text-input', title: 'Text input', why: 'the one-line field it inherits from' },
      { href: '/docs/components/select', title: 'Select', why: 'when the answer is from a list' },
      { href: '/docs/components/modal', title: 'Modal', why: 'when the form interrupts the page' },
      { href: '/docs/components/button', title: 'Button', why: 'the submit it sits beside' },
    ],
  }
}
