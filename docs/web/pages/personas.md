# Página /personas

> Componente: `src/components/pages/PgPersonas.astro` · Wrapper: `src/pages/personas/index.astro`

## Estado actual

Listado tabular con leyenda colapsable común (`CatalogoLeyenda`) antes de la sección 2.1, filtros (búsqueda, **causa**, **delito atribuido**, figura pública/privada) + ordenación dinámica (alfabético, **nº de casos ↓**) + cuatro columnas tras la iteración del 2026-05-28:

1. **Persona** — nombre completo + etiqueta itálica en gris pálido al lado del nombre («figura pública» / «persona privada»), y debajo mini-descripción de `biografia_corta` (recortada a ~110 caracteres).
2. **Organización principal** — organización derivada del vínculo de cargo más reciente donde la persona es sujeto (de naturalezas `cargo_*` y `nombramiento_por_gobierno`), renderizada con `OrgChip`.
3. **Cargo actual** — `cargo_publico_actual` literal.
4. **Casos y rol procesal** — casos donde aparece la persona, con enlace a la ficha y `RolBadge` de sus roles en cada caso.

**Cifras económicas (2026-05-29):** chip **«Importe atribuido»** bajo el nombre (suma de las cubetas `beneficiario` + `activo`, clase `objeto`, vía `importeAtribuidoSujeto`) con [`HoverCard`](../features/hover-card.md), + filtro y orden por importe. Las víctimas (sólo papel `perjudicado`) **no muestran chip** a propósito. La ficha de detalle de la persona ([`PgPersonaDetalle`](../../../src/components/pages/PgPersonaDetalle.astro)) gana una sección **«Cifras económicas»** ([`CifrasSujetoBloque`](../../../src/components/CifrasSujetoBloque.astro)) agrupada por papel económico. Modelo y guardarraíles en [`importe-presunto.md`](../features/importe-presunto.md).

## Ideas futuras

### v1 pre-launch

- Pulir descripciones cortas (`biografia_corta`) de las personas modeladas para que rindan bien en la mini-descripción. Algunas son largas; conviene tener una versión corta canónica.

### v1.x

- Filtro adicional por «organización principal» (auto-completado o multi-select).
- Indicar cargos históricos compactados cuando no haya `cargo_publico_actual`.
- Recordar selección de filtros/orden en la URL.

### Sin compromiso

- Vista alternativa tarjeta para móvil.

## Aprendizajes y decisiones editoriales

- **«Figura pública» como texto plano, no badge.** El badge daba demasiado peso visual a un dato secundario; texto pálido en gris cumple igual. Decisión maintainer 2026-05-26 (tarde).
- **Mini-descripción supera al cargo solo.** El cargo se ve igualmente en la columna propia; la mini-descripción aporta contexto adicional ("ministro de…", "ex consejero…", "abogado defensor de…") más informativo que la repetición.
- **Organización principal derivada del vínculo más reciente.** Si la persona tiene varios cargos a la vez (es habitual: cargo público + cargo orgánico de partido), gana el vigente y, entre vigentes, el más reciente. Lo hace explícito el ordenamiento por `vigente DESC, desde DESC` antes de tomar el primero.
- **Filtro de rol procesal en buckets, no por valor exacto del modelo.** 2026-05-27: `condenado_no_firme` y `condenado_firme` se funden en un único bucket "Condenado" para no duplicar opciones por matiz de firmeza. El badge del rol en la columna sí preserva la firmeza; el filtro agrupa porque al lector le interesa "personas condenadas" como categoría, no la distinción técnica. Sólo aparecen como opciones los buckets realmente presentes en el listado.
- **El rol procesal pertenece al caso, no a una columna aislada.** 2026-05-28: el filtro de rol principal se retira del listado general y el rol se muestra junto a cada causa concreta. Así se evita presentar una persona como si tuviera un único estado procesal global cuando puede tener roles distintos según caso.
- **Causa y delito son mejores filtros de exploración.** El listado permite filtrar personas por caso y por delito atribuido en las causas donde aparecen; ambos filtros usan multiselección y sólo ofrecen valores presentes en la tabla.
- **`OrgChip` generaliza el estilo de organización.** La organización principal reutiliza el lenguaje visual de chips de organización sin semántica de "afectada"; partidos siguen usando `PartidoBadge` internamente.

## Pendientes operativos

- [x] Sustituir badge de figura pública por texto pálido. **Entregado 2026-05-26 (tarde).**
- [x] Mini-descripción de `biografia_corta`. **Entregado 2026-05-26 (tarde).**
- [x] Columna «Organización principal». **Entregado 2026-05-26 (tarde).**
- [ ] Pulir `biografia_corta` de personas con texto demasiado largo en el primer fragmento.
- [x] **Leyenda colapsable común** (`CatalogoLeyenda`) + **filtro rol procesal principal** (en buckets) + **ordenación dinámica** (alfabético / nº casos ↓). **Entregado 2026-05-27.** Detalle en [`../features/catalogos-comunes.md`](../features/catalogos-comunes.md).
- [x] **Pulido de iteración 2026-05-27**: botón "Limpiar filtros" en el header de §2.1 (slot por defecto de `SectionH`, atributo `form="filters-personas"`), sección final "Más detalle metodológico" en la leyenda enlazando a [`/sobre#roles`](../../../src/components/pages/PgSobre.astro) y [`/sobre#principios`](../../../src/components/pages/PgSobre.astro), y fix del bug pre-existente del `<script is:inline>` per-instancia en `CustomSelect` (los selects "rol" y "ordenar" nunca habían tenido listeners hasta este parche, lo que explicaba que aparentaran no funcionar). Detalle en [`../features/catalogos-comunes.md § Decisiones editoriales y aprendizajes`](../features/catalogos-comunes.md#decisiones-editoriales-y-aprendizajes).
- [x] **Iteración 2026-05-28**: filtros multi por causa/delito, `OrgChip`, y columna de casos con roles procesales por causa.
