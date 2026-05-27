# Página /casos

> Componente: `src/components/pages/PgCasos.astro` · Wrapper: `src/pages/casos/index.astro`

## Estado actual

Listado tabular de casos con leyenda de estados de ficha a ancho completo (antes de la sección 1.1 Filtros), filtros (búsqueda, fase procesal, orden) + cinco columnas tras el refactor de afectación del 2026-05-27 (noche):

1. **Caso** — nombre mediático + `EstadoPublicacionBadge` compacto en la misma línea + mini-descripción de `sintesis_caso.que_se_investiga` (fallback `descripcion_corta`).
2. **Fase** — `PhaseBadge`.
3. **Órgano** — acrónimo en mono + nombre oficial del procedimiento debajo. La celda es clicable a la página de la organización.
4. **Organizaciones afectadas** — columna unificada con sub-listas **Directa** e **Indirecta**, deduplicadas por `organizacion_id`. La derivación pasa por [`src/lib/afectacion.ts`](../../../src/lib/afectacion.ts), que lee `VinculoInstitucional` con `nivel_afectacion` y agrupa por nivel. Las directas llevan `RolBadge` cuando hay rol procesal equivalente (`investigado` / `perjudicado`) o microtag de texto cuando es `ambito_administrativo_directo_del_acto_en_caso`. Las indirectas usan `PartidoBadge` si la organización es `tipo: partido_politico` o nombre llano en otro caso. La acusación popular **no aparece aquí**: figura en participación procesal de la ficha. Canon: [`docs/diseno/08-afectacion-directa-indirecta.md`](../../diseno/08-afectacion-directa-indirecta.md).
5. **Último hito** — fecha en mono + título truncado a ~90 caracteres (texto completo en `title=` para hover).

Filas en estado `pendiente`/`borrador` aparecen no clicables en producción (`tr.is-blocked`) pero visibles para transparencia. En dev local todas son clicables.

## Ideas futuras

### v1 pre-launch

- Pulir copy del eyebrow y sub del page-id (Bloque C de revisión editorial humana).

### v1.x

- Filtro nuevo por «Nivel de afectación» (Directa / Indirecta) con auto-completado de organización.
- Filtro nuevo por «Partido afectado» derivado de las indirectas que son `tipo: partido_politico`.

### Sin compromiso

- Vista alternativa de tarjeta para móvil (hoy la tabla hace scroll horizontal).
- Densidad seleccionable (compacta / cómoda).

## Aprendizajes y decisiones editoriales

- **Mini-descripción debe ser breve y útil**, no resumen ejecutivo. Cambio 2026-05-26: pasamos de `descripcion_corta` a `sintesis_caso.que_se_investiga`, que rinde mejor en escaneo rápido.
- **Estado de ficha junto al nombre, no en columna propia.** Quita peso visual y deja claro de un vistazo qué fichas están maduras.
- **Órgano clicable.** La columna acrónimo (AN, JCI 4) era texto plano; ahora es enlace a la org porque el lector que quiere saber qué juzgado es debe llegar de un clic.
- **`RolBadge` para naturaleza institucional, no strings.** «perjudicada» en texto frente a `RolBadge` perjudicado en la ficha era inconsistencia visible. Decisión 2026-05-26: usar mapping `entidad_investigada_en_caso → investigado`, `perjudicado_institucional_en_caso → perjudicado`. Tras el refactor del 2026-05-27, `acusacion_institucional_en_caso` deja de usarse aquí (no es afectación) y `ambito_administrativo_directo_del_acto_en_caso` se etiqueta como microtag de texto en lugar de `RolBadge` (no es rol procesal).
- **Acusación popular no es afectación.** Refactor 2026-05-27: el bug visual de Kitchen mostrando "Podemos · ACUSACIÓN POPULAR" en la columna se eliminó separando afectación editorial de papel procesal. Canon en doc 08.
- **Dedupe centralizado.** Toda la lógica de deduplicación por `organizacion_id` y el orden por nivel viven en `src/lib/afectacion.ts`. Listado, ficha y home leen del mismo módulo: añadir un punto de uso nuevo no requiere reimplementar dedupe.
- **Columna «Implicados» eliminada.** Era un número muerto que no marketing nada al lector. Decisión maintainer 2026-05-26 (tarde).
- **Último hito truncado.** Antes ocupaba mucho alto en filas con titulares largos. Truncado a ~90 chars + tooltip con texto completo.
- **Partidos como chips, no badge enum.** Cada caso puede tocar varios partidos por motivos distintos; un único badge no captura la pluralidad. Decisión 2026-05-26.
- **Leyenda antes de la sección Filtros.** Decisión 2026-05-26: bloque `catalog-legend` a ancho completo, sólo estado de ficha (sin fases procesales), colocado entre el page-id y el apartado 1.1. El copy distingue ciclo editorial del inventario vs. situación procesal del caso.

## Pendientes operativos

- [x] Mini-descripción por `que_se_investiga`. **Entregado 2026-05-26 (tarde).**
- [x] Último hito truncado. **Entregado 2026-05-26 (tarde).**
- [x] Quitar columna Implic. **Entregado 2026-05-26 (tarde).**
- [x] Órgano clicable. **Entregado 2026-05-26 (tarde).**
- [x] `RolBadge` en columna Organización afectada. **Entregado 2026-05-26 (tarde).**
- [x] Nueva columna `Partidos afectados`. **Entregado 2026-05-26 (tarde).**
- [x] Refactor a `PartidoBadge` con colores por partido + dedupe. **Entregado 2026-05-27.** Detalle en [`../features/partido-badge.md`](../features/partido-badge.md).
- [x] **Refactor estructural "Organizaciones afectadas (directa/indirecta)"** — fusión de columnas 4 y 5 + dedupe centralizado en [`src/lib/afectacion.ts`](../../../src/lib/afectacion.ts) + acusación popular fuera de la columna. **Entregado 2026-05-27 (noche).** Detalle en [`../features/afectacion-directa-indirecta.md`](../features/afectacion-directa-indirecta.md).
