# Página /organizaciones

> Componente: `src/components/pages/PgOrganizaciones.astro` · Wrapper: `src/pages/organizaciones/index.astro`

## Estado actual

Listado tabular con filtros (búsqueda, tipo) + cinco columnas:

1. **Organización** — nombre.
2. **Tipo** — `badge--cat` (`MEDIO DE COMUNICACIÓN`, `JUZGADO`, `PARTIDO POLÍTICO`…).
3. **Clasificación editorial** *(sólo para `tipo: medio_comunicacion`)* — `NaturalezaBadge` (mismo chasis visual que `badge--cat`, con border-left por familia) + `OrientacionBadge` (chip rectangular con fondo de color, paleta del eje cool→warm invertida: izquierda ámbar/derecha azul). Para el resto de tipos: «—».
4. **Localidad** — string libre.
5. **Casos** — número de casos en los que aparece la org.

## Ideas futuras

### v1 pre-launch

- Filtro adicional por `naturaleza_editorial` para medios.

### v1.x

- Filtro adicional por orientación declarada/percibida.
- Resaltado visual de medios con `orientacion_editorial_percibida` populada cuando exista corpus suficiente.
- Iconos por tipo en `badge--cat` (ROADMAP global).

### Sin compromiso

- Vista alternativa tarjeta para móvil.

## Aprendizajes y decisiones editoriales

- **`OrientacionBadge` rectangular con fondo, no pill outlined.** Coherencia con el resto de badges del proyecto. Decisión 2026-05-26 (tarde) tras iteración con outline y volver a fill.
- **Paleta del eje invertida respecto a USA**. Izquierda ámbar, derecha azul. Decisión maintainer para no replicar convención americana ni convención partidista española estricta (PSOE rojo / PP azul).
- **Naturaleza editorial es ortogonal al eje.** Por eso `NaturalezaBadge` y `OrientacionBadge` son componentes distintos y se renderizan en línea, no como un único badge mixto.

## Pendientes operativos

- [x] Columna «Clasificación editorial» con `NaturalezaBadge` + `OrientacionBadge`. **Entregado 2026-05-26.**
- [x] Igualar `NaturalezaBadge` visualmente a `badge--cat`. **Entregado 2026-05-26 (tarde).**
- [ ] Filtro por naturaleza editorial para medios.
