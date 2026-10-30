#!/usr/bin/env node
// Cold-start smoke test: a stranger follows Quick start in a brand new app.
//
//   node scripts/cold-start/run.mjs --origin http://localhost:3000 [--out .cold-start]
//
// The site must already be running at --origin, built from the code under
// test. Everything a reader would copy comes from that site: the snippets are
// scraped from the rendered /docs/quick-start, and the registry URLs in them
// are pointed at --origin, so a pull request is tested against itself and a
// docs change that breaks the walkthrough breaks this test.
//
// Two apps are built from one fresh `create-next-app@latest`:
//
//   positive  follows every step. Must pass every check below.
//   negative  skips step 5 (the turbopack.rules condition line). Must FAIL,
//             on the empty-class check. A check that cannot fail is not a
//             check, and this is the failure the whole test exists for
//             (cold-start test, 2026-10-30: every component rendered with
//             class="", build green, console silent).
//
// Checks, in Chromium, light and dark: no rendered element has an empty class;
// the page is painted --graphite-surface / --graphite-on-surface by the theme
// file; Button paints from --graphite-primary; every --graphite-* a matching rule
// reads (with no fallback) resolves; IBM Plex Sans loads; the page has a
// <title>; axe finds no WCAG A/AA violation; Popover and Modal open.
//
// The scaffold changes without any PR of ours, which is why CI also runs this
// nightly. If the scaffold stops adding the Tailwind rule, step 5 no longer
// applies and the negative run cannot fail: that is reported as a warning, a
// cue to revisit step 5, not as a pass.
//
// Playwright and axe-core are not repo dependencies (same as visual-check).
// They are installed into the output folder. --install-browser downloads
// Playwright's Chromium (CI does this); otherwise set CHROMIUM_PATH to a
// browser already on disk, or have Playwright's browser installed already.
//
// --direct-install writes registry items without the shadcn CLI, for an
// environment that cannot reach ui.shadcn.com (the CLI fetches a base color
// from it). CI never uses it: the real CLI is part of what is under test.

import { execSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}
const ORIGIN = flag('--origin', 'http://localhost:3000').replace(/\/$/, '')
const OUT = path.resolve(flag('--out', '.cold-start'))
const DIRECT = args.includes('--direct-install')
const PUBLISHED = 'https://www.graphite-ui.com'
const COMPONENTS = ['button', 'popover', 'toggle', 'modal']

const WORK = path.join(OUT, 'work')
const SHOTS = path.join(OUT, 'shots')
fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(WORK, { recursive: true })
fs.mkdirSync(SHOTS, { recursive: true })
const LOG = path.join(OUT, 'steps.log')

const t0 = Date.now()
const log = (msg) => {
  const line = `[${((Date.now() - t0) / 1000).toFixed(0).padStart(4)}s] ${msg}`
  console.log(line)
  fs.appendFileSync(LOG, line + '\n')
}
const sh = (cmd, cwd) => {
  fs.appendFileSync(LOG, `$ (${path.relative(OUT, cwd) || '.'}) ${cmd}\n`)
  try {
    const out = execSync(cmd, { cwd, stdio: 'pipe', env: { ...process.env, CI: '1' }, maxBuffer: 64 << 20 })
    fs.appendFileSync(LOG, out)
  } catch (e) {
    fs.appendFileSync(LOG, `${e.stdout ?? ''}${e.stderr ?? ''}`)
    throw new Error(`Command failed: ${cmd} (see steps.log)`)
  }
}
const local = (s) => s.replaceAll(PUBLISHED, ORIGIN)

// ------------------------------------------------------------ the snippets
//
// Found by what they say, not their position, so reordering the page does not
// break this. A snippet that cannot be found is a failure: the docs no longer
// carry a step this walkthrough depends on.
const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&')

async function quickStartSnippets() {
  const res = await fetch(`${ORIGIN}/docs/quick-start`)
  if (!res.ok) throw new Error(`GET /docs/quick-start: ${res.status}`)
  const html = await res.text()
  const all = [...html.matchAll(/<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/g)].map((m) => decode(m[1]))
  const find = (what, test) => {
    const hit = all.find(test)
    if (!hit) throw new Error(`Quick start no longer shows ${what}`)
    return hit
  }
  return {
    theme: find('the theme install (step 1)', (s) => s.startsWith('npx shadcn') && s.includes('/r/init.json') && s.includes('/r/theme/')),
    fonts: find('the font install (step 2)', (s) => s.startsWith('npm i') && s.includes('@fontsource/ibm-plex-sans')),
    layout: find('the layout (step 3)', (s) => s.startsWith('// app/layout.tsx')),
    globals: find('globals.css for Tailwind (step 4)', (s) => s.startsWith('/* app/globals.css */')),
    nextConfig: find('the next.config.ts line (step 5)', (s) => s.startsWith('// next.config.ts')),
  }
}

