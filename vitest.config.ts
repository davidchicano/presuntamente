import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Config de los tests (vitest). Los tests de la API viven en `tests/`.
//
// - Alias `@` → `src/` (igual que tsconfig) para importar `@/lib/api`.
// - Alias `astro:content` → un stub: `src/lib/api.ts` importa `getCollection`
//   y el tipo `CollectionEntry` del módulo virtual de Astro, que sólo existe
//   dentro del build de Astro. `buildApiContext` (lo que testeamos) NO llama a
//   `getCollection` —recibe las colecciones ya cargadas—, así que el stub sólo
//   necesita satisfacer el import.
// - `mode: 'production'` para que `import.meta.env.PROD` sea true / `DEV` false:
//   así el gate de visibilidad (`src/lib/visibilidad.ts`) se comporta como en el
//   build de producción (sólo casos beta+), que es el contrato que queremos fijar.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'astro:content': fileURLToPath(new URL('./tests/stubs/astro-content.ts', import.meta.url)),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    // `tests/setup.ts` fuerza `import.meta.env.PROD`/`DEV` (gate de producción)
    // vía `vi.stubEnv` (se lee en runtime, así que el stub surte efecto).
    setupFiles: ['./tests/setup.ts'],
  },
});
