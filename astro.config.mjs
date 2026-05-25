import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// presuntamente — configuración Astro
// Decisiones de arquitectura: ver docs/diseno/05-arquitectura-tecnica.md
// i18n nativo de Astro se activa en una fase posterior; mientras tanto, la estructura
// /src/pages/cat/ existe como carpeta paralela vacía. Ver AGENTS.md §"I18n".

export default defineConfig({
  site: 'https://presuntamente.org',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap(),
  ],
});
