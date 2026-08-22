// Type declarations for lib/color.js.
//
// The engine is plain JS, so without these every return type infers as `{}`
// and `next build` fails type-checking on any property access (see the ~39
// errors this clears in theme-provider.tsx). Shapes here mirror what the
// functions actually return — keep them in sync if color.js changes.

export type StatusName = 'danger' | 'warning' | 'success' | 'info'
export type RampName =
  'accent' | 'secondary' | 'neutral' | 'neutralVariant' | StatusName
export type ThemeMode = 'light' | 'dark'
export type ContrastLevel = 'AA' | 'AAA'

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface Hsv {
  h: number
  s: number
  v: number
}

/** One sampled stop on a ramp. `source` marks the pinned source hex. */
export interface RampStop {
  tone: number
  hex: string
  source: boolean
}

/** `tone()` is continuous, so callers can resolve tones between named stops. */
export interface Ramp {
  tone: (tone: number) => string
  stops: RampStop[]
  sourceTone?: number
}

export type Ramps = Record<RampName, Ramp>

/** A semantic token: the resolved hex plus where it came from. */
export interface Token {
  ramp: RampName
  tone: number
  hex: string
}

export interface ContrastCheck {
  against: string
  ratio: number
  target: number
  passes: boolean
  fixed: boolean
  kind: 'AA' | 'UI'
  level: string
}

/**
 * Roles are indexed rather than enumerated: the map is data-driven in
 * color.js, so an index signature keeps this honest instead of hardcoding a
 * role list that could drift. Named roles the app relies on are declared so
 * they stay checked.
 */
export interface ThemeTokens extends Record<string, Token> {
  primary: Token
  onPrimary: Token
  primaryContainer: Token
  onPrimaryContainer: Token
  secondary: Token
  onSecondary: Token
  secondaryContainer: Token
  onSecondaryContainer: Token
  surface: Token
  surfaceElevated: Token
  onSurface: Token
  surfaceVariant: Token
  onSurfaceVariant: Token
  outline: Token
  background: Token
  onBackground: Token
  danger: Token
  onDanger: Token
  dangerContainer: Token
  onDangerContainer: Token
  warning: Token
  onWarning: Token
  warningContainer: Token
  onWarningContainer: Token
  success: Token
  onSuccess: Token
  successContainer: Token
  onSuccessContainer: Token
  info: Token
  onInfo: Token
  infoContainer: Token
  onInfoContainer: Token
}

export interface Theme {
  mode: ThemeMode
  level: ContrastLevel
  tokens: ThemeTokens
  contrast: Record<string, ContrastCheck>
}

export interface StateEntry {
  ramp: RampName
  tone: number
  hex: string
}

export interface DisabledState extends StateEntry {
  content: StateEntry
}

/** The state set every interactive family carries. */
export interface FamilyStates extends Record<
  string,
  StateEntry | DisabledState
> {
  base: StateEntry
  hover: StateEntry
  pressed: StateEntry
  selected: StateEntry
  disabled: DisabledState
  focus: StateEntry
}

/** Retained name for the same shape, from when primary was the only family. */
export type PrimaryStates = FamilyStates

export interface States {
  primary: FamilyStates
  secondary: FamilyStates
  /** The page-level focus ring — primary's, not a third value. */
  focus: StateEntry
}

export interface ExportBundle {
  hex: string
  ramps: Ramps
  light: Theme
  lightStates: States
  dark: Theme
  darkStates: States
}

export declare const TONE_STOPS: number[]
export declare const STATUS_NAMES: StatusName[]
export declare const STATE_FAMILIES: readonly ['primary', 'secondary']

export declare function normalizeHex(hex: string): string
export declare function hexToRgb(hex: string): Rgb
export declare function rgbToHex(rgb: Rgb): string
export declare function hexToHsv(hex: string): Hsv
export declare function hsvToHex(hsv: Hsv): string

export declare function relativeLuminance(hex: string): number
export declare function contrastRatio(hexA: string, hexB: string): number

export declare function sourceToneOf(hex: string): number
export declare function makeRamps(hex: string): Ramps

export declare function buildTheme(
  mode: ThemeMode,
  ramps: Ramps,
  level?: ContrastLevel,
  autoFix?: boolean,
): Theme

export declare function buildStates(
  tokens: ThemeTokens,
  ramps: Ramps,
  mode: ThemeMode,
): States

export declare function buildCss(bundle: ExportBundle): string
export declare function buildJson(bundle: ExportBundle): string
