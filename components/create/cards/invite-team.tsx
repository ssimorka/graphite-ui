'use client'

import { useState } from 'react'
import { Add, Copy } from '@carbon/icons-react'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/ui/text-input'
import { Select } from '@/components/ui/select'
import type { SelectOption } from '@/components/ui/select'
import styles from './invite-team.module.scss'

const ROLES: [SelectOption, SelectOption, ...SelectOption[]] = [
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
  { value: 'viewer', label: 'Viewer' },
]

const LINK = 'https://app.co/invite/x8f2k'

/** Graphite UI Site 13561:10248 */
export function InviteTeamCard() {
  const [invitees, setInvitees] = useState([
    { email: 'alex@example.com', role: 'member' },
    { email: 'sam@example.com', role: 'member' },
  ])
  const [copied, setCopied] = useState(false)

  const update = (i: number, patch: Partial<{ email: string; role: string }>) =>
    setInvitees((list) => list.map((row, j) => (j === i ? { ...row, ...patch } : row)))

  const copy = () => {
    try {
      void navigator.clipboard?.writeText(LINK)
    } catch {
      // Clipboard can be unavailable; the visual confirmation still helps.
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <CardShell id="invite-team">
      <CardHeader title="Invite Team" description="Add members to your workspace" />
      {invitees.map((row, i) => (
        <div className={styles.invitee} key={i}>
          <div className={styles.email}>
            <TextInput
              label="Email"
              type="email"
              value={row.email}
              onChange={(e) => update(i, { email: e.target.value })}
            />
          </div>
          <div className={styles.role}>
            <Select
              label="Role"
              options={ROLES}
              value={row.role}
              onChange={(role) => update(i, { role })}
            />
          </div>
        </div>
      ))}
      <Button
        variant="secondary"
        className={styles.full}
        onClick={() => setInvitees((l) => [...l, { email: '', role: 'member' }])}
      >
        Add another
        <Add size={16} aria-hidden="true" />
      </Button>
      <hr className={styles.divider} />
      <div className={styles.link}>
        <TextInput label="Or share invite link" value={LINK} readOnly />
        <button
          type="button"
          className={styles.copy}
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy invite link'}
        >
          <Copy size={16} aria-hidden="true" />
        </button>
      </div>
      <Button variant="primary" className={styles.full}>
        Send Invites
      </Button>
    </CardShell>
  )
}