// ------------------------------------------------------------ the steps
function applyLayout(app, snippet) {
  // Tailwind path: the snippet's own comment says to import globals.css in
  // place of the theme file. Following that comment is part of the test.
  const lines = snippet.split('\n').slice(1)
  const i = lines.findIndex((l) => l.startsWith("import './graphite-theme.css'"))
  if (i === -1 || !lines[i].includes("import './globals.css'"))
    throw new Error("Quick start's layout no longer says what to import on the Tailwind path")
  lines[i] = "import './globals.css'"
  fs.writeFileSync(path.join(app, 'app/layout.tsx'), lines.join('\n') + '\n')
}

function applyGlobals(app, snippet) {
  const imports = snippet.split('\n').filter((l) => l.startsWith('@import'))
  fs.writeFileSync(path.join(app, 'app/globals.css'), imports.join('\n') + '\n')
}

// Returns false when the scaffold has no Tailwind rule, so step 5 is skipped
// exactly as its text says to.
function applyNextConfig(app, snippet) {
  const line = snippet.split('\n').find((l) => l.includes('condition:'))
  if (!line) throw new Error("Quick start's step 5 snippet has no condition line")
  const file = path.join(app, 'next.config.ts')
  const src = fs.readFileSync(file, 'utf8')
  const rule = /(["']\*\.css["']\s*:\s*\{\n)(\s*)/
  if (!rule.test(src)) return false
  const clean = line.replace(/\s*\/\/.*$/, '').trim()
  fs.writeFileSync(file, src.replace(rule, (_, open, indent) => `${open}${indent}${clean}\n${indent}`))
  return true
}

function hasTailwindRule(app) {
  return /turbopack[\s\S]*["']\*\.css["']/.test(fs.readFileSync(path.join(app, 'next.config.ts'), 'utf8'))
}

// A dev server can drop a request while it compiles, so a fetch gets three
// tries, and the error names the URL.
async function getJson(url) {
  let last
  for (let i = 0; i < 3; i++) {
    try {
      return await (await fetch(url)).json()
    } catch (e) {
      last = e
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
  throw new Error(`GET ${url}: ${last?.cause?.code ?? last?.message}`)
}

async function directInstall(app, urls) {
  const cfg = JSON.parse(fs.readFileSync(path.join(app, 'components.json'), 'utf8'))
  const strip = (a) => a.replace(/^@\//, '')
  const alias = { '@ui': cfg.aliases.ui, '@components': cfg.aliases.components, '@lib': cfg.aliases.lib, '@hooks': cfg.aliases.hooks }
  const seen = new Set()
  const deps = new Set()
  const add = async (url) => {
    if (seen.has(url)) return
    seen.add(url)
    const item = await getJson(url)
    if (item.error) throw new Error(`${url}: ${item.error}`)
    for (const d of item.registryDependencies ?? []) await add(d)
    for (const d of item.dependencies ?? []) deps.add(d)
    for (const f of item.files ?? []) {
      let dest = f.path
      if (f.target) {
        const k = Object.keys(alias).find((a) => f.target.startsWith(a + '/'))
        dest = k ? strip(alias[k]) + f.target.slice(k.length) : f.target
      } else if (f.type === 'registry:ui') dest = path.join(strip(cfg.aliases.ui), path.basename(f.path))
      else if (f.type === 'registry:lib') dest = path.join(strip(cfg.aliases.lib), path.basename(f.path))
      else if (f.type === 'registry:hook') dest = path.join(strip(cfg.aliases.hooks), path.basename(f.path))
      fs.mkdirSync(path.dirname(path.join(app, dest)), { recursive: true })
      fs.writeFileSync(path.join(app, dest), f.content)
    }
  }
  for (const u of urls) await add(u)
  if (deps.size) sh(`npm i ${[...deps].join(' ')}`, app)
}

async function addComponents(app) {
  const urls = COMPONENTS.map((c) => `${ORIGIN}/r/${c}.json`)
  if (DIRECT) await directInstall(app, urls)
  else sh(`npx -y shadcn@latest add ${urls.join(' ')} --yes`, app)
}

const SMOKE = `'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Popover } from '@/components/ui/popover'
import { Toggle } from '@/components/ui/toggle'

export function Smoke() {
  const [on, setOn] = useState(false)
  const [open, setOpen] = useState(false)
  return (
    <div id="smoke" style={{ display: 'grid', gap: 16, padding: 32, justifyItems: 'start' }}>
      <h1>Cold start</h1>
      <Button id="smoke-button" variant="primary">Save changes</Button>
      <Popover trigger={(props) => <Button {...props} id="smoke-popover-trigger">Details</Button>}>
        <p id="smoke-popover-body">Popover body</p>
      </Popover>
      <Toggle label="Email notifications" checked={on} onChange={setOn} />
      <Button id="smoke-modal-trigger" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Smoke modal" body={<p>Modal body</p>} />
    </div>
  )
}
`

function writeSmokePage(app) {
  fs.writeFileSync(path.join(app, 'app/smoke.tsx'), SMOKE)
  fs.writeFileSync(
    path.join(app, 'app/page.tsx'),
    // A bare page, on purpose: no background or text color of its own, so
    // the page check and axe see what the theme file paints. Until the theme
    // painted body (P3, 2026-10-30) this page carried bg-surface, and a bare
    // page in dark measured 1.3:1.
    "import { Smoke } from './smoke'\n\nexport default function Page() {\n  return (\n    <main>\n      <Smoke />\n    </main>\n  )\n}\n",
  )
}

// ------------------------------------------------------------ the browser
async function tools() {
  const dir = path.join(OUT, 'tools')
  const req = createRequire(path.join(dir, 'noop.js'))
  try {
    req.resolve('playwright')
    req.resolve('axe-core')
  } catch {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'package.json'), '{"private":true}')
    sh('npm i playwright@1 axe-core@4 --no-audit --no-fund', dir)
  }
  // CI passes --install-browser so the browser matches the Playwright just
  // installed. --with-deps pulls the system libraries through sudo, which
  // GitHub's runners allow.
  if (args.includes('--install-browser')) sh('npx playwright install --with-deps chromium', dir)
  return { chromium: req('playwright').chromium, axeSource: fs.readFileSync(req.resolve('axe-core/axe.min.js'), 'utf8') }
}

function serve(app, port) {
  const child = spawn(path.join(app, 'node_modules/.bin/next'), ['start', '-p', String(port)], { cwd: app, stdio: 'ignore' })
  return child
}

async function waitFor(url, ms = 60000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`${url} did not come up`)
}

// Runs in the page. Returns what failed, as plain strings.
function pageChecks() {
  const failures = []
  const info = {}
  const all = [...document.body.querySelectorAll('*')]

  const empty = all.filter((el) => el.hasAttribute('class') && el.getAttribute('class').trim() === '')
  if (empty.length) failures.push(`empty class on ${empty.length} element(s): ${empty.slice(0, 5).map((e) => e.id ? `#${e.id}` : e.tagName.toLowerCase()).join(', ')}`)

  const resolve = (name, prop = 'background-color') => {
    const probe = document.createElement('div')
    probe.style.setProperty(prop, `var(${name})`)
    document.body.append(probe)
    const value = getComputedStyle(probe).getPropertyValue(prop)
    probe.remove()
    return value
  }

  // The theme file paints the page (its :where(body) base). The smoke page
  // sets no background of its own, so this is the theme's rule or nothing.
  const bodyStyle = getComputedStyle(document.body)
  info.bodyBackground = bodyStyle.backgroundColor
  info.bodyColor = bodyStyle.color
  const surface = resolve('--graphite-surface')
  const onSurface = resolve('--graphite-on-surface', 'color')
  if (info.bodyBackground !== surface) failures.push(`page background ${info.bodyBackground}, expected --graphite-surface ${surface}`)
  if (info.bodyColor !== onSurface) failures.push(`page text ${info.bodyColor}, expected --graphite-on-surface ${onSurface}`)

  const btn = document.getElementById('smoke-button')
  const want = resolve('--graphite-primary')
  const got = btn ? getComputedStyle(btn).backgroundColor : 'missing'
  info.buttonBackground = got
  info.buttonHeight = btn ? Math.round(btn.getBoundingClientRect().height) : 0
  if (got !== want) failures.push(`Button background ${got}, expected --graphite-primary ${want}`)
  if (info.buttonHeight < 32) failures.push(`Button is ${info.buttonHeight}px tall: unstyled`)
  info.buttonFont = btn ? getComputedStyle(btn).fontFamily : ''
  if (!/IBM Plex Sans/.test(info.buttonFont)) failures.push(`Button font is ${info.buttonFont}`)

  // Every --graphite-* a rule reads without a fallback, on an element that
  // rule actually matches, must resolve there.
  const unresolved = new Set()
  let used = 0
  const walk = (rules) => {
    for (const r of rules) {
      if (r.cssRules && !r.selectorText) {
        walk(r.cssRules)
        continue
      }
      if (!r.selectorText || !r.style) continue
      const names = [...r.style.cssText.matchAll(/var\((--graphite-[a-z0-9-]+)\s*\)/g)].map((m) => m[1])
      if (!names.length) continue
      let matched
      try {
        matched = all.filter((el) => el.matches(r.selectorText))
      } catch {
        continue
      }
      for (const el of matched)
        for (const n of names) {
          used++
          if (getComputedStyle(el).getPropertyValue(n).trim() === '') unresolved.add(n)
        }
      if (r.cssRules) walk(r.cssRules)
    }
  }
  for (const sheet of document.styleSheets) {
    try {
      walk(sheet.cssRules)
    } catch {}
  }
  info.graphiteReads = used
  info.graphiteDefined = [...getComputedStyle(document.documentElement)].filter((p) => p.startsWith('--graphite-')).length
  if (unresolved.size) failures.push(`unresolved: ${[...unresolved].join(', ')}`)

  if (!document.title.trim()) failures.push('page has no <title>')
  return { failures, info }
}

// Waits for every running transition and animation to finish, so nothing is
// measured or shot mid-motion.
const settle = (page) =>
  page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))))

