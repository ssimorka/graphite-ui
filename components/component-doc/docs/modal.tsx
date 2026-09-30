import type { ComponentDocConfig } from '../types'
import { ModalPreview, ModalStill } from './modal-preview'

export function modalDoc(): ComponentDocConfig {
  return {
    slug: 'modal',
    name: 'Modal',
    kitTitle: 'Modal',
    figmaNode: '4080:55366',
    lede: 'A dialog that stops the page until the reader answers it. Use it for a decision that has to be made before anything else can happen, not for news the reader could take in without stopping.',
    description:
      'A dialog that stops the page until the reader answers it. Anatomy, sizes, API, tokens and accessibility, generated from the contract.',
    tocNote: 'The site’s mobile navigation and the Create page’s Get the code dialog are both this Modal.',
    livePreview: <ModalPreview />,
    install: "import { Modal } from '@/components/ui/modal'",
    anatomyLede:
      'A title, a body and an optional footer of actions, on the elevated surface over a scrim. The title is also the dialog’s accessible name, so it is required.',
    anatomy: <ModalStill size="lg" />,
    variantsLede:
      'Size is the one visual prop. It caps the width at 384, 512 or 672 pixels; below the cap the dialog fills the space the scrim leaves it, so a narrow screen gets a full-width dialog without a size of its own. Every size holds a Cancel and a primary action side by side.',
    variants: [
      { label: 'Size: Small', node: <ModalStill size="sm" /> },
      { label: 'Size: Medium', node: <ModalStill size="md" /> },
      { label: 'Size: Large', node: <ModalStill size="lg" /> },
    ],
    dos: [
      'Write the title as the question the reader is answering. It is also what a screen reader announces when the dialog opens.',
      'Put one primary action in the footer with a secondary Cancel beside it, and pass them as an array so ButtonGroup can count them.',
      'Set dismissible to false only when an accidental close would lose work, and then make sure the footer offers a way out.',
      'Pick the smallest size that holds the body without scrolling.',
    ],
    donts: [
      'Open a Modal from inside another Modal. Stack depth is one, and the inner one throws when it opens.',
      'Use a Modal for a message the reader can act on later. A Notification on the page does that without stopping them.',
      'Leave out the footer on a Modal that is not dismissible. Escape and the scrim are both off, so the reader would be stuck.',
      'Put a second primary action in the footer. The ButtonGroup around it throws rather than let the decision go unmade.',
    ],
    a11y: [
      ['Keyboard', 'Tab and Shift+Tab cycle through the dialog’s controls and wrap at either end. Escape closes it unless dismissible is false.'],
      ['Roles', <>The panel is <code>role=&quot;dialog&quot;</code> with <code>aria-modal=&quot;true&quot;</code>, labelled by its title. The page behind is not made inert, so the focus trap is what keeps keyboard users inside.</>],
      ['Focus', 'On open, focus moves to the dialog itself, which takes it without a ring because it is a container, not a control. On close, focus returns to the element that opened it, every time.'],
      ['Pointer', 'A press on the scrim closes a dismissible Modal, and focus goes back to the trigger. A press inside the panel never does. The scrim press is the Overlay base’s outside press, so dismissible turns it off together with Escape.'],
      ['Contrast', <>Title and body are <code>on-surface</code> on <code>surface-elevated</code>, a pairing the engine checks at the theme’s target, AA or AAA.</>],
      ['Motion', 'The scrim and panel fade in together on the fast motion step, opacity only. Under prefers-reduced-motion it appears at once. It does not animate out.'],
    ],
    parityLede:
      'The kit’s Modal set has one axis, Size, and the code has one visual prop to match it. dismissible has no kit counterpart: whether Escape and the scrim close the dialog is behaviour, which a frame cannot show.',
    parity: [
      ['Size', 'Large · Medium · Small · Extra small · Mobile', 'size', 'Large, Medium and Small map to lg, md and sm by name. The kit draws every size 671 wide; lg is 672 to sit on the grid, and md and sm step down to 512 and 384. Extra small has no counterpart. Mobile is not a size in code: under its cap the dialog is full width, so a narrow screen gets it for free.'],
      ['Footer', '_Modal footer item (private)', 'footer', 'Composition. The kit builds its footer from a private set; the code takes Buttons and wraps them in ButtonGroup.'],
    ],
    related: [
      { href: '/docs/components/overlay', title: 'Overlay', why: 'where its focus trap comes from' },
      { href: '/docs/components/popover', title: 'Popover', why: 'when the page can carry on' },
      { href: '/docs/components/button-group', title: 'Button group', why: 'the footer’s one-primary rule' },
      { href: '/docs/components/notification', title: 'Notification', why: 'when it should not interrupt' },
    ],
  }
}
