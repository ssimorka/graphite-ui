'use client'

import { useState } from 'react'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import { Notification } from '@/components/ui/notification'
import styles from './book-appointment.module.scss'

const SLOTS = ['9:00 AM', '10:30 AM', '11:00 AM', '1:30 PM']

/** Graphite UI Site 13561:11208. */
export function BookAppointmentCard() {
  const [slot, setSlot] = useState(SLOTS[0])

  return (
    <CardShell id="book-appointment">
      <CardHeader title="Book Appointment" description="Dr. Sarah Chen · Cardiology" />
      <p className={styles.date}>Available on March 18, 2026</p>
      <div className={styles.slots} role="radiogroup" aria-label="Time slot">
        {SLOTS.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={slot === s}
            className={`${styles.chip} ${slot === s ? styles.selected : ''}`}
            onClick={() => setSlot(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <Notification
        variant="info"
        title="New patient?"
        body="Please arrive 15 minutes early."
      />
      <Button variant="primary" className={styles.book}>
        Book Appointment
      </Button>
    </CardShell>
  )
}