async function check(chromium, axeSource, origin, label) {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {}),
  })
  const result = { label, failures: [], themes: {} }
  try {
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
      const fail = (m) => result.failures.push(`${theme}: ${m}`)
      await page.goto(origin + '/', { waitUntil: 'networkidle' })
      await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme)
      // Button's colors transition on duration-fast, so a theme switch is
      // measured mid-flight unless every running transition has finished.
      // The first local run caught exactly that: dark's primary read halfway
      // between the two themes.
      await settle(page)
      await page.evaluate(() => document.fonts.ready)
      const plex = await page.evaluate(() => document.fonts.check('16px "IBM Plex Sans"'))
      if (!plex) fail('IBM Plex Sans did not load')
      const { failures, info } = await page.evaluate(pageChecks)
      failures.forEach(fail)
      await page.screenshot({ path: path.join(SHOTS, `${label}-${theme}.png`), fullPage: true })

      await page.addScriptTag({ content: axeSource })
      const axe = await page.evaluate(() =>
        window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }),
      )
      info.axe = axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))
      for (const v of axe.violations) fail(`axe ${v.id} (${v.impact}, ${v.nodes.length} node(s))`)

      try {
        await page.click('#smoke-popover-trigger')
        await page.locator('#smoke-popover-body').waitFor({ state: 'visible', timeout: 5000 })
        await settle(page)
        await page.screenshot({ path: path.join(SHOTS, `${label}-${theme}-popover.png`) })
        await page.keyboard.press('Escape')
      } catch {
        fail('Popover did not open')
      }
      try {
        await page.click('#smoke-modal-trigger')
        await page.getByRole('dialog').waitFor({ state: 'visible', timeout: 5000 })
        await settle(page)
        await page.screenshot({ path: path.join(SHOTS, `${label}-${theme}-modal.png`) })
        const open = await page.evaluate(() =>
          window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }),
        )
        // Reported, not gated: the brief gates the closed page.
        info.axeModalOpen = open.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))
        await page.keyboard.press('Escape')
      } catch {
        fail('Modal did not open')
      }
      result.themes[theme] = info
      await page.close()
    }
  } finally {
    await browser.close()
  }
  return result
}

