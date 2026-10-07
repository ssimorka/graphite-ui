'use client'

import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { hexToOklch, toneAt, vividTone } from '@/lib/color.js'

// Seeded PRNG so the same hex always yields the same composition.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hexSeed(hex: string): number {
  let h = 0
  for (let i = 0; i < hex.length; i++) {
    h = Math.imul(31, h) + hex.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

// The pattern functions below are ported from Graphite UI's LeWitt generator,
// which calls an ambient random source. Swapping this binding before each draw
// makes the whole engine deterministic without rewriting every function.
let rand: () => number = Math.random

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

function luminance(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath()
}

type P = (ctx: CanvasRenderingContext2D, w: number, h: number, bg: string, fg: string) => void

const pDiagonalStripes: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const n = 4 + Math.floor(rand() * 5), sw = (w * 1.6) / n
  ctx.fillStyle = fg
  for (let i = -2; i < n + 2; i++) {
    const x = i * sw - h * 0.5
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + sw * 0.55, 0)
    ctx.lineTo(x + sw * 0.55 + h, h); ctx.lineTo(x + h, h); ctx.closePath(); ctx.fill()
  }
}

const pGestureMarks: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = fg; ctx.lineCap = 'round'
  for (let i = 0; i < 80; i++) {
    const x = rand() * w, y = rand() * h
    const d = Math.sqrt(((x / w) - 0.5) ** 2 + ((y / h) - 0.5) ** 2)
    if (rand() > 1 - d) continue
    const len = 5 + rand() * 22, angle = rand() * Math.PI * 2
    ctx.lineWidth = 1 + rand() * 3
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len); ctx.stroke()
  }
}

const pHalftoneRadial: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const sp = 9 + rand() * 8, inv = rand() > 0.5
  ctx.fillStyle = fg
  for (let r = 0; r <= Math.ceil(h / sp); r++) for (let c = 0; c <= Math.ceil(w / sp); c++) {
    const d = Math.sqrt(((c * sp / w) - 0.5) ** 2 + ((r * sp / h) - 0.5) ** 2) / 0.7
    const t = inv ? d : 1 - d
    const rad = Math.max(0.4, sp * 0.45 * Math.max(0, t))
    ctx.beginPath(); ctx.arc(c * sp, r * sp, rad, 0, Math.PI * 2); ctx.fill()
  }
}

const pCircle: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const r = Math.min(w, h) * (0.45 + rand() * 0.3)
  const a = pick([[w * .85, h * .15], [w * .15, h * .15], [w * .85, h * .85], [w * .15, h * .85], [w * .5, h * .5]])
  ctx.fillStyle = fg
  ctx.beginPath(); ctx.arc(a[0], a[1], r, 0, Math.PI * 2); ctx.fill()
}

const pNestedRects: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const n = 4 + Math.floor(rand() * 6), lw = Math.min(w, h) * 0.035
  ctx.strokeStyle = fg; ctx.lineWidth = lw
  const step = Math.min(w, h) * 0.065
  for (let i = 0; i < n; i++) {
    const ins = i * step + lw * 2
    roundRect(ctx, ins, ins, w - ins * 2, h - ins * 2, Math.max(4, Math.min(w, h) * 0.1 - i * 3))
    ctx.stroke()
  }
}

const pHalftoneBlob: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = fg
  const cx = w * (0.2 + rand() * 0.6), cy = h * (0.2 + rand() * 0.6)
  ctx.beginPath(); ctx.arc(cx, cy, Math.min(w, h) * 0.55, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = bg
  const sp = 11
  for (let r = 0; r <= Math.ceil(h / sp); r++) for (let c = 0; c <= Math.ceil(w / sp); c++) {
    const d = Math.sqrt(((c * sp / w) - 0.5) ** 2 + ((r * sp / h) - 0.5) ** 2) / 0.7
    const rad = Math.max(0.4, sp * 0.45 * Math.max(0, d))
    ctx.beginPath(); ctx.arc(c * sp, r * sp, rad, 0, Math.PI * 2); ctx.fill()
  }
}

const pBoldDiagonal: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = fg; ctx.lineWidth = Math.min(w, h) * 0.28; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(-w * .1, h * .3); ctx.lineTo(w * 1.1, h * .7); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(-w * .1, h * .65); ctx.lineTo(w * 1.1, h * 1.05); ctx.stroke()
}

