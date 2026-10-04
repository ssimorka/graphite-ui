import { Toggle } from '@/components/ui/toggle'
import type { ComponentDocConfig } from '../types'
import styles from './toggle.module.scss'
import { TogglePreview } from './toggle-preview'

const cell = (props: { disabled?: boolean; readOnly?: boolean; size?: 'default' | 'sm' } = {}) => (
  <span className={styles.pair}>
    <Toggle label="Label" disabled={props.disabled} readOnly={props.readOnly} size={props.size} />
    <Toggle label="Label" checked disabled={props.disabled} readOnly={props.readOnly} size={props.size} />
  </span>
)

export function toggleDoc(): ComponentDocConfig {
  return {
    slug: 'toggle',
    name: 'Toggle',
    kitTitle: 'Toggle',
    figmaNode: '3038:25739',
    lede: 'A switch for one setting that takes effect the moment it moves and is undone by moving it back. If the change waits for a submit, or cannot be reversed straight away, use a checkbox or a button.',
    description:
      'A labelled on/off switch for settings that apply immediately, at two sizes. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'On is success and off is outline, as the kit binds them; the thumb’s position is what says which.',
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
      'Default is 48 by 24 and Small 32 by 16, whose thumb carries a check when on. The label sits above and the value text beside the switch, as the kit draws it; Toggle only hides both from view and keeps the label as the switch’s name.',
    variants: [
      { label: 'Off', node: <Toggle label="Label" /> },
      { label: 'On', node: <Toggle label="Label" checked /> },
      { label: 'Size: Small', node: cell({ size: 'sm' }) },
      { label: 'Toggle only', node: <Toggle label="Email notifications" checked hideLabel /> },
      {
        label: 'With help text',
        node: <Toggle label="Label" helpText="Supporting copy." />,
      },
    ],
    statesLede:
      'Focus is a pseudo-class in the code and a variant in the kit, so the page forces it here. The kit draws no hover state for a toggle and the code has none. Disabled keeps one track for on and off, as the kit draws it, and turns the thumb to disabled content so its position still shows which is which. Read-only drops the fill for a thin rule and keeps the thumb readable. Error is the code’s own: passing errorText puts the control in it, and the track takes a danger ring.',
    states: [
      { label: 'Enabled', node: cell() },
      { label: 'Focus', node: cell(), className: styles.forceFocus },
      { label: 'Disabled', node: cell({ disabled: true }) },
      { label: 'Read-only', node: cell({ readOnly: true }) },
      {
        label: 'Error',
        node: (
          <span className={styles.pair}>
            <Toggle label="Email notifications" errorText="Add an email address to turn this on." />
            <Toggle label="Label" checked errorText="On keeps its fill inside the ring." />
          </span>
        ),
      },
    ],
    dos: [
      'Name the setting (“Email notifications”) and let the position and the value text say whether it is on.',
      'Apply the change as soon as the switch moves. There is no Save step for a toggle.',
      'Use it for changes a reader can undo by flipping it back.',
      'Add helpText when the name alone does not say what the setting will do.',
    ],
    donts: [
      'Label it “On” or “Off”. The value text already says that, so the label should name what is being switched.',
      'Use a toggle to delete, send or publish. An action that cannot be taken back at once is a Button.',
      'Put toggles in a form that waits for a submit button. A switch reads as done, so use a checkbox there.',
      'Rely on the green to say it is on. The thumb’s position says it; the colour only agrees.',
    ],
    a11y: [
      ['Roles', <>A native checkbox with <code>role=&quot;switch&quot;</code>, so a screen reader announces a switch that is on or off rather than a checkbox. In error the input carries <code>aria-invalid</code>; read-only carries <code>aria-readonly</code> and stays focusable, but does not change. The value text is hidden from assistive tech, because the switch already announces its state.</>],
      ['Keyboard', 'Tab reaches it and Space flips it, as with any native checkbox. Clicking the label flips it too.'],
      ['Labels', <>The label is a real <code>label</code> tied to the input. Help and error text are linked with <code>aria-describedby</code>, and error text is announced as it appears.</>],
      ['Focus', <>A 2px ring in <code>--graphite-primary-focus</code> around the track, on keyboard focus only. In error it sits outside the danger ring rather than replacing it.</>],
      ['Motion', <>The track fill and the thumb travel run on <code>--graphite-motion-fast</code> and stop animating under prefers-reduced-motion.</>],
      ['Target', 'The track is 48 by 24, or 32 by 16 at Small. The input under it is the full width and 32px tall at both sizes.'],
    ],
    parity: [
      ['Toggled', 'False · True', 'checked', 'On is success and off is outline, with an on-primary thumb, as the kit binds them.'],
      ['Size', 'Default · Small', 'size', 'default and sm: 48 by 24 and 32 by 16. The Small thumb carries a 6px check when on.'],
      ['Toggle only', 'False · True', 'hideLabel', 'The label is hidden from view, not from assistive tech, so the switch keeps its name.'],
      ['Show label · Show value', 'True · True', 'hideLabel · showValue', 'The label above, the value (On, Off by default) 8 beside the switch.'],
      ['State', 'Enabled · Focus · Disabled', 'disabled', 'Focus is :focus-visible, a pseudo-class (governance rule 7). The kit’s ring is an unbound Carbon blue; the code uses primary-focus. Disabled is one track for on and off with the thumb in disabled content; the kit binds the disabled label to the fill step, the code dims it as every form control does.'],
      ['State', 'Read-only', 'readOnly', 'No fill, a 1px rule inside the track, an on-surface thumb. Focusable, never changes.'],
      ['State', 'Skeleton', '—', 'No counterpart by rule. The kit has no error state for a toggle; the code’s errorText and its danger ring are its own.'],
    ],
    related: [
      { href: '/docs/components/checkbox', title: 'Checkbox', why: 'when the change waits for a submit' },
      { href: '/docs/components/button', title: 'Button', why: 'when it cannot be undone at once' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'more than two positions' },
    ],
  }
}
