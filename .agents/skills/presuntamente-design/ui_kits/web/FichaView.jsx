/* Ficha del caso — la pantalla más densa del producto.
 * Layout administrativo: breadcrumb interno, mast con tabla resumen,
 * TOC sticky, numeración explícita en cada sección.
 */
function FichaView({ onOpenPersona, onOpenOrg }) {
  const f = window.PRESUNTAMENTE_DATA.ficha_gurtel;
  const [activeSec, setActiveSec] = React.useState('resumen');

  const tocItems = [
    { id: 'resumen',    n: '2.2', label: 'Resumen ejecutivo' },
    { id: 'estado',     n: '2.3', label: 'Estado procesal' },
    { id: 'personas',   n: '2.4', label: 'Personas implicadas' },
    { id: 'cronologia', n: '2.6', label: 'Cronología' },
    { id: 'hechos',     n: '2.7', label: 'Hechos' },
    { id: 'documentos', n: '2.8', label: 'Biblioteca del caso' },
    { id: 'redaccion',  n: '2.11',label: 'Cómo se redacta' },
  ];

  const goTo = (id) => {
    setActiveSec(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <main className="main">
      <section className="ficha-mast">
        <p className="ficha-mast__breadcrumb">
          <a href="#">Casos</a> &nbsp;/&nbsp; <span style={{color:'var(--color-fg)'}}>Caso Gürtel</span>
        </p>
        <h1 className="ficha-mast__name">{f.mediatico}</h1>
        <p className="ficha-mast__official">{f.oficial}</p>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-3)'}}>
          <table className="estado-table">
            <tbody>
              <tr><th>Fase</th>           <td><PhaseBadge fase={f.fase} phaseKind={f.phaseKind} /></td></tr>
              <tr><th>Órgano judicial</th><td>{f.organo}</td></tr>
              <tr><th>Fiscalía</th>       <td>{f.fiscal}</td></tr>
              <tr><th>N.º procedimiento</th><td className="mono">{f.oficial}</td></tr>
            </tbody>
          </table>
          <table className="estado-table">
            <tbody>
              <tr><th>Último hito</th>          <td>{f.ultimo_hito}</td></tr>
              <tr><th>Próximo evento</th>       <td className="mono">{f.next}</td></tr>
              <tr><th>Cifra resumen</th>        <td>{f.cifras}</td></tr>
              <tr><th>Personas implicadas</th>  <td className="mono">{f.personas.length} con rol activo</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="ficha-layout">
        <aside className="toc" aria-label="Índice de la ficha">
          <h6>En esta ficha</h6>
          <ol>
            {tocItems.map(t => (
              <li key={t.id}>
                <a href={`#${t.id}`}
                   className={activeSec === t.id ? 'is-active' : ''}
                   onClick={(e) => { e.preventDefault(); goTo(t.id); }}>
                  <span className="n">{t.n}</span>{t.label}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div>
          <SectionH id="resumen" num="2.2" title="Resumen ejecutivo" />
          <div className="prose">
            <p className="lede">{f.lede}</p>
            <p>
              El caso se inicia en 2007 a raíz de una denuncia anónima ante la <Acronym>FGE</Acronym>.
              La instrucción se asigna al <Acronym>JCI</Acronym> nº5 y posteriormente nº6 de la
              <span> </span><Acronym>AN</Acronym>. <Cite n="1" label="Auto inicial JCI nº5, 2009" />
            </p>
            <p>
              Durante la instrucción se separan piezas autónomas por ámbito territorial (Madrid, Valencia, Galicia)
              y por objeto. La pieza principal cifra en <Money amount="120 M€" /> los contratos públicos investigados;
              una pieza separada cuantifica en <Money amount="53,5 M€" /> el préstamo aprobado por <Acronym>SEPI</Acronym> a una compañía
              vinculada. <Cite n="1" label="Auto de separación, 2014" />
            </p>
            <p>
              La Sala Segunda del <Acronym>TS</Acronym> confirma en 2024 las condenas dictadas por la <Acronym>AN</Acronym>,
              agotando la vía ordinaria de recurso.
              <span> </span><Cite n="1" label="STS 1234/2024" />
            </p>
          </div>

          <SectionH id="estado" num="2.3" title="Estado procesal actual" right="Confrontar con BOE para fechas firmes" />
          <table className="estado-table" style={{maxWidth:'68ch'}}>
            <tbody>
              <tr><th>Fase actual</th>          <td><PhaseBadge fase={f.fase} phaseKind={f.phaseKind} /></td></tr>
              <tr><th>Órgano judicial</th>      <td>{f.organo}</td></tr>
              <tr><th>Fiscalía</th>             <td>{f.fiscal}</td></tr>
              <tr><th>N.º procedimiento</th>    <td className="mono">{f.oficial}</td></tr>
              <tr><th>Próximo evento previsto</th><td className="mono">{f.next}</td></tr>
            </tbody>
          </table>

          <SectionH id="personas" num="2.4" title="Personas implicadas" right={`${f.personas.length} con rol activo`} />
          <p className="sub-h">2.4.1 · Investigados / procesados / acusados / condenados</p>
          <div className="stack">
            {f.personas.map((p, i) => <PersonaCard key={i} p={p} />)}
          </div>

          <SectionH id="cronologia" num="2.6" title="Cronología — hitos del caso" right={`${f.hitos.length} hitos registrados`} />
          <div className="timeline">
            {f.hitos.map((h, i) => <Hito key={i} hito={h} />)}
          </div>

          <SectionH id="hechos" num="2.7" title="Hechos clasificados por estado epistémico" />

          <p className="sub-h">2.7.1 · Hechos acreditados</p>
          {f.hechos_acreditados.map((h, i) => <Hecho key={i} hecho={h} kind="acreditado" />)}

          <p className="sub-h">2.7.2 · Hechos bajo investigación</p>
          <div className="aviso">
            Los hechos en esta sección están bajo investigación judicial pero <strong>no han sido acreditados</strong>. Pueden ser confirmados, descartados o archivados en el futuro.
          </div>
          {f.hechos_investigados.map((h, i) => <Hecho key={i} hecho={h} kind="investigado" />)}

          <p className="sub-h">2.7.3 · Hechos en contraposición</p>
          <Contraposicion data={f.contraposicion} />

          <SectionH id="documentos" num="2.8" title="Biblioteca del caso" right={`${f.documentos.length} documentos`} />
          <div className="stack">
            {f.documentos.map((d, i) => <DocumentoCard key={i} doc={d} />)}
          </div>

          <SectionH id="redaccion" num="2.11" title="Cómo se ha redactado esta ficha" />
          <div className="meta-redaccion">
            <div className="meta-redaccion__cell"><h6>Maintainer</h6><div className="v">{f.redaccion.maintainer}</div></div>
            <div className="meta-redaccion__cell"><h6>Última revisión</h6><div className="v">{f.redaccion.revision}</div></div>
            <div className="meta-redaccion__cell"><h6>Última modificación</h6><div className="v">{f.redaccion.modificado}</div></div>
            <div className="meta-redaccion__cell"><h6>Niveles de fuente</h6><div className="v">{f.redaccion.niveles}</div></div>
          </div>

          <div className="aviso aviso--accent mt-6">
            Esta ficha presenta información pública sobre un procedimiento judicial. Las personas mencionadas como investigadas o procesadas se presumen <strong>inocentes</strong> hasta que recaiga sentencia firme.
          </div>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { FichaView });
