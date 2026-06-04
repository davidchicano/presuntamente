// API v1 · ficha completa de una persona — /api/v1/personas/<slug>.json
//
// Datos de la persona + sus casos con roles procesales (trayectoria) + vínculos
// institucionales documentados. Sólo personas enlazadas a un caso visible (D8).

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
  return input.personas
    .filter((p) => ctx.personaVisible(p.data.id))
    .map((p) => ({ params: { slug: p.data.id } }));
};

export const GET: APIRoute = async ({ params }) => {
  const input = await loadApiInput();
  const ctx = buildApiContext(input);
  const persona = input.personas.find((p) => p.data.id === params.slug);
  if (!persona) return new Response('Not found', { status: 404 });
  const datos = ctx.personaDetail(persona);
  if (!datos) return new Response('Not found', { status: 404 });
  return jsonResponse(
    datos,
    apiMeta(`${SITE}/personas/${persona.data.id}`, atribucionFicha(persona.data.nombre_completo)),
  );
};
