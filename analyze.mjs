import fs from 'node:fs';
import { uniqueById, groupByCause } from './src/lib/kb/causes.ts';

const base = new URL('./src/lib/data/', import.meta.url);
const raw = JSON.parse(fs.readFileSync(new URL('reports-4471.json', base)));
const reports = uniqueById(raw).filter(r => r.mergedInto === 4471);
const tenants = fs.readdirSync(new URL('tenants/', base)).map(name =>
  JSON.parse(fs.readFileSync(new URL(`tenants/${name}`, base))));
const notes = JSON.parse(fs.readFileSync(new URL('desk-notes.json', base)));
const byHandle = new Map(tenants.map(t => [t.handle, t]));
const groups = groupByCause(reports, r => byHandle.get(r.tenant));
const weekly = {};
for (const r of reports) {
  for (const [field, key] of [['receivedAt', 'received'], ['mergedAt', 'merged']]) {
    if (!r[field]) continue;
    const day = new Date(r[field].slice(0, 10));
    day.setUTCDate(day.getUTCDate() - (day.getUTCDay() + 6) % 7);
    const week = day.toISOString().slice(0, 10);
    weekly[week] ??= { received: 0, merged: 0 };
    weekly[week][key]++;
  }
}
const result = {
  source: 'kb-export-267efc5e.zip, exported 2026-10-04',
  rawRows: raw.length,
  uniqueReports: reports.length,
  duplicateRows: raw.length - reports.length,
  groups: groups.map(({ reports: rs, ...g }) => ({ ...g, count: rs.length, ids: rs.map(r => r.id) })),
  exceptions: reports.filter(r => notes.oneDayMove.includes(r.id)),
  weekly: Object.fromEntries(Object.entries(weekly).sort()),
};
if (process.argv.includes('--save')) fs.writeFileSync(new URL('./analysis.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ ...result, groups: result.groups.map(({ids,...g})=>g) }, null, 2));
