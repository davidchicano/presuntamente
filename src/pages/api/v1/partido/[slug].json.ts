// API v1 · slice por partido — /api/v1/partido/<slug>.json
//
// Casos que afectan a un partido, como PROYECCIÓN de la afectación
// directa/indirecta ya modelada (doc 08). Cada inclusión arrastra su
// `nivel_afectacion`, su `naturaleza` y su `justificacion_afectacion`: no es una
// inferencia nueva. NO se publican agregados ni rankings por partido — contar
// sería un acto editorial, no un dato (decisión D4). Patrón slice (D3).

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
  return ctx.partidosConAfectacion().map((o) => ({ params: { slug: o.data.id } }));
};

export const GET: APIRoute = async ({ params }) => {
  const ctx = buildApiContext(await loadApiInput());
  const partido = ctx.partidosConAfectacion().find((o) => o.data.id === params.slug);
  if (!partido) return new Response('Not found', { status: 404 });
  const datos = ctx.partidoSlice(partido);
  return jsonResponse(
    datos,
    apiMeta(`${SITE}/organizaciones/${partido.data.id}`, atribucionFicha(partido.data.nombre)),
  );
};
