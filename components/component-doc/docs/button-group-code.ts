import type { Example } from '../example-file'

// Button group's Code tab, from Actions and Primary.

export const COUNTS = ['2', '3'] as const
export type Count = (typeof COUNTS)[number]
export const PRIMARIES = ['last', 'none'] as const
export type Primary = (typeof PRIMARIES)[number]

export type Action = { label: string; variant: 'primary' | 'outlined' | 'ghost' }

export function actionsFor(count: Count, primary: Primary): Action[] {
  const all: Action[] = [
    { label: 'Cancel', variant: 'ghost' },
    { label: 'Save draft', variant: 'outlined' },
    // With no primary, nothing in the group is filled: Publish drops to the
    // same outlined rank as Save draft rather than to a filled secondary,
    // which would mix the green family into a violet group.
    { label: 'Publish', variant: primary === 'last' ? 'primary' : 'outlined' },
  ]
  // Two actions drop the middle one, so the primary (if any) stays last.
  return count === '2' ? [all[0], all[2]] : all
}

export const controls = { count: COUNTS, primary: PRIMARIES }

export function exampleFor({ count, primary }: { count: Count; primary: Primary }): Example {
  const body = actionsFor(count, primary)
    .map((a) => `  <Button variant="${a.variant}">${a.label}</Button>`)
    .join('\n')
  return {
    imports: {
      '@/components/ui/button': ['Button'],
      '@/components/ui/button-group': ['ButtonGroup'],
    },
    jsx: `<ButtonGroup>\n${body}\n</ButtonGroup>`,
  }
}
