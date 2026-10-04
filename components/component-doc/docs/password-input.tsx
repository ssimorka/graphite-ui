import { PasswordInput } from '@/components/ui/password-input'
import type { FieldLayout, FieldSize } from '@/components/ui/text-input'
import type { ComponentDocConfig } from '../types'
import { PasswordInputPreview } from './password-input-preview'

const still = (
  props: {
    layout?: FieldLayout
    size?: FieldSize
    filled?: boolean
    errorText?: string
    warningText?: string
    disabled?: boolean
    readOnly?: boolean
  } = {},
) => (
  <div style={{ width: props.layout === 'inline' ? '25rem' : '18rem', maxWidth: '100%' }}>
    <PasswordInput
      label="Password"
      layout={props.layout}
      size={props.size ?? 'lg'}
      helpText="At least 12 characters"
      placeholder="Password"
      defaultValue={props.filled ? 'correct horse battery' : undefined}
      errorText={props.errorText}
      warningText={props.warningText}
      disabled={props.disabled}
      readOnly={props.readOnly}
    />
  </div>
)

export function passwordInputDoc(): ComponentDocConfig {
  return {
    slug: 'password-input',
    name: 'Password input',
    kitTitle: 'Password input',
    figmaNode: '5621:280380',
    lede: 'Takes a password, masked, with an eye that shows what was typed. Use it wherever someone creates or enters a password; a plain masked Text input is for secrets nobody needs to check.',
    description:
      'Text input, masked, with a show toggle, in Fixed, Inline and Fluid at three sizes. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s G2 wave, split from Text input’s password type.',
    livePreview: <PasswordInputPreview />,
    install: "import { PasswordInput } from '@/components/ui/password-input'",
    anatomy: still({ filled: true }),
    anatomyLede:
      'Text input’s label, field and helper, the value masked, and the eye at the end of the field, 16 after the value. Pressing the eye shows the text and crosses the eye out; pressing it again masks it.',
    variantsLede:
      'The field is Text input’s, so every Style and Size is: Fixed puts the label above, Inline beside, Fluid inside a 64px box; Large, Medium and Small are 48, 40 and 32.',
    variants: [
      { label: 'Fixed: Large', node: still({ filled: true }) },
      { label: 'Fixed: Medium', node: still({ filled: true, size: 'md' }) },
      { label: 'Fixed: Small', node: still({ filled: true, size: 'sm' }) },
      { label: 'Inline', node: still({ filled: true, layout: 'inline' }) },
      { label: 'Fluid', node: still({ filled: true, layout: 'fluid' }) },
      { label: 'Empty', node: still() },
    ],
    statesLede:
      'Text input’s states. Error and warning put the status glyph before the eye, as the kit draws them. The eye still works when the field is read-only, and is disabled with the field.',
    states: [
      { label: 'Enabled', node: still({ filled: true }) },
      { label: 'Error', node: still({ filled: true, errorText: 'Use at least 12 characters' }) },
      { label: 'Warning', node: still({ filled: true, warningText: 'Caps Lock is on' }) },
      { label: 'Disabled', node: still({ filled: true, disabled: true }) },
      { label: 'Read-only', node: still({ filled: true, readOnly: true }) },
    ],
    dos: [
      'Say what a new password needs in the helper text, before the reader types.',
      'Warn when Caps Lock is on; it is the commonest reason a password fails.',
      'Let browsers and password managers fill it: the field keeps autocomplete.',
      'Use it for both creating and entering a password.',
    ],
    donts: [
      'Show the password by default. The field starts masked.',
      'Block pasting. Password managers paste.',
      'Use it for a secret no one needs to read back. That is a masked Text input.',
      'Restyle the field. It is the governed Text input.',
    ],
    a11y: [
      ['Roles', <>A labelled text input of type <code>password</code>, switching to <code>text</code> while shown, and a button after it.</>],
      ['Toggle', <>Named “Show password”, with <code>aria-pressed</code> carrying whether the text shows and <code>aria-controls</code> pointing at the field. The name does not change.</>],
      ['Keyboard', 'Tab reaches the field, then the toggle; Enter or Space toggles. Focus stays on the toggle.'],
      ['Focus', <>The field takes Text input’s ring; the toggle a 2px <code>--graphite-primary-focus</code> ring.</>],
    ],
    parityLede:
      'The kit’s Password input page has two public sets, Default and Fluid. The code is one component over Text input; its layout picks the set.',
    parity: [
      ['Set', 'Default · Fluid', 'layout', 'fixed and inline for Default, fluid for Fluid.'],
      ['Style', 'Fixed · Inline', 'layout', 'Text input’s fixed and inline.'],
      ['Size', 'Large · Medium · Small', 'size', '48, 40 and 32.'],
      ['State', 'Enabled · Focus · Error · Warning · Disabled', '—', 'Text input’s, with errorText, warningText and disabled; focus is the field’s own.'],
      ['State', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Filled · Show text', 'Boolean', '—', 'The value, and the reader’s toggle.'],
      ['Label', 'Caption/1', 'label', 'The kit’s Default label binds Caption/1, every other field Input Label; the same 12/16, so the code uses Text input’s.'],
    ],
    related: [
      { href: '/docs/components/text-input', title: 'Text input', why: 'the field' },
      { href: '/docs/components/search', title: 'Search', why: 'another field with its own control' },
      { href: '/docs/components/link', title: 'Link', why: 'for “Forgot password?”' },
    ],
  }
}
