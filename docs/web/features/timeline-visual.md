# Timeline visual de caso

> Archivos clave: [`src/components/Hito.astro`](../../../src/components/Hito.astro) · [`src/components/pages/PgCasoDetalle.astro`](../../../src/components/pages/PgCasoDetalle.astro) (sección "Cronología" + CSS `.timeline` y `.timeline-order`) · [`src/layouts/BaseLayout.astro`](../../../src/layouts/BaseLayout.astro) (event-delegation del toggle de orden)

## Qué hace

Convierte la sección de cronología de la ficha de caso de una lista tabular a una **timeline visual con rail vertical y dots coloreados por familia de hito** (jurisdiccional · político · mediático), conservando el CalGlyph de cada fecha y el deep-link `#hito-<slug>`.

## Para qué sirve

Hacer escaneable de un vistazo la cronología del procedimiento: el rail aporta sensación de continuidad temporal y los dots permiten identificar a qué naturaleza pertenece cada hito sin tener que leer el badge de categoría. Audiencia: periodistas que entran a una ficha desde X o desde el feed RSS y quieren entender en 5 segundos cuál es el último movimiento procesal y cómo se enmarca en la secuencia.

## Cómo funciona

Tres piezas en CSS puro, sin JS:

1. **Rail** — `::before` absoluto del contenedor `.timeline` en `PgCasoDetalle.astro`. Posición `left: 16px; top: 12px; bottom: 12px; width: 2px; background: var(--color-border)`. Atraviesa todo el alto de la timeline, con un pequeño inset arriba y abajo para no chocar con los bordes superiores e inferiores. En mobile (≤560px) cambia a `left: 12px`.

2. **Dot** — `<span class="hito-item__dot">` dentro de la columna `.hito-item__rail` de cada item. 14×14px, círculo con `border: 3px solid var(--dot-color)` + `box-shadow: 0 0 0 3px var(--color-surface)` que pinta un halo blanco alrededor del dot. El halo masca el rail justo detrás del dot, evitando que la línea se vea cruzarlo (truco clásico de timeline). El color del border viene de la custom property `--dot-color`, asignada por la clase modifier `.hito-item--<familia>`.

3. **Colores por familia** — reusa los tokens del sistema de badges (ver DESIGN.md — "Sistema de badges"):
   - `.hito-item--jurisdiccional` → `--color-accent` (navy)
   - `.hito-item--politico` → `--color-accent-secondary` (mostaza)
   - `.hito-item--mediatico` → `--color-border-strong` (gris fuerte)

   La clasificación familia se deriva de `Hito.tipo` vía [`tipoHitoFamilia()`](../../../src/lib/labels.ts) (sin cambios en esta feature; ya existía para el badge de categoría desde antes).

**Layout grid** del item: `grid-template-columns: 32px 84px 1fr` en desktop (`24px 64px 1fr` en mobile ≤560px). Columna 1 = rail+dot, columna 2 = CalGlyph (date card 56px centrado en 84px), columna 3 = cuerpo con badge categoría + N+doc + título + descripción.

**Contenedor `.timeline`**: pierde el borde de 1px y el fondo de surface que tenía antes para sentir timeline en lugar de tabla. **Sin separador entre items** (ni bottom-border ni hover-state de fila): el rail + los dots ya marcan la estructura vertical; cualquier divider extra reintroduciría la sensación tabular que el rediseño quiere eliminar. El ritmo vertical lo da la combinación `padding: 14px 0 18px` del item + el offset top/bottom de la columna del dot (centrado a la altura del badge de categoría).

