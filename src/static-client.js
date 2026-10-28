import { mount } from 'svelte';
import DedupeExplorer from './lib/kb/DedupeExplorer.svelte';

// Only the interactive island needs browser JavaScript. The rest stays prerendered.
for (const target of document.querySelectorAll('[data-dedupe-explorer]')) {
  target.replaceChildren();
  mount(DedupeExplorer, { target });
}
