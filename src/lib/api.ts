// Serializadores de la API de datos abiertos (`/api/v1/...`).
//
// Contrato de cara afuera: docs/api/README.md. Porqués: docs/api/decisiones.md.
// Ficha interna: docs/web/features/api-datos-abiertos.md.
//
// La API es UN VECTOR DE PUBLICACIÓN MÁS y pasa por el MISMO gate que el resto
// del sitio (src/lib/visibilidad.ts, decisión D8): sólo se serializan casos en
// `beta_publica`+ y las personas/organizaciones enlazadas a ellos. En `dev` se
// expone todo (igual que las fichas se generan todas en dev) para poder iterar.
//
// Sin servidor ni base de datos (D1): estos serializadores los invocan endpoints
// estáticos Astro (src/pages/api/v1/*) que corren EN BUILD, igual que feed.xml.ts.
//
// Decisiones de modelo reflejadas aquí:
//   - D2  grafo de tres nodos (caso/persona/organización), cada nodo con aristas.
//   - D3  índice ligero + detalle + slices.
//   - D4  faceta de partido = proyección de afectación, SIN agregados ni rankings.
//   - D10 el `cif` es la clave de cruce con datasets externos.
//   - D11 denormalización para el join externo: `cif` inline en las
//         organizaciones afectadas del caso + arista inversa organización→casos.
//
// Guardarraíles editoriales que viajan en el payload:
//   - Sobre `meta` con licencia + aviso "imputación ≠ condena" en cada respuesta.
//   - Cada Hecho conserva su `tipo` (estado epistémico) y `nivel_fuente_efectivo`.
//   - Cada RolEnCaso conserva su `rol` discreto y su trayectoria (fechas + hitos).
//   - Contenido RETRACTADO no se propaga: se excluyen entidades en
//     `estado_publicacion` retirado_* y los Hechos con `vigencia: retirado`.
//   - El flag INTERNO `promocion_propuesta` del Caso nunca se expone (denylist).

import { getCollection, type CollectionEntry } from 'astro:content';
import { buildDate } from '@/lib/build-info';
import { idsCasosVisibles, entidadesEnCasosVisibles } from '@/lib/visibilidad';
import {
  organizacionesAfectadasDeCaso,
  organizacionesParticipacionProcesalDeCaso,
  type OrganizacionLite,
  type NivelAfectacion,
} from '@/lib/afectacion';
import { toImporteEntries, totalesPorCaso, type HechoImporteInput } from '@/lib/importe';
import { rolGrupo } from '@/lib/labels';
import { ultimaActualizacionDeCaso } from '@/lib/git-meta';

export const API_VERSION = 'v1' as const;
export const SITE = 'https://presuntamente.org';
export const LICENCIA = 'CC BY-SA 4.0';
export const AVISO =
  'Imputación no es condena. Cada hecho lleva su nivel de fuente (1-4) y cada rol procesal su tipo discreto y su trayectoria temporal. No afirmar culpabilidad sin sentencia firme.';

// Campos INTERNOS del Caso que jamás salen por la API (ver schema caso: el flag
// `promocion_propuesta` "no se renderiza en la web pública"). Denylist en vez de
// whitelist para que los campos públicos nuevos aparezcan solos (D9: "podemos
// añadir campos sin avisar"), pero los internos nunca se filtren.
const CASO_CAMPOS_INTERNOS = new Set(['promocion_propuesta']);

// Estados de publicación que significan "retirado": no se propagan por la API.
const ESTADOS_RETIRADOS = new Set(['retirado_temporalmente', 'retirado_definitivamente']);
function noRetirado(estado: string | undefined): boolean {
  return !estado || !ESTADOS_RETIRADOS.has(estado);
}

// --- Sobre de metadatos ------------------------------------------------------

export interface ApiMeta {
  licencia: string;
  atribucion: string;
  aviso: string;
  version: string;
  generado: string;
  fuente: string;
}

export interface ApiEnvelope<T> {
  meta: ApiMeta;
  datos: T;
}

function meta(fuente: string, atribucion: string): ApiMeta {
  return {
    licencia: LICENCIA,
    atribucion,
    aviso: AVISO,
    version: API_VERSION,
    generado: buildDate,
    fuente,
  };
}

/** Respuesta JSON estándar de la API: sobre `meta` + `datos`, 2 espacios de
 *  indentación (legible para humanos y diffs), con cabecera JSON + CORS. */
