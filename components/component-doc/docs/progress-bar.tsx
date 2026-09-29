import { ProgressBar } from '@/components/ui/progress-bar'
import { Typography } from '@/components/ui/typography'
import type { ComponentDocConfig } from '../types'
import styles from './progress-bar.module.scss'
import { ProgressBarPreview } from './progress-bar-preview'

export function progressBarDoc(): ComponentDocConfig {
  return {
    slug: 'progress-bar',
    name: 'Progress bar',
    kitTitle: 'Progress bar',
    figmaNode: '9506:402924',
    lede: 'A thin bar that shows how far a task has run, or that it is running when the end is unknown. Use it for work in motion, not for a quantity at rest like storage used.',
    description:
      'A determinate or indeterminate bar for a task in progress. Anatomy, variants, API, tokens and accessibility, generated from the contract.',
    tocNote: 'The indeterminate sweep reads the shared motion tokens, so the Spinner that follows it cannot drift into a different timing.',
    livePreview: <ProgressBarPreview />,
    install:
      "import { ProgressBar } from '@/components/ui/progress-bar'\nimport { Typography } from '@/components/ui/typography'",
    anatomyLede:
      'No slots. The bar is a track and a fill and nothing else: any visible label or percentage sits outside it, in Typography, as it does here.',
    anatomy: (
      <div className={styles.stack}>
        <Typography variant="caption">Uploading report.pdf, 60%</Typography>
        <ProgressBar value={60} label="Uploading report.pdf" />
      </div>
    ),
    variantsLede:
      'Determinate when you know the total, indeterminate when you do not. The track, fill and height are the same in both.',
    variants: [
      {
        label: 'Variant: Determinate',
        node: <ProgressBar value={60} label="Determinate example" />,
      },
      {
        label: 'Variant: Indeterminate',
        node: <ProgressBar variant="indeterminate" label="Indeterminate example" />,
      },
    ],
    dos: [
      'Put the visible label and percentage outside the bar, in Typography, and pass the same task name to label.',
      'Switch to determinate as soon as you know the total. A bar heading toward an end is easier to wait on.',
      'Name the task in label, like “Uploading report.pdf”, rather than “Progress”.',
      'Say that the task finished or failed with a Notification once the bar is done.',
    ],
    donts: [
      'Paint the percentage inside the bar. It is a 4px track with no room and no slot for text.',
      'Turn the fill green on success or red on failure. The fill is always primary, whatever the outcome.',
      'Give the sweep its own duration or easing. The motion tokens set it once for every indeterminate indicator.',
      'Use it for a value that is not moving, like a quota. It announces as progress, so a reader waits for it to finish.',
    ],
    a11y: [
      ['Roles', 'role="progressbar" with aria-valuemin 0, aria-valuemax 100 and aria-valuenow set to the current value.'],
      ['Indeterminate', 'All three value attributes are dropped. Leaving out aria-valuenow is what tells assistive tech the end is unknown.'],
      ['Labels', 'label is required and becomes aria-label. Nothing inside the bar is text, so this is its only name.'],
      ['Values', 'Values outside 0 to 100 are clamped before they reach the width or ARIA, so the two always agree.'],
      ['Motion', 'Under prefers-reduced-motion the width stops animating and the sweep slows to 3 seconds rather than stopping, so the bar still reads as working.'],
    ],
    parity: [
      ['Progress', '0% · 25% · 50% · 75% · Indeterminate · Success · Error', 'value · variant', 'The percentages are value, and any number from 0 to 100 works. Indeterminate is variant="indeterminate". Success and Error are outcomes, not amounts: see State.'],
      ['State', 'Active · Success · Error', '—', 'No counterpart. The contract allows no fill but primary, so the outcome is said around the bar, not by it.'],
      ['Size', 'Small · Big', '—', 'One height, a 4px track. The code has no size prop.'],
      ['Alignment', 'Default · Inline · Indent', '—', 'The kit’s alignments place its label and helper text around the bar. The code keeps text out of the component, so where it sits is the caller’s layout.'],
    ],
    related: [
      { href: '/docs/components/notification', title: 'Notification', why: 'to say it finished or failed' },
      { href: '/docs/components/typography', title: 'Typography', why: 'the label that sits outside it' },
      { href: '/docs/components/button', title: 'Button', why: 'to start or cancel the task' },
    ],
  }
}
