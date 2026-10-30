import type { FieldSize } from '@/components/ui/text-input'
import type { Example } from '../example-file'

// Number input's Code tab: the field and the state it reports into.

export const LAYOUTS = ['fixed', 'fluid'] as const
export type Layout = (typeof LAYOUTS)[number]
export const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly FieldSize[]
export const STATUSES = ['enabled', 'error', 'warning', 'disabled', 'read-only'] as const
export type Status = (typeof STATUSES)[number]

export const MIN = 0
export const MAX = 10
export const ERROR = `Enter a number from ${MIN} to ${MAX}`
export const WARNING = 'More than 8 may take a while'

export const controls = { layout: LAYOUTS, size: SIZES, status: STATUSES }

export function exampleFor({ layout, size, status }: { layout: Layout; size: FieldSize; status: Status }): Example {
  const props = [
    '  label="Guests"',
    `  helpText="From ${MIN} to ${MAX}"`,
    `  min={${MIN}}`,
    `  max={${MAX}}`,
    ...(layout === 'fixed' ? [] : ['  layout="fluid"']),
    ...(layout === 'fluid' || size === 'md' ? [] : [`  size="${size}"`]),
    ...(status === 'error' ? [`  errorText="${ERROR}"`] : []),
    ...(status === 'warning' ? [`  warningText="${WARNING}"`] : []),
    ...(status === 'disabled' ? ['  disabled'] : []),
    ...(status === 'read-only' ? ['  readOnly'] : []),
    '  value={value}',
    '  onChange={setValue}',
  ]
  return {
    imports: { react: ['useState'], '@/components/ui/number-input': ['NumberInput'] },
    body: 'const [value, setValue] = useState<number | null>(4)',
    jsx: `<NumberInput\n${props.join('\n')}\n/>`,
  }
}
