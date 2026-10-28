import fs from 'node:fs';

const path = new URL('./rendered.html', import.meta.url);
let html = fs.readFileSync(path, 'utf8');
if (html.startsWith('"')) html = JSON.parse(html);
html = html.replace(/ data-vite-dev-id="[^"]*"/g, '');
html = html.split('\n').map(line => line.trimEnd()).join('\n');
if (!html.startsWith('<!doctype html>') || !html.includes('desk ref') || !html.includes('DR-MEAS-T81M')) throw Error('Rendered page or signature missing');
fs.writeFileSync(path, html);
console.log('Saved real rendered HTML with computed tables, timeline, styling and desk ref.');
