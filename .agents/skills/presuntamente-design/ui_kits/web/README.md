# UI kit — web (sitio principal de presuntamente.org)

Recreación visual del sitio. Construido con React + Babel inline para que sea
ejecutable en un único `index.html` sin build. En producción los componentes
viven en Astro 5 con `.astro` + CSS nativo + Open Props.

## Estructura

```
index.html             · entry. importa React + Babel + scripts JSX
styles.css             · estilos del UI kit (importa colors_and_type.css del root)
data.js                · fixtures: casos, ficha Gürtel, persona, organización, biblioteca
Components.jsx         · átomos: Icon · Badge · Cite · Hito · Hecho · Contraposicion · DocumentoCard · PersonaCard · SectionH
SiteChrome.jsx         · SiteHeader (Casos / Personas / Organizaciones / Biblioteca / Sobre) · SiteFooter
HomeView.jsx           · listado de casos con buscador y filtro de fase
FichaView.jsx          · ficha de caso (Gürtel) con TOC sticky, cronología, hechos epistémicos, contraposición, biblioteca, meta-redacción
PersonaView.jsx        · PersonaPage (trayectoria full-size + cargos + casos) + PersonasIndex
OrganizacionView.jsx   · OrganizacionPage (rol por caso + documentos producidos) + OrganizacionesIndex
BibliotecaView.jsx     · BibliotecaView (documentos globales) + AcercaView (sobre)
App.jsx                · router simple
```

## Vistas demostradas

1. **Home** — listado de casos. Buscar, filtrar por fase, abrir ficha.
2. **Ficha del caso** — Gürtel, con todas las secciones canónicas de
   `docs/diseno/02-ficha-de-caso.md`.
3. **Personas** — listado + página individual con **swimlane de trayectoria
   full-size** (roles vigentes y cerrados visibles), cargos públicos y
   privados, listado de casos donde aparece, documentos asociados.
4. **Organizaciones** — listado + página individual con **rol de la
   organización en cada caso** y documentos que ha producido. Cataloga
   juzgados, fiscalías, policía judicial, partidos políticos, asociaciones
   de acusación popular, empresas y organismos públicos por igual.
5. **Biblioteca** — listado global de documentos filtrable por nivel.
6. **Sobre** — principios, niveles de fuente, licencias, rectificación.

## Lo que NO está implementado (a propósito)

- Persistencia, búsqueda full-text real, i18n, routing real (Astro lo hace).
- Visualización de grafo de conexiones (§3.4 doc 02). Necesita datos reales.
- Catalán (carpetas `/cat/` upstream están vacías).
- Subida de PDFs, watcher pipeline, validación de schemas.

Estas son omisiones deliberadas: el UI kit replica la **apariencia** y los
componentes; no es producción.

## Cómo probar

Abrir `index.html` en el navegador. No requiere build.
