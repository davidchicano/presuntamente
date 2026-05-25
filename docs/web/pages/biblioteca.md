# Página /biblioteca

> Componente: [`src/components/pages/PgBiblioteca.astro`](../../../src/components/pages/PgBiblioteca.astro) · Wrapper: [`src/pages/biblioteca/index.astro`](../../../src/pages/biblioteca/index.astro) · Helper de enlaces: [`src/lib/documentos.ts`](../../../src/lib/documentos.ts)

Listado global de todos los `Documento` del inventario. Filtros client-side por búsqueda, nivel de fuente y tipo. Orden por defecto: nivel ascendente (más oficiales primero) y fecha descendente.

## Estado actual

Tabla densa (`.tbl` + `.tbl-scroll`) con secciones numeradas 4.1 Filtros y 4.2 Listado.

- **Columnas**: Nivel · Documento · Productor · Fecha · Citado en · Enlaces.
- **Título clicable** cuando existe URL resoluble (`documentoPrimaryHref` en [`src/lib/documentos.ts`](../../../src/lib/documentos.ts)): copia local → URL canónica → archive.org.
- **Columna Enlaces**: muestra hasta tres accesos explícitos — `Local` (`ruta_local`), `Original ↗` (`url_canonica`), `Archive ↗` (`url_archivo`). Los enlaces van dentro de un `<div>` interno, no con `display: flex` directamente sobre el `<td>` (rompe `border-collapse` y desalinea los separadores horizontales).
- **Deep-linking**: cada fila tiene `id="doc-<slug>"` para anclas desde fichas de Persona/Organización cuando el documento no tiene URL abrible.
- **Fuera del patrón `tr.is-link`**: los documentos no tienen ficha propia; la navegación es por enlace explícito, no por fila clicable.

La biblioteca documental **del caso** (sección 8 de `PgCasoDetalle`) reutiliza [`DocumentoCard.astro`](../../../src/components/DocumentoCard.astro) con la misma prioridad de enlaces y título clicable.

## Ideas futuras

### v1.x

- Enlace desde la fila a la ficha del caso principal cuando `caso_principal_id` esté cumplimentado.
- Mostrar `hash_sha256` truncado en tooltip o sublínea para documentos con `ruta_local`.
- Filtro por caso en la barra de filtros.

### Sin compromiso

- Paginación o virtualización si el inventario supera ~200 documentos visibles a la vez.
- Export CSV del listado filtrado.

## Aprendizajes y decisiones editoriales

- **Prioridad de enlace única documentada en código.** [`documentoPrimaryHref`](../../../src/lib/documentos.ts) centraliza la regla para no duplicar lógica entre biblioteca global, biblioteca de caso, hitos, hechos y vínculos.
- **`documentoRespaldoHref` abre el documento, no sólo la ancla.** Los badges y citas enlazan al recurso cuando existe; la ancla `#doc-<id>` queda como fallback editorial cuando el YAML no tiene URL ni copia local.
- **No confundir biblioteca probatoria con cobertura mediática general.** Las piezas de [`cobertura-mediatica-general.md`](../features/cobertura-mediatica-general.md) no entran aquí.

## Pendientes operativos

- [ ] Añadir columna o sublínea de caso principal cuando haya más de un caso publicado y el listado global lo necesite para orientación.
- [ ] Revisar copy de etiquetas `Local` / `Original` / `Archive` tras feedback de lectores no técnicos.
