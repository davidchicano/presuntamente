/* presuntamente — chrome del sitio.
 * Header tipo ministerio: banda navy + bloque identitario blanco con logo
 * + wordmark + subtítulo institucional. Nav en negativo sobre navy.
 * Sub-strip de utilidad inmediatamente debajo (gris frío, breadcrumb/meta).
 */

function SiteHeader({ view, onNav }) {
  const tabs = [
    { id: 'home',           label: 'Casos' },
    { id: 'personas',       label: 'Personas' },
    { id: 'organizaciones', label: 'Organizaciones' },
    { id: 'biblioteca',     label: 'Biblioteca' },
    { id: 'acerca',         label: 'Sobre' },
  ];
  const navKey = {
    ficha: 'home',
    persona: 'personas',
    organizacion: 'organizaciones',
  }[view] || view;

  const breadcrumb = {
    home:           ['Inicio', 'Casos'],
    ficha:          ['Inicio', 'Casos', 'Caso Gürtel'],
    personas:       ['Inicio', 'Personas'],
    persona:        ['Inicio', 'Personas', 'Francisco Correa Sánchez'],
    organizaciones: ['Inicio', 'Organizaciones'],
    organizacion:   ['Inicio', 'Organizaciones', 'Audiencia Nacional'],
    biblioteca:     ['Inicio', 'Biblioteca'],
    acerca:         ['Inicio', 'Sobre'],
  }[view] || ['Inicio'];

  return (
    <header>
      <div className="site-header">
        <div className="site-header__inner">
          <a href="#" className="site-brand" onClick={(e) => { e.preventDefault(); onNav('home'); }}>
            <img src="logo.png" alt="" className="site-brand__logo" />
            <span className="site-brand__text">
              <span className="site-brand__name">presuntamente</span>
              <span className="site-brand__sub">Inventario público de casos de corrupción · v0.0.0-alpha</span>
            </span>
          </a>
          <nav className="site-nav" aria-label="Principal">
            {tabs.map(t => (
              <a key={t.id}
                 href={`#${t.id}`}
                 className={navKey === t.id ? 'is-active' : ''}
                 onClick={(e) => { e.preventDefault(); onNav(t.id); }}>{t.label}</a>
            ))}
          </nav>
          <div className="site-lang" aria-label="Idioma">
            <a href="#" className="is-on">ES</a>
            <span className="sep">/</span>
            <a href="#">CAT</a>
          </div>
        </div>
      </div>
      <div className="site-substrip">
        <div className="site-substrip__inner">
          <span>
            {breadcrumb.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 ? <span> / </span> : null}
                {i === breadcrumb.length - 1
                  ? <span style={{color:'var(--color-fg)'}}>{c}</span>
                  : <a href="#">{c}</a>}
              </React.Fragment>
            ))}
          </span>
          <span>Última actualización · 2026-05-21 14:32 UTC · sha 3f1a…b27d</span>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <h6>presuntamente</h6>
          <p>Inventario público, interactivo y open-source de los casos de corrupción más relevantes en España.</p>
          <p className="meta">© 2026 · build sha256:a91c…fd0e · v0.0.0-alpha</p>
        </div>
        <div>
          <h6>Marco</h6>
          <a href="#">Aviso legal</a>
          <a href="#">Política editorial</a>
          <a href="#">Cómo se redacta esto</a>
        </div>
        <div>
          <h6>Licencias</h6>
          <a href="#">Código · AGPL-3.0</a>
          <a href="#">Contenido · CC BY-SA 4.0</a>
          <a href="#">Hash del build</a>
        </div>
        <div>
          <h6>Rectificación</h6>
          <a href="#">Proponer corrección ↗</a>
          <a href="#">Contactar maintainer</a>
          <a href="#">CONTRIBUTING.md</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { SiteHeader, SiteFooter });
