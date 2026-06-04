// Unit tests de los serializadores de la API (`src/lib/api.ts`).
//
// Le pasamos un mini-inventario sintético (tests/fixtures.ts) a `buildApiContext`
// y verificamos las GARANTÍAS del contrato y de la presunción de inocencia, sin
// build ni red. Corre en modo producción (tests/setup.ts), así que el gate de
// visibilidad excluye los casos borrador, igual que en el sitio publicado.
import { describe, it, expect } from 'vitest';
import { buildApiContext, jsonResponse, apiMeta } from '@/lib/api';
import { mkInput } from './fixtures';

const ctx = buildApiContext(mkInput());
const casoA = ctx.casosVisibles.find((c) => c.data.id === 'caso-a')!;
const casoC = ctx.casosVisibles.find((c) => c.data.id === 'caso-c')!;

describe('gate de visibilidad', () => {
  it('sólo expone casos beta_publica+ (excluye borrador)', () => {
    const ids = ctx.casosVisibles.map((c) => c.data.id).sort();
    expect(ids).toEqual(['caso-a', 'caso-c']);
    expect(ctx.casoVisible('caso-b')).toBe(false);
  });

  it('persona/organización sólo presente en un caso borrador NO es visible', () => {
    expect(ctx.personaVisible('p-solo-borrador')).toBe(false);
    expect(ctx.orgVisible('org-solo-borrador')).toBe(false);
    const persona = mkInput().personas.find((p) => p.data.id === 'p-solo-borrador')!;
    expect(ctx.personaIndexRow(persona)).toBeNull();
    expect(ctx.personaDetail(persona)).toBeNull();
    const org = mkInput().organizaciones.find((o) => o.data.id === 'org-solo-borrador')!;
    expect(ctx.orgIndexRow(org)).toBeNull();
    expect(ctx.orgDetail(org)).toBeNull();
  });

  it('entidad en borrador propio pero ligada a caso visible SÍ aparece', () => {
    // p-investigado tiene estado_publicacion borrador pero rol en caso-a (beta).
    expect(ctx.personaVisible('p-investigado')).toBe(true);
    const persona = mkInput().personas.find((p) => p.data.id === 'p-investigado')!;
    expect(ctx.personaIndexRow(persona)).not.toBeNull();
  });
});

describe('guardarraíles editoriales', () => {
  it('no expone el campo interno promocion_propuesta', () => {
    const detail = ctx.casoDetail(casoA);
    expect('promocion_propuesta' in detail).toBe(false);
    expect(JSON.stringify(detail)).not.toContain('promocion_propuesta');
  });

  it('excluye los hechos retractados (vigencia retirado / estado retirado_*)', () => {
    const ids = ctx.casoDetail(casoA).hechos.map((h) => h.id);
    expect(ids).toContain('h1');
    expect(ids).toContain('h3-importe');
    expect(ids).not.toContain('h2-retractado');
    expect(ctx.casoDetail(casoC).hechos.map((h) => h.id)).not.toContain('hc2-retractado');
  });

  it('un vínculo retirado no afecta (no cuenta como afectación)', () => {
    // v-retirado marcaría org-investigada como indirecta además de directa; al
    // estar retirado, sólo debe quedar la directa (entidad_investigada).
    const afect = ctx.casoDetail(casoA).organizaciones_afectadas;
    const inv = afect.directas.find((o) => o.id === 'org-investigada');
    expect(inv?.nivel_afectacion).toBe('directa');
    expect(afect.indirectas.find((o) => o.id === 'org-investigada')).toBeUndefined();
  });

  it('cada Hecho conserva su tipo epistémico y su nivel de fuente', () => {
    const h1 = ctx.casoDetail(casoA).hechos.find((h) => h.id === 'h1')!;
    expect(h1.tipo).toBe('investigado');
    expect(h1.nivel_fuente_efectivo).toBe(2);
  });

  it('cada RolEnCaso conserva su rol discreto y su trayectoria', () => {
    const roles = ctx.casoDetail(casoA).roles;
    const r = roles.find((x) => x.sujeto_id === 'p-investigado')!;
    expect(r.rol).toBe('investigado');
    expect(r.fecha_inicio).toBe('2020-02-01');
    expect(r.activo).toBe(true);
  });
});

