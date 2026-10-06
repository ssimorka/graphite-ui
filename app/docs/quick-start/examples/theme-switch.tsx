'use client'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button onClick={toggleTheme} aria-pressed={theme === 'dark'}>
      Dark theme
    </Button>
  )
}
