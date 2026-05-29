// Agregación de importes presuntamente atribuidos. Sólo build-time.
//
// El dinero vive en cada Hecho (no en el Caso suelto) para heredar estado
// epistémico, nivel de fuente y documentos de respaldo. Aquí se derivan los
// agregados respetando las reglas anti-doble-conteo de
// docs/diseno/01-modelo-de-datos.md §2.6 (V-22/V-23) y los guardarraíles de
// docs/web/features/importe-presunto.md:
//   - `componente` nunca suma (desglosa un total ya contabilizado o es cifra
//     citada / no acumulable).
//   - Total del caso = Σ(total_caso); si no hay ninguno, Σ(individual).
//   - Los Hechos `exculpatorio`/`desmentido` no acumulan a ningún total.
//   - La naturaleza (perjuicio ≠ préstamo ≠ multa) NO se mezcla en una sola
//     cifra global: para el agregado transversal se reparte por naturaleza.
//
// NO se deriva agregado por persona/organización: el importe cuelga del Hecho
// y `personas_implicadas`/`organizaciones_implicadas` lista a TODOS los
// implicados (perjudicados, acusación, órgano incluidos), de modo que sumar
// por sujeto misatribuiría dinero a víctimas y acusadores. Requiere un campo
// de atribución por sujeto antes de poder hacerse sin violar la presunción de
// inocencia. Ver ficha de la feature, "Decisiones abiertas".

export type ImporteClase = 'objeto' | 'consecuencia';
export type ImporteAlcance = 'total_caso' | 'componente' | 'individual';
export type ImporteNaturaleza =
  | 'perjuicio'
  | 'objeto_contrato'
  | 'fondo_publico_concedido'
  | 'comision_ilicita'
  | 'cobro_indebido'
  | 'multa_penal'
  | 'responsabilidad_civil'
  | 'gasto_publico_cuestionado'
  | 'otro';
export type HechoEpis =
  | 'acreditado'
  | 'investigado'
  | 'atribuido'
  | 'exculpatorio'
  | 'desmentido'
  | 'no_concluyente';

// Papel económico de un sujeto en el importe de un Hecho. Distinto del rol
// procesal (RolEnCaso). Guardarraíl de presunción de inocencia:
//   objeto      → activo (conducta atribuida, NO afirma percepción) ·
//                 beneficiario (percibe/se queda el dinero) ·
//                 perjudicado (sufre el quebranto)
//   consecuencia → obligado (paga la multa/RC) · acreedor (la cobra)
export type ImportePapel = 'activo' | 'beneficiario' | 'perjudicado' | 'obligado' | 'acreedor';

export interface ImporteAtribucionEntry {
  sujetoTipo: 'persona' | 'organizacion';
  sujeto: string;
  papel: ImportePapel;
  /** Cuota de este sujeto si difiere del importe del Hecho. */
  importeSujeto?: number;
  nota?: string;
}

/** Clase a la que pertenece cada papel. activo/beneficiario/perjudicado son
 *  objeto (dinero en juego); obligado/acreedor son consecuencia (lo que se
 *  paga o cobra). Las vistas por sujeto nunca mezclan clases. */
const PAPEL_CLASE: Record<ImportePapel, ImporteClase> = {
  activo: 'objeto',
  beneficiario: 'objeto',
  perjudicado: 'objeto',
  obligado: 'consecuencia',
  acreedor: 'consecuencia',
};
export function papelClase(papel: ImportePapel): ImporteClase {
  return PAPEL_CLASE[papel];
}

/** Forma mínima que el lib necesita de un Hecho. Los .astro castean
 *  `hecho.data` a esto (la collection usa passthrough, así que
 *  `nivel_fuente_efectivo` y `documentos_respaldo` viajan sin tipar). */
