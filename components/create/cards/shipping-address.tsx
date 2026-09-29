'use client'

import { useState } from 'react'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/ui/text-input'
import { Select } from '@/components/ui/select'
import type { SelectOption } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import styles from './shipping-address.module.scss'

const STATES: [SelectOption, SelectOption, ...SelectOption[]] = [
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'WA', label: 'Washington' },
]
const COUNTRIES: [SelectOption, SelectOption, ...SelectOption[]] = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
]

/** Graphite UI Site 13561:10418 */
export function ShippingAddressCard() {
  const [street, setStreet] = useState('123 Main Street')
  const [apt, setApt] = useState('Apt 4B')
  const [city, setCity] = useState('San Francisco')
  const [state, setState] = useState('CA')
  const [zip, setZip] = useState('94102')
  const [country, setCountry] = useState('US')
  const [isDefault, setIsDefault] = useState(true)

  return (
    <CardShell id="shipping-address">
      <CardHeader title="Shipping Address" description="Where should we deliver?" />
      <TextInput label="Street address" value={street} onChange={(e) => setStreet(e.target.value)} />
      <TextInput label="Apt / Suite" value={apt} onChange={(e) => setApt(e.target.value)} />
      <div className={styles.row}>
        <TextInput label="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <Select label="State" options={STATES} value={state} onChange={setState} />
      </div>
      <div className={styles.row}>
        <TextInput label="ZIP Code" value={zip} onChange={(e) => setZip(e.target.value)} />
        <Select label="Country" options={COUNTRIES} value={country} onChange={setCountry} />
      </div>
      <Checkbox label="Save as default address" checked={isDefault} onChange={setIsDefault} />
      <div className={styles.footer}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save Address</Button>
      </div>
    </CardShell>
  )
}
