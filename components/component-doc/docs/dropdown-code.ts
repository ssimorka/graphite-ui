import type { DropdownOption } from '@/components/ui/dropdown'
import type { Example } from '../example-file'

// Dropdown's Code tab, from Kind, Style, Size and State. One page covers the
// four kinds the kit draws on its Dropdown page.

export const KINDS = ['dropdown', 'combo', 'multi', 'filterable'] as const
export type Kind = (typeof KINDS)[number]
export const LAYOUTS = ['fixed', 'inline', 'fluid'] as const
export type Layout = (typeof LAYOUTS)[number]
export const SIZES = ['sm', 'md', 'lg'] as const
export type Size = (typeof SIZES)[number]
export const STATUSES = ['enabled', 'error', 'warning', 'disabled', 'read-only'] as const
export type Status = (typeof STATUSES)[number]

export const OPTIONS: DropdownOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Match the system' },
  { value: 'contrast', label: 'High contrast' },
  { value: 'sepia', label: 'Sepia', disabled: true },
  { value: 'print', label: 'Print' },
]

export const ERROR = 'Choose a theme'
export const WARNING = 'High contrast overrides your source colour'

export const HELP: Record<Kind, string> = {
  dropdown: 'Applies to every page',
  combo: 'Type to filter',
  multi: 'Choose any number',
  filterable: 'Choose any number',
}

/** Combo box and the filterable multi-select have no inline style. */
export function layoutFor(kind: Kind, layout: Layout): Layout {
  return layout === 'inline' && (kind === 'combo' || kind === 'filterable') ? 'fixed' : layout
}

export const controls = { kind: KINDS, layout: LAYOUTS, size: SIZES, status: STATUSES }

type Values = { kind: Kind; layout: Layout; size: Size; status: Status }

export function exampleFor({ kind, layout, size, status }: Values): Example {
  const multi = kind === 'multi' || kind === 'filterable'
  const name = kind === 'combo' ? 'ComboBox' : multi ? 'MultiSelect' : 'Dropdown'
  const shown = layoutFor(kind, layout)
  const props = [
    ...(kind === 'filterable' ? ['  filterable'] : []),
    ...(multi ? ['  selectAll'] : []),
    `  label="${multi ? 'Themes' : 'Theme'}"`,
    '  options={options}',
    ...(shown === 'fixed' ? [] : [`  layout="${shown}"`]),
    // A fluid field fills its container, so it takes no size.
    ...(shown === 'fluid' || size === 'lg' ? [] : [`  size="${size}"`]),
    `  helpText="${HELP[kind]}"`,
    ...(status === 'error' ? [`  errorText="${ERROR}"`] : []),
    ...(status === 'warning' ? [`  warningText="${WARNING}"`] : []),
    ...(status === 'disabled' ? ['  disabled'] : []),
    ...(status === 'read-only' ? ['  readOnly'] : []),
    '  value={value}',
    '  onChange={setValue}',
  ]
  const data = OPTIONS.map(
    (o) => `  { value: '${o.value}', label: '${o.label}'${o.disabled ? ', disabled: true' : ''} },`,
  ).join('\n')
  return {
    imports: { react: ['useState'], '@/components/ui/dropdown': [name, 'type DropdownOption'] },
    module: `const options: DropdownOption[] = [\n${data}\n]`,
    body: `const [value, setValue] = ${multi ? 'useState<string[]>([])' : 'useState<string | null>(null)'}`,
    jsx: `<${name}\n${props.join('\n')}\n/>`,
  }
}