const pArc: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = fg; ctx.lineWidth = Math.min(w, h) * 0.07; ctx.lineCap = 'butt'
  const r = Math.min(w, h) * (0.65 + rand() * 0.35)
  const t = Math.floor(rand() * 4)
  ctx.beginPath()
  if (t === 0) ctx.arc(0, 0, r, 0, Math.PI / 2)
  else if (t === 1) ctx.arc(w, 0, r, Math.PI / 2, Math.PI)
  else if (t === 2) ctx.arc(0, h, r, -Math.PI / 2, 0)
  else ctx.arc(w, h, r, Math.PI, Math.PI * 1.5)
  ctx.stroke()
}

const pSplitDiagonal: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = fg
  const flip = rand() > 0.5
  ctx.beginPath()
  if (flip) { ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(0, h) }
  else { ctx.moveTo(w, 0); ctx.lineTo(w, h); ctx.lineTo(0, h) }
  ctx.closePath(); ctx.fill()
}

const pHStripes: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const n = 3 + Math.floor(rand() * 5), sh = h / n
  ctx.fillStyle = fg
  for (let i = 0; i < n; i += 2) ctx.fillRect(0, i * sh, w, sh)
}

const pVStripes: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const n = 3 + Math.floor(rand() * 5), sw = w / n
  ctx.fillStyle = fg
  for (let i = 0; i < n; i += 2) ctx.fillRect(i * sw, 0, sw, h)
}

const pConcentricCircles: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const n = 3 + Math.floor(rand() * 5)
  const cx = w / 2, cy = h / 2, maxR = Math.min(w, h) * 0.55
  for (let i = n; i > 0; i--) {
    ctx.fillStyle = (i % 2 === 0) ? fg : bg
    ctx.beginPath(); ctx.arc(cx, cy, (i / n) * maxR, 0, Math.PI * 2); ctx.fill()
  }
}

const pCrosshatch: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = fg; ctx.lineCap = 'round'
  const sp = Math.min(w, h) * 0.12
  ctx.lineWidth = Math.min(w, h) * 0.018
  for (let x = -h; x < w + h; x += sp) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - h, h); ctx.stroke()
  }
}

const pSolid: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = fg
  const side = Math.floor(rand() * 4), frac = 0.25 + rand() * 0.5
  if (side === 0) ctx.fillRect(0, 0, w * frac, h)
  else if (side === 1) ctx.fillRect(w * (1 - frac), 0, w * frac, h)
  else if (side === 2) ctx.fillRect(0, 0, w, h * frac)
  else ctx.fillRect(0, h * (1 - frac), w, h * frac)
}

const pWaveLines: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = fg; ctx.lineWidth = Math.min(w, h) * 0.025; ctx.lineCap = 'round'
  const n = 4 + Math.floor(rand() * 4)
  for (let i = 0; i < n; i++) {
    const yBase = ((i + 0.5) / n) * h, amp = h / (n * 2.2), freq = 2 + Math.floor(rand() * 3)
    ctx.beginPath()
    for (let x = 0; x <= w; x += 2) {
      const y = yBase + Math.sin((x / w) * Math.PI * 2 * freq) * amp
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

const pDotGrid: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = fg
  const sp = Math.min(w, h) * 0.13, dotR = sp * 0.3
  for (let r = sp / 2; r < h; r += sp) for (let c = sp / 2; c < w; c += sp) {
    ctx.beginPath(); ctx.arc(c, r, dotR, 0, Math.PI * 2); ctx.fill()
  }
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
const FONTS = [
  'serif', 'sans-serif',
  '"Times New Roman", serif',
  '"Georgia", serif',
  '"Arial Black", sans-serif',
  '"Impact", sans-serif',
]

const pLetterform: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const size = Math.min(w, h) * 1.6
  ctx.font = `900 ${size}px ${pick(FONTS)}`
  ctx.fillStyle = fg
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const ox = (rand() - 0.5) * w * 0.4
  const oy = (rand() - 0.5) * h * 0.4
  ctx.fillText(pick(CHARS), w / 2 + ox, h / 2 + oy)
}

const pCheckerboard: P = (ctx, w, h, bg, fg) => {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
  const n = 6, sw = w / n, sh = h / n
  ctx.fillStyle = fg
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if ((r + c) % 2 === 0) ctx.fillRect(c * sw, r * sh, sw, sh)
  }
}

