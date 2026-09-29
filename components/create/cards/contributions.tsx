'use client'

import { useState } from 'react'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import styles from './contributions.module.scss'

export function ContributionsCard() {
  const [hidden, setHidden] = useState(true)

  return (
    <CardShell id="contributions">
      <CardHeader
        title="Contributions & Activity"
        description="Manage your contributions and activity visibility."
      />
      <div className={styles.field}>
        <Checkbox
          label="Make profile private and hide activity"
          checked={hidden}
          onChange={setHidden}
        />
        <p className={styles.help}>
          Enabling this will hide your contributions and activity from your
          GitHub profile and from social features like followers, stars, feeds,
          leaderboards and releases.
        </p>
      </div>
      <Button variant="primary" className={styles.full}>
        Save Changes
      </Button>
    </CardShell>
  )
}
