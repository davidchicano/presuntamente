# DESIGN.md — presuntamente

Lenguaje visual canónico de presuntamente.org. Este fichero es la fuente de verdad de la identidad visual del proyecto. Cualquier agente (Claude Design, Claude Code, otros) que vaya a generar diseño, código o cualquier output visual debe leerlo antes de empezar.

**Última actualización:** 2026-05-28 — añadida regla "animación funcional de una sola pasada" en visualizaciones de datos (Do's and Don'ts), al entregar la página `/graficas` y su sistema de charts ([`visualizaciones-graficas.md`](docs/web/features/visualizaciones-graficas.md)). Reveal sobrio gated por `prefers-reduced-motion`; sigue prohibida la animación decorativa/parallax/scroll-jacking.

**Anterior (2026-05-27):** contenedor común de cards de ficha (PersonaCard, OrgCard y Hecho) alineado con los casos destacados de home: borde fino uniforme, fondo `--color-surface`, hover sutil `translateX(-2px)` con fondo muy claro, y sin `border-left` grueso. El `border-left` queda reservado para F-función, avisos/aclaraciones y algunos bloques administrativos, no para codificar estado en cards de entidad o hecho. Se mantiene el refinamiento visual de F-estado (epistémico sin dot; rol procesal con dot + fondo suave sin borde) y `PartidoBadge` sin `border-left` grueso. Pendiente sincronizar con Claude Design.

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
3. **Investigado en rojo viola presunción de inocencia**: rojo pre-juzga culpabilidad antes de sentencia firme. Es exactamente lo que el modelo evita en datos y en lenguaje ([doc 04 — "Presunción de inocencia: reglas de redacción"](docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción)).

> **Excepción documentada**: el rojo institucional muted SÍ aparece en una dimensión muy concreta, los sub-roles `condenado_no_firme` (`#c44545` outline) y `condenado_firme` (`#c92e2e` fill) de F-estado (rol procesal). Nunca rojo PSOE/IU saturado. Los roles `investigado`, `procesado` y `acusado` quedan explícitamente fuera del rojo — la progresión visual va navy → mostaza → rojo, no "rojo desde el primer escalón". Ver "Sistema de badges" para el detalle del gradiente y la razón editorial.

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
| **F2 epistémico** | color + label | rectángulo fino + borde (sólido / dashed en sub-tipos) | Hecho (estado epistémico) |
| **F-estado rol** | `•` dot + color | fondo suave, sin borde | Persona (rol procesal del lado acusado) |
| **F4 Fase** | `▆▆▆░` micro-barra de progreso en la base | rectángulo fino + bar 3px | Caso fase actual |
| **F-función** | label de texto | rectángulo + **`▌` border-left 4px** + fondo neutro | Aparato judicial, acusación civil / parte civil, categorías de Hito/Organización/Documento |
| **Partido** *(ajeno a las 4 familias)* | — | ver [`partido-badge.md`](docs/web/features/partido-badge.md) | `PartidoBadge` |

Aunque **F-estado rol** y **F-función** comparten parcialmente colores (p.ej. navy aparece en `investigado` y en aparato judicial), el contenedor manda: F-estado rol es fondo suave + dot sin borde; F-función añade border-left grueso + fondo neutro. Visualmente no se confunden.

### F1 — Nivel de fuente (N1–N4)

Cuatro variantes del **mismo navy institucional**, NUNCA colores distintos por nivel (introduciría semántica accidental tipo "verde=bueno"). El "peso de llenado" comunica oficialidad:

- **N1** (sentencia, auto firme, BOE) → fill navy sólido + texto blanco. Peso visual máximo.
- **N2** (informe UDEF/UCO, escrito Fiscalía) → fill azul medio + texto blanco.
- **N3** (Tribunal de Cuentas, nota organismo público, medio con cita) → fill claro + texto navy.
- **N4** (cobertura periodística cruzada) → outline navy sin fill. El más "ligero".

### F2 epistémico — Estado del Hecho

Seis valores, cuatro colores. **Sin dot**: el estado se comunica por color + label + borde (sólido en tipos principales, dashed en sub-tipos semánticamente cercanos). Contenedor rectangular fino con borde 1px (misma base que F1/F4).