export interface HechoImporteInput {
  id: string;
  caso_id: string;
  enunciado: string;
  tipo: HechoEpis;
  importe?: number;
  importe_moneda?: string;
  importe_clase?: ImporteClase;
  importe_alcance?: ImporteAlcance;
  importe_naturaleza?: ImporteNaturaleza;
  importe_nota?: string;
  importe_atribucion?: {
    sujeto_tipo: 'persona' | 'organizacion';
    sujeto: string;
    papel: ImportePapel;
    importe_sujeto?: number;
    nota?: string;
  }[];
  nivel_fuente_efectivo?: number;
  fecha_o_periodo?: { desde?: string };
  documentos_respaldo?: { documento_id: string; pasaje?: string }[];
}

export interface ImporteEntry {
  hechoId: string;
  casoId: string;
  enunciado: string;
  tipo: HechoEpis;
  importe: number;
  moneda: string;
  clase: ImporteClase;
  alcance: ImporteAlcance;
  naturaleza?: ImporteNaturaleza;
  nota?: string;
  nivel: 1 | 2 | 3 | 4;
  docId?: string;
  /** Año de referencia del importe (inicio del periodo del Hecho), para el
   *  ajuste por inflación. `null` si el Hecho no trae fecha parseable. */
  anio: number | null;
  /** Atribución por sujeto con su papel económico (puede ir vacía). */
  atribucion: ImporteAtribucionEntry[];
  /** Contribuye al total del caso (en el modo de cálculo aplicado). */
  acumula: boolean;
}

// Hechos que nunca acumulan a un total atribuido.
const EPIS_NO_ACUMULA = new Set<HechoEpis>(['exculpatorio', 'desmentido', 'no_concluyente']);

// Fallback de clase si un Hecho antiguo no la declara: las multas y la
// responsabilidad civil son consecuencia; el resto, objeto. La fuente de verdad
// es `importe_clase` (declarado por Hecho); esto sólo evita romper si falta.
const NATURALEZA_CONSECUENCIA = new Set<ImporteNaturaleza>(['multa_penal', 'responsabilidad_civil']);
function claseDe(h: HechoImporteInput): ImporteClase {
  if (h.importe_clase) return h.importe_clase;
  return h.importe_naturaleza && NATURALEZA_CONSECUENCIA.has(h.importe_naturaleza)
    ? 'consecuencia'
    : 'objeto';
}

/** Hechos cuyo importe se considera "firme": acreditado por sentencia o
 *  resolución firme. Hoy es el discriminante del toggle firme/abierto. */
export const EPIS_FIRME = new Set<HechoEpis>(['acreditado']);

/** Normaliza los Hechos con importe (en euros) a `ImporteEntry`. Descarta los
 *  que no traen `importe` o `importe_alcance`, o cuya moneda no es EUR (la
 *  cifra estructurada es siempre la relevante en euros; otras divisas viven en
 *  `importe_nota`). `acumula` se rellena después, por caso. */
export function toImporteEntries(hechos: HechoImporteInput[]): ImporteEntry[] {
  const out: ImporteEntry[] = [];
  for (const h of hechos) {
    if (h.importe == null || !h.importe_alcance) continue;
    const moneda = h.importe_moneda ?? 'EUR';
    if (moneda !== 'EUR') continue;
    const nivel = Math.min(4, Math.max(1, h.nivel_fuente_efectivo ?? 4)) as 1 | 2 | 3 | 4;
    const m = /^(\d{4})/.exec(h.fecha_o_periodo?.desde ?? '');
    out.push({
      hechoId: h.id,
      casoId: h.caso_id,
      enunciado: h.enunciado,
      tipo: h.tipo,
      importe: h.importe,
      moneda,
      clase: claseDe(h),
      alcance: h.importe_alcance,
      naturaleza: h.importe_naturaleza,
      nota: h.importe_nota,
      nivel,
      docId: h.documentos_respaldo?.[0]?.documento_id,
      anio: m ? Number(m[1]) : null,
      atribucion: (h.importe_atribucion ?? []).map((a) => ({
        sujetoTipo: a.sujeto_tipo,
        sujeto: a.sujeto,
        papel: a.papel,
        importeSujeto: a.importe_sujeto,
        nota: a.nota,
      })),
      acumula: false,
    });
  }
  return out;
}