// Pre-made halftone assets (tile types 19 & 20). The source images are black
// dots on white; we fill bg then recolor every pixel to fg with alpha driven by
// luminance, so white → bg shows through and black → solid fg dots.
function drawHalftoneAsset(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  imgEl: HTMLImageElement,
  bg: string, fg: string,
) {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  if (!imgEl.naturalWidth) return

  const iw = imgEl.naturalWidth, ih = imgEl.naturalHeight
  const iAR = iw / ih, pAR = w / h
  let sx = 0, sy = 0, sw = iw, sh = ih
  if (iAR > pAR) { sw = Math.floor(ih * pAR); sx = Math.floor((iw - sw) / 2) }
  else { sh = Math.floor(iw / pAR); sy = Math.floor((ih - sh) / 2) }

  const cw = Math.max(1, Math.round(w)), ch = Math.max(1, Math.round(h))
  const off = document.createElement('canvas')
  off.width = cw; off.height = ch
  const oCtx = off.getContext('2d')
  if (!oCtx) return
  oCtx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, cw, ch)

  const imgData = oCtx.getImageData(0, 0, cw, ch)
  const d = imgData.data
  const fgR = parseInt(fg.slice(1, 3), 16)
  const fgG = parseInt(fg.slice(3, 5), 16)
  const fgB = parseInt(fg.slice(5, 7), 16)
  for (let i = 0; i < d.length; i += 4) {
    const lum = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255
    d[i] = fgR; d[i + 1] = fgG; d[i + 2] = fgB
    d[i + 3] = Math.round((1 - lum) * 255)
  }
  oCtx.putImageData(imgData, 0, 0)
  ctx.drawImage(off, 0, 0, w, h)
}

const STANDARD: P[] = [
  pDiagonalStripes, pGestureMarks, pHalftoneRadial, pCircle,
  pNestedRects, pHalftoneBlob, pBoldDiagonal, pArc,
  pSplitDiagonal, pHStripes, pVStripes, pConcentricCircles,
  pCrosshatch, pSolid, pWaveLines, pDotGrid,
  pLetterform, pLetterform, pLetterform,
  pCheckerboard,
]

// --- Palette: the 60/30/10 pool, from the source color ---

type Palette = { colors: string[]; darks: string[]; lights: string[]; pop: string }

// The art's palette, from three settings. The hue only ever comes from the
// source: a grey or black pick has none, so the art draws in mono whatever
// the intensity says.
//
// - intensity (0-100): how strong the color is, as an absolute chroma up to
//   0.24, so it can go past the pick's own. It also moves where the color
//   sits: low values pair one deep shade with two light tints, which reads
//   pale; from about 65 it is the first generator's deep 30/41/52 (vivid).
//   67 is its 0.16, the strength of its #6B4FBE and #1DE9B6. 0 is mono. The
//   companion is always the hue 120 degrees round, its teal against purple.
// - mix: how much of the pool is grey. Balanced is the 60/30/10 rhythm.
// - grid: the size a tile aims for. The column and row counts come from the
//   canvas's own size, so the grid reflows with its container, portrait on a
//   phone included.
//
// One pool for both themes: the art is a picture, not chrome.
export type ArtMix = 'gray' | 'balanced' | 'color'
export type ArtGrid = 'large' | 'medium' | 'small'
export type ArtSettings = {
  intensity: number
  mix: ArtMix
  grid: ArtGrid
}

const DEEP = [30, 41, 52]
const PALE = [30, 80, 90]
const MAX_CHROMA = 0.24

export const ART_OPTIONS = {
  mix: [
    { key: 'gray', label: 'More gray', grays: 7 },
    { key: 'balanced', label: 'Balanced', grays: 6 },
    { key: 'color', label: 'More color', grays: 4 },
  ],
  grid: [
    { key: 'large', label: 'Large', unit: 112 },
    { key: 'medium', label: 'Medium', unit: 76 },
    { key: 'small', label: 'Small', unit: 54 },
  ],
} as const

export const ART_DEFAULTS: ArtSettings = {
  intensity: 67,
  mix: 'balanced',
  grid: 'medium',
}

