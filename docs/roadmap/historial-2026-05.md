# Historial operativo - mayo 2026

Archivo de cierres de sesión y bloques largos movidos fuera de `ROADMAP.md`.

El detalle granular anterior a la limpieza del 2026-05-25 sigue preservado en el historial de git. Este fichero toma el relevo como histórico legible para futuras sesiones.

## 2026-05-30 — Tanda masiva de casos (workflow multiagente)

Sesión orquestada con la herramienta de **workflows** (subagentes en
paralelo, modelo Sonnet) a petición del maintainer: documentar "muchos
casos del tirón". Reparto en dos pistas:

- **Pista A — actualizar 8 ya fichados** con `/actualizar-caso`: barrido
  de actualidad + cascada de coherencia. Hitos/hechos nuevos en
  `kitchen` (declaración Fernández Díaz inicio juicio), `plus-ultra`
  (acusación popular PP/Vox), `begona-gomez` (UCO software, Cámara de
  Cuentas), `gonzalez-amador` (señalamiento juicio 2027),
  `fiscal-general-del-estado` (amparo TC), `atico-estepona` (confirmación
  archivo AP Málaga 2020).
- **Pista B — investigar 12 nuevos** con `/investigar-caso` →
  `/documentar-vinculos` → `/rastrear-cobertura` → `/revisar-caso`, en
  pipeline por caso. Modelado completo desde esqueleto: `gurtel`,
  `punica`, `pujol`, `eres-andalucia`, `noos`, `malaya`, `tarjetas-black`,
  `barcenas-caja-b`, `filesa`, `tandem`, `palau-musica`,
  `forum-filatelico`.

**Incidencias operativas del workflow:** dos cortes por límite de uso
del maintainer a mitad de ejecución. El trabajo en disco se conservó
intacto cada vez; se relanzó en modo **incremental** (sin rehacer lo ya
modelado), comprobando el estado real por `git status` antes de cada
relanzamiento. Aprendizaje: los workflows largos deben diseñarse
reanudables y verificar disco antes de re-spawnear, no confiar en que el
run llega entero. El primer intento (Opus) se cambió a Sonnet por coste a
petición del maintainer.

**Resultado agregado:** +70 personas, +33 organizaciones, +~90
documentos, +2 delitos (`estafa`, `insolvencia-punible`), +43 vínculos
institucionales, +7 relaciones-entre-casos, +12 corpus de cobertura
mediática. Dedup `pablo-ruz` → `pablo-ruz-gutierrez`. Relaciones nuevas
descubiertas: gürtel↔bárcenas y gürtel↔kitchen (Bárcenas/Ruz),
púnica↔tándem y púnica↔lezo (García-Castellón instructor simultáneo),
palau↔3%, tarjetas-black↔bankia-OPS. `pnpm validate` **1341 OK / 0
errores**.