- **Acreditado** → verde sobrio, sólido.
- **Investigado** → ámbar, sólido.
- **Atribuido** → ámbar, **dashed**.
- **Exculpatorio** → gris azulado, sólido.
- **Desmentido** → gris neutro, sólido.
- **No concluyente** → gris neutro, **dashed**.

**Nunca rojo en estado epistémico** (ver "Color Palette & Roles" — convención UI, presunción de inocencia).

### F-estado rol — Rol procesal del lado acusado (Persona)

Ocho valores. **Con dot** a la izquierda, alineado con `EstadoFichaBadge` y `EstadoPublicacionBadge`: texto coloreado + fondo suave, **sin borde**. El modificador CSS `badge--estado-soft` centraliza la tipografía (peso 600, minúsculas normales, radius 2px).

Dos ejes cruzados:

- Eje matiz: **navy → mostaza → rojo** según gravedad procesal acumulada.
- Eje saturación: fondos más cargados marcan el "siguiente escalón" dentro de cada matiz.

| Rol | Dot / texto | Fondo | Razón editorial |
|---|---|---|---|
| `investigado` | navy `#1f3a68` | crema `#f7f0dd` | Estado cautelar; ser investigado **no implica** valoración judicial |
| `procesado` | mostaza oscuro `#6b4d00` | crema secundaria `#f7ecc5` | Auto de procesamiento: indicios racionales |
| `acusado` | mostaza oscuro | crema acusación `#f7ecc5` | Escrito de acusación formal |
| `condenado_no_firme` | rojo apagado `#c44545` | rosa pálido `#fceaea` | Sentencia recurrible; presunción de inocencia formal **sigue viva** |
| `condenado_firme` | rojo firme `#c92e2e` | rosa `#fde0e0` | Sentencia ejecutiva; **único momento** en que cae la presunción de inocencia |
| `absuelto` | verde `#2f6a3a` | verde pálido `#eef4ef` | Cierre favorable |
| `desimputado` | gris azul `#5b6878` | gris pálido `#ecedf1` | Sobreseimiento individual |
| `testigo` | gris neutro | gris claro `#f0f0f0` | No es parte |

> El rol **`condenado` se separa en dos sub-roles** en el schema (`condenado_no_firme` y `condenado_firme`) precisamente porque la distinción tiene peso editorial y legal: la presunción de inocencia formal sólo cae con la firmeza.

> **F2 epistémico vs F-estado rol:** comparten la dimensión conceptual ("estado de algo") pero **no comparten contenedor**. Un Hecho `investigado` (ámbar, borde fino, sin dot) y un rol `investigado` (navy, dot, fondo suave) se distinguen por color, adorno y contexto (Hecho card vs PersonaCard). No forzar paridad cromática entre ambas dimensiones.

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

Cubre todo lo que **no es estado** del lado acusado: actores con función formal en el procedimiento (aparato judicial, acusación civil) y categorías de objeto (tipo de Hito, tipo de Organización, tipo de Documento). Contenedor único: rectángulo fino + `▌` border-left 4px del color de la subfamilia + fondo neutro `--color-surface-muted` + label de texto. **Sin adornos decorativos**: la diferenciación viene del color del border-left + label.

Colores por subfamilia:

| Subfamilia | Roles / categorías | Color border-left + texto |
|---|---|---|
| Aparato judicial | `juez_instructor`, `juez_ponente`, `fiscal`, `magistrado`, `abogado_defensa`, `abogado_acusacion`, `perito_*`, `secretario_judicial` | navy fuerte `#1f3a68` |
| Acusación civil + parte civil | `denunciante`, `querellante`, `acusacion_particular`, `acusacion_popular`, `perjudicado` | azul suave `#4a6694` |
| Hito jurisdiccional | tipo de Hito | navy |
| Hito político | tipo de Hito | mostaza |
| Hito mediático | tipo de Hito | gris fg-muted |
| Tipo de Organización (listado) | tipo organización | gris border |

### Restricciones operativas

