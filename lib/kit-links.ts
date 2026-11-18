// Where people get the Figma kit. The kit has two public editions, both built
// from the maintainer's working file, which stays private:
//
// - Free: foundations, the Regular icons and 18 core components. The primary
//   way in is Gumroad's $0 checkout, which collects an email; the same file
//   stays on Figma Community as a quiet alternative. Its file link stays for
//   deep links into a component's page, which a Community listing cannot open.
// - Pro: every component and all three icon weights, sold on Gumroad.
//
// Link to these, never to the working file's key in docs/tokens snapshots, and
// never write a kit URL anywhere else: build outbound links with `kitLink`, so
// each one carries its UTM tags and the analytics attributes.
export const FREE_KIT_GUMROAD = 'https://simorka.gumroad.com/l/graphite-ui-kit-free'

export const FREE_KIT_COMMUNITY =
  'https://www.figma.com/community/file/1698022054856156661/graphite-ui-kit-free'

export const KIT_FREE_FILE_URL =
  'https://www.figma.com/design/W5tVb5bw9KibiZPi9rLapV/Graphite-UI-Kit-Free'

export const PRO_KIT = 'https://simorka.gumroad.com/l/graphite-ui-kit-pro'

/** Where on the site a kit link sits. It becomes `utm_campaign`. */
export type KitPlacement = 'home' | 'kit-page' | 'create' | 'footer' | 'docs'
export type KitEdition = 'free' | 'pro'
/** Gumroad, or a Figma-hosted copy of the free file (Community or its pages). */
export type KitDestination = 'gumroad' | 'community'

/** `url` with the site's UTM tags for `placement`. Keeps any existing query. */
export function withUtm(url: string, placement: KitPlacement): string {
  const u = new URL(url)
  u.searchParams.set('utm_source', 'graphite-ui')
  u.searchParams.set('utm_medium', 'site')
  u.searchParams.set('utm_campaign', placement)
  return u.toString()
}

const BASE: Record<`${KitEdition}-${KitDestination}`, string> = {
  'free-gumroad': FREE_KIT_GUMROAD,
  'free-community': FREE_KIT_COMMUNITY,
  'pro-gumroad': PRO_KIT,
  'pro-community': PRO_KIT, // Pro is only sold on Gumroad.
}

/**
 * Props for an outbound kit anchor: the tagged href, a new tab, and the data
 * attributes `components/analytics.tsx` reads to send `kit_link_clicked`.
 * Plain attributes rather than an onClick, so a server component can spread
 * them too. Pass `url` for a deep link (a page in the free file).
 */
export function kitLink(
  edition: KitEdition,
  destination: KitDestination,
  placement: KitPlacement,
  url: string = BASE[`${edition}-${destination}`],
) {
  return {
    href: withUtm(url, placement),
    target: '_blank',
    rel: 'noopener noreferrer',
    'data-kit-edition': edition,
    'data-kit-destination': destination,
    'data-kit-placement': placement,
  } as const
}

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
