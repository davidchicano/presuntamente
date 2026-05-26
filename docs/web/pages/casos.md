# Página /casos

> Componente: `src/components/pages/PgCasos.astro` · Wrapper: `src/pages/casos/index.astro`

## Estado actual

Listado tabular de casos con filtros (búsqueda, fase procesal, orden) + cinco columnas tras el sprint del 2026-05-26 (tarde):

1. **Caso** — nombre mediático + `EstadoPublicacionBadge` compacto en la misma línea + mini-descripción de `sintesis_caso.que_se_investiga` (fallback `descripcion_corta`). Primera columna ensanchada (30%).
2. **Fase** — `PhaseBadge`.
3. **Órgano** — acrónimo en mono + nombre oficial del procedimiento debajo. La celda es clicable a la página de la organización.
4. **Organización afectada** — primera organización derivada de `VinculoInstitucional` con prioridad investigada → perjudicada → acusación. Lleva `RolBadge` del rol procesal equivalente (`investigado` / `perjudicado` / `acusacion_popular`). Misma chapa visual que la sección «Instituciones alcanzadas» de la ficha de caso.
5. **Partidos afectados** — chips clicables (siglas) hacia la página del partido. Hoy estilo accent uniforme; refactor a `PartidoBadge` con colores por partido pendiente en ROADMAP.
6. **Último hito** — fecha en mono + título truncado a ~90 caracteres (texto completo en `title=` para hover).

Filas en estado `pendiente`/`borrador` aparecen no clicables en producción (`tr.is-blocked`) pero visibles para transparencia. En dev local todas son clicables.

## Ideas futuras

### v1 pre-launch

- Pulir copy del eyebrow y sub del page-id (Bloque C de revisión editorial humana).
- Revisar si los chips de "Partidos afectados" se ven bien con muchos partidos (caso González Amador tiene 3).

### v1.x

- Filtro nuevo por «Partido afectado».
- Filtro nuevo por «Organización afectada» (auto-completado con orgs presentes en la columna).
- Componente `PartidoBadge` reutilizable con tokens de color por partido.

### Sin compromiso

- Vista alternativa de tarjeta para móvil (hoy la tabla hace scroll horizontal).
- Densidad seleccionable (compacta / cómoda).

## Aprendizajes y decisiones editoriales

- **Mini-descripción debe ser breve y útil**, no resumen ejecutivo. Cambio 2026-05-26: pasamos de `descripcion_corta` a `sintesis_caso.que_se_investiga`, que rinde mejor en escaneo rápido.
- **Estado de ficha junto al nombre, no en columna propia.** Quita peso visual y deja claro de un vistazo qué fichas están maduras.
- **Órgano clicable.** La columna acrónimo (AN, JCI 4) era texto plano; ahora es enlace a la org porque el lector que quiere saber qué juzgado es debe llegar de un clic.
- **`RolBadge` para naturaleza institucional, no strings.** «perjudicada» en texto frente a `RolBadge` perjudicado en la ficha era inconsistencia visible. Decisión 2026-05-26: usar mapping `entidad_investigada_en_caso → investigado`, `perjudicado_institucional_en_caso → perjudicado`, `acusacion_institucional_en_caso → acusacion_popular`. Mismo lenguaje visual que el resto del sitio.
- **Columna «Implicados» eliminada.** Era un número muerto que no marketing nada al lector. Decisión maintainer 2026-05-26 (tarde).
- **Último hito truncado.** Antes ocupaba mucho alto en filas con titulares largos. Truncado a ~90 chars + tooltip con texto completo.
- **Partidos como chips, no badge enum.** Cada caso puede tocar varios partidos por motivos distintos; un único badge no captura la pluralidad. Decisión 2026-05-26.

## Pendientes operativos

- [x] Mini-descripción por `que_se_investiga`. **Entregado 2026-05-26 (tarde).**
- [x] Último hito truncado. **Entregado 2026-05-26 (tarde).**
- [x] Quitar columna Implic. **Entregado 2026-05-26 (tarde).**
- [x] Órgano clicable. **Entregado 2026-05-26 (tarde).**
- [x] `RolBadge` en columna Organización afectada. **Entregado 2026-05-26 (tarde).**
- [x] Nueva columna `Partidos afectados`. **Entregado 2026-05-26 (tarde).**
- [ ] Refactor a `PartidoBadge` con colores por partido. Ver ROADMAP.
