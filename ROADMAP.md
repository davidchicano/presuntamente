# Roadmap operativo de presuntamente

> **Estado vivo del proyecto.** Este es el primer fichero que cualquier persona (o agente LLM) debe leer al empezar a trabajar, y el último que debe actualizar al cerrar la sesión. Si abres el proyecto por primera vez o desde otra máquina, empieza aquí.
>
> El roadmap **conceptual** — razonamiento de las fases, criterios de salida, esfuerzo estimado — vive en [`docs/diseno/06-roadmap-por-fases.md`](docs/diseno/06-roadmap-por-fases.md). Este fichero es la versión **operativa**: dónde estamos, qué hay encima de la mesa, qué se ha aprendido.

**Última actualización:** 2026-05-21 (noche tardía — Fase 1.0 ✅ completa; añadidos /aviso-legal, /rectificar, templates de issue, CODEOWNERS, badge phase-archivo, componentes Money/Acronym/Contraposicion preparados).

---

## Estado actual

- **Fase activa**: Fase 0 ✅ · Fase 1.0 (integración del design system) **completa en main, 5 lotes** ✅. Próxima fase: Fase 1 (MVP Plus Ultra) — completar los YAMLs pendientes (PR2 con operación UDEF de 2025-12-11 y cambio_organo a JCI 4) y publicar el primer caso real.
- **Último hito**: Lotes 3, 4 y 5 entregados en main en una sola sesión. Ficha completa de caso en `/casos/[slug]` con 8 secciones canónicas siguiendo doc 02. Listados + fichas individuales de personas y organizaciones. Biblioteca documental. Página institucional `/sobre`. Pagefind integrado: 17 páginas indexadas, 682 palabras, búsqueda funcional en `/buscar`. `pnpm validate` 26 OK, `pnpm build` 17 páginas, `astro check` 0/0/0, mobile y desktop verificados visualmente.
- **Próximo paso comprometido**: PR2 de contenido Plus Ultra — operación UDEF 2025-12-11, cambio_organo JI 15 Madrid → JCI 4 AN (marzo 2026), 2-6 ejecutivos PU detenidos, resto de hitos/hechos/documentos pendientes (ver §"Fase 1 — MVP Plus Ultra"). Tras eso, primer caso adicional sugerido: Begoña Gómez (testea trayectoria con desimputaciones).
- **Dev server local**: `pnpm dev` en `http://localhost:4321` (config en [`.claude/launch.json`](.claude/launch.json)).
- **Workflow git**: **commits directos a `main`**, sin ramas ni PRs, decidido por el maintainer el 2026-05-21 mientras dure el MVP. Detalle en [`AGENTS.md` §"Workflow de rama y PRs"](AGENTS.md). PR #2 (Lote 1 de integración) es el último PR formal mientras esta política esté activa.

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

**Lote 2 — Content Collections + lectura YAML real** ✅
- [x] Configurar Astro Content Collections sobre `/content/`: `casos`, `personas`, `organizaciones`, `documentos`, `delitos`, `hitos` (anidados en `casos/<slug>/hitos/`), `hechos` (anidados), `roles` (anidados). Definidas en [`src/content.config.ts`](src/content.config.ts) con Zod schemas mínimos viables + `.passthrough()` para no duplicar los JSON Schemas de `/schemas/`.
- [x] Cablear contadores hardcoded de `PgInicio` (cifras del inventario: 1/2/7/3) y la fila hardcoded de `PgCasos` a las collections reales. La tabla de casos lee `casos`, deriva el último hito de cada caso por fecha máxima en su carpeta `/hitos/`, cuenta personas con rol de imputación activo (investigado/procesado/acusado/condenado sin `fecha_fin`) y resuelve el órgano judicial al primer acrónimo de `nombres_alternativos`.
- [x] Activar filtros de `PgCasos` — búsqueda por texto sobre nombre mediático + nombre oficial + órgano (incluido acrónimo) + nº de procedimiento, filtro por fase (instr / juicio / firme), orden por último hito ↓ o por implicados ↓. Vanilla JS sobre `data-*` attributes (sin frameworks reactivos); empty state "Sin resultados para los filtros actuales." cuando ninguna fila pasa.

