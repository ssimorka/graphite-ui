/**
 * Easing curves as SVG paths, for the Motion page's easing figures. The
 * server page calls it with the token values it reads at build time.
 */

/** An SVG path for a cubic-bezier() or linear() easing, in a 100 by 100 box, y up. */
export function curvePath(value: string): string {
  const v = value.trim()
  const bez = /cubic-bezier\(([^)]+)\)/.exec(v)
  if (bez) {
    const [x1, y1, x2, y2] = bez[1].split(',').map(Number)
    return `M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`
  }
  const lin = /linear\((.*)\)/.exec(v)
  if (lin) {
    const stops = lin[1].split(',').map((s) => s.trim().split(/\s+/))
    const pts = stops.map(([y, x], i) => [x ? parseFloat(x) : (i / (stops.length - 1)) * 100, 100 - parseFloat(y) * 100])
    return `M${pts.map(([x, y]) => `${x},${y}`).join(' L')}`
  }
  return 'M0,100 L100,0'
}
