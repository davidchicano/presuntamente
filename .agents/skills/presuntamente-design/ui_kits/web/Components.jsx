/* ----------------------------------------------------------------------------
 * presuntamente — átomos compartidos del UI kit.
 * Export al window al final para que sean accesibles desde otros scripts JSX.
 * -------------------------------------------------------------------------- */

/* Iconos Lucide inline (subconjunto). Stroke 1.5, no fill. */
const ICON_PATHS = {
  gavel: '<path d="M14 13l-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10"/><path d="M22 7l-3-3"/><path d="m14 9 6-6"/>',
  landmark: '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  newspaper: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6"/><path d="M9 17h6"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  external: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  archive: '<rect x="2" y="4" width="20" height="5"/><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M10 13h4"/>',
  // Organización glyphs (uno por tipo de entidad)
  building: '<rect x="4" y="2" width="16" height="20"/><path d="M9 22V12h6v10"/><line x1="8" y1="6" x2="9" y2="6"/><line x1="12" y1="6" x2="13" y2="6"/><line x1="16" y1="6" x2="17" y2="6"/><line x1="8" y1="9" x2="9" y2="9"/><line x1="12" y1="9" x2="13" y2="9"/><line x1="16" y1="9" x2="17" y2="9"/>',
  column: '<line x1="6" y1="22" x2="6" y2="6"/><line x1="12" y1="22" x2="12" y2="6"/><line x1="18" y1="22" x2="18" y2="6"/><polygon points="3 6 21 6 19 2 5 2"/><line x1="3" y1="22" x2="21" y2="22"/>',
  asterisk: '<line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="8.5" x2="18" y2="15.5"/><line x1="6" y1="15.5" x2="18" y2="8.5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  briefcase: '<rect x="3" y="8" width="18" height="12"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="3" y1="13" x2="21" y2="13"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a3.5 3.5 0 0 1 5 3.5V20"/>',
  scales: '<line x1="12" y1="3" x2="12" y2="21"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="6" y1="6" x2="6" y2="11"/><line x1="18" y1="6" x2="18" y2="11"/><path d="M2 13 a 4 4 0 0 0 8 0"/><path d="M14 13 a 4 4 0 0 0 8 0"/>',
};

function Icon({ name, size = 16 }) {
  const path = ICON_PATHS[name] || ICON_PATHS.file;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: 'inline-block', flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
}

/* ---------- Badge ---------- */
function Badge({ children, kind = '', icon }) {
  return (
    <span className={`badge ${kind ? 'badge--' + kind : ''}`}>
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
    </span>
  );
}

function PhaseBadge({ fase, phaseKind }) {
  return <Badge kind={`phase-${phaseKind || 'instr'}`}>{fase}</Badge>;
}

function LevelBadge({ n }) {
  return <Badge kind={`n${n}`}>{`N${n}`}</Badge>;
}

/* ---------- Citación inline ---------- */
function Cite({ n, label }) {
  return (
    <kbd className="cite">
      <span className="n">N{n}</span>
      <span>·</span>
      <span>{label}</span>
    </kbd>
  );
}

/* ---------- Calendar glyph para fechas con precisión ---------- */
const MES_ABBR = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
function CalGlyph({ fecha }) {
  if (!fecha || fecha === 'en curso' || fecha === '—') {
    return (
      <div className="cal-wrap">
        <div className="cal-glyph cal-glyph--vacio" title={fecha || '—'}>
          <div className="cal-glyph__band">·</div>
          <div className="cal-glyph__day">{fecha === 'en curso' ? 'en curso' : '—'}</div>
        </div>
        {fecha ? <span className="cal-raw">({fecha})</span> : null}
      </div>
    );
  }
  // YYYY-MM-DD
  const dayMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (dayMatch) {
    const [, y, m, d] = dayMatch;
    return (
      <div className="cal-wrap">
        <div className="cal-glyph" title={fecha}>
          <div className="cal-glyph__band">{MES_ABBR[parseInt(m,10)-1]}</div>
          <div className="cal-glyph__day">{parseInt(d,10)}</div>
          <div className="cal-glyph__year">{y}</div>
        </div>
        <span className="cal-raw">({fecha})</span>
      </div>
    );
  }
  // YYYY-MM
  const monMatch = /^(\d{4})-(\d{2})$/.exec(fecha);
  if (monMatch) {
    const [, y, m] = monMatch;
    return (
      <div className="cal-wrap">
        <div className="cal-glyph cal-glyph--mes" title={fecha}>
          <div className="cal-glyph__band">{MES_ABBR[parseInt(m,10)-1]}</div>
          <div className="cal-glyph__day">––</div>
          <div className="cal-glyph__year">{y}</div>
        </div>
        <span className="cal-raw">({fecha})</span>
      </div>
    );
  }
  // YYYY
  const yMatch = /^(\d{4})$/.exec(fecha);
  if (yMatch) {
    return (
      <div className="cal-wrap">
        <div className="cal-glyph cal-glyph--ano" title={fecha}>
          <div className="cal-glyph__band">año</div>
          <div className="cal-glyph__day">{yMatch[1]}</div>
        </div>
        <span className="cal-raw">({fecha})</span>
      </div>
    );
  }
  // Fallback
  return (
    <div className="cal-wrap">
      <div className="cal-glyph cal-glyph--vacio" title={fecha}>
        <div className="cal-glyph__band">·</div>
        <div className="cal-glyph__day">{fecha}</div>
      </div>
      <span className="cal-raw">({fecha})</span>
    </div>
  );
}