/** Devuelve las mismas entradas con el importe ajustado a euros constantes de
 *  2025 (IPC INE, ver src/lib/ipc.ts). Las entradas sin año parseable se dejan
 *  nominales. Toda la agregación posterior es idéntica: sólo cambia la cifra. */
export function aEurosConstantes(
  entries: ImporteEntry[],
  ajustar: (euros: number, anio: number) => number,
): ImporteEntry[] {
  return entries.map((e) =>
    e.anio == null ? e : { ...e, importe: ajustar(e.importe, e.anio) },
  );
}

interface SummableOpts {
  /** Sólo Hechos firmes (acreditados). Por defecto false (procedimientos abiertos). */
  firmeOnly?: boolean;
  /** Restringe a una clase (objeto | consecuencia). Las clases NUNCA se suman
   *  entre sí; los agregados se computan siempre dentro de una clase. */
  clase?: ImporteClase;
}

/** Subconjunto de entradas de UN caso que contribuye al total, aplicando las
 *  reglas: candidatos = clase indicada (si se pasa) + no exculpatorio/desmentido
 *  (+ acreditado si firmeOnly); si hay `total_caso`, ésos; si no, los
 *  `individual`; `componente` nunca. */
export function summableEntries(
  entriesDelCaso: ImporteEntry[],
  opts: SummableOpts = {},
): { entries: ImporteEntry[]; basis: 'total_caso' | 'individual' | null } {
  const candidatos = entriesDelCaso.filter(
    (e) =>
      (!opts.clase || e.clase === opts.clase) &&
      !EPIS_NO_ACUMULA.has(e.tipo) &&
      (!opts.firmeOnly || EPIS_FIRME.has(e.tipo)),
  );
  const totales = candidatos.filter((e) => e.alcance === 'total_caso');
  if (totales.length) return { entries: totales, basis: 'total_caso' };
  const individuales = candidatos.filter((e) => e.alcance === 'individual');
  if (individuales.length) return { entries: individuales, basis: 'individual' };
  return { entries: [], basis: null };
}

export interface AnalisisCaso {
  /** Todas las entradas del caso (incluye componente y exculpatorio), con
   *  `acumula` marcado según el modo "abierto". */
  entries: ImporteEntry[];
  total: number | null;
  basis: 'total_caso' | 'individual' | null;
  /** Naturalezas distintas presentes en las entradas que suman al total. */
  naturalezasEnTotal: ImporteNaturaleza[];
  /** Hay alguna cifra de un Hecho exculpatorio/desmentido (se muestra pero no suma). */
  hayNoAcumulable: boolean;
}

/** Análisis de un caso para UNA clase (objeto | consecuencia), para la ficha:
 *  total (modo abierto) + las entradas de esa clase marcadas con si acumulan. */
export function analizarCaso(entriesDelCaso: ImporteEntry[], clase: ImporteClase): AnalisisCaso {
  const deClase = entriesDelCaso.filter((e) => e.clase === clase);
  const { entries: sumables, basis } = summableEntries(entriesDelCaso, { clase });
  const sumableIds = new Set(sumables.map((e) => e.hechoId));
  const entries = deClase.map((e) => ({ ...e, acumula: sumableIds.has(e.hechoId) }));
  const total = sumables.length ? sumables.reduce((a, e) => a + e.importe, 0) : null;
  const naturalezasEnTotal = Array.from(
    new Set(sumables.map((e) => e.naturaleza).filter((n): n is ImporteNaturaleza => Boolean(n))),
  );
  const hayNoAcumulable = deClase.some(
    (e) => EPIS_NO_ACUMULA.has(e.tipo) || e.alcance === 'componente',
  );
  return { entries, total, basis, naturalezasEnTotal, hayNoAcumulable };
}

