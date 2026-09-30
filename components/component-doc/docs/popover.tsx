import type { ComponentDocConfig } from '../types'
import shared from '../component-doc.module.scss'
import styles from './popover.module.scss'
import { PopoverPreview, PopoverStill } from './popover-preview'

const still = (placement: 'top' | 'bottom' | 'left' | 'right') => (
  <div
    className={`${styles.stage} ${placement === 'left' ? styles.stageLeft : ''} ${placement === 'right' ? styles.stageRight : ''}`}
  >
    <PopoverStill placement={placement} />
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
      'Placement is the one visual prop. The panel opens on that side of the trigger, aligned to its start edge, and does not flip when it runs out of room.',
    variants: [
      { label: 'Placement: Top', node: still('top') },
      { label: 'Placement: Bottom', node: still('bottom') },
      { label: 'Placement: Left', node: still('left') },
      { label: 'Placement: Right', node: still('right') },
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
      ['Contrast', <>The panel is <code>surface-elevated</code> with an <code>outline</code> edge. In Light the elevated surface matches the page, so the edge is what separates them.</>],
      ['Motion', 'It fades in on the fast motion step and appears at once under prefers-reduced-motion. It does not animate out.'],
    ],
    parityLede:
      'The kit’s Popover page draws three public sets: the popover itself, a Tab tip, and the Popover item its variants are built from. The code exposes four props, and label has no kit axis because a name is not drawn. Most of the kit’s axes are placement, and the rest are states or styles the code settles one way.',
    parity: [
      ['Position', 'Top · Bottom · Left · Right', 'placement', 'One to one.'],
      ['Alignment', 'Start · Center · End', '—', 'No counterpart. The code always aligns the panel to the trigger’s start edge (left for Top and Bottom, top for Left and Right).'],
      ['Visible', 'True · False', 'defaultOpen', 'Runtime state. The kit draws both because Figma has no other way to show it; defaultOpen only chooses where it starts.'],
      ['Shadow', 'True · False', '—', 'No counterpart. The code separates the panel with its outline edge and no shadow, which is what the Overlay contract requires in Light.'],
      ['Open (Tab tip)', 'True · False', '—', 'No counterpart. Tab tip is Carbon’s trigger style that joins the panel like a tab; Graphite has no such trigger.'],
      ['Caret', '_Popover caret item (private)', '—', 'No counterpart. The panel sits a small gap from the trigger with no caret.'],
    ],
    related: [
      { href: '/docs/components/tooltip', title: 'Tooltip', why: 'for text only, on hover or focus' },
      { href: '/docs/components/menu', title: 'Menu', why: 'when the content is a list of actions' },
      { href: '/docs/components/modal', title: 'Modal', why: 'when the page should stop' },
      { href: '/docs/components/overlay', title: 'Overlay', why: 'where its dismissal comes from' },
    ],
  }
}
