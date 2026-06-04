// `cytoscape-fcose` no publica tipos propios ni hay paquete en `@types`.
// Declaración mínima: el export por defecto es una extensión registrable con
// `cytoscape.use(...)`. Las opciones del layout `fcose` se pasan como objeto
// suelto al construir el layout (Cytoscape ya tipa `LayoutOptions` de forma
// laxa para extensiones), así que aquí basta con tipar el registrador.
declare module "cytoscape-fcose" {
  import type cytoscape from "cytoscape";
  const ext: cytoscape.Ext;
  export default ext;
}
