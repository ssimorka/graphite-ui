import { Toggle } from '@/components/ui/toggle'
import type { ComponentDocConfig } from '../types'
import styles from './toggle.module.scss'
import { TogglePreview } from './toggle-preview'

const cell = (props: { disabled?: boolean } = {}) => (
  <>
    <Toggle label="Label" disabled={props.disabled} />
    <Toggle label="Label" checked disabled={props.disabled} />
  </>
)

export function toggleDoc(): ComponentDocConfig {
  return {
    slug: 'toggle',
    name: 'Toggle',
    kitTitle: 'Toggle',
    figmaNode: '3038:25739',
    lede: 'A switch for one setting that takes effect the moment it moves and is undone by moving it back. If the change waits for a submit, or cannot be reversed straight away, use a checkbox or a button.',
    description:
      'A labelled on/off switch for settings that apply immediately. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'On is primary and off is outline, on the same ramp as Button’s active state rather than a separate green and gray.',
    livePreview: <TogglePreview />,
    install: "import { Toggle } from '@/components/ui/toggle'",
    anatomy: (
      <Toggle
        label="Email notifications"
        checked
        helpText="A summary of new comments, once a day."
      />
    ),
    variantsLede:
      'A toggle has no kinds or sizes in code. What varies is its position, and whether it carries a line of supporting text.',
    variants: [
      { label: 'Off', node: <Toggle label="Label" /> },
      { label: 'On', node: <Toggle label="Label" checked /> },
      {
        label: 'With help text',
        node: <Toggle label="Label" helpText="Supporting copy." />,
      },
    ],
    statesLede:
      'Focus is a pseudo-class in the code and a variant in the kit, so the page forces it here. The kit draws no hover state for a toggle and the code has none. Error is not a prop of its own: passing errorText is what puts the control in it.',
    states: [
      { label: 'Enabled', node: cell() },
      { label: 'Focus', node: cell(), className: styles.forceFocus },
      { label: 'Disabled', node: cell({ disabled: true }) },
      {
        label: 'Error',
        node: <Toggle label="Email notifications" errorText="Add an email address to turn this on." />,
      },
    ],
    dos: [
      'Name the setting (“Email notifications”) and let the position say whether it is on.',
      'Apply the change as soon as the switch moves. There is no Save step for a toggle.',
      'Use it for changes a reader can undo by flipping it back.',
      'Add helpText when the name alone does not say what the setting will do.',
    ],
    donts: [
      'Label it “On” or “Off”. The track already shows that, so the label should name what is being switched.',
      'Use a toggle to delete, send or publish. An action that cannot be taken back at once is a Button.',
      'Put toggles in a form that waits for a submit button. A switch reads as done, so use a checkbox there.',
      'Recolor the on track green. On is primary and off is outline, the same ramp as the rest of the controls.',
    ],
    a11y: [
      ['Roles', <>A native checkbox with <code>role=&quot;switch&quot;</code>, so a screen reader announces a switch that is on or off rather than a checkbox.</>],
      ['Keyboard', 'Tab reaches it and Space flips it, as with any native checkbox. Clicking the label flips it too.'],
      ['Labels', <>The label is a real <code>label</code> tied to the input. Help and error text are linked with <code>aria-describedby</code>, and error text is announced as it appears.</>],
      ['Focus', <>A 2px ring in <code>--graphite-focus</code> around the track, on keyboard focus only.</>],
      ['Motion', <>The track fill and the thumb travel run on <code>--graphite-motion-fast</code> and stop animating under prefers-reduced-motion.</>],
      ['Target', 'The track is 48 by 24, the kit’s default size. The input under it is the full width and 32px tall.'],
    ],
    parity: [
      ['Toggled', 'False · True', 'checked', 'One to one.'],
      ['Size', 'Default · Small', '—', 'Default only. The code draws the 48 by 24 track and has no small switch.'],
      ['Toggle only', 'False · True', '—', 'No counterpart. The label is required, so there is no bare switch.'],
      ['State', 'Enabled · Focus · Disabled', 'disabled', 'Focus is :focus-visible, a pseudo-class (governance rule 7). Disabled is the disabled prop.'],
      ['State', 'Read-only · Skeleton', '—', 'No counterpart in code. The kit has no error state for a toggle; the code’s errorText is its own.'],
    ],
    related: [
      { href: '/docs/components/checkbox', title: 'Checkbox', why: 'when the change waits for a submit' },
      { href: '/docs/components/button', title: 'Button', why: 'when it cannot be undone at once' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'more than two positions' },
    ],
  }
}
