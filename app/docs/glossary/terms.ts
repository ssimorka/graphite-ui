// The glossary's terms. Here rather than in the page so the page file only
// exports what Next allows.

// The words the home page and the docs use for the system itself.
export const SYSTEM_TERMS: [string, string][] = [
  ['Kit', 'The Figma file: every component and token, as designed. It is the source of truth.'],
  ['Engine', 'The code that turns your source color into ramps, roles and both themes.'],
  ['Contract', 'A component\u2019s written spec. It lists what the component may use and do, and it is versioned.'],
  ['Governed', 'A component with a contract. Automated checks hold its code to that contract.'],
  ['Ungoverned', 'A component in the kit with no contract. It is labelled so you know before you use it.'],
  ['Token', 'A named design value, such as a color or a spacing step, stored as a CSS variable.'],
]

// In the order a reader meets the terms, not alphabetical: read top to bottom
// it doubles as a recap of the model.
export const COLOR_TERMS: [string, string][] = [
  ['Source color', 'The one color you choose. Everything else is calculated from it.'],
  ['Hue', 'Which color it is: red, green, blue. Changing hue turns a red into an orange.'],
  ['Chroma', 'How intense the color is. High chroma is vivid; zero chroma is gray.'],
  ['Tone', 'How light or dark, from 0 (black) to 100 (white). Tone 40 is dark; tone 90 is pale.'],
  ['Ramp', 'One hue from dark to light: the same color at ten tones, like a paint strip.'],
  ['OKLab', 'The color model the math runs in. Equal steps in its numbers look like equal steps to the eye.'],
  ['Primitive', 'A raw color on a ramp, with no job attached. Useful to look at, never to build with.'],
  ['Role', 'A named color with a job, such as page background or button fill. You build with these.'],
  ['On-color', 'The text or icon color for on top of another. onSurface goes on surface, and is guaranteed readable there.'],
  ['Container', 'A quieter version of a color, for filling an area rather than drawing the eye.'],
  ['Theme', 'Light or dark. Same role names in both; different values behind them.'],
  ['Contrast ratio', 'How different two colors are in lightness, written like 4.5:1. Higher is easier to read.'],
  ['AA / AAA', 'Two bars from the WCAG standard. AA is the common minimum; AAA is stricter.'],
]
