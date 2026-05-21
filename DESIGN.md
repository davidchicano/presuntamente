# DESIGN.md — presuntamente

Lenguaje visual canónico de presuntamente.org. Este fichero es la fuente de verdad de la identidad visual del proyecto. Cualquier agente (Claude Design, Claude Code, otros) que vaya a generar diseño, código o cualquier output visual debe leerlo antes de empezar.

**Última actualización:** 2026-05-21.

---

## 1. Visual Theme & Atmosphere

presuntamente.org es un inventario público de los casos de corrupción más relevantes en España. Su misión es **reducir desinformación** a través de una referencia objetiva, trazable y sin cuota política.

El sitio publica datos sensibles sobre personas que pueden estar imputadas pero no condenadas. El tono visual debe transmitir **seriedad institucional y rigor**, nunca espectáculo. Más cerca de un boletín oficial que de un periódico digital.

**Inspiración:** administración pública española de los años 2000 (BOE, CENDOJ, antiguos portales ministeriales) reinterpretada para 2026.

Tres valores que el sistema visual debe reflejar:

1. **Sobriedad institucional.**
2. **Trazabilidad visible** — fuentes y niveles con presencia visual constante, no notas al pie.
3. **Neutralidad política** — ningún color, icono o decoración remite a partido, bandera o bando.

### Referencias positivas

- `boe.es` — el sumo del estilo: paleta, jerarquía, sobriedad textual.
- `poderjudicial.es/search/` — citación de resoluciones, formato de tablas.
- Portales ministeriales clásicos en Wayback Machine ~2005-2012.
- `congreso.es` — densidad informativa, jerarquía de texto.

### Anti-referencias

- News media moderno (NYT, El País) — demasiado editorial, fotográfico.
- **Magazine minimalista (Substack, Medium, blogs editoriales modernos)** — whitespace generoso, titulares gigantes, contenido espaciado. **Si una pantalla parece un blog editorial, es incorrecto.**
- Startup moderna (Linear, Vercel) — demasiado limpia, futurista.
- Investigative journalism dramático (ProPublica) — demasiado teatral.
- Gradientes, glassmorphism, neumorfismo, soft shadows.
- Paletas saturadas o vibrantes.
- Iconografía decorativa o ilustraciones.

### Importante: sobriedad NO es minimalismo editorial

Las webs institucionales españolas son sobrias pero **estructuralmente cargadas**:

- Bandas de color en headers (azul institucional, mostaza identitaria).
- Bloques con fondo (gris, mostaza, azul claro) que estructuran la página.
- Formularios con fondo gris claro y formato de oficina.
- Badges rectangulares con borde fino, **no** píldoras redondeadas.
- Identificadores en monoespaciada visibles.
- Tablas densas con bordes finos.
- Numeración explícita de secciones (1., 1.1., 1.1.1.).

Si la pantalla parece un expediente de oficina o un portal ministerial (Junta Consultiva, Sede Electrónica de la AEAT, antiguas webs de Moncloa, BOE), va bien. Si parece Substack, va mal.

---

## 2. Color Palette & Roles

Cada color como variable CSS. Cada slot define equivalente en dark mode.

### Slots base