/** The intensity slider's reading: 0 is mono, 67 the first generator's vivid. */
export function intensityLabel(v: number) {
  if (v === 0) return 'Off'
  if (v < 30) return 'Pale'
  if (v < 60) return 'Soft'
  if (v < 80) return 'Vivid'
  return 'Loud'
}

/** Columns and rows for a canvas size, aiming each tile at the grid's unit. */
export function gridFor(width: number, height: number, grid: ArtGrid) {
  const unit = ART_OPTIONS.grid.find((g) => g.key === grid)!.unit
  if (!width || !height) return { cols: 12, rows: 10 }
  return {
    cols: Math.max(4, Math.round(width / unit)),
    rows: Math.max(4, Math.round(height / unit)),
  }
}

/** Below this chroma a pick has no hue worth reading, so the art is mono. */
const HUELESS = 0.02

/** True when the pick is grey, black or white: there is no hue to draw with. */
export function isHueless(sourceHex: string) {
  return hexToOklch(sourceHex).c < HUELESS
}

// The first generator's grey and pop tones.
const GRAY_TONES = [18, 29, 45, 73, 95, 29, 60]
const POP_TONE = 83
const COMPANION_TURN = -120

const opt = <K extends keyof typeof ART_OPTIONS>(k: K, key: string) =>
  (ART_OPTIONS[k] as readonly { key: string }[]).find((o) => o.key === key) as (typeof ART_OPTIONS)[K][number]

// A true gray at an OKLab lightness (0-100): no tint from the source.
function grayAt(tone: number) {
  const y = (tone / 100) ** 3
  const v = y <= 0.0031308 ? 12.92 * y : 1.055 * y ** (1 / 2.4) - 0.055
  const c = Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')
  return `#${c}${c}${c}`
}

/** The art's groups for a source and settings, for anything that shows the rhythm. */
export function artPalette(sourceHex: string, settings: Partial<ArtSettings> = {}) {
  const s = { ...ART_DEFAULTS, ...settings }
  const v = Math.min(100, Math.max(0, s.intensity))
  const chroma = isHueless(sourceHex) ? 0 : (v / 100) * MAX_CHROMA
  // How deep the color sits: pale tints up to 25, all deep from 65.
  const depth = Math.min(1, Math.max(0, (v - 25) / 40))
  const tones = PALE.map((t, i) => t + (DEEP[i] - t) * depth)
  const grayCount = opt('mix', s.mix).grays

  const grays = GRAY_TONES.slice(0, grayCount).map(grayAt)
  const accents = Array.from({ length: 10 - grayCount - 1 }, (_, i) => {
    const t = tones[i % tones.length]
    return chroma ? toneAt(sourceHex, t, { chromaScale: 0, minChroma: chroma }) : grayAt(t)
  })
  const pop = chroma
    ? vividTone(sourceHex, { hueTurn: COMPANION_TURN, chromaScale: 0, minChroma: chroma, near: POP_TONE })
    : grayAt(POP_TONE)
  return { grays, accents, pop }
}

function buildPalette(sourceHex: string, settings: Partial<ArtSettings> = {}): Palette {
  const { grays, accents, pop } = artPalette(sourceHex, settings)
  const colors = [...grays, ...accents, pop]
  const lights = colors.filter((c) => luminance(c) > 0.45)
  const darks = colors.filter((c) => luminance(c) <= 0.45)
  return { colors, darks, lights, pop }
}

function contrastPair(bg: string, pal: Palette): string {
  const pool = luminance(bg) > 0.45 ? pal.darks : pal.lights
  return pool.length ? pick(pool) : (luminance(bg) > 0.45 ? '#111111' : '#efefef')
}

// --- Layout engine: variable spanning cells on a 12x10 unit grid ---

type Kind = 'standard' | 'eye' | 'mouth'
type Cell = { col: number; row: number; colSpan: number; rowSpan: number; bg: string; fg: string; fn: number; kind: Kind }

const SPAN_OPTIONS: [number, number][] = [
  [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1],
  [2, 1], [2, 1], [2, 1],
  [1, 2], [1, 2], [1, 2],
  [2, 2], [2, 2],
  [3, 1], [3, 2],
  [1, 3], [2, 3],
]

