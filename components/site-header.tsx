'use client'

import { useState } from 'react'
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from '@carbon/react'
import { Asleep, Light } from '@carbon/icons-react'
import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { ColorPickerPopover } from '@/components/color-picker'

// Root-relative anchors rather than bare hashes: the header is shared with
// routed pages like /system/color, where `#system` would resolve against the
// current path and scroll nowhere.
const NAV_ITEMS = [
  { href: '/#system', label: 'System' },
  { href: '/system/color', label: 'Color' },
  { href: '/#patterns', label: 'Patterns' },
  { href: '/#faq', label: 'FAQ' },
]

export function SiteHeader() {
  const { theme, toggleTheme, sourceHex, setSourceHex } = useTheme()
  const isDark = theme === 'g100'
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false)

  return (
    <Header aria-label="Graphite UI">
      <SkipToContent />
      {/* Carbon hides HeaderNavigation below the lg breakpoint (1056px) with
          no built-in fallback, so this toggle + SideNav is the only way to
          reach System / Patterns / FAQ on mobile and most tablets. */}
      <HeaderMenuButton
        aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
        onClick={() => setIsSideNavExpanded((v) => !v)}
        isActive={isSideNavExpanded}
      />
      <HeaderName href="/" prefix="">
        Graphite UI
      </HeaderName>
      <HeaderNavigation aria-label="Graphite UI">
        {NAV_ITEMS.map((item) => (
          <HeaderMenuItem key={item.href} href={item.href}>
            {item.label}
          </HeaderMenuItem>
        ))}
      </HeaderNavigation>
      <SideNav
        aria-label="Graphite UI"
        expanded={isSideNavExpanded}
        isPersistent={false}
        onSideNavBlur={() => setIsSideNavExpanded(false)}
        onOverlayClick={() => setIsSideNavExpanded(false)}
        href="#main-content"
      >
        <SideNavItems>
          <HeaderSideNavItems>
            {NAV_ITEMS.map((item) => (
              <HeaderMenuItem
                key={item.href}
                href={item.href}
                onClick={() => setIsSideNavExpanded(false)}
              >
                {item.label}
              </HeaderMenuItem>
            ))}
          </HeaderSideNavItems>
        </SideNavItems>
      </SideNav>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          tooltipAlignment="center"
          onClick={toggleTheme}
        >
          {isDark ? <Light size={20} /> : <Asleep size={20} />}
        </HeaderGlobalAction>
        {/* The source color is the product's single input, so it lives in the
            global bar as a persistent control rather than inside one section. */}
        <div className="site-header__source">
          <ColorPickerPopover
            value={sourceHex || COVER_SOURCE_HEX}
            onChange={setSourceHex}
          />
        </div>
      </HeaderGlobalBar>
    </Header>
  )
}
