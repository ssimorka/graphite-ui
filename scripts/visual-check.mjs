#!/usr/bin/env node
// Visual check: the moving parts, frozen at their first and last frames.
//
//   pnpm visual-check [--base http://localhost:3000] [--out .visual/run] [--reduce]
//   pnpm visual-check --compare .visual/before .visual/after
//
// Motion is the one thing a screenshot usually gets wrong: catch a page while
// something is easing and the picture is a coin toss. So this never shoots
// mid-motion. Each target triggers its motion, then every finite animation
// and transition on the page (document.getAnimations(), which covers CSS
// animations, CSS transitions and the Web Animations API alike) is paused at
// time 0 for the START frame, and finished for the END frame. Infinite loops
// (spinners, the skeleton sweep) are paused at 0 in both, so two runs of the
// same code produce the same pixels.
//
// Each target is shot in light and dark at its widths; --reduce adds the
// reduced-motion preference, where a start frame should already look like
// the end one for anything that only moves.
//
// --compare diffs two runs pixel by pixel, in the browser (a canvas reads
// both PNGs), so it needs nothing beyond Playwright. It exits 1 when any
// frame differs by more than --tolerance (a fraction of its pixels, 0.001 by
// default) and writes a red-on-grey diff beside each one that does.
//
// Not a CI job: CI has no browser and nowhere to keep a baseline. Run it
// against two builds (main and a branch) before a change that moves things,
// and attach what it reports. Playwright is not a dependency of the repo;
// install it (`pnpm dlx playwright install chromium`) or run where it is
// already present.

import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  return i === -1 ? fallback : args[i + 1]
}

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  // A global install answers `require` (through NODE_PATH) but not `import`.
  try {
    ;({ chromium } = createRequire(import.meta.url)('playwright'))
  } catch {}
}
if (!chromium) {
  console.error('visual-check: Playwright is not installed. `pnpm dlx playwright install chromium`, then rerun.')
  process.exit(2)
}

// ------------------------------------------------------------------ targets
//
// `act` triggers the motion. Selectors scope to a docs page's live preview,
// so the open stills elsewhere on the page are not what gets clicked.
const LIVE = '#live-preview'
const closedTrigger = (page, scope, sel) =>
  page.locator(`${scope} ${sel}[aria-expanded="false"]`).first()

const TARGETS = [
  { name: 'motion-page', url: '/docs/foundations/motion', widths: [1440, 412], fullPage: true },
  {
    name: 'menu-open',
    url: '/docs/components/menu',
    widths: [1440, 412],
    act: (p) => closedTrigger(p, LIVE, '[aria-haspopup="menu"]').click(),
  },
  {
    name: 'popover-open',
    url: '/docs/components/popover',
    widths: [1440, 412],
    act: async (p) => {
      const trigger = p.locator(LIVE).getByRole('button', { name: 'Filter themes' })
      await trigger.click()
      await p.locator(`${LIVE} [aria-expanded=true][aria-controls]`).first().waitFor()
    },
  },
  {
    name: 'tooltip-show',
    url: '/docs/components/tooltip',
    widths: [1440],
    act: async (p) => {
      await p.locator(`${LIVE} [class*=tooltip_wrap]`).first().hover()
      await p.locator(`${LIVE} [role=tooltip]`).first().waitFor({ timeout: 3000 })
    },
  },
  {
    name: 'modal-open',
    url: '/docs/components/modal',
    widths: [1440, 412],
    act: async (p) => {
      await p.locator(LIVE).getByRole('button', { name: 'Open modal' }).click()
      await p.locator('[role=dialog][aria-modal=true]').first().waitFor()
    },
  },
  {
    name: 'toast-arrive',
    url: '/docs/components/toast',
    widths: [1440, 412],
    act: async (p) => {
      await p.locator(LIVE).getByRole('button', { name: 'Show toast' }).click()
      await p.locator('[aria-label=Notifications] li').first().waitFor()
    },
  },
  {
    name: 'notification-appear',
    url: '/docs/components/notification',
    widths: [1440],
    act: async (p) => {
      await p.locator(LIVE).getByRole('button', { name: 'Dismiss notification' }).first().click()
      await p.locator(LIVE).getByRole('button', { name: 'Show again' }).click()
    },
  },
  {
    name: 'accordion-open',
    url: '/docs/components/accordion',
    widths: [1440],
    act: (p) => closedTrigger(p, LIVE, 'button').click(),
  },
  {
    name: 'tabs-switch',
    url: '/docs/components/tabs',
    widths: [1440, 412],
    act: (p) => p.locator(`${LIVE} [class*=previewInner] [role=tab][aria-selected=false]:not(:disabled)`).first().click(),
  },
  {
    name: 'toggle-switch',
    url: '/docs/components/toggle',
    widths: [1440],
    act: (p) => p.locator(`${LIVE} [role=switch]`).first().click({ force: true }),
  },
  {
    name: 'tray-open',
    url: '/docs',
    widths: [412],
    act: async (p) => {
      await p.getByRole('button', { name: /menu/i }).first().click()
      await p.locator('[class*=trayPanel]').waitFor()
    },
  },
  {
    name: 'search-open',
    url: '/docs',
    widths: [1440],
    act: async (p) => {
      await p.keyboard.press('Control+k')
      await p.getByRole('dialog').first().waitFor()
    },
  },
]

// -------------------------------------------------------------------- frames

// Pause every finite animation at its start, or finish them all. Infinite
// ones are held at 0 either way.
const freeze = (page, at) =>
  page.evaluate((end) => {
    for (const a of document.getAnimations()) {
      const timing = a.effect?.getComputedTiming()
      try {
        if (!timing || timing.iterations === Infinity) {
          a.pause()
          a.currentTime = 0
        } else if (end) a.finish()
        else {
          a.pause()
          a.currentTime = 0
        }
      } catch {}
    }
  }, at === 'end')