// Asset panels always land on large spans so they read as focal points.
const BIG_SPANS: [number, number][] = [[2, 2], [3, 2], [2, 3], [3, 1], [2, 1], [1, 2]]

function buildLayout(pal: Palette, assetsReady: boolean, COLS = 12, ROWS = 10): Cell[] {
  const occupied = Array.from({ length: ROWS }, () => new Array(COLS).fill(false))
  const cellGrid: (Cell | null)[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(null))
  const cells: Cell[] = []

  // Zones: the grid is split into horizontal bands and one asset is seeded per
  // band, so no single region of the composition dominates.
  // Six on the original 12x10; fewer on a smaller grid, never more rows than
  // there are zones for.
  const assetCount = assetsReady ? Math.max(1, Math.min(6, ROWS, Math.round((COLS * ROWS) / 20))) : 0
  const assetKinds: Kind[] = Array.from({ length: assetCount }, (_, i) => (i % 2 ? 'mouth' : 'eye'))
  for (let i = assetKinds.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[assetKinds[i], assetKinds[j]] = [assetKinds[j], assetKinds[i]]
  }
  const assetMap: Record<string, Kind> = {}
  assetKinds.forEach((kind, i) => {
    const zoneRows = Math.floor(ROWS / assetKinds.length)
    const rowMin = i * zoneRows
    const rowMax = i === assetKinds.length - 1 ? ROWS - 1 : rowMin + zoneRows - 1
    const row = rowMin + Math.floor(rand() * (rowMax - rowMin + 1))
    const col = Math.floor(rand() * (COLS - 2))
    assetMap[`${row},${col}`] = kind
  })

  const isFree = (r: number, c: number, rSpan: number, cSpan: number) => {
    if (r + rSpan > ROWS || c + cSpan > COLS) return false
    for (let dr = 0; dr < rSpan; dr++)
      for (let dc = 0; dc < cSpan; dc++)
        if (occupied[r + dr][c + dc]) return false
    return true
  }

  const getNeighbors = (r: number, c: number, rSpan: number, cSpan: number) => {
    const seen = new Set<Cell>()
    const out: Cell[] = []
    const add = (cell: Cell | null) => { if (cell && !seen.has(cell)) { seen.add(cell); out.push(cell) } }
    if (r > 0) for (let dc = 0; dc < cSpan; dc++) add(cellGrid[r - 1][c + dc])
    if (c > 0) for (let dr = 0; dr < rSpan; dr++) add(cellGrid[r + dr][c - 1])
    return out
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (occupied[r][c]) continue

      const assetKind = assetMap[`${r},${c}`]
      const spanPool = assetKind ? BIG_SPANS : SPAN_OPTIONS
      const valid = spanPool.filter(([cs, rs]) => isFree(r, c, rs, cs))
      const [cSpan, rSpan] = valid.length ? pick(valid) : [1, 1]
      const neighbors = getNeighbors(r, c, rSpan, cSpan)

      const usedBgs = new Set(neighbors.map((nb) => nb.bg))
      const bgPool = pal.colors.filter((col) => !usedBgs.has(col))
      const bg = pick(bgPool.length ? bgPool : pal.colors)
      const fg = contrastPair(bg, pal)

      let fn = -1
      if (!assetKind) {
        const usedFns = new Set(neighbors.filter((nb) => nb.fn >= 0).map((nb) => STANDARD[nb.fn]))
        const fnPool = STANDARD.map((_, i) => i).filter((i) => !usedFns.has(STANDARD[i]))
        fn = pick(fnPool.length ? fnPool : STANDARD.map((_, i) => i))
      }

      const cell: Cell = {
        col: c, row: r, colSpan: cSpan, rowSpan: rSpan,
        bg, fg, fn, kind: assetKind ?? 'standard',
      }
      for (let dr = 0; dr < rSpan; dr++)
        for (let dc = 0; dc < cSpan; dc++) {
          occupied[r + dr][c + dc] = true
          cellGrid[r + dr][c + dc] = cell
        }
      cells.push(cell)
    }
  }
  return cells
}

