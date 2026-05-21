# Roadmap operativo de presuntamente

> **Estado vivo del proyecto.** Este es el primer fichero que cualquier persona (o agente LLM) debe leer al empezar a trabajar, y el último que debe actualizar al cerrar la sesión. Si abres el proyecto por primera vez o desde otra máquina, empieza aquí.
>
> El roadmap **conceptual** — razonamiento de las fases, criterios de salida, esfuerzo estimado — vive en [`docs/diseno/06-roadmap-por-fases.md`](docs/diseno/06-roadmap-por-fases.md). Este fichero es la versión **operativa**: dónde estamos, qué hay encima de la mesa, qué se ha aprendido.

**Última actualización:** 2026-05-21 (tarde — cierre del Lote 1 de integración del design system).

---

## Estado actual

- **Fase activa**: Fase 0 ✅ · Fase 1.0 (integración del design system) **Lote 1 ✅ en PR abierto pendiente de revisión** — [PR #2](https://github.com/davidchicano/presuntamente/pull/2). Resto del Lote 1.0 (Lotes 2-5) en próximas sesiones. PR1 de contenido Plus Ultra ya en main.
- **Último hito**: Lote 1 de integración entregado en rama `fase-1/integrar-design-system`. Tokens del bundle portados a `global.css`, chrome ministerial completo (header con doble trim navy+mostaza + nav/lang underline animado, footer con filete tricolor `#8e2424`/mostaza/`#8e2424`), `PresuntamenteLogo.astro` con isótipo PNG 52px + wordmark texto `presuntamente.org`, split de rutas `/` (PgInicio landing) y `/casos` (PgCasos catálogo), mobile-friendly (nav como segunda banda scrollable). 7 commits, 2 páginas que compilan limpias, dark mode verificado.
- **Próximo paso comprometido**: cuando el maintainer revise y mergee PR #2, abrir Lote 2 — Astro Content Collections sobre los YAML de `/content/` y cablear `PgCasos` y los contadores de `PgInicio` a la collection real.
- **Dev server local**: `pnpm dev` en `http://localhost:4321` (config en [`.claude/launch.json`](.claude/launch.json)).

---

## Backlog inmediato

Una idea, un bullet. `[ ]` pendiente, `[x]` hecho. Items completados se eliminan tras una o dos sesiones (la historia detallada está en el git log).

### Antes de Fase 1
- [x] Configurar git con email noreply.
- [x] Commit y push inicial del scaffolding.
- [x] Lenguaje visual canónico en [`/DESIGN.md`](DESIGN.md) (formato esperado por Claude Design + Claude Code).
- [x] Sistema de diseño completado por Claude Design e importado al repo como skill local en `/.claude/skills/presuntamente-design/` (README + SKILL.md + `colors_and_type.css` + 30+ previews HTML + UI kit JSX). Wordmarks SVG en `/public/branding/`. Inconsistencia "rojo=político" corregida a "rojo=semántico" en README y SKILL del bundle para alinearlos con DESIGN.md.

### Integración del design system — Fase 1.0

Trabajando en rama `fase-1/integrar-design-system` ([PR #2](https://github.com/davidchicano/presuntamente/pull/2)). 5 lotes; Lote 1 entregado, Lotes 2-5 pendientes.

**Lote 1 — Tokens + chrome + split landing/catálogo** ✅
- [x] Portar `colors_and_type.css` del bundle a `/src/styles/global.css`. Open Props se mantiene como capa base.
- [x] `PresuntamenteLogo.astro` con tres variantes (wordmark+isotipo, wordmark, isotipo) e `inverse`. **Decisión:** el wordmark se renderiza como texto (`presuntamente.org`, Gill Sans / Lato 22px navy), NO como `<img>` del SVG — el `wordmark.svg` del repo es un placeholder roto (`<text>` sin font-family ni fill). El SVG sigue en `/branding/` para favicon / social cards cuando se reemplace por una versión outlined.
- [x] `BaseLayout.astro` rehecho con chrome ministerial completo: banda navy con doble trim navy+mostaza (`::after` linear-gradient), bloque blanco con trim mostaza interno tipo "placa sellada", nav/lang con subrayado mostaza animado izq→der (180ms), sub-strip de breadcrumb, footer 4 columnas con filete tricolor `#8e2424`/mostaza/`#8e2424` muted + eco al 4-5%.
- [x] Split de rutas: `/` → `PgInicio` (landing institucional con hero + cifras del inventario + 4 secciones + meta de redacción + disclaimer) · `/casos` → `PgCasos` (catálogo tabular con `page-id`, `sec-h` numeradas, `filter-bar` deshabilitada hasta el Lote 2, `.tbl` con 1 fila hardcoded de Plus Ultra). Carpetas `/src/pages/cat/casos/` paralelas con `.gitkeep`.
- [x] Mobile-friendly: en `<720px` el header pasa a 2 filas (brand+lang arriba, nav scrollable abajo); `.page-id` y `.filter-bar` apilan vertical; subtítulo institucional se oculta.
- [x] Confirmada skill `/presuntamente-design` invocable (`user-invocable: true` en SKILL.md del bundle).

**Lote 2 — Content Collections + lectura YAML real** ⏳ próxima sesión
- [ ] Configurar Astro Content Collections sobre `/content/`: `casos`, `personas`, `organizaciones`, `documentos`, `delitos`, `hitos` (anidados en `casos/<slug>/hitos/`), `hechos` (anidados), `roles` (anidados).
- [ ] Cablear contadores hardcoded de `PgInicio` (cifras del inventario) y la fila hardcoded de `PgCasos` a las collections reales.
- [ ] Activar filtros de `PgCasos` (búsqueda, fase, orden) — JS mínimo de cliente o filtrado en build.

**Lote 3 — `PgCasoDetalle` con ficha completa de Plus Ultra** ⏳
- [ ] Componentes compartidos: `Badge`, `LevelBadge`, `PhaseBadge`, `Cite`, `CalGlyph`, `Money`, `Acronym`, `Hito`, `Hecho`, `Contraposicion`, `DocumentoCard`, `PersonaCard`, `OrgGlyph`, `SectionH`. Migrar desde `ui_kits/web/Components.jsx` y `preview/comp_*.html` (los `preview/` son los canónicos; ver Aprendizajes).
- [ ] Página `/casos/[slug].astro` → `PgCasoDetalle` siguiendo `docs/diseno/02-ficha-de-caso.md` §2 (encabezado, resumen, estado, cronología, personas con micro-swimlane, hechos clasificados por estado epistémico, biblioteca, cómo se redacta).

**Lote 4 — Resto de páginas + estructura /cat/ paralela** ⏳
- [ ] `/personas`, `/personas/[slug]`, `/organizaciones`, `/organizaciones/[slug]`, `/biblioteca`, `/sobre`. Estructura `/src/pages/cat/...` con `.gitkeep` para todas.

**Lote 5 — Validación final + Pagefind** ⏳
- [ ] Pagefind integrado e indexado.
- [ ] `pnpm validate` + `pnpm build` + revisión visual integral en desktop y mobile.

**Asuntos visuales pendientes (no bloquean Lote 2)**
- [ ] Reemplazar `/branding/wordmark.svg` (y la versión `-inverso`) por SVGs con paths outlined (font-independent), para que el wordmark sea usable como vector en favicon, social cards o impresos. El placeholder actual (`<text>presuntamente</text>` sin font-family) solo funciona si el navegador tiene la fuente del sistema — no fiable.
- [ ] Decidir si el subtítulo institucional del header se muestra o no en mobile (ahora oculto).

### Fase 1 — MVP Plus Ultra
- [x] Completar schemas con todas las propiedades: `hito`, `hecho`, `documento`, `rol-en-caso`, `organizacion`, `relacion-entre-casos`. Cerrados con `additionalProperties: false` + reglas if/then para V-09, V-10, V-11, V-14, V-15 (rama `fase-1/plus-ultra-content`).
- [x] Skill `incorporar-hito` v0 — toma PDF de auto, propone YAML de `Hito` + `Hecho`(s) + `Documento`(s) + cambios en `RolEnCaso`. Guardarraíles del doc 03 §4 explícitos. Marcada explícitamente como v0 iterativa (rama `fase-1/plus-ultra-content`).
- [ ] YAMLs del caso Plus Ultra:
  - [x] `Caso` raíz.
  - [ ] 4-8 `Persona` implicadas — **2/4 en PR1** (juez Calama, José Luis Rodríguez Zapatero). 2-6 pendientes para PR2 (ejecutivos PU detenidos en operación UDEF de 2025-12-11).
  - [x] 5-10 `Organizacion` — 7 en PR1 (AN, JCI 4, JI 15 Madrid, Fiscalía Anticorrupción, SEPI, Plus Ultra, Manos Limpias).
  - [ ] 8-15 `RolEnCaso` — **3/8 en PR1** (Calama juez_instructor, Manos Limpias acusacion_popular, Zapatero investigado). Resto pendiente PR2.
  - [ ] 8-15 `Hito` — **2/8 en PR1** (querella Manos Limpias 2025-12-23, auto imputación Zapatero 2026-05-19). Pendiente PR2: operación UDEF 2025-12-11, cambio_organo JI 15 Madrid → JCI 4 AN (marzo 2026).
  - [ ] 15-25 `Hecho` — **3/15 en PR1** (préstamo SEPI atribuido, presunta trama de tráfico de influencias investigada, rescate por cauces irregulares investigado). Resto pendiente PR2.
  - [ ] 10-20 `Documento` — **3/10 en PR1** (querella Manos Limpias, nota SEPI 2021-03, auto JCI 4 del 2026-05-19). Resto pendiente PR2.
- [x] Delitos del catálogo aplicables a Plus Ultra — 5 en PR1 (tráfico de influencias, organización criminal, falsedad documental, blanqueo de capitales, malversación).
- [ ] Componentes Astro de la ficha (siguiendo doc 02): `PgCasoDetalle`, encabezado, resumen ejecutivo, estado procesal, personas implicadas con micro-swimlane, cronología, hechos clasificados por estado epistémico, biblioteca de documentos, sección "cómo se ha redactado". *(Lote 3 de la integración del design system.)*
- [ ] Pagefind integrado y funcionando con el caso indexado. *(Lote 5.)*
- [x] Página principal con listado básico (un caso). *(Lote 1 — fila hardcoded en `/casos`; Lote 2 lo cablea a Content Collections.)*
- [ ] `/aviso-legal` con texto completo (a partir del borrador en doc 04 §8).
- [ ] `/rectificar` con instrucciones funcionales (formulario opcional vía Cloudflare Workers).
- [ ] `NOTES.md` del caso Plus Ultra con metadata, decisiones tomadas, referencias.

### Después de Fase 1, antes de Fase 2
- [ ] Revisar y consolidar `incorporar-hito` con lo aprendido al fichar Plus Ultra.
- [ ] Crear `investigar-caso` v0 con lo aprendido.
- [ ] Templates de issue (`rectificacion`, `sugerencia-fuente`).
- [ ] `CODEOWNERS` placeholder.
- [ ] Primer caso adicional sugerido: Begoña Gómez (testea trayectoria con desimputaciones).

---

## Decisiones pendientes del maintainer

Sólo cosas que requieren input humano, no del asistente.

- *(ninguna activa hoy — las tres del 2026-05-21 se resolvieron en el mismo PR1: Zapatero incorporado conforme al auto del 19 may 2026, lista blanca ampliada con sepi.es y otros organismos oficiales, auto del 2026-05-19 citado vía la nota CGPJ en poderjudicial.es).*

---

## Fases del proyecto (estado consolidado)

Detalle en [`docs/diseno/06-roadmap-por-fases.md`](docs/diseno/06-roadmap-por-fases.md).

| Fase | Estado | Comentario |
|------|--------|-----------|
| 0 — Scaffolding | ✅ | Astro 5 + Open Props + schemas + CI + AGENTS.md. Commits `068cc9d`, `a3e429e`, `e1881e5`. |
| 1 — MVP Plus Ultra | 🔄 en preparación | Ver backlog arriba. Skills `incorporar-hito` se construye iterativamente con el caso. |
| 2 — Crecer a 5-6 casos vivos | ⏳ | Begoña Gómez, Koldo, Cerdán, González Amador, Fiscal General. |
| 3 — Visualización + watchers | ⏳ | Mini-grafo, watchers CENDOJ/CGPJ, panel admin. |
| 4 — Apertura editorial | ⏳ | CODEOWNERS reales, contributors externos. |
| 5 — Evoluciones futuras | ⏳ | UI web contributiva, multiidioma, API pública, asociación legal. |

---

## Aprendizajes y notas (vivo)

Cosas que aprendemos por el camino y conviene recordar más allá de los docs de diseño.

- **Las skills se moldean con la experiencia.** No fijar las skills upfront; iterarlas mientras se investiga cada caso. Cada nuevo caso refina la skill correspondiente.
- **Branding lo hace Claude Design** (plataforma de Anthropic, separada de Claude Code). El lenguaje visual canónico vive en [`/DESIGN.md`](DESIGN.md) en raíz; Claude Design lo lee del repo conectado, lo traduce a un bundle (tokens + componentes + UI kit), y Claude Code consume el bundle vía el Handoff. **El Handoff ya llegó** el 2026-05-21 e importado a [`/.claude/skills/presuntamente-design/`](.claude/skills/presuntamente-design/). La skill es `user-invocable: true`, se invoca con `/presuntamente-design` desde futuras sesiones. **DESIGN.md prevalece** sobre cualquier doc del bundle en caso de conflicto (lo dice el SKILL.md del bundle explícitamente).
- **El maintainer no quiere revisar docs largos por defecto.** Resumir, decidir, preguntar sólo cuando es genuinamente bloqueante.
- **`additionalProperties: true` en schemas skeleton es intencional**; se cierra a `false` cuando la propiedad final del schema se conozca al fichar Plus Ultra.
- **Versión de pnpm solo en `package.json`** (`packageManager`). No duplicar en `.github/workflows/`; `pnpm/action-setup` la lee del package.json automáticamente. Duplicar dispara `ERR_PNPM_BAD_PM_VERSION` y rompe CI.
- **pnpm 11 cambia settings de sitio**: `onlyBuiltDependencies` (entre otros) se renombra a `allowBuilds` y vive en `pnpm-workspace.yaml`, no en el campo `pnpm` de package.json (que ahora se ignora). Vale aunque el proyecto no sea monorepo. Ver https://pnpm.io/settings.
- **pnpm 11 bloquea install scripts por defecto** (medida contra supply-chain attacks). Aprobar las deps necesarias en `pnpm-workspace.yaml` → `allowBuilds`. Para este proyecto: `esbuild` y `sharp` (ambas indirectas vía Astro).
- **pnpm 11 requiere Node ≥ 22**. Por eso `.nvmrc` está en `24` y la CI usa `node-version: 24` en `setup-node`.
- **Pendiente futuro próximo**: las actions `actions/checkout@v4`, `pnpm/action-setup@v4`, `actions/setup-node@v4` corren INTERNAMENTE sobre Node 20, deprecadas el 2 jun 2026 y retiradas el 16 sept 2026. Bumpear a `@v5` cuando salga estable de cada una. (El `node-version` del runner ya está en 24; esto sólo afecta al runtime interno de los propios actions.)
- **Tensión brief vs realidad procesal en casos vivos.** Al fichar Plus Ultra el 2026-05-21 surgió la primera tensión entre lo que decía el brief (sin Zapatero como investigado) y la realidad procesal verificable (auto del 2026-05-19 que sí le imputa). Decisión operativa: respetar el brief, dejar la discrepancia documentada en `NOTES.md` del caso + `ROADMAP.md → Decisiones pendientes`, y deferir al maintainer. Reutilizar el patrón en futuros casos donde brief y fuente diverjan: registrar primero, no improvisar.
- **La V-04 no encaja con hechos administrativos no controvertidos** (ej. un Real Decreto en BOE, una nota institucional sobre una decisión del Consejo de Ministros). Al no haber sentencia firme, no pueden ser `acreditado` aunque sean factualmente verificables. Se modelan como `atribuido` con el organismo emisor como actor en el enunciado. Funciona pero sugiere que en Fase 2 conviene revisar si el modelo necesita una etiqueta extra para "factual no controvertido" o si `atribuido` cubre suficientemente.
- **`incorporar-hito` se queda en v0 deliberadamente.** Sólo documenta los guardarraíles y el flujo; tras cada PDF real, ampliar la sección "Histórico" del SKILL.md con lecciones aprendidas. No anticipar plantillas hasta tener uso real.
- **`preview/comp_*.html` son los componentes canónicos del bundle, NO `ui_kits/web/`.** El UI kit web es un prototipo clickable de las páginas (Home/Ficha/...), útil para entender flujo y patrones agregados; pero cada componente individual (header ministerial, footer, badges, hechos, contraposición, etc.) tiene su versión canónica en `/.claude/skills/presuntamente-design/preview/comp_<nombre>.html`. Detalles que sólo viven en `preview/` y que el UI kit web simplifica: doble trim navy+mostaza del header con linear-gradient, trim interno tipo "placa sellada" del bloque blanco, nav/lang con subrayado mostaza animado, filete tricolor administrativo `#8e2424`/mostaza/`#8e2424` del footer con eco al 4-5%. **Regla operativa**: si un componente está en ambos sitios, mirar primero `preview/comp_*.html`; si no está, recurrir al UI kit.
- **El `#8e2424` del filete del footer está permitido.** DESIGN.md prohíbe el rojo SÓLO en estados epistémicos (acreditado/investigado/desmentido) por motivos semánticos (convención UI "rojo=error", `desmentido en rojo` invertiría el mensaje, `investigado en rojo` pre-juzga). El filete decorativo del footer es contexto distinto: la propia DESIGN.md §"Sobre asociaciones partidarias" autoriza usar cualquier tono *siempre que sea muted/institucional*. Como `#8e2424` es rojo BOE apagado (no el rojo PSOE/IU saturado de campaña), encaja con la regla unificadora.
- **`/branding/wordmark.svg` es un placeholder, no un wordmark vectorizado.** Su contenido es `<text>presuntamente</text>` sin `font-family` ni `fill`, así que metido en `<img>` queda con la fuente por defecto del navegador y dimensiones impredecibles. Al integrar el design system se decidió renderizar el wordmark del header como `<span>` estilado (siguiendo `preview/comp_header.html`), y dejar el SVG en `/branding/` para el futuro caso de querer un wordmark vector real (favicon, social cards). **Pendiente**: reemplazar por SVG con paths outlined.
- **HMR de Astro 5 no propaga cambios al `<style>` scoped de componentes `.astro` tras edits sucesivos.** Síntoma: el CSS scoped del navegador queda en la versión anterior aunque el archivo fuente esté actualizado. Solución operativa: reiniciar el dev server (`preview_stop` + `preview_start`, o `pnpm dev` en local). Trivial pero fácil de pasar por alto y produce sesiones de debug innecesarias.
- **Astro 5 `trailingSlash: 'never'` + `build.format: 'directory'`.** Los hrefs internos deben emitirse SIN trailing slash (`/casos`, no `/casos/`). El build sigue generando `dist/casos/index.html` por el `format: 'directory'`, así que las dos cosas conviven sin redirects extra. Si en algún sitio se cuela un trailing slash en un `<a href>`, Astro redirige en runtime — funcional pero ruidoso.
- **Convención de navegación ministerial.** El brand block del header es el ancla a `/`; el nav lista SECCIONES (Casos, Personas, Organizaciones, Biblioteca, Sobre) y NO incluye una pestaña "Inicio". Patrón observado en BOE, Sede Electrónica AEAT, antiguos portales ministeriales — y aplicado en `preview/comp_header.html`. `activeNav` en `BaseLayout.astro` usa la clave `casos` para `/casos`, no `home`.

---

## Cómo se mantiene este documento

**Obligatorio** para cualquier agente o maintainer que trabaje en el repo:

1. **Al abrir el proyecto** o empezar una nueva sesión, leer este fichero entero antes de hacer nada.
2. **Al cerrar una sesión** o tras un cambio significativo, actualizarlo:
   - Marcar items completados.
   - Eliminar los completados tras una o dos sesiones (la historia detallada vive en el git log).
   - Añadir nuevos items detectados.
   - Si se ha tomado una decisión arquitectónica, anotarla en *Aprendizajes y notas* y actualizar el doc de diseño correspondiente.
3. **No duplicar contenido de `docs/diseno/`**. Aquí va el "qué" operativo; allí el "por qué" razonado.
4. **Si la convención cambia**, actualizar también `AGENTS.md` §"Workflow para agentes".