/* ---------- Hito (cronología) ---------- */
function Hito({ hito }) {
  return (
    <div className="timeline__item">
      <div className="timeline__date"><CalGlyph fecha={hito.fecha} /></div>
      <article className="hito">
        <header className="hito__head">
          <Badge icon={hito.icon}>{hito.tipo}</Badge>
          {hito.indicadores ? <span className="muted mono" style={{ fontSize: 11 }}>{hito.indicadores}</span> : null}
        </header>
        <h4 className="hito__title">{hito.titulo}</h4>
        <p className="hito__desc">{hito.desc}</p>
      </article>
    </div>
  );
}

/* ---------- Hecho ---------- */
function Hecho({ hecho, kind }) {
  return (
    <article className={`hecho hecho--${kind}`}>
      <header className="hecho__head">
        <Badge kind={kind}>
          <span className="dot" />
          {kind === 'acreditado' ? 'Acreditado' : kind === 'investigado' ? 'Investigado' : kind === 'exculpatorio' ? 'Exculpatorio' : 'Desmentido'}
        </Badge>
        <span className="hecho__date">{hecho.fecha}</span>
      </header>
      <p className="hecho__text">{hecho.text}</p>
      <div className="hecho__sources">
        {hecho.sources.map((s, i) => (
          <div key={i} className="hecho__source">
            <LevelBadge n={s.n.replace('N', '')} />
            <a href={s.url}>{s.label}</a>
          </div>
        ))}
      </div>
    </article>
  );
}

