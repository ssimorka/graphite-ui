import type { ButtonVariant } from '@/components/ui/button'
import type { Example } from '../example-file'

// Button's Code tab, built from the preview's two controls. The preview reads
// the same lists, so a control cannot offer a value the check never builds.

export const VARIANTS = [
  'primary',
  'outlined',
  'ghost',
  'secondary',
  'secondary-outlined',
  'secondary-ghost',
  'danger',
  'danger-ghost',
] as const satisfies readonly ButtonVariant[]

export const SIZES = [
  'sm', 'md', 'lg', 'xl', '2xl', 'expressive',
  'icon-sm', 'icon', 'icon-lg', 'icon-xl', 'icon-expressive',
] as const
export type Size = (typeof SIZES)[number]

export const isIcon = (s: Size) => s === 'icon' || s.startsWith('icon-')

export const LABEL: Record<ButtonVariant, string> = {
  primary: 'Save changes',
  outlined: 'Back',
  ghost: 'Cancel',
  secondary: 'Export',
  'secondary-outlined': 'Preview',
  'secondary-ghost': 'Skip',
  danger: 'Delete project',
  'danger-ghost': 'Remove',
}

export const controls = { variant: VARIANTS, size: SIZES }

export function exampleFor({ variant, size }: { variant: ButtonVariant; size: Size }): Example {
  // Defaults are left off, the way a caller would write it.
  const variantProp = variant === 'secondary' ? '' : ` variant="${variant}"`
  const sizeProp = size === 'md' ? '' : ` size="${size}"`
  const imports = {
    '@/components/ui/button': ['Button'],
    '@/components/kit-icon': ['KitIcon'],
  }
  if (isIcon(size)) {
    return {
      imports,
      jsx: `<Button${variantProp}${sizeProp} aria-label="Add">\n  <KitIcon name="plus" />\n</Button>`,
    }
  }
  return {
    imports,
    jsx: `<Button${variantProp}${sizeProp}>\n  ${LABEL[variant]}\n  <KitIcon name="plus" />\n</Button>`,
  }
}
