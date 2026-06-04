// API v1 · índice de casos públicos — /api/v1/casos.json
//
// Fila ligera por caso (sólo campos de filtrado). El consumidor lo descarga una
// vez, filtra en su lado, y pide el detalle (/api/v1/casos/<slug>.json) de lo
// que abra. Patrón índice (D3). Contrato: docs/api/README.md.

import type { APIRoute } from 'astro';
import { apiMeta, atribucionIndice, buildApiContext, jsonResponse, loadApiInput, SITE } from '@/lib/api';

export const prerender = true;

export const GET: APIRoute = async () => {
  const ctx = buildApiContext(await loadApiInput());
  const datos = ctx.casosVisibles.map((c) => ctx.casoIndexRow(c));
  return jsonResponse(datos, apiMeta(`${SITE}/api/v1/casos.json`, atribucionIndice()));
};