async function capture() {
  const base = flag('--base', 'http://localhost:3000')
  const out = flag('--out', path.join('.visual', new Date().toISOString().replace(/[:.]/g, '-')))
  const reduce = args.includes('--reduce')
  const only = flag('--only', null)
  fs.mkdirSync(out, { recursive: true })

  const browser = await chromium.launch()
  let shots = 0
  const failures = []
  for (const t of TARGETS.filter((x) => !only || x.name === only)) {
    for (const theme of ['light', 'dark']) {
      for (const width of t.widths) {
        const ctx = await browser.newContext({
          viewport: { width, height: 900 },
          reducedMotion: reduce ? 'reduce' : 'no-preference',
        })
        await ctx.addInitScript((th) => {
          try {
            localStorage.setItem('graphite-theme-choice', JSON.stringify({ sourceHex: '#5e44aa', theme: th, level: 'AA' }))
          } catch {}
        }, theme)
        const page = await ctx.newPage()
        // Toasts print the time; hold the clock so two runs agree.
        await page.clock.setFixedTime(new Date('2026-10-24T12:00:00'))
        const stem = `${t.name}-${theme}-${width}${reduce ? '-reduce' : ''}`
        try {
          await page.goto(base + t.url, { waitUntil: 'networkidle' })
          // Let anything that runs on load (a reveal, a still opening) settle
          // first, so the frames are of the target's motion alone.
          await freeze(page, 'end')
          if (t.act) {
            const scope = page.locator(LIVE)
            if (await scope.count()) await scope.scrollIntoViewIfNeeded()
            await t.act(page)
            // Some motion starts a frame later (the sheet's WAAPI run); wait
            // for it to exist, then rewind it to 0.
            await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
            await freeze(page, 'start')
            await page.screenshot({ path: path.join(out, `${stem}-start.png`) })
            shots++
          }
          await freeze(page, 'end')
          await page.screenshot({ path: path.join(out, `${stem}-end.png`), fullPage: !!t.fullPage })
          shots++
        } catch (e) {
          failures.push(`${stem}: ${e.message.split('\n')[0]}`)
        }
        await ctx.close()
      }
    }
  }
  await browser.close()
  console.log(`visual-check: ${shots} frames in ${out}`)
  if (failures.length) {
    console.log('\nnot captured:')
    for (const f of failures) console.log(`  x ${f}`)
    process.exit(1)
  }
}

// ------------------------------------------------------------------ compare

async function compare(a, b) {
  const tolerance = Number(flag('--tolerance', '0.001'))
  const names = fs.readdirSync(a).filter((f) => f.endsWith('.png') && !f.endsWith('.diff.png'))
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setContent('<canvas></canvas>')
  const rows = []
  for (const name of names) {
    const other = path.join(b, name)
    if (!fs.existsSync(other)) {
      rows.push({ name, status: 'missing in second run' })
      continue
    }
    const url = (f) => `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`
    const r = await page.evaluate(
      async ([x, y]) => {
        const load = (src) => new Promise((ok, no) => {
          const img = new Image()
          img.onload = () => ok(img)
          img.onerror = no
          img.src = src
        })
        const [i1, i2] = await Promise.all([load(x), load(y)])
        if (i1.width !== i2.width || i1.height !== i2.height)
          return { size: `${i1.width}x${i1.height} vs ${i2.width}x${i2.height}` }
        const c = document.querySelector('canvas')
        c.width = i1.width
        c.height = i1.height
        const g = c.getContext('2d', { willReadFrequently: true })
        g.drawImage(i1, 0, 0)
        const d1 = g.getImageData(0, 0, c.width, c.height)
        g.clearRect(0, 0, c.width, c.height)
        g.drawImage(i2, 0, 0)
        const d2 = g.getImageData(0, 0, c.width, c.height)
        const out = g.createImageData(c.width, c.height)
        let diff = 0
        for (let i = 0; i < d1.data.length; i += 4) {
          const delta = Math.max(
            Math.abs(d1.data[i] - d2.data[i]),
            Math.abs(d1.data[i + 1] - d2.data[i + 1]),
            Math.abs(d1.data[i + 2] - d2.data[i + 2]),
          )
          const grey = (d1.data[i] + d1.data[i + 1] + d1.data[i + 2]) / 6
          if (delta > 24) {
            diff++
            out.data.set([255, 0, 0, 255], i)
          } else out.data.set([grey, grey, grey, 255], i)
        }
        g.putImageData(out, 0, 0)
        return { diff, total: c.width * c.height, png: diff ? c.toDataURL('image/png') : null }
      },
      [url(path.join(a, name)), url(other)],
    )
    if (r.size) rows.push({ name, status: `size ${r.size}` })
    else {
      const share = r.diff / r.total
      if (r.png) fs.writeFileSync(path.join(b, name.replace(/\.png$/, '.diff.png')), Buffer.from(r.png.split(',')[1], 'base64'))
      rows.push({ name, status: share > tolerance ? `${(share * 100).toFixed(2)}% differs` : null })
    }
  }
  await browser.close()
  const bad = rows.filter((r) => r.status)
  console.log(`visual-check: ${rows.length} frames compared, ${bad.length} over ${(tolerance * 100).toFixed(1)}%`)
  for (const r of bad) console.log(`  x ${r.name}: ${r.status}`)
  if (bad.length) process.exit(1)
}

if (args.includes('--compare')) {
  const i = args.indexOf('--compare')
  await compare(args[i + 1], args[i + 2])
} else {
  await capture()
}