**Auditoría `/revisar-caso` de los 20 casos.** Bloqueantes **mecánicos
corregidos** en una pasada Sonnet dedicada: bios desactualizadas que
decían "no modelado" (Bárcenas, Rosalía Iglesias, Zarrías, Del Nido,
López Madrid, De la Joya), `trama` sin comillas en prosa publicable
(P-09; ~27 ficheros de gürtel/malaya/filesa/púnica + vínculo servinabar),
`fecha_inicio` de los 4 roles `condenado_firme` de ERE (2019→2022, fecha
de firmeza en casación), `querellante_inicial_id` erróneo en
bárcenas-caja-b, referencia rota en hito noos, tildes ausentes en
enunciado kitchen, alta de organización `el-confidencial-digital`.
Bloqueantes **no-mecánicos** quedan en el `ROADMAP.md` ("Pendiente de
decisión del maintainer (tanda 2026-05-30)") para revisión humana:
excepción de nombre propio Gürtel, promociones a `acreditado` (V-04),
`pujol` obsoleto, privados sin rol (Cavero, Muñoz Támara, García
Cereceda), frontera afectación PSOE, URLs/primarios pendientes.

**Sin commit:** todo en working tree por la norma de AGENTS.md; el
maintainer revisa los bloqueantes no-mecánicos antes del commit final.

## 2026-05-25

### Limpieza estructural del roadmap

- `ROADMAP.md` deja de mezclar estado actual, backlog, diario de sesiones, fases cerradas y aprendizajes largos.
- Se crea `docs/roadmap/` con tres destinos: histórico mensual, fases cerradas y aprendizajes largos.
- Criterio adoptado: el roadmap raíz debe ser suficiente para decidir qué hacer ahora, no para reconstruir cada sesión pasada.
- Objetivo de tamaño: aproximadamente 150-220 líneas.

### Vínculos institucionales de Begoña Gómez

- Sesión `vinculos-bg` completada y mergeada a `main`.
- Se añadieron 16 vínculos en `content/vinculos/`.
- Se incorporaron `content/organizaciones/ie-business-school.yaml`, `content/personas/pedro-sanchez.yaml` y el documento UCO de Cristina Álvarez citado por Libertad Digital.
- `estado_ficha.vinculos_institucionales` queda en `parcial`.
- Validación reportada: 527 YAML OK, 0 errores.
- Worktrees `vinculos-bg` y `cobertura-bg` eliminados al cierre.

### Bloque D base pre-launch

- Se entregó la base para tres líneas de trabajo:
  - Schema y skill de vínculos institucionales.
  - Schema y skill de cobertura mediática general.
  - Estado público de la ficha de caso.
- `Caso.estado_publicacion` se amplió con `pendiente` y `beta_publica`.
- Se añadió `estado_ficha` con diez chequeos discretos de completitud editorial.
- Nuevos componentes: `EstadoPublicacionBadge.astro` y `EstadoFichaBadge.astro`.
- `/casos` bloquea en producción las filas `pendiente` y `borrador`; las rutas de detalle no se generan en producción para esos estados.
- El masthead de ficha incorpora una cara de detalle sobre el estado de la ficha.
- Documentación actualizada en:
  - `docs/web/features/estado-ficha-caso.md`
  - `docs/web/features/vinculos-institucionales.md`
  - `docs/web/features/cobertura-mediatica-general.md`
- Incidente operativo: el agente `cobertura-bg` escribió en el working tree principal en lugar de su worktree. El contenido era correcto, pero queda como aprendizaje para validar CWD antes de escribir.

### Corrección UI del flip de ficha

- Se retiró la esquina doblada como mecanismo de acceso a la cara B.
- Se sustituyó por un grupo superior con `EstadoPublicacionBadge` y botón secundario `Ver detalles de desarrollo` / `Volver`.
- Se corrigió el aparente desbordamiento del reverso separando medición de altura y evitando el bucle `ResizeObserver` + `min-height`.
- `DESIGN.md` veta pesos `800`/`900` en interfaz tras esta iteración.

### Bloque E - higiene técnica pre-launch

- Favicon multi-tamaño: `favicon.ico`, `favicon-32x32.png`, `icon.svg`, `apple-touch-icon.png`.
- Página 404 con chrome ministerial.
- `@astrojs/sitemap` configurado.
- `robots.txt` abierto con sitemap declarado.
- Cloudflare Web Analytics condicionado a `CF_ANALYTICS_TOKEN`.
- Build verde: 168 páginas, 167 URLs en sitemap.
- Documentación:
  - `docs/web/features/higiene-tecnica.md`
  - `docs/web/pages/404.md`
- Primera sesión real con el protocolo `multi-agent-orchestration` y cierre de worktree limpio.

### Síntesis de caso

- Campo `sintesis_caso` añadido al schema de `Caso`.
- Poblado en los 7 casos publicables del momento.
- Renderizado en `PgCasoDetalle` bajo el masthead.
- Estructura:
  - `que_se_investiga`
  - `hechos_clave`
  - `estado_actual`
  - `cifras_clave`
- Ficha de feature: `docs/web/features/sintesis-caso.md`.
- `revisar-caso` se amplió para auditar el nuevo campo como prosa publicable.

### Planning Bloque D pre-launch

- La conversación sobre sesgo mediático, vínculos políticos/institucionales, estado de completitud de fichas y síntesis accesible se separó en features propias:
  - `estado-ficha-caso`
  - `sintesis-caso`
  - `vinculos-institucionales`
  - `grafo-relaciones-caso`
  - `composicion-fuentes-citadas`
  - `cobertura-mediatica-general`
- El antiguo "barómetro de sesgo mediático" se dividió en:
  - composición de fuentes citadas por presuntamente.org
  - cobertura mediática general como corpus separado
- La idea de "ideologías afectadas" se reformuló como vínculos institucionales documentados.
- El resumen "para perezosos" se reformuló como síntesis de caso.

### Cauce editorial `/aportar`

- Se añadió el apartado 6bis como mecanismo hermano de rectificación.
- Canal `aportar@presuntamente.org` activado en Cloudflare Email Routing.
- Página `/aportar` implementada con tres carriles:
  - pista a fuente o hito
  - corrección fáctica menor
  - idea sobre el sitio
- Header: CTA `Aportar`, selector de idioma refactorizado a dropdown y entrada móvil.
- Footer: columna "Aportar y rectificar".
- `/rectificar` se reordenó para recomendar email antes que issue público.
- Se eliminó la palabra "burofax" del repo, sustituyéndola por "requerimiento formal" o "vía postal" según contexto.
- Documentación:
  - `docs/web/features/aporte-editorial.md`
  - `docs/web/pages/aportar.md`

## 2026-05-24

### `revisar-caso` v0 -> v1 y primera auditoría

- Primera pasada sobre los seis casos publicables del Bloque A.
- Resultado agregado: 3 BLOQUEANTES, 39 SUGERENCIAS y 25 observaciones fuera de checklist.
- Los 3 BLOQUEANTES se resolvieron en la misma sesión:
  - lenguaje "trama" en rol de Plus Ultra
  - documentos huérfanos incorrectos de Kitchen
  - biografía de Javier López Madrid con condenas ajenas sin documento modelado
- Se aplicaron seis sugerencias críticas.
- La skill incorporó CH9, CH10 y refinamientos a CH5/CH8.
- Se reforzó en doc 01 el test operativo de `es_figura_publica`.

### Timeline visual

- La cronología pasó de lista tabular a timeline visual con rail vertical y dots por familia de hito.
- Se retiraron caja envolvente, separadores y hover de fila.
- `SectionH` recibió la prop `orderToggle`.
- Los headers sticky de sección pasan a comportarse como click-to-top.
- Ficha de feature: `docs/web/features/timeline-visual.md`.

### OG images

- Se añadieron social cards 1200x630 para default, casos, personas y organizaciones.
- Stack: `satori` + `@resvg/resvg-js`.
- Endpoints bajo `src/pages/og/`.
- `BaseLayout.astro` emite Open Graph, Twitter Card y canonical.
- Se aplana y trunca `description` para evitar cortes por saltos de línea de YAML.
- Ficha de feature: `docs/web/features/og-images.md`.

### Lezo PR6 + PR7

- Se cerró la pieza Navalcarnero con sus seis procesados.
- Se corrigió la atribución inicial de Javier López Madrid: no Emissao, sino Navalcarnero.
- Se añadieron Adrián de la Joya, Rafael Martín de Nicolás y Felicísimo Damián Ramos.
- El caso Lezo quedó publicable para la primera oleada.
- Pendientes anotados: sentencia Inassa, señalamiento Navalcarnero y procesados/desimputados menores.

### Primarios descargados retrospectivos

- Se aplicó la convención de documentos primarios descargados a Plus Ultra, Begoña Gómez y González Amador en la medida disponible.
- Plus Ultra incorporó nota CGPJ HTML y BOE marco RD-ley 25/2020.
- González Amador incorporó BOE PDF+XML y corrección de `fecha_publicacion`.
- Begoña Gómez quedó con primarios pendientes por no haber URL oficial o mirror auditable.
- Se añadieron organizaciones productoras BOE.
- Aprendizajes promovidos a `AGENTS.md`: mirrors no auditables, HTML nativo, verificación de fecha BOE, BOE marco.

### Feed RSS/Atom

- Se añadieron `/feed.xml` y `/rss.xml` con los 50 hitos más recientes.
- Se habilitó deep-link a hitos con `#hito-<slug>`.
- `BaseLayout.astro` añadió autodiscovery y footer "Suscribirse".
- Nueva convención: toda feature transversal debe tener ficha en `docs/web/features/`.
- Primera ficha: `docs/web/features/feed-rss-atom.md`.

### Página `/cifras`

- Dashboard agregado del inventario, derivado en build de las collections.
- Nueve secciones con cifras de personas, casos, documentos, hechos, hitos, organizaciones, delitos, relaciones y notas metodológicas.
- `BaseLayout.astro` añadió nav `Cifras`.
- `PgInicio` añadió CTA hacia `/cifras`.
- Nueva convención: una ficha por página visible en `docs/web/pages/`.
- Primera ficha: `docs/web/pages/cifras.md`.

### Kitchen PR2

- Se incorporaron Ignacio López del Hierro y Sergio Ríos.
- Se amplió la cadena triple `investigado -> desimputado -> investigado tras revocación AN`.
- Se aplicó el patrón de hito compartido por varias personas.

## 2026-05-23

### Kitchen PR1

- Primer caso PP/derechas incorporado para equilibrar narrativa antes del lanzamiento.
- Pieza separada 7 del Caso Tándem, conocida como Operación Kitchen.
- Se estrenó la cadena triple de roles con María Dolores de Cospedal.
- Caso modelado como raíz autónoma hasta decidir si se ficha Tándem matriz.

### Planning de lanzamiento público

- Decisión: añadir Kitchen y Lezo antes de anunciar el sitio.
- Bloques pre-launch definidos: revisión editorial humana, features de enganche, higiene técnica y estrategia de lanzamiento.
- Estrategia de comunicación detallada guardada fuera de git.

### Infraestructura dominio + emails

- Dominio `presuntamente.org` comprado.
- `contacto@` y `rectificacion@` activados.
- Aviso legal actualizado para reflejar dominio, emails activos e identificación postal pendiente.

### Navegación interna en fichas

- `PageToc.astro` añadido.
- `SectionH` sticky por sección.
- Highlight `:target` para deep-links a hitos, documentos y hechos.

### PR3 del Fiscal General del Estado

- Composición del tribunal completada.
- Se añadieron hechos acreditados extraídos de la Sentencia 1000/2025.
- Se corrigieron datos de cargos judiciales y BOE asociados.

## 2026-05-22 y anteriores

El detalle de Fase 1, integración del design system, Pagefind, RichProse, `/delitos`, `/sobre`, `/rectificar`, Plus Ultra, Begoña Gómez, González Amador y Fiscal General del Estado queda consolidado en [`fases-cerradas.md`](fases-cerradas.md) y en el git log.

## 2026-05-26

### Cloudflare Pages conectado al repo (noche)

**Cloudflare Pages conectado al repo y sirviendo el preview en [`presuntamente.pages.dev`](https://presuntamente.pages.dev)** con `X-Robots-Tag: noindex` durante la fase sin DNS apex y Web Analytics activado a nivel de proyecto. Auto-deploy por push a `main` operativo. Detalle, configuración del panel y aprendizajes (primer build falló por `npm build` sin `run`; UI nueva empuja al flujo de Workers Static Assets; Web Analytics de zona DNS ≠ Web Analytics del proyecto Pages) en [`docs/web/features/cloudflare-pages-deploy.md`](../web/features/cloudflare-pages-deploy.md).

### Cierre del sprint extendido (tarde-noche)

Sesión grande con siete piezas:

1. **Modelo de clasificación editorial de medios** — canon [`docs/diseno/07-clasificacion-editorial-medios.md`](../diseno/07-clasificacion-editorial-medios.md). Cuatro campos nuevos en `Organizacion` (`naturaleza_editorial`, `orientacion_editorial_declarada`, `orientacion_editorial_percibida`, `grupo_editorial`). Enum del eje 7+1. Naturaleza separa generalistas políticos y confesionales (admiten orientación) del resto. 9 medios con orientación declarada verificada (piloto + sub-agente). Sin `percibida` poblada todavía (Reuters 2025 no contiene esos datos; ver bloque D).

2. **UI de clasificación editorial** — `ClasificacionEditorialBarra.astro`, `OrientacionBadge.astro` (rectangular con fondo + paleta cool→warm invertida: izquierda ámbar, derecha azul), `NaturalezaBadge.astro` (estilo `badge--cat`). Integrados en `PgCasoDetalle` (cobertura mediática) y `PgOrganizacionDetalle` (clasificación editorial); columna en /organizaciones. Disclaimers de cobertura reordenados al final.

3. **Modelo de partidos afectados** — `Caso.partidos_afectados[]` con enum cerrado (`imputacion_a_cargo_del_partido`, `gobierno_responsable_del_acto_investigado`, `vinculo_familiar_directo_con_dirigente`, `militancia_o_cargo_organico_relevante`, `querella_o_acusacion_popular_del_partido`, `otro`) + justificación. **Declaración explícita, nunca inferida.** Poblado piloto: `begona-gomez` (PSOE) y `gonzalez-amador` (PP + PSOE + Más Madrid). [Retirado del schema el 2026-05-27 noche, 2 por el refactor de afectación directa/indirecta.]

4. **Mejoras de listados y vista agregada de "instituciones alcanzadas"** — /casos con mini-descripción `que_se_investiga`, último hito truncado, órgano clic, RolBadge para naturaleza de org afectada, columna `Partidos afectados`, sin Implic; /personas con biografía corta + columna `Organización principal` + figura pública al lado del nombre como texto pálido; /organizaciones con bloque inverso `Personas relacionadas`; cabecera de Caso con bloques "Partidos afectados" e "Instituciones alcanzadas" (cajas con border-left por familia).

5. **Landing actualizada** — "Casos destacados" (plural, ≥2) en stack vertical con preview enriquecido: fase + estado de publicación, organización afectada con RolBadge, partidos afectados, último hito truncado.

6. **Explorador de Conexiones `/grafo`** — página global full-screen con Cytoscape.js, modo inventario completo sin foco, foco caso/persona/organización/documento, profundidad 1-3, filtros por tipo de nodo/arista con ayudas contextuales, layouts `cose`/`breadthfirst`, paneles flotantes, tabla textual equivalente activable y enlaces profundos desde fichas.

7. **Sprint extendido de datos editoriales** — `orientacion_editorial_percibida` poblada en 5 medios desde CIS 3421 (única fuente externa verificable); `grupo_editorial` en 21 medios (4 secundarios + 17 grandes: PRISA, Atresmedia, etc.); `partidos_afectados` cerrado en los 4 casos pendientes (10 entradas); `/documentar-vinculos` y `/rastrear-cobertura` aplicadas a los 5 casos pendientes (30 vínculos modo caso + 108 piezas de cobertura); `/revisar-caso` v1 sobre los 6 publicables con cero BLOQUEANTES y 17 sugerencias resueltas; 26 esqueletos `pendiente` + 19 órganos judiciales (con 7 órganos/fases corregidos tras auditoría); 2 RelacionEntreCasos (gurtel↔barcenas, tandem↔kitchen); rename `psoe-financiacion-venezuela` → `caso-apamate`; skill `/documentar-vinculos` ascendida a **v2 modal** (caso · persona · organización) con dos pasadas cruzadas que añaden 4 fichas de Persona (Feijóo, Rajoy, Iglesias, Yolanda Díaz), 33 vínculos persona↔organización (Sánchez/Ayuso/Bárcenas/Cospedal/Fernández Díaz/Cobo/Gallardón/I. González/Rajoy/Iglesias/Yolanda Díaz/Feijóo/Calvo Poch/Bravo Rivera y 9 vínculos diputado/a Congreso), 4 organizaciones nuevas (`congreso-de-los-diputados`, `xunta-de-galicia`, `sumar`, `izquierda-unida`) y 22 documentos nuevos (5 BOE nacionales descargados al árbol + 2 BOCM Lezo descargados al árbol + 1 BOE FGE corregido + cobertura N4 cruzada). Validate final: **676/0**.

### Ritmo vertical unificado en fichas

Ritmo vertical unificado en fichas (caso, persona, organización, delito): `FichaTocSection.astro` + `.entity-mast` compartido + `PgCasoDetalle` migrado al patrón común.

### UI Bloque D primera entrega

Vínculos institucionales + cobertura mediática general en `PgCasoDetalle`, Persona y Organización; 16 vínculos + 29 piezas en `begona-gomez`.

## 2026-05-27

### Sesión paralela al deploy de Cloudflare Pages (mañana-tarde)

Cuatro piezas:

1. **`PartidoBadge` con color institucional sobrio** — componente reutilizable + tokens `--color-partido-<slug>-{bg,fg,border}` en `global.css` para los 7 partidos modelados (PSOE, PP, Vox, Podemos, Sumar, IU, Más Madrid) + fallback gris para cualquier otro. Sustituido en `/casos` (chip con `href`), home (cards destacadas con `asLink={false}` para no anidar `<a>`) y bloque editorial "Partidos afectados" de la ficha de caso (`data-partido` sobre `<li>`, no chip dentro de chip). Peso tipográfico bajado de 700 → 600 en el bloque editorial. Detalle en [`docs/web/features/partido-badge.md`](../web/features/partido-badge.md).

2. **Iconografía funcional en `badge--cat`** — `CategoryBadge.astro` nuevo, wrapper único con 11 iconos Lucide inlineados como SVG (`gavel`, `scale`, `landmark`, `building-2`, `newspaper`, `users`, `shield`, `briefcase`, `banknote`, `flag`, `radio`). Mapeo `tipo → icono` por familia: el icono identifica la familia, no la sub-especialidad (todos los órganos judiciales superiores comparten `gavel`). Refactorizado en `Hito.astro`, `CoberturaMediaticaTable.astro`, `PgOrganizaciones.astro`, `PgDelitos.astro`. `NaturalezaBadge` mantiene paleta propia sin iconos. `lucide-static@1.16.0` como devDep, no runtime. Detalle en [`docs/web/features/iconografia-badge-cat.md`](../web/features/iconografia-badge-cat.md).

3. **Dedupe de partidos en `/casos`** — bug visual: el listado mostraba `PSOE PSOE` en Plus Ultra y `PP PP` en Kitchen porque `partidos_afectados[]` admite varias entradas con el mismo `partido_id` y distinto `tipo_afectacion`. Ahora se deduplica por `partido_id` antes de renderizar; la justificación detallada sigue en la ficha del caso.

4. **Decisión editorial: afectación directa vs indirecta** — al revisar la columna "Organización afectada" de `/casos`, el maintainer detectó que Podemos aparecía como "afectada" en Kitchen siendo acusación popular. Análisis: hoy se confunde "afectación" con "papel procesal" en dos modelos paralelos (`Caso.partidos_afectados[].tipo_afectacion: querella_o_acusacion_popular_del_partido` + prioridad `acusacion_institucional_en_caso` en la derivación). Taxonomía nueva acordada (directa · indirecta · no afectada / papel procesal) + 6 reglas editoriales que resuelven fronteras. **No implementado en esta sesión** — es refactor estructural con doc canónico, schema, migración de datos y UI. Plan completo en [`docs/web/features/afectacion-directa-indirecta.md`](../web/features/afectacion-directa-indirecta.md). Implementado el mismo día en la sesión «noche, 2» (ver más abajo).

### Bloque C — revisión editorial humana pre-launch (2026-05-27)

Cerrado 2026-05-27 (noche). Auditoría multi-agente del sitio público (5 sub-agentes Sonnet en paralelo barriendo home/chrome, institucionales, fichas y entidades, listados+casos, transversales+repo). Hallazgos consolidados y aplicados en 30 ediciones sobre 26 ficheros + 3 nuevos.

Piezas principales: limpieza de jerga del repo (rutas `docs/diseno/`, `AGENTS.md`, `pnpm`, códigos V/P, mayúsculas de entidades del modelo); retirada de banderines de borrador (`v0.0.0-alpha`, banner legal); placeholder `numero_procedimiento` quitado de 4 YAMLs publicables; glosas `<abbr>` de siglas (UDEF, UCO, CGPJ, CENDOJ, AIReF, LSSI, LO 2/1984); «rescate» → «préstamo» en Plus Ultra; `PgTraduccionCatalan` para selector ES/CAT; glosa pública de explorador de conexiones; fallback de búsqueda sin comandos pnpm; `EstadoPublicacionBadge` en persona/organización; David Chicano como responsable LSSI en `/aviso-legal`; track `Versión <sha7> · <fecha>` vía `src/lib/build-info.ts`; README/CONTRIBUTING/LEGAL adelgazados.

Decisiones del maintainer: mantener nomenclatura `borrador/beta_publica/publicado`, eyebrows «Sección X · …», «imputación» en hero, escala N1-N4 glosada en primer encuentro, página `/cat` personalizada. Hueco no bloqueante: columna orientación en `/organizaciones` con «—» para no-medios.

Validate **676/0**, build **201 páginas + 4476 palabras Pagefind**.

### Refactor afectación directa/indirecta (noche, 2)

Sesión dedicada en 7 fases: (1) doc canónico [`08-afectacion-directa-indirecta.md`](../diseno/08-afectacion-directa-indirecta.md); (2) schema `VinculoInstitucional` + V-22..V-24; (3) migración 6 publicables (5 directos anotados + 8 vínculos nuevos); (4) UI [`src/lib/afectacion.ts`](../src/lib/afectacion.ts) — columna fusionada Directa/Indirecta + participación procesal; (5) skill `/documentar-vinculos` v3; (6) `/revisar-caso` CH11 + pasada 6 casos (0 BLOQUEANTES del refactor); (7) retirada `Caso.partidos_afectados[]`. Validate **684/0**, build **201 páginas**.

Fichas: [`afectacion-directa-indirecta.md`](../web/features/afectacion-directa-indirecta.md), [`partidos-afectados.md`](../web/features/partidos-afectados.md) (retirada), [`vinculos-institucionales.md`](../web/features/vinculos-institucionales.md).

### Backlog editorial heredado (noche, 3)

Pasada sobre 13 hallazgos no estructurales de auditoría `/revisar-caso` 2026-05-27: Plus Ultra (`pu-prestamo-sepi` → `atribuido`; URL Infobae corregida); Begoña Gómez (hito imputación Cristina Álvarez reasignado); González Amador (`hito_origen_id` acusación popular eliminado); FGE (rol Salto investigado; V-19 en 4 hechos N1→3); Kitchen (biografías Bárcenas/Iglesias; fechas `fecha_precision: mes`); Lezo (documentos hito cambio juez Velasco/Castellón; CGPJ histórico pre-2024 vía URL estática + PDFs CP jun-2017; BOE RD 527/2017). Sub-agente Sonnet: autos GA acusación popular por cobertura N4; BOE Lezo descargado. Validate final **690/0**.

Catálogo [`docs/fuentes/`](../fuentes/README.md) creado (poder judicial, BOE, archivos; placeholders Fiscalía, TC, etc.).

### Pasada UX catálogos y ficha (noche, 4)

Cinco piezas: (1) `CatalogoLeyenda` en 4 catálogos; (2) filtros/ordenación ampliados (`MultiSelectFilter`, `git-meta.ts` para última actualización, pirámide procesal); (3) `SectionH` + botón limpiar en header vía `form=`; (4) pills en ficha §3 Personas, §5 Cronología, §6 Hechos (`ChipFilterGroup`); §7 cobertura aplazado; (5) bugs `CustomSelect`/`MultiSelectFilter` (`DOMContentLoaded`, `[hidden]`). Fichas: [`catalogos-comunes.md`](../web/features/catalogos-comunes.md), [`filtros-pills-ficha-caso.md`](../web/features/filtros-pills-ficha-caso.md), páginas catálogo actualizadas. Validate **690/0**.

### Rename grafo → conexiones (noche, 5)

Coherencia URL `/conexiones`, schema `estado_ficha.conexiones`, nav y slugs de docs. Sin tocar tipos TS `Graph*`, clases `graph-*` ni prosa «grafo» como descriptor de formato. Reparto Opus/Sonnet: mecánico en sub-agente, párrafos editoriales en principal. Validate **690/0**, build **201 páginas**.

Fichas: [`conexiones.md`](../web/pages/conexiones.md), [`explorador-conexiones.md`](../web/features/explorador-conexiones.md).

### Iteración UI /casos (noche, 6)

HoverCard, chips org afectadas, `EstadoPublicacionBadge` en listado. [`casos.md`](../web/pages/casos.md), [`hover-card.md`](../web/features/hover-card.md).

### Sesiones 2026-05-27 (noche, 7 a 9)

**Noche 7 — copy pre-launch:** kicker home `con fuente`; `/sobre` (filosofía, mantenimiento, §4→`/aportar`, §9→`/rectificar`); `/aportar` ampliado; `.page-id` meta alineada al eyebrow. Fichas: [`inicio.md`](../web/pages/inicio.md), [`sobre.md`](../web/pages/sobre.md), [`aportar.md`](../web/pages/aportar.md).

**Noche 8 — contenedor común de cards:** `PersonaCard`, `OrgCard`, `Hecho` alineados con cards de home (borde fino, `--color-surface`, hover `translateX(-2px)` sin `border-left` grueso). Canon en [`DESIGN.md`](../../DESIGN.md); detalle en [`filtros-pills-ficha-caso.md`](../web/features/filtros-pills-ficha-caso.md), [`vinculos-institucionales.md`](../web/features/vinculos-institucionales.md). Validate **690/0**, build **201 páginas + 4563 palabras Pagefind**.

**Noche 9 — preindexación pública:** eliminado `public/_headers` (dejaba `X-Robots-Tag: noindex` en Pages); pendiente barrido actualidad 6 casos; norma higiene roadmap en `AGENTS.md`. Fichas: [`higiene-tecnica.md`](../web/features/higiene-tecnica.md), [`cloudflare-pages-deploy.md`](../web/features/cloudflare-pages-deploy.md).

## 2026-05-28

### Lanzamiento real y primer ciclo de actualidad post-launch (PR1+PR2)

- Sitio publicado, tweet hecho, tráfico real.
- Caso nuevo `leire-diez` (7º publicable, `pin_destacado: 2`) con auto Pedraz 26-may, registro UCO Ferraz 27-may, imputaciones a la dirigencia PSOE; 16 vínculos institucionales (3 afectación + 13 cargos/nombramientos incluyendo BOE-A-2018-8601 RD 616/2018 nombramiento Fernández Guerrero SEPI descargado + nota FESOFI N3 Leire Correos).
- Plus Ultra actualizado con hito aplazamiento 26-may, cascada `sintesis_caso` (estado_actual + hechos_clave) y `RelacionEntreCasos` con Leire por nexo SEPI/Fernández Guerrero (`pin_destacado: 1`).
- Override editorial `pin_destacado` añadido al schema + sort de PgInicio.
- Schema vínculos ampliado con enum `cargo_funcionarial_carrera` para cargos de carrera (caso Sánchez Yepes capitán UCO).
- Skill nueva [`/actualizar-caso`](../../.agents/skills/actualizar-caso/SKILL.md) v1 con guardarraíles (queries cruzadas obligatorias, sumarios bajo secreto no se modelan, agencias EFE no cuentan como línea propia, cascada exhaustiva sobre todo `caso.yaml`).
- 0 bloqueantes tras auditoría paralela `/revisar-caso` PU+Leire (10 sugerencias resueltas).
- `pnpm validate` 782 OK + build 223 páginas.
