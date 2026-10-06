// What the visitor chose, kept across page loads. Most links on the site are
// plain anchors, so every click is a full load and the provider starts from
// its defaults; without this a picked source color lasted one page.
//
// Plain module, no 'use client': the root layout reads the inline script below
// on the server, and the theme provider reads the keys in the browser.

/** The choice itself: { sourceHex, theme, level }, restored by the provider. */
export const THEME_CHOICE_KEY = 'graphite-theme-choice'

/**
 * The last set of CSS variables the provider stamped onto <html>, with its
 * theme name and Carbon zone class. Only for the inline script, which cannot
 * run the color engine: it puts these back before first paint so the page
 * does not flash the default color while the bundle loads.
 */
export const THEME_PAINT_KEY = 'graphite-theme-paint'

// Runs in <head>, before anything paints. Storage can be missing or throw
// (private windows, blocked site data), and the page is simply default then.
// A paint saved before the light/dark rename has no `theme`, only the class,
// so the name is read off the class in that case.
export const THEME_RESTORE_SCRIPT = `try{var p=JSON.parse(localStorage.getItem('${THEME_PAINT_KEY}')||'null');if(p&&p.vars){var r=document.documentElement;if(p.cls){r.classList.remove('cds--white','cds--g100');r.classList.add(p.cls)}var t=p.theme||(p.cls==='cds--white'?'light':'dark');r.setAttribute('data-theme',t);r.style.colorScheme=t;for(var k in p.vars)r.style.setProperty(k,p.vars[k])}}catch(e){}`
