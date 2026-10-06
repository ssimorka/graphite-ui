import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
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
import { shadcnAdd } from '@/lib/registry-url'
import type { ComponentDocConfig } from './types'
import styles from './component-doc.module.scss'

// Contract tokens that name a foundation rather than a colour role. Every other
// token is a role, and paints its own swatch from `--graphite-<name>`.
const NOT_A_COLOUR = new Set(['spacing', 'text', 'motion', 'radius', 'density', 'font'])

/**
 * The page's sections, in page order. Exported so the search index lists the
 * same sections the page renders, rather than a second copy of this list.
 */
export function componentToc(c: ComponentDocConfig) {
  return [
    { href: '#live-preview', label: 'Live preview' },
    { href: '#installation', label: 'Installation' },
    { href: '#anatomy', label: 'Anatomy' },
    ...(c.variants?.length ? [{ href: '#variants', label: 'Variants' }] : []),
    ...(c.states?.length ? [{ href: '#states', label: 'States' }] : []),
    { href: '#api', label: 'API reference' },
    { href: '#tokens', label: 'Design tokens' },
    { href: '#usage', label: 'Usage' },
    { href: '#accessibility', label: 'Accessibility' },
    ...(c.parity?.length ? [{ href: '#parity', label: 'Figma parity' }] : []),
    { href: '#related', label: 'Related' },
  ]
}

/**
 * One component page, laid out as the Accordion page (Graphite UI Site
 * 11814:18) was. The contract supplies the version, wave, slots, props and
 * tokens; the config supplies the demos and the prose. So a page cannot
 * describe a prop the component does not have, and a new component page is a
 * config file, not a copy of this one.
 */
