'use client'

import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { KitIcon } from '@/components/kit-icon'
import { PLANS } from './plans'
import styles from './compare.module.scss'

// Plain data, in ./plans: the server page reads it too, which it could not
// from this client module.

/** A cell: true is a check, false is empty, a string is shown as is. */
type Value = boolean | string
type Row = { label: string; values: [Value, Value, Value] }
type Group = { key: string; title: string; rows: Row[] }

const ALL: [Value, Value, Value] = [true, true, true]
const PRO: [Value, Value, Value] = [false, true, true]

const GROUPS: Group[] = [
  {
    key: 'components',
    title: 'Components',
    rows: [
      { label: 'Component pages', values: ['18', '45', '45'] },
      { label: 'Variants', values: ['Core set', '2,630', '2,630'] },
    ],
  },
  {
    key: 'foundations',
    title: 'Foundations',
    rows: ['Color', 'Typography', 'Spacing', 'Radius', 'Layout', 'Motion'].map((label) => ({
      label,
      values: ALL,
    })),
  },
  {
    key: 'icons',
    title: 'Icons',
    rows: [
      { label: 'Regular weight, 996 icons', values: ALL },
      { label: 'Bold weight', values: PRO },
      { label: 'Solid weight', values: PRO },
    ],
  },
  {
    key: 'themes-updates',
    title: 'Themes and updates',
    rows: [
      { label: 'Light and dark themes', values: ALL },
      { label: 'A year of updates', values: PRO },
    ],
  },
]

function Cell({ value }: { value: Value }) {
  if (value === true) {
    return (
      <>
        <KitIcon name="check" size={16} className={styles.check} aria-hidden="true" />
        <span className={styles.srOnly}>Included</span>
      </>
    )
  }
  if (value === false) return <span className={styles.srOnly}>Not included</span>
  return <>{value}</>
}

/**
 * Free, Pro Solo and Pro Team, side by side: plan headers on top, then the
 * features in groups that open and close. Each group is an item of the
 * governed Accordion (left-aligned, so its glyph leads), and each panel holds
 * a real table with the plans as column headers, so the cells read as a table
 * to a screen reader. The header's insets match the panel's, which is what
 * lines the plan columns up with the values under them.
 */
export function KitCompare() {
  return (
    <section className={styles.card} aria-labelledby="compare-title">
      <div className={styles.plans}>
        <div className={styles.intro}>
          <h2 id="compare-title" className={styles.introTitle}>
            Compare editions
          </h2>
          <p className={styles.introBody}>Same tokens, same components. Pro has all of them.</p>
        </div>
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`${styles.plan} ${plan.tag ? styles.featured : ''}`}
          >
            <span className={styles.tagSlot}>
              {plan.tag ? (
                <Tag variant="primary" size="sm">
                  {plan.tag}
                </Tag>
              ) : null}
            </span>
            <span className={styles.planName}>{plan.name}</span>
            <span className={styles.price}>{plan.price}</span>
            <span className={styles.note}>{plan.note}</span>
            {/* Only the featured plan's button is filled, and the plans'
                buttons never sit beside another filled one. Below 672px the
                buttons move under the table (see the page). */}
            <Button
              asChild
              variant={plan.action.variant}
              size="md"
              className={styles.planAction}
            >
              <a {...plan.link}>{plan.action.label}</a>
            </Button>
          </div>
        ))}
      </div>

      <Accordion
        type="multiple"
        align="left"
        size="lg"
        defaultValue={GROUPS.map((g) => g.key)}
        className={styles.groups}
      >
        {GROUPS.map((group) => (
          <AccordionItem key={group.key} value={group.key} title={group.title}>
            <table className={styles.table}>
              <caption className={styles.srOnly}>{group.title}</caption>
              <colgroup>
                <col />
                <col className={styles.valueCol} />
                <col className={styles.valueCol} />
                <col className={styles.valueCol} />
              </colgroup>
              <thead className={styles.srOnly}>
                <tr>
                  <th scope="col">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.key} scope="col">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) => (
                  <tr key={row.label} className={styles.row}>
                    <th scope="row" className={styles.rowLabel}>
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={PLANS[i].key} className={styles.value}>
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
