/* Persona — página y listado.
 * Trayectoria temporal completa (full swimlane) + cargos + casos en formato tabla.
 */

function TrayectoriaSwimlane({ periodos, axisStart = 2009, axisEnd = 2026 }) {
  const total = axisEnd - axisStart;
  const ticks = [];
  for (let y = axisStart; y <= axisEnd; y += Math.ceil(total / 6)) ticks.push(y);
  if (ticks[ticks.length - 1] !== axisEnd) ticks.push(axisEnd);

  const periodToBar = (p) => {
    const start = parseInt((p.desde || `${axisStart}-01`).slice(0, 4), 10);
    const startMonth = parseInt((p.desde || `${axisStart}-01`).slice(5, 7), 10) || 1;
    const startVal = start + (startMonth - 1) / 12;
    const endStr = p.hasta || `${axisEnd}-12`;
    const end = parseInt(endStr.slice(0, 4), 10);
    const endMonth = parseInt(endStr.slice(5, 7), 10) || 12;
    const endVal = end + (endMonth - 1) / 12;
    const leftPct = ((startVal - axisStart) / total) * 100;
    const widthPct = ((endVal - startVal) / total) * 100;
    return { leftPct, widthPct };
  };

  return (
    <div className="trayectoria" role="img" aria-label={`Trayectoria: ${periodos.map(p => `${p.label} ${p.desde || ''}–${p.hasta || 'hoy'}`).join(', ')}`}>
      <div className="trayectoria__axis">
        <span />
        <div className="trayectoria__axis-ticks">
          {ticks.map(y => <span key={y}>{y}</span>)}
        </div>
      </div>
      {periodos.map((p, i) => {
        const { leftPct, widthPct } = periodToBar(p);
        return (
          <div className="trayectoria__row" key={i}>
            <div className="trayectoria__label">
              {p.label}
              <span className="dates">{p.desde || '—'} → {p.hasta || 'vigente'}</span>
            </div>
            <div className="trayectoria__bar-track">
              <div className={`trayectoria__bar trayectoria__bar--${p.kind}`}
                   style={{ left: `${leftPct}%`, width: `${widthPct}%` }}>
                {p.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Tabla compacta de casos donde aparece una entidad */
function CasesByEntityTable({ items, onOpen }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th style={{width:'38%'}}>Caso</th>
          <th style={{width:'22%'}}>Rol en el caso</th>
          <th style={{width:'14%'}}>Fase</th>
          <th style={{width:'26%'}}>Último hito</th>
        </tr>
      </thead>
      <tbody>
        {items.map((c, i) => (
          <tr key={i} onClick={() => onOpen && onOpen(c.slug)}>
            <td><span className="c-name">{c.nombre}</span></td>
            <td>{c.rol}</td>
            <td><PhaseBadge fase={c.fase} phaseKind={c.phaseKind} /></td>
            <td className="c-mono">{c.ultimo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PersonaPage({ onOpenCase, onBack }) {
  const p = window.PRESUNTAMENTE_DATA.persona_focus;

  return (
    <main className="main">
      <section className="entity-mast">
        <PersonaPhoto
          src={p.foto && p.foto.src}
          alt={p.foto && p.foto.alt}
          autor={p.foto && p.foto.autor}
          licencia={p.foto && p.foto.licencia}
          year={p.foto && p.foto.year}
          iniciales={p.iniciales}
        />
        <div>
          <p className="entity-mast__eyebrow">Ficha de persona · {p.figura_publica ? 'Figura pública' : 'Persona privada'}</p>
          <h1 className="entity-mast__name">{p.nombre}</h1>
          <p className="entity-mast__lede">{p.descripcion_neutra}</p>
          <div className="entity-mast__row">
            {p.roles_actuales.map((r, i) => <Badge key={i} kind="phase-firme">{r}</Badge>)}
            <span className="sep">·</span>
            <span><strong>{p.casos.length}</strong> casos referenciados</span>
            <span className="sep">·</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onBack && onBack(); }}>← Volver al listado</a>
          </div>
        </div>
      </section>

      <SectionH num="1." title="Trayectoria procesal" right="Roles vigentes y cerrados, sin ocultar absoluciones" />
      <TrayectoriaSwimlane periodos={p.swim_periodos} axisStart={2009} axisEnd={2026} />

      <div className="aviso mt-4">
        Esta trayectoria refleja roles procesales pasados y vigentes. La presunción de inocencia se aplica en cada fase hasta sentencia firme. <strong>Imputación ≠ condena</strong>.
      </div>

      <SectionH num="2." title="Cargos públicos y privados" right="Sólo cuando constan en fuentes oficiales" />
      <table className="cargos-list">
        <thead>
          <tr>
            <th style={{width:'30%'}}>Cargo</th>
            <th style={{width:'45%'}}>Organización</th>
            <th style={{width:'25%'}}>Periodo</th>
          </tr>
        </thead>
        <tbody>
          {p.cargos_pasados.map((c, i) => (
            <tr key={i}>
              <td className="col-rol">{c.rol}</td>
              <td>{c.org}</td>
              <td className="col-date">{c.desde} – {c.hasta || 'vigente'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SectionH num="3." title="Casos donde aparece" right={`${p.casos.length} casos`} />
      <CasesByEntityTable items={p.casos} onOpen={onOpenCase} />

      <SectionH num="4." title="Documentos asociados" right={`${p.documentos.length} documentos`} />
      <div className="stack">
        {p.documentos.map((d, i) => <DocumentoCard key={i} doc={d} />)}
      </div>

      <div className="aviso aviso--accent mt-6">
        Esta ficha presenta información pública sobre los procedimientos judiciales en los que aparece la persona referenciada. Las personas mencionadas como investigadas o procesadas se presumen <strong>inocentes</strong> hasta que recaiga sentencia firme.
      </div>
    </main>
  );
}

function PersonasIndex({ onOpenPersona }) {
  const personas = window.PRESUNTAMENTE_DATA.personas_index;
  return (
    <main className="main">
      <section className="page-id">
        <div>
          <p className="page-id__eyebrow">Sección 3 · Personas</p>
          <h1 className="page-id__title">Catálogo de personas</h1>
          <p className="page-id__sub">Personas referenciadas en los casos. Cada persona enlaza con su ficha (trayectoria procesal completa + casos donde aparece). <strong>Imputación ≠ condena.</strong></p>
        </div>
        <div className="page-id__meta">
          <span>Total: {personas.length}</span>
        </div>
      </section>

      <SectionH num="3.1" title="Listado" right={`${personas.length} personas`} />
      <table className="tbl">
        <thead>
          <tr>
            <th style={{width:'38%'}}>Nombre</th>
            <th style={{width:'34%'}}>Cargo (si público)</th>
            <th style={{width:'18%'}}>Rol procesal vigente</th>
            <th style={{width:'10%'}} className="c-num">Casos</th>
          </tr>
        </thead>
        <tbody>
          {personas.map(p => (
            <tr key={p.slug} onClick={() => onOpenPersona(p.slug)}>
              <td><span className="c-name">{p.nombre}</span></td>
              <td>{p.cargo}</td>
              <td>{p.roles.map((r, i) => <Badge key={i} kind="phase-firme">{r}</Badge>)}</td>
              <td className="c-num">{p.casos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

Object.assign(window, { PersonaPage, PersonasIndex, TrayectoriaSwimlane, CasesByEntityTable });
