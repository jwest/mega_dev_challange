# S01E03 — what it shows

Public delivery for the MEGA.dev support desk exercise. Source: `kb-export-267efc5e.zip`, exported 2026-10-04. The export represents fictional course data.

## Deliverables

- Browsable static knowledge base: [`site/index.html`](site/index.html). Download the `site/` directory and open `index.html`; all internal links lead to relative `.html` files. Current decision: [`site/decisions/0003-4471-disposition.html`](site/decisions/0003-4471-disposition.html).
- Direct page source: [`page.svx`](page.svx), a copy of the current KB route below; rendered counterpart: [`rendered.html`](rendered.html).
- [Parser issue — 379 reports](https://github.com/jwest/mega_dev_challange/issues/1).
- [booking-v3 hint issue — 33 reports](https://github.com/jwest/mega_dev_challange/issues/2).
- Current signed KB page: [`src/routes/kb/decisions/0003-4471-disposition/+page.svx`](src/routes/kb/decisions/0003-4471-disposition/+page.svx).
- Initial accepted triage decision, retained as history: [`0002`](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx).
- Rendered page, including actual component output: [`rendered.html`](rendered.html). Download/open this file in a browser to read the captured page. It contains the computed cause table, exception table, SVG timeline, deduplication cases and generated desk ref.
- Screenshot: [`rendered.png`](rendered.png).
- Reproducible calculations: [`analyze.mjs`](analyze.mjs), full report-to-cause mapping and weekly totals in [`analysis.json`](analysis.json).

## Run

Requires Node.js 24 and npm.

```sh
npm ci
node --experimental-strip-types analyze.mjs
npm run build
npm run dev
```

Open `/kb/decisions/0003-4471-disposition` on the local server. The `.svx` is compiled with mdsvex and Svelte 5; it uses the original exported components and logic. The build is a client application; `rendered.html` is a captured, fully rendered standalone HTML artifact, not an empty application shell.

## Static website

```sh
npm ci
npm run build:static
```

Open `site/index.html` directly in a browser. This separate build renders every KB route using Svelte's server renderer and embeds its CSS in a complete HTML document. It preserves the computed tables, SVG charts and desk references without browser JavaScript. Only the deduplication explorer is mounted as an interactive island, using an inline classic script so it also works over `file://`. Its initial result and example table remain visible when JavaScript is disabled.

The generator is `build-static.mjs`; server and browser entry points are `src/static-server.js` and `src/static-client.js`. Internal KB links are rewritten to relative `.html` destinations, and unknown KB targets fail the build. No API, application server or client-side router is needed. Pages reflect the data and review ages at build time; rebuild after source changes.

The generated `site/` directory can be uploaded unchanged to a static host, including GitHub Pages under a repository subpath. Publish its **contents** as the site root. The `.nojekyll` marker is included. This build does not itself configure or deploy GitHub Pages.

Verified on 2026-10-28 in Chromium: all six HTML documents opened over `file://`, every internal link resolved, and all pages retained content and styles with JavaScript disabled. The current decision rendered 412 reports, 379/33 coverage and 54 chart bars. After it was signed with the course-issued signature, it renders desk ref `DR-MEAS-T81M`. Changing the explorer's second tenant from `kettle.books` to `alder.physio` changed the verdict from “different causes — keep apart” to “same cause — merge”; no page JavaScript errors were observed. Both `npm run build:static` and the existing `npm run build` passed.

## Findings and boundaries

427 export rows collapse to 412 unique report IDs. Tenant locale, tenant form version and report channel determine the routing: 379 parser, 33 hint. Intake tags disagree for 38 reports and must not substitute for tenant configuration.

Five parser-routed reports have contradictory or unusual bodies. The decision preserves their exact words and IDs, distinguishes routing from proven root cause and calls for investigation without inventing a confirmed timezone bug. They are included in 379, not counted again.

The July merge spike is delayed backlog processing, not the beginning of reported failures: received dates start in April, and reports keep arriving afterward. “Known” is not “fixed”.

The new decision supersedes accepted decision 0001 without rewriting history. It replaces subject-only merging with cause-aware triage. The exported `src/` files remain as supplied, except for the addition of the new decision and the `ReportExceptions` component. Countable values are computed by components, rather than hardcoded into KB prose.

## Engineering update

After the first submission, the course accepted both tickets and published an update: **#4471 closed 05 Oct**. Parser: **fixed**, `fix(dates): parse dd/mm for eu locales`. Hint: **won't fix**, `booking-v3 form retired`. Ticket 1 is closed completed; ticket 2 is closed not planned. New accepted decision 0003 preserves decision 0002 and distinguishes these outcomes. The historical table still reflects the pre-update export and is labelled accordingly.

This delivery includes the October export snapshot plus the later course engineering update. No live report endpoint is included in the export. Course acceptance is tracked in the parent MEGA.dev workspace; publishing this repository alone does not establish a solve.
