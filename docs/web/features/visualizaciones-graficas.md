# Feature — Visualizaciones gráficas (sistema de charts)

> Componentes: [`src/components/charts/`](../../../src/components/charts/) · Helpers: [`src/lib/aggregation.ts`](../../../src/lib/aggregation.ts) · Primer consumidor: página [`/graficas`](../pages/graficas.md).

Sistema propio de gráficas para el sitio. Genera SVG/HTML **en build**, sin runtime de cliente para dibujar. Pensado para mantener la estética gov-retro (ver [`DESIGN.md`](../../../DESIGN.md)) y el sitio estático y ligero.

## Qué hace

Convierte agregaciones del inventario en gráficas legibles "de un vistazo", con dos canales siempre (color + etiqueta + valor en texto) y sin afirmar culpabilidad. Componentes:

| Componente | Tipo | Render | Uso típico |
|---|---|---|---|
| `BarRow` | barras horizontales | HTML + CSS | casos por fase, personas por situación, hechos epistémicos |
| `StackedBar` | barra de composición 100% + leyenda | HTML + CSS | fuentes N1–N4, madurez del inventario |
| `Treemap` | áreas proporcionales | SVG + `d3-hierarchy` | familias de delito, delitos concretos |
| `TimelineColumns` | columnas por año | HTML + CSS | hitos / casos / imputaciones por año |
| `DurationBars` | barras tipo Gantt | HTML + CSS | duración de cada procedimiento |
| `ChartTabs` | contenedor de pestañas | HTML + JS | alternar datasets de un mismo tipo (tiempo, mapas) |
| `Sheet` (común, en `src/components/`) | panel deslizante: bottom sheet móvil / modal desktop | HTML + JS | drill-down: listar las entidades detrás de un segmento |

## Cómo funciona

