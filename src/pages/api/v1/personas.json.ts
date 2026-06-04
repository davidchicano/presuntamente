// API v1 · índice de personas con rol en casos públicos — /api/v1/personas.json
//
// Una fila por persona enlazada a un caso visible, con los casos donde tiene
// rol (arista persona→caso del grafo, D2). Patrón índice (D3).

import type { APIRoute } from 'astro';
import { apiMeta, atribucionIndice, buildApiContext, jsonResponse, loadApiInput, SITE } from '@/lib/api';

export const prerender = true;

export const GET: APIRoute = async () => {
  const input = await loadApiInput();
  const ctx = buildApiContext(input);
  const datos = input.personas
    .map((p) => ctx.personaIndexRow(p))
    .filter((row): row is NonNullable<typeof row> => Boolean(row))
    .sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo, 'es'));
  return jsonResponse(datos, apiMeta(`${SITE}/api/v1/personas.json`, atribucionIndice()));
};
