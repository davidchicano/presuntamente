// richProse — detecta micro-componentes inline (DESIGN.md — "Component Stylings") y los envuelve
// en HTML compatible con los estilos `.money` y `.acron` de global.css.
//
// Cobertura v1:
//   - Money chip: detecta "53 millones de euros", "53 mill. de euros",
//     "5.000.000 €", "53,5 M€", "1 millón de euros"… Convierte a forma
//     corta canónica (53 M€, 5 M€, 53,5 M€) y conserva el texto original
//     en `title=` para tooltip.
//   - Acrónimos institucionales (UDEF, AN, JCI, CGPJ, SEPI…) por la lista
//     blanca base + alias cortos del inventario.
//   - Organizaciones por nombre completo y nombres_alternativos largos
//     (case-sensitive, word-boundary Unicode).
//   - Personas por nombre_completo y nombres_alternativos
//     (case-sensitive, word-boundary Unicode).
//   - Delitos por nombre típico (gateado tras `enableDelitos`, off por
//     defecto porque hoy `/delitos/<slug>` no es ruta web).
//   - Escape hatch: [[org:slug|label]], [[persona:slug|label]],
//     [[delito:slug|label]], [[€:53,5 M€]]. Cuando el autor del YAML lo
//     escribe explícitamente, se respeta y no se vuelve a auto-procesar.
//
// Anti-falsos-positivos:
//   - El caller (PgPersonaDetalle, PgOrganizacionDetalle) pasa
//     excludeOrgIds / excludePersonaIds para que la propia ficha no
//     se autoenlace a sí misma desde su descripción/biografía.
//   - Titulares, breadcrumbs y nombre_oficial NUNCA se invocan a través
//     de RichProse — son texto plano en el caller. Esta restricción se
//     mantiene en el codebase actual y no se modifica desde aquí.
//   - Match case-sensitive en orgs y personas para evitar capturas
//     accidentales en minúsculas; delitos van case-insensitive
//     (nombre común que puede aparecer al inicio de frase).
//   - Word-boundary Unicode (`\p{L}\p{N}` lookaround) en lugar de `\b`
//     ASCII para no fallar con acentos y `ñ` (sin esto, "\bBegoña\b" no
//     ancla porque el `\b` ASCII ve transición word→non-word entre la
//     "o" y la "ñ").
//
// El texto se escapa siempre antes de emitir HTML; los inputs YAML pueden
// contener `<`, `&`, `"` sin riesgo.

import { formatGroupedNumber } from '@/lib/money';

type Lang = 'es' | 'ca';

export type OrgLite = {
  id: string;
  nombre: string;
  nombres_alternativos?: string[];
  siglas?: string;
};

export type PersonaLite = {
  id: string;
  nombre_completo: string;
  nombres_alternativos?: string[];
};

export type DelitoLite = {
  id: string;
  nombre_tipico: string;
};

export type GlosarioLite = {
  id: string;
  label: string;
  nombres_alternativos?: string[];
  descripcion_breve: string;
};

export interface EnrichOpts {
  orgs: OrgLite[];
  personas?: PersonaLite[];
  delitos?: DelitoLite[];
  glosario?: GlosarioLite[];
  excludeOrgIds?: string[];
  excludePersonaIds?: string[];
  /** Activa la auto-detección de delitos. Off por defecto: hoy
   *  /delitos/<slug> no se renderiza como ruta web. Activar en Fase 2
   *  cuando exista `/delitos/[slug].astro`. */
  enableDelitos?: boolean;
  lang?: Lang;
}

/** Lista blanca base de acrónimos institucionales (DESIGN.md — "Component Stylings"). Si la
 *  organización existe en /content/organizaciones/ con un slug equivalente, se enlaza;
 *  si no, se renderiza con tooltip sin link. */
