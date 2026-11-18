import { kitLink } from '@/lib/kit-links'

// The two editions as three plans: Free, and Pro sold as Solo or Team. Every
// fact here is one the maintainer has stated for the listings; the counts match
// the snapshot (45 component pages and 2,630 public variants in
// docs/tokens/figma-components.json, 18 pages in FREE_KIT_PAGES). Solo and Team
// are the same file, so they differ only in the header. Change a listing,
// change this.

export type Plan = {
  key: 'free' | 'solo' | 'team'
  name: string
  price: string
  note: string
  /** Shown above the name. Facts only: no "most popular". */
  tag?: string
  action: { label: string; variant: 'primary' | 'ghost' }
  link: ReturnType<typeof kitLink>
}

export const PLANS: Plan[] = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    // The table says what Free holds; a note here only repeated it.
    note: '',
    action: { label: 'Get the free kit', variant: 'ghost' },
    link: kitLink('free', 'gumroad', 'kit-page'),
  },
  {
    key: 'solo',
    name: 'Pro Solo',
    price: '$79',
    note: 'Then $99',
    tag: 'Launch price',
    action: { label: 'Get Pro', variant: 'primary' },
    link: kitLink('pro', 'gumroad', 'kit-page'),
  },
  {
    key: 'team',
    name: 'Pro Team',
    price: '$249',
    note: 'Up to 5 seats',
    action: { label: 'Get Team', variant: 'ghost' },
    link: kitLink('pro', 'gumroad', 'kit-page'),
  },
]