export interface TotalCaso {
  casoId: string;
  total: number;
  basis: 'total_caso' | 'individual';
  naturalezas: ImporteNaturaleza[];
}

function agruparPorCaso(
  allEntries: ImporteEntry[],
  casoIdsComputables: Set<string>,
): Map<string, ImporteEntry[]> {
  const porCaso = new Map<string, ImporteEntry[]>();
  for (const e of allEntries) {
    if (!casoIdsComputables.has(e.casoId)) continue;
    const arr = porCaso.get(e.casoId);
    if (arr) arr.push(e);
    else porCaso.set(e.casoId, [e]);
  }
  return porCaso;
}

/** Lista plana de las entradas que suman (de todos los casos computables),
 *  para repartirlas por la dimensión que se quiera (naturaleza, estado, nivel).
 *  Σ de estas entradas == Σ de los totales por caso. */
export function summableComputables(
  allEntries: ImporteEntry[],
  casoIdsComputables: Set<string>,
  opts: SummableOpts = {},
): ImporteEntry[] {
  const porCaso = agruparPorCaso(allEntries, casoIdsComputables);
  const out: ImporteEntry[] = [];
  for (const entries of porCaso.values()) {
    out.push(...summableEntries(entries, opts).entries);
  }
  return out;
}

/** Total por caso (sólo casos en `casoIdsComputables`), ordenado desc. Útil
 *  para el ranking de /graficas. `firmeOnly` aplica el toggle. */
export function totalesPorCaso(
  allEntries: ImporteEntry[],
  casoIdsComputables: Set<string>,
  opts: SummableOpts = {},
): TotalCaso[] {
  const porCaso = agruparPorCaso(allEntries, casoIdsComputables);
  const out: TotalCaso[] = [];
  for (const [casoId, entries] of porCaso) {
    const { entries: sumables, basis } = summableEntries(entries, opts);
    if (!sumables.length || !basis) continue;
    out.push({
      casoId,
      total: sumables.reduce((a, e) => a + e.importe, 0),
      basis,
      naturalezas: Array.from(
        new Set(sumables.map((e) => e.naturaleza).filter((n): n is ImporteNaturaleza => Boolean(n))),
      ),
    });
  }
  return out.sort((a, b) => b.total - a.total);
}

export interface TotalNaturaleza {
  naturaleza: ImporteNaturaleza;
  total: number;
  casoIds: string[];
}

/** Reparte el dinero sumable (mismo conjunto que alimenta los totales por caso)
 *  por naturaleza, para que el agregado transversal no mezcle un préstamo con
 *  un perjuicio o una multa. Σ buckets == Σ totales por caso. */
export function totalesPorNaturaleza(
  allEntries: ImporteEntry[],
  casoIdsComputables: Set<string>,
  opts: SummableOpts = {},
): TotalNaturaleza[] {
  const buckets = new Map<ImporteNaturaleza, { total: number; casos: Set<string> }>();
  for (const e of summableComputables(allEntries, casoIdsComputables, opts)) {
    const nat = e.naturaleza ?? 'otro';
    const b = buckets.get(nat) ?? { total: 0, casos: new Set<string>() };
    b.total += e.importe;
    b.casos.add(e.casoId);
    buckets.set(nat, b);
  }
  return Array.from(buckets.entries())
    .map(([naturaleza, b]) => ({ naturaleza, total: b.total, casoIds: Array.from(b.casos) }))
    .sort((a, b) => b.total - a.total);
}