const ACRONIMOS_BASE: Record<string, string> = {
  UDEF: 'Unidad de Delincuencia Económica y Fiscal',
  UCO: 'Unidad Central Operativa de la Guardia Civil',
  AN: 'Audiencia Nacional',
  TS: 'Tribunal Supremo',
  TC: 'Tribunal Constitucional',
  TSJ: 'Tribunal Superior de Justicia',
  AP: 'Audiencia Provincial',
  JCI: 'Juzgado Central de Instrucción',
  JI: 'Juzgado de Instrucción',
  BOE: 'Boletín Oficial del Estado',
  CGPJ: 'Consejo General del Poder Judicial',
  SEPI: 'Sociedad Estatal de Participaciones Industriales',
  AEAT: 'Agencia Estatal de Administración Tributaria',
  FGE: 'Fiscalía General del Estado',
  CIS: 'Centro de Investigaciones Sociológicas',
  AIReF: 'Autoridad Independiente de Responsabilidad Fiscal',
  CNMV: 'Comisión Nacional del Mercado de Valores',
  CNMC: 'Comisión Nacional de los Mercados y la Competencia',
  IGAE: 'Intervención General de la Administración del Estado',
  PSOE: 'Partido Socialista Obrero Español',
  PP: 'Partido Popular',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Money parsing / shortening ---------------------------------------------

function parseEuropeanNumber(s: string): number {
  const hasComma = s.includes(',');
  const hasPeriod = s.includes('.');
  if (hasComma) {
    // Convención española: "," = decimal, "." = miles.
    return parseFloat(s.replace(/\./g, '').replace(',', '.'));
  }
  if (hasPeriod) {
    // Sólo es separador de miles si todos los grupos tras el primer punto
    // tienen exactamente 3 dígitos (5.000, 5.000.000). Si no, "." es
    // decimal (caso anómalo "2.1" que igualmente toleramos).
    const parts = s.split('.');
    const allThousands = parts.length > 1 && parts.slice(1).every((p) => p.length === 3);
    if (allThousands) return parseFloat(parts.join(''));
    return parseFloat(s);
  }
  return parseFloat(s);
}

function shortenMoney(amount: string, unit: string): string {
  const num = parseEuropeanNumber(amount);
  if (Number.isNaN(num)) return `${amount} ${unit}`.trim();
  const u = unit.toLowerCase();
  const isMillionsUnit =
    u === 'm€' || /^(?:millones?|mill\.|millón)(?:\s+de\s+euros)?$/.test(u);
  const euros = isMillionsUnit ? num * 1_000_000 : num;
  if (euros >= 1_000_000) {
    const millions = euros / 1_000_000;
    return `${formatGroupedNumber(millions)} M€`;
  }
  // Por debajo del millón: dejar en € (sin acortar, normalizar a "X €").
  return `${formatGroupedNumber(euros)} €`;
}

// --- Tokenizador ------------------------------------------------------------

interface Candidate {
  start: number;
  end: number;
  html: string;
  priority: number;
}

function pushTermCandidates(
  text: string,
  term: string,
  href: string | undefined,
  tooltip: string | undefined,
  priority: number,
  caseInsensitive: boolean,
  out: Candidate[],
): void {
  if (!term) return;
  // Boundary Unicode: no preceder ni seguir por letra o dígito (acepta
  // signos de puntuación, espacios, "º", "·", "(", "[", etc.).
  // Cualquier whitespace literal del término (típicamente un espacio
  // entre palabras) se vuelve "\s+" en la regex porque los YAML con
  // block scalar `|` envuelven en saltos de línea (ej. "Audiencia\n
  // Nacional"); si el regex usa espacio literal pierde la coincidencia.
  const flexibleTerm = escapeRegex(term).replace(/\s+/g, '\\s+');
  const pattern = `(?<![\\p{L}\\p{N}])${flexibleTerm}(?![\\p{L}\\p{N}])`;
  const flags = caseInsensitive ? 'gui' : 'gu';
  const re = new RegExp(pattern, flags);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const matched = m[0];
    const tooltipAttr = tooltip ? ` title="${escapeHtml(tooltip)}"` : '';
    const html = href
      ? `<a class="acron acron--link" href="${href}"${tooltipAttr}>${escapeHtml(matched)}</a>`
      : `<span class="acron"${tooltipAttr}>${escapeHtml(matched)}</span>`;
    out.push({
      start: m.index,
      end: m.index + matched.length,
      html,
      priority,
    });
    if (m[0].length === 0) re.lastIndex++;
  }
}

