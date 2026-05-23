# DESIGN.md — presuntamente

Lenguaje visual canónico de presuntamente.org. Este fichero es la fuente de verdad de la identidad visual del proyecto. Cualquier agente (Claude Design, Claude Code, otros) que vaya a generar diseño, código o cualquier output visual debe leerlo antes de empezar.

**Última actualización:** 2026-05-22 — sistema de badges redefinido a 4 familias finales (F1 Nivel · F-estado · F4 Fase · F-función). Decisiones editoriales clave incorporadas: el rol procesal `investigado` queda fuera de los rojos (cautelar, no acusatorio); el rol `condenado` se separa en `condenado_no_firme` (rojo apagado outline) y `condenado_firme` (rojo chillón fill), porque la presunción de inocencia formal cae solo con firmeza. El sistema F-estado y F-función comparten colores parcialmente pero usan **contenedores distintos** (rectángulo fino vs rectángulo + border-left grueso + glyph) para evitar colisión. Pendiente sincronizar con Claude Design (prompt entregado al maintainer).

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

> **Excepción documentada**: el rojo institucional muted SÍ aparece en una dimensión muy concreta, los sub-roles `condenado_no_firme` (`#c44545` outline) y `condenado_firme` (`#c92e2e` fill) de F-estado (rol procesal). Nunca rojo PSOE/IU saturado. Los roles `investigado`, `procesado` y `acusado` quedan explícitamente fuera del rojo — la progresión visual va navy → mostaza → rojo, no "rojo desde el primer escalón". Ver §2bis para el detalle del gradiente y la razón editorial.

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

## 2bis. Sistema de badges

Los badges del proyecto representan **cuatro dimensiones distintas** de información: nivel de fuente del Documento, estado de algo (Hecho epistémico + Persona rol procesal), fase del Caso, función en el procedimiento (aparato judicial / acusación civil / categoría de Hito/Org/Doc). Si todas comparten la misma plantilla y se distinguen sólo por color, el lector pierde la pista de qué tipo de información está leyendo.

### Principio guía

Mismo "rectángulo institucional" base (borde 1px, radius 0, padding 1px 6px, caps 10px bold). Cada familia añade un **vocabulario propio**: un adorno + un tipo de contenedor. Las familias son no superponibles — cada badge pertenece a una sola.

| Familia | Adorno | Contenedor | Cuándo aplica |
|---|---|---|---|
| **F1 Nivel** | `font-mono` + gradiente navy (sólido→outline) | rectángulo fino | Documento N1-N4 |
| **F-estado** | `•` dot 6px a la izquierda + color | rectángulo fino | Hecho (estado epistémico) y Persona (rol procesal del lado acusado) |
| **F4 Fase** | `▆▆▆░` micro-barra de progreso en la base | rectángulo fino + bar 3px | Caso fase actual |
| **F-función** | glyph monocromo + color | rectángulo + **`▌` border-left 4px** + fondo neutro | Aparato judicial, acusación civil / parte civil, categorías de Hito/Organización/Documento |

Aunque **F-estado** y **F-función** comparten parcialmente colores (p.ej. navy aparece en `investigado` y en aparato judicial), el contenedor manda: F-estado es rectángulo fino normal, F-función añade border-left grueso + fondo neutro + glyph. Visualmente no se confunden.

### F1 — Nivel de fuente (N1–N4)

Cuatro variantes del **mismo navy institucional**, NUNCA colores distintos por nivel (introduciría semántica accidental tipo "verde=bueno"). El "peso de llenado" comunica oficialidad:

- **N1** (sentencia, auto firme, BOE) → fill navy sólido + texto blanco. Peso visual máximo.
- **N2** (informe UDEF/UCO, escrito Fiscalía) → fill azul medio + texto blanco.
- **N3** (Tribunal de Cuentas, nota organismo público, medio con cita) → fill claro + texto navy.
- **N4** (cobertura periodística cruzada) → outline navy sin fill. El más "ligero".

### F-estado — Estado epistémico (Hecho) + Rol procesal (Persona)

El `•` dot a la izquierda y el contenedor rectangular fino son comunes a ambas dimensiones porque **ambas comunican un estado**: estado de un hecho (¿está acreditado?) o estado de una persona frente al caso (¿está investigada, procesada, condenada?). El contexto (Hecho card vs PersonaCard) desambigua. La coincidencia conceptual no es accidental: un Hecho `investigado` y un rol procesal `investigado` comparten color (ámbar) y semántica ("atribución no acreditada").

**Estado epistémico del Hecho** (6 valores, 4 colores). Borde sólido para tipo principal, borde dashed para sub-tipo:

- **Acreditado** → verde sobrio, sólido.
- **Investigado** → ámbar, sólido.
- **Atribuido** → ámbar, **dashed**.
- **Exculpatorio** → gris azulado, sólido.
- **Desmentido** → gris neutro, sólido.
- **No concluyente** → gris neutro, **dashed**.

**Nunca rojo en estado epistémico** (ver §2 — convención UI, presunción de inocencia).

**Rol procesal del lado acusado** (8 valores). Dos ejes cruzados:

- Eje matiz: **navy → mostaza → rojo** según gravedad procesal acumulada.
- Eje saturación: **outline → fill** dentro de cada matiz, marcando el "siguiente escalón".

| Rol | Dot/borde | Fondo | Razón editorial |
|---|---|---|---|
| `investigado` | navy `#1f3a68` | blanco | Estado cautelar; ser investigado **no implica** valoración judicial — una persona puede ser investigada y ser inocente. Por eso va en navy outline (caso base, no acusatorio), no en mostaza ni rojo |
| `procesado` | mostaza `#c89b00` | blanco | Auto de procesamiento: un juez ha dicho que hay indicios racionales |
| `acusado` | mostaza `#c89b00` | mostaza soft `#f7ecc5` (fill) | Escrito de acusación formal; misma familia que procesado, "siguiente escalón" |
| `condenado_no_firme` | rojo apagado `#c44545` | blanco | Sentencia condenatoria recurrible; presunción de inocencia formal **sigue viva** mientras quepa recurso |
| `condenado_firme` | blanco | rojo chillón `#c92e2e` (fill) | Sentencia ejecutiva sin recurso pendiente; **único momento jurídico** en que cae la presunción de inocencia |
| `absuelto` | verde sobrio `#2f6a3a` | blanco | Cierre favorable (mismo verde que estado epistémico `acreditado`) |
| `desimputado` | gris azulado `#5b6878` | blanco | Sobreseimiento individual (mismo color que `exculpatorio`) |
| `testigo` | gris neutro | blanco | No es parte |

> El rol **`condenado` se separa en dos sub-roles** en el schema (`condenado_no_firme` y `condenado_firme`) precisamente porque la distinción tiene peso editorial y legal: la presunción de inocencia formal sólo cae con la firmeza. Mantener ambos como un único `condenado` sería editorialmente menos honesto.

El **rojo se reserva exclusivamente a `condenado_no_firme` y `condenado_firme`**. Tonos institucionales muted (`#c44545`, `#c92e2e`), nunca el rojo PSOE/IU saturado de campaña. La progresión expresa **gravedad procesal**, no juicio moral.

### F4 — Fase del Caso

La fase es una secuencia ordenada: instrucción → fase intermedia → juicio oral → sentencia firme. Cuatro buckets activos + uno especial (archivado). Cada badge incluye una **micro-barra de progreso de 4 segmentos** en su base (3px de alto, pintada con `linear-gradient` sobre `::after`):

- Instrucción → `[█░░░]` (1/4)
- Fase intermedia → `[██░░]` (2/4)
- Juicio oral → `[███░]` (3/4)
- Sentencia firme → `[████]` (4/4)
- Archivado → `[░░░░]` (0/4, segmentos en gris) — peso normal, color desaturado, distinto del firme

**Las 4 fases activas comparten contenedor idéntico en peso y borde** (mismo `font-weight`, mismo borde 1px navy). La identidad de fase la cuentan tres palancas combinadas:

1. **El fondo del badge** iguala al color del quesito de su fase. Cuatro tonos fijos en escala creciente (`--color-phase-seg-1..4`): seg-1 azul muy tenue casi blanco, seg-4 azul cargado pero todavía legible. Como cada fase pinta su fondo con SU quesito, el quesito de la fase actual visualmente se funde con el fondo; los anteriores destacan más claros y los posteriores quedan en blanco (`--color-surface`) para leer como "todavía por venir".
2. **El recuento de quesitos pintados**: 1/4 en instr, 2/4 en intermedia, 3/4 en juicio, 4/4 en firme. Confirmación visual de en qué peldaño estamos.
3. **El color del texto** se adapta para mantener contraste AA: navy `--color-accent` en las 3 primeras fases (fondos claros), blanco en `firme` (fondo más cargado). En dark mode, las 4 fases usan `--color-fg` claro porque los fondos en dark son todos suficientemente oscuros.

Archivado queda fuera del gradiente (gris muted, peso normal) porque "cerrado sin condena" no es el máximo de la escala procesal.

La barra comunica "dónde estamos en el procedimiento" de un vistazo, sin que el lector tenga que recordar el orden de las fases procesales españolas.

### F-función — Roles de función en el procedimiento + categorías

