// API v1 · volcado completo del inventario público — /api/v1/dump.json
//
// TODO el inventario público en un solo fichero (casos, personas,
// organizaciones, delitos y relaciones, todos en su forma de detalle). Es la vía
// OPT-IN para investigación (D3): no es la ruta por defecto — para uso normal,
// índice + detalle bajo demanda. Mismo gate de visibilidad (D8).

import type { APIRoute } from 'astro';
import { apiMeta, atribucionIndice, buildApiContext, jsonResponse, loadApiInput, SITE } from '@/lib/api';

export const prerender = true;

export const GET: APIRoute = async () => {
  const ctx = buildApiContext(await loadApiInput());
  return jsonResponse(ctx.dump(), apiMeta(`${SITE}/api/v1/dump.json`, atribucionIndice()));
};
