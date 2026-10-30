import type { Example } from '../example-file'

// Menu buttons' Code tab: the chosen set, its items and handlers, as one file.

export const FORMS = ['menu', 'combo', 'overflow'] as const
export type Form = (typeof FORMS)[number]
export const SIZES = ['sm', 'md', 'lg'] as const
export type Size = (typeof SIZES)[number]
export const PLACEMENTS = ['bottom', 'top'] as const
export type Placement = (typeof PLACEMENTS)[number]
export const ALIGNS = ['start', 'end'] as const
export type Align = (typeof ALIGNS)[number]

export const controls = { form: FORMS, size: SIZES, placement: PLACEMENTS, align: ALIGNS }

type Values = { form: Form; size: Size; placement: Placement; align: Align }

const ITEMS = `const items: [MenuItem, ...MenuItem[]] = [
  { label: 'Duplicate', onSelect: duplicate },
  { label: 'Rename', onSelect: rename },
  { label: 'Move to folder', onSelect: move },
  { kind: 'separator' },
  { label: 'Delete', onSelect: remove, destructive: true },
]`

const STUBS = [
  'function duplicate() {\n  // Duplicate the file.\n}',
  'function rename() {\n  // Rename the file.\n}',
  'function move() {\n  // Move the file to a folder.\n}',
  'function remove() {\n  // Delete the file.\n}',
]

export function exampleFor({ form, size, placement, align }: Values): Example {
  const props = [
    ...(size === 'lg' ? [] : [`  size="${size}"`]),
    ...(placement === 'bottom' ? [] : ['  placement="top"']),
    ...(form === 'overflow' && align === 'end' ? ['  align="end"'] : []),
  ]
  const component = form === 'menu' ? 'MenuButton' : form === 'combo' ? 'ComboButton' : 'OverflowMenu'
  const head =
    form === 'menu' ? ['  label="Actions"'] : form === 'combo' ? ['  label="Save"', '  onClick={save}'] : []
  const stubs = form === 'combo' ? ['function save() {\n  // Save the file.\n}', ...STUBS] : STUBS
  return {
    imports: {
      '@/components/ui/menu-button': [component],
      '@/components/ui/menu': ['type MenuItem'],
    },
    module: `${stubs.join('\n\n')}\n\n${ITEMS}`,
    jsx: `<${component}\n${[...head, ...props, '  items={items}'].join('\n')}\n/>`,
  }
}
