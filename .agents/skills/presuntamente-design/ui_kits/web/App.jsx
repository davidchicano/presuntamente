/* App root — router muy simple (sin librería).
 * Vistas:
 *   home          · listado de casos
 *   ficha         · ficha de un caso (siempre Gürtel en el demo)
 *   personas      · listado de personas
 *   persona       · ficha de una persona (siempre Francisco Correa en el demo)
 *   organizaciones· listado de organizaciones
 *   organizacion  · ficha de una organización (siempre AN en el demo)
 *   biblioteca    · listado global de documentos
 *   acerca        · sobre el proyecto
 */
function App() {
  const [view, setView] = React.useState('home');

  const jump = (id) => {
    setView(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openCase   = (_slug) => jump('ficha');
  const openPersona = (_slug) => jump('persona');
  const openOrg    = (_slug) => jump('organizacion');

  return (
    <div className="page">
      <a className="skip" href="#main">Saltar al contenido</a>
      <SiteHeader view={view} onNav={jump} />
      {view === 'home'           ? <HomeView onOpenCase={openCase} /> : null}
      {view === 'ficha'          ? <FichaView /> : null}
      {view === 'personas'       ? <PersonasIndex onOpenPersona={openPersona} /> : null}
      {view === 'persona'        ? <PersonaPage onOpenCase={openCase} onBack={() => jump('personas')} /> : null}
      {view === 'organizaciones' ? <OrganizacionesIndex onOpenOrg={openOrg} /> : null}
      {view === 'organizacion'   ? <OrganizacionPage onOpenCase={openCase} onBack={() => jump('organizaciones')} /> : null}
      {view === 'biblioteca'     ? <BibliotecaView /> : null}
      {view === 'acerca'         ? <AcercaView /> : null}
      <SiteFooter />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
