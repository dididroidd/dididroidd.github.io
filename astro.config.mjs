// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://dididroidd.github.io',
  markdown: {
    // Couleurs du code définies dans src/styles/global.css (--astro-code-*).
    shikiConfig: { theme: 'css-variables' },
  },
});
