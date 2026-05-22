# presuntamente — Design System

Sistema de diseño para **presuntamente.org**, inventario público, interactivo y open-source de los casos de corrupción más relevantes en España.

> Identidad visual canónica de gov-retro español, reinterpretada para 2026. Sobria, austera, institucional. Sin paletas saturadas, sin gradientes, sin asociación política. Más cerca de un boletín oficial que de un periódico digital.

---

## Fuentes

Este sistema se ha extraído del repositorio oficial del proyecto:

- **GitHub:** [`davidchicano/presuntamente`](https://github.com/davidchicano/presuntamente)
- **DESIGN.md** (fuente de verdad de la identidad): <https://github.com/davidchicano/presuntamente/blob/main/DESIGN.md>
- **AGENTS.md** (principios irrenunciables): <https://github.com/davidchicano/presuntamente/blob/main/AGENTS.md>
- **Modelo UX de ficha de caso:** <https://github.com/davidchicano/presuntamente/blob/main/docs/diseno/02-ficha-de-caso.md>

Si vas a hacer trabajo serio sobre presuntamente, abre esos ficheros: contienen las decisiones de producto, las reglas anti-desinformación (`P-01..P-10`) y la doctrina visual completa. Este design system los traduce a tokens, componentes y un UI kit.

---

## Producto en una frase

Una referencia objetiva, trazable y sin cuota política de los procedimientos judiciales relevantes en España, donde **cada afirmación cita su fuente y su nivel de fuente** y donde **imputación nunca equivale a condena**.

## Audiencia

- Ciudadano/a buscando contexto verificable sobre un caso mediático.
- Periodistas e investigadores que necesitan trazabilidad documental.
- Académicos y juristas.

## Tres principios que el sistema visual debe reflejar

1. **Sobriedad institucional.** Cerca del BOE, lejos del clickbait.
2. **Trazabilidad visible.** Niveles de fuente con presencia visual constante — nunca en tooltip.
3. **Neutralidad política.** Ningún color, icono o decoración remite a partido, bandera o bando.

## Stack del producto

- Astro 5 + componentes `.astro`.
- CSS nativo moderno (nesting, `@layer`, `light-dark()`, container queries).
- **Open Props** como base de tokens (`import 'open-props/style'`).
- **Sin Tailwind**, sin CSS-in-JS, sin styled-components.

Este design system genera HTML estático con CSS plano para que sea legible desde cualquier editor o agente. Cuando se trasvase al codebase Astro, los tokens caen directamente en `/src/styles/global.css`.

---

## Índice del repositorio

| Fichero / carpeta | Contenido |
|---|---|
| [`README.md`](README.md) | Este documento |
| [`SKILL.md`](SKILL.md) | Guía para agentes (Claude Code u otros) que usen este sistema |
| [`colors_and_type.css`](colors_and_type.css) | Variables CSS: paleta, escala tipográfica, espacio, radios |
| [`fonts/`](fonts) | Fuentes utilizadas (servidas vía Google Fonts en MVP: Lato, Source Sans 3, Source Serif 4, JetBrains Mono) |
| [`assets/`](assets) | Wordmark, escudos institucionales placeholder, iconografía |
| [`preview/`](preview) | Cards individuales del sistema (colores, tipo, espacio, componentes, marca) |
| [`ui_kits/web/`](ui_kits/web) | UI kit del sitio: home + ficha de caso + biblioteca + componentes JSX |

---

## CONTENT FUNDAMENTALS

> *Sección redactada tras leer DESIGN.md, AGENTS.md y `docs/diseno/02-ficha-de-caso.md`.*

### Voz y tono

Voz de **boletín oficial** modernizado. Tono **neutro institucional**: ni denuncia, ni minimización, ni dramatismo. La página parece una sala de archivo, no un periódico.

- Persona narrativa: **impersonal**. Ni "tú" ni "nosotros". El sitio expone; no opina ni interpela.
- Castellano administrativo, sin coloquialismo. **Sin emoji**. Cero.
- Lengua secundaria: **catalán** (carpetas `/src/pages/cat/` listas desde día 1).

### Sentencias y verbos

Sobre afirmaciones procesales, sólo verbos compatibles con la fase real. **Verbos prohibidos** salvo en cita literal de fuente:

- ❌ "robó", "estafó", "se apropió", "saqueó"
- ✅ "se investiga", "se le atribuye", "consta en el informe X que…", "fue procesado por…"

**Adjetivos editoriales prohibidos** salvo cita literal: "escándalo", "trama", "mafia", "saqueo".

Imputación ≠ condena. Esto es una regla de redacción, no un eslogan.

### Casing

- Títulos en **sentence case** ("Encabezado del caso"), no Title Case.
- Nombres mediáticos respetan su grafía periodística ("Caso Gürtel", "Caso ERE de Andalucía").
- Números de procedimiento siempre con formato canónico (`DPA 275/2008 — JCI nº6, AN`) y en **monoespaciada**.

### Microcopy

Algunos ejemplos canónicos del DESIGN.md, todos en castellano administrativo:

- Aviso al lector sobre hechos no acreditados:
  > *Los hechos en esta sección están bajo investigación judicial pero **no han sido acreditados**. Pueden ser confirmados, descartados o archivados en el futuro.*

- Citación inline (badge de nivel pegado a la afirmación):
  > El 22 de junio de 2020, SEPI aprobó un préstamo de 53 millones de euros &nbsp;<kbd>Auto SEPI · N1</kbd>.

- Disclaimer estándar al pie de ficha:
  > *Esta ficha presenta información pública sobre un procedimiento judicial. Las personas mencionadas como investigadas o procesadas se presumen inocentes hasta que recaiga sentencia firme.*

### Numeración

Numeración explícita en secciones largas (`1.`, `1.1.`, `1.2.`) siguiendo la tradición administrativa. Aporta jerarquía sin recurrir a peso visual.

### Lo que NUNCA se escribe

- Adjetivos editoriales fuera de cita.
- Nombres de personas privadas no implicadas formalmente.
- Lenguaje insinuativo de culpabilidad sin sentencia firme.
- Emoji.
- Anglicismos donde haya equivalente castellano administrativo ("dashboard" → "panel"; "tracker" → "seguimiento").

---

## VISUAL FOUNDATIONS

### Paleta

Paleta **austera y estructural**, no minimalista. Dos acentos institucionales coordinados:

- `--color-bg` **blanco roto** institucional (`#fafafa`) — referencia BOE / Moncloa / portales ministeriales. La sensación retro la cargan tipografía, bordes finos y **densidad administrativa**, **no un fondo coloreado**.
- `--color-surface` blanco puro (`#ffffff`) — papel: cards y bloques sobre el fondo.
- `--color-surface-muted` gris frío (`#f0f0f0`) — formularios, filtros, áreas de utilidad administrativa.
- `--color-bg-muted` blanco-gris para hover de filas (`#f1f1ee`).
- `--color-fg` casi-negro (`#15171a`) con altísimo contraste.
- `--color-fg-muted` gris medio (`#5b6066`).
- `--color-accent` **azul institucional primario** (`#1f3a68`) — banda de header, badges N1, enlaces, focus.
- `--color-accent-secondary` **mostaza institucional** (`#c89b00`) — SEGUNDO color estructural del sistema (no decorativo): banda inferior del header, badges de fase de instrucción, eyebrow de páginas de entidad, sub-headings de sección. **NO** el amarillo literal del badge "Gobierno de España".
- `--color-border` gris claro (`#dcdcd6`).
### Colores funcionales (estado epistémico)

Cuatro colores apagados, no neón, **nunca asociables a partido**:

- `--color-hecho-acreditado` — verde sobrio `#2f6a3a`.
- `--color-hecho-investigado` — ámbar apagado `#8a6b1f`.
- `--color-hecho-exculpatorio` — gris azulado neutro `#5b6878`.
- `--color-hecho-desmentido` — gris medio `#76777a`.
- Hechos en **contraposición** no llevan color propio; se gestionan con estructura (dos cajas equivalentes lado a lado).

Cada estado se transmite por **tres canales simultáneos**: color + etiqueta textual + icono. Nunca sólo color.

### Niveles de fuente (badges 1–4)

Gradient de oficialidad sobre el **mismo navy institucional**, **nunca colores distintos por nivel** (introduciría semántica accidental tipo "verde=bueno / rojo=malo"). Misma forma rectangular. Más oficial = más peso visual.

- `N1` (oficial primaria): fill `--color-accent`, texto blanco. Máximo peso. Sentencia, auto firme, BOE primario.
- `N2` (oficial secundaria / instructora): fill azul medio (~50% lightness sobre el accent), texto blanco. UDEF, UCO, escritos fiscalía.
- `N3` (institucional / pericial / cita oficial): fill claro azul muy suave, texto navy. Tribunal de Cuentas, nota organismo público, medio con cita.
- `N4` (cobertura periodística cruzada): outline navy sin fill, texto navy. El más "ligero".

### Estados epistémicos — NO ROJO

**Restricción dura**: el color rojo no se usa para estados epistémicos en ningún contexto. Razones (todas semánticas, no políticas; ver DESIGN.md §2):

1. **Convención UI universal.** Rojo significa "error / peligro / destrucción". Usarlo para clasificar estado epistémico viola la convención y confunde.
2. **Desmentido en rojo invierte el mensaje.** "Desmentido" significa que la afirmación es falsa, lo que EXCULPA a la persona afectada. Pintar rojo (=malo) un hecho que de hecho exonera al sujeto invierte el significado.
3. **Investigado en rojo viola presunción de inocencia.** Rojo pre-juzga culpabilidad antes de sentencia firme.

> En política española casi todo color tiene asociación partidaria (rojo PSOE/IU, azul PP, verde Vox flúor, naranja Cs, morado Podemos, amarillo ERC/Junts, etc.). El proyecto NO evita colores por su asociación política — sería imposible — sino que usa siempre tonos **muted / institucionales / desaturados**, jamás los tonos saturados de campaña. Esa es la regla unificadora real.

Paleta epistémica fija: verde sobrio (acreditado), ámbar apagado (investigado), gris-azul neutro (exculpatorio), gris claro neutro (desmentido).

### Dark mode

Estrategia: **luminosidad invertida manteniendo identidad**. Mismos roles, mismos contrastes relativos, sin cambiar la paleta institucional. Activado por `prefers-color-scheme: dark` y mapeado vía `light-dark()`.

### Tipografía

- **Sans institucional — Gill Sans (con fallback humanista abierto).**
  Gill Sans es la tipografía oficial del Gobierno de España desde 1999, presente en
  logos institucionales y portales ministeriales. Como es comercial
  (Monotype / Adobe Fonts) y no se puede servir libremente, el sistema usa un
  stack en cascada:

  ```css
  font-family:
    "Gill Sans Nova",          /* visitantes con Adobe Fonts */
    "Gill Sans",               /* usuarios Apple, nativo */
    "Lato",                    /* fallback abierto humanista (Google Fonts) */
    "Source Sans 3",           /* otra humanista abierta (Google Fonts) */
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  ```

  Esto conecta directamente con la tradición visual de los portales
  españoles (Moncloa, ministerios, BOE) sin depender de una fuente comercial.
- **Serif display opcional — Source Serif 4.** Decisión binaria: se usa con
  criterio para encabezado de ficha de caso, no para body. Su uso debe ser
  deliberado.
- **Monoespaciada — JetBrains Mono.** Para números de procedimiento, hashes
  de documento, slugs y cualquier identificador judicial.

Escala fluida (`clamp()`), pesos 400 / 600 / 700. Nada por debajo de 400. Line-height 1.6 en body, 1.2 en headings.

### Espacio y layout

- Ancho máximo de contenido **~70ch** (700–800 px). Contenido centrado.
- Spacing vertical generoso entre secciones (`--space-7` ≈ 48 px).
- Cards con padding interno generoso pero no airy.
- Separadores horizontales: líneas 1 px sobre `--color-border`, no espacios solos.
- CSS Grid puro cuando se necesite, sin frameworks.

### Bordes, radios, sombras

- Bordes **1 px sólido**. Nunca más gruesos.
- Radius **0–4 px**. Considerar `0` cuando el contexto lo permita (cards de listado, cabeceras de tabla).
- **Sin `box-shadow`** por defecto. Si un popover lo necesita: sombra plana y sutil (`0 1px 0 #0001` máximo).
- Jerarquía con tamaño, color y posición — no con profundidad.

### Imagery

- **Sin fotografía decorativa.** Personas privadas: jamás foto. Figuras públicas: sólo retrato institucional libre de derechos cuando aporta.
- **Sin ilustraciones**, sin patrones, sin texturas, sin gradientes.
- Visualizaciones gráficas (cronología, swimlane, mini-grafo): SVG plano, monocromo, **siempre con fallback textual obligatorio** accesible por teclado.

### Backgrounds

Color sólido. Un solo color por superficie. Sin gradientes, sin glassmorphism, sin transparencia salvo separadores muy sutiles (`--color-border` ya es opaco; se prefiere `1px solid`).

### Animación

- Reposo por defecto. **Sin animaciones decorativas, sin parallax, sin scroll-jacking.**
- Transiciones permitidas: opacidad o color, 120–200 ms, easing `ease-out` neutro.
- Hover: subrayado en enlaces; cambio de color sutil en cards interactivas (oscurece 1 paso el fondo).
- Press / active: feedback inmediato sin delay, sin shrink.
- Focus: `:focus-visible` con outline 2 px sólido en `--color-accent`. Visible. Sin sutileza.
- **`prefers-reduced-motion`**: respetado; transiciones deshabilitadas cuando esté activo.

### Cards

- Borde 1 px `--color-border`. Fondo: el del contenedor padre (no sobre-elevación).
- Padding interno `--space-5`/`--space-6`.
- Radius 2 px.
- Cero sombra.
- Hover en cards interactivas: fondo cambia a `--color-bg-muted` (~`#ece9e0`). El borde permanece.

### Cómo NO se ve presuntamente (anti-referencias)

- News media moderno (NYT, El País) — demasiado editorial, fotográfico.
- Startup moderna (Linear, Vercel) — demasiado limpia, futurista.
- Investigative journalism dramático (ProPublica) — demasiado teatral.
- Gradientes, glassmorphism, neumorfismo, soft shadows.
- Paletas saturadas o vibrantes.
- Iconografía decorativa o ilustraciones.
- Cards con left-border accent color.

---

## ICONOGRAPHY

### Sistema

**Iconografía monocroma estilo línea**, stroke 1.5 px, sin relleno, sin esquinas blandas.

Decisión: **[Lucide](https://lucide.dev)** outline como sistema base, servido localmente desde `assets/icons/` cuando se usen en producción y por CDN en preview. Es el outline-set más cercano al lenguaje de iconos del BOE/CENDOJ modernizados, con la ventaja de mantenimiento activo y cobertura amplia (gavel, scale, file-text, building-2, calendar, link, hash, archive).

**Substitución señalada al usuario:** el DESIGN.md menciona "Lucide outline, Heroicons outline, o SVG propios". El repo no contiene aún SVGs propios, así que este design system fija Lucide como punto de partida y deja preparada la carpeta `assets/icons/` para reemplazar con SVGs custom cuando el proyecto los produzca.

### Uso

- Tipo de hito → icono fijo (jurisdiccional `gavel`, político `landmark`, mediático `newspaper`).
- Nivel de fuente → número en badge, nunca icono.
- Estado epistémico → icono + etiqueta + color (los tres canales del DESIGN.md).
- Tamaño base 16 px o 20 px alineado con el cap-height del texto.

### Emoji y unicode

- **Emoji: NO.** En ningún contexto del producto. Tampoco en commit messages del repo.
- **Unicode como icono: NO** (salvo `·`, `—`, `…`, `↗` para enlaces externos, y `§` en numeración interna). El triángulo de advertencia, las check marks, las flechas de navegación son SVG.

### Logo / wordmark

`presuntamente` se escribe como **wordmark tipográfico**: Gill Sans (stack institucional) 600, espaciado de letras `-0.005em`, color `--color-fg`. **El wordmark no lleva isótipo todavía**, pero está prevista la integración con un isótipo/símbolo independiente cuando esté listo: ese símbolo no sustituirá al wordmark, lo acompañará en contextos donde el wordmark no cabe (favicon, header móvil compacto, futuras social cards).

Variantes en `assets/`:

- `wordmark.svg` — versión sólida sobre fondo claro.
- `wordmark-inverso.svg` — versión clara sobre fondo oscuro.

---

## Caveats conocidos

- **Fuentes:** Gill Sans es comercial. El stack cae a Lato / Source Sans 3 (Google Fonts vía `@import`) para la mayoría de visitantes. Si se quiere full-offline, bajar `.woff2` de Lato + Source Sans 3 + Source Serif 4 + JetBrains Mono a `fonts/` y reemplazar `@import` por `@font-face`. *Aceptado para MVP.*
- **Iconos:** Lucide como substituto inicial. El repo no tiene set propio aún. *Flagged al usuario.*
- **Acento institucional:** **azul primario `#1f3a68` + mostaza secundario `#c89b00`** (estructural, no decorativo). Decisión cerrada.
- **Logo:** PNG por ahora (`assets/logo.png`, 1254×1254 navy sobre blanco). Pendiente vectorizar a SVG.
- **Catalán:** UI kit en castellano. El sistema lo deja preparado pero no contiene strings catalanes (carpetas `/cat/` vacías en el repo upstream).

---

## Próximos pasos sugeridos

1. Pedir SVGs propios para los iconos de tipo de hito (gavel, landmark, newspaper) — coherentes con el wordmark.
2. Integrar el isótipo/símbolo independiente cuando esté listo (favicon, header móvil compacto, social cards).
3. Bajar los `.woff2` de Lato + Source Sans 3 + Source Serif 4 + JetBrains Mono para servir fuentes localmente.
4. Definir el componente de **swimlane de trayectoria** (§3.1 de `02-ficha-de-caso.md`) con datos reales en lugar de fixtures.
