import type { ComponentDocConfig } from '../types'
import { DropdownPreview, DropdownStill } from './dropdown-preview'

export function dropdownDoc(): ComponentDocConfig {
  return {
    slug: 'dropdown',
    name: 'Dropdown',
    kitTitle: 'Dropdown',
    figmaNode: '14032:290635',
    lede: 'A single choice from a list the page draws itself. Use Select first: it is the native choice and works everywhere. Reach for Dropdown when the choice needs the kit’s list, with its rows, rules and selected check.',
    description:
      'A select-only combobox in Fixed, Inline and Fluid at three sizes, with the kit’s list. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s G2 wave. Dropdown and Combo box so far; Multi-select and Filterable multi-select follow.',
    livePreview: <DropdownPreview />,
    install:
      "import { ComboBox, Dropdown } from '@/components/ui/dropdown'\nimport type { DropdownOption } from '@/components/ui/dropdown'",
    anatomy: <DropdownStill chosen />,
    anatomyLede:
      'The label, then the trigger: the chosen value (or the Prompt text) and a chevron, on surface-variant with a rule under it. Opened, the list hangs under the trigger at its width: rows at the trigger’s height, each with a rule 16 in at its top, the chosen one filled with primary-container and checked.',
    variantsLede:
      'Style puts the label above (Fixed) or beside (Inline, which drops the trigger’s fill and rule). Fluid is a 64px box with the label inside. Size sets the trigger and the rows: 48, 40 or 32.',
    variants: [
      { label: 'Fixed: Large', node: <DropdownStill chosen /> },
      { label: 'Fixed: Medium', node: <DropdownStill chosen size="md" /> },
      { label: 'Fixed: Small', node: <DropdownStill chosen size="sm" /> },
      { label: 'Inline', node: <DropdownStill chosen layout="inline" /> },
      { label: 'Fluid', node: <DropdownStill chosen layout="fluid" /> },
      { label: 'Nothing chosen', node: <DropdownStill /> },
      { label: 'Combo box', node: <DropdownStill kind="combo" chosen /> },
      { label: 'Combo box: empty', node: <DropdownStill kind="combo" /> },
      { label: 'Combo box: Fluid', node: <DropdownStill kind="combo" layout="fluid" chosen /> },
    ],
    statesLede:
      'Focus and Open take the 2px focus ring. Error takes the danger ring and the status glyph before the chevron; Warning the warning glyph. Disabled takes the disabled fill. Read-only drops the fill and the chevron.',
    states: [
      { label: 'Enabled', node: <DropdownStill chosen /> },
      { label: 'Error', node: <DropdownStill status="error" /> },
      { label: 'Warning', node: <DropdownStill status="warning" chosen /> },
      { label: 'Disabled', node: <DropdownStill status="disabled" chosen /> },
      { label: 'Read-only', node: <DropdownStill status="read-only" chosen /> },
      { label: 'Read-only, empty', node: <DropdownStill status="read-only" /> },
      { label: 'Combo box: Error', node: <DropdownStill kind="combo" status="error" /> },
      { label: 'Combo box: Disabled', node: <DropdownStill kind="combo" status="disabled" chosen /> },
    ],
    dos: [
      'Start with Select. Use Dropdown when the list must look like the kit’s.',
      'Keep option labels short enough for the trigger.',
      'Give it a label that says what is being chosen.',
      'Use Fluid inside a Fluid form, so it lines up with the fields around it.',
    ],
    donts: [
      'Use it for actions. That is a Menu or a Menu button.',
      'Use it for two or three options a reader should see at once. That is a Radio button group.',
      'Use it for a long list without filtering. Use Combo box, so the reader can type to find it.',
      'Leave it unlabelled.',
    ],
    a11y: [
      ['Roles', <>A <code>combobox</code> that opens a <code>listbox</code> of <code>option</code>s. Focus stays on the combobox; the option the keyboard is on is its <code>aria-activedescendant</code>.</>],
      ['Keyboard', 'Arrow Down, Arrow Up, Enter or Space opens. Arrows move, Home and End go to the ends, Enter or Space chooses, Escape closes. Typing jumps to the next option that starts with what was typed.'],
      ['Names', 'The combobox is named by its label and its value; the listbox by the label.'],
      ['Combo box', <>An editable <code>combobox</code> with <code>aria-autocomplete=&quot;list&quot;</code>: typing filters and opens the list, arrows move, Enter chooses, Escape closes (or clears what was typed). The clear button is “Clear selected item”; a filter that leaves nothing reads “No matches”.</>],
      ['Focus', <>A 2px <code>--graphite-primary-focus</code> ring on the trigger, and inside the row the keyboard is on.</>],
    ],
    parityLede:
      'The kit’s Dropdown page has eight public sets, four kinds in Default and Fluid. This is the first kind, Dropdown; the other three extend the same contract as they land.',
    parity: [
      ['Set', 'Dropdown - Default · Fluid', 'layout', 'fixed and inline for Default, fluid for Fluid.'],
      ['Style', 'Fixed · Inline', 'layout', 'Label above or beside.'],
      ['Size', 'Large · Medium · Small', 'size', 'The trigger and the rows at 48, 40 and 32.'],
      ['State', 'Enabled · Hover · Focus · Error · Warning · Disabled · Read-only', '—', 'Hover draws nothing on the trigger in the kit; Focus and Open are the trigger’s; the rest are props.'],
      ['State', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Open · Selected', 'Boolean', 'value', 'The list showing, and a value chosen.'],
      ['List item', 'Enabled · Hover · Selected · Selected + Hover · Disabled', 'options', 'Drawn from the active and selected option.'],
      ['Trigger', 'surface-variant · outline', '—', 'Not the field shell: all eight Dropdown sets draw it this way, so it is kept (rule 7).'],
      ['Set', 'Combo box - Default · Fluid', 'ComboBox', 'Typed to filter; the clear and divider show once a value is chosen. The kit has no Inline Combo box.'],
      ['AI layer · AI label', 'Instances', '—', 'Not built: the AI sets are ungoverned.'],
    ],
    related: [
      { href: '/docs/components/select', title: 'Select', why: 'the native single choice, and the default' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'for a few options shown at once' },
      { href: '/docs/components/menu-button', title: 'Menu buttons', why: 'for actions' },
    ],
  }
}
