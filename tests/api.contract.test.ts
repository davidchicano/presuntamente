// Tests de CONTRATO sobre la API ya construida (`dist/api/**`).
//
// A diferencia de los unit tests (lógica con fixtures), éstos leen los JSON reales
// que sirve el CDN y verifican las invariantes que un consumidor da por hechas:
// sobre meta, integridad referencial índice↔detalle, 0 fugas internas, 0 contenido
// retractado, CIF con dígito de control válido y aristas bidireccionales coherentes.
//
// Requieren un build previo (`pnpm build` o `pnpm build:no-index`). Si no hay
// `dist/`, la suite se SALTA con un aviso (en CI el build corre antes; ver
// .github/workflows/validate.yml). Para correrlos en local: `pnpm test:api`.
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { validCIF } from './helpers';

const API = 'dist/api/v1';
const built = existsSync(join(API, 'casos.json'));

const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const slugsIn = (dir: string) =>
  existsSync(join(API, dir))
    ? readdirSync(join(API, dir)).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
    : [];

// `describe.skip` igualmente EJECUTA el cuerpo del describe al colectar; por eso
// las lecturas de disco van en `beforeAll` (que NO corre en suites saltadas), no
// en el top del bloque: así el skip no intenta leer un `dist/` inexistente.
const suite = built ? describe : describe.skip;
if (!built) {
  console.warn('\n[contract] dist/api no encontrado: tests de contrato SALTADOS. Corre `pnpm build` (o `pnpm test:api`).\n');
}

