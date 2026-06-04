// API v1 · índice de organizaciones — /api/v1/organizaciones.json
//
// Una fila por organización enlazada a un caso visible, con su `cif` y sus
// `casos_relacionados` (arista inversa organización→casos, D11). Así un
// consumidor con una lista de CIF resuelve los casos SIN tocar /casos.json ni
// hacer join: filtra este índice por sus CIF y lee los casos. Patrón índice (D3).

import type { APIRoute } from 'astro';
import { apiMeta, atribucionIndice, buildApiContext, jsonResponse, loadApiInput, SITE } from '@/lib/api';

export const prerender = true;

export const GET: APIRoute = async () => {
  const input = await loadApiInput();
  const ctx = buildApiContext(input);
  const datos = input.organizaciones
    .map((o) => ctx.orgIndexRow(o))
    .filter((row): row is NonNullable<typeof row> => Boolean(row))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return jsonResponse(datos, apiMeta(`${SITE}/api/v1/organizaciones.json`, atribucionIndice()));
};
