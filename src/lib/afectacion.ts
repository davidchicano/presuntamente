// Derivación canónica de "organizaciones afectadas" por un Caso a partir
// de la colección `vinculos-institucionales`.
//
// Fuente de verdad editorial: docs/diseno/08-afectacion-directa-indirecta.md.
// Patrón único reutilizado en /casos, ficha de caso y home — la
// deduplicación por organizacion_id se hace AQUÍ y no se repite en cada
// componente. Si añades un nuevo punto de uso, importa de este módulo.
//
// El campo retirado `Caso.partidos_afectados[]` NO se lee desde aquí ni
// desde ningún componente: la prosa migró a `VinculoInstitucional.
// justificacion_afectacion` y la categoría a `nivel_afectacion`.
//
// Naturalezas que aportan afectación:
//   - directa: entidad_investigada_en_caso, perjudicado_institucional_en_caso,
//              ambito_administrativo_directo_del_acto_en_caso
//   - indirecta: afectacion_indirecta_en_caso
//
// Naturaleza que NO aporta afectación (papel procesal voluntario):
//   - acusacion_institucional_en_caso → aparece en "Participación procesal",
//     nunca en "Organizaciones afectadas".

export type NivelAfectacion = 'directa' | 'indirecta';

export interface VinculoLike {
  data: {
    naturaleza: string;
    sujeto_organizacion_id?: string;
    sujeto_persona_id?: string;
    objeto_organizacion_id?: string;
    nivel_afectacion?: NivelAfectacion;
    justificacion_afectacion?: string;
    relevancia_para_caso_ids?: string[];
  };
}

export interface OrganizacionLite {
  id: string;
  nombre: string;
  siglas?: string;
  tipo: string;
}

export interface OrgAfectada {
  organizacionId: string;
  nombre: string;
  siglas?: string;
  tipo: string;
  nivel: NivelAfectacion;
  naturaleza: string;
  justificacion?: string;
}

const NATURALEZAS_DIRECTA: ReadonlySet<string> = new Set([
  'entidad_investigada_en_caso',
  'perjudicado_institucional_en_caso',
  'ambito_administrativo_directo_del_acto_en_caso',
]);

const NATURALEZA_INDIRECTA = 'afectacion_indirecta_en_caso';

/**
 * Devuelve las organizaciones afectadas por un caso, categorizadas por
 * nivel y deduplicadas por `organizacion_id`. Si una misma organización
 * aparece como directa e indirecta a la vez (raro, pero posible si la
 * editorialización lo justifica), la **directa gana**.
 *
 * Orden de retorno:
 *   - directas[] ordenadas alfabéticamente por nombre.
 *   - indirectas[] ordenadas alfabéticamente por nombre.
 */
export function organizacionesAfectadasDeCaso(
  casoId: string,
  vinculos: ReadonlyArray<VinculoLike>,
  orgIndex: ReadonlyMap<string, OrganizacionLite>,
): { directas: OrgAfectada[]; indirectas: OrgAfectada[] } {
  const dedupe = new Map<string, OrgAfectada>();
  for (const v of vinculos) {
    if (!v.data.relevancia_para_caso_ids?.includes(casoId)) continue;
    const orgId = v.data.sujeto_organizacion_id;
    if (!orgId) continue;
    const org = orgIndex.get(orgId);
    if (!org) continue;

    const esDirecta = NATURALEZAS_DIRECTA.has(v.data.naturaleza);
    const esIndirecta = v.data.naturaleza === NATURALEZA_INDIRECTA;
    if (!esDirecta && !esIndirecta) continue;

    const candidata: OrgAfectada = {
      organizacionId: orgId,
      nombre: org.nombre,
      siglas: org.siglas,
      tipo: org.tipo,
      nivel: esDirecta ? 'directa' : 'indirecta',
      naturaleza: v.data.naturaleza,
      justificacion: v.data.justificacion_afectacion,
    };

    const ya = dedupe.get(orgId);
    if (!ya) {
      dedupe.set(orgId, candidata);
      continue;
    }
    // Dedupe: directa gana sobre indirecta. Si ambas son del mismo
    // nivel, la primera leída se queda (estable por sort posterior).
    if (ya.nivel === 'indirecta' && candidata.nivel === 'directa') {
      dedupe.set(orgId, candidata);
    }
  }

  const todas = Array.from(dedupe.values());
  const directas = todas
    .filter((o) => o.nivel === 'directa')
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  const indirectas = todas
    .filter((o) => o.nivel === 'indirecta')
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return { directas, indirectas };
}

/**
 * Atajo: sólo las afectaciones indirectas que son partidos políticos.
 * Reemplaza la lectura del retirado `Caso.partidos_afectados[]` en home
 * y otras vistas que sólo quieren "qué siglas quedan tocadas".
 *
 * Dedupe por `organizacionId` y orden por nombre.
 */
export function partidosAfectadosIndirectosDeCaso(
  casoId: string,
  vinculos: ReadonlyArray<VinculoLike>,
  orgIndex: ReadonlyMap<string, OrganizacionLite>,
): OrgAfectada[] {
  const { indirectas } = organizacionesAfectadasDeCaso(casoId, vinculos, orgIndex);
  return indirectas.filter((o) => o.tipo === 'partido_politico');
}

/**
 * Devuelve las organizaciones que participan procesalmente en un caso
 * SIN ser afectadas: acusación popular constituida. Útil para el bloque
 * "Participación procesal" en la ficha de caso.
 */
export function organizacionesParticipacionProcesalDeCaso(
  casoId: string,
  vinculos: ReadonlyArray<VinculoLike>,
  orgIndex: ReadonlyMap<string, OrganizacionLite>,
): { acusacionPopular: OrganizacionLite[] } {
  const dedupe = new Map<string, OrganizacionLite>();
  for (const v of vinculos) {
    if (!v.data.relevancia_para_caso_ids?.includes(casoId)) continue;
    if (v.data.naturaleza !== 'acusacion_institucional_en_caso') continue;
    const orgId = v.data.sujeto_organizacion_id;
    if (!orgId) continue;
    if (dedupe.has(orgId)) continue;
    const org = orgIndex.get(orgId);
    if (!org) continue;
    dedupe.set(orgId, org);
  }
  const acusacionPopular = Array.from(dedupe.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es'),
  );
  return { acusacionPopular };
}