// --- Agregación por sujeto (persona / organización) --------------------------
// El importe se atribuye explícitamente por sujeto y papel económico
// (importe_atribucion). Cada cubeta es de UN papel (y por tanto de UNA clase):
// nunca se mezclan ni se suman entre papeles. Una cantidad de un Hecho
// `componente`, `exculpatorio`/`desmentido`/`no_concluyente` se muestra pero no
// acumula al total de la cubeta. Las vistas por sujeto NO se suman entre sujetos
// (la responsabilidad solidaria se atribuye íntegra a cada obligado), así que
// aquí no aplica el anti-doble-conteo entre sujetos.

/** Orden de presentación de las cubetas en la ficha de un sujeto. */
export const PAPEL_ORDEN: ImportePapel[] = [
  'beneficiario',
  'activo',
  'perjudicado',
  'obligado',
  'acreedor',
];

export interface CifraSujetoItem {
  entry: ImporteEntry;
  papel: ImportePapel;
  /** importe_sujeto si lo hay; si no, el importe del Hecho. */
  importeSujeto: number;
  /** Aplica nota específica de la atribución a este sujeto, si existe. */
  notaSujeto?: string;
  /** Contribuye al total de la cubeta (no es componente ni no-acumulable). */
  acumula: boolean;
}

export interface CubetaSujeto {
  papel: ImportePapel;
  clase: ImporteClase;
  total: number | null;
  items: CifraSujetoItem[];
}

export interface AnalisisSujeto {
  sujeto: string;
  cubetas: CubetaSujeto[];
  /** Hay al menos una cifra (acumule o no) atribuida al sujeto. */
  hayCifras: boolean;
}

/** Devuelve las cubetas de cifras de un sujeto (persona u organización),
 *  agrupadas por papel económico y ordenadas por PAPEL_ORDEN. Sólo cubetas con
 *  alguna entrada. `total` es null si ninguna entrada de la cubeta acumula. */
export function analizarSujeto(allEntries: ImporteEntry[], sujeto: string): AnalisisSujeto {
  const porPapel = new Map<ImportePapel, CifraSujetoItem[]>();
  for (const entry of allEntries) {
    for (const a of entry.atribucion) {
      if (a.sujeto !== sujeto) continue;
      const importeSujeto = a.importeSujeto ?? entry.importe;
      const acumula =
        !EPIS_NO_ACUMULA.has(entry.tipo) && entry.alcance !== 'componente';
      const item: CifraSujetoItem = {
        entry,
        papel: a.papel,
        importeSujeto,
        notaSujeto: a.nota,
        acumula,
      };
      const arr = porPapel.get(a.papel);
      if (arr) arr.push(item);
      else porPapel.set(a.papel, [item]);
    }
  }

  const cubetas: CubetaSujeto[] = [];
  for (const papel of PAPEL_ORDEN) {
    const items = porPapel.get(papel);
    if (!items || items.length === 0) continue;
    const acumulables = items.filter((it) => it.acumula);
    const total = acumulables.length
      ? acumulables.reduce((s, it) => s + it.importeSujeto, 0)
      : null;
    // Dentro de cada cubeta, primero las cifras que acumulan, mayor importe arriba.
    items.sort((x, y) => Number(y.acumula) - Number(x.acumula) || y.importeSujeto - x.importeSujeto);
    cubetas.push({ papel, clase: PAPEL_CLASE[papel], total, items });
  }
  return { sujeto, cubetas, hayCifras: cubetas.length > 0 };
}

/** "Importe presuntamente atribuido" a un sujeto, para previews e inventarios:
 *  suma de las cubetas `beneficiario` + `activo` (clase objeto) — el dinero en
 *  juego que el procedimiento vincula a su conducta. NO incluye el perjuicio
 *  sufrido (papel `perjudicado`, propio de víctimas) ni las consecuencias.
 *  Misma semántica que el "Importe atribuido" por caso de /casos. 0 si no hay. */
export function importeAtribuidoSujeto(analisis: AnalisisSujeto): number {
  return analisis.cubetas
    .filter((c) => c.papel === 'beneficiario' || c.papel === 'activo')
    .reduce((s, c) => s + (c.total ?? 0), 0);
}
