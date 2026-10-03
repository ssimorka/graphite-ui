import type { ComponentDocConfig } from '../types'
import shared from '../component-doc.module.scss'
import styles from './tooltip.module.scss'
import { TooltipPreview, TooltipStill } from './tooltip-preview'

const still = (
  placement: 'top' | 'bottom' | 'left' | 'right',
  align: 'start' | 'center' | 'end' = 'center',
  type: 'standard' | 'icon' | 'definition' = 'standard',
) => (
  <div
    className={`${styles.stage} ${placement === 'left' ? styles.stageLeft : ''} ${placement === 'right' ? styles.stageRight : ''}`}
  >
    <TooltipStill placement={placement} align={align} type={type} />
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
    tocNote: 'The one overlay the kit draws inverse, and the one it does not draw square: the bubble keeps a 2px corner. The bubbles on this page open once on load; hover away and they close.',
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
      'Type sets the bubble’s padding, caret and gap: Standard for a labelled control, Icon button for an icon-only one, Definition for a term in running text. Placement chooses the side, and align where along the trigger the bubble sits above or below it; the caret stays on the trigger either way. It does not flip when it runs out of room.',
    variants: [
      { label: 'Placement: Top', node: still('top') },
      { label: 'Placement: Bottom', node: still('bottom') },
      { label: 'Placement: Left', node: still('left') },
      { label: 'Placement: Right', node: still('right') },
      { label: 'Align: Start', node: still('top', 'start') },
      { label: 'Align: End', node: still('top', 'end') },
      { label: 'Type: Icon button', node: still('top', 'center', 'icon') },
      { label: 'Type: Definition', node: still('bottom', 'center', 'definition') },
    ],
    dos: [
      'Put the tooltip on something focusable, a Button or a link, so keyboard users get it as well as pointer users.',
      'Keep it to one short line that adds to a label the reader can already see.',
      'Give an icon-only button its own aria-label as well, and type="icon" for the kit’s tight bubble. The tooltip adds to the name; it does not supply it.',
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
      ['Roles', <>The bubble is <code>role=&quot;tooltip&quot;</code>. While it is open, the trigger itself carries <code>aria-describedby</code> pointing at it, alongside any description the trigger already had. It describes; it does not name, so keep the trigger’s own name complete.</>],
      ['Focus', 'It never takes focus and never traps it. The trigger keeps focus the whole time.'],
      ['Pointer', 'The pointer can move from the trigger onto the bubble and it stays open, so it can be read at any speed or magnified. It closes once the pointer leaves both.'],
      ['Contrast', <>Text is <code>background</code> on <code>on-background</code>: the kit draws the bubble inverse, so it stands off the page in either mode without an edge. A definition term is <code>on-surface-variant</code> over a <code>secondary</code> dotted rule.</>],
      ['Motion', 'It fades in on the fast motion step, opacity only, and appears at once under prefers-reduced-motion.'],
    ],
    parityLede:
      'The kit’s Tooltip page has two public sets: Tooltip, and the Tooltip body item it is built from. Type, Position and Alignment map across; Visible is a state Figma draws because it has no other way to show it, and delay has no kit axis at all, since a frame cannot hold time.',
    parity: [
      ['Type', 'Standard · Definition · Icon button', 'type', 'standard, definition and icon, each with the kit’s padding (16; 8 by 16; 2 by 16), caret (12 by 6, or 8 by 4 for Icon) and gap (8, 4, 4). Definition renders its own term: on-surface-variant over a dotted secondary rule that turns primary on hover and focus.'],
      ['Position', 'Top · Bottom · Left · Right', 'placement', 'One to one. Definition is drawn above and below only.'],
      ['Alignment', 'Start · Center · End', 'align', 'Top and Bottom only, as drawn. Start and End put the caret 16 from that edge, on the trigger’s centre.'],
      ['Bubble', 'background-inverse · icon-inverse', '—', 'on-background with background text, no edge, a 2px corner, Tooltip type 12/16 Medium.'],
      ['Definition: Top, Center', 'No bubble drawn', '—', 'A kit slip: the variant is empty. Built from Bottom Center, as is Top Start, which the kit draws 26 off its trigger.'],
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