1. **No combinar adornos de familias distintas.** Un badge pertenece a una sola familia.
2. **No introducir colores nuevos.** El sistema está cerrado. Si parece que un caso pide un color nuevo, casi siempre es señal de que la dimensión está mal asignada.
3. **Dos canales simultáneos siempre.** Estado se comunica por color + label (+ borde o dot según familia). Nunca solo color (ver "Do's and Don'ts" → "Do").
4. **Densidad administrativa.** Adornos sobrios (border-left 4px en F-función, bar 3px en F4, dot relativo en F-estado rol). No glyphs decorativos en el contenedor: la claridad viene del color + posición + texto.

### Implementación

CSS canónico en `src/styles/global.css` (sección "Badges"). Componentes Astro:

- `LevelBadge.astro` — F1
- `EpistemicBadge.astro` — F2 epistémico (Hecho)
- `RolBadge.astro` — F-estado rol (Persona, lado acusado) + F-función (aparato + acusación civil). Centraliza el routing: el caller pasa `rol` y el componente decide la familia/adorno con `rolFamilia()` de `lib/labels.ts`.
- `PhaseBadge.astro` — F4
- `PartidoBadge.astro` — ver [`docs/web/features/partido-badge.md`](docs/web/features/partido-badge.md)
- `Hito.astro` — usa `.badge--cat-*` con border-left + icono Lucide

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
- Pesos: `400` para body, `500`/`600` para controles y metadatos, `600`/`700` para énfasis y headings. Nada por debajo de `400`.
- No usar pesos `800`/`900` en interfaz, ni combinaciones de uppercase + peso negro para botones, títulos secundarios o llamadas de estado. Ese tratamiento convierte piezas funcionales en banners y compite con la jerarquía editorial.

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

- **Hover**: subrayado en enlaces; en cards interactivas o escaneables, cambio de borde/fondo sutil y desplazamiento horizontal máximo `translateX(-2px)`. Sin animaciones decorativas.
- **Focus**: `:focus-visible` con outline claramente visible (2px sólido en `--color-accent`).
- **Active**: feedback inmediato, sin delay.

### Contenedor común de cards de ficha

`PersonaCard`, `OrgCard` y `Hecho` comparten el mismo chasis: `border: 1px solid var(--color-border)`, fondo `--color-surface`, radius 0, sin sombra y hover discreto (`border-color`, fondo apenas tintado con `color-mix(in srgb, var(--color-surface) 92%, var(--color-accent-secondary-soft))` + `translateX(-2px)`, desactivado con `prefers-reduced-motion`). La información de estado vive dentro del contenido:

- Persona: `RolBadge` + orden de roles vigentes/anteriores.
- Organización: `OrgGlyph` + tipo/roles/vínculos.
- Hecho: `EpistemicBadge` + borde fino del color epistémico + fuentes inline.

No usar `border-left` grueso para estas cards. Ese vocabulario pertenece a F-función, avisos/aclaraciones o bloques administrativos donde la barra lateral marca una función de contenedor, no el estado de una entidad.

### Diferenciación Persona vs Organización

Las Cards de Persona y Organización deben ser **visualmente distinguibles a primera vista**, tanto en listados como en encabezados de ficha. NO pueden ser idénticas en estructura.

**Card de Persona**:
- Glyph izquierdo: **iniciales en cuadrado con borde fino** (ej. "FC" para Francisco Correa). Tamaño mayor en el encabezado de ficha; compacto en listado.
- Metadata-line: `<cargo público actual> · figura pública | privada`.
- Badge derecho: **rol procesal actual** (CONDENADO, INVESTIGADO, PROCESADO, ABSUELTO, DESIMPUTADO, TESTIGO…).
- Foto solo en ficha individual de Persona, nunca en cards. Reglas en "Política de imágenes en fichas de Persona".

**Card de Organización**:
- Glyph izquierdo: **símbolo geométrico o mini-icono según `tipo`** (gavel para `juzgado` / `tribunal`, edificio para `empresa` / `organismo_publico`, asterisco/asociación para `asociacion_acusacion_popular`, columna para `partido_politico`, etc.). **Sin iniciales** — esa es la marca visual de Persona.
- Metadata-line: `<tipo> · <localidad si aplica> · <fundación si aplica>`.
- Badge derecho: **tipo de entidad** (ÓRGANO JUDICIAL, FISCALÍA, PARTIDO POLÍTICO, EMPRESA, ORGANISMO PÚBLICO, ASOCIACIÓN…).
- Nunca foto.

