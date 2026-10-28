## Problem

The booking-v3 form prints `MM/DD/YYYY` for day-first tenants, but interprets form input day first. People follow the month-first hint and the resulting date is wrong. This is a separate defect from the shared parser and needs its own fix.

## Reports covered

**33 unique reports** routed to `hint` in source ticket #4471; 3 tenants: Alder Physio (`de-DE`), Copper Studio (`es-ES`) and Pale Harbour (`pt-PT`), all booking-v3. Received 2026-04-17 through 2026-09-22.

Of these, 18 were intake-tagged hint and 15 parser. Intake used browser locale rather than tenant configuration; do not group by intakeTag. Example: R-41230, Copper Studio, form channel, browser en-GB, intake parser, routes to hint because the tenant runs booking-v3 in es-ES.

The source has 427 rows but only 412 unique report IDs. Deduplicate by ID: 33 hint + 379 parser = 412. Exact group membership is in analysis.json.

## Expected outcome

Make the visible date hint agree with the date interpretation for the tenant. Verify form entry and booking-to-invite behavior for booking-v3 day-first tenants, independent of browser locale. Do not assume fixing the shared parser also fixes this hint contract. App/email reports from these same tenants can still belong to the parser issue.

## Evidence

Source: kb-export-267efc5e.zip (2026-10-04); `src/lib/kb/causes.ts`, especially DATE_HINT and causeOf; `src/lib/kb/locales.ts`; tenant directory; `src/lib/data/reports-4471.json`. Reproduce with `node --experimental-strip-types analyze.mjs`. The signed KB decision links both issues and explains the replacement deduplication rule.
