import type { ReactNode } from 'react'

/**
 * What a component page says that the contract cannot: the demos, the prose and
 * the kit reconciliation. Everything the contract does say (version, wave, slots,
 * props, tokens) is read from it by the template, so a config cannot restate it
 * and drift.
 */
export type ComponentDocConfig = {
  /** The contract's file name, and the page's URL segment. */
  slug: string
  /** Display name, as the contract spells it. */
  name: string
  /** The kit page's title ("Radio button"), or null where the kit has none. */
  kitTitle: string | null
  /** A node inside the kit to open instead of the page, e.g. the main set. */
  figmaNode?: string
  /** One or two sentences under the title. */
  lede: string
  /** For the meta description; falls back to the lede. */
  description?: string
  /** The TOC footnote under "Contract x.y.z". */
  tocNote: string
  /** A client component: Preview / Code tabs plus any controls. */
  livePreview: ReactNode
  /** The import line(s) shown under Installation. */
  install: string
  /** The component rendered once, as the anatomy diagram. */
  anatomy: ReactNode
  anatomyLede?: string
  variantsLede?: string
  /** Omit (or leave empty) to drop the section and its TOC entry. */
  variants?: { label: string; node: ReactNode }[]
  statesLede?: string
  /** `className` forces a pseudo-class state; see the component's own scss. */
  states?: { label: string; node: ReactNode; className?: string }[]
  /** Overrides the default swatch lookup for a contract token. */
  swatches?: Record<string, string | null>
  dos: string[]
  donts: string[]
  a11y: [string, ReactNode][]
  parityLede?: string
  /** [kit axis, values, code, how it maps]. Omit where the kit has no page. */
  parity?: [string, string, string, string][]
  related: { href: string; title: string; why: string }[]
}
