'use client'

import { useState } from 'react'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/ui/text-input'
import { TextArea } from '@/components/ui/text-area'
import { Select } from '@/components/ui/select'
import styles from './profile.module.scss'

const EMAILS = [
  { value: 'none', label: 'Select a verified email to display' },
  { value: 'taylor@example.com', label: 'taylor@example.com' },
  { value: 'hello@example.com', label: 'hello@example.com' },
] as [
  { value: string; label: string },
  { value: string; label: string },
  ...{ value: string; label: string }[],
]

export function ProfileCard() {
  const [email, setEmail] = useState('none')

  return (
    <CardShell id="profile">
      <CardHeader title="Profile" description="Manage your profile information." />
      <TextInput
        label="Name"
        size="lg"
        defaultValue="Taylor"
        helpText="Your name may appear around GitHub where you contribute or are mentioned. You can remove it at any time."
      />
      <Select
        label="Public Email"
        size="lg"
        options={EMAILS}
        value={email}
        onChange={setEmail}
        helpText="You can manage verified email addresses in your email settings."
      />
      <TextArea
        label="Bio"
        size="lg"
        rows={5}
        placeholder="Tell us a little bit about yourself"
        helpText="You can @mention other users and organizations to link to them."
      />
      <Button variant="primary" size="lg" className={styles.full}>
        Save Profile
      </Button>
    </CardShell>
  )
}
