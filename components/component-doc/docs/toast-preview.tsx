'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Toast, ToastProvider, useToast } from '@/components/ui/toast'
import type { ToastVariant } from '@/components/ui/toast'
import { DemoFrame } from '../demo-frame'
import styles from './toast.module.scss'

const COPY: Record<ToastVariant, { title: string; body: string }> = {
  info: { title: 'Export started', body: 'We will email you when the file is ready.' },
  success: { title: 'Changes saved', body: 'Your theme is live for everyone.' },
  warning: { title: 'Storage almost full', body: 'You have used 90% of your space.' },
  danger: { title: 'Upload failed', body: 'The file is larger than 500kb.' },
}

const now = () => new Date().toTimeString().slice(0, 8)

function codeFor(variant: ToastVariant, highContrast: boolean, actionable: boolean) {
  const props = [
    variant === 'info' ? '' : `\n  variant: '${variant}',`,
    `\n  title: '${COPY[variant].title}',`,
    `\n  body: '${COPY[variant].body}',`,
    actionable ? "\n  action: { label: 'Undo', onClick: undo }," : "\n  timestamp: 'Time stamp [12:04:31]',",
    highContrast ? '\n  highContrast: true,' : '',
  ].join('')
  return `// Once, around the app:\n<ToastProvider>{children}</ToastProvider>\n\n// Anywhere under it:\nconst toast = useToast()\ntoast({${props}\n})`
}

function Trigger({ variant, highContrast, actionable }: { variant: ToastVariant; highContrast: boolean; actionable: boolean }) {
  const toast = useToast()
  return (
    <Button
      variant="primary"
      onClick={() =>
        toast({
          variant,
          ...COPY[variant],
          highContrast,
          timestamp: `Time stamp [${now()}]`,
          action: actionable ? { label: 'Undo', onClick: () => {} } : undefined,
        })
      }
    >
      Show toast
    </Button>
  )
}

/**
 * Status, High contrast and Actionable, live. The button shows a real toast
 * at the top right of the window: it leaves after six seconds (an error stays
 * until closed), and holds while the pointer or focus is on it.
 */
export function ToastPreview() {
  const [variant, setVariant] = useState<ToastVariant>('success')
  const [highContrast, setHighContrast] = useState(false)
  const [actionable, setActionable] = useState(false)
  return (
    <ToastProvider>
      <DemoFrame
        controls={
          <>
            <Select
              label="Status"
              size="sm"
              value={variant}
              onChange={(v) => setVariant(v as ToastVariant)}
              options={[
                { value: 'info', label: 'Info' },
                { value: 'success', label: 'Success' },
                { value: 'warning', label: 'Warning' },
                { value: 'danger', label: 'Error' },
              ]}
            />
            <Select
              label="High contrast"
              size="sm"
              value={highContrast ? 'true' : 'false'}
              onChange={(v) => setHighContrast(v === 'true')}
              options={[
                { value: 'false', label: 'False' },
                { value: 'true', label: 'True' },
              ]}
            />
            <Select
              label="Actionable"
              size="sm"
              value={actionable ? 'true' : 'false'}
              onChange={(v) => setActionable(v === 'true')}
              options={[
                { value: 'false', label: 'False' },
                { value: 'true', label: 'True' },
              ]}
            />
          </>
        }
        preview={
          <div className={styles.stage}>
            <Trigger variant={variant} highContrast={highContrast} actionable={actionable} />
            <Toast
              variant={variant}
              {...COPY[variant]}
              highContrast={highContrast}
              timestamp="Time stamp [12:04:31]"
              action={actionable ? { label: 'Undo', onClick: () => {} } : undefined}
              onClose={() => {}}
            />
          </div>
        }
        code={codeFor(variant, highContrast, actionable)}
      />
    </ToastProvider>
  )
}

/** A still the server-rendered page can place. */
export function ToastStill({
  variant = 'info',
  highContrast = false,
  actionable = false,
}: {
  variant?: ToastVariant
  highContrast?: boolean
  actionable?: boolean
}) {
  return (
    <Toast
      variant={variant}
      {...COPY[variant]}
      highContrast={highContrast}
      timestamp="Time stamp [12:04:31]"
      action={actionable ? { label: 'Undo', onClick: () => {} } : undefined}
      onClose={() => {}}
    />
  )
}