**Lote 3 — `PgCasoDetalle` con ficha completa de Plus Ultra** ✅
- [x] Componentes compartidos creados en `/src/components/`: `SectionH`, `LevelBadge`, `PhaseBadge`, `EpistemicBadge`, `CalGlyph`, `Cite`, `OrgGlyph`, `PersonaCard`, `OrgCard`, `Hito`, `Hecho`, `DocumentoCard`. Módulo `/src/lib/labels.ts` con mappings enum→label centralizados (preparado para i18n con firma `_lang`). Migrados desde `preview/comp_*.html`.
- [x] Página `/casos/[slug].astro` → `PgCasoDetalle` siguiendo doc 02 §2 en 8 secciones numeradas administrativamente: resumen ejecutivo, estado procesal, personas implicadas (agrupadas por grupo procesal con aviso de presunción de inocencia), organizaciones implicadas, cronología, hechos por estado epistémico (4 grupos: acreditado · investigado/atribuido · exculpatorio · desmentido/no_concluyente), biblioteca documental con ancla por documento, y "cómo se ha redactado". Cierra con disclaimer.
- (Sin swimlane gráfico de trayectoria — queda para Fase 2; el flujo cronológico de roles se muestra como tabla en la ficha individual de Persona).

**Lote 4 — Resto de páginas + estructura /cat/ paralela** ✅
- [x] `/personas` (listado tabular con filtros texto + figura pública), `/personas/[slug]` (ficha entity-mast con iniciales en cuadrado navy, biografía, casos donde aparece, trayectoria procesal completa, meta).
- [x] `/organizaciones` (listado tabular con filtros texto + tipo dinámico), `/organizaciones/[slug]` (ficha entity-mast con OrgGlyph 64px, descripción, casos, roles asumidos, documentos producidos).
- [x] `/biblioteca` con todos los documentos del inventario, filtros texto + nivel + tipo, orden nivel↑ · fecha↓, count "citado en N hechos".
- [x] `/sobre` con misión, 6 principios editoriales, escala N1-N4, cómo rectificar, licencias.
- [x] Estructura `/src/pages/cat/` paralela con `.gitkeep` para todas las rutas.

**Lote 5 — Validación final + Pagefind** ✅
- [x] Pagefind 1.5.2 integrado. `data-pagefind-body` en `<main>` del BaseLayout para indexar sólo contenido principal. Build pasa a `astro build && pagefind --site dist`. UI Default en `/buscar` con script inline (Pagefind UI no es ESM), traducciones a castellano, overrides CSS alineados con paleta. Icono lupa en header con label "Buscar" (colapsa a solo lupa en mobile). 17 páginas, 682 palabras indexadas en 0.02s. Búsqueda probada con "plus ultra" → 15 resultados con Plus Ultra Líneas Aéreas en primer puesto.
- [x] Revisión visual desktop + mobile (resize 360px) — header colapsa a 2 filas con search/lang en la primera, todas las páginas legibles, filtros apilan vertical correctamente.

**Asuntos visuales pendientes (no bloquean siguientes fases)**
- [ ] Reemplazar `/branding/wordmark.svg` (y la versión `-inverso`) por SVGs con paths outlined (font-independent), para que el wordmark sea usable como vector en favicon, social cards o impresos. El placeholder actual (`<text>presuntamente</text>` sin font-family) solo funciona si el navegador tiene la fuente del sistema — no fiable.
- [ ] Decidir si el subtítulo institucional del header se muestra o no en mobile (ahora oculto).
- [x] Badge `--phase-archivo` propio (gris desaturado, peso normal, distinto de firme). `PhaseBadge` y `PgCasos` mapean ahora `archivo_provisional` y `archivo_libre` a este bucket con labels distinguibles. Filtro de fase del catálogo añade opción "Archivado".
- [ ] Swimlane gráfico de trayectoria por persona en `PgPersonaDetalle` (hoy se renderiza como tabla cronológica; la versión SVG queda para Fase 2 según doc 02 §3.1).
- [x] Componente `Contraposicion` preparado (dos columnas equivalentes con actor + enunciado + fuentes, sin tratamiento visual que sugiera ganador). Mobile: las columnas apilan vertical con separador horizontal. Disponible para usarse en `PgCasoDetalle` cuando entre un primer hecho con `contraposicion_a`.
- [x] `Money` (chip 1px navy, mono, surface-muted) y `Acronym` (con lookup automático contra collection `organizaciones`, link interno si existe el slug; tooltip sin link si no — nunca link a Wikipedia) preparados. Disponibles para reescribir enunciados de hechos con citación inline.

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
- [x] Componentes Astro de la ficha (siguiendo doc 02): `PgCasoDetalle`, encabezado, resumen ejecutivo, estado procesal, personas implicadas (sin micro-swimlane gráfico, ese queda para Fase 2), cronología, hechos clasificados por estado epistémico, biblioteca de documentos, sección "cómo se ha redactado". *(Lote 3 de la integración del design system.)*
- [x] Pagefind integrado y funcionando con el caso indexado. *(Lote 5.)*
- [x] Página principal con listado básico (un caso). *(Lote 1 — fila hardcoded en `/casos`; Lote 2 lo cablea a Content Collections; Lote 3 añade `/casos/plus-ultra` con la ficha completa.)*
- [x] `/aviso-legal` con texto completo (borrador del doc 04 §8). Página `PgAvisoLegal.astro` en 7 secciones: qué es el sitio, presunción de inocencia, categorización de afirmaciones, rectificación (enlaza a `/rectificar`), responsable LSSI (placeholder hasta dominio), tratamiento de datos personales, licencias. Disclaimer final.
- [x] `/rectificar` con instrucciones funcionales (`PgRectificar.astro`). 5 secciones: vías habilitadas (issue recomendado, correo, burofax), información necesaria (5 campos), plazos comprometidos (tabla), tipos de respuesta (5 opciones), otras vías de mejora (sugerencia de fuente). El formulario opcional vía Cloudflare Workers se evaluará en Fase 2 si el flujo issue resulta insuficiente.
- [x] `NOTES.md` del caso Plus Ultra con metadata, decisiones tomadas, referencias *(ya estaba en main desde PR1; queda actualizado en cuanto entren los YAMLs pendientes en PR2)*.