describe('grafo y denormalización (D11)', () => {
  it('CIF inline en organizaciones_afectadas del índice de caso', () => {
    const row = ctx.casoIndexRow(casoA);
    const inv = row.organizaciones_afectadas.find((o) => o.id === 'org-investigada')!;
    expect(inv.cif).toBe('B62704887');
    expect(inv.nivel_afectacion).toBe('directa');
    const partido = row.organizaciones_afectadas.find((o) => o.id === 'org-partido')!;
    expect(partido.cif).toBe('G28570927');
    expect(partido.nivel_afectacion).toBe('indirecta');
  });

  it('arista inversa organización→casos (entidad, órgano y querellante)', () => {
    const inputs = mkInput();
    const orgRow = (id: string) =>
      ctx.orgIndexRow(inputs.organizaciones.find((o) => o.data.id === id)!);

    const investigada = orgRow('org-investigada')!;
    expect(investigada.casos_relacionados).toContainEqual({ id: 'caso-a', naturaleza: 'entidad_investigada_en_caso', nivel_afectacion: 'directa' });

    const juzgado = orgRow('org-juzgado')!;
    const naturalezas = juzgado.casos_relacionados.map((c) => c.naturaleza);
    expect(naturalezas).toContain('organo_judicial');

    const querellante = orgRow('org-querellante')!;
    expect(querellante.casos_relacionados).toContainEqual({ id: 'caso-a', naturaleza: 'querellante_inicial' });
  });

  it('arista inversa incluye org implicada por Hecho aunque NO tenga vínculo', () => {
    const inputs = mkInput();
    const org = inputs.organizaciones.find((o) => o.data.id === 'org-implicada-hecho')!;
    expect(ctx.orgVisible('org-implicada-hecho')).toBe(true);
    const row = ctx.orgIndexRow(org)!;
    expect(row.casos_relacionados).toContainEqual({ id: 'caso-a', naturaleza: 'implicada_en_hecho' });
  });

  it('arista inversa incluye el rol procesal de una organización', () => {
    const inputs = mkInput();
    const acusacion = ctx.orgIndexRow(inputs.organizaciones.find((o) => o.data.id === 'org-acusacion')!)!;
    expect(acusacion.casos_relacionados.map((c) => c.naturaleza)).toContain('rol_acusacion_popular');
  });

  it('personas_clave = sólo imputados/condenados (no jueces ni acusación)', () => {
    const row = ctx.casoIndexRow(casoA);
    expect(row.personas_clave).toContain('p-investigado');
    expect(row.personas_clave).not.toContain('p-juez');
  });

  it('acusación popular va en participación procesal, NO en afectadas', () => {
    const detail = ctx.casoDetail(casoA);
    const ap = detail.participacion_procesal.acusacion_popular.map((o) => o.id);
    expect(ap).toContain('org-acusacion');
    const afectadasIds = [...detail.organizaciones_afectadas.directas, ...detail.organizaciones_afectadas.indirectas].map((o) => o.id);
    expect(afectadasIds).not.toContain('org-acusacion');
  });

  it('importe_atribuido refleja el total objeto del caso', () => {
    expect(ctx.casoIndexRow(casoA).importe_atribuido).toBe(53000000);
    expect(ctx.casoIndexRow(casoC).importe_atribuido).toBeNull();
  });

  it('detalle de persona lista sus casos con roles (sólo visibles)', () => {
    const persona = mkInput().personas.find((p) => p.data.id === 'p-investigado')!;
    const detail = ctx.personaDetail(persona)!;
    const casos = detail.casos.map((c) => c.id).sort();
    expect(casos).toEqual(['caso-a', 'caso-c']);
  });
});

describe('faceta de partido (D4): proyección sin agregados', () => {
  const partido = ctx.partidosConAfectacion().find((o) => o.data.id === 'org-partido')!;

  it('sólo los partidos con afectación en caso visible tienen slice', () => {
    expect(ctx.partidosConAfectacion().map((o) => o.data.id)).toEqual(['org-partido']);
  });

  it('el slice arrastra nivel + justificación y NO emite agregados/rankings', () => {
    const slice = ctx.partidoSlice(partido);
    expect(Object.keys(slice).sort()).toEqual(['casos', 'nota', 'partido']);
    // Ningún campo numérico de conteo a nivel de slice.
    expect(slice).not.toHaveProperty('total');
    expect(slice).not.toHaveProperty('count');
    expect(slice.casos.map((c) => c.id).sort()).toEqual(['caso-a', 'caso-c']);
    for (const c of slice.casos) {
      expect(c.nivel_afectacion).toBe('indirecta');
      expect(typeof c.justificacion_afectacion).toBe('string');
    }
  });
});

describe('sobre meta y respuesta', () => {
  it('apiMeta trae licencia, aviso, versión, fecha y fuente', () => {
    const m = apiMeta('https://presuntamente.org/api/v1/casos.json', 'attr');
    expect(m.licencia).toContain('CC BY-SA');
    expect(m.aviso.toLowerCase()).toContain('imputación');
    expect(m.version).toBe('v1');
    expect(m.generado).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(m.fuente).toContain('/api/v1/');
  });

  it('jsonResponse devuelve {meta,datos} con cabeceras JSON + CORS', async () => {
    const res = jsonResponse([{ x: 1 }], apiMeta('https://x/y.json', 'a'));
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    const body = JSON.parse(await res.text());
    expect(body).toHaveProperty('meta');
    expect(body).toHaveProperty('datos');
    expect(body.datos).toEqual([{ x: 1 }]);
  });
});
