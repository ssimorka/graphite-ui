import { ProgressBar } from '@/components/ui/progress-bar'
import type { ComponentDocConfig } from '../types'
import { ProgressBarPreview } from './progress-bar-preview'

export function progressBarDoc(): ComponentDocConfig {
  return {
    slug: 'progress-bar',
    name: 'Progress bar',
    kitTitle: 'Progress bar',
    figmaNode: '9506:402924',
    lede: 'A thin bar that shows how far a task has run, or that it is running when the end is unknown. Use it for work in motion, not for a quantity at rest like storage used.',
    description:
      'A labelled bar for a task in progress, with its helper text and its outcome. Anatomy, variants, API, tokens and accessibility, generated from the contract.',
    tocNote: 'The indeterminate sweep reads the shared motion tokens, so the Spinner that follows it cannot drift into a different timing.',
    livePreview: <ProgressBarPreview />,
    install: "import { ProgressBar } from '@/components/ui/progress-bar'",
    anatomyLede:
      'The label above the track, which is also its accessible name, and an optional helper below, 8 from it on each side. Nothing is ever painted inside the track.',
    anatomy: <ProgressBar value={60} label="Uploading report.pdf" helperText="About a minute left" />,
    variantsLede:
      'Determinate when you know the total, indeterminate when you do not. Size is a 4px or 8px track. Alignment puts the label above, beside, or above and indented. Once the task ends, Success and Error fill the track and say so.',
    variants: [
      {
        label: 'Variant: Determinate',
        node: <ProgressBar value={60} label="Uploading report.pdf" helperText="About a minute left" />,
      },
      {
        label: 'Variant: Indeterminate',
        node: <ProgressBar variant="indeterminate" label="Preparing the export" helperText="This can take a while" />,
      },
      {
        label: 'Size: Big',
        node: <ProgressBar value={60} size="lg" label="Uploading report.pdf" helperText="About a minute left" />,
      },
      {
        label: 'Alignment: Inline',
        node: <ProgressBar value={60} alignment="inline" label="Uploading" />,
      },
      {
        label: 'Alignment: Indent',
        node: <ProgressBar value={60} alignment="indent" label="Uploading report.pdf" helperText="About a minute left" />,
      },
      {
        label: 'State: Success',
        node: <ProgressBar status="success" label="Uploading report.pdf" successText="Upload complete" />,
      },
      {
        label: 'State: Error',
        node: <ProgressBar status="error" label="Uploading report.pdf" errorText="The upload failed. Try again." />,
      },
    ],
    dos: [
      'Name the task in label and let the bar paint it. Use hideLabel only when a richer label already sits beside it, and the bar still keeps the name.',
      'Switch to determinate as soon as you know the total. A bar heading toward an end is easier to wait on.',
      'Name the task in label, like “Uploading report.pdf”, rather than “Progress”.',
      'Set status to success or error when the task ends, with a message that says what happened next.',
    ],
    donts: [
      'Paint the percentage inside the bar. The track has no room and no slot for text; put it in the label or the helper.',
      'Turn the fill green or red while the task is still running. Success and danger are for a finished task only.',
      'Give the sweep its own duration or easing. The motion tokens set it once for every indeterminate indicator.',
      'Use it for a value that is not moving, like a quota. It announces as progress, so a reader waits for it to finish.',
    ],
    a11y: [
      ['Roles', 'role="progressbar" with aria-valuemin 0, aria-valuemax 100 and aria-valuenow set to the current value.'],
      ['Indeterminate', 'All three value attributes are dropped. Leaving out aria-valuenow is what tells assistive tech the end is unknown.'],
      ['Labels', 'label is required, painted, and names the bar through aria-labelledby; hideLabel keeps it as the name while dropping it from view. The helper, success or error message is linked with aria-describedby.'],
      ['Outcome', 'Success and error set the value to 100 and announce their message as a status when it arrives. The status icon is decorative: the message carries the meaning.'],
      ['Values', 'Values outside 0 to 100 are clamped before they reach the width or ARIA, so the two always agree.'],
      ['Motion', 'The sweep is a quarter of the track at a constant speed, as the kit runs it. Under prefers-reduced-motion the width stops animating and the sweep slows to 3 seconds rather than stopping, so the bar still reads as working.'],
    ],
    parity: [
      ['Progress', '0% · 25% · 50% · 75% · Indeterminate · Success · Error', 'value · variant · status', 'The percentages are value, and any number from 0 to 100 works. Indeterminate is variant="indeterminate". Success and Error are status.'],
      ['State', 'Active · Success · Error', 'status', 'A finished bar fills in success or danger, with the kit’s status icon at the end of the label row and its message in place of the helper.'],
      ['Size', 'Small · Big', 'size', 'sm and lg: a 4px or 8px track.'],
      ['Alignment', 'Default · Inline · Indent', 'alignment', 'Label above; beside, hugging, 16 before the track and with no helper; or above in Input Label type with label and helper indented 16. The kit draws Inline only with a 4px track; the code allows either size.'],
      ['Track', 'border-subtle-00', '—', 'outline-subtle, the kit’s value. It was outline, a much darker track, until 2.0.0.'],
      ['Status icons · messages', 'Carbon status icons; Caption/1 and Helper Text', '—', 'One 12/16 message style for all three; the kit’s own Succeeded and Failed status icons.'],
    ],
    related: [
      { href: '/docs/components/notification', title: 'Notification', why: 'to say more than one line can' },
      { href: '/docs/components/button', title: 'Button', why: 'to start or cancel the task' },
    ],
  }
}
