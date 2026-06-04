// API v1 · ficha completa de una organización — /api/v1/organizaciones/<slug>.json
//
// Datos de la organización (incluido `cif` cuando se ha verificado en registro
// oficial) + casos relacionados (afectación/papel procesal) + roles procesales
// si los tiene + vínculos institucionales. Sólo organizaciones enlazadas a un
// caso visible (D8).

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
  const input = await loadApiInput();
  const ctx = buildApiContext(input);
  return input.organizaciones
    .filter((o) => ctx.orgVisible(o.data.id))
    .map((o) => ({ params: { slug: o.data.id } }));
};

export const GET: APIRoute = async ({ params }) => {
  const input = await loadApiInput();
  const ctx = buildApiContext(input);
  const org = input.organizaciones.find((o) => o.data.id === params.slug);
  if (!org) return new Response('Not found', { status: 404 });
  const datos = ctx.orgDetail(org);
  if (!datos) return new Response('Not found', { status: 404 });
  return jsonResponse(
    datos,
    apiMeta(`${SITE}/organizaciones/${org.data.id}`, atribucionFicha(org.data.nombre)),
  );
};
