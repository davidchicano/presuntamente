// Stub del módulo virtual `astro:content` para los tests (ver vitest.config.ts).
// `src/lib/api.ts` importa `getCollection` y el tipo `CollectionEntry`; los tests
// que ejercen `buildApiContext` pasan las colecciones a mano, así que
// `getCollection` no se invoca: basta con que el import resuelva.
export const getCollection = async (_collection: string): Promise<unknown[]> => [];
export type CollectionEntry<_T extends string = string> = {
  id: string;
  collection: string;
  data: Record<string, unknown> & { id?: string };
};
