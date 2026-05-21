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
- Startup moderna (Linear, Vercel) — demasiado limpia, futurista.
- Investigative journalism dramático (ProPublica) — demasiado teatral.
- Gradientes, glassmorphism, neumorfismo, soft shadows.
- Paletas saturadas o vibrantes.
- Iconografía decorativa o ilustraciones.

---

## 2. Color Palette & Roles

Cada color como variable CSS. Cada slot define equivalente en dark mode.

### Slots base

- `--color-bg` — fondo principal. **Blanco roto** (off-white), referencia `#fafafa` o `#fbfbfb`. **NO beige, NO gris claro**: las webs institucionales españolas antiguas (BOE, Moncloa, antiguos portales ministeriales) usan fondo prácticamente blanco. La sensación retro la cargan la tipografía, los bordes finos y la sobriedad del layout, no un fondo coloreado.
- `--color-fg` — texto principal. Gris muy oscuro o negro.
- `--color-fg-muted` — texto secundario / muted. Gris medio.
- `--color-accent` — único acento institucional. **Una sola elección entre**: rojo administrativo apagado (referencia BOE) o azul oscuro institucional. NO ambos. Justificar la decisión.
- `--color-border` — líneas y bordes. Gris claro.

### Slots funcionales — estados epistémicos de los hechos

Cuatro colores apagados, **nunca asociables a partidos políticos**, para diferenciar tipos de afirmación en la ficha de caso:

- `--color-hecho-acreditado` — verde sobrio (no flúor, no neón).
- `--color-hecho-investigado` — ámbar / amarillo apagado.
- `--color-hecho-exculpatorio` — gris azulado neutro.
- Hechos en **contraposición** no tienen color propio; se gestionan con estructura (dos cajas visualmente equivalentes lado a lado).

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

Componentes prioritarios (orden de implementación recomendado):

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
- Iconografía decorativa, ilustraciones, fotografías sin función informativa.
- Animaciones decorativas, parallax, scroll-jacking.
- Fotografías de personas mencionadas como investigadas (salvo retratos institucionales libres de derechos para cargos públicos vigentes).

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