export function ComponentDocPage({ config: c }: { config: ComponentDocConfig }) {
  const contract = readContractDoc(c.slug)
  const kit = c.kitTitle ? readKitPage(c.kitTitle) : null
  const figmaUrl = kit
    ? c.figmaNode
      ? kit.url.replace(/node-id=[^&]+/, `node-id=${c.figmaNode.replace(':', '-')}`)
      : kit.url
    : null

  const hasVariants = !!c.variants?.length
  const hasStates = !!c.states?.length
  const hasParity = !!c.parity?.length
  const toc = componentToc(c)

  const swatch = (name: string) =>
    c.swatches && name in c.swatches
      ? c.swatches[name]
      : NOT_A_COLOUR.has(name)
        ? null
        : `--graphite-${name}`

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={toc}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>Contract {contract.version}</p>
            <p className={styles.footnoteBody}>{c.tocNote}</p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb
              items={[
                { label: 'Docs', href: '/docs' },
                { label: 'Components', href: '/gallery' },
                { label: c.name },
              ]}
            />
            <h1 className={styles.title}>{c.name}</h1>
            <p className={styles.lede}>{c.lede}</p>
            <div className={styles.statusRow}>
              <StatusBadge tone="success">{`Contract ${contract.version}`}</StatusBadge>
              {contract.wave ? (
                <StatusBadge tone="neutral">{`Wave ${contract.wave}`}</StatusBadge>
              ) : null}
              {kit ? (
                <StatusBadge tone="neutral">{`Kit · ${kit.sets} sets · ${kit.variants} variants`}</StatusBadge>
              ) : (
                <StatusBadge tone="neutral">No kit page</StatusBadge>
              )}
              {figmaUrl ? (
                <a
                  className={styles.figmaLink}
                  href={figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Figma <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </header>

          <section id="live-preview" className={styles.block}>
            <SectionHeading
              title="Live preview"
              lede="Rendered by the component itself from the same generated tokens as the rest of the site."
            />
            {c.livePreview}
          </section>

          <section id="installation" className={styles.block}>
            <SectionHeading
              title="Installation"
              lede="Install it with the shadcn CLI, along with everything it uses. New project? Set it up first, as Quick start shows."
            />
            <DocSnippet code={shadcnAdd(c.slug)} />
            <DocSnippet code={c.install} />
          </section>

          <section id="anatomy" className={styles.block}>
            <SectionHeading
              title="Anatomy"
              lede={
                c.anatomyLede ??
                'Slots come from the contract, so this list and the code cannot disagree about what the component is made of.'
              }
            />
            <div className={styles.diagram}>
              <div className={styles.diagramItem}>{c.anatomy}</div>
            </div>
            {contract.slots.length ? (
              <ol className={styles.slotList}>
                {contract.slots.map((slot, i) => (
                  <li key={slot.name} className={styles.slotRow}>
                    <span className={styles.slotMarker} aria-hidden="true">{i + 1}</span>
                    <span className={styles.slotName}>{slot.name}</span>
                    <span className={styles.slotReq}>{slot.required ? 'Required' : 'Optional'}</span>
                    <span className={styles.slotNotes}>
                      {slot.inheritedFrom ? `${slot.notes} (from ${slot.inheritedFrom})` : slot.notes}
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </section>

          {hasVariants ? (
            <section id="variants" className={styles.block}>
              <SectionHeading title="Variants" lede={c.variantsLede} />
              <div className={styles.variants}>
                {c.variants!.map((v) => (
                  <Surface key={v.label} label={v.label}>
                    {v.node}
                  </Surface>
                ))}
              </div>
            </section>
          ) : null}

          {hasStates ? (
            <section id="states" className={styles.block}>
              <SectionHeading
                title="States"
                lede={
                  c.statesLede ??
                  'These are variant axes in the kit and pseudo-classes in the code. A State=Hover variant is a picture of a behaviour, not an instruction to add a hover prop, so the page shows them as a matrix rather than as props.'
                }
              />
              <div className={styles.matrix}>
                {c.states!.map((s) => (
                  <div key={s.label} className={`${styles.matrixRow} ${s.className ?? ''}`}>
                    <span className={styles.matrixLabel}>{s.label}</span>
                    <div className={styles.matrixCell}>{s.node}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section id="api" className={styles.block}>
            <SectionHeading
              title="API reference"
              lede="Generated from the contract, versioned with it, and checked by drift-check. This table cannot describe props the component does not have."
            />
            <RefTable
              caption={`${c.name} props`}
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
                p.inheritedFrom ? `${p.notes} (from ${p.inheritedFrom})` : p.notes,
              ])}
            />
          </section>

          <section id="tokens" className={styles.block}>
            <SectionHeading
              title="Design tokens"
              lede="Every swatch is live. Change the source color in the header and this table repaints, because it reads the same roles the component does."
            />
            {contract.tokens.length ? (
              <TokenTable
                rows={contract.tokens.map((t) =>
                  // An inherited row that names no contract has no role to paint, so
                  // it is named by where it comes from and gets the empty swatch.
                  !t.name
                    ? { name: `from ${t.inheritedFrom}`, usage: t.usage, swatch: null }
                    : {
                        name: t.name,
                        usage: t.inheritedFrom ? `${t.usage} (from ${t.inheritedFrom})` : t.usage,
                        swatch: swatch(t.name),
                      },
                )}
              />
            ) : (
              <p className={styles.lede}>
                The contract declares no tokens: this component draws nothing of its own.
              </p>
            )}
          </section>

          <section id="usage" className={styles.block}>
            <SectionHeading
              title="Usage"
              lede="The contract's prohibitions, written as the choices you will actually face."
            />
            <DoDont dos={c.dos} donts={c.donts} />
          </section>

          <section id="accessibility" className={styles.block}>
            <SectionHeading
              title="Accessibility"
              lede="What the component does for you, and what it leaves to you."
            />
            <NotesList rows={c.a11y} />
          </section>

          {hasParity ? (
            <section id="parity" className={styles.block}>
              <SectionHeading
                title="Figma parity"
                lede={
                  c.parityLede ??
                  `The kit's ${c.kitTitle} page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets. The code exposes ${contract.props.length} props. This table is where those two facts are reconciled instead of quietly diverging.`
                }
              />
              <RefTable
                caption="Kit axes and how they map to code"
                columns={[
                  { label: 'Kit axis', tone: 'name' },
                  { label: 'Values', tone: 'type' },
                  { label: 'Code', tone: 'muted' },
                  { label: 'How it maps', tone: 'text' },
                ]}
                rows={c.parity!}
              />
            </section>
          ) : null}

          <section id="related" className={styles.block}>
            <SectionHeading title="Related" lede="Components that answer a nearby question." />
            <RelatedChips items={c.related} />
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
