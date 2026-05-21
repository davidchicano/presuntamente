# Prompt de branding gov-retro

**Estado:** borrador 1.0 · 2026-05-21
**Alcance:** brief de diseño visual para presuntamente.org. Estructurado como prompt para pasar a una skill de diseño (`design:design-system`, `design:design-critique`) o a otra herramienta de diseño generativa.

## Cómo usar este documento

Copia íntegro el bloque entre los marcadores `<<< INICIO DEL PROMPT >>>` y `<<< FIN DEL PROMPT >>>` y pásalo a la skill / herramienta de diseño elegida. Si la skill admite referencias visuales adjuntas, recoge capturas de los sitios listados en *Referencias visuales* dentro del prompt.

## Resumen para el maintainer

El prompt pide diseñar el **sistema visual** (paleta, tipografía, espaciado, bordes, componentes base) que refleje tres valores: sobriedad institucional, trazabilidad visible, neutralidad política. La estética de referencia es la **administración pública española de los años 2000 modernizada para 2026** (BOE, CENDOJ, antiguos portales ministeriales).

Restricciones técnicas que el prompt comunica: Astro + CSS nativo + Open Props. **No Tailwind**. Mobile-first. WCAG AA mínimo.

---

<<< INICIO DEL PROMPT >>>

# Diseño visual del sistema — presuntamente.org

## 1. Qué es este proyecto

presuntamente.org es un inventario interactivo, público y open source de los casos de corrupción más relevantes en España. Su misión es **reducir desinformación** ofreciendo una referencia objetiva, trazable y sin cuota política sobre los procedimientos judiciales relevantes.

- Cada afirmación cita su fuente con un nivel asignado (1: oficial verificable, 2: documento primario, 3: declaración bajo juramento grabada, 4: cobertura periodística cruzada).
- Lo acreditado, lo investigado, lo desmentido y lo exculpatorio aparecen claramente diferenciados visualmente.
- Imputación ≠ condena: el lenguaje y el diseño respetan la presunción de inocencia.

El sitio publica datos sensibles sobre personas que pueden estar imputadas pero no condenadas. El diseño debe transmitir **seriedad institucional y rigor**, no espectáculo.

## 2. Objetivo del sistema visual

Diseñar paleta, tipografía, espaciado, sistema de bordes y componentes base que reflejen tres valores:

1. **Sobriedad institucional.** El sitio se parece más a un boletín oficial que a un periódico digital.
2. **Trazabilidad visible.** Fuentes y niveles tienen presencia visual constante, no son notas al pie.
3. **Neutralidad política.** Ningún color, icono o decoración remite a un partido, bandera o bando. La paleta es austera por diseño.

## 3. Estética de referencia: "gov-retro español, modernizado"

Inspiración: la **administración pública española de los años 2000**. Webs del BOE, CENDOJ, antiguos portales ministeriales. Características formales:

- Anchos fijos, contenido centrado, márgenes generosos.
- Tipografía sans-serif principalmente (Arial/Helvetica/Verdana), serif ocasional para énfasis editorial.
- Paleta austera: negros, grises, beige, y un único acento institucional (típicamente rojo administrativo o azul oscuro).
- Bordes finos, líneas separadoras visibles, sin sombras, sin gradientes.
- Numeración explícita de secciones (1., 1.1., 1.1.1.).
- Tablas con bordes visibles, listas con bullets simples.
- Sin imágenes decorativas. Imágenes solo cuando son funcionales (retrato institucional, documento).
- Sin redondeos exagerados; bordes a 0-2 px.

**Modernización**: del original 2000s conservamos la disciplina y la sobriedad, subimos a 2026 en:

- Responsive mobile-first.
- Accesibilidad WCAG AA mínimo.
- Tipografía con escalado fluido (clamp).
- Soporte de dark mode.
- Performance (Astro estático, <100KB JS inicial).
- Microinteracciones mínimas: subrayado en hover, foco visible, sin animaciones gratuitas.

