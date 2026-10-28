## Problem

The shared parser always reads dates month first. Day-first tenants enter dates in their own convention, so day and month swap. Example: Harbour Dental report R-41200 says 7 April became 4 July.

## Reports covered

**379 unique reports** routed to `parser` in source ticket #4471; 11 tenants; received 2026-04-01 through 2026-10-04. These include 356 intake-tagged parser and 23 intake-tagged hint. Intake tags are browser-based guesses and do not determine the cause.

The export contains 427 rows but 412 unique report IDs. After deduplication, 379 parser + 33 hint = 412. Do not count overlapping export rows twice.

Five of the 379 parser-routed reports contradict a simple day/month swap and require investigation: R-41202, R-41209, R-41236, R-41344, R-41620. Preserve their words and original timestamps; this is a routing total, not proof that all 379 have the same root cause. One-day moves, an invite arriving before booking, and different days in Lisbon and Toronto must not be hidden. Do not invent a confirmed timezone cause.

## Expected outcome

Parse dates according to the tenant's declared convention; verify the booking-to-invite round trip across day-first locales and channels. Separate the booking-v3 form-hint defect into its own issue. Investigate contradictory report bodies before declaring resolution.

## Evidence

Source: kb-export-267efc5e.zip (2026-10-04); `src/lib/kb/causes.ts` (`dayFirst`, `causeOf`, `uniqueById`, `groupByCause`), tenant files, `src/lib/data/reports-4471.json`, and `desk-notes.json`. Reproduce with `node --experimental-strip-types analyze.mjs`; `analysis.json` contains exact report IDs.

Reports arrived from April; the July merge spike is backlog processing, not the beginning of the incident. New reports continue afterward. Update counts when new evidence arrives.
