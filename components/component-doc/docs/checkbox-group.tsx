import type { ComponentDocConfig } from '../types'
import { CheckboxGroupPreview, CheckboxGroupStill } from './checkbox-group-preview'

export function checkboxGroupDoc(): ComponentDocConfig {
  return {
    slug: 'checkbox-group',
    name: 'Checkbox group',
    kitTitle: 'Checkbox',
    figmaNode: '11506:27535',
    lede: 'Asks one question with several answers that can all be true: “Notify me by” email, text and push. For one answer out of several, use a Radio button group; for a single yes or no, a Checkbox.',
    description:
      'A labelled set of checkboxes, down or across, with one message for the group. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Carried into #240 from #219. Built from the governed Checkbox.',
    livePreview: <CheckboxGroupPreview />,
    install: "import { CheckboxGroup } from '@/components/ui/checkbox-group'",
    anatomy: <CheckboxGroupStill />,
    anatomyLede:
      'The group label, 8 above the options; one Checkbox per option in 22px rows; one message for the group under them. The label names the group for assistive tech, as a fieldset’s legend.',
    variantsLede: 'Horizontal sets the options across, 16 apart, instead of down, 8 apart.',
    variants: [
      { label: 'Vertical', node: <CheckboxGroupStill /> },
      { label: 'Horizontal', node: <CheckboxGroupStill orientation="horizontal" /> },
    ],
    statesLede:
      'Invalid rings every box in danger and puts the error under the group. Warning keeps the boxes and adds the message. Read-only and Disabled reach every box.',
    states: [
      { label: 'Enabled', node: <CheckboxGroupStill /> },
      { label: 'Invalid', node: <CheckboxGroupStill status="error" /> },
      { label: 'Warning', node: <CheckboxGroupStill status="warning" /> },
      { label: 'Read-only', node: <CheckboxGroupStill status="read-only" /> },
      { label: 'Disabled', node: <CheckboxGroupStill status="disabled" /> },
      { label: 'Horizontal: Invalid', node: <CheckboxGroupStill orientation="horizontal" status="error" /> },
    ],
    dos: [
      'Label the question, not the answers: “Notify me by”.',
      'Say in the error what is needed, such as “Choose at least one”.',
      'Keep the options short enough to read down a column.',
      'Go across only for two or three short options.',
    ],
    donts: [
      'Use it for a choice of one. That is a Radio button group.',
      'Put a single checkbox in a group.',
      'Give each box its own error. The group carries one message.',
      'Restyle the boxes. They are the governed Checkbox.',
    ],
    a11y: [
      ['Roles', <>A <code>fieldset</code> named by its legend, holding native checkboxes, each labelled by its option.</>],
      ['Keyboard', 'Tab reaches each box in turn; Space toggles it. Read-only boxes stay reachable and do not change.'],
      ['Messages', <>The group’s message describes the fieldset through <code>aria-describedby</code>; an error is announced as it appears, and each box reports <code>aria-invalid</code>.</>],
      ['Focus', 'Each box takes Checkbox’s own 2px ring.'],
    ],
    parityLede:
      'The kit draws Checkbox group as one set on the Checkbox page. The code is one component over the governed Checkbox.',
    parity: [
      ['State', 'Enabled · Invalid · Warning · Read-only', 'errorText, warningText, readOnly', 'Invalid rings every box; Warning leaves them. The kit has no Disabled; the code passes disabled to every box.'],
      ['Horizontal', 'False · True', 'orientation', 'vertical and horizontal, 8 and 16 apart.'],
      ['Helper / Error / Warning message', 'Boolean + text', 'helpText, errorText, warningText', 'One message for the group, through the shared field-message rule.'],
      ['Group label', 'Inside the first Checkbox', 'label', 'The fieldset’s legend, so it names the group. The kit’s vertical Enabled variant reads “Group abel”.'],
    ],
    related: [
      { href: '/docs/components/checkbox', title: 'Checkbox', why: 'the options, and a single yes or no' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'for one answer out of several' },
      { href: '/docs/components/toggle', title: 'Toggle', why: 'for a setting that applies at once' },
    ],
  }
}
