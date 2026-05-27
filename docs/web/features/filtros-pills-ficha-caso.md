# Filtros con pills en la ficha de caso

> Archivos clave: `src/components/ChipFilterGroup.astro` · `src/components/Chip.astro` · `src/components/FichaTocSection.astro` (slot nombrado `filters`) · `src/components/PersonaCard.astro` · `src/components/pages/PgCasoDetalle.astro`.

## Qué hace

Permite filtrar de forma visual e inmediata las secciones internas de la ficha de un caso (`/casos/<slug>`) mediante pills clicables multi-selección que reutilizan los badges reales del proyecto. Tres secciones cubiertas:

- **§3 Personas implicadas** — pills por **rol procesal individual** (`investigado`, `procesado`, `acusado`, `condenado_no_firme`, `condenado_firme`, `absuelto`, `desimputado`, `denunciante`, `querellante`, `acusacion_particular`, `acusacion_popular`, `perjudicado`, `testigo`, `juez_instructor`, `juez_ponente`, `fiscal`, `abogado_defensa`, `abogado_acusacion`, `perito_judicial`, `perito_parte`, `secretario_judicial`). Cada pill envuelve un `RolBadge` real con el color de su familia.
- **§5 Cronología** — pills por familia de hito (`Jurisdiccional`, `Político`, `Mediático`). Cada pill envuelve un `CategoryBadge kind="hito"`.
- **§6 Hechos clasificados por estado epistémico** — pills por estado epistémico (`Acreditado`, `Investigado`, `Atribuido`, `Exculpatorio`, `Desmentido`, `No concluyente`). Cada pill envuelve un `EpistemicBadge`.

## Para qué sirve

- **Lectores rápidos**: filtrar "qué personas están investigadas hoy en este caso" o "qué hitos jurisdiccionales han marcado el procedimiento" sin scroll cognitivo.
- **Coherencia visual**: el pill **es** el badge que aparece luego en la card / hito / hecho — no un proxy decorado. La lectura es directa: "este badge → click → veo sólo las entradas con ese badge".
- **Coste cero cuando no hace falta**: si una sección tiene un único tipo presente en el caso, la fila de pills no se renderiza (no aporta nada filtrar entre uno).

## Cómo funciona

### `ChipFilterGroup` + `Chip`

Pareja de componentes. `ChipFilterGroup` orquesta el `<fieldset>` con `<input type="hidden">` agregado, el botón "Mostrar todo" y el script de toggling. Cada `<Chip>` hijo renderiza un `<button data-value="…" aria-pressed="false">` que envuelve el badge real del proyecto.

```astro
<ChipFilterGroup name="hechos-epi" label="Filtrar por" ariaLabel="Filtrar hechos por estado epistémico">
  <Chip value="acreditado"><EpistemicBadge tipo="acreditado" /></Chip>
  <Chip value="investigado"><EpistemicBadge tipo="investigado" /></Chip>
  …
</ChipFilterGroup>
```

**Por qué dos componentes y no uno con slots dinámicos**: Astro requiere que el atributo `name` de `<slot name="…">` sea un **string estático en compilación**. Un patrón como `<slot name={p.value} />` falla con `CompilerError: slot[name] must be a static string`. La solución `<Chip value={p.value}>…</Chip>` mueve la asociación valor↔contenido al nivel de hijo, que sí admite props dinámicas.

Contrato hacia el resto del formulario: igual que `CustomSelect` y `MultiSelectFilter`. El `<input type="hidden" name="…" value="v1,v2">` dispara `change` (bubbles) cada vez que cambia. El consumidor escucha al hidden y aplica visibilidad sobre las filas correspondientes.

### Slot nombrado `filters` en `FichaTocSection`

`FichaTocSection` admite ahora un slot nombrado `filters` que se renderiza **entre el `<header>` de la sección y el contenido principal**, no dentro del header. Mantiene el slot por defecto libre para el contenido habitual.

```astro
<FichaTocSection num="6." title="Hechos…" id="hechos" right="…">
  <Fragment slot="filters">
    <ChipFilterGroup … />
  </Fragment>
  <!-- contenido normal de la sección -->
</FichaTocSection>
```

CSS de la fila (en el propio componente): `display: flex; flex-wrap: wrap; gap: 8px 12px`.

### Mecánica del filtrado

Cada item filtrable lleva un wrapper `<div class="row-pass" data-…-row data-…="…">` que envuelve el componente real (`PersonaCard`, `Hito`, `Hecho`). El wrapper usa `display: contents` para no interferir con el grid/flex del contenedor padre. Para que `hidden=true` lo oculte de verdad (de lo contrario `display: contents` ganaría al `[hidden]` del UA), hay regla con mayor especificidad: `[hidden].row-pass { display: none }`.

Script vanilla local en `PgCasoDetalle.astro`:

```js
function attach(name, rowSelector, dataAttr, groupSelector) {
  // El atributo de cada fila se trata SIEMPRE como CSV: para hitos y
  // hechos lleva un único valor; para personas lleva varios. Matching
  // por contención: pasa si ALGUNO de los seleccionados está en los
  // valores de la fila.
}
```

Cuando hay grupos (las cabeceras "Investigados/procesados/acusados", "Acreditados", etc.), tras filtrar items se ocultan los grupos que se quedan sin hijos visibles.

### Datos por sección

