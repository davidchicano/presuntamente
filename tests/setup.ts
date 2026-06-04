import { vi } from 'vitest';

// Fija el entorno como "producción" para todos los tests: el gate de visibilidad
// (`src/lib/visibilidad.ts`) usa `import.meta.env.DEV` en runtime, así que stubearlo
// aquí hace que `buildApiContext` aplique el gate real (sólo casos beta+), que es el
// contrato que los tests verifican. No se desestuba (no hay `unstubEnvs: true`).
vi.stubEnv('PROD', true);
vi.stubEnv('DEV', false);