**Toggle de orden integrado en el `SectionH`**: prop nueva `orderToggle?: boolean` (default false) en [`SectionH.astro`](../../../src/components/SectionH.astro). Cuando es true, el header renderiza un chip `.sec-h__order` ("⇅ Más reciente primero") al final del flex-row del `.sec-h`, junto al count `.right`. Estado por defecto = "Más reciente primero" (coincide con el sort de `cronologia` en `PgCasoDetalle.astro:54`, `localeCompare` descendente). Al pulsar se invierte vía `flex-direction: column-reverse` aplicado con la clase `.is-reversed` al próximo hermano del `.sec-h` (típicamente el contenedor `.timeline`, pero el patrón es agnóstico al tipo: cualquier futuro contenedor que defina su propia regla `.is-reversed` puede reutilizarlo). Lógica en [`BaseLayout.astro`](../../../src/layouts/BaseLayout.astro) por event-delegation desde `document` (mismo patrón que filas clicables / hamburguesa / PageToc) que localiza el contenedor desde `btn.closest('.sec-h').nextElementSibling` y sincroniza label + `data-order` + `aria-pressed`. Se re-attach en `astro:page-load` para sobrevivir a navegaciones del ClientRouter. En la cronología, el toggle solo se pasa cuando `cronologia.length > 1` (no tiene sentido invertir un único hito).

## Estado actual

Activo en las 6 fichas de caso publicables (Plus Ultra · Begoña Gómez · González Amador · Fiscal General del Estado · Kitchen · Lezo) y en cualquier futura ficha que use `PgCasoDetalle.astro`, sin trabajo adicional.

Deep-link `#hito-<slug>` y target-flash `:target` (ver DESIGN.md — "Layout Principles") siguen funcionando intactos — la prop `id` de `Hito.astro` se sigue propagando como `id="hito-<slug>"` del contenedor `.hito-item`.

Build verde, sin nuevas dependencias.

## Decisiones editoriales y aprendizajes

- **CalGlyph se conserva.** El roadmap proponía "rail vertical con dots de colores + texto a la derecha", lo que podía interpretarse como descartar la date card y usar sólo texto de fecha. Pero el CalGlyph es identidad fuerte del sitio (hoja de calendario administrativa con banda navy/mostaza) y aporta jerarquía visual; quitarlo abarataba la cronología. La interpretación adoptada: rail + dot **antes** del CalGlyph, no en su lugar.
- **Halo blanco vía box-shadow, no `z-index` sobre fondo opaco.** El rail es un `::before` absoluto del `.timeline` y los dots viven en items posicionados naturalmente. Poner un `background: white` sólido en el dot sería suficiente para tapar el rail cuando los z son los esperados (dot encima por estar más adelante en el flow). Pero el `box-shadow: 0 0 0 3px var(--color-surface)` añade un anillo blanco *fuera* del border del dot que hace que el dot "respire" sobre el rail y se vea claramente como nodo de la línea, no como una pegatina encima. Coste cero en performance.
- **Color puro sin glyph en el dot.** Se evaluó inicialmente la idea de meter glyphs distintivos dentro del dot para cada familia de hito. Se descartó: el badge de categoría ya lleva un identificador textual junto a su color; duplicar iconografía en el dot añade ruido sin información nueva. El color del dot ya basta para identificación rápida; el label del badge confirma a quien quiere verificar. El sistema final es color + label sin glyph, manteniendo la jerarquía visual limpia.
- **Color del rail muy bajo contraste a propósito.** `--color-border` (rgb(220, 220, 214)) en lugar de `--color-border-strong`. La línea tiene que **conectar visualmente** los dots, no competir con ellos. Si el rail fuera más oscuro, dominaría sobre los dots y la lectura sería "una línea con dots" en lugar de "dots conectados".
- **`box-sizing: border-box` en el dot.** Con `width: 14px` y `border: 3px solid`, el render final es exactamente 14×14 con el border consumiendo 3px de cada lado (área interior 8×8). Si fuera content-box, el dot mediría 20×20 y rompería la alineación con el rail de 2px.
- **Hover-state de fila eliminado.** La versión tabular previa pintaba el fondo del item entero al pasar el cursor (`background: var(--color-bg-muted)`). En una timeline ese affordance es engañoso porque los items no son clicables como bloque — sólo lo son los enlaces internos (documento, RichProse autoenlazado). Se quita el hover de fila completamente. Si en el futuro se quiere afordancia hover, va sobre el dot (agrandarlo) o sobre el título, no sobre toda la fila.
- **Sin bottom-border entre items.** La versión tabular previa separaba items con `border-bottom: 1px solid var(--color-border)`. En una timeline el rail + dot ya marcan la estructura vertical; el bottom-border reintroduce la sensación de "filas de tabla" que el rediseño quiere eliminar. La separación visual se mantiene vía padding asimétrico (`14px` arriba, `18px` abajo) que da ritmo sin dividers.
- **Sin caja envolvente.** El contenedor `.timeline` perdió el `border: 1px solid` + `background: var(--color-surface)` que tenía como caja. En el rediseño la cronología fluye con el resto de la página (no se distingue del fondo) — el rail y los dots son la única señal visual. Reglas legacy de `.timeline`, `.timeline__item`, `.timeline__date` eliminadas de `global.css` para no contradecir el scoped style del componente.
- **Toggle de orden ascendente/descendente sin re-render.** `flex-direction: column-reverse` reordena visualmente sin mutar el DOM. Beneficios: (a) el deep-link `#hito-<slug>` sigue funcionando idénticamente en ambos órdenes (el target flash apunta al `id` del elemento, no a su posición); (b) no se pierde el scrollY al togglear porque no hay layout shift por re-render; (c) el rail `::before` absoluto sobrevive sin tocar nada. Coste cero en performance; el toggle sobrevive a recargas porque el listener está delegado en `BaseLayout.astro`.