// ------------------------------------------------------------ the run
async function main() {
  const report = { origin: ORIGIN, startedAt: new Date().toISOString(), warnings: [] }
  log(`Reading Quick start from ${ORIGIN}`)
  const s = await quickStartSnippets()

  log('Scaffolding create-next-app@latest')
  sh('npx -y create-next-app@latest base --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm --yes', WORK)
  const base = path.join(WORK, 'base')
  const pkg = JSON.parse(fs.readFileSync(path.join(base, 'package.json'), 'utf8'))
  report.scaffold = { next: pkg.dependencies?.next, react: pkg.dependencies?.react, tailwind: pkg.devDependencies?.tailwindcss, tailwindRule: hasTailwindRule(base) }
  log(`Scaffold: next ${report.scaffold.next}, Tailwind rule ${report.scaffold.tailwindRule ? 'present' : 'absent'}`)

  // Quick start's step 1 command has no --yes; CI cannot answer a prompt.
  log('Step 1: theme, Tailwind bridge, init')
  sh(`${local(s.theme)} --yes`, base)
  log('Step 2: fonts')
  sh(s.fonts, base)
  log('Steps 3 and 4: layout and globals.css')
  applyLayout(base, s.layout)
  applyGlobals(base, s.globals)

  const apps = { positive: path.join(WORK, 'positive'), negative: path.join(WORK, 'negative') }
  fs.cpSync(base, apps.negative, { recursive: true })
  fs.renameSync(base, apps.positive)

  log('Step 5: the condition line (positive only)')
  const applied = applyNextConfig(apps.positive, s.nextConfig)
  if (!applied) report.warnings.push('The scaffold has no Tailwind turbopack rule any more: step 5 does not apply, and the negative run cannot fail. Revisit Quick start step 5.')

  const { chromium, axeSource } = await tools()
  const results = {}
  let port = 3401
  for (const [label, app] of Object.entries(apps)) {
    log(`${label}: adding ${COMPONENTS.join(', ')}${DIRECT ? ' (direct install)' : ''}`)
    await addComponents(app)
    writeSmokePage(app)
    log(`${label}: next build (Turbopack)`)
    sh('npx next build', app)
    const server = serve(app, port)
    try {
      await waitFor(`http://localhost:${port}/`)
      log(`${label}: checking in Chromium, light and dark`)
      results[label] = await check(chromium, axeSource, `http://localhost:${port}`, label)
    } finally {
      server.kill()
    }
    port++
  }

  const pos = results.positive
  const neg = results.negative
  const negCaught = neg.failures.some((f) => f.includes('empty class'))
  report.positive = pos
  report.negative = { ...neg, caughtEmptyClass: negCaught }
  report.seconds = Math.round((Date.now() - t0) / 1000)

  const problems = []
  if (pos.failures.length) problems.push(...pos.failures.map((f) => `positive: ${f}`))
  if (applied && !negCaught) problems.push('negative: skipping step 5 did not produce empty classes, so the check can no longer see the failure it exists for')
  report.passed = problems.length === 0
  report.problems = problems
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2))

  const lt = pos.themes.light ?? {}
  const md = [
    `## Cold-start smoke test: ${report.passed ? 'passed' : 'FAILED'}`,
    '',
    `Scaffold: create-next-app@latest, Next ${report.scaffold.next}, Tailwind ${report.scaffold.tailwind}, Tailwind rule ${report.scaffold.tailwindRule ? 'present' : 'absent'}. ${report.seconds}s.`,
    '',
    '| Run | Result |',
    '|---|---|',
    `| Positive (Quick start as written) | ${pos.failures.length ? pos.failures.length + ' failure(s)' : 'all checks pass, light and dark'} |`,
    `| Negative (step 5 skipped) | ${!applied ? 'not applicable' : negCaught ? 'fails on empty classes, as it should' : 'did NOT fail'} |`,
    '',
    `Button ${lt.buttonHeight ?? '?'}px, background ${lt.buttonBackground ?? '?'}; ${lt.graphiteDefined ?? '?'} --graphite-* defined, ${lt.graphiteReads ?? '?'} reads checked.`,
    ...(report.warnings.length ? ['', ...report.warnings.map((w) => `> Warning: ${w}`)] : []),
    ...(problems.length ? ['', '### Problems', ...problems.map((p) => `- ${p}`)] : []),
    '',
  ].join('\n')
  fs.writeFileSync(path.join(OUT, 'summary.md'), md)
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md)
  console.log('\n' + md)
  process.exit(report.passed ? 0 : 1)
}

main().catch((e) => {
  log(`ERROR: ${e.message}`)
  fs.writeFileSync(path.join(OUT, 'summary.md'), `## Cold-start smoke test: FAILED\n\n${e.message}\n`)
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Cold-start smoke test: FAILED\n\n${e.message}\n`)
  process.exit(1)
})