### Después de Fase 1, antes de Fase 2
- [ ] Revisar y consolidar `incorporar-hito` con lo aprendido al fichar Plus Ultra.
- [ ] Crear `investigar-caso` v0 con lo aprendido.
- [x] Templates de issue (`rectificacion`, `sugerencia-fuente`) en `.github/ISSUE_TEMPLATE/` con `config.yml` que enlaza a LEGAL.md y CONTRIBUTING.md.
- [x] `CODEOWNERS` placeholder con `@davidchicano` como maintainer único hasta entrar contribuyentes externos.
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
- **Astro Content Collections con YAML — el `parser` no es público.** Astro 5.18 detecta automáticamente el parser por extensión (`.yaml`/`.yml` → `yaml`), pero la opción `parser` no está expuesta en `GlobOptions` y disparar `astro check` con ella da `ts(2769) No overload matches this call`. `astro build` sí compila (porque no hay typecheck), pero rompe el check. Solución: no pasar `parser`; confiar en la detección por extensión.
- **`generateId: ({ data }) => String(data.id)` para collections anidadas.** Para `hitos`/`hechos`/`roles` (globs `casos/*/{hitos,hechos,roles}/*.yaml`) el id por defecto del loader es la ruta relativa (`plus-ultra/hitos/auto-imputacion-zapatero-2026-05-19`), feo y dependiente del path. Derivar el id del campo `data.id` del YAML hace que `getEntry('hitos', 'auto-imputacion-zapatero-2026-05-19')` funcione naturalmente. Asume unicidad de `data.id` a través de todos los casos (cierto por convención de slugs `<caso>-<tipo>-<fecha>`).
- **Zod schemas mínimos viables con `.passthrough()`.** En vez de duplicar los 9 JSON Schemas de `/schemas/` (que siguen siendo la validación canónica vía `pnpm validate`), los Zod schemas de `content.config.ts` sólo declaran los campos que las páginas consumen hoy. `.passthrough()` evita que Zod elimine campos no listados, así que los YAML pueden tener atributos extra sin romper el typecheck. División de responsabilidades clara: AJV/JSON Schema valida estructura editorial completa (V-01..V-21), Zod sólo aporta tipos a Astro en build.
- **Mapeo `fase_actual` (10 valores) → `phaseKind` UI (3 buckets).** El badge de fase del global.css sólo tiene 3 variantes (`instr`/`juicio`/`firme`). El mapeo actual en `PgCasos.astro` agrupa: instrucción/fase intermedia/denuncia → `instr`; juicio oral/sentencia 1ª inst./recurso → `juicio`; sentencia firme/ejecución → `firme`; archivo → `firme` con label "Archivado". Cuando entren casos archivados al inventario conviene añadir un badge `--phase-archivo` propio (gris desaturado distinto al firme) para evitar confusión visual entre "cerrado con sentencia firme" y "archivado sin condena".
- **"Implicados" = personas con rol de imputación activo, no todo agente del procedimiento.** Decisión editorial razonada en `PgCasos.astro`: la columna "Implic." cuenta personas con `sujeto_tipo='persona'` y `rol ∈ {investigado, procesado, acusado, condenado}` sin `fecha_fin`. Sin esa restricción Plus Ultra daría 2 (Zapatero + Calama, juez instructor) en vez de 1, divergiendo de la cultura periodística española donde "implicado" = imputado, no = juez/fiscal/acusación popular. Reutilizar el patrón cuando entren más casos.
- **Iniciales españolas: primera + última palabra significativa, no las dos primeras.** El helper `iniciales(nombre)` en `lib/labels.ts` toma `palabra[0][0] + palabra[última][0]`. Para nombres compuestos típicos ("José Luis Rodríguez Zapatero", "José Luis Calama Teixeira") esto da JZ vs JT — distinguibles. Tomar las dos primeras palabras daría JL para ambos, perdiendo la diferenciación visual de la card. Stop-words simples (`de`, `del`, `la`, `el`, `los`, `las`, `y`, `i`, `da`, `do`, `van`, `von`) se descartan antes del cálculo.
- **`lib/labels.ts` centraliza mappings enum → label** para roles, tipos de hito/organización/documento, fases y origen. Firma con `_lang` parámetro inicial, así el día que se active el catalán solo hay que añadir la rama. Las páginas no deberían inline-handle estos mappings; pasar siempre por `lib/labels.ts`.
- **Pagefind UI 1.5 no es ESM.** El bundle `pagefind-ui.js` expone `window.PagefindUI` como global, no como módulo. `await import('/pagefind/pagefind-ui.js')` no funciona — el módulo no exporta nada y aunque carga, `mod.PagefindUI` es undefined. Solución: `<script src="/pagefind/pagefind-ui.js" is:inline></script>` (script tag normal) seguido de otro script que llame a `new PagefindUI({...})` en `DOMContentLoaded`. La docs oficial usa exactamente este patrón.
- **Pagefind necesita un build previo para servir su índice; `pnpm dev` no lo construye.** El script `build` ejecuta `astro build && pagefind --site dist`; el dev server (`astro dev`) no construye `dist/` ni el índice. Resultado práctico: `/buscar` funciona en `pnpm preview` o en producción, pero no en `pnpm dev`. La página detecta la ausencia con `typeof PagefindUI === 'undefined'` y muestra un fallback con instrucciones. Existe un script paralelo `build:no-index` (sólo `astro build`) por si en algún momento se quiere construir sin indexar.
- **`data-pagefind-body` en `<main>` para excluir chrome.** Sin el marcador, Pagefind indexa todo el HTML — header, sub-strip, footer — y los resultados aparecen plagados de "presuntamente.org · Inventario público…" repetido. Con el marcador en `<main>`, Pagefind reporta "Ignoring pages without this tag" + indexa sólo el contenido principal. Para `/buscar` se añade `data-pagefind-ignore` al `<div id="pagefind-search">` para que los resultados que renderiza la propia UI no se indexen en pasadas posteriores.
- **PersonaCard vs OrgCard — la distinción visual obligatoria es iniciales-en-cuadrado vs glyph-geométrico.** DESIGN.md §4 lo declara duro: Persona = iniciales, Organización = símbolo por tipo. Implementado en los componentes con borde-izquierdo coloreado distinto (navy para persona, mostaza para org) además del glyph diferente, para que las cards en una sección mixta (p.ej. "personas y organizaciones implicadas" lado a lado en la ficha de caso) sean discernibles incluso en escaneo rápido.
- **El badge epistémico mapea 6 valores a 4 estilos.** `EpistemicBadge` reusa la clase `--investigado` para `atribuido` (mismo color amarillo apagado, label distinto) y `--desmentido` para `no_concluyente`. Razón: el sistema solo tiene 4 colores epistémicos en la paleta (acreditado/investigado/exculpatorio/desmentido). Las dos categorías extra del modelo son semánticamente cercanas a las existentes; introducir colores nuevos confundiría más que ayudaría. Si el modelo evoluciona en Fase 2 con una distinción visual real (p.ej. "factual no controvertido"), revisar.
- **`getStaticPaths()` con params = entry.id.** Astro 5 rutas dinámicas `[slug].astro` usan `getStaticPaths` que devuelve `{ params: { slug }, props }`. Como nuestros `generateId` ya devuelven `data.id`, basta con `caso.id` como slug — coincide naturalmente con el slug humano del YAML. Patrón reusado en `/casos/[slug]`, `/personas/[slug]`, `/organizaciones/[slug]`.

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
