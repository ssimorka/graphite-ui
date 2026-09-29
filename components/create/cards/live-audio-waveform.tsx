'use client'

import { useState } from 'react'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import styles from './live-audio-waveform.module.scss'

// Bar heights as a percentage of the 80px plot, taken from the design's frame.
const BARS = [
  8, 42, 64, 66, 50, 25, 13, 24, 21, 10, 14, 12, 17, 38, 56, 59, 43, 12, 38, 65,
  73, 60, 33, 12, 31, 35, 27, 14, 8, 11, 26, 42, 50, 42, 16, 32, 62, 75, 66, 40,
  8, 35, 47, 42, 27, 13, 8, 14, 27, 38, 36, 18,
]

/** Graphite UI Site 13561:11242. */
export function LiveAudioWaveformCard() {
  const [listening, setListening] = useState(true)

  return (
    <CardShell id="live-audio-waveform">
      <CardHeader
        title="Live Audio Waveform"
        description="Real-time microphone input visualization with audio reactivity"
      />
      {/* Decorative: no microphone is read, so it is hidden from assistive tech. */}
      <div className={`${styles.wave} ${listening ? '' : styles.paused}`} aria-hidden="true">
        {BARS.map((h, i) => (
          <span
            key={i}
            className={styles.bar}
            style={{ height: `${h}%`, animationDelay: `${-((i * 137) % 900)}ms` }}
          />
        ))}
      </div>
      <div className={styles.actions}>
        <Button size="sm" disabled={listening} onClick={() => setListening(true)}>
          Start Listening
        </Button>
        <Button
          size="sm"
          variant="primary"
          disabled={!listening}
          onClick={() => setListening(false)}
        >
          Stop Processing
        </Button>
      </div>
    </CardShell>
  )
}
