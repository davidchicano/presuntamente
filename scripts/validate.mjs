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
import { parse as parseYaml } from 'yaml';
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
  { match: (p) => p.startsWith('content/relaciones-entre-casos/') && p.endsWith('.yaml'), schema: 'relacion-entre-casos.schema.json' },
];

const SCHEMA_FILES = [
  'caso.schema.json',
  'persona.schema.json',
  'organizacion.schema.json',
  'documento.schema.json',
  'delito.schema.json',
  'hito.schema.json',
  'hecho.schema.json',
  'rol-en-caso.schema.json',
  'relacion-entre-casos.schema.json',
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

console.log(
  `\nResumen: ${validated} validado(s), ${skipped} saltado(s), ${errors} con errores.`
);
process.exit(errors > 0 ? 1 : 0);