### Referencias visuales concretas

- **BOE** (`boe.es`) — el sumo del estilo: paleta, jerarquía, sobriedad textual.
- **CENDOJ / Poder Judicial** (`poderjudicial.es/search/`) — tablas, manera de citar resoluciones.
- **Ministerio de Justicia clásico** (versiones archivadas en Wayback Machine, circa 2005-2012).
- **Congreso de los Diputados** (`congreso.es`) — densidad informativa, jerarquía de texto.

### Anti-referencias (lo que NO queremos)

- Estética "news media moderna" (NYT, El País) — demasiado editorial, fotográfica.
- Estética "startup moderna" (Vercel, Linear) — demasiado limpia/futurista.
- Estética "investigative journalism dramático" (ProPublica) — demasiado teatral.
- Gradientes, glassmorphism, neumorfismo, soft shadows.
- Paletas saturadas o vibrantes.
- Iconografía decorativa o ilustraciones.

## 4. Sistema visual a diseñar

### 4.1 Paleta cromática

Define cada color como variable CSS (`--color-bg`, `--color-fg`, `--color-fg-muted`, `--color-accent`, `--color-border`, `--color-hecho-*`). Especifica equivalente para **dark mode**.

Slots requeridos:

- **Fondo principal** — beige claro o gris muy claro tipo "papel oficial" (referencia `#f5f5f0`, no amarillento).
- **Texto principal** — gris muy oscuro o negro.
- **Texto secundario / muted** — gris medio.
- **Acento institucional** — un único color frío y sobrio. Sugerencia: rojo administrativo apagado tipo BOE o azul oscuro institucional. Justifica la elección.
- **Líneas / bordes** — gris claro.
- **Colores funcionales de estado de hecho** (4 colores apagados, NUNCA partidistas):
  - Acreditado — verde sobrio (no flúor).
  - Investigado — ámbar/amarillo apagado.
  - Exculpatorio / desmentido — gris azulado neutro.
  - Contraposición — sin color propio; el componente lo gestiona con dos cajas visualmente equivalentes.

### 4.2 Tipografía

- **Sans-serif base**: stack de sistema o una fuente con peso editorial. Opciones a evaluar: stack del sistema (`ui-sans-serif, system-ui, ...`), Inter, IBM Plex Sans, Source Sans. Justifica.
- **Serif opcional** para titulares grandes o citas. Si se usa, clásica tipo Source Serif, Lora o Charter. Justifica si la usas o no.
- **Monospace** para identificadores (números de procedimiento, hashes, slugs): JetBrains Mono o stack del sistema.

Escala con `clamp()` para escalado fluido entre móvil y desktop. Define `--font-size-0` (caption) hasta `--font-size-7` (display).

Line-height: 1.6 para body, 1.2 para titulares.

### 4.3 Espaciado

Escala basada en Open Props (`--size-1` a `--size-9`) con consistencia rigurosa. Especifica qué nivel usar para:

- Padding interno de cards.
- Gap entre secciones.
- Padding del main centrado.
- Espacios verticales entre párrafos.
- Padding de header y footer.

### 4.4 Bordes y líneas

- Bordes 1px sólidos en `--color-border`.
- Radius máximo 2-4px (sobrio). Considera 0 para cards si funciona.
- Líneas separadoras horizontales con clase clara (`<hr class="separator">`).
- Sin sombras (`box-shadow`). Si una se necesita, debe justificarse y ser sutil.

### 4.5 Componentes a diseñar

Para cada uno: estructura HTML, clases CSS o estilos scoped en `<style>` de Astro, estados (default, hover, focus), responsivo mobile/desktop, y dark mode si aplica.

