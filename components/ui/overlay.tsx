'use client'

import { useEffect, useRef } from 'react'

/** Contract: docs/contracts/overlay.md (1.0.0) — the shared Wave 5 base. */
export type DismissOptions = {
  open: boolean
  onDismiss: () => void
  /** Modal overlays trap focus; tooltips and non-modal popovers do not. */
  trapFocus?: boolean
  escape?: boolean
  outside?: boolean
}

/**
 * The one dismiss implementation. Every overlay calls this rather than wiring
 * its own listeners, which is what stops five components drifting into five
 * slightly different ideas of what Escape does.
 */
export function useOverlay<T extends HTMLElement>({
  open,
  onDismiss,
  trapFocus = false,
  escape = true,
  outside = true,
}: DismissOptions) {
  const ref = useRef<T>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    // Remember the trigger before focus moves, so it can be restored on close.
    restoreTo.current = document.activeElement as HTMLElement | null

    const onKeyDown = (e: KeyboardEvent) => {
      if (escape && e.key === 'Escape') {
        e.stopPropagation()
        onDismiss()
        return
      }
      if (!trapFocus || e.key !== 'Tab' || !ref.current) return

      const focusable = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!outside || !ref.current) return
      if (!ref.current.contains(e.target as Node)) onDismiss()
    }

    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('pointerdown', onPointerDown, true)

    if (trapFocus) ref.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('pointerdown', onPointerDown, true)
      // Focus returns to the trigger on close, in every case.
      restoreTo.current?.focus?.()
    }
  }, [open, onDismiss, trapFocus, escape, outside])

  return ref
}