// The pattern reference lists each type once. STANDARD weights letterform ×3
// for the composition, so the guide uses its own de-duplicated ordering.
//
// These twenty are the kit's Pattern Tiles (Graphite UI Kit 11692:22), one
// Style variant each, under the same names but one: the kit calls 'Circle'
// 'Download circle'. The kit's tiles are images in the default source's colors;
// these recolor from the live source, so the two match only at #5e44aa.
const SPECIMENS: { name: string; fn?: P; asset?: 'eye' | 'mouth' }[] = [
  { name: 'Diagonal stripes', fn: pDiagonalStripes },
  { name: 'Gesture marks', fn: pGestureMarks },
  { name: 'Halftone radial', fn: pHalftoneRadial },
  { name: 'Circle', fn: pCircle },
  { name: 'Nested rects', fn: pNestedRects },
  { name: 'Halftone blob', fn: pHalftoneBlob },
  { name: 'Bold diagonal', fn: pBoldDiagonal },
  { name: 'Arc', fn: pArc },
  { name: 'Split diagonal', fn: pSplitDiagonal },
  { name: 'H stripes', fn: pHStripes },
  { name: 'V stripes', fn: pVStripes },
  { name: 'Concentric circles', fn: pConcentricCircles },
  { name: 'Crosshatch', fn: pCrosshatch },
  { name: 'Color block', fn: pSolid },
  { name: 'Wave lines', fn: pWaveLines },
  { name: 'Dot grid', fn: pDotGrid },
  { name: 'Letterform', fn: pLetterform },
  { name: 'Checkerboard', fn: pCheckerboard },
  { name: 'Eye · halftone', asset: 'eye' },
  { name: 'Mouth · halftone', asset: 'mouth' },
]

export const PATTERN_NAMES = SPECIMENS.map((s) => s.name)

// One named tile at a fixed index — the pattern reference specimen.
export function PatternSpecimen({ index, size = 140 }: { index: number; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { sourceHex } = useTheme()
  const activeHex = sourceHex || COVER_SOURCE_HEX
  const palette = useMemo(() => buildPalette(activeHex), [activeHex])
  const spec = SPECIMENS[index]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cancelled = false

    const render = (asset?: HTMLImageElement) => {
      if (cancelled) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = size * dpr
      canvas.height = size * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const prevRand = rand
      // Seeded per index so a specimen holds still between renders.
      rand = mulberry32(hexSeed(activeHex) + index * 7919)
      try {
        const bg = pick(palette.colors)
        const fg = contrastPair(bg, palette)
        if (asset) drawHalftoneAsset(ctx, size, size, asset, bg, fg)
        else spec.fn!(ctx, size, size, bg, fg)
      } finally {
        rand = prevRand
      }
    }

    if (spec.asset) {
      const img = new window.Image()
      img.onload = () => render(img)
      img.src = `/graphite/${spec.asset}.jpg`
    } else {
      render()
    }
    return () => { cancelled = true }
  }, [palette, index, size, activeHex, spec])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}

// --- Component ---

// Cells adjacent to a given box — used when a single tile is reshuffled in
// place so the replacement still respects neighbor avoidance.
function findLayoutNeighbors(layout: Cell[], target: Cell): Cell[] {
  const aL = target.col, aR = target.col + target.colSpan
  const aT = target.row, aB = target.row + target.rowSpan
  return layout.filter((o) => {
    if (o === target) return false
    const bL = o.col, bR = o.col + o.colSpan, bT = o.row, bB = o.row + o.rowSpan
    const hAdj = (aR === bL || bR === aL) && aT < bB && bT < aB
    const vAdj = (aB === bT || bB === aT) && aL < bR && bL < aR
    return hAdj || vAdj
  })
}

// Reroll one cell's color and pattern without rebuilding the grid.
function shuffleCell(layout: Cell[], target: Cell, pal: Palette) {
  const neighbors = findLayoutNeighbors(layout, target)
  const usedBgs = new Set(neighbors.map((n) => n.bg))
  const bgPool = pal.colors.filter((c) => !usedBgs.has(c) && c !== target.bg)
  target.bg = pick(bgPool.length ? bgPool : pal.colors)
  target.fg = contrastPair(target.bg, pal)
  if (target.kind === 'standard') {
    const usedFns = new Set(neighbors.filter((n) => n.fn >= 0).map((n) => n.fn))
    const pool = STANDARD.map((_, i) => i).filter((i) => !usedFns.has(i) && i !== target.fn)
    target.fn = pick(pool.length ? pool : STANDARD.map((_, i) => i))
  }
}

