import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { DocSnippet } from '@/components/doc-snippet'
import {
  Callout,
  NextCard,
  NextCards,
  SectionHeading,
  StatusBadge,
} from '@/components/doc-blocks'
import { RefTable } from '@/components/component-page'
import { readContractDoc } from '@/lib/contract-doc'
import { readKitStats } from '@/lib/kit-stats'
import { spell } from '@/lib/spell'
import { readCiSteps, readContractRows, readRuleNumbers, readUnclaimed } from './read'
import { TOC } from './toc'
import styles from './governance.module.scss'

export const metadata: Metadata = {
  title: 'Governance · Graphite UI',
  description:
    'How Graphite keeps the Figma kit, the written contracts and the React code in agreement: the eight governance rules, the three drift checks, and the CI job that main requires.',
}

const REPO = 'https://github.com/ssimorka/graphite-ui/blob/main'
const README = `${REPO}/docs/contracts/README.md`
const lower = (n: number) => spell(n).toLowerCase()

/** A contract string with its Markdown `code` spans rendered as code. */
const withCode = (s: string) =>
  s.split(/`([^`]+)`/).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))

// The rules in the site's own words, numbered as docs/contracts/README.md
// numbers them. The README is the authority; readRuleNumbers() reads its list
// back so a rule added or removed there shows up here as a mismatch rather
// than going unnoticed.
const RULES: { n: number; text: ReactNode; href?: string }[] = [
  {
    n: 1,
    text: (
      <>
        Every component has one contract file,{' '}
        <code>docs/contracts/&lt;component&gt;.md</code>, in the same repo as the
        site.
      </>
    ),
    href: '#contracts',
  },
  {
    n: 2,
    text: 'No component code changes without a matching contract update first, even for one-line fixes.',
  },
  {
    n: 3,
    text: 'Each contract is versioned with semver. A prohibition change is breaking, a new optional slot is minor, and a copy or description edit is a patch.',
  },
  {
    n: 4,
    text: 'A drift check reads each contract’s declared tokens and verifies the component’s code references exactly those variables, and nothing else. It fails the build on a mismatch.',
    href: '#checks',
  },
  {
    n: 5,
    text: 'Figma components carry their contract version in the description field, so anyone opening the file knows which spec they are looking at.',
  },
  {
    n: 6,
    text: 'Every component set in the kit is either governed (a contract or a pattern doc declares it, and its description carries that version) or ungoverned, and says so in the same place. Nothing is unlabelled.',
    href: '#governed',
  },
  {
    n: 7,
    text: 'Where the kit and a contract disagree, the kit wins: correct the contract, not the kit. Where the kit disagrees with itself, the more specific artefact wins. Where the kit has no opinion, the code keeps its own.',
    href: '#kit-canonical',
  },
  {
    n: 8,
    text: 'Rules 6 and 7 say who wins; neither says what should exist. A governed component with no counterpart in the kit is kept only while something needs it, and rule 6’s demand test decides.',
    href: '#existence',
  },
]

// What each check reads and proves. The Installation page has the same three
// in a shorter table; this one adds what each compares against, which is the
// part that says why there are three.
const CHECKS = [
  {
    name: 'drift-check',
    script: 'scripts/drift-check.mjs',
    compares: 'Components against their contracts',
    proves:
      'Every component references exactly the --graphite-* variables its contract’s tokens produce, and nothing else. It asks lib/color.js what the engine emits, so a contract cannot declare a role that does not exist. --cds-* references warn rather than fail.',
  },
  {
    name: 'token-drift',
    script: 'scripts/token-drift.mjs',
    compares: 'globals.scss against docs/tokens/figma-snapshot.json',
    proves:
      'The foundations the browser gets (spacing, radius, breakpoints, type) still say what the kit says. A difference is drift whichever side moved; the check cannot tell which.',
  },
  {
    name: 'component-doc-drift',
    script: 'scripts/component-doc-drift.mjs',
    compares: 'docs/components/*.md against docs/tokens/figma-components.json',
    proves:
      'Every Figma node id a doc cites still resolves, and every public set on a page a doc covers is named or cited in that doc. This is what catches the kit gaining a set nobody wrote up.',
  },
]

// The six components rule 8 was written for, as the README sorts them.
const SIX: [string, string, string, string][] = [
  ['Separator, Avatar, Card', '3', 'None; only the gallery composed them', 'Removed'],
  ['Label, Field', '2', 'Answered on the form controls instead', 'Absorbed'],
  ['Navigation Menu', '3, until 2026-10-08', 'site-header.tsx, and step 1 of the shadcn migration', 'Kept; now inverted against the kit’s Header menu sets'],
  ['Typography', '3', 'Two contracts depend on it, one in a prohibition', 'Kept'],
]

export default function GovernancePage() {
  const stats = readKitStats()
  const contracts = readContractRows()
  const ruleNumbers = readRuleNumbers()
  const ciSteps = readCiSteps()
  const unclaimed = readUnclaimed()
  const button = readContractDoc('button')

  const rulesMatch =
    ruleNumbers.length === RULES.length && RULES.every((r, i) => ruleNumbers[i] === r.n)
  const claimedPages = unclaimed ? stats.pages - unclaimed.pages : null

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>The kit is canonical</p>
            <p className={styles.footnoteBody}>
              Since 2026-08-28. Where the kit and a contract disagree, the
              contract is corrected.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/contribute/governance')} />
            <h1 className={styles.title}>Governance</h1>
            <p className={styles.lede}>
              Graphite exists three times: as a Figma kit, as a written contract
              per component, and as React code. Governance is what keeps the
              three saying the same thing. It is a solo-maintainer model, so it
              relies on a fixed place where truth lives and scripts that check
              reality against it, not on review gates.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">{`${stats.governed} governed components`}</StatusBadge>
            </div>
          </header>

          <section id="contracts" className={styles.block}>
            <SectionHeading
              title="Contracts"
              lede="A contract is a Markdown file whose frontmatter says what a component is: what it contains, what it accepts, which tokens it may use, and what it must never do."
            />
            <table className={`${styles.table} ${styles.fields}`}>
              <caption className={styles.srOnly}>Contract frontmatter fields</caption>
              <tbody>
                <tr>
                  <th scope="row">slots</th>
                  <td>The parts a caller fills, and whether each is required.</td>
                </tr>
                <tr>
                  <th scope="row">props</th>
                  <td>The component&rsquo;s API: each prop, its values, and why.</td>
                </tr>
                <tr>
                  <th scope="row">tokens</th>
                  <td>
                    The only roles the code may reference. The drift check holds
                    the implementation to this list exactly.
                  </td>
                </tr>
                <tr>
                  <th scope="row">composition_rules</th>
                  <td>How it behaves alongside other components.</td>
                </tr>
                <tr>
                  <th scope="row">prohibitions</th>
                  <td>What it must never do. Changing one is a breaking change.</td>
                </tr>
              </tbody>
            </table>
            <p className={styles.note}>
              Each also carries <code>component</code>, <code>version</code>{' '}
              and <code>wave</code>. Button is the reference implementation,
              at {button.version}: {lower(button.slots.length)} {button.slots.length === 1 ? 'slot' : 'slots'},{' '}
              {lower(button.props.length)} props, {lower(button.tokens.length)}{' '}
              tokens and {lower(button.prohibitions.length)} prohibitions. Its
              prohibitions, as the contract states them:
            </p>
            <ul className={styles.quoted}>
              {button.prohibitions.map((p) => (
                <li key={p}>{withCode(p)}</li>
              ))}
            </ul>
            <p className={styles.note}>
              Read the whole file at{' '}
              <a className={styles.link} href={`${REPO}/docs/contracts/button.md`}>
                docs/contracts/button.md
              </a>
              , or see it rendered as{' '}
              <a className={styles.link} href="/docs/components/button">
                the Button page
              </a>
              , whose API and token tables are read from it.
            </p>
            <RefTable
              caption="Every contract, read from docs/contracts"
              columns={[
                { label: 'Contract', tone: 'name' },
                { label: 'Version', tone: 'type' },
                { label: 'Wave', tone: 'muted' },
                { label: 'Declares', tone: 'muted' },
                { label: 'Composition', tone: 'muted' },
              ]}
              rows={contracts.map((c) => [
                <a key={c.slug} className={styles.link} href={`/docs/components/${c.slug}`}>
                  {c.component}
                </a>,
                `v${c.version}`,
                `Wave ${c.wave}`,
                `${c.slots} ${c.slots === 1 ? 'slot' : 'slots'} · ${c.props} ${c.props === 1 ? 'prop' : 'props'} · ${c.tokens} ${c.tokens === 1 ? 'token' : 'tokens'}`,
                `${c.rules} ${c.rules === 1 ? 'rule' : 'rules'} · ${c.prohibitions} ${c.prohibitions === 1 ? 'prohibition' : 'prohibitions'}`,
              ])}
            />
            <p className={styles.note}>
              {`${spell(contracts.length)} contracts: the ${lower(stats.governed)} governed components and the Overlay hook they share, read from their frontmatter when this page was built.`} Inherited rows are counted in full, so
              Text area&rsquo;s figures include what it takes from Text input.
              The foundations (spacing, radius, breakpoint, type) have contracts
              too, in <code>docs/contracts/foundations/</code>, and answer to
              token-drift instead.
            </p>
          </section>

          <section id="rules" className={styles.block}>
            <SectionHeading
              title="The rules"
              lede="Numbered as the contracts README numbers them. That file is the authority; this is the same list in plainer words."
            />
            <ol className={styles.rules}>
              {RULES.map((r) => (
                <li key={r.n} className={styles.rule}>
                  <span className={styles.ruleNumber} aria-hidden="true">
                    {r.n}
                  </span>
                  <p className={styles.ruleText}>
                    <span className={styles.srOnly}>Rule {r.n}: </span>
                    {r.text}
                    {r.href ? (
                      <>
                        {' '}
                        <a className={styles.link} href={r.href}>
                          Read more
                        </a>
                      </>
                    ) : null}
                  </p>
                </li>
              ))}
            </ol>
            {rulesMatch ? (
              <p className={styles.note}>
                The README lists {lower(ruleNumbers.length)} rules today, and
                this page checks that when it is built.{' '}
                <a className={styles.link} href={README}>
                  Read the README
                </a>
                .
              </p>
            ) : (
              <Callout title="This list is out of step with the README." tone="warning">
                {`The contracts README now numbers ${ruleNumbers.length} rules (${ruleNumbers.join(', ')}), and this page words ${RULES.length}. The README is the authority; this page needs updating.`}
              </Callout>
            )}
          </section>

          <section id="kit-canonical" className={styles.block}>
            <SectionHeading
              title="The kit is canonical"
              lede="Rule 7. Where the Figma kit and a contract disagree, the kit wins and the contract is corrected."
            />
            <p className={styles.note}>
              This reversed on 2026-08-28. Until then the contract was canonical
              and Figma and the site both implemented it. Contracts are still the
              written spec the code is checked against, and a component still may
              not change without its contract changing first. What moved is
              precedence: a contract now describes the kit rather than outranking
              it, so a disagreement is a bug in the contract. In practice the
              site&rsquo;s components look like the kit&rsquo;s. For Button that
              meant square corners, Carbon&rsquo;s asymmetric{' '}
              <code>0 64px 0 16px</code> inset, a filled secondary, and{' '}
              <code>primary</code> as ghost&rsquo;s label.
            </p>
            <h3 className={styles.subhead}>When the kit is not of one mind</h3>
            <p className={styles.note}>
              Rule 7 settles kit against contract. It does not settle kit against
              kit, which came up three times in one pass, so the tie-break is
              written down rather than re-derived.
            </p>
            <RefTable
              caption="The tie-break and its precedents"
              columns={[
                { label: 'Case', tone: 'name' },
                { label: 'Rule', tone: 'muted' },
                { label: 'What won', tone: 'text' },
              ]}
              rows={[
                [
                  'Input label size',
                  'More specific wins',
                  'The type specimen says 12/12; every form component renders 12/16. The components won: they are what a label actually looks like.',
                ],
                [
                  'Overlay surface',
                  'More specific wins',
                  'surfaceElevated is described as the overlay surface, while the overlay sets fill with Layer/layer-01. The variable won: it was authored for those four components, and the bindings are un-migrated Carbon.',
                ],
                [
                  'Data table header',
                  'Kit has no opinion',
                  'Transparent in the kit, but the code’s header is sticky, and a transparent sticky header lets rows show through. The kit does not model scrolling, so the code keeps surface.',
                ],
                [
                  'Hover, focus, pressed',
                  'Kit has no opinion',
                  'Variant axes in the kit, pseudo-classes in code. A State=Hover variant is not an instruction to add a hover prop.',
                ],
              ]}
            />
            <Callout title="Record the call, don’t just make it.">
              Every one of these is written down in the contract or stylesheet it
              affects, next to the value it explains. A divergence nobody wrote
              down reads as a mistake to the next person, and gets
              &ldquo;fixed&rdquo; back.
            </Callout>
          </section>

          <section id="governed" className={styles.block}>
            <SectionHeading
              title="Governed and ungoverned"
              lede="Rule 6. A set is governed if a contract or a pattern doc declares it, and ungoverned otherwise. Ungoverned sets stay in the kit and say so."
            />
            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt>Kit pages</dt>
                <dd>{stats.pages}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Component sets</dt>
                <dd>{stats.sets}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Public sets</dt>
                <dd>{stats.publicSets}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Contracts</dt>
                <dd>{stats.contracts}</dd>
              </div>
            </dl>
            <p className={styles.note}>
              Counted from the committed kit snapshot and the contracts
              directory. The <code>_</code> prefix is the kit&rsquo;s own line
              between public and private: private sets carry &ldquo;Do not
              edit&rdquo; and are internals the public ones are built from, so
              the labelling duty applies to public sets only.
              {unclaimed && claimedPages !== null
                ? ` The disposition walk of ${unclaimed.date} found ${unclaimed.pages} of the kit’s pages claimed by no contract, holding ${unclaimed.sets} sets (${unclaimed.public} public, ${unclaimed.private} private).`
                : null}
            </p>
            <p className={styles.note}>
              Labelling beats deleting. The harm an ungoverned set does is that a
              designer cannot tell it from a governed one, and saying so in its
              description is the whole fix. The library is published, so
              removing a set is a breaking change for anyone consuming it.
              Movement is one way: a set becomes governed by acquiring a
              contract, and nothing goes back. Contained list was the first to
              move; Accordion was the first adoption the rule decided.
            </p>
            <RefTable
              caption="Where an ungoverned set falls"
              columns={[
                { label: 'Bucket', tone: 'name' },
                { label: 'Examples', tone: 'muted' },
                { label: 'What happens', tone: 'text' },
              ]}
              rows={[
                [
                  'Application shells',
                  'UI shell, Content switcher',
                  'Scheduled to build in wave G3 (decided 2026-10-07). UI shell as three contracts; Content switcher was misfiled here and is a segmented control.',
                ],
                [
                  'Vendor features',
                  'AI label, AI layer, AI explainability popover',
                  'Scheduled to build in wave G3, as Graphite’s own: the AI family tints from the secondary ramp.',
                ],
                [
                  'Carbon idioms',
                  'Structured list, Toggletip, Tile, Code snippet, Loading, Progress indicator, Form, List',
                  'Scheduled to build in wave G3. Form is governed by a pattern doc, not a contract, and adds no wrapper.',
                ],
                [
                  'Built and governed',
                  'Link, Search, Slider, Pagination, Date picker, Time picker, File uploader, Number and Password input, Dropdown, Menu buttons',
                  'Once awaiting demand or folded into another contract. Built with their own contracts on 2026-10-04, so they are governed now.',
                ],
              ]}
            />
          </section>

          <section id="existence" className={styles.block}>
            <SectionHeading
              title="What should exist"
              lede="Rule 8. Rules 6 and 7 say who wins a disagreement. Neither says whether a component should exist at all."
            />
            <ol className={styles.questions}>
              <li>
                <strong>Does the kit have a governed counterpart?</strong> Rule 7
                applies: the kit wins, and the code is brought to it.
              </li>
              <li>
                <strong>
                  If not, does the kit answer the same need inside something it
                  governs?
                </strong>{' '}
                Then absorb it there. The kit ships no Label set, but it has a
                firm opinion about where a label lives: on the control.
              </li>
              <li>
                <strong>Does the kit say nothing at all?</strong> The contract is
                authoritative, and rule 6&rsquo;s demand test decides whether the
                component is kept.
              </li>
            </ol>
            <Callout title="A dependency survives the question; an illustration does not.">
              {[
                'If a reference still reads correctly after substituting something else, it was an illustration. Contained list named Avatar in an optional slot, a Tag replaced it, and the contract lost only a word. Typography is the type of Contained list’s required title slot: remove it and the slot names nothing.',
                '“The repo imports it” is not the test. Only the gallery imports Typography, and that is not what keeps it.',
              ]}
            </Callout>
            <RefTable
              caption="The six components rule 8 was written for"
              columns={[
                { label: 'Component', tone: 'name' },
                { label: 'Question', tone: 'muted' },
                { label: 'Demand', tone: 'text' },
                { label: 'Outcome', tone: 'type' },
              ]}
              rows={SIX}
            />
          </section>

          <section id="checks" className={styles.block}>
            <SectionHeading
              title="Drift checks"
              lede={`${spell(stats.checks)} scripts, each comparing one pair of artefacts. None of them talks to Figma: the Figma-backed two read a committed snapshot, so all ${lower(stats.checks)} run offline.`}
            />
            <table className={`${styles.table} ${styles.checks}`}>
              <caption className={styles.srOnly}>The governance checks</caption>
              <thead>
                <tr>
                  <th scope="col">Check</th>
                  <th scope="col">Compares</th>
                  <th scope="col">What it proves</th>
                </tr>
              </thead>
              <tbody>
                {CHECKS.map((c) => (
                  <tr key={c.name}>
                    <th scope="row">
                      <a className={styles.link} href={`${REPO}/${c.script}`}>
                        {c.name}
                      </a>
                    </th>
                    <td>{c.compares}</td>
                    <td>{c.proves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Callout title="A snapshot check catches the doc drifting, not the snapshot." tone="warning">
              <>
              Re-extracting the kit snapshot is still manual (<code>scripts/component-extract.js</code>{' '}
              through the Figma MCP, then <code>pnpm component-snapshot</code>). Until
              someone does, a change made in Figma is invisible to CI. The
              snapshot&rsquo;s diff is where a kit change becomes reviewable.
              </>
            </Callout>
            <DocSnippet
              code={'pnpm drift-check\npnpm token-drift\npnpm component-doc-drift'}
            />
          </section>

          <section id="ci" className={styles.block}>
            <SectionHeading
              title="CI and main"
              lede="The checks run as one job, governance, and main will not accept a change without it."
            />
            <RefTable
              caption="Steps of the governance job, read from checks.yml"
              columns={[
                { label: 'Step', tone: 'text' },
                { label: 'Runs', tone: 'type' },
              ]}
              rows={ciSteps.map((s) => [s.name, s.run])}
            />
            <p className={styles.note}>
              Read from <code>.github/workflows/checks.yml</code>. Every step
              runs even if an earlier one failed, so a contract change that trips
              more than one check reports them together. The job deliberately
              does not run <code>next build</code>: Vercel already does, and a
              green build proves the site compiles, not that it matches its spec.
            </p>
            <table className={`${styles.table} ${styles.fields}`}>
              <caption className={styles.srOnly}>Branch protection on main</caption>
              <tbody>
                <tr>
                  <th scope="row">Pull request</th>
                  <td>
                    Required for every change, one-line doc edits included. Zero
                    approvals, because a solo maintainer cannot approve their own
                    pull request.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Status check</th>
                  <td>
                    <code>governance</code> must pass. Vercel is not the gate.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Admins</th>
                  <td>
                    Bound too. The one unreviewed change in recent history was
                    the owner pushing straight to main, and an admin bypass would
                    have allowed it.
                  </td>
                </tr>
                <tr>
                  <th scope="row">History</th>
                  <td>
                    Linear, with force pushes and branch deletion off. Up to date
                    before merging is not required: with one pull request in
                    flight it only buys needless rebases.
                  </td>
                </tr>
              </tbody>
            </table>
            <p className={styles.note}>
              If CI is ever broken badly enough to block its own fix, the way out
              is to disable protection, land the fix and re-enable it: a
              deliberate act that leaves a trace, which is what having no bypass
              is meant to cost.
            </p>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="The contracts, the components they govern, and the checks in practice."
            />
            <NextCards>
              <NextCard href={README} title="Contracts README">
                The authority for everything on this page, including the build
                order and the component API conventions.
              </NextCard>
              <NextCard href="/gallery" title="Components">
                {`${spell(stats.governed)} governed components, each page generated from its contract.`}
              </NextCard>
              <NextCard href="/docs/contribute/run-locally#checks" title="Run Graphite locally">
                Running the checks locally before you open a pull request.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