suite('contrato API sobre dist/api', () => {
  let casosIdx: { datos: any[] };
  let personasIdx: { datos: any[] };
  let orgsIdx: { datos: any[] };
  let casoSlugs: string[];
  let personaSlugs: Set<string>;
  let orgSlugs: Set<string>;
  let casoSlugSet: Set<string>;

  beforeAll(() => {
    casosIdx = readJson(join(API, 'casos.json'));
    personasIdx = readJson(join(API, 'personas.json'));
    orgsIdx = readJson(join(API, 'organizaciones.json'));
    casoSlugs = slugsIn('casos');
    personaSlugs = new Set(slugsIn('personas'));
    orgSlugs = new Set(slugsIn('organizaciones'));
    casoSlugSet = new Set(casoSlugs);
  });

  it('todos los ficheros bajo dist/api son JSON válido', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(join(dir, d.name)) : join(dir, d.name),
      );
    for (const f of walk('dist/api').filter((f) => f.endsWith('.json'))) {
      expect(() => readJson(f), f).not.toThrow();
    }
  });

  it('cada respuesta lleva sobre meta válido (salvo datapackage)', () => {
    for (const name of ['casos.json', 'personas.json', 'organizaciones.json', 'dump.json']) {
      const j = readJson(join(API, name));
      expect(j.meta, name).toBeTruthy();
      expect(j.meta.version).toBe('v1');
      expect(j.meta.licencia).toContain('CC BY-SA');
      expect(j.meta.aviso.toLowerCase()).toContain('imputación');
      expect(j).toHaveProperty('datos');
    }
  });

  it('índice de casos ↔ ficheros de detalle (conteo y existencia)', () => {
    const idxIds = casosIdx.datos.map((c: { id: string }) => c.id).sort();
    expect(idxIds).toEqual([...casoSlugs].sort());
    for (const c of casosIdx.datos) {
      expect(existsSync(join(API, 'casos', `${c.id}.json`)), c.id).toBe(true);
    }
  });

  it('integridad referencial del índice de casos', () => {
    for (const c of casosIdx.datos) {
      expect(orgSlugs.has(c.organo_judicial_id), `organo ${c.organo_judicial_id} de ${c.id}`).toBe(true);
      for (const p of c.personas_clave) {
        expect(personaSlugs.has(p), `persona_clave ${p} de ${c.id}`).toBe(true);
      }
      for (const o of c.organizaciones_afectadas) {
        expect(orgSlugs.has(o.id), `org afectada ${o.id} de ${c.id}`).toBe(true);
      }
    }
  });

  it('integridad referencial de personas y organizaciones', () => {
    for (const p of personasIdx.datos) {
      expect(personaSlugs.has(p.id), `persona ${p.id}`).toBe(true);
      for (const c of p.casos) expect(casoSlugSet.has(c.id), `caso ${c.id} de persona ${p.id}`).toBe(true);
    }
    for (const o of orgsIdx.datos) {
      expect(orgSlugs.has(o.id), `org ${o.id}`).toBe(true);
      for (const c of o.casos_relacionados) expect(casoSlugSet.has(c.id), `caso ${c.id} de org ${o.id}`).toBe(true);
    }
  });

  it('ningún fichero filtra el campo interno promocion_propuesta', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(join(dir, d.name)) : join(dir, d.name),
      );
    for (const f of walk('dist/api')) {
      expect(readFileSync(f, 'utf8').includes('promocion_propuesta'), f).toBe(false);
    }
  });

  it('ningún detalle de caso incluye un hecho retractado', () => {
    for (const slug of casoSlugs) {
      const c = readJson(join(API, 'casos', `${slug}.json`));
      for (const h of c.datos.hechos ?? []) {
        expect(h.vigencia, `${slug}/${h.id}`).not.toBe('retirado');
        expect(['retirado_temporalmente', 'retirado_definitivamente'], `${slug}/${h.id}`).not.toContain(h.estado_publicacion);
      }
    }
  });

  it('todo CIF emitido tiene dígito de control válido', () => {
    for (const o of orgsIdx.datos) {
      if (o.cif) expect(validCIF(o.cif), `org ${o.id} cif ${o.cif}`).toBe(true);
    }
    for (const c of casosIdx.datos) {
      for (const o of c.organizaciones_afectadas) {
        if (o.cif) expect(validCIF(o.cif), `inline ${o.id} cif ${o.cif}`).toBe(true);
      }
    }
  });

  it('aristas bidireccionales coherentes (caso→org ⟺ org→caso)', () => {
    const orgById = new Map(orgsIdx.datos.map((o: { id: string }) => [o.id, o]));
    for (const c of casosIdx.datos) {
      for (const o of c.organizaciones_afectadas) {
        const org = orgById.get(o.id) as { casos_relacionados: { id: string; naturaleza: string }[] } | undefined;
        expect(org, `org afectada ${o.id} en índice`).toBeTruthy();
        const match = org!.casos_relacionados.find((r) => r.id === c.id && r.naturaleza === o.naturaleza);
        expect(match, `arista inversa ${o.id}→${c.id} (${o.naturaleza})`).toBeTruthy();
      }
    }
  });

  it('slices de partido: proyección sin agregados', () => {
    for (const slug of slugsIn('partido')) {
      const s = readJson(join(API, 'partido', `${slug}.json`)).datos;
      expect(s).not.toHaveProperty('total');
      expect(s).not.toHaveProperty('count');
      for (const c of s.casos) {
        expect(['directa', 'indirecta']).toContain(c.nivel_afectacion);
        expect(casoSlugSet.has(c.id)).toBe(true);
      }
    }
  });

  it('datapackage.json es un descriptor Frictionless válido', () => {
    const dp = readJson(join(API, 'datapackage.json'));
    expect(dp.name).toBeTruthy();
    expect(Array.isArray(dp.resources)).toBe(true);
    expect(dp.resources.length).toBeGreaterThan(0);
    expect(dp.licenses?.[0]?.name).toContain('CC-BY-SA');
  });

  it('llms.txt existe y trae el mapa de endpoints y el aviso', () => {
    const txt = readFileSync('dist/llms.txt', 'utf8');
    expect(txt).toContain('/api/v1/');
    expect(txt.toLowerCase()).toContain('imputación no es condena');
  });

  it('dump.json contiene el inventario público completo', () => {
    const d = readJson(join(API, 'dump.json')).datos;
    expect(d.casos.length).toBe(casoSlugs.length);
    expect(Array.isArray(d.personas)).toBe(true);
    expect(Array.isArray(d.organizaciones)).toBe(true);
  });
});
