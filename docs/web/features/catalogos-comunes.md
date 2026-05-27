# Catálogos comunes (leyenda colapsable + filtros y ordenación)

> Archivos clave: `src/components/CatalogoLeyenda.astro` · `src/components/MultiSelectFilter.astro` · `src/components/SectionH.astro` · `src/components/CustomSelect.astro` · `src/lib/git-meta.ts` · `src/styles/global.css` (`.sec-h__action`/`.sec-h__actions`) · los cuatro `Pg(Casos|Personas|Organizaciones|Delitos).astro`.

## Qué hace

Provee cinco piezas reutilizables por los cuatro catálogos del sitio:

1. **`CatalogoLeyenda`** — bloque colapsable común antes de la barra de filtros, con un slot para el contenido editorial específico de cada listado.
2. **`MultiSelectFilter`** — combobox multi-selección con popover, búsqueda interna y chips de seleccionadas. Inspirado en el patrón `MultiSelect`/`Combobox` de shadcn pero adaptado a la estética administrativa.
3. **`SectionH` con slot por defecto** — el componente de header de sección admite ahora un slot para acciones contextuales (botón "Limpiar filtros") posicionadas a la derecha del header.
4. **`.sec-h__action`** — utility CSS para botones pequeños dentro del header (coherente con `.sec-h__order`, neutro).
5. **`ultimaActualizacionDeCaso` (`src/lib/git-meta.ts`)** — helper que en build lee `git log -1 --format=%aI -- content/casos/<slug>/` para exponer la fecha del último cambio editorial de cada caso.

## Para qué sirve

- **Lectores**: la leyenda colapsable permite arrancar en el listado sin que la página esté llena de copy explicativo, y abrirla cuando dudan qué significa una columna, un badge o un filtro. La consistencia entre los cuatro catálogos hace que aprender uno enseñe los otros.
- **Filtros más potentes**: el multi-select cubre el caso real "casos donde toca a la AEAT o al PP", que con select único exigía dos pasadas. La ordenación por "última actualización" responde a la pregunta operativa "qué fichas ha tocado el inventario últimamente".
- **Botón de limpiar accesible**: trasladado del final del formulario al header de la sección "Filtros", siempre visible y reconocible.

## Cómo funciona

### `CatalogoLeyenda`

`<details>/<summary>` nativo de HTML, sin JS y accesible por teclado por defecto. Props: `titulo`, `resumen` opcional siempre visible en la cabecera, `abierta` opcional (por defecto cerrado), `ariaLabel`. El cuerpo es un slot donde cada catálogo pinta secciones con clases globales (`.cat-legend__section`, `.cat-legend__section-title`, `.cat-legend__intro`, `.cat-legend__list`, `.cat-legend__item`, `.cat-legend__inline`).

Cada leyenda incluye una sección final **"Más detalle metodológico"** con enlaces a los anchors relevantes de `/sobre`:

- `/casos` → `/sobre#principios` + `/sobre#niveles`
- `/personas` → `/sobre#roles` + `/sobre#principios`
- `/organizaciones` → `/sobre#principios` + `/sobre#niveles`
- `/delitos` → `/sobre#tipos-hecho` + `/sobre#principios` + `/sobre#lenguaje`

### `MultiSelectFilter`

Trigger con chevron, popover con search interno + `<ul role="listbox">` de checkboxes, fila de chips bajo el trigger, botón "Limpiar selección" en el footer.

- El valor agregado se serializa en un `<input type="hidden" name="…" value="org1,org2">` que vive dentro del componente. El script del catálogo lee ese hidden por `form.querySelector('input[name="…"]')`.
- Cada cambio dispara un `change` (bubbles) sobre el hidden, alineando el contrato con el de `CustomSelect`.
- Semántica de filtrado: OR. Un row pasa si **alguna** de sus etiquetas (`data-orgs="…,…"`) coincide con **alguna** de las opciones seleccionadas. Sin selección → no filtra.
- Soporta `form.reset()`: tras un reset, los checkboxes vuelven a desmarcarse, el hidden se vacía y el trigger / chips se repintan.
- Cierre: click fuera, tecla Esc, click en el chevron del trigger ya abierto.

### `SectionH` con slot para acciones

`SectionH` acepta un slot por defecto (children) que se renderiza al final del header, empujado a la derecha. Cuando no hay `.right` ni `.sec-h__order` previos, la caja `.sec-h__actions` se empuja con `margin-left: auto`.

Patrón en los cuatro catálogos:

```astro
<SectionH num="1.1" title="Filtros">
  <button type="reset" form="filters-casos" class="sec-h__action">
    Limpiar filtros
  </button>
</SectionH>

<form id="filters-casos" …>…</form>
```

