#!/usr/bin/env node
/*
 * Ejemplo de consumo de la API de datos abiertos de presuntamente.org.
 * Sin SDK, sin dependencias: Node puro (>=18). Demuestra los tres casos de uso
 * principales del contrato (docs/api/README.md) y cómo respetar la presunción
 * de inocencia al renderizar.
 *
 * USO:
 *   # Contra los ficheros locales ya construidos (necesita `pnpm build` antes):
 *   node docs/api/ejemplos/consumir-api.mjs
 *
 *   # Contra la API desplegada (o un `astro preview` local):
 *   API_BASE=https://presuntamente.org node docs/api/ejemplos/consumir-api.mjs
 *   API_BASE=http://localhost:4321      node docs/api/ejemplos/consumir-api.mjs
 *
 * La ÚNICA diferencia entre integrar "en serio" y este ejemplo es la función
 * get(): contra la API real es un `fetch`; en local lee el fichero de dist/.
 */
import { readFileSync } from 'node:fs';

const BASE = process.env.API_BASE ?? null; // null => leer dist/api local
const LOCAL_DIR = 'dist/api/v1';

/** Devuelve el JSON de una ruta tipo '/api/v1/casos.json'. */
async function get(route) {
  if (BASE) {
    const res = await fetch(BASE + route);
    if (!res.ok) throw new Error(`${res.status} en ${route}`);
    return res.json();
  }
  try {
    return JSON.parse(readFileSync(route.replace('/api/v1', LOCAL_DIR), 'utf8'));
  } catch {
    console.error(
      `\nNo encuentro ${route} en local. Ejecuta primero \`pnpm build\` (o usa API_BASE=<url>).\n`,
    );
    process.exit(1);
  }
}

const eur = (n) =>
  n == null ? '—' : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const h1 = (t) => console.log(`\n\x1b[1m${t}\x1b[0m`);

// =============================================================================
// 1) Índice de casos: el cliente descarga UNA fila por caso y filtra en su lado.
// =============================================================================
h1('1) Casos públicos (índice ligero)');
const casos = await get('/api/v1/casos.json');
console.log(`   licencia: ${casos.meta.licencia} · versión: ${casos.meta.version} · generado: ${casos.meta.generado}`);
for (const c of casos.datos) {
  console.log(`   · ${c.nombre_mediatico.padEnd(26)} ${String(c.fase_actual).padEnd(22)} importe: ${eur(c.importe_atribuido)}`);
}

// =============================================================================
// 2) Caso de uso de Menjòmetre: "tengo una lista de CIF, dame los casos".
//    Se resuelve con UN solo fichero (organizaciones.json), sin join.
// =============================================================================
h1('2) De una lista de CIF a casos (sin join, un solo fichero)');
const misCIF = new Set(['G28570927', 'A28019206']); // Partido Popular, Ferrovial Agromán
const orgs = await get('/api/v1/organizaciones.json');
for (const o of orgs.datos.filter((o) => misCIF.has(o.cif))) {
  console.log(`   ${o.nombre} (CIF ${o.cif}):`);
  for (const c of o.casos_relacionados) {
    const nivel = c.nivel_afectacion ? ` [${c.nivel_afectacion}]` : '';
    console.log(`       → ${c.id} · ${c.naturaleza}${nivel}`);
  }
}

// =============================================================================
// 3) Ficha de un caso RESPETANDO la presunción de inocencia.
//    Los roles llevan su tipo procesal discreto; los hechos, su nivel de fuente.
// =============================================================================
const slug = casos.datos[0].id;
h1(`3) Ficha de "${slug}" con guardarraíles editoriales`);
const caso = (await get(`/api/v1/casos/${slug}.json`)).datos;

const ACUSACION = new Set(['investigado', 'procesado', 'acusado', 'condenado_no_firme']);
console.log('   Personas con rol procesal (NB: imputación ≠ condena):');
for (const p of caso.personas) {
  // Regla de oro: NUNCA "X es corrupto". Mostrar el rol discreto tal cual.
  const aviso = p.roles.some((r) => ACUSACION.has(r))
    ? '  ⚠ procedimiento abierto, sin condena firme'
    : p.roles.includes('condenado_firme')
      ? '  ✓ condena firme'
      : '';
  console.log(`   · ${p.nombre_completo.padEnd(28)} ${p.roles.join(', ')}${aviso}`);
}

console.log('\n   Hechos (cada uno con su estado epistémico y nivel de fuente 1-4):');
for (const h of caso.hechos.slice(0, 6)) {
  const probado = h.tipo === 'acreditado' ? 'PROBADO' : 'NO probado';
  console.log(`   · [N${h.nivel_fuente_efectivo ?? '?'}] (${h.tipo}/${probado}) ${h.enunciado.slice(0, 70)}…`);
}

console.log(`\n   Fuente / atribución: ${caso.url} — ${casos.meta.licencia}`);
console.log('\nHecho. Cambia la fuente con API_BASE=<url> para apuntar a la API desplegada.\n');