function pushMoneyCandidates(text: string, out: Candidate[]): void {
  // amount: forma con miles (5.000.000 / 1.234,56), forma decimal con coma
  // (53,5), decimal con punto tolerado (2.1), o entero (53).
  const amountPattern = String.raw`\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?`;
  // unit: alternativas ordenadas largas→cortas para que la regex elija
  // primero "millones de euros" frente a "millones" cuando ambos encajen.
  const unitPattern = [
    'M€',
    'm€',
    'millones\\s+de\\s+euros',
    'millón\\s+de\\s+euros',
    'mill\\.\\s+de\\s+euros',
    'millones',
    'millón',
    'euros',
    '€',
  ].join('|');
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}])(${amountPattern})\\s*(${unitPattern})(?![\\p{L}\\p{N}])`,
    'gu',
  );
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const [full, amount, unit] = m;
    const shortened = shortenMoney(amount, unit);
    // Colapsamos whitespace interno: los YAML con block scalar `|`
    // pueden envolver el match entre "amount" y "unit" en un salto de
    // línea (ej. "113.509,32\neuros") que afea el tooltip.
    const raw = full.trim().replace(/\s+/g, ' ');
    out.push({
      start: m.index,
      end: m.index + full.length,
      html: `<span class="money" data-money data-money-raw="${escapeHtml(
        raw,
      )}" title="${escapeHtml(raw)}">${escapeHtml(shortened)}</span>`,
      priority: 0,
    });
  }
}

function isAcronymLike(s: string): boolean {
  // "Sigla": todo mayúsculas (incluido º) sin espacios internos de palabra,
  // longitud 2-12. Se permite "AIReF" porque es una sigla con minúscula
  // central canónica — la incluimos como caso especial vía la base.
  return /^[A-ZÁÉÍÓÚÑ0-9.º\s]{2,12}$/.test(s);
}

function isLongName(s: string): boolean {
  // Multi-palabra, o suficientemente larga, o con minúsculas → tratada
  // como nombre largo (case-sensitive). Excluye siglas puras.
  if (s.length > 12) return true;
  if (/\s/.test(s)) return true;
  if (s !== s.toUpperCase()) return true;
  return false;
}

