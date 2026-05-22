/* Home — listado administrativo de casos.
 * Densidad de tabla, no de tarjetas.
 */
function HomeView({ onOpenCase }) {
  const cases = window.PRESUNTAMENTE_DATA.cases;
  const [q, setQ] = React.useState('');
  const [phase, setPhase] = React.useState('all');
  const [order, setOrder] = React.useState('hito');

  let filtered = cases.filter(c => {
    const hitQ = !q || (c.mediatico + ' ' + c.oficial + ' ' + c.organo).toLowerCase().includes(q.toLowerCase());
    const hitP = phase === 'all' || c.phaseKind === phase;
    return hitQ && hitP;
  });
  if (order === 'hito') filtered = [...filtered].sort((a,b) => b.ultimo_hito.fecha.localeCompare(a.ultimo_hito.fecha));
  if (order === 'implicados') filtered = [...filtered].sort((a,b) => b.implicados - a.implicados);

  return (
    <main className="main">
      <section className="page-id">
        <div>
          <p className="page-id__eyebrow">Sección 1 · Casos</p>
          <h1 className="page-id__title">Catálogo de casos</h1>
          <p className="page-id__sub">Listado de los procedimientos judiciales relevantes registrados en el sistema. Cada caso enlaza con su ficha completa, sus personas y los documentos primarios que lo respaldan.</p>
        </div>
        <div className="page-id__meta">
          <span>Total: {cases.length}</span>
          <span>·</span>
          <span>Mostrando: {filtered.length}</span>
        </div>
      </section>

      <SectionH num="1.1" title="Filtros" />
      <div className="filter-bar">
        <div className="field">
          <label htmlFor="q">Buscar</label>
          <input id="q" type="search" placeholder="Caso, organización, número de procedimiento…"
                 value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="phase">Fase procesal</label>
          <select id="phase" value={phase} onChange={e => setPhase(e.target.value)}>
            <option value="all">Todas</option>
            <option value="instr">Instrucción</option>
            <option value="juicio">Juicio oral</option>
            <option value="firme">Sentencia firme</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="order">Ordenar por</label>
          <select id="order" value={order} onChange={e => setOrder(e.target.value)}>
            <option value="hito">Último hito ↓</option>
            <option value="implicados">Implicados ↓</option>
          </select>
        </div>
        <button className="btn">Aplicar</button>
      </div>

      <SectionH num="1.2" title="Listado" right={`${filtered.length} casos · orden: último hito`} />
      <div className="tbl-caption">
        <span>Tabla 1 · Catálogo de casos</span>
        <span>Última actualización del listado: 2026-05-21</span>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th style={{width:'34%'}}>Caso</th>
            <th style={{width:'14%'}}>Fase</th>
            <th style={{width:'22%'}}>Órgano</th>
            <th style={{width:'8%'}} className="c-num">Implic.</th>
            <th style={{width:'22%'}}>Último hito</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.slug} onClick={() => onOpenCase(c.slug)}>
              <td>
                <span className="c-name">{c.mediatico}</span>
                <span className="c-name__sub">{c.oficial}</span>
              </td>
              <td><PhaseBadge fase={c.fase} phaseKind={c.phaseKind} /></td>
              <td className="c-mono">{c.organo}</td>
              <td className="c-num">{c.implicados}</td>
              <td>
                <div className="c-date">{c.ultimo_hito.fecha}</div>
                <div style={{fontSize:'var(--font-size-0)', color:'var(--color-fg-muted)', marginTop:2}}>{c.ultimo_hito.titulo}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 ? <p className="muted mt-4">Sin resultados para los filtros actuales.</p> : null}
    </main>
  );
}

Object.assign(window, { HomeView });
