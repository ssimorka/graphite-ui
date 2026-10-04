import type { ComponentDocConfig } from '../types'
import { ToastPreview, ToastStill } from './toast-preview'

export function toastDoc(): ComponentDocConfig {
  return {
    slug: 'toast',
    name: 'Toast',
    kitTitle: 'Notification',
    figmaNode: '84336:35011',
    lede: 'Says, briefly, what just happened (“Changes saved”), then leaves on its own. For anything the reader must act on or must not miss, use a Notification, which stays.',
    description:
      'A timed notification at the top right, in four statuses, standard or high contrast, with an optional action and time stamp. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Carried into #240 from #219. Notification’s colours and icons, with timing added.',
    livePreview: <ToastPreview />,
    install:
      "import { ToastProvider, useToast } from '@/components/ui/toast'",
    anatomy: <ToastStill variant="success" />,
    anatomyLede:
      'The status icon and the stripe in the status colour; the title over the message; a time stamp, or an action, under them; and the close at the top right. It arrives at the top right of the window over everything else, with the overlay shadow.',
    variantsLede:
      'Status sets the colours and the icon, as Notification’s does. High contrast inverts the fill. Actionable puts a small button where the time stamp would be.',
    variants: [
      { label: 'Info', node: <ToastStill variant="info" /> },
      { label: 'Success', node: <ToastStill variant="success" /> },
      { label: 'Warning', node: <ToastStill variant="warning" /> },
      { label: 'Error', node: <ToastStill variant="danger" /> },
      { label: 'High contrast', node: <ToastStill variant="info" highContrast /> },
      { label: 'High contrast: Error', node: <ToastStill variant="danger" highContrast /> },
      { label: 'Actionable', node: <ToastStill variant="success" actionable /> },
      { label: 'Actionable, high contrast', node: <ToastStill variant="success" highContrast actionable /> },
    ],
    dos: [
      'Confirm something the reader just did, in a few words.',
      'Offer Undo as the action where an action can be undone.',
      'Let errors stay until they are closed; they do by default.',
      'Show one at a time where you can. They stack, but a pile is noise.',
    ],
    donts: [
      'Put the only route to something in a toast. It leaves.',
      'Use a toast for a problem on the page. Put a Notification next to it.',
      'Shorten the duration below what it takes to read.',
      'Show a toast for something the reader can already see happen.',
    ],
    a11y: [
      ['Live region', <>The host is a polite live region named “Notifications”, so each toast is announced as it arrives. An error is an <code>alert</code> and interrupts.</>],
      ['Timing', 'Six seconds by default. The countdown holds while the pointer or keyboard focus is on the toast, and resumes where it stopped. Errors stay until closed.'],
      ['Close', <>A button named “Dismiss notification”. The action and close are reachable with Tab, as anything else on the page.</>],
      ['Contrast', 'Text is on-surface on every status container, Notification’s swept pairs; high contrast is background on on-background.'],
    ],
    parityLede:
      'The kit’s Toast is one set on the Notification page, Notification - Toast. The code is Toast, drawn, and a host that times and stacks it.',
    parity: [
      ['Status', 'Info · Success · Warning · Error', 'variant', 'info, success, warning and danger, as Notification.'],
      ['High contrast', 'False · True', 'highContrast', 'The kit’s set defaults it on; the code keeps Notification’s default, off.'],
      ['Actionable', 'False · True', 'action', 'The action takes the time stamp’s place, as the kit draws it.'],
      ['Time text', 'Text', 'timestamp', 'Body/3, 24 under the message.'],
      ['Close', 'Boolean', 'onClose', 'The host always passes it, so every shown toast can be closed.'],
      ['Timing', '—', 'duration', 'The kit has none; this is the code’s, and the contract’s.'],
    ],
    related: [
      { href: '/docs/components/notification', title: 'Notification', why: 'for a message that stays' },
      { href: '/docs/components/modal', title: 'Modal', why: 'for something that needs a response' },
      { href: '/docs/components/button', title: 'Button', why: 'the action and the close' },
    ],
  }
}
