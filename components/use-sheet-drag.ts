'use client'

import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react'
import { motionEasing, motionMs, prefersReducedMotion } from '@/lib/motion'

/**
 * Drag a sheet toward the edge it came from, and catch it mid-flight.
 *
 * The kit's rule: anything the reader drags can be caught mid-motion. So the
 * sheet's own movement (its entrance, a spring back, a fling away) is never a
 * thing to wait out. A press while it moves reads where it is right now,
 * commits that, and hands it to the pointer. The Web Animations API is what
 * makes that possible: a running animation can be asked for its current value
 * and stopped there, which a CSS transition cannot.
 *
 * On release it springs home on the sheet spring, or leaves for the edge if it
 * has travelled past a third of its size or is flung faster than half a pixel
 * a millisecond. Under reduced motion the pointer still moves it (direct
 * manipulation is not animation), but the release jumps instead of springing.
 *
 * `edge` is where the sheet lives: `bottom` drags down to dismiss, `left`
 * drags left. Spread the returned handler on the element that takes the
 * grab: a grabber, or the whole panel when it does not scroll that way.
 */
export function useSheetDrag<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    edge,
    onDismiss,
    onVelocity,
  }: {
    edge: 'bottom' | 'left'
    onDismiss: () => void
    /** Called with the drag's speed toward the edge, in px per ms, as it changes. */
    onVelocity?: (v: number) => void
  },
) {
  const flight = useRef<Animation | null>(null)
  const vertical = edge === 'bottom'

  // How far the sheet sits from home, toward its edge, in px.
  const offsetOf = (el: HTMLElement) => {
    const t = getComputedStyle(el).transform
    if (!t || t === 'none') return 0
    const m = new DOMMatrixReadOnly(t)
    return vertical ? m.m42 : -m.m41
  }
  const transformFor = (d: number) => (vertical ? `translateY(${d}px)` : `translateX(${-d}px)`)

  // Every running animation that moves the sheet (its CSS entrance, or a
  // spring or fling of ours), stopped where it is.
  const catchIt = (el: HTMLElement) => {
    const d = offsetOf(el)
    for (const a of el.getAnimations()) {
      const moves = (a.effect as KeyframeEffect | null)?.getKeyframes().some((k) => 'transform' in k)
      if (!moves) continue
      a.cancel()
    }
    flight.current = null
    el.style.transform = transformFor(d)
    return d
  }

  const fly = (el: HTMLElement, from: number, to: number, size: number, done?: () => void) => {
    const reduce = prefersReducedMotion(el)
    const slow = motionMs('slow', { el, fallback: 300 })
    // The spring's full slow step for the whole trip, less for what is left
    // of it, so a sheet caught near home does not drift there slowly.
    const duration = reduce ? 0 : Math.max(motionMs('fast', { el, fallback: 120 }), slow * Math.min(1, Math.abs(to - from) / size))
    const a = el.animate([{ transform: transformFor(from) }, { transform: transformFor(to) }], {
      duration,
      easing: motionEasing('spring-sheet', { el, fallback: 'ease-out' }),
      fill: 'forwards',
    })
    flight.current = a
    a.onfinish = () => {
      if (flight.current !== a) return
      flight.current = null
      el.style.transform = to === 0 ? '' : transformFor(to)
      a.cancel()
      done?.()
    }
  }

  const onPointerDown = (e: ReactPointerEvent) => {
    const el = ref.current
    if (!el || e.button !== 0) return
    // A bottom sheet whose content is scrolled down scrolls back up first: the
    // drag belongs to the sheet only from the top of its content.
    if (vertical) {
      for (let n = e.target as HTMLElement | null; n && n !== el.parentElement; n = n.parentElement) {
        if (n.scrollTop > 0) return
      }
    }
    const handle = e.currentTarget as HTMLElement
    const start = catchIt(el)
    const size = vertical ? el.offsetHeight : el.offsetWidth
    const x0 = e.clientX
    const y0 = e.clientY
    let decided = false
    let d = start
    let samples: [number, number][] = [[performance.now(), d]]

    const speed = () => {
      const now = performance.now()
      samples = samples.filter(([t]) => now - t < 100)
      if (samples.length < 2) return 0
      const [t0, d0] = samples[0]
      const [t1, d1] = samples[samples.length - 1]
      return t1 > t0 ? (d1 - d0) / (t1 - t0) : 0
    }

    const move = (ev: PointerEvent) => {
      const along = vertical ? ev.clientY - y0 : x0 - ev.clientX
      const across = vertical ? ev.clientX - x0 : ev.clientY - y0
      // Wait for the gesture to declare itself, so a scroll across the sheet
      // stays a scroll.
      if (!decided) {
        if (Math.hypot(along, across) < 6) return
        if (Math.abs(across) > Math.abs(along)) return end(ev, true)
        decided = true
        handle.setPointerCapture?.(ev.pointerId)
      }
      const raw = start + along
      // Past home it resists, so the sheet cannot be pulled off its edge.
      d = raw < 0 ? raw * 0.2 : raw
      el.style.transform = transformFor(d)
      samples.push([performance.now(), d])
      onVelocity?.(speed())
    }

    const end = (ev: PointerEvent, abandoned = false) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      handle.releasePointerCapture?.(ev.pointerId)
      if (!decided || abandoned) {
        // A tap, or a scroll: let anything we caught carry on home.
        if (start !== 0) fly(el, start, 0, size)
        else el.style.transform = ''
        return
      }
      const v = speed()
      onVelocity?.(v)
      if (d > size / 3 || v > 0.5) fly(el, d, size, size, onDismiss)
      else fly(el, d, 0, size)
    }
    const up = (ev: PointerEvent) => end(ev)

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  return { onPointerDown }
}
