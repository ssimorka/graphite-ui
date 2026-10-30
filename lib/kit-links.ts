// Where people get the Figma kit. The kit has two public editions, both built
// from the maintainer's working file, which stays private:
//
// - Free: foundations, the Regular icons and 18 core components, published on
//   Figma Community. Its file link stays for deep links into a component's
//   page, which a Community listing cannot open.
// - Pro: every component and all three icon weights, sold on Gumroad.
//
// Link to these, never to the working file's key in docs/tokens snapshots.
export const KIT_FREE_URL =
  'https://www.figma.com/community/file/1698022054856156661/graphite-ui-kit-free'

export const KIT_FREE_FILE_URL =
  'https://www.figma.com/design/W5tVb5bw9KibiZPi9rLapV/Graphite-UI-Kit-Free'

export const KIT_PRO_URL = 'https://simorka.gumroad.com/l/graphite-ui-kit-pro'

// Kit component pages included in the free edition, by page title (the part
// after "02 Components – "). Every other component page is Pro only. Node ids
// survive a file duplicate, so a page in the free kit keeps the working
// file's node id.
export const FREE_KIT_PAGES = new Set([
  'Button',
  'Link',
  'Checkbox',
  'Radio button',
  'Toggle',
  'Text input',
  'Text area',
  'Search',
  'Select',
  'Notification',
  'Loading',
  'Progress bar',
  'Tooltip',
  'List',
  'Tag',
  'Accordion',
  'AI label',
  'AI layer',
])