- **Sólo build-time el dibujo.** Los `.astro` calculan el layout en el frontmatter; `d3-hierarchy` (treemap) se usa exclusivamente en build → **0 bytes de JS al cliente para dibujar**. Las barras (horizontales, Gantt) y el timeline son HTML/CSS puro. El único JS de cliente es interacción (reveal, tabs, drill-down), no render.
- **Color sin paleta nueva.** Se usan sólo tokens existentes de `global.css` (gradiente navy para niveles/treemap, tokens de rol/epistémicos/fase). El treemap usa una **rampa del mismo navy por tamaño**, no una paleta categórica, para no inventar color ni asociaciones partidistas. Canon cromático: [`DESIGN.md`](../../../DESIGN.md#2-color-palette--roles).
- **Animación de entrada (reveal).** Única pieza con JS: una isla mínima en `PgGraficas` (`IntersectionObserver`) marca `data-revealed` en cada `[data-reveal]` al entrar en viewport, una sola vez. Un `<script is:inline>` arma el estado colapsado **antes del primer paint** (`html[data-charts-armed]`) sólo si NO hay `prefers-reduced-motion`. Degradación: sin JS o con motion reducido las gráficas se pintan completas; si la isla falla, revela todas (fallback seguro). Es una animación funcional de una pasada, no decorativa — extensión documentada en [`DESIGN.md`](../../../DESIGN.md#7-dos-and-donts).
- **Tabs (`ChartTabs`).** Alternan datasets de un mismo tipo de gráfica. El consumidor pasa los paneles como hijos directos marcados con `data-ctab-panel="<id>"` (todos `hidden` salvo el primero); el JS singleton conmuta `hidden` + `aria-selected` y revela las gráficas del panel recién mostrado. Slot por defecto, no `<slot name>` dinámico (Astro no lo admite).
- **Drill-down con el componente común [`Sheet`](../../../src/components/Sheet.astro).** Cada parte clicable de una gráfica lleva `data-sheet="<clave>"`; al pulsarla, el `Sheet` (bottom sheet en móvil, modal en desktop) clona y muestra el bloque oculto `<div data-sheet-content="<clave>" data-sheet-title="…">` con la **lista enlazada de entidades**. Se usan `<div>` ocultos, no `<template>` (Astro rompe con expresiones dentro de `<template>`). Sólo enlaza a entidades con ficha pública (personas con rol formal, casos, delitos); accesible por teclado (triggers `role="button"` + `tabindex`, Escape cierra). `Sheet` es **reutilizable fuera de las gráficas** (mismo contrato de atributos) — ya lo usa el teaser de la home; canon visual en [`DESIGN.md`](../../../DESIGN.md).
- **Accesibilidad** (DESIGN §8, "fallback textual obligatorio"): barras, duraciones y timeline llevan etiqueta + valor en texto; el treemap es `role="img"` con `aria-label`, `<title>` por celda, tabla de datos desplegable (`<details>`) y leyenda enlazable.
- **Datos.** Helpers de agregación reutilizables (`bump`, `entries`, `tally`, `yearOf`, `denseYearSeries`) en [`src/lib/aggregation.ts`](../../../src/lib/aggregation.ts), compartidos con `PgCifras`.

## Estado actual

Entregado con la página [`/graficas`](../pages/graficas.md). Siete componentes en uso; reveal, dark mode, **tabs** (tiempo: hitos/casos/imputaciones por año; mapas: familias/delitos concretos) y **drill-down** en barras, stacked y treemap.

- **2026-05-29:** `BarRow`, `Treemap` y `StackedBar` ganan `valueLabel?` (string opcional) para pintar un valor formateado —p. ej. cifras en euros "53 M€"— en vez del número crudo, conservando `value` numérico para la anchura de barra / área de celda / proporción del segmento. Primer consumidor: la sección "Cifras económicas" de `/graficas` (canon: [`importe-presunto.md`](importe-presunto.md)).
- **2026-05-29 (cifras: conmutadores en el header de sección en vez de tabs por gráfica):** la sección "Cifras económicas" de `/graficas` dejó de usar las tabs por-gráfica de abierto/firme. En su lugar, **dos conmutadores alojados en el propio header sticky de la sección** (vía el slot `header-actions` de `FichaTocSection`, que los inyecta en `.sec-h__actions`; el `.sec-h` ya es `position:sticky; top:0`, así que no hay barra aparte ni título duplicado) que **gobiernan toda la sección a la vez** —vista (Procedimientos abiertos / Solo condenas firmes) y modo (€ nominales / € de 2025)—; se prerrenderizan las **4 combinaciones** (modo×vista) y el toggle sólo conmuta cuál es visible, así que sigue accesible tras hacer scroll. Cada bloque de clase muestra una **caja-total homogénea** ([`CifrasTotalBox`](../../../src/components/CifrasTotalBox.astro), reutilizada también en ficha de caso y fichas de sujeto). El gráfico "según el grado de prueba" **se oculta en la vista "solo condenas firmes"** (sería degenerado: todo acreditado). Detalle de modelo y agregación: [`importe-presunto.md`](importe-presunto.md).

## Decisiones y aprendizajes

- **Barras y timeline = HTML/CSS, no SVG.** El texto SVG escala con el `viewBox` y en móvil quedaba ilegible (varias iteraciones fallidas con bumps de `font-size`). En HTML el texto es px real, responsive, sin solapes; sólo el treemap sigue en SVG (layout squarify de d3). Aprendizaje: para columnas/barras, HTML antes que SVG.
- **Drill-down con `<div>` oculto, no `<template>`.** El compilador de Astro rompe con expresiones (`{...}`) dentro de `<template>` ("Expected ) but found }"). Se usan `<div hidden data-ref-list>` + `data-pagefind-ignore` y el JS clona `innerHTML`.
- **Objetos literales fuera de los atributos JSX.** `tabs={[{…}]}` inline truncaba en el primer `}`; los arrays de tabs viven en el frontmatter.
- **Reveal armado pre-paint** para evitar el flash full→0→anima above-the-fold: el `is:inline` colapsa antes de pintar; la isla diferida sólo revela. Las gráficas de un tab oculto se revelan al activarlo.
- **Anclas de deep-link a la ficha de caso: `#hito-<id>` y `#hecho-<id>`, no `#<id>`.** El drill-down enlaza a hitos y hechos concretos dentro de `/casos/<slug>`; las anclas reales que renderiza la ficha llevan prefijo (`Hito.astro` → `id="hito-<id>"`, wrapper del `Hecho` → `id="hecho-<id>"`), igual que el feed RSS (`src/lib/feed.ts`). Generar `#<id>` a secas no resuelve y el navegador no hace scroll. Misma convención en el enlace "último hito" de `/cifras`.

## Ideas futuras

- Tooltips enriquecidos en treemap/timeline (hoy `<title>` nativo + hover CSS).
- Reutilizar componentes en `/cifras` o en fichas de caso (sparklines de actividad).
- Posible `Sankey` de transiciones procesales cuando haya cohortes con recorrido completo (hoy el inventario es joven; ver [`graficas.md`](../pages/graficas.md)).

## Pendientes operativos

- [ ] Entrar en `sitemap.xml` (lo hace la integración de sitemap automáticamente al estar en `/src/pages/`).
- [ ] Valorar OG image propia de `/graficas`.
