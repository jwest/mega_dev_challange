<script>
  const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
  const path = location.pathname.replace(/\/$/, '') || '/kb';
  const page = pages[`/src/routes${path}/+page.svx`] ?? pages['/src/routes/kb/+page.svx'];
  const Page = page.default;
</script>

<Page />