function processSegment(text: string, opts: EnrichOpts): string {
  if (!text) return '';
  const lang = opts.lang ?? 'es';
  const orgsPrefix = lang === 'ca' ? '/cat/organizaciones' : '/organizaciones';
  const personasPrefix = lang === 'ca' ? '/cat/personas' : '/personas';
  const delitosPrefix = lang === 'ca' ? '/cat/delitos' : '/delitos';

  const excludeOrgs = new Set(opts.excludeOrgIds ?? []);
  const excludePersonas = new Set(opts.excludePersonaIds ?? []);

  const candidates: Candidate[] = [];

  // 1. Money chip — prioridad máxima (0).
  pushMoneyCandidates(text, candidates);

  // 2. Acrónimos base + alias cortos del inventario (prioridad 10).
  const findOrgByAcronym = (term: string): OrgLite | undefined => {
    const lower = term.toLowerCase();
    return opts.orgs.find((o) => {
      if (excludeOrgs.has(o.id)) return false;
      if (o.id.toLowerCase() === lower) return true;
      if (o.nombre.toLowerCase() === lower) return true;
      if ((o.siglas ?? '').toLowerCase() === lower) return true;
      const alts = o.nombres_alternativos ?? [];
      return alts.some((a) => a.toLowerCase() === lower);
    });
  };

  const seenAcronTerm = new Set<string>();
  for (const [term, fallbackTooltip] of Object.entries(ACRONIMOS_BASE)) {
    if (seenAcronTerm.has(term)) continue;
    seenAcronTerm.add(term);
    const match = findOrgByAcronym(term);
    const href = match ? `${orgsPrefix}/${match.id}` : undefined;
    const tooltip = match?.nombre ?? fallbackTooltip;
    pushTermCandidates(text, term, href, tooltip, 10, false, candidates);
  }

  // Alias cortos del inventario que no estén en la base.
  for (const o of opts.orgs) {
    if (excludeOrgs.has(o.id)) continue;
    const shorts = new Set<string>();
    if (o.siglas) shorts.add(o.siglas);
    for (const a of o.nombres_alternativos ?? []) shorts.add(a);
    for (const term of shorts) {
      if (!isAcronymLike(term)) continue;
      if (seenAcronTerm.has(term)) continue;
      seenAcronTerm.add(term);
      pushTermCandidates(text, term, `${orgsPrefix}/${o.id}`, o.nombre, 10, false, candidates);
    }
  }

  // 3. Organizaciones por nombre largo / alternativos largos
  //    (case-sensitive, prioridad 20).
  //    Ordenamos por longitud DESC para que el match más específico gane
  //    cuando varias entradas empiecen en la misma posición.
  type LongTerm = { term: string; href: string; tooltip: string };
  const orgLong: LongTerm[] = [];
  for (const o of opts.orgs) {
    if (excludeOrgs.has(o.id)) continue;
    const terms = new Set<string>();
    terms.add(o.nombre);
    for (const a of o.nombres_alternativos ?? []) terms.add(a);
    for (const term of terms) {
      if (!isLongName(term)) continue;
      orgLong.push({ term, href: `${orgsPrefix}/${o.id}`, tooltip: o.nombre });
    }
  }
  orgLong.sort((a, b) => b.term.length - a.term.length);
  for (const t of orgLong) {
    pushTermCandidates(text, t.term, t.href, t.tooltip, 20, false, candidates);
  }

  // 4. Personas (case-sensitive, prioridad 25). Todas las alternativas se
  //    incluyen, confiando en el criterio del editor del YAML al añadirlas.
  //    El case-sensitive elimina la mayoría de falsos positivos comunes
  //    ("zapateros" en minúsculas no enlaza; "Zapatero" sí).
  const personaTerms: LongTerm[] = [];
  for (const p of opts.personas ?? []) {
    if (excludePersonas.has(p.id)) continue;
    const terms = new Set<string>();
    terms.add(p.nombre_completo);
    for (const a of p.nombres_alternativos ?? []) terms.add(a);
    for (const term of terms) {
      personaTerms.push({
        term,
        href: `${personasPrefix}/${p.id}`,
        tooltip: p.nombre_completo,
      });
    }
  }
  personaTerms.sort((a, b) => b.term.length - a.term.length);
  for (const t of personaTerms) {
    pushTermCandidates(text, t.term, t.href, t.tooltip, 25, false, candidates);
  }

  // 5. Delitos (case-insensitive, prioridad 30) — sólo si está habilitado.
  if (opts.enableDelitos) {
    const delitoTerms: LongTerm[] = [];
    for (const d of opts.delitos ?? []) {
      delitoTerms.push({
        term: d.nombre_tipico,
        href: `${delitosPrefix}/${d.id}`,
        tooltip: d.nombre_tipico,
      });
    }
    delitoTerms.sort((a, b) => b.term.length - a.term.length);
    for (const t of delitoTerms) {
      pushTermCandidates(text, t.term, t.href, t.tooltip, 30, true, candidates);
    }
  }

  // 6. Glosario (case-sensitive, prioridad 35). Programa públicos por
  //    nombre comercial, operaciones policiales nombradas, sobrenombres
  //    de tramas. Renderizadas como span con tooltip — sin link interno
  //    porque no son páginas del inventario, ni externo por seguridad
  //    editorial (NUNCA Wikipedia).
  const glosarioTerms: Array<{ term: string; tooltip: string }> = [];
  for (const g of opts.glosario ?? []) {
    const terms = new Set<string>();
    terms.add(g.label);
    for (const a of g.nombres_alternativos ?? []) terms.add(a);
    const tooltip = g.descripcion_breve.trim().replace(/\s+/g, ' ');
    for (const term of terms) {
      glosarioTerms.push({ term, tooltip });
    }
  }
  glosarioTerms.sort((a, b) => b.term.length - a.term.length);
  for (const t of glosarioTerms) {
    pushTermCandidates(text, t.term, undefined, t.tooltip, 35, false, candidates);
  }

  // 7. Resolver solapamientos: ordenamos por start ASC, end DESC (longer
  //    wins en igual start), prioridad ASC (menor priority gana). Greedy
  //    seleccionamos no-solapados.
  candidates.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    if (a.end !== b.end) return b.end - a.end;
    return a.priority - b.priority;
  });

  const accepted: Candidate[] = [];
  let lastEnd = 0;
  for (const c of candidates) {
    if (c.start < lastEnd) continue;
    accepted.push(c);
    lastEnd = c.end;
  }

  // 8. Stitch: tramos de texto plano se escapan al vuelo; cada candidato
  //    inserta su HTML ya construido.
  let out = '';
  let cursor = 0;
  for (const c of accepted) {
    if (c.start > cursor) out += escapeHtml(text.slice(cursor, c.start));
    out += c.html;
    cursor = c.end;
  }
  if (cursor < text.length) out += escapeHtml(text.slice(cursor));
  return out;
}

