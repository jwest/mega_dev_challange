import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const absolute = (path) => fileURLToPath(new URL(path, import.meta.url));
const common = () => ({
  configFile: false,
  root,
  resolve: { alias: { '#lib': absolute('./src/lib') } },
  plugins: [svelte({
    extensions: ['.svelte', '.svx'],
    emitCss: false,
    compilerOptions: { css: 'injected' },
    preprocess: mdsvex({
      extensions: ['.svx'],
      layout: { runbook: absolute('./src/lib/layouts/runbook.svelte') },
    }),
  })],
});

await build({
  ...common(),
  build: {
    ssr: absolute('./src/static-server.js'),
    outDir: absolute('./.static-build'),
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'server.mjs' } },
  },
});

const client = await build({
  ...common(),
  build: {
    write: false,
    lib: { entry: absolute('./src/static-client.js'), formats: ['iife'], name: 'SupportKb' },
  },
});
const clientBundle = Array.isArray(client) ? client[0] : client;
const script = clientBundle.output.find((entry) => entry.type === 'chunk' && entry.isEntry).code;
const { renderPages } = await import('./.static-build/server.mjs');
const pages = renderPages();
const filenames = new Map(pages.map(({ route }) => [
  route, route === '/kb' ? 'index.html' : `${route.slice('/kb/'.length)}.html`,
]));

for (const page of pages) {
  const filename = filenames.get(page.route);
  const body = page.body.replace(/href="(\/kb(?:\/[^"?#]*)?)([?#][^"]*)?"/g, (_, route, suffix = '') => {
    const destination = filenames.get(route.replace(/\/$/, ''));
    if (!destination) throw new Error(`Unknown KB link on ${page.route}: ${route}`);
    return `href="${posix.relative(posix.dirname(filename), destination)}${suffix}"`;
  });
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">${page.head}</head>
<body>${body}${body.includes('data-dedupe-explorer') ? `<script>${script.replace(/<\/script/gi, '<\\/script')}</script>` : ''}</body>
</html>
`;
  const output = absolute(`./site/${filename}`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
  console.log(`Static page: site/${filename}`);
}

// GitHub Pages should serve the generated files without a Jekyll processing step.
await writeFile(absolute('./site/.nojekyll'), '');
