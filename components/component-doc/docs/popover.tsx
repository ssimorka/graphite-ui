import type { ComponentDocConfig } from '../types'
import shared from '../component-doc.module.scss'
import styles from './popover.module.scss'
import { PopoverPreview, PopoverStill } from './popover-preview'

const still = (
  placement: 'top' | 'bottom' | 'left' | 'right',
  align: 'start' | 'center' | 'end' = 'center',
  variant: 'default' | 'tab-tip' = 'default',
) => (
  <div
    className={`${styles.stage} ${placement === 'left' ? styles.stageLeft : ''} ${placement === 'right' ? styles.stageRight : ''}`}
  >
    <PopoverStill placement={placement} align={align} variant={variant} />
  </div>
)

export function popoverDoc(): ComponentDocConfig {
  return {
    slug: 'popover',
    name: 'Popover',
    kitTitle: 'Popover',
    figmaNode: '9125:400576',
    lede: 'A small panel that opens from a trigger and can hold controls: a filter, a few choices, a short form. Use a Tooltip for a hint, and a Modal when the page should stop until the reader answers.',
    description:
      'A small panel that opens from a trigger and can hold interactive content. Anatomy, placements, API, tokens and accessibility, generated from the contract.',
    tocNote: 'The panels on this page are open through defaultOpen, the prop the contract added for documentation. Click away and they close like any other.',
    livePreview: <PopoverPreview />,
    install: "import { Popover } from '@/components/ui/popover'",
    anatomyLede:
      'A trigger you render and a panel the Popover owns. The trigger is a render prop, so it receives aria-expanded, aria-controls and the click handler to spread onto your own Button.',
    anatomy: (
      <div className={styles.anatomy}>
        <span className={`${shared.marker} ${styles.markTrigger}`} aria-hidden="true">1</span>
        <span className={`${shared.marker} ${styles.markContent}`} aria-hidden="true">2</span>
        <PopoverStill />
      </div>
    ),
    variantsLede:
      'Placement chooses the side and align chooses where along the trigger the panel sits; the caret stays on the trigger’s centre either way. The panel does not flip when it runs out of room. Tab tip is the kit’s second set: the open trigger and the panel join into one shape.',
    variants: [
      { label: 'Placement: Top', node: still('top') },
      { label: 'Placement: Bottom', node: still('bottom') },
      { label: 'Placement: Left', node: still('left') },
      { label: 'Placement: Right', node: still('right') },
      { label: 'Align: Start', node: still('bottom', 'start') },
      { label: 'Align: End', node: still('bottom', 'end') },
      { label: 'Tab tip: Start', node: still('bottom', 'start', 'tab-tip') },
      { label: 'Tab tip: End', node: still('bottom', 'end', 'tab-tip') },
    ],
    dos: [
      'Use a Popover when the reader needs to act on what is inside it: toggle a filter, pick an option, fill one field.',
      'Render the trigger as a Button and spread the props the Popover hands you, so aria-expanded and aria-controls land on the real control.',
      'Turn modal on when the content is a small task the reader should finish or dismiss before moving on, and give it a label so the dialog has a name.',
      'Choose the placement with the most room around the trigger. The panel will not move itself back on screen.',
    ],
    donts: [
      'Nest a Popover inside another one. The inner one throws as soon as the outer one opens.',
      'Give one instance its own way of closing. Dismissal comes from the shared Overlay base, and a Popover that needs another pattern is a different component.',
      'Use a Popover for a line of help that appears on hover. That is a Tooltip.',
      'Fit a whole workflow into one. Once it needs a title and a footer of actions, it is a Modal.',
    ],
    a11y: [
      ['Keyboard', 'Enter and Space on the trigger open it. The panel follows the trigger in the document, so Tab moves into it. Escape closes it from anywhere.'],
      ['Roles', <>The trigger gets <code>aria-expanded</code> and <code>aria-controls</code>. With modal on, the panel is <code>role=&quot;dialog&quot;</code> with <code>aria-modal</code>; name it with the <code>label</code> prop. Without modal it has no role, and label is ignored.</>],
      ['Focus', 'A modal Popover takes focus when it opens and keeps Tab inside it. A non-modal one leaves focus where it was. Either way, focus returns to the trigger when it closes. The content can be controlled from outside: a re-render while it is open leaves focus alone.'],
      ['Pointer', 'Pressing the trigger again closes it, and so does a press anywhere outside the panel. There is no close button of its own.'],
      ['Contrast', <>The panel is <code>elevation-01</code> lifted by <code>shadow-overlay</code>, with no edge, as the kit draws every overlay. The shadow is what separates it from the page in Light.</>],
      ['Motion', 'It fades in on the fast motion step and appears at once under prefers-reduced-motion. It does not animate out.'],
    ],
    parityLede:
      'The kit’s Popover page draws three public sets: the popover itself, a Tab tip, and the Popover item its variants are built from. Placement, align and variant cover the drawn axes; modal and label have no kit axis because behaviour and a name are not drawn.',
    parity: [
      ['Position', 'Top · Bottom · Left · Right', 'placement', 'One to one.'],
      ['Alignment', 'Start · Center · End', 'align', 'One to one, Center by default. Start and End put the caret 16 from that edge, so on the kit’s 32px trigger the panel overhangs by 6.'],
      ['Visible', 'True · False', 'defaultOpen', 'Runtime state. The kit draws both because Figma has no other way to show it; defaultOpen only chooses where it starts.'],
      ['Popover item: Caret tip', 'True in every variant', '—', 'Always drawn: 12 by 6 in the panel fill, its base 4 from the trigger.'],
      ['Popover item: Shadow', 'True in every variant', '—', 'Always drawn: shadow-overlay, with no edge. Shadow=False is drawn by no Popover variant.'],
      ['Popover item: Zero radius', 'True in every variant', '—', 'Always square. The 2px corner behind it is drawn by no Popover variant.'],
      ['Set', 'Popover - Tab tip', 'variant="tab-tip"', 'Alignment Start · End and Open. The open trigger takes the panel fill and joins it with no gap and no caret, under one shadow. The kit’s trigger is a 48px ghost icon-only button.'],
    ],
    related: [
      { href: '/docs/components/tooltip', title: 'Tooltip', why: 'for text only, on hover or focus' },
      { href: '/docs/components/menu', title: 'Menu', why: 'when the content is a list of actions' },
      { href: '/docs/components/modal', title: 'Modal', why: 'when the page should stop' },
      { href: '/docs/components/overlay', title: 'Overlay', why: 'where its dismissal comes from' },
    ],
  }
}
