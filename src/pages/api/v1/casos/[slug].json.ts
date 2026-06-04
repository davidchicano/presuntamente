// API v1 · ficha completa de un caso — /api/v1/casos/<slug>.json
//
// Payload completo del caso (campos editoriales + grafo: organizaciones
// afectadas con CIF, roles procesales discretos con trayectoria, hitos, hechos
// con nivel de fuente, relaciones entre casos, documentos). Patrón detalle (D3).
// El gate de visibilidad (D8) restringe las rutas generadas a casos beta+.

import type { APIRoute, GetStaticPaths } from 'astro';
import {
  apiMeta,
  atribucionFicha,
  buildApiContext,
  jsonResponse,
  loadApiInput,
  SITE,
} from '@/lib/api';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const ctx = buildApiContext(await loadApiInput());
  return ctx.casosVisibles.map((c) => ({ params: { slug: c.id } }));
};

export const GET: APIRoute = async ({ params }) => {
  const ctx = buildApiContext(await loadApiInput());
  const caso = ctx.casosVisibles.find((c) => c.id === params.slug);
  if (!caso) return new Response('Not found', { status: 404 });
  const datos = ctx.casoDetail(caso);
  return jsonResponse(
    datos,
    apiMeta(`${SITE}/casos/${caso.id}`, atribucionFicha(caso.data.nombre_mediatico)),
  );
};
