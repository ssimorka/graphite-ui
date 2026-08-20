'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { ContractMeta } from '@/app/gallery/page'
import { Alert } from '@/components/ui/alert'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog } from '@/components/ui/dialog'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Item } from '@/components/ui/item'
import { Label } from '@/components/ui/label'
import { NavigationMenu } from '@/components/ui/navigation-menu'
import { Popover } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup } from '@/components/ui/radio-group'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table } from '@/components/ui/table'
import type { Sort } from '@/components/ui/table'
import { Tabs } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip } from '@/components/ui/tooltip'
import { Typography } from '@/components/ui/typography'
import styles from './gallery.module.scss'

const WAVES: Record<string, string> = {
  '0': 'Foundation — the dependency the waves build on',
  '1': 'Wave 1 — Zero-dependency primitives',
  '2': 'Wave 2 — Form atoms',
  '3': 'Wave 3 — Form composition',
  '4': 'Wave 4 — Layout & navigation',
  '5': 'Wave 5 — Overlays',
  '6': 'Wave 6 — Data display',
}

type Row = { id: string; name: string; role: string }
const ROWS: Row[] = [
  { id: '1', name: 'Ada', role: 'Owner' },
  { id: '2', name: 'Grace', role: 'Editor' },
]

export function Gallery({ contracts }: { contracts: Record<string, ContractMeta> }) {
  const [checked, setChecked] = useState(true)
  const [radio, setRadio] = useState('b')
  const [switched, setSwitched] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sort, setSort] = useState<Sort>({ key: 'name', direction: 'asc' })

  const Specimen = ({ name, note, children }: { name: string; note?: string; children: ReactNode }) => {
    const meta = contracts[name]
    return (
      <section className={styles.specimen}>
        <div className={styles.head}>
          <h3 className={styles.name}>{name}</h3>
          {meta ? <span className={styles.version}>v{meta.version}</span> : null}
          {meta ? (
            <a
              className={styles.contractLink}
              href={`https://github.com/ssimorka/graphite-ui/blob/main/docs/contracts/${meta.slug}.md`}
            >
              contract
            </a>
          ) : null}
        </div>
        <div className={styles.demo}>{children}</div>
        {note ? <p className={styles.note}>{note}</p> : null}
      </section>
    )
  }

  const Swatch = ({ label, children }: { label: string; children: ReactNode }) => (
    <span className={styles.swatch}>
      {children}
      <span className={styles.swatchLabel}>{label}</span>
    </span>
  )

  const Wave = ({ n, children }: { n: string; children: ReactNode }) => (
    <div className={styles.wave}>
      <h2 className={styles.waveTitle}>{WAVES[n]}</h2>
      {children}
    </div>
  )

  return (
    <div className={styles.page}>
      <Typography variant="heading-1">Components</Typography>
      <p className={styles.lede}>
        Every Tier 1 component, rendered from the same generated tokens as the
        rest of the site — change the source color and this page moves with it.
        Each carries the version of the contract it implements, read from the
        contract file at build time rather than typed here.
      </p>

      <Wave n="0">
        <Specimen name="Button" note="One primary action per group — a Card or Dialog footer refuses a second, and destructive work takes danger rather than primary.">
          <Button variant="primary">Primary</Button>
          <Button>Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </Specimen>
        <Specimen name="Button" note="asChild renders the button onto its child, so a link can be button-shaped without a button wrapping an anchor. Sizes run sm to lg, plus a square icon size whose accessible name still has to be given.">
          <Button asChild>
            <a href="/docs">A link, styled as a button</a>
          </Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M7.25 3h1.5v4.25H13v1.5H8.75V13h-1.5V8.75H3v-1.5h4.25V3z" fill="currentColor" />
            </svg>
          </Button>
        </Specimen>
      </Wave>

      <Wave n="1">
        <Specimen name="Label" note="Always bound to exactly one control; Field is what normally supplies the pairing.">
          <div className={styles.stack}>
            <Label htmlFor="g-label" required>Label with required indicator</Label>
            <Input id="g-label" required placeholder="The control it names" />
          </div>
        </Specimen>
        <Specimen name="Separator" note="Structural only — it carries no margin, because spacing belongs to the layout that places it.">
          <div className={styles.stack}>
            <Typography>Content above the rule.</Typography>
            <Separator />
            <Typography>Content below it.</Typography>
          </div>
        </Specimen>
        <Specimen name="Typography">
          <div className={styles.stack}>
            <Typography variant="heading-3">Heading three</Typography>
            <Typography>Body text sits at the default variant.</Typography>
            <Typography variant="caption">Caption</Typography>
          </div>
        </Specimen>
        <Specimen name="Avatar" note="The fourth has an unreadable image source: failure falls back to initials, never a broken icon or an empty circle.">
          <Swatch label="sm"><Avatar initials="AD" size="sm" /></Swatch>
          <Swatch label="md"><Avatar initials="GR" size="md" /></Swatch>
          <Swatch label="lg square"><Avatar initials="AL" size="lg" shape="square" /></Swatch>
          <Swatch label="status dot"><Avatar initials="ZO" size="lg" status={{ label: 'Online' }} /></Swatch>
          <Swatch label="broken image"><Avatar initials="XX" src="data:image/png;base64,not-an-image" alt="broken source" /></Swatch>
        </Specimen>
        <Specimen name="Badge" note="Numeric badges cap rather than overflow; the true value stays in the accessible name.">
          <Badge>neutral</Badge>
          <Badge variant="primary">primary</Badge>
          <Badge variant="danger">danger</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="success">success</Badge>
          <Badge>{1200}</Badge>
        </Specimen>
        <Specimen name="Progress">
          <div className={styles.stack}>
            <Progress value={62} label="Determinate example" />
            <Progress variant="indeterminate" label="Indeterminate example" />
          </div>
        </Specimen>
      </Wave>

      <Wave n="2">
        <Specimen name="Input">
          <div className={styles.stack}>
            <Input id="g-in" placeholder="Default" />
            <Input id="g-in-e" state="error" defaultValue="Error state" />
            <Input id="g-in-d" state="disabled" defaultValue="Disabled" />
          </div>
        </Specimen>
        <Specimen name="Textarea">
          <div className={styles.stack}>
            <Textarea id="g-ta" defaultValue="Resizes vertically only." />
          </div>
        </Specimen>
        <Specimen name="Checkbox" note="Indeterminate is a distinct glyph, not a recolored check.">
          <div className={styles.stack}>
            <Checkbox id="g-cb" label="Checked" checked={checked} onChange={setChecked} />
            <Checkbox id="g-cb2" label="Indeterminate" indeterminate />
            <Checkbox id="g-cb3" label="Disabled" disabled />
          </div>
        </Specimen>
        <Specimen name="Radio Group" note="A group legend is required; option labels alone are not enough.">
          <RadioGroup
            name="g-radio"
            label="Group legend"
            value={radio}
            onChange={setRadio}
            options={[
              { value: 'a', label: 'First' },
              { value: 'b', label: 'Second' },
              { value: 'c', label: 'Disabled', disabled: true },
            ]}
          />
        </Specimen>
        <Specimen name="Switch" note="Labels name the setting, never the state.">
          <Switch id="g-sw" label="Notifications" checked={switched} onChange={setSwitched} />
        </Specimen>
        <Specimen name="Select" note="A native select, so type-ahead and arrow keys survive.">
          <div className={styles.stack}>
            <Select
              id="g-sel"
              label="Pick one"
              options={[
                { value: '1', label: 'First' },
                { value: '2', label: 'Second' },
              ]}
            />
          </div>
        </Specimen>
      </Wave>

      <Wave n="3">
        <Specimen name="Field" note="Error text forces the child into its error state — the two cannot be shown apart.">
          <div className={styles.stack}>
            <Field id="g-f1" label="Email" helpText="We never share it."><Input type="email" /></Field>
            <Field id="g-f2" label="Password" errorText="Too short."><Input type="password" /></Field>
          </div>
        </Specimen>
      </Wave>

      <Wave n="4">
        <Specimen name="Card" note="Cards never nest; use a Separator to group content inside one.">
          <div className={styles.stack}>
            <Card
              header={<Typography variant="heading-4">Card header</Typography>}
              body={<Typography>Body content.</Typography>}
              footer={<><Button>Cancel</Button><Button variant="primary">Save</Button></>}
            />
          </div>
        </Specimen>
        <Specimen name="Item" note="The row primitive Table composes from — its hover is the same token Table uses.">
          <div className={styles.stack}>
            <Item
              interactive
              leading={<Avatar initials="AD" size="sm" />}
              title="Item title"
              description="Item description"
              trailing={<Badge variant="success">ok</Badge>}
            />
          </div>
        </Specimen>
        <Specimen name="Tabs" note="Inactive panels stay mounted, so form state in a tab survives switching away.">
          <div className={styles.stack}>
            <Tabs
              tabs={[
                { id: 'a', label: 'First', panel: <Typography>First panel</Typography> },
                { id: 'b', label: 'Second', panel: <Typography>Second panel</Typography> },
              ]}
            />
          </div>
        </Specimen>
        <Specimen name="Breadcrumb" note="Long trails collapse their middle rather than wrapping; the last crumb is not a link.">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'One', href: '/1' },
              { label: 'Two', href: '/2' },
              { label: 'Three', href: '/3' },
              { label: 'Current' },
            ]}
          />
        </Specimen>
        <Specimen name="Navigation Menu" note="Two levels only — a third would be a page, not a deeper flyout.">
          <NavigationMenu
            items={[
              { label: 'System', href: '#', current: true, items: [{ label: 'Color', href: '#' }] },
              { label: 'Docs', href: '#' },
            ]}
          />
        </Specimen>
      </Wave>

      <Wave n="5">
        <Specimen name="Tooltip" note="Supplementary only, and never interactive — a tooltip you can click into is a Popover.">
          <Tooltip content="Supplementary text">
            <Button>Hover or focus me</Button>
          </Tooltip>
        </Specimen>
        <Specimen name="Popover" note="Escape dismisses and focus returns to the trigger, from the shared Overlay base.">
          <Popover defaultOpen trigger={(p) => <Button {...p}>Open popover</Button>}>
            <Typography>Interactive content is allowed here.</Typography>
          </Popover>
        </Specimen>
        <Specimen name="Dropdown Menu" note="Destructive items never read as neutral ones.">
          <DropdownMenu
            trigger={(p) => <Button {...p}>Open menu</Button>}
            items={[
              { label: 'Rename', onSelect: () => {} },
              { kind: 'separator' },
              { label: 'Delete', onSelect: () => {}, destructive: true },
            ]}
          />
        </Specimen>
        <Specimen name="Dialog" note="Traps focus, returns it to the trigger on close, and never stacks.">
          <Button variant="primary" onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="Dialog title"
            body={<Typography>Dialog body content.</Typography>}
            footer={<Button variant="primary" onClick={() => setDialogOpen(false)}>Close</Button>}
          />
        </Specimen>
        <Specimen name="Alert" note="Inline and persistent — not a toast, which is Tier 2 with its own timing contract.">
          <div className={styles.stack}>
            <Alert variant="info" title="Info" body="Informational alert." />
            <Alert variant="danger" title="Danger" body="Danger alert." />
            <Alert variant="warning" body="Warning alert." />
            <Alert variant="success" body="Success alert." />
          </div>
        </Specimen>
      </Wave>

      <Wave n="6">
        <Specimen name="Table" note="Sticky headers survive scroll, and row hover is Item's token rather than a table-specific highlight.">
          <Table<Row>
            caption="Members"
            columns={[
              {
                key: 'name',
                header: 'Name',
                sortable: true,
                render: (r) => (
                  <Item leading={<Avatar initials={r.name.slice(0, 2)} size="sm" />} title={r.name} />
                ),
              },
              { key: 'role', header: 'Role', sortable: true },
            ]}
            rows={ROWS}
            getRowKey={(r) => r.id}
            sort={sort}
            onSortChange={(key) =>
              setSort((s) => ({
                key,
                direction: s.key === key && s.direction === 'asc' ? 'desc' : 'asc',
              }))
            }
          />
        </Specimen>
      </Wave>
    </div>
  )
}