El botón vive **fuera** del `<form>` pero lo controla vía `form="…"` (HTML5 estándar). La utility `.sec-h__action` está en [`global.css`](../../src/styles/global.css) hermana de `.sec-h__order`.

### `ultimaActualizacionDeCaso` (git-meta)

`execSync('git log -1 --format=%aI -- content/casos/<slug>/')`, cacheado por path. Devuelve fecha `yyyy-mm-dd` o `null` si git no encuentra historial accesible (caso típico: en clones shallow, los casos no tocados en HEAD pueden no tener fecha).

Análogo a [`src/lib/build-info.ts`](../../src/lib/build-info.ts) en patrón (`execSync` en build, sin dependencias adicionales).

### Patrón compartido: `<script is:inline>` y DOMContentLoaded

Los tres componentes interactivos (`CustomSelect`, `MultiSelectFilter`, `ChipFilterGroup`) usan `<script is:inline>` con guard `__cselInited` / `__msfInited` / `__chipfgInited`. **Lección aprendida 2026-05-27** (ver "Decisiones editoriales y aprendizajes" más abajo): la inicialización se agenda a `DOMContentLoaded` cuando el documento aún se está cargando; si no, el primer script de la página sólo veía la primera instancia del componente en el DOM.

## Estado actual

Aplicado en los 4 catálogos:

| Catálogo | Filtros nuevos | Ordenación nueva | Botón limpiar |
|---|---|---|---|
| `/casos` | Estado de la ficha (single), **organizaciones afectadas** (multi-select dinámico). | Última actualización ↓ (git), fase ↑/↓. | Header §1.1 |
| `/personas` | Rol procesal principal (single, en buckets). | Nº de casos ↓. | Header §2.1 |
| `/organizaciones` | Orientación editorial declarada (single, eje canónico). | Nº de casos ↓. | Header §3.1 |
| `/delitos` | (mantiene familia). | Nº de casos ↓, nº de atribuciones ↓. | Header §4.1 |

Todos los catálogos llevan **leyenda colapsable** antes de la sección de filtros. Personas, Organizaciones y Delitos pasan de no tener leyenda a tenerla; `/casos` migra el bloque anterior (`catalog-legend`) al patrón común. Cada leyenda cierra con una sección "Más detalle metodológico" enlazando a `/sobre`.

Los selectores se inicializan vacíos al cargar; las opciones dinámicas se rellenan desde lo realmente presente en el listado (orgs afectadas en `/casos`, rol buckets en `/personas`, orientaciones declaradas en `/organizaciones`).

## Decisiones editoriales y aprendizajes

