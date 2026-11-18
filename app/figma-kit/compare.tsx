'use client'

import { DataTable } from '@/components/ui/data-table'

type Row = { feature: string; free: string; pro: string }

// The two editions, side by side. Each fact here is one the maintainer has
// stated for the listings; the counts match the snapshot (45 component pages,
// 2,630 public variants in docs/tokens/figma-components.json, 18 pages in
// FREE_KIT_PAGES). Change a listing, change this.
const ROWS: Row[] = [
  {
    feature: 'Foundations: color, type, spacing, radius, layout, motion',
    free: 'Yes',
    pro: 'Yes',
  },
  { feature: 'Components', free: '18 core components', pro: 'All 45 component pages' },
  { feature: 'Variants', free: 'For the 18 core components', pro: '2,630' },
  { feature: 'Icons', free: 'Regular weight (996 icons)', pro: 'Regular, Bold and Solid' },
  { feature: 'Light and dark themes', free: 'Yes', pro: 'Yes' },
  { feature: 'A year of updates', free: 'No', pro: 'Yes' },
  {
    feature: 'Price',
    free: '$0',
    pro: 'Solo $79 launch price, then $99. Team $249 for up to 5 seats.',
  },
]

/** The Free and Pro comparison, on the governed Data table. */
export function KitCompare() {
  return (
    <DataTable<Row>
      caption="Free and Pro"
      columns={[
        { key: 'feature', header: 'What you get' },
        { key: 'free', header: 'Free' },
        { key: 'pro', header: 'Pro' },
      ]}
      rows={ROWS}
      getRowKey={(r) => r.feature}
      size="lg"
    />
  )
}
