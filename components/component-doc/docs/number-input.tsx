import type { ComponentDocConfig } from '../types'
import { NumberInputPreview, NumberInputStill } from './number-input-preview'

export function numberInputDoc(): ComponentDocConfig {
  return {
    slug: 'number-input',
    name: 'Number input',
    kitTitle: 'Number input',
    figmaNode: '19893:290998',
    lede: 'Takes a number that moves in steps (guests, quantity, a percentage), typed or nudged with the buttons at the end. For a number with no steps, such as a phone number, use a Text input.',
    description:
      'A number field with decrement and increment buttons, in Default at three sizes and in Fluid. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s G2 wave, split from Text input’s number type.',
    livePreview: <NumberInputPreview />,
    install: "import { NumberInput } from '@/components/ui/number-input'",
    anatomy: <NumberInputStill />,
    anatomyLede:
      'Text input’s label, field and helper, the value 16 in, and the stepper at the end: decrement then increment, each a ghost icon-only Button square at the field’s height, each after a 1 × 20 divider.',
    variantsLede:
      'Size sets the field and the stepper together: 48, 40 or 32. Fluid is a 64px box with the label inside and 40px stepper buttons on the value row.',
    variants: [
      { label: 'Default: Large', node: <NumberInputStill /> },
      { label: 'Default: Medium', node: <NumberInputStill size="md" /> },
      { label: 'Default: Small', node: <NumberInputStill size="sm" /> },
      { label: 'Fluid', node: <NumberInputStill layout="fluid" /> },
    ],
    statesLede:
      'Text input’s states. Error and warning put the status glyph before the stepper, as the kit draws them. At a bound, the button that would pass it disables. Disabled and Read-only disable both.',
    states: [
      { label: 'Enabled', node: <NumberInputStill /> },
      { label: 'At the minimum', node: <NumberInputStill start={0} /> },
      { label: 'At the maximum', node: <NumberInputStill start={10} /> },
      { label: 'Error', node: <NumberInputStill status="error" start={12} /> },
      { label: 'Warning', node: <NumberInputStill status="warning" start={9} /> },
      { label: 'Disabled', node: <NumberInputStill status="disabled" /> },
      { label: 'Read-only', node: <NumberInputStill status="read-only" /> },
    ],
    dos: [
      'Set min and max, and say the range in the helper text.',
      'Check what is typed on the page, and say what is wrong with errorText.',
      'Pick a step that matches how the number moves: 1 for guests, 0.5 for hours.',
      'Keep the value short; the field is for numbers, not sentences.',
    ],
    donts: [
      'Use it for numbers that are really identifiers: phone, card or postal numbers.',
      'Step past a bound. The buttons stop there.',
      'Hide the stepper. It is the reason to use this over a Text input.',
      'Restyle the field or the buttons. They are the governed Text input and Button.',
    ],
    a11y: [
      ['Roles', <>A native number field (<code>spinbutton</code>), labelled, with its range and step, and two buttons after it.</>],
      ['Keyboard', 'Arrow Up and Down step and clamp, as the buttons do. Tab reaches the field, then each button.'],
      ['Buttons', '“Decrement” and “Increment”. Each disables at the bound it would pass, and both with a disabled or read-only field.'],
      ['Focus', 'The field takes Text input’s ring; each button its own.'],
    ],
    parityLede:
      'The kit’s Number input page has two public sets, Default and Fluid, built from a private base and action item. The code is one component over Text input and Button.',
    parity: [
      ['Set', 'Default · Fluid', 'layout', 'fixed and fluid.'],
      ['Size', 'Large · Medium · Small', 'size', '48, 40 and 32, the field and the stepper together.'],
      ['State', 'Enabled · Focus · Error · Warning · Disabled · Read-only', '—', 'Text input’s, with errorText, warningText, disabled and readOnly. Fluid’s Hover is the shell’s.'],
      ['State', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Action item', 'Enabled · Hover · Active · Focus · Disabled', '—', 'The ghost Button’s own states.'],
      ['Divider', 'border-subtle-01 · outline', '—', 'The Large divider binds a variable that resolves to nothing; the code uses Medium’s outline at every size.'],
      ['AI slug · Revert', 'Action items', '—', 'Not built: the AI sets are ungoverned.'],
    ],
    related: [
      { href: '/docs/components/text-input', title: 'Text input', why: 'the field, and for numbers without steps' },
      { href: '/docs/components/slider', title: 'Slider', why: 'for a value read by its position' },
      { href: '/docs/components/button', title: 'Button', why: 'the stepper' },
    ],
  }
}
