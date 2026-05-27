# Página /organizaciones

> Componente: `src/components/pages/PgOrganizaciones.astro` · Wrapper: `src/pages/organizaciones/index.astro`

## Estado actual

Listado tabular con leyenda colapsable común (`CatalogoLeyenda`) antes de la sección 3.1, filtros (búsqueda, tipo, **orientación editorial declarada**) + ordenación dinámica (alfabético, **nº de casos ↓**) + cinco columnas:

1. **Organización** — nombre.
2. **Tipo** — `badge--cat` (`MEDIO DE COMUNICACIÓN`, `JUZGADO`, `PARTIDO POLÍTICO`…).
3. **Clasificación editorial** *(sólo para `tipo: medio_comunicacion`)* — `NaturalezaBadge` (mismo chasis visual que `badge--cat`, con border-left por familia) + `OrientacionBadge` (chip rectangular con fondo de color, paleta del eje cool→warm invertida: izquierda ámbar/derecha azul). Para el resto de tipos: «—».
4. **Localidad** — string libre.
5. **Casos** — número de casos en los que aparece la org.

## Ideas futuras

### v1 pre-launch

- Filtro adicional por `naturaleza_editorial` para medios (hoy sólo se filtra por orientación declarada).

### v1.x

- Filtro adicional por orientación **percibida** (cuando el corpus CIS u otras fuentes externas crezca lo suficiente).
- Resaltado visual de medios con `orientacion_editorial_percibida` populada cuando exista corpus suficiente.
- Recordar selección de filtros/orden en la URL.

### Sin compromiso

- Vista alternativa tarjeta para móvil.

## Aprendizajes y decisiones editoriales

- **`OrientacionBadge` rectangular con fondo, no pill outlined.** Coherencia con el resto de badges del proyecto. Decisión 2026-05-26 (tarde) tras iteración con outline y volver a fill.
- **Paleta del eje invertida respecto a USA**. Izquierda ámbar, derecha azul. Decisión maintainer para no replicar convención americana ni convención partidista española estricta (PSOE rojo / PP azul).
- **Naturaleza editorial es ortogonal al eje.** Por eso `NaturalezaBadge` y `OrientacionBadge` son componentes distintos y se renderizan en línea, no como un único badge mixto.
- **Filtro de orientación editorial sin restringir antes a "tipo=medio".** 2026-05-27: el desplegable de orientación está disponible siempre, pero al activarlo descarta automáticamente lo que no es medio (los no-medios no tienen `data-orient`). Decisión: mejor un único punto de filtrado que un filtro condicional que aparece y desaparece según otro select. Las opciones se rellenan **sólo con orientaciones realmente declaradas** en el listado, en orden canónico del eje (izquierda → derecha), no alfabético.

## Pendientes operativos

- [x] Columna «Clasificación editorial» con `NaturalezaBadge` + `OrientacionBadge`. **Entregado 2026-05-26.**
- [x] Igualar `NaturalezaBadge` visualmente a `badge--cat`. **Entregado 2026-05-26 (tarde).**
- [ ] Filtro por naturaleza editorial para medios.
- [x] **Leyenda colapsable común** (`CatalogoLeyenda`) + **filtro orientación editorial declarada** (sólo medios; eje canónico) + **ordenación dinámica** (alfabético / nº casos ↓). **Entregado 2026-05-27.** Detalle en [`../features/catalogos-comunes.md`](../features/catalogos-comunes.md).
- [x] **Pulido de iteración 2026-05-27**: botón "Limpiar filtros" en el header de §3.1 (slot por defecto de `SectionH`, atributo `form="filters-organizaciones"`), sección final "Más detalle metodológico" en la leyenda enlazando a [`/sobre#principios`](../../../src/components/pages/PgSobre.astro) y [`/sobre#niveles`](../../../src/components/pages/PgSobre.astro), y fix del bug pre-existente del `<script is:inline>` per-instancia en `CustomSelect` (los selects "orient" y "ordenar" nunca habían tenido listeners). Detalle en [`../features/catalogos-comunes.md § Decisiones editoriales y aprendizajes`](../features/catalogos-comunes.md#decisiones-editoriales-y-aprendizajes).
