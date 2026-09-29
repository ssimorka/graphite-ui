import { CardShell, CardHeader } from '../card-shell'
import styles from './palette.module.scss'

const SWATCHES: [string, string][] = [
  ['background', 'background'],
  ['surface', 'surface'],
  ['surfaceVariant', 'surface-variant'],
  ['outline', 'outline'],
  ['onSurface', 'on-surface'],
  ['onSurfaceVariant', 'on-surface-variant'],
  ['primary', 'primary'],
  ['onPrimary', 'on-primary'],
  ['primaryContainer', 'primary-container'],
  ['onPrimaryContainer', 'on-primary-container'],
  ['secondary', 'secondary'],
  ['onSecondary', 'on-secondary'],
]

export function PaletteCard() {
  return (
    <CardShell id="palette">
      <CardHeader
        title="Graphite - IBM Plex Sans"
        description="Designers love packing quirky glyphs into test phrases. This is a preview of the typography styles."
      />
      <div className={styles.swatches}>
        {SWATCHES.map(([label, token]) => (
          <div key={token} className={styles.item}>
            <span
              className={styles.swatch}
              style={{ background: `var(--graphite-${token})` }}
            />
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