1. **Header del sitio** — logo "presuntamente" + nav ES/CAT.
2. **Card de Caso en listado** — nombre mediático, fase como badge, último hito, número de implicados con rol activo.
3. **Encabezado de ficha de Caso** — nombre mediático prominente, nombre oficial menor, fase badge, órgano judicial enlazado, cifra resumen.
4. **Card de Hito en cronología** — fecha (con `fecha_precision`), tipo (icono o badge sobrio), título, descripción corta, documento principal enlazado.
5. **Card de Hecho con citación inline** — enunciado, badge de tipo (acreditado/investigado/atribuido/exculpatorio/desmentido), lista de documentos respaldo con nivel visible en badge 1-4.
6. **Bloque de contraposición de hechos** — caja con dos columnas equivalentes, etiqueta de actor en cada columna, mismo ancho, misma jerarquía.
7. **Card de Persona en ficha de caso** — nombre, cargo si público, rol(es) actuales con badge, micro-swimlane horizontal de trayectoria, fallback textual debajo en mobile.
8. **Card de Documento en biblioteca** — título, tipo, nivel de fuente (badge), productor, enlace canónico + enlace archivo (archive.org).
9. **Footer del sitio** — licencias, enlace a aviso legal y rectificación.
10. **TOC interno de ficha** — sticky en desktop, expandible en mobile.

### 4.6 Iconografía

Set mínimo. Si se usan iconos:

- Monocromos (heredan `color` por `currentColor`).
- Estilo line, no fill.
- Conceptos sobrios: gavel, document, calendar, person, building, scale. **Nunca politizados, nunca color partidista.**
- Set sugerido: Lucide outline, Heroicons outline, o SVG propios.

### 4.7 Accesibilidad

- Contraste WCAG AA mínimo (4.5:1 texto normal, 3:1 texto grande).
- Foco visible en todos los interactivos (`:focus-visible`).
- Estado epistémico transmitido por **etiqueta textual + forma de icono + color**, no solo color.
- Tamaño mínimo de zona táctil 44 × 44 px.
- Soporte `prefers-color-scheme: dark`.
- Soporte `prefers-reduced-motion`.

## 5. Restricciones técnicas

- Stack: **Astro 5 + CSS nativo + Open Props**. **No Tailwind, no styled-components, no CSS-in-JS.**
- Mobile-first.
- Componentes vivirán en `/src/components/`.
- Variables CSS globales en `/src/styles/global.css`.
- Cero dependencia de JS para tipografía, layout, colores y comportamientos básicos.
- Compatibilidad con `light-dark()`, `:has()`, container queries, nesting CSS nativo.

## 6. Deliverables esperados

1. **`global.css` actualizado** con todas las variables del sistema y estilos base.
2. **Astro components** (o snippets HTML+CSS) para los 10 componentes listados en §4.5.
3. **Justificación textual breve** de cada decisión (¿por qué este color? ¿por qué esta fuente?), conectada a la tradición gov-retro.
4. **Notas de accesibilidad** por componente.
5. **Versión dark mode** declarada (aunque sea estrategia "luminosidad invertida manteniendo identidad").

## 7. Qué NO hay que hacer

- No diseñar branding completo (no logos elaborados, no marca, no slogans). Solo sistema visual.
- No proponer cambios al modelo de datos ni a la estructura de componentes `Pg*`.
- No introducir Tailwind ni otros frameworks CSS.
- No animaciones complejas, parallax ni scroll-jacking.
- No paletas saturadas, vibrantes ni que evoquen un partido político.

<<< FIN DEL PROMPT >>>

---

## Notas para el maintainer (no parte del prompt)

- Si la skill propone cambios al stack (p.ej. "usemos Tailwind"), rechazar y mantener Astro + CSS nativo + Open Props.
- Si propone iconografía con personajes o ilustraciones decorativas, rechazar.
- Primera iteración aceptable: solo paleta + tipografía + 2-3 componentes (Header, Card de Caso, Card de Hito). Iterar después con el resto.
- Cuando se aplique el resultado al repo, actualizar `src/styles/global.css` y los componentes correspondientes en `src/components/`. Mantener el patrón `Pg*` en `/src/components/pages/`.
