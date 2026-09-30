'use client'

import { useEffect, useRef } from 'react'

/** Contract: docs/contracts/overlay.md (1.2.0) — the shared Wave 5 base. */
export type DismissOptions = {
  open: boolean
  /**
   * Receives the event that caused the dismissal, so an overlay can tell a
   * press on its own trigger from a press anywhere else. Most callers ignore it.
   */
  onDismiss: (event: KeyboardEvent | PointerEvent) => void
  /** Modal overlays trap focus; tooltips and non-modal popovers do not. */
  trapFocus?: boolean
  escape?: boolean
  outside?: boolean
}

type Layer = {
  el: () => HTMLElement | null
  trapFocus: boolean
  escape: boolean
  outside: boolean
}

// Every open overlay, in the order it opened. Each one still listens on the
// document, but the stack decides which of them a gesture reaches, which is
// what lets Escape close one overlay at a time instead of all of them.
const stack: Layer[] = []

// The layer that answers a key: the most recently opened one that either
// honours it or traps focus. A trapping layer that does not honour the gesture
// (a Modal with dismissible off) still owns it, so it reaches nothing beneath.
// A layer that neither honours nor traps is transparent to it.
const owner = (honours: (l: Layer) => boolean) => {
  for (let i = stack.length - 1; i >= 0; i--) {
    const l = stack[i]
    if (honours(l) || l.trapFocus) return l
  }
  return null
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

  // Callers pass onDismiss inline, so it is a new function on every render.
  // Reading it through a ref keeps it out of the effect below: were it a
  // dependency, any re-render of an open overlay would run the cleanup, which
  // sends focus back to the trigger and makes a trapped overlay take it again.
  const dismiss = useRef(onDismiss)
  useEffect(() => {
    dismiss.current = onDismiss
  })

  useEffect(() => {
    if (!open) return

    // Remember the trigger before focus moves, so it can be restored on close.
    restoreTo.current = document.activeElement as HTMLElement | null

    const layer: Layer = { el: () => ref.current, trapFocus, escape, outside }
    stack.push(layer)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Only the topmost layer answers, so nested overlays close one per press.
        if (owner((l) => l.escape) !== layer || !escape) return
        e.stopPropagation()
        dismiss.current(e)
        return
      }
      if (e.key !== 'Tab' || !ref.current) return
      // Only the topmost trap wraps Tab. A Tooltip opening inside a Modal does
      // not trap, so it does not take the Modal's trap away either.
      if (owner(() => false) !== layer) return

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

    // A press closes every overlay it lands outside of, down to the first
    // trapping one: that layer blocks the page beneath it, so nothing under it
    // can be pressed. A press inside a layer above does not count as outside
    // this one, so a Menu open inside a Modal closes on a press elsewhere in
    // the Modal and the Modal stays, while a press on the scrim closes both.
    const onPointerDown = (e: PointerEvent) => {
      if (!outside || !ref.current) return
      const target = e.target as Node
      for (let i = stack.indexOf(layer) + 1; i < stack.length; i++) {
        const above = stack[i]
        if (above.trapFocus || above.el()?.contains(target)) return
      }
      if (!ref.current.contains(target)) dismiss.current(e)
    }

    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('pointerdown', onPointerDown, true)

    if (trapFocus) ref.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('pointerdown', onPointerDown, true)
      const i = stack.indexOf(layer)
      if (i !== -1) stack.splice(i, 1)
      // Focus returns to the trigger on close, in every case.
      restoreTo.current?.focus?.()
    }
  }, [open, trapFocus, escape, outside])

  return ref
}