| Sección | Atributo en row | Cardinalidad por row | Pills posibles | Pills observables (en publicables) |
|---|---|---|---|---|
| §3 Personas | `data-roles="rol1,rol2,…"` | 1-N (una persona puede tener varios roles) | 21 (enum `RolEnCaso.rol`) | 5-10 típicos en cada caso |
| §5 Cronología | `data-tipo-familia="jurisdiccional"` | 1 | 3 | 2-3 según caso |
| §6 Hechos | `data-tipo-epi="acreditado"` | 1 | 6 | 2-4 según caso |

## Decisiones editoriales y aprendizajes

- **Pills por rol individual, no por bucket.** Decisión 2026-05-27 (segunda iteración con el maintainer). La primera versión agrupaba roles en 5 buckets (`Imputación activa`, `Condenado`, `Absuelto/desimputado`, `Otros`, `Funcional`) con un único `RolBadge` representativo. El maintainer detectó que mostrar "Absuelto / desimputado" con un solo badge oculta que son badges visualmente distintos. Cambio: un pill por rol presente, envolviendo el `RolBadge` real exacto. Cada caso muestra sólo los roles realmente presentes (no engordamos con 21 opciones).
- **Unión completa de roles por persona, no sólo el "rol principal".** Decisión 2026-05-27 (tercera iteración). La versión inicial guardaba un único `rolPrincipal` por persona y los pills se basaban en él. Pero las cards muestran TODOS los roles (incluido investigado cerrado → procesado vigente), por lo que el pill "Investigado" no aparecía aunque la card sí lo enseñaba — mismatch visible. Fix: la unión de roles es el set de todos los roles que cualquier persona del caso haya tenido; el `data-roles` por card es CSV con todos los roles de la persona; el matching es por contención.
- **Orden de roles en `PersonaCard`: vigentes primero, anteriores atenuados.** Decisión 2026-05-27 (junto con la unión completa). La iteración inicial usaba el orden de inserción (cronológico ASC), lo que dejaba al investigado cerrado arriba y al procesado vigente debajo, confundiendo al lector. Ahora: vigentes primero (por `fecha_inicio` desc), cerrados después (por `fecha_fin` desc), con clase `.pcard__role--anterior` que atenúa los no-primeros (`opacity: 0.65`, fecha en cursiva). El primero coincide con el color del border-left de la card.
- **Etiqueta "Filtrar por" como prefix de la fila.** Decisión 2026-05-27 (segunda iteración). Sin prefix, la fila de pills se leía como decoración. Con prefix uppercase muted ("FILTRAR POR"), el lector entiende inmediatamente que son filtros activables. El `aria-label` del `<fieldset>` ya cumple la función accesible; el prefix queda `aria-hidden="true"` para no duplicar lectura en screen readers.
- **Estado visual con anillo accent + atenuación de no-activos.** Sin selección → todos los chips a opacidad completa (estado "todo visible"). Con selección → activos llevan `box-shadow` accent (anillo de 3px); no-activos se atenúan (`opacity: 0.45`, `filter: grayscale(0.5)`). El badge en sí mantiene su color real; el estado del chip va por encima en el button-wrapper.
- **Mini-link "Mostrar todo" sólo cuando hay activos.** Aparece a la derecha de la fila si hay al menos un pill seleccionado; cuando no hay nada activo, no se renderiza (no hay nada que limpiar).
- **§4 Organizaciones implicadas descartado.** Los datos relevantes están dispersos en 3 fuentes (`roles` por organización + afectación directa/indirecta de `vinculos` + acusación popular). Filtros añaden complejidad sin ganar al lector (cardinalidad típica 3-8 orgs por caso, ya manejable a ojo).
- **§7 Cobertura mediática aplazado a pasada propia.** Cardinalidad alta (20-100 piezas por caso) y multi-eje (tipo de pieza + medio + relevancia editorial); merece UX dedicada. Apuntado en `ROADMAP.md`.
- **Patrón DOMContentLoaded en el script.** El mismo bug aprendido en `CustomSelect` (script `is:inline` se renderiza pegado a cada instancia; el primero ejecuta `querySelectorAll` cuando los demás aún no están en DOM; los siguientes hacen early-return por el guard). Solución: envolver init en función y agendarla a `DOMContentLoaded`. Aplicado preventivamente aunque hoy cada `ChipFilterGroup` sólo aparece una vez por página.

## Ideas futuras

### v1.x — comprometido

- **Pills en §7 Cobertura mediática general** (tarea aparte en ROADMAP). Multi-eje: tipo de pieza (`CategoryBadge kind="cobertura"`), medio publicador (multi-select dropdown por cardinalidad alta), relevancia editorial.
- **Persistir selección en la URL** (`?personas-rol=investigado,procesado&hechos-epi=acreditado`) para compartir un caso pre-filtrado.

### Sin compromiso

- **Contador dinámico junto al título de cada sección** (p. ej. `§3 Personas · 3 de 8`) cuando hay filtros activos. Hoy el `right` del header es estático.
- **Atajos de teclado** (`1`–`6` para alternar pills de la sección activa).
- **Animación de fade** al ocultar/mostrar items filtrados (hoy es instantáneo).

## Pendientes operativos

- [ ] Revisar comportamiento en pantallas estrechas: la fila de pills puede ocupar varias líneas si hay >6 roles distintos en un caso grande. Hoy el wrap es automático con `gap: 8px 12px`; si en algún caso se desborda visualmente, considerar contraerlos o paginar.
- [ ] Si más adelante un caso tiene pills MUY largos (rol con label de >18 caracteres en buckets exóticos), revisar overflow del button-wrapper.
- [ ] Cuando se aborde `/sobre#roles`, asegurar que la taxonomía completa de roles esté documentada allí — los pills son una entrada directa a esa documentación.
