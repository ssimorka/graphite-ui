import { Select, type SelectOption } from '@/components/ui/select'
import type { ComponentDocConfig } from '../types'
import styles from './select.module.scss'
import { SelectPreview } from './select-preview'

const OPTIONS: [SelectOption, SelectOption] = [
  { value: 'a', label: 'Option one' },
  { value: 'b', label: 'Option two' },
]

const field = (
  props: {
    size?: 'sm' | 'md' | 'lg'
    layout?: 'fixed' | 'inline' | 'fluid'
    state?: 'default' | 'disabled' | 'error'
    readOnly?: boolean
    helpText?: string
    errorText?: string
    warningText?: string
  } = {},
) => (
  <div className={styles.field}>
    <Select
      label="Label"
      options={OPTIONS}
      value="a"
      size={props.size}
      layout={props.layout}
      state={props.state}
      readOnly={props.readOnly}
      helpText={props.helpText}
      errorText={props.errorText}
      warningText={props.warningText}
    />
  </div>
)

export function selectDoc(): ComponentDocConfig {
  return {
    slug: 'select',
    name: 'Select',
    kitTitle: 'Select',
    figmaNode: '17650:274860',
    lede: 'A closed field that opens a list of options and holds one of them. Use it when the list is too long to show at once; when two or three options fit on screen, a radio button group shows them without a click.',
    description:
      'A labelled native select in three sizes, with disabled and error states. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Still a native select after Wave 5 landed: the platform menu keeps type-ahead, arrow keys and mobile pickers.',
    livePreview: <SelectPreview />,
    install: "import { Select, type SelectOption } from '@/components/ui/select'",
    anatomy: field({ helpText: 'Supporting text sits under the field.' }),
    anatomyLede:
      'The closed trigger is the only part the system draws. The option list is the browser’s own, so it takes no token from this system.',
    variantsLede:
      'Size shares its scale with Text input, so a select and the inputs beside it line up. Layout gives the kit’s Default, Inline and Fluid shapes.',
    variants: [
      { label: 'Size: Small', node: field({ size: 'sm' }) },
      { label: 'Size: Medium', node: field({ size: 'md' }) },
      { label: 'Size: Large', node: field({ size: 'lg' }) },
      { label: 'Layout: Inline', node: field({ layout: 'inline', helpText: 'Helper text' }) },
      { label: 'Layout: Fluid', node: field({ layout: 'fluid' }) },
    ],
    statesLede:
      'Disabled and error are values of the state prop. Hover and focus are pseudo-classes, so the page forces them here. Hover steps the fill to elevation-02, the kit’s field hover. Error and Warning draw the kit’s status icon before the chevron. Open is not drawn: the kit’s own Open state is a mock of the browser’s menu, which is what opens.',
    states: [
      { label: 'Enabled', node: field() },
      { label: 'Hover', node: field(), className: styles.forceHover },
      { label: 'Focus', node: field(), className: styles.forceFocus },
      { label: 'Disabled', node: field({ state: 'disabled' }) },
      { label: 'Error', node: field({ state: 'error', errorText: 'Choose an option to continue.' }) },
      { label: 'Warning', node: field({ warningText: 'This option is being retired.' }) },
      { label: 'Read-only', node: field({ readOnly: true }) },
    ],
    dos: [
      'Use a select for a long list of choices where only one can hold, such as a country or a region.',
      'Match its size to the text inputs in the same form. The two share one size scale.',
      'Show an error with errorText, so the red ring always comes with the reason for it.',
      'Keep at least two options. The type rejects fewer, because a select with one choice is a statement.',
    ],
    donts: [
      'Swap the native menu for a custom list to match the brand. Type-ahead, arrow keys and mobile pickers go with it.',
      'Try to style the open option list. It is drawn by the browser and takes no token from this system.',
      'Use a select for two or three options that fit on screen. A radio button group shows them without a click.',
      'Set state="error" without errorText. The ring says something is wrong without saying what.',
    ],
    a11y: [
      ['Keyboard', 'A native select: Tab reaches it, the arrow keys change the value, typing jumps to a matching option, and the platform opens its own menu.'],
      ['Roles', <>The browser supplies the roles. When the field is in error it carries <code>aria-invalid</code>; read-only carries <code>aria-readonly</code> and stays focusable, but will not open or change.</>],
      ['Labels', <>The label is a real <code>label</code> tied to the select. Help and error text are linked with <code>aria-describedby</code>, and error text is announced as it appears.</>],
      ['Focus', <>A 2px ring inside the trigger in <code>primary</code>’s focus colour while the field has focus, replacing the browser outline. In error it stays <code>danger</code>.</>],
      ['Mobile', 'On touch devices the platform shows its own picker, sized for fingers, which a custom list would have to rebuild.'],
    ],
    parity: [
      ['Size', 'Small · Medium · Large', 'size', 'sm, md and lg. One to one.'],
      ['Style', 'Default · Inline', 'layout', 'Both. Inline’s trigger has no fill or edge at rest and hugs its value, with the label and message beside it.'],
      ['State', 'Enabled · Disabled · Error · Warning', 'state', 'Error and Warning follow errorText and warningText and draw the status icon 8 before the chevron. Disabled fills the trigger with the disabled tone, as Select’s own set draws it.'],
      ['State', 'Read-only', 'readOnly', 'A native select has no readonly, so the trigger stays focusable with aria-readonly and refuses to open or change. No fill, a plain outline rule.'],
      ['State', 'Focus · Hover', '—', 'Pseudo-classes (governance rule 7). Hover is :hover on the trigger and steps the fill to elevation-02. Focus is :focus-within.'],
      ['Open', 'False · True', '—', 'The kit also draws it as State=Open. The open menu is the browser’s, so it is runtime state with nothing to draw.'],
      ['State', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Set', 'Select - Fluid', 'layout="fluid"', 'A 64px box, the label inside, the value row at 18, a plain outline rule.'],
      ['Trigger value', 'Empty in every variant but Read-only', '—', 'The kit draws no value in the trigger except in Read-only, a slip; the code shows the value, styled as Read-only draws it.'],
    ],
    related: [
      { href: '/docs/components/text-input', title: 'Text input', why: 'the trigger’s treatment and sizes' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'when the options fit on screen' },
      { href: '/docs/components/menu', title: 'Menu', why: 'for actions, not values' },
      { href: '/docs/components/overlay', title: 'Overlay', why: 'the surface its menu does not use' },
    ],
  }
}