## Ideas futuras

### v1.x — comprometido

(ninguna por ahora)

### Sin compromiso

- **Indicador de "hito último"** — pintar el último dot con anillo extra (`box-shadow: 0 0 0 3px white, 0 0 0 5px var(--dot-color)`) para que el ojo lo encuentre sin escanear. Útil cuando la cronología es muy larga (Lezo, FGE).
- **Sticky rail header** — al hacer scroll dentro de un caso muy largo, mantener un mini-rail flotante en la izquierda con la fecha del hito visible. Costoso en JS y de utilidad dudosa cuando el TOC de página ya cubre la navegación intra-página.
- **Mini-leyenda al inicio de la cronología** — antes del primer item, una línea "● jurisdiccional · ● político · ● mediático" con los tres dots de ejemplo. Hoy el badge de categoría ya hace de leyenda implícita, pero un periodista que aterriza en una ficha sin contexto puede tardar en mapear color↔familia.
- **Variante densa en mobile** — colapsar el CalGlyph a un dot grande con la fecha pequeña debajo cuando el viewport es ≤400px. Hoy el grid `24px 64px 1fr` ya hace la columna del calendario más estrecha; pero podría ir más lejos.
- **Compactar hitos del mismo día** — cuando dos hitos comparten fecha, agruparlos visualmente con un único CalGlyph y dos dots apilados verticalmente sobre el rail. Hoy se renderiza como dos items consecutivos con dos CalGlyphs iguales (caso real en FGE el 24-nov-2025: dimisión + cese BOE).

## Pendientes operativos

- [ ] Verificar el render en dark mode tras un cambio de paleta futuro. El rail usa `--color-border` y el dot tiene halo `--color-surface` — ambos tokens funcionan en ambos modos, así que en principio no hay trabajo, pero conviene revisar visualmente cuando se actualice la paleta de DESIGN.md.
- [ ] Verificar a la inversa: hito mediático (`publicacion_investigacion_periodistica`) en algún caso futuro — los 6 casos publicables actuales no tienen ninguno, así que la variante `--mediatico` no se ha visto renderizada en producción todavía. Solo `--jurisdiccional` y `--politico` confirmadas visualmente.
