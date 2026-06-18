#!/usr/bin/env node
/**
 * Validador de YAML del repo contra los JSON Schemas en /schemas/.
 *
 * Carga todos los YAML bajo /content/, identifica la entidad por su path,
 * y valida contra el schema correspondiente.
 *
 * Validaciones cross-entity (V-01..V-21 del doc 01) se irán añadiendo en fases
 * posteriores conforme entre contenido real al repo.
 */

import { readFile } from 'node:fs/promises';
import { glob } from 'glob';
import { parse as parseYaml, parseDocument, visit, Scalar } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

// Mapeo entidad-en-path → schema. La entidad se identifica por:
//   - content/<entidad>/<slug>.yaml                          (entidades planas)
//   - content/casos/<slug>/caso.yaml                         (raíz del caso)
//   - content/casos/<slug>/{hitos,hechos,roles}/<slug>.yaml  (subentidades del caso)
const SCHEMA_FOR_PATH = [
  { match: (p) => p.startsWith('content/casos/') && p.endsWith('/caso.yaml'), schema: 'caso.schema.json' },
  { match: (p) => /^content\/casos\/[^/]+\/hitos\//.test(p) && p.endsWith('.yaml'), schema: 'hito.schema.json' },
  { match: (p) => /^content\/casos\/[^/]+\/hechos\//.test(p) && p.endsWith('.yaml'), schema: 'hecho.schema.json' },
  { match: (p) => /^content\/casos\/[^/]+\/roles\//.test(p) && p.endsWith('.yaml'), schema: 'rol-en-caso.schema.json' },
  { match: (p) => p.startsWith('content/personas/') && p.endsWith('.yaml'), schema: 'persona.schema.json' },
  { match: (p) => p.startsWith('content/organizaciones/') && p.endsWith('.yaml'), schema: 'organizacion.schema.json' },
  { match: (p) => p.startsWith('content/documentos/') && p.endsWith('.yaml'), schema: 'documento.schema.json' },
  { match: (p) => p.startsWith('content/delitos/') && p.endsWith('.yaml'), schema: 'delito.schema.json' },
  { match: (p) => p.startsWith('content/glosario/') && p.endsWith('.yaml'), schema: 'glosario.schema.json' },
  { match: (p) => p.startsWith('content/relaciones-entre-casos/') && p.endsWith('.yaml'), schema: 'relacion-entre-casos.schema.json' },
  { match: (p) => p.startsWith('content/vinculos/') && p.endsWith('.yaml'), schema: 'vinculo-institucional.schema.json' },
  { match: (p) => p.startsWith('content/cobertura-mediatica/') && p.endsWith('.yaml'), schema: 'cobertura-mediatica.schema.json' },
];

const SCHEMA_FILES = [
  'caso.schema.json',
  'persona.schema.json',
  'organizacion.schema.json',
  'documento.schema.json',
  'delito.schema.json',
  'glosario.schema.json',
  'hito.schema.json',
  'hecho.schema.json',
  'rol-en-caso.schema.json',
  'relacion-entre-casos.schema.json',
  'vinculo-institucional.schema.json',
  'cobertura-mediatica.schema.json',
];

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

for (const file of SCHEMA_FILES) {
  const schema = JSON.parse(await readFile(`schemas/${file}`, 'utf-8'));
  ajv.addSchema(schema, file);
}

const files = await glob('content/**/*.yaml');
let errors = 0;
let validated = 0;
let skipped = 0;

for (const filepath of files) {
  if (filepath === 'content/signals.yaml') {
    skipped++;
    continue;
  }

  const entry = SCHEMA_FOR_PATH.find((e) => e.match(filepath));
  if (!entry) {
    console.warn(`⚠️  ${filepath} — sin schema asignado, saltando.`);
    skipped++;
    continue;
  }

  const raw = await readFile(filepath, 'utf-8');
  let data;
  try {
    data = parseYaml(raw);
  } catch (err) {
    errors++;
    console.error(`❌ ${filepath} — YAML inválido: ${err.message}`);
    continue;
  }

  const validateFn = ajv.getSchema(entry.schema);
  const valid = validateFn(data);
  validated++;

  if (!valid) {
    errors++;
    console.error(`❌ ${filepath}`);
    for (const err of validateFn.errors) {
      const path = err.instancePath || '/';
      console.error(`   ${path}: ${err.message}`);
    }
  } else {
    console.log(`✅ ${filepath}`);
  }
}

// --- Cross-check de atribución de importe por sujeto (V-24, V-25) ------------
// Guardarraíl de presunción de inocencia: cada sujeto de importe_atribucion
// debe figurar en personas_implicadas/organizaciones_implicadas (V-24) y su
// papel económico debe ser coherente con importe_clase (V-25). Ver
// docs/diseno/01-modelo-de-datos.md §2.6.
const PAPEL_CLASE = {
  activo: 'objeto',
  beneficiario: 'objeto',
  perjudicado: 'objeto',
  obligado: 'consecuencia',
  acreedor: 'consecuencia',
};
const hechoFiles = await glob('content/casos/*/hechos/*.yaml');
for (const filepath of hechoFiles) {
  let data;
  try {
    data = parseYaml(await readFile(filepath, 'utf-8'));
  } catch {
    continue; // ya reportado arriba
  }
  if (!Array.isArray(data?.importe_atribucion)) continue;
  const personas = new Set(data.personas_implicadas ?? []);
  const orgs = new Set(data.organizaciones_implicadas ?? []);
  for (const a of data.importe_atribucion) {
    const universo = a.sujeto_tipo === 'persona' ? personas : orgs;
    if (!universo.has(a.sujeto)) {
      errors++;
      console.error(
        `❌ ${filepath}\n   importe_atribucion: "${a.sujeto}" (${a.sujeto_tipo}) no está en ${a.sujeto_tipo === 'persona' ? 'personas_implicadas' : 'organizaciones_implicadas'} (V-24).`,
      );
    }
    if (data.importe_clase && PAPEL_CLASE[a.papel] !== data.importe_clase) {
      errors++;
      console.error(
        `❌ ${filepath}\n   importe_atribucion: papel "${a.papel}" (clase ${PAPEL_CLASE[a.papel]}) incoherente con importe_clase "${data.importe_clase}" (V-25).`,
      );
    }
  }
}

// --- V-27: contenido no modelado no puede crear enlaces manuales a personas --
// P-11 exige que las menciones paraprocesales no creen entidad, rol, nodo ni
// badge. El render excluye auto-enlaces a personas sin rol en el caso, pero el
// escape hatch explícito de RichProse (`[[persona:slug|label]]`) saltaría ese
// guardarraíl. En `contenido_no_modelado.texto` queda prohibido.
const casoFiles = await glob('content/casos/*/caso.yaml');
for (const filepath of casoFiles) {
  let data;
  try {
    data = parseYaml(await readFile(filepath, 'utf-8'));
  } catch {
    continue; // ya reportado arriba
  }
  for (const item of data?.contenido_no_modelado ?? []) {
    if (typeof item?.texto !== 'string') continue;
    const match = item.texto.match(/\[\[\s*persona\s*:/i);
    if (!match) continue;
    errors++;
    console.error(
      `❌ ${filepath}\n   V-27: contenido_no_modelado "${item.id ?? '(sin id)'}" usa un enlace manual [[persona:...]].\n        P-11 exige que la mención viva sólo como prosa: elimina el escape hatch y deja el nombre como texto plano.`,
    );
  }
}

// --- V-26: comentarios internos no deben filtrarse en valores escalares ------
// En YAML, un '#' dentro de un bloque escalar (| / >) o al inicio de un valor
// citado NO es comentario, es texto literal → se renderiza en el sitio público.
// Dos vectores, ambos cubiertos:
//   (a) bloques '|' (literal) y '>' (folded): se inspecciona el SOURCE CRUDO del
//       nodo. Imprescindible para folded: los saltos de línea se pliegan a
//       espacios y un '# comentario' acabaría a mitad de frase en el valor
//       parseado, donde un check "la línea empieza por #" no lo vería.
//   (b) escalares plain/citados: el valor parseado no puede tener una línea que
//       (tras trim) empiece por '#' (p. ej. notas: "# LLM-incierto …").
// Los comentarios legítimos van a nivel de mapping (columna 0) o a NOTES.md.
// Ver docs/diseno/01-modelo-de-datos.md §4 (V-26).
function reportarV26(filepath, linea) {
  errors++;
  console.error(
    `❌ ${filepath}\n   V-26: comentario interno filtrado dentro de un valor escalar: "${linea.trim().slice(0, 80)}".\n        Muévelo a NOTES.md (o a columna 0 como comentario real); dentro de un bloque "|"/">" se renderiza en el sitio.`,
  );
}
for (const filepath of files) {
  if (filepath === 'content/signals.yaml') continue;
  const src = await readFile(filepath, 'utf-8');
  let doc;
  try {
    doc = parseDocument(src);
  } catch {
    continue; // YAML inválido ya reportado en el bucle de schema
  }
  visit(doc, {
    Scalar(_key, node) {
      const esBloque =
        node.type === Scalar.BLOCK_LITERAL || node.type === Scalar.BLOCK_FOLDED;
      if (esBloque && node.range) {
        // (a) bloque | o > : inspeccionar el source crudo del nodo
        for (const linea of src.slice(node.range[0], node.range[2]).split('\n')) {
          if (linea.trim().startsWith('#')) reportarV26(filepath, linea);
        }
        return;
      }
      // (b) plain/citado: valor parseado
      if (typeof node.value === 'string' && node.value.includes('#')) {
        for (const linea of node.value.split('\n')) {
          if (linea.trim().startsWith('#')) reportarV26(filepath, linea);
        }
      }
    },
  });
}

console.log(
  `\nResumen: ${validated} validado(s), ${skipped} saltado(s), ${errors} con errores.`
);
process.exit(errors > 0 ? 1 : 0);