### Política de imágenes en fichas de Persona

Las fotografías **sólo aparecen en la ficha individual de Persona**, NO en cards de listado, NO en cards de Persona dentro de una ficha de Caso. Reglas obligatorias:

- Sólo si `es_figura_publica = true`. Personas privadas: jamás.
- Sólo imágenes con **licencia verificada libre**: Wikimedia Commons (CC), dominio público, retrato institucional oficial publicado por la propia institución (foto del Congreso, foto ministerial, foto del CGPJ).
- **Nunca fotografías de detención, juicio dramático, paseíllo, o momentos humillantes**, ni siquiera si la licencia lo permite. Decisión editorial alineada con [doc 04 — "Ética"](docs/diseno/04-riesgos-legales-y-eticos.md#11-ética).
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
- Lookup: el sistema busca `label` y `nombres_alternativos` en `/content/glosario/`. Si hay match, **span con tooltip** que muestra `descripcion_breve`. **Sin link** — ni interno (no son páginas del inventario) ni externo (ver "Component Stylings" — prohíbe Wikipedia / fuentes no controladas).
- Estilo: igual al `<Acronym>` cuando no enlaza — subrayado punteado, cursor `help` al hover.

**Auto-detección + escape hatch.** La lógica está en `src/lib/richProse.ts` (componente `<RichProse>`). Detecta automáticamente los tres tipos sobre el texto plano de Hecho.enunciado, Hito.descripcion, descripcion_corta y resumen_cifras. Cuando la auto-detección falla, sintaxis explícita en el YAML: `[[org:<slug>|<label>]]`, `[[persona:<slug>|<label>]]`, `[[€:<texto>|<tooltip>]]`.

**Auto-exclusión en la propia ficha.** En `/personas/<slug>`, los aliases de esa persona no se autoenlazan en su biografía. Igual con `/organizaciones/<slug>`. En `/casos/<slug>`, la persona/organización cuyo `id` coincide con el slug del caso (típico: caso Begoña Gómez) no se autoenlaza en resumen ejecutivo, resumen_cifras, enunciados de Hecho ni descripciones de Hito. Titulares, breadcrumbs y nombre_oficial NUNCA se enrutan por RichProse (son texto plano por construcción).

---

### Sheet (panel deslizante reutilizable)

Componente común [`src/components/Sheet.astro`](src/components/Sheet.astro) para mostrar contenido en un overlay: **bottom sheet en móvil** (sube desde abajo, backdrop) y **modal centrado en desktop** (≥720px). Aporta el contenedor, los bordes (borde superior 3px navy), la cabecera (título + botón de cierre cuadrado) y la interacción (abrir/cerrar/posicionar, backdrop, Escape, foco, `prefers-reduced-motion`). El **contenido lo decide quien lo use**.

Contrato genérico por atributos: se renderiza `<Sheet />` una vez; cualquier disparador lleva `data-sheet="<clave>"`; el contenido va en un bloque oculto `<div hidden data-sheet-content="<clave>" data-sheet-title="…">`. Clases utilitarias de contenido: `.sheet-list` / `.sheet-item` / `.sheet-item__meta` / `.sheet-empty` / `.sheet-all`. Primer uso: drill-down de [`/graficas`](docs/web/features/visualizaciones-graficas.md) y teaser de la home. Reutilizable en cualquier página que necesite un panel así (hermano de `HoverCard`, que cubre el preview ligero al pasar el cursor).

## 5. Layout Principles

- **Ancho máximo de contenido**: ~70ch (aprox. 700-800px). Contenido centrado.
- **Header y footer**: ancho completo, padding consistente.
- **Cards**: padding interno generoso pero no airy.
- **Grid**: cuando se necesite, CSS Grid puro. Sin frameworks.
- **Separadores horizontales**: líneas 1px en `--color-border`, no espacios solos.
- **Numeración explícita** de secciones donde aporte (1., 1.1.), siguiendo la tradición administrativa.

### Navegación interna en fichas largas

Las fichas (Caso, Persona, Organización, Documento, Delito) y las páginas largas (Sobre, Aviso legal) usan tres mecanismos coordinados para que el lector no se pierda al hacer scroll. Todos están conectados al componente `<SectionH id="..." />` y funcionan automáticamente en cualquier página que lo use; no hay que añadir nada en cada Pg.

**(a) Índice lateral (`PageToc`)** — cápsula a la derecha del contenido, 220px, con la lista numerada de secciones y scrollspy automático. Implementación en grid de 2 columnas dentro del `<main>` con `position: sticky; top: var(--space-4)`: arranca en flow alineada con el título de la ficha y se ancla al top del viewport solo cuando el scroll la alcanza. La sección visible se resalta con border-left navy + bold. En anchos `<1280px` se colapsa a un botón flotante (FAB) abajo a la derecha que abre el mismo índice como overlay. El componente se auto-oculta si la página no tiene al menos 2 `SectionH` (listados, `/buscar`).

**(b) Sec-h sticky** — cada `<SectionH>` lleva `position: sticky; top: 0` en CSS, pero el JS de `BaseLayout` envuelve runtime cada header con su contenido en un `<section data-toc-section>` para darle scope: solo un encabezado está pegado al top del viewport a la vez, no se apilan. El borde superior navy 2px + fondo `--color-surface-muted` aseguran que el texto que pasa por debajo no se mezcla.

**(c) Highlight `:target`** — cuando una navegación interna aterriza en `#id` (clic en una fuente del Hecho que apunta a un documento, link cruzado entre secciones), el elemento objetivo recibe un flash mostaza (`--color-accent-secondary-soft` + sombra `--color-accent-secondary-border`) durante 2.6s y se desvanece solo. Aplica a documentos, hitos, hechos, roles — cualquier elemento con `id`. Excepción explícita: los `.sec-h:target` no se iluminan (el TOC ya marca la sección activa, sería ruido visual redundante). `scroll-margin-top: 80px` global asegura que el destino no quede tapado bajo el sec-h sticky. Respeta `prefers-reduced-motion`.

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
- **Animación funcional de una sola pasada** en visualizaciones de datos (reveal de barras/columnas al entrar en viewport): permitida si es sobria, no se repite en bucle, no hace scroll-jacking ni parallax, y respeta `prefers-reduced-motion` (sin animación → contenido completo). Es enganche funcional, no decoración. Detalle: [`docs/web/features/visualizaciones-graficas.md`](docs/web/features/visualizaciones-graficas.md).

### Don't

- Tailwind. El proyecto usa CSS nativo + Open Props (ver "Agent Prompt Guide").
- Gradientes, glassmorphism, neumorfismo, soft shadows.
- Paletas saturadas, vibrantes, o que evoquen partido político.
- **Rojo en estados epistémicos** (semánticamente erróneo: convención UI "rojo=error" + invierte el mensaje en "desmentido" + viola presunción de inocencia en "investigado"; ver "Color Palette & Roles"). La razón es semántica, no política — las asociaciones partidarias del color son inevitables y se mitigan con saturación baja, no evitando colores concretos.
- **Colores arbitrariamente distintos para niveles de fuente** (introduce semántica accidental; usar gradient de fill del mismo navy; ver "Color Palette & Roles").
- Iconografía decorativa, ilustraciones, fotografías sin función informativa.
- Animaciones decorativas, parallax, scroll-jacking.
- **Fotografías de personas en cards de listado** o en cards de Persona dentro de una ficha de Caso (sólo en ficha individual de Persona).
- Fotografías humillantes (paseíllo, detención, momento dramático) aunque la licencia las permita.
- **Links externos automáticos a Wikipedia** desde acrónimos. Preferir referencia interna al inventario propio (ver "Micro-componentes de citación inline").
- **Card de Persona y Card de Organización con la misma estructura visual**. Deben distinguirse a primera vista (iniciales vs símbolo geométrico; ver "Component Stylings").

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
