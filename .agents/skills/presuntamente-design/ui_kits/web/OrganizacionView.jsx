/* Organización — página y listado. Densidad administrativa. */

function OrganizacionPage({ onOpenCase, onBack }) {
  const o = window.PRESUNTAMENTE_DATA.organizacion_focus;
  return (
    <main className="main">
      <section className="entity-mast">
        <OrgGlyph tipo={o.tipo} large />
        <div>
          <p className="entity-mast__eyebrow">Ficha de organización · {o.tipo}</p>
          <h1 className="entity-mast__name">{o.nombre}</h1>
          <p className="entity-mast__lede">{o.descripcion_neutra}</p>
          <div className="entity-mast__row">
            <span><strong>Sede:</strong> {o.sede}</span>
            <span className="sep">·</span>
            <span><strong>Fundada:</strong> {o.fundada}</span>
            <span className="sep">·</span>
            <a href={o.enlace_oficial} target="_blank" rel="noreferrer">Enlace oficial ↗</a>
            <span className="sep">·</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onBack && onBack(); }}>← Volver al listado</a>
          </div>
        </div>
      </section>

      <SectionH num="1." title="Casos donde aparece" right={`${o.casos.length} casos · rol indicado por caso`} />
      <CasesByEntityTable items={o.casos} onOpen={onOpenCase} />

      <SectionH num="2." title="Documentos producidos por esta organización" right={`${o.documentos.length} documentos`} />
      <div className="stack">
        {o.documentos.map((d, i) => <DocumentoCard key={i} doc={d} />)}
      </div>

      <div className="aviso mt-6">
        Las organizaciones aparecen catalogadas por su <strong>rol procesal</strong> en cada caso (órgano instructor, fiscalía, acusación popular, organización investigada, etc.). El catálogo es neutro respecto a la naturaleza pública o privada de la entidad.
      </div>
    </main>
  );
}

function OrganizacionesIndex({ onOpenOrg }) {
  const orgs = window.PRESUNTAMENTE_DATA.organizaciones_index;
  return (
    <main className="main">
      <section className="page-id">
        <div>
          <p className="page-id__eyebrow">Sección 4 · Organizaciones</p>
          <h1 className="page-id__title">Catálogo de organizaciones</h1>
          <p className="page-id__sub">Toda persona jurídica con rol procesal en alguno de los casos: órganos judiciales y fiscales, policía judicial, partidos políticos, asociaciones de acusación popular, empresas, organismos públicos.</p>
        </div>
        <div className="page-id__meta">
          <span>Total: {orgs.length}</span>
        </div>
      </section>

      <SectionH num="4.1" title="Listado" right={`${orgs.length} organizaciones`} />
      <table className="tbl">
        <thead>
          <tr>
            <th style={{width:'5%'}} aria-label="Símbolo"></th>
            <th style={{width:'41%'}}>Nombre</th>
            <th style={{width:'24%'}}>Tipo de entidad</th>
            <th style={{width:'20%'}}>Sede</th>
            <th style={{width:'10%'}} className="c-num">Casos</th>
          </tr>
        </thead>
        <tbody>
          {orgs.map(o => (
            <tr key={o.slug} onClick={() => onOpenOrg(o.slug)}>
              <td><OrgGlyph tipo={o.tipo} /></td>
              <td><span className="c-name">{o.nombre}</span></td>
              <td><Badge>{o.tipo}</Badge></td>
              <td className="c-mono">{o.sede}</td>
              <td className="c-num">{o.casos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

Object.assign(window, { OrganizacionPage, OrganizacionesIndex });
