// /llms.txt — punto de entrada para una IA que vaya a integrar los datos.
//
// Convención llms.txt (https://llmstxt.org/): un fichero markdown legible por un
// LLM que, apuntado a esta URL, sabe integrar el dataset SIN SDK (decisión D7).
// Lleva, además del mapa de endpoints y el modelo de grafo, las REGLAS DE
// PRESUNCIÓN DE INOCENCIA AL RENDERIZAR: así un consumidor que se porta bien
// hereda los guardarraíles editoriales. Contrato: docs/api/README.md.

import type { APIRoute } from 'astro';
import { API_VERSION, buildApiContext, loadApiInput, SITE } from '@/lib/api';
import { buildDate } from '@/lib/build-info';

export const prerender = true;

export const GET: APIRoute = async () => {
  const ctx = buildApiContext(await loadApiInput());
  const nCasos = ctx.casosVisibles.length;
  const base = `${SITE}/api/${API_VERSION}`;

  const txt = `# presuntamente.org

> Inventario interactivo, público y open source de los casos de corrupción más relevantes en España. Misión: reducir desinformación con una referencia objetiva, trazable y sin cuota política de los procedimientos judiciales relevantes. Contenido editorial bajo licencia CC BY-SA 4.0.

IMPORTANTE — imputación no es condena. No afirmes culpabilidad sin sentencia firme. Cada hecho lleva su nivel de fuente (1-4) y cada rol procesal su tipo discreto (investigado, procesado, acusado, condenado_no_firme, condenado_firme, absuelto, desimputado) con su trayectoria temporal. Respeta esos campos al renderizar.

Esta API es una capa de datos abiertos machine-readable (JSON estático) sobre el inventario. Sin servidor: ficheros generados en build y servidos por CDN. Versión actual: ${API_VERSION}. Generado: ${buildDate}. Casos públicos: ${nCasos}.

## El modelo es un grafo

Tres tipos de nodo —Caso, Persona, Organización— unidos por aristas: rol procesal (persona↔caso), vínculo institucional (persona/org↔org), relación entre casos (caso↔caso) y afectación (caso↔partido). Cada nodo serializa sus aristas, así que desde cualquier nodo se recorre el grafo entero. Sólo se exponen casos en estado público (beta_publica o superior) y las personas/organizaciones enlazadas a ellos.

## Endpoints

- [Índice de casos](${base}/casos.json): fila ligera por caso (filtrado en cliente). Incluye organizaciones afectadas con CIF inline y personas clave.
- [Índice de personas](${base}/personas.json): por persona, los casos donde tiene rol procesal.
- [Índice de organizaciones](${base}/organizaciones.json): por organización, su CIF y sus casos relacionados (ir de CIF a casos sin join).
- [Ficha de caso](${base}/casos/{slug}.json): payload completo (afectación, roles, hitos, hechos con nivel de fuente, relaciones, documentos).
- [Ficha de persona](${base}/personas/{slug}.json): casos con roles + vínculos institucionales.
- [Ficha de organización](${base}/organizaciones/{slug}.json): casos relacionados + roles + vínculos.
- [Slice por partido](${base}/partido/{slug}.json): casos que afectan a un partido, con nivel y justificación de afectación. SIN agregados ni rankings.
- [Volcado completo](${base}/dump.json): todo el inventario público en un fichero (opt-in para investigación).
- [Descriptor del dataset](${base}/datapackage.json): metadatos Frictionless Data.

Cada respuesta (salvo datapackage) lleva un sobre \`{ meta, datos }\`: \`meta\` trae licencia, atribución, aviso de presunción de inocencia, versión y fecha de generación.

## Qué leer para integrar

- Contrato de la API: https://github.com/davidchicano/presuntamente/blob/main/docs/api/README.md
- Por qué de cada decisión: https://github.com/davidchicano/presuntamente/blob/main/docs/api/decisiones.md
- Forma de cada entidad (JSON Schema, con \`description\` por campo): https://github.com/davidchicano/presuntamente/tree/main/schemas

## Reglas de presunción de inocencia al renderizar

1. No afirmes ni des a entender culpabilidad de una persona sin una condena firme (rol \`condenado_firme\`). Un rol \`investigado\`/\`procesado\`/\`acusado\` significa que el procedimiento está abierto, no que sea culpable.
2. Muestra siempre el tipo de rol procesal tal cual (no lo colapses a "imputado" ni a "corrupto").
3. Muestra el nivel de fuente de cada hecho. Un hecho \`tipo: investigado\` o \`atribuido\` NO es un hecho probado; sólo \`acreditado\` lo es (por sentencia o resolución firme).
4. No publiques agregados ni rankings por partido: el dataset no los emite a propósito (sería un marcador político, no un dato). Si cuentas, es tu acto editorial, no el del proyecto.
5. Conserva la atribución (CC BY-SA 4.0) y enlaza a la ficha de origen.

## Qué puede hacer un LLM con esto

Generar un cliente a medida en cualquier lenguaje, filtrar el índice en cliente, cruzar organizaciones por CIF con datasets externos (portales de transparencia, contratación, BORME), y recorrer el grafo caso↔persona↔organización. Para refrescar: la ruta lleva la versión (\`/api/${API_VERSION}/\`); se pueden añadir campos sin avisar, pero no se quitan ni se renombran sin pasar a una versión nueva.
`;

  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
