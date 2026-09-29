'use client'

import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import styles from './source-picker.module.scss'

const SOURCES = [COVER_SOURCE_HEX, '#0f62fe', '#007d79']

export function SourcePicker() {
  const { sourceHex, setSourceHex } = useTheme()

  return (
    <div className={styles.sources} role="group" aria-label="Source color">
      {SOURCES.map((hex) => (
        <Button
          key={hex}
          variant={hex === sourceHex ? 'primary' : 'secondary'}
          aria-pressed={hex === sourceHex}
          onClick={() => setSourceHex(hex)}
        >
          {hex.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}
