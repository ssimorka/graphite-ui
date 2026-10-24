/**
 * Motion tokens, read from script.
 *
 * The values live in app/globals.scss as --graphite-motion-*, checked against
 * the kit's Motion collection by token-drift. Script that has to wait out an
 * animation (unmounting after an exit, say) reads the same variable rather
 * than carrying its own copy of the number, so a change in the kit reaches it.
 *
 * Reads the element given, or <html>, so a subtree that overrides a token (or
 * simulates reduced motion with data-motion="reduce") is respected.
 */

export type MotionDuration = 'instant' | 'fast' | 'base' | 'slow' | 'emphasis'

/** A duration token in ms, or `fallback` where there is no DOM to read. */
export function motionMs(
  token: MotionDuration | 'delay-tooltip',
  { el, fallback = 0 }: { el?: Element | null; fallback?: number } = {},
): number {
  if (typeof window === 'undefined') return fallback
  const name = token === 'delay-tooltip' ? '--graphite-motion-delay-tooltip' : `--graphite-motion-duration-${token}`
  const raw = getComputedStyle(el ?? document.documentElement).getPropertyValue(name).trim()
  const n = parseFloat(raw)
  if (Number.isNaN(n)) return fallback
  return raw.endsWith('ms') ? n : raw.endsWith('s') ? n * 1000 : n
}

/**
 * An easing or spring token as the CSS string it holds, for the Web
 * Animations API, which cannot read a var(). `fallback` where there is no DOM.
 */
export function motionEasing(
  token: 'out' | 'in-out' | 'linear' | 'spring-sheet',
  { el, fallback = 'ease-out' }: { el?: Element | null; fallback?: string } = {},
): string {
  if (typeof window === 'undefined') return fallback
  const name = token === 'spring-sheet' ? '--graphite-motion-spring-sheet' : `--graphite-motion-easing-${token}`
  return getComputedStyle(el ?? document.documentElement).getPropertyValue(name).trim() || fallback
}

/** True when the visitor, or an ancestor's data-motion="reduce", asks for less motion. */
export function prefersReducedMotion(el?: Element | null): boolean {
  if (typeof window === 'undefined') return false
  if (el?.closest('[data-motion="reduce"]')) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
