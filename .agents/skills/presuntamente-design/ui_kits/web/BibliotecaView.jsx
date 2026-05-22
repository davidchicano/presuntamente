/* Biblioteca global de documentos · Acerca */

function BibliotecaView() {
  const docs = window.PRESUNTAMENTE_DATA.biblioteca_global;
  const [level, setLevel] = React.useState('all');
  const filtered = docs.filter(d => level === 'all' || d.n === level);

  return (
    <main className="main">
      <section className="page-id">
        <div>
          <p className="page-id__eyebrow">Sección 5 · Biblioteca</p>
          <h1 className="page-id__title">Documentos primarios</h1>
          <p className="page-id__sub">Documentos citados en al menos un caso. Cada uno se sirve con su enlace canónico, su espejo de archive.org y, cuando disponible, el hash sha256 de la copia local.</p>
        </div>
        <div className="page-id__meta">
          <span>Total: {docs.length}</span>
          <span>·</span>
          <span>Mostrando: {filtered.length}</span>
        </div>
      </section>

      <SectionH num="5.1" title="Filtros" />
      <div className="filter-bar">
        <div className="field">
          <label htmlFor="nivel">Nivel de fuente</label>
          <select id="nivel" value={level} onChange={e => setLevel(e.target.value)}>
            <option value="all">Todos los niveles</option>
            <option value="N1">N1 — Primario</option>
            <option value="N2">N2 — Procesal / pericial</option>
            <option value="N3">N3 — Oficial / medio</option>
            <option value="N4">N4 — Partisana</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="prod">Productor</label>
          <select id="prod">
            <option>Todos</option>
            <option>Tribunal Supremo</option>
            <option>Audiencia Nacional</option>
            <option>Tribunal Constitucional</option>
            <option>UDEF</option>
            <option>BOE</option>
            <option>SEPI</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="caso">Caso</label>
          <select id="caso">
            <option>Todos</option>
            <option>Caso Gürtel</option>
            <option>Caso Plus Ultra</option>
            <option>ERE de Andalucía</option>
            <option>Operación Kitchen</option>
          </select>
        </div>
        <button className="btn">Aplicar</button>
      </div>

      <SectionH num="5.2" title="Listado" right={`${filtered.length} documentos`} />
      <div className="stack">
        {filtered.map((d, i) => <DocumentoCard key={i} doc={d} withCase />)}
      </div>
    </main>
  );
}

function AcercaView() {
  return (
    <main className="main main--narrow">
      <section className="page-id">
        <div>
          <p className="page-id__eyebrow">Sección 6 · Sobre el proyecto</p>
          <h1 className="page-id__title">presuntamente.org — qué es y cómo funciona</h1>
          <p className="page-id__sub">Inventario público, open-source y políticamente neutro de los procedimientos judiciales relevantes en España. Cada afirmación cita su fuente y su nivel de fuente.</p>
        </div>
        <div className="page-id__meta">
          <span>v0.0.0-alpha</span>
        </div>
      </section>

      <SectionH num="A.1" title="Principios irrenunciables" />
      <div className="prose">
        <p><strong>1. Imputación ≠ condena.</strong> El modelo distingue investigado, procesado, acusado, condenado, absuelto y desimputado. Nunca afirmaciones que insinúen culpabilidad sin sentencia firme.</p>
        <p><strong>2. Cada afirmación con su fuente y su nivel.</strong> Los hechos exigen documento de respaldo con nivel (1–4) visible. Sin citación, no hay hecho.</p>
        <p><strong>3. Tratamiento sin cuota política.</strong> Casos vivos o cerrados, de cualquier partido, ordenados por relevancia objetiva.</p>
      </div>

      <SectionH num="A.2" title="Niveles de fuente" />
      <table className="tbl">
        <thead>
          <tr>
            <th style={{width:'12%'}}>Nivel</th>
            <th style={{width:'34%'}}>Tipo</th>
            <th>Ejemplo</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><LevelBadge n={1} /></td><td>Primario judicial</td><td className="c-mono">Sentencia · auto · providencia</td></tr>
          <tr><td><LevelBadge n={2} /></td><td>Procesal / pericial</td><td className="c-mono">Escrito de acusación · informe UDEF</td></tr>
          <tr><td><LevelBadge n={3} /></td><td>Oficial / medio</td><td className="c-mono">BOE · BOPA · medio con cita verificada</td></tr>
          <tr><td><LevelBadge n={4} /></td><td>Partisana</td><td className="c-mono">Nota de prensa · comparecencia política</td></tr>
        </tbody>
      </table>

      <SectionH num="A.3" title="Licencias y rectificación" />
      <div className="prose">
        <p>Código publicado bajo <a href="#">AGPL-3.0</a>. Contenido editorial (fichas, textos, datos estructurados) bajo <a href="#">CC BY-SA 4.0</a>.</p>
        <p>El derecho de rectificación está garantizado. Para proponer una corrección o aportar fuente: <a href="#">abrir issue ↗</a>, o escribir al maintainer.</p>
      </div>
    </main>
  );
}

Object.assign(window, { BibliotecaView, AcercaView });
