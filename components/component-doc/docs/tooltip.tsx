import type { ComponentDocConfig } from '../types'
import shared from '../component-doc.module.scss'
import styles from './tooltip.module.scss'
import { TooltipPreview, TooltipStill } from './tooltip-preview'

const still = (placement: 'top' | 'bottom' | 'left' | 'right') => (
  <div
    className={`${styles.stage} ${placement === 'left' ? styles.stageLeft : ''} ${placement === 'right' ? styles.stageRight : ''}`}
  >
    <TooltipStill placement={placement} />
  </div>
)

export function tooltipDoc(): ComponentDocConfig {
  return {
    slug: 'tooltip',
    name: 'Tooltip',
    kitTitle: 'Tooltip',
    figmaNode: '3684:40507',
    lede: 'A short line of text that appears when a control is hovered or focused. Use it to add to a label the reader can already see, never to hold something they need, and never for anything they would want to click.',
    description:
      'A short line of text on hover or focus. Anatomy, placements, API, tokens and accessibility, generated from the contract.',
    tocNote: 'The one overlay the kit does not draw square: the bubble keeps a 2px corner. The bubbles on this page open once on load; hover away and they close.',
    livePreview: <TooltipPreview />,
    install: "import { Tooltip } from '@/components/ui/tooltip'",
    anatomyLede:
      'A trigger, which is any focusable element you pass as the child, and the content, which is a string. It is a string rather than a node on purpose: a tooltip with a link in it is a Popover.',
    anatomy: (
      <div className={styles.anatomy}>
        <span className={`${shared.marker} ${styles.markContent}`} aria-hidden="true">2</span>
        <span className={`${shared.marker} ${styles.markTrigger}`} aria-hidden="true">1</span>
        <TooltipStill />
      </div>
    ),
    variantsLede:
      'Placement is the one visual prop. The bubble centres on the trigger on the side you choose, and does not flip when it runs out of room.',
    variants: [
      { label: 'Placement: Top', node: still('top') },
      { label: 'Placement: Bottom', node: still('bottom') },
      { label: 'Placement: Left', node: still('left') },
      { label: 'Placement: Right', node: still('right') },
    ],
    dos: [
      'Put the tooltip on something focusable, a Button or a link, so keyboard users get it as well as pointer users.',
      'Keep it to one short line that adds to a label the reader can already see.',
      'Give an icon-only button its own aria-label as well. The tooltip adds to the name; it does not supply it.',
      'Raise the delay in a dense toolbar, where tooltips would otherwise flash as the pointer crosses it.',
    ],
    donts: [
      'Put a link or a button in the content. A tooltip you can click into is a Popover.',
      'Hide anything the reader needs in a tooltip. Touch screens never hover, so it must be extra, not essential.',
      'Wrap a disabled button. It cannot take focus, so keyboard users never see the explanation.',
      'Place it where the bubble would cross the edge of the screen. It will not move itself back.',
    ],
    a11y: [
      ['Keyboard', 'It opens when the trigger takes focus, after the same delay as hover, and closes on blur or Escape.'],
      ['Roles', <>The bubble is <code>role=&quot;tooltip&quot;</code>. While it is open, <code>aria-describedby</code> points at it from a span around the trigger, not from the focusable element itself, so some screen readers will not announce it. Keep the trigger’s own name complete.</>],
      ['Focus', 'It never takes focus and never traps it. The trigger keeps focus the whole time.'],
      ['Pointer', 'It closes as the pointer leaves the trigger. The bubble ignores the pointer, so it cannot be hovered to keep it open; keep the text short enough to read in passing.'],
      ['Contrast', <>Text is <code>on-surface</code> on <code>surface-elevated</code>, with an <code>outline</code> edge. The edge is required: in Light the bubble would otherwise match the page.</>],
      ['Motion', 'It fades in on the fast motion step, opacity only, and appears at once under prefers-reduced-motion.'],
    ],
    parityLede:
      'The kit’s Tooltip page has two public sets: Tooltip, and the Tooltip body item it is built from. The code exposes two props. Position maps across; the rest are types and alignments the code settles one way, or states Figma draws because it has no other way to show them. delay has no kit axis at all, since a frame cannot hold time.',
    parity: [
      ['Type', 'Standard · Definition · Icon button', '—', 'Standard is the component. Icon button is a Standard tooltip on an icon Button, which is composition. Definition, a dotted underline on a term, has no counterpart.'],
      ['Position', 'Top · Bottom · Left · Right', 'placement', 'One to one.'],
      ['Alignment', 'Start · Center · End', '—', 'No counterpart. The code always centres the bubble on the trigger.'],
      ['Visible', 'True · False', '—', 'Runtime state. Hover and focus open it; the kit draws both because Figma cannot.'],
    ],
    related: [
      { href: '/docs/components/popover', title: 'Popover', why: 'when the content is interactive' },
      { href: '/docs/components/button', title: 'Button', why: 'the usual trigger' },
      { href: '/docs/components/overlay', title: 'Overlay', why: 'where Escape comes from' },
      { href: '/docs/components/text-input', title: 'Text input', why: 'help text that stays visible' },
    ],
  }
}
