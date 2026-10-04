# Search

The docs search reads questions as well as keywords. It still has no model
behind it: everything runs in the browser over the static index built from
page metadata, tables of contents, contracts and doc configs
(`lib/search-index.ts`). The goal was for it to feel attentive through what it
does, and never to claim more than that.

- `components/search/search.ts`: the keyword ranking. Unchanged except that
  each hit now carries a per-word score.
- `components/search/understand.ts`: reads a query into a page, a section and
  leftover words; completions; did-you-mean; related searches; the one-line
  reason under the best match.
- `components/search/search-palette.tsx`: the dialog and its states.

## AI styling, and what replaced the rule

This section used to be a rule: the kit's AI label, AI layer and explainability
popover are for features an AI model powers ("Don't reuse the AI label styling
for non-AI features"), so search used none of them and carried an honest "How
search works" panel saying there is no model.

Both halves have since been reversed by request. The panel now wears the AI
layer's tinted background and edge, drawn on `primary`, and drops from the
header like the explainability popover. The "How search works" panel was
removed. Search still never shows the AI label, which is the kit's actual claim
that a model is involved, and still has no model. With the disclosure gone,
nothing on screen says so: if that matters again, the cheapest fix is one line
of copy in the footer, not the old popover.

## States

| # | State | What the reader sees |
| - | --- | --- |
| 1 | Default | Recent searches, "Try asking" prompts for the current page, and Start here pages. |
| 2 | Focused | Same list, first item active. The placeholder names the page you are on ("Ask about Tabs, or search all docs"). |
| 3 | Typing | Results update on every keystroke. Ghost text completes the word. |
| 4 | Autocomplete | Up to three whole-query suggestions above the results. Tab or → accepts the ghost text. |
| 5 | Processing | Skeleton rows and an inline loading line while the index loads on first open. That is the only real wait, so it is the only spinner. |
| 6 | Results | "Looking in" chips, category filters with counts, a Best match with its reason, the rest grouped by category, Related searches. |
| 7 | Refining | Remove the page or section chip, filter by category, restore dropped words, or pick a related search. Every change is announced. |
| 8 | No results | What was searched, a did-you-mean when a spelling is close, and prompts that are known to return results. |
| 9 | Error | Plain explanation, Try again (refetches), and direct links to the main pages. |

## Decisions

Each one: what it does, why it reads as intelligent, the pattern, the Graphite
component.

**Natural-language queries.** "How do I use tabs with a keyboard?" drops the
question words, finds the Tabs page and maps "keyboard" to Accessibility. It
answers the question someone asked, not the literal string. Pattern: query
understanding / intent recognition. Component: the existing search field (kit
Search, header variant), no new control.

**Showing how the query was read.** A "Looking in" row shows the page and
section as removable chips, plus any rewrite ("Read “dark mode” as “themes”")
or dropped word. Visible reasoning is what separates "it understood me" from
"it got lucky", and each part can be undone. Pattern: search scope chips /
applied filters. Component: styled after kit Tag - Dismissible on
`primary-container`, drawn in the palette's own module. The governed Tag has
since gained `onDismiss` (Tag 3.0.0), but the palette predates it.

**Contextual prompts before typing.** On a component page the prompts are
about that component (`tabs props`, `How do I use tabs with a keyboard?`).
Elsewhere they are site-wide. Every prompt is tested to return results.
Pattern: zero-query suggestions. Component: option rows in the listbox with a
Search icon.

**Recent searches.** The last five queries that led somewhere, kept in
`localStorage`, with Clear. Pattern: search history. Component: option rows
with a Time icon; Clear is a text button.

**Ghost-text completion.** The rest of the likely word appears in
`on-surface-variant` after the caret; Tab or → takes it. It feels like the
field is keeping up with you. Pattern: inline autocomplete (address bar,
shell). Component: the search field; the ghost is a styled copy of its text.

**Whole-query suggestions.** "button " offers `button props`,
`button accessibility`, `button tokens`. Built only from page names and section
words, so each one returns results. Pattern: query suggestions. Component:
option rows.

**Best match with a reason.** The top hit is larger, shows three lines of
context, and says why it ranked first ("The Accessibility section of Tabs,
which your search asked about"). The reason is derived from what actually
matched. Pattern: featured result / explainability. Component: result row
with Tag for its category.

**Grouped results and filters.** Results after the best match are grouped
by Components, Foundations, Guides and Tools, and filter chips show counts.
Filters appear only when there is more than one category to choose from.
Pattern: faceted search. Component: styled after kit Tag - Selectable
(`aria-pressed` buttons).

**Highlighted terms.** Matched words are bold in snippets, so it is clear
why a result is there. Pattern: hit highlighting. Component: `mark` inside
the snippet, no background colour.

**Dropping a stray word.** If one word sinks the query ("type scale on
mobile"), search drops it, says so, and offers "Search every word instead".
Pattern: query relaxation ("showing results for"). Component: note text and a
text button.

**Related searches.** Other sections of the same component, then the pages
it lists as related. Pattern: follow-up queries. Component: option rows with
an ArrowRight icon.

**No results.** Says what was searched and what search looks at, offers a
close spelling, then prompts known to work. Pattern: zero-results recovery.
Component: message block and option rows.

**Error.** Explains the index did not load, offers Try again, and links
straight to the main pages so the reader is never stuck. Pattern: graceful
degradation. Component: Button (secondary, sm) and links.

**Processing.** Only shown while the index is fetched. No fake delay is
added while typing: results are instant, and a spinner there would pretend
to work that is not happening. Pattern: skeleton loading. Component: styled
after kit Inline loading, with skeleton rows the shape of results.

## Accessibility and layout

- The field is a combobox (`aria-autocomplete="both"`, `aria-activedescendant`)
  over a listbox of labelled groups. Arrow keys move, Enter opens or applies,
  Tab accepts a completion, Escape closes.
- A polite live region announces counts, scope, filters and did-you-mean.
- Chips and filters are real buttons with names ("Stop limiting to Tabs").
- From 672px the panel drops from the header's search trigger with a caret,
  slid along to stay 16px inside the window, with a fixed height so it does not
  jump while typing. Below 672px it becomes a full-screen sheet with a Cancel
  button, and the keyboard hints are hidden on touch.
- The footer is the keyboard hints and a filled Search action, which does what
  Enter does.
- It drops in with a spring, the tint rises and the result groups cascade; on
  phones it fades. Reduced motion turns all of it off.

## Limits worth knowing

- Understanding is rule-based: page names, a word list per section, a short
  list of everyday synonyms (`PHRASES` in `understand.ts`). A phrasing outside
  those falls back to keyword search, which is never worse than before.
- Two pages share the name Typography (the foundation and the component).
  Naming it scopes to both.
- The Tag - Dismissible and Tag - Selectable looks are drawn in the palette's
  module, though the governed Tag now provides both (`onDismiss` and
  `SelectableTag`, Tag 3.0.0). Moving the palette onto them is open work.