export function jsonResponse<T>(datos: T, m: ApiMeta): Response {
  const body: ApiEnvelope<T> = { meta: m, datos };
  return new Response(JSON.stringify(body, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// --- Tipos de entrada (las collections) --------------------------------------

/** Carga todas las collections que la API necesita. Build-time (Astro estático);
 *  cada endpoint la invoca y pasa el resultado a `buildApiContext`. */
export async function loadApiInput(): Promise<ApiInput> {
  const [casos, personas, organizaciones, documentos, delitos, roles, hitos, hechos, vinculos, relaciones] =
    await Promise.all([
      getCollection('casos'),
      getCollection('personas'),
      getCollection('organizaciones'),
      getCollection('documentos'),
      getCollection('delitos'),
      getCollection('roles'),
      getCollection('hitos'),
      getCollection('hechos'),
      getCollection('vinculos'),
      getCollection('relaciones'),
    ]);
  return { casos, personas, organizaciones, documentos, delitos, roles, hitos, hechos, vinculos, relaciones };
}

export interface ApiInput {
  casos: CollectionEntry<'casos'>[];
  personas: CollectionEntry<'personas'>[];
  organizaciones: CollectionEntry<'organizaciones'>[];
  documentos: CollectionEntry<'documentos'>[];
  delitos: CollectionEntry<'delitos'>[];
  roles: CollectionEntry<'roles'>[];
  hitos: CollectionEntry<'hitos'>[];
  hechos: CollectionEntry<'hechos'>[];
  vinculos: CollectionEntry<'vinculos'>[];
  relaciones: CollectionEntry<'relaciones'>[];
}

// Formas auxiliares (las collections usan passthrough, así que muchos campos
// viajan sin tipar y se acceden por cast controlado).
type CasoData = CollectionEntry<'casos'>['data'] & Record<string, unknown>;
type PersonaData = CollectionEntry<'personas'>['data'] & Record<string, unknown>;
type OrgData = CollectionEntry<'organizaciones'>['data'] & Record<string, unknown>;
type DocData = CollectionEntry<'documentos'>['data'] & Record<string, unknown>;
type RolData = CollectionEntry<'roles'>['data'] & Record<string, unknown>;
type HitoData = CollectionEntry<'hitos'>['data'] & Record<string, unknown>;
type HechoData = CollectionEntry<'hechos'>['data'] & Record<string, unknown>;
type VinculoData = CollectionEntry<'vinculos'>['data'] & Record<string, unknown>;
type RelacionData = CollectionEntry<'relaciones'>['data'] & Record<string, unknown>;

// --- Naturalezas de vínculo que enlazan organización↔caso --------------------
// (las cinco de afectación editorial + el papel procesal de acusación)
const VINCULO_ORG_CASO = new Set([
  'acusacion_institucional_en_caso',
  'perjudicado_institucional_en_caso',
  'entidad_investigada_en_caso',
  'ambito_administrativo_directo_del_acto_en_caso',
  'caja_partido_objeto_investigacion_en_caso',
  'afectacion_indirecta_en_caso',
]);

// --- Contexto de la API ------------------------------------------------------
//
// Precalcula índices y el gate de visibilidad una vez; expone los serializadores.
// Cada endpoint construye un contexto (barato a esta escala) y llama lo que
// necesita. Mantiene la lógica de derivación en UN sitio.

export interface ApiContext {
  /** Casos visibles en el entorno actual (prod: beta+; dev: todos). */
  casosVisibles: CollectionEntry<'casos'>[];
  casoVisible: (id: string) => boolean;
  personaVisible: (id: string) => boolean;
  orgVisible: (id: string) => boolean;

  casoIndexRow: (caso: CollectionEntry<'casos'>) => CasoIndexRow;
  personaIndexRow: (persona: CollectionEntry<'personas'>) => PersonaIndexRow | null;
  orgIndexRow: (org: CollectionEntry<'organizaciones'>) => OrgIndexRow | null;

  casoDetail: (caso: CollectionEntry<'casos'>) => CasoDetail;
  personaDetail: (persona: CollectionEntry<'personas'>) => PersonaDetail | null;
  orgDetail: (org: CollectionEntry<'organizaciones'>) => OrgDetail | null;

  /** Partidos (tipo partido_politico) con ≥1 afectación en caso visible. */
  partidosConAfectacion: () => CollectionEntry<'organizaciones'>[];
  partidoSlice: (org: CollectionEntry<'organizaciones'>) => PartidoSlice;

  dump: () => DumpPayload;
}

// --- Refs ligeras -------------------------------------------------------------

export interface OrgRef {
  id: string;
  nombre: string;
  siglas?: string;
  tipo: string;
  cif: string | null;
}
export interface PersonaRef {
  id: string;
  nombre_completo: string;
}
export interface DelitoRef {
  id: string;
  nombre_tipico: string;
  familia: string;
  articulos_cp: string[];
}
export interface DocRef {
  id: string;
  titulo: string;
  tipo: string;
  nivel_fuente: number;
  fecha_documento: string;
  fecha_publicacion?: string;
  estado_acceso: string;
  idioma?: string;
  productor_organizacion_id?: string;
  url_canonica?: string;
  url_archivo?: string;
  ruta_local?: string;
  hash_sha256?: string;
}

// --- Filas de índice ----------------------------------------------------------

export interface OrgAfectadaRow {
  id: string;
  cif: string | null;
  naturaleza: string;
  nivel_afectacion: NivelAfectacion;
}
export interface CasoIndexRow {
  id: string;
  nombre_mediatico: string;
  nombre_oficial: string;
  estado_publicacion: string;
  fase_actual: string;
  fecha_apertura: string;
  fecha_cierre?: string;
  organo_judicial_id: string;
  organizaciones_afectadas: OrgAfectadaRow[];
  personas_clave: string[];
  delitos: string[];
  importe_atribuido: number | null;
  nivel_relevancia_editorial?: string;
  url: string;
}
export interface PersonaIndexRow {
  id: string;
  nombre_completo: string;
  es_figura_publica: boolean;
  cargo_publico_actual?: string;
  casos: { id: string; roles: string[] }[];
  url: string;
}
export interface CasoRelacionadoRow {
  id: string;
  naturaleza: string;
  nivel_afectacion?: NivelAfectacion;
}
export interface OrgIndexRow {
  id: string;
  nombre: string;
  siglas?: string;
  tipo: string;
  cif: string | null;
  casos_relacionados: CasoRelacionadoRow[];
  url: string;
}

// --- Detalle ------------------------------------------------------------------

export interface RolPayload {
  rol: string;
  sujeto_tipo: 'persona' | 'organizacion';
  sujeto_id: string;
  delitos_atribuidos: string[];
  delitos_codigo_penal?: string[];
  fecha_inicio: string;
  fecha_fin?: string;
  activo: boolean;
  hito_origen_id?: string;
  hito_fin_id?: string;
  notas?: string;
}
export interface HitoPayload {
  id: string;
  tipo: string;
  fecha: string;
  fecha_precision: string;
  titulo: string;
  descripcion?: string;
  personas_afectadas: string[];
  organizaciones_afectadas: string[];
  documento_principal_id?: string;
  fase_resultante?: string;
}
export interface HechoPayload {
  id: string;
  enunciado: string;
  tipo: string;
  nivel_fuente_efectivo?: number;
  fecha_o_periodo: Record<string, unknown>;
  personas_implicadas: string[];
  organizaciones_implicadas: string[];
  documentos_respaldo: { documento_id: string; pasaje?: string }[];
  importe?: number;
  importe_moneda?: string;
  importe_clase?: string;
  importe_alcance?: string;
  importe_naturaleza?: string;
  importe_nota?: string;
  vigencia: string;
  estado_publicacion: string;
}
export interface CasoDetail extends Record<string, unknown> {
  id: string;
  organo_judicial: OrgRef | null;
  delitos: DelitoRef[];
  organizaciones_afectadas: { directas: OrgAfectadaDetail[]; indirectas: OrgAfectadaDetail[] };
  participacion_procesal: { acusacion_popular: OrgRef[] };
  personas: { id: string; nombre_completo: string; roles: string[] }[];
  organizaciones_con_rol: { id: string; nombre: string; roles: string[] }[];
  roles: RolPayload[];
  hitos: HitoPayload[];
  hechos: HechoPayload[];
  relaciones: RelacionPayload[];
  documentos: DocRef[];
  importe_atribuido: number | null;
  url: string;
  ultima_actualizacion: string | null;
}
export interface OrgAfectadaDetail extends OrgAfectadaRow {
  nombre: string;
  justificacion?: string;
}
export interface RelacionPayload {
  id: string;
  tipo: string;
  caso_a_id: string;
  caso_b_id: string;
  otro_caso_id: string;
  descripcion: string;
  documentos_respaldo: string[];
  fecha_inicio?: string;
  fecha_fin?: string;
}
export interface PersonaDetail extends Record<string, unknown> {
  id: string;
  nombre_completo: string;
  casos: { id: string; nombre_mediatico: string; roles: RolPayload[] }[];
  vinculos: VinculoPayload[];
  url: string;
}
export interface VinculoPayload {
  id: string;
  naturaleza: string;
  descripcion: string;
  sujeto_persona_id?: string;
  sujeto_organizacion_id?: string;
  objeto_persona_id?: string;
  objeto_organizacion_id?: string;
  cargo_o_rol?: string;
  desde: string;
  hasta?: string;
  vigente?: boolean;
  gobierno_o_legislatura?: string;
  relevancia_para_caso_ids: string[];
  nivel_afectacion?: NivelAfectacion;
  justificacion_afectacion?: string;
}
export interface OrgDetail extends Record<string, unknown> {
  id: string;
  nombre: string;
  tipo: string;
  cif: string | null;
  casos_relacionados: { id: string; nombre_mediatico: string; naturaleza: string; nivel_afectacion?: NivelAfectacion }[];
  roles: { caso_id: string; rol: string }[];
  vinculos: VinculoPayload[];
  url: string;
}

// --- Slice de partido (D4) ----------------------------------------------------

export interface PartidoSlice {
  partido: OrgRef;
  nota: string;
  casos: {
    id: string;
    nombre_mediatico: string;
    fase_actual: string;
    fecha_apertura: string;
    nivel_afectacion: NivelAfectacion;
    naturaleza: string;
    justificacion_afectacion?: string;
    url: string;
  }[];
}

// --- Dump ---------------------------------------------------------------------

export interface DumpPayload {
  casos: CasoDetail[];
  personas: PersonaDetail[];
  organizaciones: OrgDetail[];
  delitos: DelitoRef[];
  relaciones: RelacionPayload[];
}

// =============================================================================

export function buildApiContext(input: ApiInput): ApiContext {
  const casoIdsVisibles = idsCasosVisibles(input.casos);
  const entidades = entidadesEnCasosVisibles({
    casos: input.casos,
    roles: input.roles,
    hechos: input.hechos as unknown as {
      data: { caso_id: string; personas_implicadas?: string[]; organizaciones_implicadas?: string[] };
    }[],
    hitos: input.hitos,
    vinculos: input.vinculos,
    documentos: input.documentos,
  });

  const casoVisible = (id: string) => casoIdsVisibles.has(id);
  const personaVisible = (id: string) => entidades.personas.has(id);
  const orgVisible = (id: string) => entidades.organizaciones.has(id);

  const casosVisibles = input.casos.filter((c) => casoVisible(c.data.id));

  // Índices por id.
  const casoIndex = new Map(input.casos.map((c) => [c.data.id, c.data as CasoData]));
  const personaIndex = new Map(input.personas.map((p) => [p.data.id, p.data as PersonaData]));
  const orgIndex = new Map(input.organizaciones.map((o) => [o.data.id, o.data as OrgData]));
  const docIndex = new Map(input.documentos.map((d) => [d.data.id, d.data as DocData]));
  const delitoIndex = new Map(input.delitos.map((d) => [d.data.id, d.data as Record<string, unknown>]));

  // OrganizacionLite map para afectacion.ts.
  const orgLite: Map<string, OrganizacionLite> = new Map(
    input.organizaciones.map((o) => [
      o.data.id,
      { id: o.data.id, nombre: o.data.nombre, siglas: (o.data as OrgData).siglas as string | undefined, tipo: o.data.tipo },
    ]),
  );

  // Roles por caso (sólo de casos visibles).
  const rolesPorCaso = new Map<string, RolData[]>();
  for (const r of input.roles) {
    if (!casoVisible(r.data.caso_id)) continue;
    const arr = rolesPorCaso.get(r.data.caso_id);
    if (arr) arr.push(r.data as RolData);
    else rolesPorCaso.set(r.data.caso_id, [r.data as RolData]);
  }
  const hitosPorCaso = new Map<string, HitoData[]>();
  for (const h of input.hitos) {
    if (!casoVisible(h.data.caso_id)) continue;
    const arr = hitosPorCaso.get(h.data.caso_id);
    if (arr) arr.push(h.data as HitoData);
    else hitosPorCaso.set(h.data.caso_id, [h.data as HitoData]);
  }
  // Hechos por caso: visibles + NO retractados (estado retirado_* / vigencia retirado).
  const hechosPorCaso = new Map<string, HechoData[]>();
  for (const h of input.hechos) {
    const d = h.data as HechoData;
    if (!casoVisible(d.caso_id)) continue;
    if (!noRetirado(d.estado_publicacion as string)) continue;
    if (d.vigencia === 'retirado') continue;
    const arr = hechosPorCaso.get(d.caso_id);
    if (arr) arr.push(d);
    else hechosPorCaso.set(d.caso_id, [d]);
  }

  // Importe atribuido por caso (clase objeto, modo abierto): mismo cálculo que
  // el preview de /casos (src/components/pages/PgCasos.astro).
  const importeEntries = toImporteEntries(
    input.hechos
      .filter((h) => casoVisible(h.data.caso_id))
      .map((h) => h.data as unknown as HechoImporteInput),
  );
  const totalPorCaso = new Map(
    totalesPorCaso(importeEntries, casoIdsVisibles, { clase: 'objeto' }).map((t) => [t.casoId, t.total]),
  );

  // Vínculos no retirados (los retirado_definitivamente/temporalmente no salen).
  const vinculosVivos = input.vinculos.filter((v) => noRetirado(v.data.estado_publicacion as string));

  // Arista inversa organización→casos (D11): "qué casos tocan a esta organización".
  // Para que el join por CIF sea completo, no basta con los vínculos: una org puede
  // estar enlazada a un caso por vínculo *_en_caso, por ser su órgano/querellante,
  // por rol procesal (persona jurídica investigada, perjudicada, acusación
  // popular…), por estar implicada en un Hecho o afectada en un Hito. Se incluyen
  // todas esas vías. NO se incluye `documentos.productor_organizacion_id`: un medio
  // que publicó una pieza citada no "está implicado" en el caso (sería sobre-relación;
  // el medio aparece en el grafo como fuente, no como parte). Dedup por (caso, naturaleza).
  const casosPorOrg = new Map<string, Map<string, CasoRelacionadoRow>>();
  function addCasoOrg(orgId: string, row: CasoRelacionadoRow) {
    if (!casoVisible(row.id)) return;
    let m = casosPorOrg.get(orgId);
    if (!m) {
      m = new Map();
      casosPorOrg.set(orgId, m);
    }
    const key = `${row.id}:${row.naturaleza}`;
    if (!m.has(key)) m.set(key, row);
  }
  for (const c of casosVisibles) {
    if (c.data.organo_judicial_id) addCasoOrg(c.data.organo_judicial_id, { id: c.data.id, naturaleza: 'organo_judicial' });
    const q = (c.data as CasoData).querellante_inicial_id as string | undefined;
    if (q && orgIndex.has(q)) addCasoOrg(q, { id: c.data.id, naturaleza: 'querellante_inicial' });
  }
  for (const v of vinculosVivos) {
    const orgId = v.data.sujeto_organizacion_id;
    if (!orgId) continue;
    if (!VINCULO_ORG_CASO.has(v.data.naturaleza)) continue;
    for (const casoId of v.data.relevancia_para_caso_ids ?? []) {
      addCasoOrg(orgId, {
        id: casoId,
        naturaleza: v.data.naturaleza,
        nivel_afectacion: v.data.nivel_afectacion as NivelAfectacion | undefined,
      });
    }
  }
  // Rol procesal de una organización (investigada, perjudicada, acusación popular…).
  for (const r of input.roles) {
    if (r.data.sujeto_tipo !== 'organizacion' || !r.data.sujeto_organizacion_id) continue;
    addCasoOrg(r.data.sujeto_organizacion_id, { id: r.data.caso_id, naturaleza: `rol_${r.data.rol}` });
  }
  // Organización implicada en un Hecho (ya filtrados: visibles + no retractados).
  for (const [casoId, hs] of hechosPorCaso) {
    for (const h of hs) {
      for (const orgId of (h.organizaciones_implicadas as string[]) ?? []) {
        addCasoOrg(orgId, { id: casoId, naturaleza: 'implicada_en_hecho' });
      }
    }
  }
  // Organización afectada en un Hito de un caso visible.
  for (const [casoId, hs] of hitosPorCaso) {
    for (const h of hs) {
      for (const orgId of (h.organizaciones_afectadas as string[]) ?? []) {
        addCasoOrg(orgId, { id: casoId, naturaleza: 'afectada_en_hito' });
      }
    }
  }

  // --- Helpers de refs --------------------------------------------------------

  function orgRef(orgId: string): OrgRef | null {
    const o = orgIndex.get(orgId);
    if (!o) return null;
    return {
      id: o.id,
      nombre: o.nombre,
      siglas: o.siglas as string | undefined,
      tipo: o.tipo,
      cif: (o.cif as string | undefined) ?? null,
    };
  }
  function cifDe(orgId: string): string | null {
    return (orgIndex.get(orgId)?.cif as string | undefined) ?? null;
  }
  function delitoRef(slug: string): DelitoRef {
    const d = delitoIndex.get(slug);
    return {
      id: slug,
      nombre_tipico: (d?.nombre_tipico as string) ?? slug,
      familia: (d?.familia as string) ?? 'otro',
      articulos_cp: (d?.articulos_cp as string[]) ?? [],
    };
  }
  function docRef(docId: string): DocRef | null {
    const d = docIndex.get(docId);
    if (!d) return null;
    if (!noRetirado(d.estado_publicacion as string)) return null;
    return {
      id: d.id,
      titulo: d.titulo,
      tipo: d.tipo,
      nivel_fuente: d.nivel_fuente,
      fecha_documento: (d.fecha_documento as string),
      fecha_publicacion: d.fecha_publicacion as string | undefined,
      estado_acceso: d.estado_acceso as string,
      idioma: d.idioma as string | undefined,
      productor_organizacion_id: d.productor_organizacion_id as string | undefined,
      url_canonica: d.url_canonica as string | undefined,
      url_archivo: d.url_archivo as string | undefined,
      ruta_local: d.ruta_local as string | undefined,
      hash_sha256: d.hash_sha256 as string | undefined,
    };
  }

  function rolPayload(r: RolData): RolPayload {
    return {
      rol: r.rol,
      sujeto_tipo: r.sujeto_tipo,
      sujeto_id: (r.sujeto_persona_id ?? r.sujeto_organizacion_id) as string,
      delitos_atribuidos: (r.delitos_atribuidos as string[]) ?? [],
      delitos_codigo_penal: r.delitos_codigo_penal as string[] | undefined,
      fecha_inicio: r.fecha_inicio,
      fecha_fin: r.fecha_fin,
      activo: !r.fecha_fin,
      hito_origen_id: r.hito_origen_id as string | undefined,
      hito_fin_id: r.hito_fin_id as string | undefined,
      notas: r.notas as string | undefined,
    };
  }

  function vinculoPayload(v: VinculoData): VinculoPayload {
    // Sólo se exponen los casos relevantes que son visibles.
    const rel = ((v.relevancia_para_caso_ids as string[]) ?? []).filter(casoVisible);
    return {
      id: v.id,
      naturaleza: v.naturaleza,
      descripcion: v.descripcion,
      sujeto_persona_id: v.sujeto_persona_id as string | undefined,
      sujeto_organizacion_id: v.sujeto_organizacion_id as string | undefined,
      objeto_persona_id: v.objeto_persona_id as string | undefined,
      objeto_organizacion_id: v.objeto_organizacion_id as string | undefined,
      cargo_o_rol: v.cargo_o_rol as string | undefined,
      desde: v.desde,
      hasta: v.hasta as string | undefined,
      vigente: v.vigente as boolean | undefined,
      gobierno_o_legislatura: v.gobierno_o_legislatura as string | undefined,
      relevancia_para_caso_ids: rel,
      nivel_afectacion: v.nivel_afectacion as NivelAfectacion | undefined,
      justificacion_afectacion: v.justificacion_afectacion as string | undefined,
    };
  }

  // --- Índice: caso -----------------------------------------------------------

  function casoIndexRow(caso: CollectionEntry<'casos'>): CasoIndexRow {
    const c = caso.data as CasoData;
    const { directas, indirectas } = organizacionesAfectadasDeCaso(c.id, vinculosVivos, orgLite);
    const afectadas: OrgAfectadaRow[] = [...directas, ...indirectas].map((o) => ({
      id: o.organizacionId,
      cif: cifDe(o.organizacionId),
      naturaleza: o.naturaleza,
      nivel_afectacion: o.nivel,
    }));
    // Personas clave: las imputadas o condenadas (carga procesal del caso),
    // mismo criterio que la OG card. La lista completa de roles (jueces,
    // fiscales, acusación) va en el detalle.
    const clave = new Set<string>();
    for (const r of rolesPorCaso.get(c.id) ?? []) {
      if (r.sujeto_tipo !== 'persona' || !r.sujeto_persona_id) continue;
      const g = rolGrupo(r.rol);
      if (g === 'imputacion_activa' || g === 'condenado') clave.add(r.sujeto_persona_id);
    }
    return {
      id: c.id,
      nombre_mediatico: c.nombre_mediatico,
      nombre_oficial: c.nombre_oficial,
      estado_publicacion: c.estado_publicacion,
      fase_actual: c.fase_actual,
      fecha_apertura: c.fecha_apertura,
      fecha_cierre: c.fecha_cierre as string | undefined,
      organo_judicial_id: c.organo_judicial_id,
      organizaciones_afectadas: afectadas,
      personas_clave: Array.from(clave),
      delitos: (c.delitos_atribuidos_en_la_causa as string[]) ?? [],
      importe_atribuido: totalPorCaso.get(c.id) ?? null,
      nivel_relevancia_editorial: c.nivel_relevancia_editorial as string | undefined,
      url: `${SITE}/casos/${c.id}`,
    };
  }

  // --- Índice: persona --------------------------------------------------------

  function personaIndexRow(persona: CollectionEntry<'personas'>): PersonaIndexRow | null {
    const p = persona.data as PersonaData;
    if (!personaVisible(p.id)) return null;
    const porCaso = new Map<string, Set<string>>();
    for (const r of input.roles) {
      if (r.data.sujeto_tipo !== 'persona' || r.data.sujeto_persona_id !== p.id) continue;
      if (!casoVisible(r.data.caso_id)) continue;
      const set = porCaso.get(r.data.caso_id) ?? new Set<string>();
      set.add(r.data.rol);
      porCaso.set(r.data.caso_id, set);
    }
    return {
      id: p.id,
      nombre_completo: p.nombre_completo,
      es_figura_publica: p.es_figura_publica,
      cargo_publico_actual: p.cargo_publico_actual as string | undefined,
      casos: Array.from(porCaso.entries()).map(([id, roles]) => ({ id, roles: Array.from(roles) })),
      url: `${SITE}/personas/${p.id}`,
    };
  }

  // --- Índice: organización ---------------------------------------------------

  function orgIndexRow(org: CollectionEntry<'organizaciones'>): OrgIndexRow | null {
    const o = org.data as OrgData;
    if (!orgVisible(o.id)) return null;
    const rel = casosPorOrg.get(o.id);
    return {
      id: o.id,
      nombre: o.nombre,
      siglas: o.siglas as string | undefined,
      tipo: o.tipo,
      cif: (o.cif as string | undefined) ?? null,
      casos_relacionados: rel ? Array.from(rel.values()) : [],
      url: `${SITE}/organizaciones/${o.id}`,
    };
  }

  // --- Detalle: caso ----------------------------------------------------------

  function casoDetail(caso: CollectionEntry<'casos'>): CasoDetail {
    const c = caso.data as CasoData;

    // Campos del caso (denylist de internos; el resto pasa para forward-compat).
    const base: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(c)) {
      if (CASO_CAMPOS_INTERNOS.has(k)) continue;
      base[k] = v;
    }

    const { directas, indirectas } = organizacionesAfectadasDeCaso(c.id, vinculosVivos, orgLite);
    const mapAfectada = (o: ReturnType<typeof organizacionesAfectadasDeCaso>['directas'][number]): OrgAfectadaDetail => ({
      id: o.organizacionId,
      nombre: o.nombre,
      cif: cifDe(o.organizacionId),
      naturaleza: o.naturaleza,
      nivel_afectacion: o.nivel,
      justificacion: o.justificacion,
    });
    const { acusacionPopular } = organizacionesParticipacionProcesalDeCaso(c.id, vinculosVivos, orgLite);

    const rolesCaso = rolesPorCaso.get(c.id) ?? [];
    // Personas con rol (agregadas) + organizaciones con rol.
    const personasRoles = new Map<string, Set<string>>();
    const orgsRoles = new Map<string, Set<string>>();
    for (const r of rolesCaso) {
      if (r.sujeto_tipo === 'persona' && r.sujeto_persona_id) {
        const s = personasRoles.get(r.sujeto_persona_id) ?? new Set<string>();
        s.add(r.rol);
        personasRoles.set(r.sujeto_persona_id, s);
      } else if (r.sujeto_tipo === 'organizacion' && r.sujeto_organizacion_id) {
        const s = orgsRoles.get(r.sujeto_organizacion_id) ?? new Set<string>();
        s.add(r.rol);
        orgsRoles.set(r.sujeto_organizacion_id, s);
      }
    }

    const hechosCaso = (hechosPorCaso.get(c.id) ?? []).slice();
    const hitosCaso = (hitosPorCaso.get(c.id) ?? [])
      .slice()
      .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

    // Documentos del caso: caso_principal_id + referenciados por hitos/hechos.
    const docIds = new Set<string>();
    for (const d of input.documentos) {
      if ((d.data as DocData).caso_principal_id === c.id) docIds.add(d.data.id);
    }
    for (const h of hitosCaso) {
      if (h.documento_principal_id) docIds.add(h.documento_principal_id as string);
      for (const id of (h.documentos_relacionados as string[]) ?? []) docIds.add(id);
    }
    for (const h of hechosCaso) {
      for (const ref of (h.documentos_respaldo as { documento_id: string }[]) ?? []) docIds.add(ref.documento_id);
    }
    const documentos = Array.from(docIds)
      .map(docRef)
      .filter((d): d is DocRef => Boolean(d))
      .sort((a, b) => a.nivel_fuente - b.nivel_fuente || a.fecha_documento.localeCompare(b.fecha_documento));

    const relaciones = input.relaciones
      .filter((rel) => noRetirado(rel.data.estado_publicacion as string))
      .filter((rel) => rel.data.caso_a_id === c.id || rel.data.caso_b_id === c.id)
      .filter((rel) => casoVisible(rel.data.caso_a_id) && casoVisible(rel.data.caso_b_id))
      .map((rel) => relacionPayload(rel.data as RelacionData, c.id));

    return {
      ...base,
      id: c.id,
      organo_judicial: c.organo_judicial_id ? orgRef(c.organo_judicial_id) : null,
      delitos: ((c.delitos_atribuidos_en_la_causa as string[]) ?? []).map(delitoRef),
      organizaciones_afectadas: {
        directas: directas.map(mapAfectada),
        indirectas: indirectas.map(mapAfectada),
      },
      participacion_procesal: {
        acusacion_popular: acusacionPopular
          .map((o) => orgRef(o.id))
          .filter((o): o is OrgRef => Boolean(o)),
      },
      personas: Array.from(personasRoles.entries()).map(([id, roles]) => ({
        id,
        nombre_completo: personaIndex.get(id)?.nombre_completo ?? id,
        roles: Array.from(roles),
      })),
      organizaciones_con_rol: Array.from(orgsRoles.entries()).map(([id, roles]) => ({
        id,
        nombre: orgIndex.get(id)?.nombre ?? id,
        roles: Array.from(roles),
      })),
      roles: rolesCaso.map(rolPayload),
      hitos: hitosCaso.map(hitoPayload),
      hechos: hechosCaso.map(hechoPayload),
      relaciones,
      documentos,
      importe_atribuido: totalPorCaso.get(c.id) ?? null,
      url: `${SITE}/casos/${c.id}`,
      ultima_actualizacion: ultimaActualizacionDeCaso(c.id),
    };
  }

  function hitoPayload(h: HitoData): HitoPayload {
    return {
      id: h.id,
      tipo: h.tipo,
      fecha: h.fecha,
      fecha_precision: h.fecha_precision,
      titulo: h.titulo,
      descripcion: h.descripcion as string | undefined,
      personas_afectadas: (h.personas_afectadas as string[]) ?? [],
      organizaciones_afectadas: (h.organizaciones_afectadas as string[]) ?? [],
      documento_principal_id: h.documento_principal_id as string | undefined,
      fase_resultante: h.fase_resultante as string | undefined,
    };
  }

  function hechoPayload(h: HechoData): HechoPayload {
    return {
      id: h.id,
      enunciado: h.enunciado,
      tipo: h.tipo,
      nivel_fuente_efectivo: h.nivel_fuente_efectivo as number | undefined,
      fecha_o_periodo: h.fecha_o_periodo as Record<string, unknown>,
      personas_implicadas: (h.personas_implicadas as string[]) ?? [],
      organizaciones_implicadas: (h.organizaciones_implicadas as string[]) ?? [],
      documentos_respaldo: ((h.documentos_respaldo as { documento_id: string; pasaje?: string }[]) ?? []).map((d) => ({
        documento_id: d.documento_id,
        pasaje: d.pasaje,
      })),
      importe: h.importe as number | undefined,
      importe_moneda: h.importe_moneda as string | undefined,
      importe_clase: h.importe_clase as string | undefined,
      importe_alcance: h.importe_alcance as string | undefined,
      importe_naturaleza: h.importe_naturaleza as string | undefined,
      importe_nota: h.importe_nota as string | undefined,
      vigencia: h.vigencia,
      estado_publicacion: h.estado_publicacion,
    };
  }

  function relacionPayload(rel: RelacionData, desdeCasoId: string): RelacionPayload {
    return {
      id: rel.id,
      tipo: rel.tipo,
      caso_a_id: rel.caso_a_id,
      caso_b_id: rel.caso_b_id,
      otro_caso_id: rel.caso_a_id === desdeCasoId ? rel.caso_b_id : rel.caso_a_id,
      descripcion: rel.descripcion,
      documentos_respaldo: (rel.documentos_respaldo as string[]) ?? [],
      fecha_inicio: rel.fecha_inicio as string | undefined,
      fecha_fin: rel.fecha_fin as string | undefined,
    };
  }

  // --- Detalle: persona -------------------------------------------------------

  function personaDetail(persona: CollectionEntry<'personas'>): PersonaDetail | null {
    const p = persona.data as PersonaData;
    if (!personaVisible(p.id)) return null;

    const porCaso = new Map<string, RolData[]>();
    for (const r of input.roles) {
      if (r.data.sujeto_tipo !== 'persona' || r.data.sujeto_persona_id !== p.id) continue;
      if (!casoVisible(r.data.caso_id)) continue;
      const arr = porCaso.get(r.data.caso_id) ?? [];
      arr.push(r.data as RolData);
      porCaso.set(r.data.caso_id, arr);
    }
    const casos = Array.from(porCaso.entries()).map(([id, rs]) => ({
      id,
      nombre_mediatico: casoIndex.get(id)?.nombre_mediatico ?? id,
      roles: rs.map(rolPayload),
    }));

    const vinculos = vinculosVivos
      .filter((v) => v.data.sujeto_persona_id === p.id || v.data.objeto_persona_id === p.id)
      .map((v) => vinculoPayload(v.data as VinculoData));

    return {
      ...(p as Record<string, unknown>),
      id: p.id,
      nombre_completo: p.nombre_completo,
      casos,
      vinculos,
      url: `${SITE}/personas/${p.id}`,
    };
  }

  // --- Detalle: organización --------------------------------------------------

  function orgDetail(org: CollectionEntry<'organizaciones'>): OrgDetail | null {
    const o = org.data as OrgData;
    if (!orgVisible(o.id)) return null;

    const rel = casosPorOrg.get(o.id);
    const casos_relacionados = rel
      ? Array.from(rel.values()).map((r) => ({
          id: r.id,
          nombre_mediatico: casoIndex.get(r.id)?.nombre_mediatico ?? r.id,
          naturaleza: r.naturaleza,
          nivel_afectacion: r.nivel_afectacion,
        }))
      : [];

    const roles: { caso_id: string; rol: string }[] = [];
    for (const r of input.roles) {
      if (r.data.sujeto_tipo !== 'organizacion' || r.data.sujeto_organizacion_id !== o.id) continue;
      if (!casoVisible(r.data.caso_id)) continue;
      roles.push({ caso_id: r.data.caso_id, rol: r.data.rol });
    }

    const vinculos = vinculosVivos
      .filter((v) => v.data.sujeto_organizacion_id === o.id || v.data.objeto_organizacion_id === o.id)
      .map((v) => vinculoPayload(v.data as VinculoData));

    return {
      ...(o as Record<string, unknown>),
      id: o.id,
      nombre: o.nombre,
      tipo: o.tipo,
      cif: (o.cif as string | undefined) ?? null,
      casos_relacionados,
      roles,
      vinculos,
      url: `${SITE}/organizaciones/${o.id}`,
    };
  }

  // --- Slice de partido (D4) --------------------------------------------------

  function partidosConAfectacion(): CollectionEntry<'organizaciones'>[] {
    const conAfectacion = new Set<string>();
    for (const v of vinculosVivos) {
      const orgId = v.data.sujeto_organizacion_id;
      if (!orgId) continue;
      if (v.data.naturaleza === 'acusacion_institucional_en_caso') continue; // papel procesal, no afectación
      if (!VINCULO_ORG_CASO.has(v.data.naturaleza)) continue;
      if (!(v.data.relevancia_para_caso_ids ?? []).some(casoVisible)) continue;
      if (orgIndex.get(orgId)?.tipo === 'partido_politico') conAfectacion.add(orgId);
    }
    return input.organizaciones.filter((o) => conAfectacion.has(o.data.id));
  }

  function partidoSlice(org: CollectionEntry<'organizaciones'>): PartidoSlice {
    const o = org.data as OrgData;
    const seen = new Set<string>();
    const casos: PartidoSlice['casos'] = [];
    for (const v of vinculosVivos) {
      if (v.data.sujeto_organizacion_id !== o.id) continue;
      if (v.data.naturaleza === 'acusacion_institucional_en_caso') continue;
      if (!VINCULO_ORG_CASO.has(v.data.naturaleza)) continue;
      const nivel = v.data.nivel_afectacion as NivelAfectacion | undefined;
      if (!nivel) continue;
      for (const casoId of v.data.relevancia_para_caso_ids ?? []) {
        if (!casoVisible(casoId) || seen.has(casoId)) continue;
        seen.add(casoId);
        const c = casoIndex.get(casoId);
        if (!c) continue;
        casos.push({
          id: casoId,
          nombre_mediatico: c.nombre_mediatico,
          fase_actual: c.fase_actual,
          fecha_apertura: c.fecha_apertura,
          nivel_afectacion: nivel,
          naturaleza: v.data.naturaleza,
          justificacion_afectacion: v.data.justificacion_afectacion as string | undefined,
          url: `${SITE}/casos/${casoId}`,
        });
      }
    }
    casos.sort((a, b) => b.fecha_apertura.localeCompare(a.fecha_apertura));
    return {
      partido:
        orgRef(o.id) ?? { id: o.id, nombre: o.nombre, tipo: o.tipo, cif: (o.cif as string | undefined) ?? null },
      nota:
        'Proyección de la afectación directa/indirecta ya modelada (doc 08). Cada inclusión arrastra su nivel y su justificación. No se publican agregados ni rankings por partido: contar sería un acto editorial, no un dato.',
      casos,
    };
  }

  // --- Dump -------------------------------------------------------------------

  function dump(): DumpPayload {
    const casos = casosVisibles.map(casoDetail);
    const personas = input.personas
      .map(personaDetail)
      .filter((p): p is PersonaDetail => Boolean(p));
    const organizaciones = input.organizaciones
      .map(orgDetail)
      .filter((o): o is OrgDetail => Boolean(o));
    const delitosUsados = new Set<string>();
    for (const c of casos) for (const d of c.delitos) delitosUsados.add(d.id);
    const delitos = Array.from(delitosUsados).map(delitoRef);
    const relaciones = input.relaciones
      .filter((rel) => noRetirado(rel.data.estado_publicacion as string))
      .filter((rel) => casoVisible(rel.data.caso_a_id) && casoVisible(rel.data.caso_b_id))
      .map((rel) => relacionPayload(rel.data as RelacionData, rel.data.caso_a_id));
    return { casos, personas, organizaciones, delitos, relaciones };
  }

  return {
    casosVisibles,
    casoVisible,
    personaVisible,
    orgVisible,
    casoIndexRow,
    personaIndexRow,
    orgIndexRow,
    casoDetail,
    personaDetail,
    orgDetail,
    partidosConAfectacion,
    partidoSlice,
    dump,
  };
}

// Atribución estándar para el sobre `meta`.
export function atribucionIndice(): string {
  return `presuntamente.org, consultada el ${buildDate}`;
}
export function atribucionFicha(nombre: string): string {
  return `presuntamente.org, ficha «${nombre}», consultada el ${buildDate}`;
}
export { meta as apiMeta };
