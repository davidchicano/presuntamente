// API v1 · descriptor del dataset — /api/v1/datapackage.json
//
// Descriptor estándar Frictionless Data (https://frictionlessdata.io/) del
// dataset abierto. Lo consumen herramientas Frictionless, portales de datos
// abiertos y validadores; por eso NO va envuelto en el sobre `meta`/`datos`:
// es el descriptor crudo que el estándar espera. La forma de cada recurso vive
// en los JSON Schema de /schemas/. Contrato: docs/api/README.md.

import type { APIRoute } from 'astro';
import { API_VERSION, buildApiContext, LICENCIA, loadApiInput, SITE } from '@/lib/api';
import { buildDate } from '@/lib/build-info';

export const prerender = true;

export const GET: APIRoute = async () => {
  const ctx = buildApiContext(await loadApiInput());
  const nCasos = ctx.casosVisibles.length;

  const base = `${SITE}/api/${API_VERSION}`;

  const datapackage = {
    name: 'presuntamente-inventario',
    title: 'presuntamente · Inventario de casos de corrupción en España',
    description:
      'Datos abiertos machine-readable del inventario público de casos de corrupción relevantes en España. ' +
      'El inventario es un grafo de tres nodos (Caso, Persona, Organización) unidos por aristas (rol procesal, ' +
      'vínculo institucional, relación entre casos, afectación). Imputación no es condena: cada hecho conserva su ' +
      'nivel de fuente (1-4) y cada rol procesal su tipo discreto y su trayectoria temporal. Sólo se incluyen casos ' +
      'en estado público (beta_publica o superior).',
    homepage: SITE,
    version: API_VERSION,
    created: buildDate,
    licenses: [
      {
        name: 'CC-BY-SA-4.0',
        title: 'Creative Commons Attribution-ShareAlike 4.0 International',
        path: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    ],
    keywords: ['corrupción', 'España', 'transparencia', 'judicial', 'datos abiertos', 'open data'],
    sources: [
      {
        title: 'presuntamente.org — repositorio público (AGPL-3.0 código · CC BY-SA 4.0 contenido)',
        path: 'https://github.com/davidchicano/presuntamente',
      },
    ],
    profile: 'data-package',
    resources: [
      {
        name: 'casos-indice',
        title: 'Índice de casos públicos',
        description:
          'Fila ligera por caso con campos de filtrado, organizaciones afectadas (con CIF inline) y personas clave. ' +
          `Cubre ${nCasos} casos públicos. Para la ficha completa, /api/${API_VERSION}/casos/<id>.json.`,
        path: `${base}/casos.json`,
        format: 'json',
        mediatype: 'application/json',
      },
      {
        name: 'personas-indice',
        title: 'Índice de personas con rol en casos públicos',
        description:
          'Fila por persona enlazada a un caso visible, con los casos donde tiene rol procesal (arista persona→caso).',
        path: `${base}/personas.json`,
        format: 'json',
        mediatype: 'application/json',
      },
      {
        name: 'organizaciones-indice',
        title: 'Índice de organizaciones',
        description:
          'Fila por organización con su CIF (cuando está verificado en registro oficial) y sus casos relacionados ' +
          '(arista inversa organización→casos). Permite ir de una lista de CIF a casos sin hacer join.',
        path: `${base}/organizaciones.json`,
        format: 'json',
        mediatype: 'application/json',
      },
      {
        name: 'dump',
        title: 'Volcado completo del inventario público',
        description:
          'Todo el inventario público (casos, personas, organizaciones, delitos y relaciones en forma de detalle) ' +
          'en un solo fichero. Opt-in para investigación; para uso normal, índice + detalle bajo demanda.',
        path: `${base}/dump.json`,
        format: 'json',
        mediatype: 'application/json',
      },
    ],
    _endpoints_parametricos: {
      descripcion:
        'Recursos parametrizados por slug (no enumerables como recurso único Frictionless). Los slugs disponibles ' +
        'salen de los índices correspondientes.',
      caso_detalle: `${base}/casos/{slug}.json`,
      persona_detalle: `${base}/personas/{slug}.json`,
      organizacion_detalle: `${base}/organizaciones/{slug}.json`,
      partido_slice: `${base}/partido/{slug}.json`,
    },
    _schemas: {
      descripcion:
        'La forma de cada entidad vive en los JSON Schema del repositorio; sus campos `description` son la documentación.',
      base: 'https://github.com/davidchicano/presuntamente/tree/main/schemas',
      entidades: [
        'caso.schema.json',
        'persona.schema.json',
        'organizacion.schema.json',
        'hecho.schema.json',
        'hito.schema.json',
        'rol-en-caso.schema.json',
        'documento.schema.json',
        'vinculo-institucional.schema.json',
        'relacion-entre-casos.schema.json',
        'delito.schema.json',
      ],
    },
    _aviso:
      'Imputación no es condena. No afirmar culpabilidad sin sentencia firme. Mostrar siempre el nivel de fuente de cada hecho y el tipo de rol procesal.',
    _licencia: LICENCIA,
  };

  return new Response(JSON.stringify(datapackage, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