// Set once the visitor dismisses the kit cover, for the lifetime of the page.
let coverDismissed = false

export type GenerativeArtHandle = {
  regenerate: () => void
  exportPng: () => void
}

export function GenerativeArt({
  className,
  interactive = false,
  cover = interactive,
  settings = ART_DEFAULTS,
  onReady,
}: {
  className?: string
  /** Intensity, mix and grid. See artPalette. */
  settings?: ArtSettings
  /** Enables click-to-shuffle on individual panels. */
  interactive?: boolean
  /** Greets the first view with the kit cover. Off where the grid is the point. */
  cover?: boolean
  /** Receives the imperative handle for Regenerate / Export PNG toolbars. */
  onReady?: (handle: GenerativeArtHandle) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { sourceHex } = useTheme()
  const activeHex = sourceHex || COVER_SOURCE_HEX

  const { intensity, mix, grid } = settings
  const palette = useMemo(
    () => buildPalette(activeHex, { intensity, mix }),
    [activeHex, intensity, mix],
  )
  // The canvas's own size, so the grid reflows with its container.
  const [box, setBox] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const measure = () => setBox({ w: canvas.offsetWidth, h: canvas.offsetHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])
  const { cols, rows } = gridFor(box.w, box.h, grid)
  // The grid the current layout was dealt on, read by paint and the click.
  const gridRef = useRef({ cols, rows })
  // Bumped after every rebuild, so the canvas repaints with the new layout.
  const [dealt, setDealt] = useState(0)
  // Near-black seams in both themes, as the original drew them: white seams
  // in light mode broke the tiles apart instead of framing them.
  const seamColor = '#0a0a0a'

  const assetsRef = useRef<{ eye: HTMLImageElement; mouth: HTMLImageElement } | null>(null)
  const [assetsReady, setAssetsReady] = useState(false)

  // Bumping this rebuilds the whole composition (Regenerate). Each deal keeps
  // its seed, so moving a control afterwards recolors or reflows that deal
  // rather than dealing a new one.
  const [nonce, setNonce] = useState(0)
  const dealSeed = useRef(0)
  // Switching Explore tabs remounts this component, so "dismissed" is tracked
  // per session rather than per mount — the cover greets you once, not
  // every time you come back to the composition view.
  const [showCover, setShowCover] = useState(!coverDismissed)
  const layoutRef = useRef<Cell[] | null>(null)
  // Tile bitmaps are cached per cell because the pattern functions consume the
  // RNG — without this, a resize or a single-tile shuffle would reroll every
  // other tile in the grid.
  const tileCache = useRef(new WeakMap<Cell, HTMLCanvasElement>())

  useEffect(() => {
    let cancelled = false
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    Promise.all([load('/graphite/eye.jpg'), load('/graphite/mouth.jpg')])
      .then(([eye, mouth]) => {
        if (cancelled) return
        assetsRef.current = { eye, mouth }
        setAssetsReady(true)
      })
      .catch(() => { /* assets are decorative — the grid renders fine without them */ })
    return () => { cancelled = true }
  }, [])

  // Rebuild the layout whenever the palette or nonce changes.
  useEffect(() => {
    const prevRand = rand
    rand = mulberry32(nonce === 0 ? hexSeed(activeHex) : dealSeed.current)
    try {
      layoutRef.current = buildLayout(palette, !!assetsRef.current, cols, rows)
      gridRef.current = { cols, rows }
      tileCache.current = new WeakMap()
      setDealt((d) => d + 1)
    } finally {
      rand = prevRand
    }
  }, [activeHex, palette, assetsReady, nonce, cols, rows])

  // Paint `layout` into any 2D context at the given size.
  const paint = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const layout = layoutRef.current
    if (!layout) return
    const assets = assetsRef.current
    const uW = W / gridRef.current.cols, uH = H / gridRef.current.rows

    ctx.fillStyle = palette.colors[0]
    ctx.fillRect(0, 0, W, H)

    for (const cell of layout) {
      const { col, row, colSpan, rowSpan, bg, fg, fn, kind } = cell
      const px = col * uW, py = row * uH
      const pw = uW * colSpan, ph = uH * rowSpan

      let off = tileCache.current.get(cell)
      if (!off || off.width !== Math.round(pw) || off.height !== Math.round(ph)) {
        off = document.createElement('canvas')
        off.width = Math.max(1, Math.round(pw))
        off.height = Math.max(1, Math.round(ph))
        const oCtx = off.getContext('2d')
        if (oCtx) {
          if (kind !== 'standard' && assets) {
            drawHalftoneAsset(oCtx, off.width, off.height, assets[kind], bg, fg)
          } else {
            STANDARD[fn >= 0 ? fn : 0](oCtx, off.width, off.height, bg, fg)
          }
        }
        tileCache.current.set(cell, off)
      }
      ctx.drawImage(off, px, py, pw, ph)
    }

    ctx.strokeStyle = seamColor
    ctx.lineWidth = 2
    for (const { col, row, colSpan, rowSpan } of layout) {
      ctx.strokeRect(col * uW, row * uH, uW * colSpan, uH * rowSpan)
    }
  }, [palette, seamColor])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    if (W === 0 || H === 0) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const prevRand = rand
    rand = mulberry32(hexSeed(activeHex))
    try {
      paint(ctx, W, H)
    } finally {
      rand = prevRand
    }
  }, [paint, activeHex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    draw()
    const ro = new ResizeObserver(() => draw())
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [draw, dealt])

  // Export 1600 wide, at the canvas's own proportions (portrait on a phone).
  const exportPng = useCallback(() => {
    const canvas = canvasRef.current
    const W = 1600
    const H = canvas && canvas.offsetWidth ? Math.round((W * canvas.offsetHeight) / canvas.offsetWidth) : 900
    const out = document.createElement('canvas')
    out.width = W
    out.height = H
    const ctx = out.getContext('2d')
    if (!ctx) return
    // Export renders at a different size, so use a scratch cache to avoid
    // evicting the on-screen tile bitmaps.
    const onScreen = tileCache.current
    tileCache.current = new WeakMap()
    const prevRand = rand
    rand = mulberry32(hexSeed(activeHex))
    try {
      paint(ctx, W, H)
    } finally {
      rand = prevRand
      tileCache.current = onScreen
    }
    const a = document.createElement('a')
    a.download = `graphite-ui-${activeHex.replace('#', '')}.png`
    a.href = out.toDataURL('image/png')
    a.click()
  }, [paint, activeHex])

  const regenerate = useCallback(() => {
    dealSeed.current = Math.floor(Math.random() * 0xffffffff)
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    onReady?.({ regenerate, exportPng })
  }, [onReady, regenerate, exportPng])

  // Click a panel to reshuffle just that tile, as on the original tool.
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return
    const canvas = canvasRef.current
    const layout = layoutRef.current
    if (!canvas || !layout) return
    const rect = canvas.getBoundingClientRect()
    const col = Math.floor(((e.clientX - rect.left) / rect.width) * gridRef.current.cols)
    const row = Math.floor(((e.clientY - rect.top) / rect.height) * gridRef.current.rows)
    const hit = layout.find(
      (c) => col >= c.col && col < c.col + c.colSpan && row >= c.row && row < c.row + c.rowSpan,
    )
    if (!hit) return

    const prevRand = rand
    rand = mulberry32(Math.floor(Math.random() * 0xffffffff))
    try {
      shuffleCell(layout, hit, palette)
      tileCache.current.delete(hit)
    } finally {
      rand = prevRand
    }
    draw()
  }, [interactive, palette, draw])

  return (
    <div className="art">
      <canvas
        ref={canvasRef}
        className={className}
        onClick={handleClick}
        aria-hidden={!interactive}
        role={interactive ? 'img' : undefined}
        aria-label={
          interactive
            ? `Generative art built from ${activeHex}. Select a panel to reshuffle it.`
            : undefined
        }
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: interactive ? 'pointer' : undefined,
        }}
      />

      {/* The kit cover, restored as the splash it is on the original tool:
          it sits over the canvas until dismissed, then reveals the live grid. */}
      {interactive && cover && showCover && (
        <button
          type="button"
          className="art__cover"
          onClick={() => {
            coverDismissed = true
            setShowCover(false)
          }}
          aria-label="Dismiss cover and explore the generative composition"
        >
          <img src="/graphite/cover.jpg" alt="Graphite UI Kit" />
          <span className="art__cover-hint">Enter the system</span>
        </button>
      )}
    </div>
  )
}
