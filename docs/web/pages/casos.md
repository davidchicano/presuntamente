# Página /casos

> Componente: `src/components/pages/PgCasos.astro` · Wrapper: `src/pages/casos/index.astro`

## Estado actual

Listado tabular de casos con leyenda colapsable común (`CatalogoLeyenda`) antes de la sección 1.1, filtros (búsqueda, fase procesal, **estado de ficha**, **organizaciones afectadas multi-select**) + ordenación ampliada (último hito, **última actualización de la ficha**, **fase procesal ↑/↓**, implicados) + cinco columnas tras el refactor de afectación del 2026-05-27 (noche):

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

- Toggle dentro del multi-select de organizaciones para acotar a **sólo directa** o **sólo indirecta** (hoy la semántica es OR sobre ambos niveles).
- Filtro nuevo por «Partido afectado» derivado de las indirectas que son `tipo: partido_politico` (hoy aparecen indiferenciadas dentro del multi-select de organizaciones).
- Recordar selección de filtros/orden en la URL (`?phase=…&orgs=…`) para que se pueda compartir un listado pre-filtrado.

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
- **Leyenda antes de la sección Filtros.** Decisión 2026-05-26: bloque a ancho completo entre el page-id y el apartado 1.1. El copy distingue ciclo editorial del inventario vs. situación procesal del caso.
- **Leyenda común colapsable.** 2026-05-27: el bloque hardcoded se sustituyó por `CatalogoLeyenda`, basado en `<details>/<summary>` nativo, colapsado por defecto. La leyenda ya no es exclusiva de `/casos`; los cuatro catálogos la comparten. Detalle en [`../features/catalogos-comunes.md`](../features/catalogos-comunes.md).
- **Filtro multi-select de organizaciones inspirado en shadcn.** 2026-05-27: las opciones se rellenan **sólo con las orgs que realmente aparecen como afectadas** en algún caso del listado (vía `src/lib/afectacion.ts`). Decisión editorial: no engordar el desplegable con organizaciones del repo que no figuren en la columna. Semántica OR (un caso pasa si toca al menos una org seleccionada).
- **«Última actualización de la ficha» derivada de git log.** 2026-05-27: la fecha se calcula en build con `git log -1 --format=%aI -- content/casos/<slug>/` mediante [`src/lib/git-meta.ts`](../../../src/lib/git-meta.ts). En clones shallow (Cloudflare Pages) puede devolver vacío para casos no tocados en el HEAD; los casos sin fecha caen al final de esa ordenación.
- **Fase procesal ascendente/descendente.** 2026-05-27: orden numérico canónico de la pirámide procesal (instr=1 → archivo=5), con desempate por último hito ↓.

## Pendientes operativos

- [x] Mini-descripción por `que_se_investiga`. **Entregado 2026-05-26 (tarde).**
- [x] Último hito truncado. **Entregado 2026-05-26 (tarde).**
- [x] Quitar columna Implic. **Entregado 2026-05-26 (tarde).**
- [x] Órgano clicable. **Entregado 2026-05-26 (tarde).**
- [x] `RolBadge` en columna Organización afectada. **Entregado 2026-05-26 (tarde).**
- [x] Nueva columna `Partidos afectados`. **Entregado 2026-05-26 (tarde).**
- [x] Refactor a `PartidoBadge` con colores por partido + dedupe. **Entregado 2026-05-27.** Detalle en [`../features/partido-badge.md`](../features/partido-badge.md).
- [x] **Refactor estructural "Organizaciones afectadas (directa/indirecta)"** — fusión de columnas 4 y 5 + dedupe centralizado en [`src/lib/afectacion.ts`](../../../src/lib/afectacion.ts) + acusación popular fuera de la columna. **Entregado 2026-05-27 (noche).** Detalle en [`../features/afectacion-directa-indirecta.md`](../features/afectacion-directa-indirecta.md).
- [x] **Leyenda colapsable común** (`CatalogoLeyenda`) + **filtro estado de ficha** + **multi-select de organizaciones afectadas** (dinámico, OR) + **ordenación ampliada** (última actualización ↓ vía git log, fase ↑/↓). **Entregado 2026-05-27.** Detalle en [`../features/catalogos-comunes.md`](../features/catalogos-comunes.md).
- [x] **Pulido de iteración 2026-05-27**: botón "Limpiar filtros" movido al header de la sección Filtros (vía nuevo slot por defecto en `SectionH` + utility `.sec-h__action` + atributo `form="filters-casos"`); sección final "Más detalle metodológico" en la leyenda con enlace a [`/sobre#principios`](../../../src/components/pages/PgSobre.astro) + [`/sobre#niveles`](../../../src/components/pages/PgSobre.astro); fix del bug pre-existente del `<script is:inline>` per-instancia en `CustomSelect` (los selects secundarios `estado`, `orgs` y `order` no habían tenido listeners hasta este parche) y del bug `display: flex` vs `[hidden]` en `MultiSelectFilter`. Detalle en [`../features/catalogos-comunes.md § Decisiones editoriales y aprendizajes`](../features/catalogos-comunes.md#decisiones-editoriales-y-aprendizajes).
