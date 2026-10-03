import { TextArea } from '@/components/ui/text-area'
import type { ComponentDocConfig } from '../types'
import styles from './text-area.module.scss'
import { TextAreaPreview } from './text-area-preview'

const cell = (props: { state?: 'disabled' | 'invalid'; errorText?: string; warningText?: string; readOnly?: boolean }) => (
  <TextArea
    label="Label"
    placeholder="Placeholder text"
    maxLength={100}
    helpText={props.errorText || props.warningText ? undefined : 'Helper text'}
    state={props.state}
    errorText={props.errorText}
    warningText={props.warningText}
    readOnly={props.readOnly}
    defaultValue={props.readOnly ? 'Read-only value' : undefined}
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
        maxLength={300}
      />
    ),
    variantsLede:
      'One height, as the kit draws it: 142 at least, the value in Body/3. Layout gives the kit’s two sets, Default and Fluid. Resize decides whether the reader can drag it taller; it can never be dragged wider. The count shows whenever maxLength is set.',
    variants: [
      { label: 'Layout: Fixed (default)', node: <TextArea label="Label" placeholder="Placeholder text" maxLength={100} /> },
      { label: 'Layout: Fluid', node: <TextArea layout="fluid" label="Label" placeholder="Placeholder text" maxLength={100} /> },
      { label: 'Fluid with an error', node: <TextArea layout="fluid" label="Label" placeholder="Placeholder text" maxLength={100} errorText="Error message" /> },
      { label: 'Resize: None', node: <TextArea resize="none" label="Label" placeholder="Placeholder text" /> },
    ],
    statesLede:
      'Focus is forced here with the declarations :focus-visible carries; it is never a prop. There is no Hover row because the field has no hover style. Error and Warning come from errorText and warningText and draw the kit’s status icon in the top-right corner; Invalid is the error ring without a message. Read-only is the native attribute.',
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
      'Set rows when the answer you expect is longer than the kit’s 142px field. It only ever grows taller.',
      'Leave resize on vertical unless the layout below the field cannot move.',
      'Say in the helper text what a good answer includes, like steps to reproduce, rather than repeating the label.',
      'Pass errorText to show an error, so the message and the red ring arrive together.',
    ],
    donts: [
      'Allow horizontal or both-way resize. The prop does not offer it, because a wider field breaks its container.',
      'Let the field grow without limit. It stops at a fixed height and scrolls, and a style override that removes that limit breaks the contract.',
      'Use the placeholder as the label. It disappears as soon as someone types.',
      'Use a text area for a one-line answer like a name. The height suggests more is expected.',
    ],
    a11y: [
      ['Labels', 'The label is a real label element tied to the textarea by id, generated when you do not pass one.'],
      ['Supporting text', 'Help, warning or error text is linked through aria-describedby. Error text carries role="alert", so it is announced when it appears. The status icon and the count are decorative.'],
      ['Validity', 'Error and Invalid both set aria-invalid. The required asterisk is hidden; the native required attribute is what gets read.'],
      ['Focus', 'The kit’s 2px ring inside the field on :focus-visible, drawn by the browser’s real focus rather than a prop.'],
      ['Overflow', 'Past its maximum height the field scrolls, so long text stays reachable by keyboard and by scroll without moving the page.'],
    ],
    parity: [
      ['State', 'Enabled · Focus · Error · Warning · Disabled · Read-only · Skeleton', 'state', 'Error and Warning follow errorText and warningText and draw the kit’s status icon. Disabled maps to the prop; Read-only is the native readOnly. Focus is :focus-visible, per governance rule 7. Skeleton has no counterpart.'],
      ['Show count', 'Boolean, on by default', 'showCount', 'On by default, as the kit has it, and shown whenever maxLength is set.'],
      ['Text filled', 'False · True', '—', 'Runtime state: whether the field has a value.'],
      ['Fluid (set)', 'Enabled → Read-only', 'layout="fluid"', 'The kit’s second public set: the label row inside the box, and the message inside too, under a divider.'],
      ['Size', '—', '—', 'None. The kit draws one height, 142 at least, with the value in Body/3; the size prop went in 3.0.0.'],
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
