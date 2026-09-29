import { RefTable } from '@/components/component-page'
import type { ComponentDocConfig } from '../types'
import styles from './overlay.module.scss'
import { OverlayPreview } from './overlay-preview'

export function overlayDoc(): ComponentDocConfig {
  return {
    slug: 'overlay',
    name: 'Overlay',
    kitTitle: null,
    lede: 'The behaviour Modal, Popover, Menu and Tooltip share: how they close, where focus goes, and when it is trapped. It is a hook with no markup, so you only reach for it when building a new overlay, never to style one.',
    description:
      'The shared dismissal and focus behaviour behind Modal, Popover, Menu and Tooltip, and which parts each one switches on.',
    tocNote: 'Behaviour only. The contract’s dismissOn is the hook’s escape and outside switches; a close control is the overlay’s own button.',
    livePreview: <OverlayPreview />,
    install:
      "import { useOverlay } from '@/components/ui/overlay'\nimport type { DismissOptions } from '@/components/ui/overlay'",
    anatomyLede:
      'Overlay has no slots because it draws nothing. It is one hook, useOverlay, that each overlay calls with its own switches instead of wiring its own listeners, and this is what each one turns on. Notification’s contract cites the same base, but it sits inline with nothing to dismiss, so it does not call the hook.',
    anatomy: (
      <div className={styles.matrix}>
        <RefTable
          caption="Which dismissals each overlay honours"
          columns={[
            { label: 'Overlay', tone: 'name' },
            { label: 'Escape', tone: 'text' },
            { label: 'Outside press', tone: 'text' },
            { label: 'Focus trap', tone: 'text' },
          ]}
          rows={[
            ['Modal', 'When dismissible', 'The scrim, when dismissible', 'Always'],
            ['Popover', 'Yes', 'Yes, the trigger included', 'When modal'],
            ['Menu', 'Yes', 'Yes. Choosing an item closes it too', 'No'],
            ['Tooltip', 'Yes', 'No. It closes on pointer leave and blur', 'No'],
          ]}
        />
      </div>
    ),
    dos: [
      'Call useOverlay from any new floating surface, and pass it switches rather than adding listeners of your own.',
      'Turn trapFocus on for anything that blocks the page, and leave it off for anything the reader can ignore.',
      'Declare surface-elevated and outline in the new overlay’s own contract. In Light the elevated surface matches the page, so the edge is what makes it visible.',
      'Unmount the content on close, as the four existing overlays do. Their no-nesting checks depend on it.',
    ],
    donts: [
      'Give one instance its own way of closing. An overlay that needs a different pattern is a different component, not a variant.',
      'Keep closed content mounted to animate it out. That would move the nesting checks onto the prerender path.',
      'Animate transform on the way in. Tooltip carries its placement in transform, so the shared entrance is opacity only.',
      'Send focus somewhere new on close. It goes back to whatever held it when the overlay opened, every time.',
    ],
    a11y: [
      ['Escape', 'Every open overlay that honours Escape listens for it on the document, and they all close together. The contract asks for the outermost to close first; the hook does not order them yet.'],
      ['Focus return', 'When an overlay closes, focus goes back to whatever held it when the overlay opened, whether it was trapped or not.'],
      ['Trapping', 'With trapFocus on, the overlay takes focus as it opens, and Tab and Shift+Tab wrap between its first and last focusable elements.'],
      ['Outside press', 'With outside on, a pointer press anywhere outside the overlay’s element closes it. The trigger counts as outside.'],
      ['Roles', 'The hook sets no roles and no labels. Each overlay adds its own: dialog, menu or tooltip.'],
      ['Re-renders', 'The hook re-runs whenever the onDismiss it is given changes, and every overlay passes an inline one. So if an open overlay re-renders, focus goes back to where it was when the overlay opened, and a trapped one takes focus again. Keep state that changes while it is open inside its content.'],
    ],
    related: [
      { href: '/docs/components/modal', title: 'Modal', why: 'always traps focus' },
      { href: '/docs/components/popover', title: 'Popover', why: 'traps focus when modal' },
      { href: '/docs/components/menu', title: 'Menu', why: 'closes when an item is chosen' },
      { href: '/docs/components/tooltip', title: 'Tooltip', why: 'ignores outside presses' },
    ],
  }
}
