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
      'An optional label, the title and the close in a 16px header; the body inset 16; and the kit’s footer, a full-bleed row of 64px buttons. The panel is background over the scrim. The title is also the dialog’s accessible name, so it is required.',
    anatomy: <ModalStill size="lg" label />,
    variantsLede:
      'Size caps the width at 320, 384, 512 or 672 pixels; under 672px of viewport the dialog is full bleed, the kit’s Mobile. The footer fills two columns from the right for one or two actions and four for three, with a ghost Cancel pinned to the left. Progress sits between the header and the body, and Inline loading takes the primary column while the action runs.',
    variants: [
      { label: 'Size: Extra small', node: <ModalStill size="xs" actions={1} /> },
      { label: 'Size: Small', node: <ModalStill size="sm" /> },
      { label: 'Size: Medium', node: <ModalStill size="md" label /> },
      { label: 'Size: Large', node: <ModalStill size="lg" label /> },
      { label: 'Actions: 3', node: <ModalStill size="lg" actions={3} /> },
      { label: 'Actions: 2 and Cancel', node: <ModalStill size="lg" actions="cancel" /> },
      { label: 'Progress', node: <ModalStill size="md" progress /> },
      { label: 'Inline loading', node: <ModalStill size="md" loading /> },
    ],
    dos: [
      'Write the title as the question the reader is answering. It is also what a screen reader announces when the dialog opens.',
      'Put one primary action last in the footer. Pass a ghost Cancel first when there is one, and the footer pins it to the left as the kit does.',
      'Set dismissible to false only when an accidental close would lose work, and then make sure the footer offers a way out.',
      'Pick the smallest size that holds the body without scrolling.',
    ],
    donts: [
      'Open a Modal from inside another Modal. Stack depth is one, and the inner one throws when it opens.',
      'Use a Modal for a message the reader can act on later. A Notification on the page does that without stopping them.',
      'Leave out the footer on a Modal that is not dismissible. Escape, the scrim and the close button are all off, so the reader would be stuck.',
      'Put a second primary action in the footer. The ButtonGroup around it throws rather than let the decision go unmade.',
    ],
    a11y: [
      ['Keyboard', 'Tab and Shift+Tab cycle through the dialog’s controls and wrap at either end. Escape closes it unless dismissible is false, and so does the close button, named “Close”.'],
      ['Roles', <>The panel is <code>role=&quot;dialog&quot;</code> with <code>aria-modal=&quot;true&quot;</code>, labelled by its title. The page behind is not made inert, so the focus trap is what keeps keyboard users inside.</>],
      ['Focus', 'On open, focus moves to the dialog itself, which takes it without a ring because it is a container, not a control. On close, focus returns to the element that opened it, every time.'],
      ['Pointer', 'A press on the scrim closes a dismissible Modal, and focus goes back to the trigger. A press inside the panel never does. The scrim press is the Overlay base’s outside press, so dismissible turns it off together with Escape.'],
      ['Contrast', <>Title and body are <code>on-surface</code> on <code>background</code>, as the kit binds them, a pairing the engine checks at the theme’s target, AA or AAA. The label is <code>on-surface-variant</code>.</>],
      ['Loading', 'Inline loading replaces the primary button with its text and a spinner, announced as a status, so the action cannot be pressed twice while it runs.'],
      ['Motion', 'The scrim and panel fade in together on the fast motion step, opacity only. Under prefers-reduced-motion it appears at once. It does not animate out.'],
    ],
    parityLede:
      'The kit’s Modal set has one axis, Size, and six booleans; its footer is a private set with three more axes. dismissible has no kit counterpart: whether Escape and the scrim close the dialog is behaviour, which a frame cannot show.',
    parity: [
      ['Size', 'Large · Medium · Small · Extra small · Mobile', 'size', 'lg, md, sm and xs at 672, 512, 384 and 320. The kit draws every size 671 wide; the code steps the caps. Mobile is the dialog full bleed under 672px of viewport, with the scrim’s inset dropped.'],
      ['Label · Close icon · Progress · Description · Slot', 'Booleans', 'label · dismissible · progress · body', 'The label 4 above the Body/1 title; the 20px close 16 from the corner while the Modal is dismissible; a progress block before the body; the body at Body/3, as the description and slot both are.'],
      ['Footer: Actions', '1 · 2 · 3', 'footer', 'Full-bleed 64px columns, 1px apart, from the right: two columns for one or two actions, four for three. No divider.'],
      ['Footer: Cancel', 'True · False', 'a ghost button first', 'Pinned to the leftmost column, as the kit draws it.'],
      ['Footer: Inline loading', 'True · False', 'loading', 'The primary column shows the text with a spinner.'],
      ['Fill', 'Background/background', '—', 'background, as the set binds it. The scrim does the separating, so no shadow.'],
    ],
    related: [
      { href: '/docs/components/overlay', title: 'Overlay', why: 'where its focus trap comes from' },
      { href: '/docs/components/popover', title: 'Popover', why: 'when the page can carry on' },
      { href: '/docs/components/button-group', title: 'Button group', why: 'the footer’s one-primary rule' },
      { href: '/docs/components/notification', title: 'Notification', why: 'when it should not interrupt' },
    ],
  }
}
