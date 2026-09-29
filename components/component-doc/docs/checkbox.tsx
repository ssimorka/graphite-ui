import { Checkbox } from '@/components/ui/checkbox'
import type { ComponentDocConfig } from '../types'
import styles from './checkbox.module.scss'
import { CheckboxPreview } from './checkbox-preview'

const cell = (props: { disabled?: boolean; errorText?: string }) => (
  <>
    <Checkbox label="Unchecked" disabled={props.disabled} errorText={props.errorText} />
    <Checkbox label="Checked" checked disabled={props.disabled} />
  </>
)

export function checkboxDoc(): ComponentDocConfig {
  return {
    slug: 'checkbox',
    name: 'Checkbox',
    kitTitle: 'Checkbox',
    figmaNode: '11506:27302',
    lede: 'A box the reader ticks to choose an option that stands on its own, where any number can be chosen, including none. When only one of several can be chosen, use a radio button group, and when the change applies the moment it is made, use a toggle.',
    description:
      'A labelled checkbox with checked, indeterminate, disabled and error states. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Version 2 absorbed Field: the label and the error text are now the control’s own. Used across the Create cards.',
    livePreview: <CheckboxPreview />,
    install: "import { Checkbox } from '@/components/ui/checkbox'",
    anatomy: (
      <Checkbox
        label="Save as default address"
        checked
        helpText="Used for every order until you change it."
      />
    ),
    variantsLede:
      'Selection is two props, checked and indeterminate. Indeterminate is a dash in the same box, a different glyph rather than a different color, so it reads apart from both of the others.',
    variants: [
      { label: 'Unchecked', node: <Checkbox label="Label" /> },
      { label: 'Checked', node: <Checkbox label="Label" checked /> },
      { label: 'Indeterminate', node: <Checkbox label="Label" indeterminate /> },
      {
        label: 'With help text',
        node: <Checkbox label="Label" helpText="Supporting copy." />,
      },
    ],
    statesLede:
      'Focus is a pseudo-class in the code and a variant in the kit, so the page forces it here. The kit draws no hover state for a checkbox and the code has none. Error is not a prop of its own: passing errorText is what puts the control in it.',
    states: [
      { label: 'Enabled', node: cell({}) },
      { label: 'Focus', node: cell({}), className: styles.forceFocus },
      { label: 'Disabled', node: cell({ disabled: true }) },
      { label: 'Error', node: <Checkbox label="Accept the terms" errorText="Accept the terms to continue." /> },
    ],
    dos: [
      'Use a checkbox when each option stands alone and any number of them can be on, including none.',
      'Show indeterminate on a parent whose children are only partly selected, and let the next click resolve it.',
      'Show an error by passing errorText, so the message and the error state arrive together.',
      'Write the label as the thing being chosen (“Save as default address”), not as a question.',
    ],
    donts: [
      'Render a bare box and let nearby text stand in for its label. The label prop is required for exactly this reason.',
      'Shrink the hit area to the painted box. The box is 20px but the control keeps a 32px target, the same rule as Button.',
      'Mark indeterminate by recoloring the check. It is a dash, so it still reads when color does not.',
      'Use a checkbox for a setting that takes effect the moment it changes. That is a Toggle.',
    ],
    a11y: [
      ['Keyboard', 'It is a native checkbox, so Tab reaches it and Space toggles it. Clicking the label toggles it too.'],
      ['Roles', 'A native input of type checkbox. Indeterminate is written to the DOM property, so assistive tech announces it as mixed rather than unchecked.'],
      ['Labels', <>The label is a real <code>label</code> tied to the input. Help and error text are linked with <code>aria-describedby</code>, and error text is announced as it appears.</>],
      ['Focus', <>A 2px ring in <code>--graphite-focus</code> around the box, on keyboard focus only.</>],
      ['Target', 'The painted box is 20px. The input underneath covers a 32px square, so the target does not shrink with the drawing.'],
    ],
    parityLede:
      'The kit’s Checkbox page has two sets: the single Checkbox, with Selection and State axes, and a Checkbox group. The code has the single control and no group. This table is where those facts are reconciled instead of quietly diverging.',
    parity: [
      ['Selection', 'Unchecked · Checked · Indeterminate', 'checked, indeterminate', 'Two booleans. When both are set, the dash wins.'],
      ['State', 'Enabled · Focus · Disabled', 'disabled', 'Focus is :focus-visible, a pseudo-class (governance rule 7). Disabled is the disabled prop.'],
      ['State', 'Invalid', 'errorText', 'Its presence is the error state. There is no separate flag to set.'],
      ['State', 'Warning · Read-only · Skeleton', '—', 'No counterpart in code.'],
      ['Group: Horizontal', 'False · True', '—', 'There is no checkbox group component. Lay checkboxes out in your own container.'],
    ],
    related: [
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'when only one can be chosen' },
      { href: '/docs/components/toggle', title: 'Toggle', why: 'when the change applies at once' },
      { href: '/docs/components/text-input', title: 'Text input', why: 'the same label and message parts' },
      { href: '/docs/components/button', title: 'Button', why: 'the touch target rule it shares' },
    ],
  }
}
