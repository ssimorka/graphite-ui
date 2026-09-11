'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Grid, Column } from '@carbon/react'
import { Add } from '@carbon/icons-react'
import type { ContractMeta } from '@/lib/contracts'
import { Reveal } from '@/components/reveal'
import { MeshGradient } from '@/components/mesh-gradient'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Notification } from '@/components/ui/notification'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Select } from '@/components/ui/select'
import { Tag } from '@/components/ui/tag'
import { TextInput } from '@/components/ui/text-input'
import { Toggle } from '@/components/ui/toggle'
import { Typography } from '@/components/ui/typography'
import styles from './component-wall.module.scss'

/**
 * The kit's "02 Component wall": eight governed components rendering live from
 * the same tokens the rest of the page uses, each labelled with the version of
 * the contract it implements.
 *
 * The previews are the real components, not pictures of them — that is the
 * whole claim the section makes, so a screenshot here would be a lie.
 */
export function ComponentWall({
  contracts,
}: {
  contracts: Record<string, ContractMeta>
}) {
  // Local state so the interactive specimens actually respond. They are
  // demonstrations, not a form, so nothing is submitted anywhere.
  const [toggled, setToggled] = useState(true)
  const [checked, setChecked] = useState(true)

  const Card = ({ name, children }: { name: string; children: ReactNode }) => {
    const meta = contracts[name]
    return (
      <li className={styles.card}>
        <div className={styles.preview}>{children}</div>
        <div className={styles.meta}>
          <p className={styles.name}>{name}</p>
          <div className={styles.badges}>
            {/* The kit bakes each version into the design. Reading the
                contract instead means the badge cannot go stale: the kit
                already says Toggle is 2.0.0 where the contract is 2.1.0. */}
            <span className={styles.badge}>
              {meta ? `Contract ${meta.version}` : 'Ungoverned'}
            </span>
          </div>
        </div>
      </li>
    )
  }

  return (
    <section className={styles.section} aria-labelledby="wall-title">
      {/* Kit 13535:15189, the neutralVariant variant. */}
      <MeshGradient family="neutralVariant" />
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <div className={styles.heading}>
              <h2 className={styles.title} id="wall-title">
                The components, live
              </h2>
              <p className={styles.body}>
                Not a screenshot of a dashboard. These are the real component
                sets from the kit, rendering from the same tokens the rest of
                the page uses, so they repaint when the color above changes.
              </p>
            </div>

            <ul className={styles.wall}>
              <Card name="Button">
                <Button variant="primary">
                  Button
                  <Add />
                </Button>
              </Card>

              <Card name="Tag">
                <Tag variant="primary">Tag</Tag>
              </Card>

              <Card name="Toggle">
                <Toggle
                  id="wall-toggle"
                  label="Label"
                  checked={toggled}
                  onChange={setToggled}
                />
              </Card>

              <Card name="Text input">
                <TextInput
                  id="wall-input"
                  label="Label"
                  placeholder="Placeholder text"
                  helpText="Optional helper text"
                />
              </Card>

              <Card name="Notification">
                <Notification variant="info" title="Title" body="Message" />
              </Card>

              {/* ProgressBar paints no text inside the bar: its contract
                  prohibits it and names Typography as the remedy, so the
                  kit's label and helper line are composed around it. */}
              <Card name="Progress bar">
                <div className={styles.stack}>
                  <Typography>Progress bar label</Typography>
                  <ProgressBar value={50} label="Progress bar label" />
                  <Typography variant="caption">Optional helper text</Typography>
                </div>
              </Card>

              <Card name="Select">
                <Select
                  id="wall-select"
                  label="Select label"
                  options={[
                    { value: '1', label: 'First' },
                    { value: '2', label: 'Second' },
                  ]}
                />
              </Card>

              <Card name="Checkbox">
                <Checkbox
                  id="wall-checkbox"
                  label="Checkbox label"
                  checked={checked}
                  onChange={setChecked}
                />
              </Card>
            </ul>
          </Reveal>
        </Column>
      </Grid>
    </section>
  )
}