- **Leyenda colapsada por defecto**, no abierta. El lector que ya conoce el sitio no la necesita; el que duda la abre. Si más adelante una norma editorial fuerte exige que esté abierta en alguna página, hay prop `abierta` para forzarlo.
- **`<details>/<summary>` sin JS** sobre custom button con `aria-expanded`: cero superficie de ataque a accesibilidad, navegador recuerda estado dentro de la pestaña, animación CSS sobre el chevron y suficiente. La alternativa con JS añadía complejidad sin valor editorial.
- **Multi-select inspirado en shadcn**, no en el `<select multiple>` nativo. El nativo es hostil al lector y rompe la estética administrativa. Pieza propia: trigger compacto, chips bajo el trigger, popover con búsqueda, "Limpiar selección".
- **Opciones dinámicas, nunca el enum entero.** Decisión transversal: en `/casos` aparecen sólo las orgs que figuran como afectadas en algún caso, no las ~140 del repo. En `/personas` aparecen sólo los buckets de rol presentes. En `/organizaciones` aparecen sólo las orientaciones declaradas en uso. Engordar dropdowns con opciones vacías era el patrón a romper.
- **Filtro de rol procesal en buckets**. `condenado_no_firme` y `condenado_firme` se funden en "Condenado" para no duplicar opciones por matiz de firmeza. El badge en la columna sí preserva la firmeza; el filtro agrupa.
- **Filtro de orientación editorial sin gating previo.** En `/organizaciones` el filtro de orientación está disponible siempre. Al activarlo descarta automáticamente lo que no es medio (rows sin `data-orient`). Mejor que un filtro condicional que aparece/desaparece según otro select.
- **Aviso editorial de `/delitos` se queda post-tabla.** Decisión 2026-05-27: la nota "atribución ≠ condena" (`legal-note`) mantiene su sitio al final del listado. La leyenda superior incluye un párrafo equivalente, pero el `legal-note` post-tabla cumple función de cierre y no depende del estado abierto/cerrado de la leyenda.
- **Última actualización vía git, no campo en YAML.** Decidido 2026-05-27. Patrón análogo a `build-info.ts`. Ventajas: cero disciplina editorial, fuente única de verdad. Limitación: en clones shallow (Cloudflare Pages) puede devolver vacío para casos no tocados en el HEAD. Los rows sin fecha caen al final de esa ordenación; aceptable para Cloudflare Pages, donde lo más reciente es lo prioritario en la lectura.
- **Semántica OR para multi-select.** Decisión 2026-05-27: un caso pasa el filtro si toca **al menos una** de las orgs seleccionadas. Más útil para "casos que rozan a cualquiera de estas orgs" que la semántica AND (que casi nunca tiene sentido en una afectación que ya es múltiple).
- **Patrón unificado de meta del listado.** Todos los catálogos exponen ahora un `data-listado-meta` que el script actualiza con "orden: …". `/casos` lleva además recuento de casos visibles.
- **Botón "Limpiar filtros" en el header, no al final del form.** Decisión 2026-05-27 (iteración interactiva): el botón al final del form quedaba lejos del campo de búsqueda y se percibía como secundario. Moviéndolo a la esquina derecha del header de la sección "Filtros" queda siempre visible y reconocible. La asociación se hace con el atributo HTML5 `form="filters-<slug>"`, lo que permite tener el botón fuera del propio `<form>`. Patrón aplicado en los 4 catálogos.
- **Bug del `<script is:inline>` posicionado pegado a cada instancia.** Lección crítica aprendida en iteración 2026-05-27. Astro renderiza el `<script is:inline>` de un componente justo después de cada uso, no centralizado al final. Si un formulario tiene N CustomSelect, el primer script se ejecuta cuando sólo el primer `[data-csel]` está en el DOM; el guard `__cselInited` impide a los siguientes scripts inicializar el resto. Resultado: **sólo el primer CustomSelect de la página tenía listeners** (lo que explica por qué los "ordenar por" y selects secundarios nunca habían funcionado en `/personas`, `/organizaciones` y `/delitos` desde su creación inicial). Fix: envolver la inicialización en una función `init()` y agendarla a `DOMContentLoaded` cuando el documento se está cargando. Mismo patrón aplicado a `MultiSelectFilter` y `ChipFilterGroup` por consistencia futura, aunque hoy sólo haya una instancia por página.
- **Bug del `MultiSelectFilter` popover siempre visible al cargar.** Lección aprendida 2026-05-27 en iteración interactiva. El popover llevaba `.msf__popover { display: flex }` y el atributo `hidden` se serializaba pero `display: flex` (regla CSS) ganaba al `display: none` del user-agent stylesheet. Resultado: popover visible al cargar + tapaba con `z-index: 30` los menús de los `CustomSelect` (z-index 10) que se abrían pero quedaban detrás. Fix: una línea CSS `.msf__popover[hidden] { display: none }` con mayor especificidad. El bug se manifestó como dos síntomas distintos ("popover siempre abierto" + "los demás selects no abren"); el segundo era consecuencia directa del primero.

## Ideas futuras

### v1.x — comprometido

- Recordar selección de filtros/orden en la URL (`?phase=…&orgs=…&order=…`) para compartir un listado pre-filtrado. Implica leer la URL en el script al cargar y sincronizar `pushState` al cambiar filtros, sin recarga.

### Sin compromiso

- Toggle dentro del multi-select de organizaciones de `/casos` para acotar a **sólo directa** o **sólo indirecta** (hoy OR sobre ambos niveles).
- Filtro nuevo de partido afectado en `/casos`, derivado de las indirectas que son `tipo: partido_politico`.
- Versión "tarjeta" para móvil de los 4 catálogos.
- Skeleton/placeholder mientras el script aplica filtros la primera vez (hoy el render es server-side, no se nota).
- Promoción del slot por defecto de `SectionH` con `.sec-h__action` a más cabeceras de sección del sitio (p. ej. "Descargar CSV" en `/cifras`, "Exportar" en biblioteca).

## Pendientes operativos

- [ ] Cuando `MultiSelectFilter` se use en una segunda página, comprobar la posición del popover en pantallas estrechas: hoy se ancla a `top: 100%` del trigger; si entra muy poco espacio bajo el trigger, podría querer abrir hacia arriba.
- [ ] Auditar que el clone de Cloudflare Pages preserve historial suficiente para `git log -1 -- content/casos/<slug>/`. Si en producción muchos casos salen sin fecha, pasar a fallback explícito (fecha del último hito) o publicar issue en el repo de Pages.
- [ ] Considerar extraer el patrón `<script is:inline>` + `DOMContentLoaded` a un comentario canónico en `DESIGN.md` o `AGENTS.md` para que futuros componentes interactivos no tropiecen con la misma trampa.
