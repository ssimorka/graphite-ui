import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { DocSnippet } from '@/components/doc-snippet'
import { SectionHeading, StatusBadge } from '@/components/doc-blocks'
import {
  DoDont,
  NotesList,
  RefTable,
  RelatedChips,
  Surface,
  TokenTable,
} from '@/components/component-page'
import { readContractDoc } from '@/lib/contract-doc'
import { readKitPage } from '@/lib/kit-page'
import { readKitStats } from '@/lib/kit-stats'
import { spell } from '@/lib/spell'
import { LivePreview } from './live-preview'
import styles from './accordion-page.module.scss'

export const metadata: Metadata = {
  title: 'Accordion · Graphite UI',
  description:
    'A vertically stacked set of headings that each reveal a section of content. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
}

const FIGMA_URL =
  'https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=2154-8478'

const TOC = [
  { href: '#live-preview', label: 'Live preview' },
  { href: '#installation', label: 'Installation' },
  { href: '#anatomy', label: 'Anatomy' },
  { href: '#variants', label: 'Variants' },
  { href: '#states', label: 'States' },
  { href: '#api', label: 'API reference' },
  { href: '#tokens', label: 'Design tokens' },
  { href: '#usage', label: 'Usage' },
  { href: '#accessibility', label: 'Accessibility' },
  { href: '#parity', label: 'Figma parity' },
  { href: '#related', label: 'Related' },
]

// A colour role paints its own swatch. The foundations have no colour, and the
// focus ring is reached through `--graphite-focus`, not a role variable of its own.
const SWATCH: Record<string, string | null> = {
  surface: '--graphite-surface',
  'on-surface': '--graphite-on-surface',
  'on-surface-variant': '--graphite-on-surface-variant',
  'surface-variant': '--graphite-surface-variant',
  primary: '--graphite-focus',
  spacing: null,
  text: null,
  motion: null,
}