- `--color-bg` — fondo principal. **Blanco roto** (off-white), referencia `#fafafa` o `#fbfbfb`. **NO beige (#f5f4f0 ya es demasiado cremoso), NO gris claro**: las webs institucionales españolas usan fondo prácticamente blanco. La sensación retro la cargan tipografía, bordes finos y densidad administrativa, no un fondo coloreado.
- `--color-fg` — texto principal. Gris muy oscuro o negro.
- `--color-fg-muted` — texto secundario / muted. Gris medio.
- `--color-accent` — acento institucional primario, **azul oscuro `#1f3a68`** (confirmado).
- `--color-accent-secondary` — **mostaza / ocre institucional apagado**, referencia `#c89b00` aprox. Para badges de fase, sub-headings de sección estructural, bandas decorativas. NO el amarillo literal del badge "Gobierno de España" — un tono propio en la misma familia. Es el **segundo color estructural** del sistema, no decorativo.
- `--color-surface` — **blanco puro** `#ffffff` para cards y bloques sobre el fondo `--color-bg`. Da el efecto de "papel" encima de la página.
- `--color-surface-muted` — **gris claro frío** `#f0f0f0` o `#eeeeee` (NO beige, NO cremoso) para fondos de formularios, filtros, áreas de utilidad administrativa.
- `--color-border` — líneas y bordes. Gris claro.

### Slots funcionales — estados epistémicos de los hechos

Cuatro colores apagados, **nunca asociables a partidos políticos**, para diferenciar tipos de afirmación en la ficha de caso:

- `--color-hecho-acreditado` — verde sobrio (no flúor, no neón).
- `--color-hecho-investigado` — ámbar / amarillo apagado.
- `--color-hecho-exculpatorio` — gris azulado neutro (sutil tono cool que sugiere "liberado/cerrado", sin saturación).
- `--color-hecho-desmentido` — gris claro neutro, sin saturación.
- Hechos en **contraposición** no tienen color propio; se gestionan con estructura (dos cajas visualmente equivalentes lado a lado).

**Restricción dura: NUNCA rojo en estados epistémicos.** Razones (todas semánticas, no políticas):

1. **Convención UI universal**: rojo en interfaces significa "error / peligro / destrucción". Usarlo para clasificar un estado epistémico (acreditado, investigado, exculpatorio, desmentido) viola la convención y confunde al lector.
2. **Desmentido en rojo invierte el mensaje**: "desmentido" significa que la afirmación es falsa, lo que **EXCULPA** a la persona afectada. Pintar de rojo (=malo) un hecho que de hecho exonera al sujeto invierte el significado.
3. **Investigado en rojo viola presunción de inocencia**: rojo pre-juzga culpabilidad antes de sentencia firme. Es exactamente lo que el modelo evita en datos y en lenguaje (doc 04 §3).

> **Sobre asociaciones partidarias de los colores:** en política española casi todo color tiene asociación con algún partido (rojo PSOE/IU/Sumar, azul PP, verde Vox flúor, naranja Cs/Sumar, morado Podemos, amarillo ERC/Junts, etc.). El proyecto **no** evita colores por su asociación política — sería imposible — sino que usa **siempre tonos muted / institucionales / desaturados**, jamás los tonos saturados de campaña. El verde acreditado es un verde sobrio (no el flúor de Vox). El ámbar investigado es un ocre apagado (no el amarillo brillante de Junts). El navy del accent es navy institucional (no el azul claro del PP). Esta es la regla unificadora real del sistema cromático.

### Slots visuales para niveles de fuente (N1-N4)

Los `Documento` tienen `nivel_fuente` ∈ {1, 2, 3, 4}. Los badges N1-N4 deben transmitir **gradient de oficialidad** sin introducir colores nuevos. Estrategia: variar **fill y peso del mismo navy institucional**, NUNCA colores distintos por nivel (introduciría semántica accidental tipo "verde=bueno / rojo=malo").

- **N1 (oficial primaria — sentencia, auto firme, BOE)**: fill sólido `--color-accent` con texto blanco. Máximo peso visual.
- **N2 (oficial secundaria / instructora — informes UDEF/UCO, escritos fiscalía)**: fill sólido azul medio (~50% lightness sobre el accent) con texto blanco. Sólido pero menos intenso.
- **N3 (institucional / pericial / cita oficial — Tribunal de Cuentas, nota organismo público, medio con cita)**: fill claro azul muy suave con texto navy. Identificable pero ligero.
- **N4 (cobertura periodística cruzada)**: outline navy sin fill, texto navy. El más "ligero" visualmente. Comunica "informativo, no oficial".

Misma forma (rectángulo) en los cuatro. La forma comunica categoría; el llenado comunica intensidad. Más oficial = más peso visual.

### Dark mode

Estrategia: **luminosidad invertida manteniendo identidad**. Mismos roles, mismos contrastes relativos, sin cambiar la paleta institucional. Activado por `prefers-color-scheme: dark` o vía `light-dark()`.

---

## 3. Typography Rules

- **Sans-serif base**: la tipografía institucional oficial del Gobierno de España desde 1999 es **Gill Sans** (presente en los logos del Estado y en portales ministeriales). Como es comercial (Monotype / Adobe Fonts) y no podemos servirla libremente, se usa stack con fallback abierto y del sistema:

  ```css
  font-family:
    "Gill Sans Nova",          /* Adobe Fonts si el visitante la tiene */
    "Gill Sans",               /* Apple users la tienen nativa */
    "Lato",                    /* fallback abierto humanista */
    "Source Sans 3",           /* otra alternativa humanista abierta */
    ui-sans-serif, system-ui,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  ```

  Esto conecta directamente con la tradición visual de los portales institucionales españoles (Moncloa, ministerios, BOE) sin depender de una fuente comercial.
- **Serif opcional** para titulares grandes o citas extensas: si se usa, clásica (Source Serif, Charter, Lora). Decisión binaria: o se usa con criterio o no se usa.
- **Monospace** para identificadores judiciales (número de procedimiento, hash de documento, slug): JetBrains Mono o stack del sistema (`ui-monospace, "Cascadia Code", "Roboto Mono", monospace`).

### Escala

`clamp()` para escalado fluido móvil ↔ desktop. Slots:

- `--font-size-0` — caption / metadata.
- `--font-size-1` — body small.
- `--font-size-2` — body.
- `--font-size-3` — lede / subtítulo.
- `--font-size-4` — h3.
- `--font-size-5` — h2.
- `--font-size-6` — h1.
- `--font-size-7` — display (encabezado de ficha de caso).

### Reglas de uso

- Body line-height: `1.6`.
- Headings line-height: `1.2`.
- Pesos: `400` para body, `600` o `700` para énfasis y headings. Nada por debajo de `400`.

---

## 4. Component Stylings

### Principio guía

**Densidad administrativa > generosidad editorial.** Cada componente debe transmitir "expediente de oficina" antes que "magazine digital". Esto se materializa en:

- Listados como **tablas con bordes finos visibles**, no cards estilo blog post.
- Filtros con fondo `--color-surface-muted` y aspecto de formulario administrativo.
- Badges **rectangulares con borde fino**, no píldoras redondeadas.
- Identificadores judiciales (número de procedimiento, hash, slug) en monoespaciada visibles, no escondidos.
- Numeración explícita de secciones donde aporte (1., 1.1., 1.1.1.).
- Headers con franja de color y bloque identitario a la izquierda (similar al patrón ministerio: logo + nombre + subtítulo institucional dentro de una caja con borde).
- Titulares editoriales presentes pero **no dominantes** — la página tiene muchos sub-titulares, identificadores y celdas informativas, no un único H1 gigante que ocupa media pantalla.

### Componentes prioritarios (orden de implementación recomendado)

1. **Header del sitio** — logo `presuntamente` en sans-serif sólido + nav ES / CAT.
2. **Card de Caso en listado** — nombre mediático prominente, badge de fase, último hito con fecha, número de implicados con rol activo. Borde fino 1px, sin sombra.
3. **Encabezado de ficha de Caso** — nombre mediático grande, nombre oficial menor, badge de fase, órgano judicial enlazado, cifra resumen si aplica.
4. **Card de Hito en cronología** — fecha con `fecha_precision`, badge de tipo (jurisdiccional / político / mediático) por icono y etiqueta textual, título, descripción corta, documento principal enlazado.
5. **Card de Hecho con citación inline** — enunciado, badge de tipo epistémico (acreditado / investigado / atribuido / exculpatorio / desmentido), lista de documentos respaldo con **badge de nivel 1-4 visible**.
6. **Bloque de contraposición de hechos** — caja con dos columnas equivalentes, etiqueta de actor en cada columna, mismo ancho, ningún tratamiento visual que sugiera ganador.
7. **Card de Persona en ficha de caso** — nombre, cargo si público, badge de rol(es) actual(es), micro-swimlane horizontal de trayectoria. Fallback textual debajo en mobile.
8. **Card de Documento en biblioteca** — título, tipo, badge de nivel de fuente, productor, enlace canónico + enlace de archivo (archive.org).
9. **Footer del sitio** — licencias, aviso legal, rectificación.
10. **TOC interno de ficha** — sticky en desktop, expandible en mobile.

### Convenciones de estado

- **Hover**: subrayado en enlaces; cambio de color sutil en cards interactivas. Sin animaciones decorativas.
- **Focus**: `:focus-visible` con outline claramente visible (2px sólido en `--color-accent`).
- **Active**: feedback inmediato, sin delay.

### Diferenciación Persona vs Organización

Las Cards de Persona y Organización deben ser **visualmente distinguibles a primera vista**, tanto en listados como en encabezados de ficha. NO pueden ser idénticas en estructura.

**Card de Persona**:
- Glyph izquierdo: **iniciales en cuadrado con borde fino** (ej. "FC" para Francisco Correa). Tamaño mayor en el encabezado de ficha; compacto en listado.
- Metadata-line: `<cargo público actual> · figura pública | privada`.
- Badge derecho: **rol procesal actual** (CONDENADO, INVESTIGADO, PROCESADO, ABSUELTO, DESIMPUTADO, TESTIGO…).
- Foto solo en ficha individual de Persona, nunca en cards. Reglas en §"Política de imágenes en fichas de Persona".

**Card de Organización**:
- Glyph izquierdo: **símbolo geométrico o mini-icono según `tipo`** (gavel para `juzgado` / `tribunal`, edificio para `empresa` / `organismo_publico`, asterisco/asociación para `asociacion_acusacion_popular`, columna para `partido_politico`, etc.). **Sin iniciales** — esa es la marca visual de Persona.
- Metadata-line: `<tipo> · <localidad si aplica> · <fundación si aplica>`.
- Badge derecho: **tipo de entidad** (ÓRGANO JUDICIAL, FISCALÍA, PARTIDO POLÍTICO, EMPRESA, ORGANISMO PÚBLICO, ASOCIACIÓN…).
- Nunca foto.

### Política de imágenes en fichas de Persona

Las fotografías **sólo aparecen en la ficha individual de Persona**, NO en cards de listado, NO en cards de Persona dentro de una ficha de Caso. Reglas obligatorias:

- Sólo si `es_figura_publica = true`. Personas privadas: jamás.
- Sólo imágenes con **licencia verificada libre**: Wikimedia Commons (CC), dominio público, retrato institucional oficial publicado por la propia institución (foto del Congreso, foto ministerial, foto del CGPJ).
- **Nunca fotografías de detención, juicio dramático, paseíllo, o momentos humillantes**, ni siquiera si la licencia lo permite. Decisión editorial alineada con doc 04 §11.
- Si no hay imagen libre disponible, fallback a las **iniciales** (mismo glyph que en la card).
- Pie de foto obligatorio: autor + licencia + año.

### Micro-componentes de citación inline

Dentro del cuerpo de un Hecho, descripción de Hito o resumen ejecutivo, ciertos tipos de información tienen tratamiento visual estandarizado:

**`<Money amount="…">`** — chip de dinero.

- Ejemplo: "el préstamo de [53,5 M€] aprobado el…".
- Estilo: borde fino 1px `--color-accent`, fill `--color-surface-muted`, texto en monoespaciada, padding mínimo, sin radius o muy bajo.
- Aplica a cualquier cantidad citable (préstamos, comisiones, fianzas, multas).
- Renderizado siempre idéntico, no negociable por contexto.

**`<Acronym ref="…">`** — referencia auto-resoluble a Organización.

- Ejemplo: "según el informe [UDEF] de fecha…".
- Lookup: el componente busca `ref` (o el texto del acrónimo) en `/content/organizaciones/`. Si existe slug equivalente, **link interno** a `/organizaciones/<slug>`. Si no existe, span con **tooltip** que muestra el nombre completo (no link).
- **NUNCA link a Wikipedia** ni a fuentes externas no controladas. Razón: tracking, pérdida de control editorial, saca al lector del inventario propio.
- Estilo: subrayado punteado fino sutil, mismo color que el texto del párrafo. Hover: cursor pointer + color → `--color-accent` si tiene link; sin cambio si solo tooltip.
- Lista de acrónimos auto-detectables (mantenida en código): UDEF, UCO, AN, TS, TC, TSJ, AP, JCI, JI, BOE, CGPJ, SEPI, AEAT, FGE, CIS, AIReF, Tribunal de Cuentas, etc.

---

## 5. Layout Principles

- **Ancho máximo de contenido**: ~70ch (aprox. 700-800px). Contenido centrado.
- **Header y footer**: ancho completo, padding consistente.
- **Cards**: padding interno generoso pero no airy.
- **Grid**: cuando se necesite, CSS Grid puro. Sin frameworks.
- **Separadores horizontales**: líneas 1px en `--color-border`, no espacios solos.
- **Numeración explícita** de secciones donde aporte (1., 1.1.), siguiendo la tradición administrativa.

---

## 6. Depth & Elevation

- **Sin `box-shadow`** por defecto. Si una sombra se justifica (popover, modal), debe ser sutil y plana.
- **Radius máximo**: 2-4 px. Considerar `0` para cards cuadradas cuando el contexto lo permita.
- **Bordes**: 1px sólido. Nada más grueso.
- **Sin elevación visual**: la jerarquía se transmite con tamaño, color y posición, no con profundidad.

---

## 7. Do's and Don'ts

### Do

- Líneas separadoras visibles, bordes finos, numeración explícita.
- Paleta austera con un único acento institucional frío.
- Iconografía monocroma estilo línea (Lucide outline, Heroicons outline, o SVG propios).
- Transmitir información de estado por **tres canales simultáneos**: color, etiqueta textual e icono. Nunca solo color.
- Spacing vertical generoso entre secciones.

### Don't

- Tailwind. El proyecto usa CSS nativo + Open Props (ver §9).
- Gradientes, glassmorphism, neumorfismo, soft shadows.
- Paletas saturadas, vibrantes, o que evoquen partido político.
- **Rojo en estados epistémicos** (semánticamente erróneo: convención UI "rojo=error" + invierte el mensaje en "desmentido" + viola presunción de inocencia en "investigado"; ver §2). La razón es semántica, no política — las asociaciones partidarias del color son inevitables y se mitigan con saturación baja, no evitando colores concretos.
- **Colores arbitrariamente distintos para niveles de fuente** (introduce semántica accidental; usar gradient de fill del mismo navy; ver §2).
- Iconografía decorativa, ilustraciones, fotografías sin función informativa.
- Animaciones decorativas, parallax, scroll-jacking.
- **Fotografías de personas en cards de listado** o en cards de Persona dentro de una ficha de Caso (sólo en ficha individual de Persona).
- Fotografías humillantes (paseíllo, detención, momento dramático) aunque la licencia las permita.
- **Links externos automáticos a Wikipedia** desde acrónimos. Preferir referencia interna al inventario propio (§4 "Micro-componentes").
- **Card de Persona y Card de Organización con la misma estructura visual**. Deben distinguirse a primera vista (iniciales vs símbolo geométrico; ver §4).

---

## 8. Responsive Behavior

- **Mobile-first**. Todos los componentes funcionan en 360px de ancho mínimo.
- **Breakpoints sugeridos**: 600px (tablet), 900px (desktop), 1200px (wide). Usados con criterio, no por inercia.
- **Container queries** preferidas a media queries para componentes reusables en contextos distintos.
- **Touch targets**: mínimo 44 × 44 px.
- **Visualizaciones gráficas** (cronología, swimlane, grafo): siempre con **fallback textual obligatorio** accesible por teclado.
- **`prefers-reduced-motion`**: respetado; transiciones deshabilitadas cuando esté activo.
- **WCAG AA mínimo** para contraste (4.5:1 texto normal, 3:1 texto grande).

---

## 9. Agent Prompt Guide

Instrucciones para cualquier agente LLM (Claude Design, Claude Code, otros) que genere output a partir de este fichero.

### Antes de generar nada

1. Lee este fichero entero.
2. Lee [`AGENTS.md`](AGENTS.md) y [`ROADMAP.md`](ROADMAP.md) para contexto operativo.
3. Si vas a tocar la ficha de caso, revisa además `docs/diseno/02-ficha-de-caso.md` para el modelo de UX.

### Stack técnico (no negociable)

- **Astro 5** con componentes `.astro`.
- **CSS nativo moderno**: nesting, `@layer`, `light-dark()`, container queries.
- **Open Props** para tokens base (importado vía `import 'open-props/style'`).
- **Sin Tailwind**, sin CSS-in-JS, sin styled-components.

### Estructura del repo a respetar

- Variables CSS globales en `/src/styles/global.css`.
- Componentes en `/src/components/`.
- Componentes de página (lógica de cada `Pg*`) en `/src/components/pages/`.
- Las `.astro` en `/src/pages/` son wrappers mínimos que importan los `Pg*` con `lang` prop.

### Primera iteración aceptable

Solo paleta + tipografía + tres componentes prioritarios:

1. Header del sitio.
2. Card de Caso en listado.
3. Card de Hito en cronología.

El resto en iteraciones posteriores.

### Cuando una propuesta viola este fichero

- Tailwind → rechazar.
- Paletas saturadas → rechazar.
- Iconografía con color partidista → rechazar.
- Animaciones decorativas → rechazar.

Proponer alternativa coherente con la estética gov-retro.

### Tras aplicar un cambio significativo

Actualizar [`ROADMAP.md`](ROADMAP.md) con lo aprendido y marcar el item correspondiente del backlog.