/* ---------- Contraposición ---------- */
function Contraposicion({ data }) {
  return (
    <div className="contra">
      <div className="contra__head">{data.head}</div>
      <div className="contra__cols">
        <div className="contra__col">
          <div className="contra__actor">{data.a.actor}</div>
          <p className="contra__text">{data.a.text}</p>
          <div className="contra__src">
            <LevelBadge n={data.a.n.replace('N', '')} /> &nbsp; {data.a.src}
          </div>
        </div>
        <div className="contra__sep" />
        <div className="contra__col">
          <div className="contra__actor">{data.b.actor}</div>
          <p className="contra__text">{data.b.text}</p>
          <div className="contra__src">
            <LevelBadge n={data.b.n.replace('N', '')} /> &nbsp; {data.b.src}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Documento card ---------- */
function DocumentoCard({ doc, withCase = false }) {
  return (
    <a className="doc" href="#">
      <div className="doc__ico"><Icon name="file" size={18} /></div>
      <div>
        <h4 className="doc__title">{doc.titulo}</h4>
        <div className="doc__meta">
          <LevelBadge n={doc.n.replace('N', '')} />
          <span>{doc.productor}</span>
          <span>·</span>
          <span>{doc.fecha}</span>
          {doc.hash && doc.hash !== '—' ? (<><span>·</span><span>{doc.hash}</span></>) : null}
          {withCase && doc.caso ? (<><span>·</span><span>{doc.caso}</span></>) : null}
          {doc.citado ? (<><span>·</span><span>Citado en {doc.citado} hechos</span></>) : null}
        </div>
      </div>
      <div className="doc__links">
        <span><Icon name="external" size={12} /> Original</span>
        <span><Icon name="archive" size={12} /> Archivo</span>
      </div>
    </a>
  );
}

/* ---------- Persona ---------- */
function PersonaCard({ p }) {
  return (
    <article className="persona">
      <div className="persona__init" aria-hidden="true">{p.iniciales}</div>
      <div>
        <h4 className="persona__name">{p.nombre}</h4>
        <p className="persona__role">{p.cargo}{p.delitos ? ' · ' + p.delitos : ''}</p>
        <div className="persona__badges">
          {p.roles.map((r, i) => <Badge key={i} kind="phase-firme">{r}</Badge>)}
        </div>
        <div className="swimlane" role="img" aria-label={`Trayectoria: ${p.swim.map(s => s.label).join(' → ')}`}>
          {p.swim.map((s, i) => (
            <div key={i} className={`swimlane__seg seg--${s.kind}`}>{s.label}</div>
          ))}
        </div>
        <div className="swimlane__meta">
          {p.dates.map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>
    </article>
  );
}

/* ---------- Organización: glyph por tipo ----------
 * Persona usa iniciales en cuadrado. Organización usa icono geométrico
 * por tipo — nunca iniciales (DESIGN.md §4 "Diferenciación Persona vs Org").
 */
const ORG_GLYPHS = {
  // tipo canónico (slug) → [icon name, variant class]
  'organismo_judicial':         ['scales',    'judicial'],
  'tribunal':                   ['scales',    'judicial'],
  'juzgado':                    ['scales',    'judicial'],
  'fiscalia':                   ['column',    'fiscal'],
  'policia_judicial':           ['shield',    'policia'],
  'partido_politico':           ['users',     'partido'],
  'empresa':                    ['briefcase', 'empresa'],
  'organismo_publico':          ['building',  'organismo'],
  'asociacion_acusacion_popular':['asterisk', 'asoc'],
  'asociacion':                 ['asterisk',  'asoc'],
  // alias castellano
  'Organismo judicial':         ['scales',    'judicial'],
  'Fiscalía':                   ['column',    'fiscal'],
  'Policía judicial':           ['shield',    'policia'],
  'Partido político':           ['users',     'partido'],
  'Empresa':                    ['briefcase', 'empresa'],
  'Organismo público':          ['building',  'organismo'],
  'Asociación / acus. popular': ['asterisk',  'asoc'],
};
function OrgGlyph({ tipo, large = false }) {
  const [iconName, variant] = ORG_GLYPHS[tipo] || ['building', 'organismo'];
  return (
    <div className={`org-glyph org-glyph--${variant}`} aria-hidden="true">
      <Icon name={iconName} size={large ? 32 : 20} />
    </div>
  );
}

/* ---------- Citación inline: Money + Acronym ---------- */
function Money({ amount, children }) {
  // amount overrides children for canonical display
  return <span className="cite-money">{amount || children}</span>;
}

/* Acrónimos auto-resolvibles a /organizaciones/<slug>. Lookup en data; si
 * existe link interno, si no sólo tooltip. NUNCA enlace a Wikipedia (DESIGN.md). */
const ACRONYM_LOOKUP = {
  AN:    { full: 'Audiencia Nacional',           slug: 'audiencia-nacional' },
  TS:    { full: 'Tribunal Supremo',             slug: 'tribunal-supremo' },
  TC:    { full: 'Tribunal Constitucional',      slug: null },
  TSJ:   { full: 'Tribunal Superior de Justicia',slug: null },
  AP:    { full: 'Audiencia Provincial',         slug: null },
  JCI:   { full: 'Juzgado Central de Instrucción', slug: null },
  JI:    { full: 'Juzgado de Instrucción',       slug: null },
  UDEF:  { full: 'Unidad de Delincuencia Económica y Fiscal', slug: 'udef' },
  UCO:   { full: 'Unidad Central Operativa (GC)',slug: null },
  CGPJ:  { full: 'Consejo General del Poder Judicial', slug: null },
  FGE:   { full: 'Fiscalía General del Estado',  slug: null },
  BOE:   { full: 'Boletín Oficial del Estado',   slug: null },
  SEPI:  { full: 'Sociedad Estatal de Participaciones Industriales', slug: 'sepi' },
  AEAT:  { full: 'Agencia Estatal de Administración Tributaria', slug: null },
  CIS:   { full: 'Centro de Investigaciones Sociológicas', slug: null },
};
function Acronym({ children, ref: refProp }) {
  const key = (refProp || children || '').toString().trim();
  const entry = ACRONYM_LOOKUP[key];
  if (!entry) {
    return <span className="cite-acronym" data-tooltip={key}>{children}</span>;
  }
  if (entry.slug) {
    return (
      <a className="cite-acronym cite-acronym--linked"
         href={`#org-${entry.slug}`}
         data-tooltip={entry.full}
         onClick={(e) => e.preventDefault()}>
        {children}
      </a>
    );
  }
  return <span className="cite-acronym" data-tooltip={entry.full}>{children}</span>;
}

/* ---------- PersonaPhoto: imagen con licencia obligatoria ----------
 * Sólo en ficha individual de Persona y sólo si figura_publica.
 * Pie de foto obligatorio: autor + licencia + año. Sin imagen libre,
 * fallback a iniciales (DESIGN.md §4 "Política de imágenes").
 */
function PersonaPhoto({ src, alt, autor, licencia, year, iniciales }) {
  if (!src) {
    return (
      <div className="persona-photo-figure">
        <div className="persona__init" style={{width:72,height:72,fontSize:24}}>{iniciales}</div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--color-fg-subtle)',maxWidth:72,lineHeight:1.3}}>Sin imagen libre disponible.</div>
      </div>
    );
  }
  return (
    <figure className="persona-photo-figure">
      <img className="persona-photo" src={src} alt={alt || ''} />
      <figcaption>{autor} · {licencia} · {year}</figcaption>
    </figure>
  );
}
function SectionH({ num, title, right, id }) {
  return (
    <header className="sec-h" id={id}>
      <span className="num">{num}</span>
      <h2>{title}</h2>
      {right ? <span className="right">{right}</span> : null}
    </header>
  );
}

Object.assign(window, {
  Icon, Badge, PhaseBadge, LevelBadge, Cite,
  Hito, Hecho, Contraposicion, DocumentoCard, PersonaCard,
  SectionH,
  OrgGlyph, Money, Acronym, PersonaPhoto, CalGlyph,
});
