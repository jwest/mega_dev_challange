<script>
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById } from '#lib/kb/causes';
  const exceptions = uniqueById(reports).filter(r => notes.oneDayMove.includes(r.id));
</script>

<p><strong>{exceptions.length}</strong> reports need individual investigation. They remain included in the parser routing total above, not added to it.</p>
<table>
  <thead><tr><th>report</th><th>received</th><th>tenant</th><th>reporter's words</th></tr></thead>
  <tbody>{#each exceptions as r (r.id)}<tr><td>{r.id}</td><td>{r.receivedAt.slice(0,10)}</td><td>{r.tenant}</td><td>{r.body}</td></tr>{/each}</tbody>
</table>
