import type { ToastVariant } from '@/components/ui/toast'
import type { Example } from '../example-file'

// Toast's Code tab. A toast needs two pieces, the provider once around the
// app and the hook under it, so the file shows both: a button that calls the
// hook, rendered inside the provider. In a real app the provider goes in the
// root layout.

export const VARIANTS = ['info', 'success', 'warning', 'danger'] as const satisfies readonly ToastVariant[]

export const COPY: Record<ToastVariant, { title: string; body: string }> = {
  info: { title: 'Export started', body: 'We will email you when the file is ready.' },
  success: { title: 'Changes saved', body: 'Your theme is live for everyone.' },
  warning: { title: 'Storage almost full', body: 'You have used 90% of your space.' },
  danger: { title: 'Upload failed', body: 'The file is larger than 500kb.' },
}

export const controls = { variant: VARIANTS, highContrast: [false, true], actionable: [false, true] }

type Values = { variant: ToastVariant; highContrast: boolean; actionable: boolean }

export function exampleFor({ variant, highContrast, actionable }: Values): Example {
  const props = [
    ...(variant === 'info' ? [] : [`variant: '${variant}',`]),
    `title: '${COPY[variant].title}',`,
    `body: '${COPY[variant].body}',`,
    actionable ? "action: { label: 'Undo', onClick: undo }," : "timestamp: 'Time stamp [12:04:31]',",
    ...(highContrast ? ['highContrast: true,'] : []),
  ]
  const undo = actionable ? `\n\n  function undo() {\n    // Reverse the change here.\n  }` : ''
  return {
    imports: {
      '@/components/ui/button': ['Button'],
      '@/components/ui/toast': ['ToastProvider', 'useToast'],
    },
    module: `function SaveButton() {
  const toast = useToast()${undo}

  return (
    <Button
      onClick={() =>
        toast({
${props.map((p) => '          ' + p).join('\n')}
        })
      }
    >
      Save
    </Button>
  )
}`,
    // Once, around the app: in a real project this goes in app/layout.tsx.
    jsx: `<ToastProvider>\n  <SaveButton />\n</ToastProvider>`,
  }
}