export default function AccordionPage() {
  const contract = readContractDoc('accordion')
  const kit = readKitPage('Accordion')
  const governed = readKitStats().governed

  const items = [
    {
      value: 'ready',
      title: 'Is Graphite UI production ready?',
      body: `${spell(governed)} components carry a versioned contract and are checked against the Figma kit on every build.`,
    },
    {
      value: 'carbon',
      title: 'Does it require Carbon?',
      body: 'Not for the components. The site still leans on Carbon for a few pieces of chrome, and moving off it is a tracked migration.',
    },
    {
      value: 'theming',
      title: 'How does theming work?',
      body: 'One source color becomes the ramps and the roles. Change it in the header and the page repaints.',
    },
  ]

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>Contract {contract.version}</p>
            <p className={styles.footnoteBody}>
              Adopted for the docs site. It replaces Carbon&rsquo;s Accordion on
              the home page&rsquo;s FAQ.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb
              items={[
                { label: 'Docs', href: '/docs' },
                { label: 'Components', href: '/gallery' },
                { label: 'Accordion' },
              ]}
            />
            <h1 className={styles.title}>Accordion</h1>
            <p className={styles.lede}>
              A vertically stacked set of headings that each reveal a section of
              content. Use it to shorten a long page, never to hide information
              a reader needs to complete the task in front of them.
            </p>
            <div className={styles.statusRow}>
              <StatusBadge tone="success">{`Contract ${contract.version}`}</StatusBadge>
              <StatusBadge tone="neutral">{`Wave ${contract.wave}`}</StatusBadge>
              {kit ? (
                <StatusBadge tone="neutral">{`Kit · ${kit.sets} sets · ${kit.variants} variants`}</StatusBadge>
              ) : null}
              <a
                className={styles.figmaLink}
                href={FIGMA_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Figma <span aria-hidden="true">↗</span>
              </a>
            </div>
          </header>

          <section id="live-preview" className={styles.block}>
            <SectionHeading
              title="Live preview"
              lede="Rendered by the component itself from the same generated tokens as the rest of the site."
            />
            <LivePreview items={items} />
          </section>

          <section id="installation" className={styles.block}>
            <SectionHeading
              title="Installation"
              lede="Graphite ships as a published Figma library and a governed React implementation. There is no registry command yet, so this is an import, not an install."
            />
            <DocSnippet
              code={
                "import {\n  Accordion,\n  AccordionItem,\n  AccordionTrigger,\n  AccordionContent,\n} from '@/components/ui/accordion'"
              }
            />
          </section>

          <section id="anatomy" className={styles.block}>
            <SectionHeading
              title="Anatomy"
              lede="Slots come from the contract, so this diagram and the code cannot disagree about what the component is made of."
            />
            <div className={styles.diagram}>
              <div className={styles.diagramItem}>
                <span className={`${styles.marker} ${styles.markTrigger}`} aria-hidden="true">1</span>
                <span className={`${styles.marker} ${styles.markIndicator}`} aria-hidden="true">2</span>
                <span className={`${styles.marker} ${styles.markPanel}`} aria-hidden="true">3</span>
                <Accordion type="single" defaultValue="anatomy">
                  <AccordionItem value="anatomy" title="Trigger label">
                    The panel. It is labelled by its own trigger, so a screen
                    reader announces the pair rather than an orphaned region.
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <ol className={styles.slotList}>
              {contract.slots.map((slot, i) => (
                <li key={slot.name} className={styles.slotRow}>
                  <span className={styles.slotMarker} aria-hidden="true">{i + 1}</span>
                  <span className={styles.slotName}>{slot.name}</span>
                  <span className={styles.slotReq}>{slot.required ? 'Required' : 'Optional'}</span>
                  <span className={styles.slotNotes}>{slot.notes}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="variants" className={styles.block}>
            <SectionHeading
              title="Variants"
              lede="Three axes travel from the kit into the code as props. Size, alignment and flush are all one-word choices; everything else about an accordion is composition."
            />
            <div className={styles.variants}>
              <Surface label="Size: Small">
                <Accordion size="sm">
                  <AccordionItem title="Section title">Panel content.</AccordionItem>
                </Accordion>
              </Surface>
              <Surface label="Size: Large">
                <Accordion size="lg">
                  <AccordionItem title="Section title">Panel content.</AccordionItem>
                </Accordion>
              </Surface>
              <Surface label="Alignment: Left">
                <Accordion align="left">
                  <AccordionItem title="Section title">Panel content.</AccordionItem>
                </Accordion>
              </Surface>
              <Surface label="Flush: True">
                <Accordion flush>
                  <AccordionItem title="Section title">Panel content.</AccordionItem>
                </Accordion>
              </Surface>
            </div>
          </section>

          <section id="states" className={styles.block}>
            <SectionHeading
              title="States"
              lede="These are variant axes in the kit and pseudo-classes in the code. A State=Hover variant is a picture of a behaviour, not an instruction to add a hover prop, so the page shows them as a matrix rather than as props."
            />
            <div className={styles.matrix}>
              <div className={styles.matrixRow}>
                <span className={styles.matrixLabel}>Enabled</span>
                <Accordion>
                  <AccordionItem title="Section title">Panel content.</AccordionItem>
                </Accordion>
              </div>
              <div className={`${styles.matrixRow} ${styles.forceHover}`}>
                <span className={styles.matrixLabel}>Hover</span>
                <Accordion>
                  <AccordionItem title="Section title">Panel content.</AccordionItem>
                </Accordion>
              </div>
              <div className={`${styles.matrixRow} ${styles.forceFocus}`}>
                <span className={styles.matrixLabel}>Focus</span>
                <Accordion>
                  <AccordionItem title="Section title">Panel content.</AccordionItem>
                </Accordion>
              </div>
              <div className={styles.matrixRow}>
                <span className={styles.matrixLabel}>Disabled</span>
                <Accordion>
                  <AccordionItem disabled title="Section title">Panel content.</AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          <section id="api" className={styles.block}>
            <SectionHeading
              title="API reference"
              lede="Generated from the contract, versioned with it, and checked by drift-check. This table cannot describe props the component does not have."
            />
            <RefTable
              caption="Accordion props"
              columns={[
                { label: 'Prop', tone: 'name' },
                { label: 'Type', tone: 'type' },
                { label: 'Default', tone: 'muted' },
                { label: 'Notes', tone: 'text' },
              ]}
              rows={contract.props.map((p) => [
                p.name,
                p.type || '—',
                p.default || '—',
                p.notes,
              ])}
            />
          </section>

          <section id="tokens" className={styles.block}>
            <SectionHeading
              title="Design tokens"
              lede="Every swatch is live. Change the source color in the header and this table repaints, because it reads the same roles the component does."
            />
            <TokenTable
              rows={contract.tokens.map((t) => ({
                name: t.name,
                usage: t.usage,
                swatch: SWATCH[t.name] ?? null,
              }))}
            />
          </section>

          <section id="usage" className={styles.block}>
            <SectionHeading
              title="Usage"
              lede="The contract's prohibitions, written as the choices you will actually face."
            />
            <DoDont
              dos={[
                'Let a reader open more than one panel when the panels are independent.',
                'Keep the trigger a real button, so Enter and Space both work.',
                'Use flush when the list already sits inside something with a border.',
                'Pair the indicator with a change the reader can also feel in layout.',
              ]}
              donts={[
                'Hide anything the reader needs to finish the task in front of them.',
                'Nest an accordion inside an accordion. Two levels of disclosure is a navigation problem wearing a component.',
                'Animate the panel on a hardcoded duration. The motion tokens exist, so bind them.',
                'Let the indicator carry the open state on its own.',
              ]}
            />
          </section>

          <section id="accessibility" className={styles.block}>
            <SectionHeading
              title="Accessibility"
              lede="What the component does for you, and what it leaves to you."
            />
            <NotesList
              rows={[
                ['Keyboard', 'Tab moves between triggers. Enter and Space both toggle the panel the focus is on. Nothing traps focus inside a panel.'],
                ['Roles', 'Each trigger is a button carrying aria-expanded and aria-controls; each panel is labelled by its own trigger.'],
                ['Focus', <>The focus ring is <code>--graphite-focus</code> and is never removed, only moved.</>],
                ['Contrast', 'Trigger label against surface is measured at the theme’s target, AA or AAA, and the pairing is checked rather than reviewed.'],
                ['Motion', 'The open transition respects prefers-reduced-motion and falls back to an instant change.'],
              ]}
            />
          </section>

          <section id="parity" className={styles.block}>
            <SectionHeading
              title="Figma parity"
              lede={`The kit's Accordion page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets, and 120 of them are the one Accordion item set. The code exposes ${contract.props.length} props. This table is where those two facts are reconciled instead of quietly diverging.`}
            />
            <RefTable
              caption="Kit axes and how they map to code"
              columns={[
                { label: 'Kit axis', tone: 'name' },
                { label: 'Values', tone: 'type' },
                { label: 'Code', tone: 'muted' },
                { label: 'How it maps', tone: 'text' },
              ]}
              rows={[
                ['Size', 'Small · Medium · Large', 'size', 'One to one.'],
                ['Alignment', 'Right · Left', 'align', 'One to one.'],
                ['Flush', 'False · True', 'flush', 'One to one.'],
                ['Expanded', 'False · True', '—', 'Runtime state, not a prop. The kit draws it because Figma has no other way to show it.'],
                ['State', 'Enabled → Skeleton', '—', 'Pseudo-classes in code. Governance rule 7: a State=Hover variant is not an instruction to add a hover prop. Skeleton has no counterpart: nothing in an accordion loads asynchronously.'],
                ['Slot', 'Boolean + swap', 'children', 'Composition. The caller passes content instead of choosing from a fixed pair.'],
              ]}
            />
          </section>

          <section id="related" className={styles.block}>
            <SectionHeading
              title="Related"
              lede="Components that answer a nearby question."
            />
            <RelatedChips
              items={[
                { href: '/gallery#specimen-tabs', title: 'Tabs', why: 'the other disclosure' },
                { href: '/gallery#specimen-contained-list', title: 'Contained list', why: 'when nothing should be hidden' },
                { href: '/gallery#specimen-modal', title: 'Modal', why: 'when it should interrupt' },
                { href: '/gallery#specimen-typography', title: 'Typography', why: 'the trigger label’s type' },
              ]}
            />
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