// --- Escape hatch ------------------------------------------------------------

const ESCAPE_HATCH_RE = /\[\[([^:\[\]]+):([^|\]]+?)(?:\|([^\]]*))?\]\]/g;

function buildEscapeHatchHtml(
  kindRaw: string,
  slugRaw: string,
  labelRaw: string | undefined,
  opts: EnrichOpts,
): string {
  const lang = opts.lang ?? 'es';
  const orgsPrefix = lang === 'ca' ? '/cat/organizaciones' : '/organizaciones';
  const personasPrefix = lang === 'ca' ? '/cat/personas' : '/personas';
  const delitosPrefix = lang === 'ca' ? '/cat/delitos' : '/delitos';
  const kind = kindRaw.trim().toLowerCase();
  const slug = slugRaw.trim();
  const label = (labelRaw ?? '').trim();
  switch (kind) {
    case 'org': {
      // [[org:slug|label]] → label es lo que se ve, slug es la ruta.
      const text = label || slug;
      return `<a class="acron acron--link" href="${orgsPrefix}/${slug}">${escapeHtml(text)}</a>`;
    }
    case 'persona': {
      const text = label || slug;
      return `<a class="acron acron--link" href="${personasPrefix}/${slug}">${escapeHtml(text)}</a>`;
    }
    case 'delito': {
      const text = label || slug;
      return opts.enableDelitos
        ? `<a class="acron acron--link" href="${delitosPrefix}/${slug}">${escapeHtml(text)}</a>`
        : escapeHtml(text);
    }
    case '€':
    case 'money': {
      // [[€:53,5 M€]] — el primer hueco es lo que se renderiza.
      // [[€:53,5 M€|cifra exacta cuantificada por la UCM]] — el primer
      // hueco es el chip, el label es el tooltip largo.
      const display = slug;
      const tooltip = label || slug;
      return `<span class="money" data-money data-money-raw="${escapeHtml(
        tooltip,
      )}" title="${escapeHtml(tooltip)}">${escapeHtml(display)}</span>`;
    }
    default:
      // Tipo desconocido: dejamos el literal del YAML como está, escapado.
      return escapeHtml(`[[${kindRaw}:${slug}${label ? `|${label}` : ''}]]`);
  }
}

// --- API pública ------------------------------------------------------------

/** Enriquece prosa con micro-componentes inline. Devuelve HTML listo para
 *  inyectar con `set:html`. Cualquier HTML accidental en el input se
 *  escapa. */
export function richProse(input: string, opts: EnrichOpts): string {
  if (!input) return '';

  // Particionamos por escape-hatches para que el segmento entre `[[...]]`
  // procese auto-detección normal y el contenido del hatch se respete
  // verbatim (con el href explícito del autor).
  let out = '';
  let cursor = 0;
  let m: RegExpExecArray | null;
  ESCAPE_HATCH_RE.lastIndex = 0;
  while ((m = ESCAPE_HATCH_RE.exec(input)) !== null) {
    if (m.index > cursor) {
      out += processSegment(input.slice(cursor, m.index), opts);
    }
    out += buildEscapeHatchHtml(m[1], m[2], m[3], opts);
    cursor = m.index + m[0].length;
  }
  if (cursor < input.length) {
    out += processSegment(input.slice(cursor), opts);
  }
  return out;
}