Cubre todo lo que **no es estado** del lado acusado: actores con función formal en el procedimiento (aparato judicial, acusación civil) y categorías de objeto (tipo de Hito, tipo de Organización, tipo de Documento). Contenedor único: rectángulo fino + `▌` border-left 4px del color de la subfamilia + fondo neutro `--color-surface-muted` + glyph monocromo a la izquierda.

Glyphs y tonos:

| Subfamilia | Roles / categorías | Glyph | Color border-left + texto |
|---|---|---|---|
| Aparato judicial | `juez_instructor`, `juez_ponente`, `fiscal`, `magistrado`, `abogado_defensa`, `abogado_acusacion`, `perito_*`, `secretario_judicial` | `§` (signo de sección, símbolo jurídico clásico) | navy fuerte `#1f3a68` |
| Acusación civil + parte civil | `denunciante`, `querellante`, `acusacion_particular`, `acusacion_popular`, `perjudicado` | `‡` (doble daga, "cita / parte distinguida") | azul suave `#4a6694` |
| Hito jurisdiccional | tipo de Hito | `§` | navy |
| Hito político | tipo de Hito | `◆` | mostaza |
| Hito mediático | tipo de Hito | `¶` | gris fg-muted |
| Tipo de Organización (listado) | tipo organización | (sin glyph propio en listado tabular) | gris border |

**Glyphs en caracteres del bloque Latín-Suplemento / Misc. Punctuation** (`§`, `¶`, `‡`, `◆`) que SÍ están en fuentes humanistas (Lato, Gill Sans, Source Sans). Evitamos `⚖` y `⚑` aunque semánticamente cuadrarían: muchas fuentes humanistas no los cubren y caen a fallback que renderiza irreconocible a 11-12px.

### Restricciones operativas

1. **No combinar adornos de familias distintas.** Un badge pertenece a una sola familia.
2. **No introducir colores nuevos.** El sistema está cerrado. Si parece que un caso pide un color nuevo, casi siempre es señal de que la dimensión está mal asignada.
3. **Tres canales simultáneos siempre.** Estado se comunica por color + label + adorno. Nunca solo color (ver §7 "Do").
4. **Densidad administrativa.** Adornos sobrios (border-left 4px, bar 3px, dot 6px, glyph 12px). No más sprite que el sistema actual.

### Implementación

CSS canónico en `src/styles/global.css` (sección "Badges"). Componentes Astro:

- `LevelBadge.astro` — F1
- `EpistemicBadge.astro` — F-estado (Hecho)
- `RolBadge.astro` — F-estado (Persona, lado acusado) + F-función (aparato + acusación civil). Centraliza el routing: el caller pasa `rol` y el componente decide la familia/adorno con `rolFamilia()` de `lib/labels.ts`.
- `PhaseBadge.astro` — F4
- `Hito.astro` — usa `.badge--cat-*` con border-left + glyph propio

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

**Entrada de Glosario** — referencia a "cosa de interés" no jerárquica.

- Ejemplo: "a través del [Fondo de Apoyo a la Solvencia de Empresas Estratégicas] gestionado por…".
- Aplica a programas o fondos públicos citados por nombre comercial (Fondo de Apoyo a la Solvencia, PERTE Chip), operaciones policiales nombradas (Operación Kitchen, Operación Centauro) y sobrenombres mediáticos de tramas (Gürtel, Lezo, Púnica).
- Lookup: el sistema busca `label` y `nombres_alternativos` en `/content/glosario/`. Si hay match, **span con tooltip** que muestra `descripcion_breve`. **Sin link** — ni interno (no son páginas del inventario) ni externo (DESIGN §4 prohíbe Wikipedia / fuentes no controladas).
- Estilo: igual al `<Acronym>` cuando no enlaza — subrayado punteado, cursor `help` al hover.

**Auto-detección + escape hatch.** La lógica está en `src/lib/richProse.ts` (componente `<RichProse>`). Detecta automáticamente los tres tipos sobre el texto plano de Hecho.enunciado, Hito.descripcion, descripcion_corta y resumen_cifras. Cuando la auto-detección falla, sintaxis explícita en el YAML: `[[org:<slug>|<label>]]`, `[[persona:<slug>|<label>]]`, `[[€:<texto>|<tooltip>]]`.

**Auto-exclusión en la propia ficha.** En `/personas/<slug>`, los aliases de esa persona no se autoenlazan en su biografía. Igual con `/organizaciones/<slug>`. En `/casos/<slug>`, la persona/organización cuyo `id` coincide con el slug del caso (típico: caso Begoña Gómez) no se autoenlaza en resumen ejecutivo, resumen_cifras, enunciados de Hecho ni descripciones de Hito. Titulares, breadcrumbs y nombre_oficial NUNCA se enrutan por RichProse (son texto plano por construcción).

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
