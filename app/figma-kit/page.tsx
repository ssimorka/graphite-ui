import type { Metadata } from 'next'
import { SiteFooter } from '@/components/sections/site-footer'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Link } from '@/components/ui/link'
import { kitLink } from '@/lib/kit-links'
import { KitCompare } from './compare'
import { PLANS } from './plans'
import styles from './figma-kit.module.scss'

export const metadata: Metadata = {
  title: 'Figma kit · Graphite UI',
  description:
    'The Graphite UI Figma kit, free or Pro. The kit matches the code, token for token, in light and dark.',
}

/**
 * Both editions of the kit on one page, so Pro is visible beyond the footer
 * and every free download passes through Gumroad's $0 checkout first.
 *
 * Left out on purpose until each is confirmed:
 * - "Start free. Your work carries over when you move to Pro." Nothing in the
 *   repo says how a Free file moves to Pro (Swap library or otherwise).
 * - A refund line. It goes in the small print, below, once the policy is set
 *   on Gumroad.
 */
export default function FigmaKitPage() {
  // Below 672px the plan columns are too narrow for buttons, so the same three
  // actions sit under the table instead: ghosts first, the one filled button
  // last, as ButtonGroup requires.
  const [free, solo, team] = PLANS

  return (
    <main id="main-content" className="page-main">
      <div className={styles.page}>
        <header className={styles.head}>
          <h1 className={styles.title}>Figma kit</h1>
          <p className={styles.lede}>The kit matches the code, token for token.</p>
        </header>

        <KitCompare />

        <div className={styles.actions}>
          <ButtonGroup className={styles.mobileActions}>
            <Button asChild variant="ghost" size="lg" className={styles.button}>
              <a {...free.link}>{free.action.label}</a>
            </Button>
            <Button asChild variant="ghost" size="lg" className={styles.button}>
              <a {...team.link}>{team.action.label}</a>
            </Button>
            <Button asChild variant="primary" size="lg" className={styles.button}>
              <a {...solo.link}>{solo.action.label}</a>
            </Button>
          </ButtonGroup>
          <Link size="sm" {...kitLink('free', 'community', 'kit-page')}>
            Also on Figma Community
          </Link>
        </div>

        <div className={styles.smallPrint}>
          <p>Pro arrives through Gumroad as a Figma duplicate link.</p>
          <p>The code is MIT licensed. The Graphite UI name and logo are not.</p>
          {/* Refund policy: add one short line here once it is set on Gumroad. */}
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
