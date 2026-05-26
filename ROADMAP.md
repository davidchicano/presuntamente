# Roadmap operativo de presuntamente

> **Estado vivo del proyecto.** Este sigue siendo el primer fichero que cualquier persona o agente debe leer al empezar a trabajar, y el último que debe actualizar al cerrar una sesión.
>
> El roadmap conceptual vive en [`docs/diseno/06-roadmap-por-fases.md`](docs/diseno/06-roadmap-por-fases.md). Este fichero es la versión operativa: estado actual, próximos pasos, backlog inmediato y aprendizajes recientes. El histórico largo se ha movido a [`docs/roadmap/`](docs/roadmap/README.md).

**Última actualización:** 2026-05-26 (noche). Cierre operativo: **Cloudflare Pages conectado al repo y sirviendo el preview en [`presuntamente.pages.dev`](https://presuntamente.pages.dev)** con `X-Robots-Tag: noindex` durante la fase sin DNS apex y Web Analytics activado a nivel de proyecto. Auto-deploy por push a `main` operativo. Detalle, configuración del panel y aprendizajes (primer build falló por `npm build` sin `run`; UI nueva empuja al flujo de Workers Static Assets; Web Analytics de zona DNS ≠ Web Analytics del proyecto Pages) en [`docs/web/features/cloudflare-pages-deploy.md`](docs/web/features/cloudflare-pages-deploy.md).

**Anterior (tarde-noche):** cierre del sprint extendido. Sesión grande con siete piezas:

1. **Modelo de clasificación editorial de medios** — canon [`docs/diseno/07-clasificacion-editorial-medios.md`](docs/diseno/07-clasificacion-editorial-medios.md). Cuatro campos nuevos en `Organizacion` (`naturaleza_editorial`, `orientacion_editorial_declarada`, `orientacion_editorial_percibida`, `grupo_editorial`). Enum del eje 7+1. Naturaleza separa generalistas políticos y confesionales (admiten orientación) del resto. 9 medios con orientación declarada verificada (piloto + sub-agente). Sin `percibida` poblada todavía (Reuters 2025 no contiene esos datos; ver bloque D).

2. **UI de clasificación editorial** — `ClasificacionEditorialBarra.astro`, `OrientacionBadge.astro` (rectangular con fondo + paleta cool→warm invertida: izquierda ámbar, derecha azul), `NaturalezaBadge.astro` (estilo `badge--cat`). Integrados en `PgCasoDetalle` (cobertura mediática) y `PgOrganizacionDetalle` (clasificación editorial); columna en /organizaciones. Disclaimers de cobertura reordenados al final.

3. **Modelo de partidos afectados** — `Caso.partidos_afectados[]` con enum cerrado (`imputacion_a_cargo_del_partido`, `gobierno_responsable_del_acto_investigado`, `vinculo_familiar_directo_con_dirigente`, `militancia_o_cargo_organico_relevante`, `querella_o_acusacion_popular_del_partido`, `otro`) + justificación. **Declaración explícita, nunca inferida.** Poblado piloto: `begona-gomez` (PSOE) y `gonzalez-amador` (PP + PSOE + Más Madrid).

4. **Mejoras de listados y vista agregada de "instituciones alcanzadas"** — /casos con mini-descripción `que_se_investiga`, último hito truncado, órgano clic, RolBadge para naturaleza de org afectada, columna `Partidos afectados`, sin Implic; /personas con biografía corta + columna `Organización principal` + figura pública al lado del nombre como texto pálido; /organizaciones con bloque inverso `Personas relacionadas`; cabecera de Caso con bloques "Partidos afectados" e "Instituciones alcanzadas" (cajas con border-left por familia).

5. **Landing actualizada** — "Casos destacados" (plural, ≥2) en stack vertical con preview enriquecido: fase + estado de publicación, organización afectada con RolBadge, partidos afectados, último hito truncado.

6. **Explorador de Conexiones `/grafo`** — página global full-screen con Cytoscape.js, modo inventario completo sin foco, foco caso/persona/organización/documento, profundidad 1-3, filtros por tipo de nodo/arista con ayudas contextuales, layouts `cose`/`breadthfirst`, paneles flotantes, tabla textual equivalente activable y enlaces profundos desde fichas.

7. **Sprint extendido de datos editoriales** — `orientacion_editorial_percibida` poblada en 5 medios desde CIS 3421 (única fuente externa verificable); `grupo_editorial` en 21 medios (4 secundarios + 17 grandes: PRISA, Atresmedia, etc.); `partidos_afectados` cerrado en los 4 casos pendientes (10 entradas); `/documentar-vinculos` y `/rastrear-cobertura` aplicadas a los 5 casos pendientes (30 vínculos modo caso + 108 piezas de cobertura); `/revisar-caso` v1 sobre los 6 publicables con cero BLOQUEANTES y 17 sugerencias resueltas; 26 esqueletos `pendiente` + 19 órganos judiciales (con 7 órganos/fases corregidos tras auditoría); 2 RelacionEntreCasos (gurtel↔barcenas, tandem↔kitchen); rename `psoe-financiacion-venezuela` → `caso-apamate`; skill `/documentar-vinculos` ascendida a **v2 modal** (caso · persona · organización) con dos pasadas cruzadas que añaden 4 fichas de Persona (Feijóo, Rajoy, Iglesias, Yolanda Díaz), 33 vínculos persona↔organización (Sánchez/Ayuso/Bárcenas/Cospedal/Fernández Díaz/Cobo/Gallardón/I. González/Rajoy/Iglesias/Yolanda Díaz/Feijóo/Calvo Poch/Bravo Rivera y 9 vínculos diputado/a Congreso), 4 organizaciones nuevas (`congreso-de-los-diputados`, `xunta-de-galicia`, `sumar`, `izquierda-unida`) y 22 documentos nuevos (5 BOE nacionales descargados al árbol + 2 BOCM Lezo descargados al árbol + 1 BOE FGE corregido + cobertura N4 cruzada). Validate final: **676/0**.

**Anterior inmediato:** ritmo vertical unificado en fichas (caso, persona, organización, delito): `FichaTocSection.astro` + `.entity-mast` compartido + `PgCasoDetalle` migrado al patrón común.

**Antes:** UI Bloque D primera entrega (vínculos institucionales + cobertura mediática general en `PgCasoDetalle`, Persona y Organización; 16 vínculos + 29 piezas en `begona-gomez`).

---

## Dónde está cada cosa

- **Roadmap operativo actual**: este fichero.
- **Histórico de sesiones mayo 2026**: [`docs/roadmap/historial-2026-05.md`](docs/roadmap/historial-2026-05.md).
- **Fases y bloques ya cerrados**: [`docs/roadmap/fases-cerradas.md`](docs/roadmap/fases-cerradas.md).
- **Aprendizajes largos no canónicos**: [`docs/roadmap/aprendizajes.md`](docs/roadmap/aprendizajes.md).
- **Snapshot íntegro antes de dividir**: [`docs/roadmap/roadmap-completo-antes-division-2026-05-25.md`](docs/roadmap/roadmap-completo-antes-division-2026-05-25.md).
- **Decisiones de diseño duraderas**: [`docs/diseno/`](docs/diseno/).
- **Reglas operativas obligatorias para agentes**: [`AGENTS.md`](AGENTS.md).
- **Backlog por página visible**: [`docs/web/pages/`](docs/web/pages/).
- **Backlog por feature transversal**: [`docs/web/features/`](docs/web/features/).

---

## Estado actual

- **Fase activa**: Fase 0 operativa pendiente de publicación pública; Fase 1.0 y Fase 1 cerradas; Fase 2 en marcha con 6 casos publicables y 1 borrador/conexo.
- **Casos publicables actuales**: `plus-ultra`, `begona-gomez`, `gonzalez-amador`, `fiscal-general-del-estado`, `kitchen`, `lezo`.
- **Caso no publicable en producción**: `atico-estepona`, en `borrador`.
- **Bloques pre-launch cerrados**: Bloque A (casos equilibrados), Bloque B (`revisar-caso` v1 + primera auditoría), Bloque E (higiene técnica).
- **Bloque D**: casi cerrado. Cerrados `/cifras`, OG images, RSS/Atom, timeline visual, estado de ficha, síntesis de caso, vínculos institucionales (datos + UI, corpus ampliado a personas no atadas a caso vía skill v2), cobertura mediática general (corpus completo en los 6 casos + UI), explorador de relaciones `/grafo`, clasificación editorial de medios (declarada · percibida · grupo) y mejoras de listados. Quedan composición de fuentes citadas, PartidoBadge con color de partido e iconografía en `badge--cat`.
- **Próximo paso comprometido**: lo decide el maintainer. Opciones naturales: Bloque C (revisión editorial humana pre-launch), continuar Bloque D, o publicación técnica en Cloudflare Pages sin DNS apex.
- **Dev server local**: `pnpm dev` en `http://localhost:4321`.
- **Workflow git**: trabajo directo sobre `main`, sin ramas ni PRs mientras dure el MVP. No hacer `git add`, `git commit` ni `git push` salvo petición explícita del maintainer. Ver [`AGENTS.md`](AGENTS.md).
- **Infraestructura pública**: dominio `presuntamente.org` comprado, `contacto@`, `rectificacion@` y `aportar@` operativos vía Cloudflare Email Routing. **Cloudflare Pages conectado y sirviendo preview en [`presuntamente.pages.dev`](https://presuntamente.pages.dev) con `X-Robots-Tag: noindex` y Web Analytics activado.** Sitio aún sin publicar bajo dominio propio: DNS apex no apuntado a la espera de apartado de correos del responsable y revisión legal del aviso.

---

## Contexto operativo imprescindible

Este bloque es lo que debe permitir a un agente actuar después de leer sólo `ROADMAP.md` + el doc canónico que toque.

- **Misión editorial**: inventario público y trazable de casos de corrupción relevantes en España. Reducir desinformación, no ganar una discusión política. Presunción de inocencia y trazabilidad mandan sobre impacto visual o viralidad.
- **Estado del sitio**: el producto ya es navegable y casi publicable, pero no está anunciado ni bajo DNS apex. El riesgo principal ahora no es técnico sino editorial/legal: cómo se verá el sitio cuando lo lean periodistas, afectados y adversarios.
- **Criterio de prioridad actual**: antes de anunciar, cerrar lo que reduzca arrepentimiento público: revisión editorial humana, contexto institucional no partidista, cobertura/fuentes explicables, legal y deploy controlado.
- **Qué no hay que hacer por inercia**: no añadir casos nuevos sólo por volumen, no meter fotos reales sin consulta legal, no inferir ideología o bandos a partir de vínculos, no promover hechos a `acreditado` salvo primario sólido y redacción neutra.
- **Fuente de verdad por tipo de tarea**: contenido/modelo en `docs/diseno/01-modelo-de-datos.md` y `02-ficha-de-caso.md`; legal y lenguaje en `04-riesgos-legales-y-eticos.md`; arquitectura en `05-arquitectura-tecnica.md`; diseño visual en `DESIGN.md`; normas de agente en `AGENTS.md`.
- **Cómo cerrar cambios**: si se toca una página visible, actualizar su ficha en `docs/web/pages/`; si se toca una feature transversal, actualizar `docs/web/features/`; si la sesión deja aprendizaje operativo largo, añadirlo a `docs/roadmap/` y dejar sólo el resumen aquí.
- **Validación esperada**: para cambios de contenido o código, `pnpm validate` y `pnpm build`. Para docs puros, `ReadLints` suele bastar salvo que se toquen enlaces o snippets que afecten al build.
- **Modo multiagente**: asumir siempre que puede haber otra sesión. Si el trabajo es paralelo, usar worktree. En el working tree principal, no stagear ni commitear salvo cierre explícito.

---

## Backlog inmediato

Una idea, un bullet. `[ ]` pendiente, `[x]` hecho. Los detalles de items completados pasan a histórico tras una o dos sesiones.

### Publicación del sitio

Items necesarios para activar `presuntamente.org` bajo dominio propio.

Contexto: esto cierra la Fase 0 operativa. No es sólo configurar DNS; publicar bajo dominio propio convierte el borrador en una pieza pública atribuible, con riesgo legal y reputacional real.

- [x] Comprar dominio `presuntamente.org` en Cloudflare Registrar.
- [x] Activar Cloudflare Email Routing para `contacto@`, `rectificacion@` y `aportar@`.
- [ ] Abrir apartado de correos del responsable y completar la identificación postal del aviso legal.
- [x] Conectar Cloudflare Pages al repo `davidchicano/presuntamente`. Cerrado 2026-05-26: proyecto `presuntamente`, build `pnpm build`, output `dist`, Node 24.13.1 detectado desde `.nvmrc`. Preview servido en [`presuntamente.pages.dev`](https://presuntamente.pages.dev) con `X-Robots-Tag: noindex, nofollow` (vía `public/_headers`) y Web Analytics activado a nivel de proyecto. Auto-deploy por push a `main` operativo. Detalle y aprendizajes en [`cloudflare-pages-deploy.md`](docs/web/features/cloudflare-pages-deploy.md).
- [ ] Revisar el aviso legal con abogado especializado. Repaso especial: LSSI, datos personales/RGPD, licencias y límites de responsabilidad.
- [ ] Activar DNS apex + `www` cuando lo anterior esté cerrado, y **retirar `public/_headers`** en un commit dedicado para reabrir indexación.

### Camino al lanzamiento público

Pre-requisitos para anunciar el sitio sin riesgo editorial excesivo.

Origen: sesión de planning del 2026-05-23. La pregunta no era "qué falta para deployar", sino "qué falta para enseñarlo en redes y a periodistas sin que parezca sesgado, inmaduro o jurídicamente temerario".

#### Bloque A - Casos equilibrados `[x]`

Objetivo: evitar que el inventario nazca leído como anti-PSOE o anti-PP. El equilibrio no es cuota política; es cubrir casos relevantes de signos y órganos distintos para que el método se vea antes que la selección.

- [x] Kitchen incorporado como caso PP/derechas vivo.
- [x] Lezo incorporado como caso PP/derechas multi-pieza.
- [x] Convención de documentos primarios descargados aplicada retrospectivamente a Plus Ultra, Begoña Gómez, González Amador y FGE en la medida en que las fuentes están disponibles.
- [ ] PR4+ de casos actuales cuando aparezcan primarios pendientes: auto Calama 19-may, autos JI 41/AP Madrid Begoña Gómez, auto AP Madrid 7-nov González Amador, amparo TC FGE si se resuelve.

#### Bloque B - Revisión editorial LLM `[x]`

Objetivo: cubrir el hueco entre `pnpm validate` y una lectura humana. La skill no decide ni autocorrige; señala riesgos de lenguaje, privacidad, trazabilidad y sesgo que AJV no puede detectar.

- [x] Implementar `revisar-caso` v0.
- [x] Pasar `revisar-caso` sobre los 6 casos publicables.
- [x] Resolver los 3 BLOQUEANTES y las 6 SUGERENCIAS críticas.
- [x] Iterar la skill a v1 con CH9/CH10 y refinamientos.
- [ ] Opcional pre-launch: triaje de sugerencias no críticas que no sean mero "esperar a CENDOJ".

#### Bloque C - Revisión editorial humana pre-launch

Pasada manual del maintainer con ojos de "esto lo va a leer un periodista hostil".

Es el bloque más importante si el siguiente paso es publicar. El objetivo no es buscar bugs, sino detectar frases, jerarquías visuales o silencios que puedan ser injustos, malinterpretables o demasiado internos.

- [ ] Reescribir o pulir el hero de `PgInicio` para primer impacto en visitantes que entren desde redes.
- [ ] Repasar `/sobre`: misión, principios editoriales, escala N1-N4 y cauces de rectificación/aporte.
- [ ] Repasar el sustantivo de `/aviso-legal`, aparte de la revisión jurídica formal.
- [ ] Repasar la síntesis y el resumen ejecutivo de cada caso.
- [ ] Repasar `README.md` público del repo.

#### Bloque D - Features de enganche para v1

Objetivo: que el sitio parezca serio y útil al compartirlo, sin convertirlo en espectáculo. Cada feature debe reforzar trazabilidad, comprensión o confianza pública.

- [x] Página `/cifras`. Detalle en [`docs/web/pages/cifras.md`](docs/web/pages/cifras.md).
- [x] OG images por caso, persona y organización. Detalle en [`docs/web/features/og-images.md`](docs/web/features/og-images.md).
- [x] RSS/Atom de hitos. Detalle en [`docs/web/features/feed-rss-atom.md`](docs/web/features/feed-rss-atom.md).
- [x] Timeline visual. Detalle en [`docs/web/features/timeline-visual.md`](docs/web/features/timeline-visual.md).
- [x] Estado de ficha de caso. Detalle en [`docs/web/features/estado-ficha-caso.md`](docs/web/features/estado-ficha-caso.md).
- [x] Síntesis de caso. Detalle en [`docs/web/features/sintesis-caso.md`](docs/web/features/sintesis-caso.md).
- [x] Vínculos institucionales documentados: schema, collection, skill v1, primera pasada `begona-gomez` y UI en caso/persona/organización. Detalle en [`docs/web/features/vinculos-institucionales.md`](docs/web/features/vinculos-institucionales.md).
- [x] Cobertura mediática general / barómetro de cobertura: schema, collection, skill v1, corpus piloto `begona-gomez` y UI separada de biblioteca documental. Detalle en [`docs/web/features/cobertura-mediatica-general.md`](docs/web/features/cobertura-mediatica-general.md).
- [x] **Modelo de clasificación editorial de medios** (canon + schema + piloto). Cerrado 2026-05-26: tres dimensiones (`declarada` autoadscripción · `percibida` por fuente externa · `grupo_editorial` propiedad), naturaleza editorial separada del eje, enum 7+1 con extremos. Canon en [`docs/diseno/07-clasificacion-editorial-medios.md`](docs/diseno/07-clasificacion-editorial-medios.md). Sub-agente poblando los 21 medios restantes.
- [ ] **Barra proporcional por corriente editorial en cobertura mediática general** (v1.x). Prerrequisito desbloqueado. Falta: poblar resto de medios y entregar UI con toggle "Declarada · Percibida", tooltip por medio con las tres dimensiones, franjas separadas para medios fuera del eje. Detalle en [`docs/web/features/cobertura-mediatica-general.md`](docs/web/features/cobertura-mediatica-general.md).
- [ ] **Composición de fuentes periodísticas citadas** (v1.x). Prerrequisito desbloqueado (mismo schema editorial). Bloque agregador sobre `Documento.nivel_fuente: 4` por caso. Detalle en [`docs/web/features/composicion-fuentes-citadas.md`](docs/web/features/composicion-fuentes-citadas.md).
- [ ] **Vista agregada "instituciones alcanzadas" en ficha de caso** + columna "Organización principal" en listado /casos (v1.x). El modelo ya cubre acusación popular, perjudicado institucional, ente investigado y nombramientos (`VinculoInstitucional`); en `begona-gomez` ya hay datos. Falta bloque resumen + derivación automática para la columna. Detalle en [`vinculos-institucionales.md`](docs/web/features/vinculos-institucionales.md).
- [x] **Mejoras de listados** (CASOS · PERSONAS · ORGANIZACIONES). Entregado 2026-05-26: /casos con mini-descripción `que_se_investiga`, último hito truncado, órgano clic, RolBadge para naturaleza de org afectada, columna `Partidos afectados`, sin Implic; /personas con biografía corta + columna `Organización principal` + figura pública al lado del nombre; /organizaciones con bloque inverso `Personas relacionadas`.
- [ ] **PartidoBadge componente reutilizable con color del partido** v1.x. Hoy los chips de partidos en /casos usan estilo accent uniforme (border + bg suave). Refactor: extraer a componente `src/components/PartidoBadge.astro` con tokens por partido (PSOE, PP, Vox, Podemos, Más Madrid, etc.) usando los colores institucionales reales con saturación bajada para sobriedad. Reutilizar en /casos, en el bloque "Partidos afectados" de PgCasoDetalle, y donde se use `partidos_afectados`. Apuntado 2026-05-26 por feedback del maintainer.
- [ ] **Iconografía en badge--cat (Tipo de organización)** v1.x. El badge actual diferencia categorías por color de border-left + label. Añadir icono pequeño antes del label por tipo (juzgado, fiscalía, partido_politico, empresa, medio_comunicacion, asociacion_acusacion_popular, organismo_publico, policia_judicial_unidad, etc.). Mantener la regla AGENTS.md sobre glyphs decorativos: los iconos deben ser funcionales (identificativos), no ornamentales. Apuntado 2026-05-26 por feedback del maintainer.
- [x] **Poblar `orientacion_editorial_percibida` con fuentes adecuadas**. Cerrado 2026-05-26 (sprint extendido): 5 medios poblados desde CIS 3421 — Estudio sobre audiencias (campo sep-oct 2023, N=27.433, escala 1-10 izquierda-derecha por medio). El Reuters Institute 2025 no servía. Cubre `el-pais`, `eldiario-es`, `la-sexta`, `cadena-ser` y `cope`. Los 16 medios restantes del eje no están en el CIS y no hay otra fuente externa accesible hoy (Political Watch app caída, papers UN/UNAV con 403). `sin_clasificar` legal para esos.
- [x] **Poblar `grupo_editorial` en medios principales**. Cerrado 2026-05-26 (sprint extendido): 21 medios con `grupo_editorial` documentado (PRISA matriz para `el-pais`/`cadena-ser`, Atresmedia para `la-sexta`, El Salto cooperativa, Edicavp/ACdP para `el-debate`, etc.). 4 medios sin grupo accesible por sitios caídos/restringidos (`el-independiente`, `heraldo-de-leon`, `iustel`, `newtral`).
- [x] **Poblar `partidos_afectados` en los 4 casos restantes**. Cerrado 2026-05-26 (sprint extendido): `plus-ultra`, `fiscal-general-del-estado`, `kitchen` y `lezo` con `partidos_afectados[]` poblado vía declaración explícita (no derivada). Sumado a `begona-gomez` y `gonzalez-amador` previos, los 6 publicables tienen declaración cerrada.
- [x] **Pasadas de skills pendientes por caso**. Cerrado 2026-05-26 (sprint extendido):
  - `/documentar-vinculos` modo caso en los 5 casos pendientes — 30 vínculos institucionales nuevos.
  - `/rastrear-cobertura` en los 5 pendientes — 108 piezas con metodología explícita, 16-26 por caso.
  - `/revisar-caso` v1 con CH11 + CH12 sobre los 6 publicables — 0 BLOQUEANTES, 17 sugerencias (4 IDs de pieza con prefijo de medio incorrecto, 6 órganos judiciales mal asignados en esqueletos, 2 RelacionEntreCasos a crear, etiqueta de ventana mal puesta, 3 BOEs huérfanos, "trama" en Lezo, nota rectificadora en Kitchen, aclaración histórica Zapatero en Plus Ultra). Las 17 sugerencias resueltas o aplazadas a decisión.
- [x] **Listado completo de casos públicos españoles en estado `pendiente`** pre-launch (Bloque C bis). Cerrado 2026-05-26 (sprint extendido): 26 esqueletos creados (`acuamed`, `bankia-salida-bolsa`, `barcenas-caja-b`, `brugal`, `caso-apamate` ex `psoe-financiacion-venezuela` renombrado a alias neutro, `edu-andalucia`, `eres-andalucia`, `faisan`, `filesa`, `forum-filatelico`, `gurtel`, `itv-cataluna`, `koldo`, `malaya`, `marsans`, `noos`, `palau-musica`, `pokemon`, `pretoria`, `proces`, `pujol`, `rato-fraude-fiscal`, `tandem`, `tarjetas-black`, `taula`, `tres-por-ciento-cataluna`) + 19 organizaciones judiciales nuevas (TSJ Andalucía/Cataluña/Galicia/Comunidad Valenciana/Illes Balears, AP Barcelona/Lugo/Málaga/Palma/Sevilla/Valencia, JCI 2/5, JI 1 Lugo/3 Palma/5 Marbella/6 Sevilla/18 Valencia/31 Madrid). Tras revisión: 6 órganos/fases corregidos vía WebSearch + 2 RelacionEntreCasos creadas (`gurtel`↔`barcenas-caja-b`, `tandem`↔`kitchen`).
- [x] **Skill `/documentar-vinculos` v2 modal y primera pasada cruzada**. Cerrado 2026-05-26 (sprint extendido): la skill v1 solo modo caso → v2 con tres modos (caso · persona · organización), sin cambios al schema (el `relevancia_para_caso_ids: []` legal por defecto ya lo permitía). Primera pasada cruzada: 7 fichas de Persona nuevas (`alberto-nunez-feijoo`, `mariano-rajoy`, `pablo-iglesias`, `yolanda-diaz` + más implícitas en pasada), 19 vínculos persona↔organización nuevos (Sánchez × 3 PSOE+Presidencia, Ayuso → PP Madrid, Bárcenas × 2 cargos PP, Fernández Díaz/Martínez Vázquez/Cobo/Gallardón/I. González → PP militancia, Bravo Rivera asesor Ministerio Justicia, Feijóo → PP + Xunta Galicia, Rajoy × 2 Presidencia + PP, Iglesias × 2 Podemos + Vicepresidencia, Yolanda Díaz × 2 Trabajo + Vicepresidencia + Sumar), 16 documentos nuevos (5 BOEs N1 + 11 N4), 4 organizaciones nuevas (`congreso-de-los-diputados`, `xunta-de-galicia`, `sumar`, `izquierda-unida`). 5 BOEs N1 pendientes de descarga local por el maintainer (Rajoy nombramiento+cese, Iglesias vicepresidente, Yolanda Díaz × 2).
- [x] **Explorador de Conexiones `/grafo`**. Entregado 2026-05-26: página global full-screen con modo inventario completo, foco caso/persona/organización/documento, profundidad 1-3, filtros por nodos/aristas con ayudas contextuales, layouts Cytoscape (`cose`/`breadthfirst`), paneles flotantes, tabla textual equivalente activable y enlaces profundos desde fichas. Detalle en [`docs/web/features/grafo-relaciones-caso.md`](docs/web/features/grafo-relaciones-caso.md).
- [ ] Fotos reales de personas + logos institucionales: en pausa hasta consulta legal. No tocar modelado ni cosecha antes de cerrar criterio editorial sobre derecho de imagen, licencias, desimputaciones y tratamiento de fotos de juicio/detención.

#### Bloque E - Higiene técnica pre-launch `[x]`

Objetivo: que el sitio se pueda desplegar y compartir sin parecer un prototipo roto.

- [x] Favicon multi-tamaño.
- [x] Página 404.
- [x] Meta tags por página, OG y Twitter Card.
- [x] `sitemap.xml`.
- [x] `robots.txt`.
- [x] Cloudflare Web Analytics condicionado a `CF_ANALYTICS_TOKEN`.

#### Bloque F - Estrategia de lanzamiento

El plan de comunicación detallado vive fuera de git por confidencialidad de timing. Aquí sólo quedan pre-requisitos públicos.

Riesgo a evitar: parecer campaña coordinada. Por eso el plan propone lanzamiento blando, espera corta y outreach gradual.

- [ ] Lanzamiento blando: deploy + dominio activo + posteo discreto personal.
- [ ] Esperar 48-72h para cazar errores tontos.
- [ ] Lanzamiento real con mensaje canónico.
- [ ] Outreach a periodistas de corrupción.
- [ ] Evaluar HN / Reddit técnicos si las fases anteriores transcurren sin polémica.

---

## Fase 2 y casos

Esta sección conserva el contexto mínimo por caso para saber qué tipo de trabajo tiene sentido sin abrir todos los `NOTES.md`.

- [x] **Plus Ultra**: PR1 + PR2 + primarios retrospectivos. Caso de préstamo FASEE a Plus Ultra y auto Calama 19-may-2026. Pendiente: auto íntegro Calama si aparece en CENDOJ o fuente oficial; no sobredimensionar hechos finos hasta tener primario.
- [x] **Begoña Gómez**: PR1 + PR2 + PR3 + vínculos institucionales iniciales. Caso vivo con muchos primarios no públicos; patrón fuerte de `investigado -> desimputado`. Pendientes: autos JI 41/AP Madrid, hallazgos de cobertura, Francisco Martín Aguirre si se confirma modelado, software >500.000 euros.
- [x] **González Amador**: PR1 + PR2 + PR3 + BOE primarios. Incluye fraude fiscal, pieza Quirón, Maxwell Cremona como persona jurídica y conexión con FGE. Pendientes: auto AP Madrid 7-nov, informe UCO cuando se entregue, conexiones adicionales con Quirón/FGE.
- [x] **Fiscal General del Estado**: PR1 + PR2 + PR3. Primer caso con sentencia firme y primarios descargados completos; sirve como estándar para hechos `acreditado`, citas literales y roles `condenado_no_firme`/`condenado_firme`.
- [x] **Kitchen**: PR1 + PR2. Caso raíz autónomo de la pieza Kitchen, con cadena triple `investigado -> desimputado -> investigado` tras revocación. Pendientes: otros agentes procesados, apertura de juicio oral, URLs N4 específicas para archivado.
- [x] **Lezo**: PR1 a PR7. Caso multi-pieza con Golf, Inassa, Emissao, Navalcarnero, archivo Ruiz-Gallardón y ático Estepona como caso conexo. Pendientes: sentencia pieza Inassa si aparece, señalamiento Navalcarnero, procesados/desimputados menores.
- [ ] Koldo y Cerdan: reservar para cuando el maintainer decida que toca ampliar la oleada.

---

## Trabajo paralelizable

Usar worktrees aislados y la skill `multi-agent-orchestration` si hay sesiones simultáneas.

- [x] **UI de vínculos institucionales**: consumir `content/vinculos/` e integrar relaciones en personas/organizaciones implicadas sin ranking de bandos. Coordinar con grafo.
- [x] **Explorador de Conexiones `/grafo`**: página global full-screen, modo inventario completo, foco prefiltrado desde fichas de caso/persona/organización, profundidad configurable y equivalente textual activable. Entregado 2026-05-26.
- [x] **Clasificación editorial de medios + barra en cobertura general**: schema, canon, paleta, badges, barra en /casos, columna en /organizaciones. Entregado 2026-05-26 (tarde). Falta sólo poblar `percibida` y `grupo_editorial` (ver Bloque D).
- [x] **Resumen "instituciones alcanzadas" en ficha de caso**: vista agregada de vínculos `*_en_caso` + columna derivada en /casos con `RolBadge` y prioridad investigada → perjudicada → acusación. Entregado 2026-05-26 (tarde) durante el sprint de mejoras de listados.
- [x] **Cobertura mediática general**: convertir el corpus `content/cobertura-mediatica/begona-gomez.yaml` en patrón reutilizable, deduplicación y UI inicial.
- [ ] **Revisión editorial humana asistida**: preparar checklist de Bloque C para que el maintainer revise hero, `/sobre`, `/aviso-legal`, README y resúmenes.

Orden recomendado si hay varios agentes: primero composición/vínculos, después grafo y cobertura UI. Evitar que dos sesiones toquen a la vez `schemas/caso.schema.json`, `content/casos/*/caso.yaml` o `global.css`.

---

## Ideas propuestas sin decisión

- *(vacía a 2026-05-25)*. Las ideas previas se promovieron a Bloque D y se separaron en fichas propias: vínculos institucionales, grafo, composición de fuentes, cobertura mediática general y síntesis de caso.

---

## Decisiones pendientes del maintainer

- [x] **Clasificación editorial de medios.** Cerrada 2026-05-26: tres dimensiones (declarada/percibida/grupo) + naturaleza editorial separada del eje + enum 7+1. Canon en [`docs/diseno/07-clasificacion-editorial-medios.md`](docs/diseno/07-clasificacion-editorial-medios.md).
- [ ] **Vista agregada de instituciones alcanzadas por caso** + derivación a columna en /casos. Modelo cubierto; falta diseño UI y criterio de agrupación (mi voto: derivación automática desde `VinculoInstitucional` con override opcional vía `Caso.organizacion_principal_id`).
- [ ] **Posible nuevo campo `Organizacion.afiliacion_politica`** para soporte de columna en /organizaciones. No decidido aún (replicaría el patrón de medios: declarada + percibida con cita externa). Apuntado 2026-05-26 por feedback del maintainer.
- Cerrar criterio legal antes de usar fotos reales de personas o logos con licencia/crédito.
- Elegir el siguiente bloque de trabajo: revisión editorial humana, UI del bloque editorial recién cerrado, mejoras de listados o publicación técnica en Cloudflare Pages.
- Decidir cuándo se activa el deploy público y cuándo se anuncia.

---

## Aprendizajes activos recientes

Sólo se quedan aquí los aprendizajes que probablemente afecten a las próximas sesiones. El histórico largo vive en [`docs/roadmap/aprendizajes.md`](docs/roadmap/aprendizajes.md).

- **Roadmap operativo acotado**: `ROADMAP.md` debe mantenerse en torno a 150-220 líneas. Si una entrada de cierre necesita mucho detalle, va a `docs/roadmap/historial-YYYY-MM.md` y aquí queda un resumen.
- **No usar signo de sección ni glyphs decorativos hermanos**. La convención vigente está en [`AGENTS.md`](AGENTS.md), apartado "Convención de referencias y citas".
- **Vínculos institucionales no equivalen a ideología afectada**. El modelo debe documentar cargos, nombramientos, relaciones formales y vínculos públicos relevantes, no inferir bandos.
- **Estado de ficha habla de completitud editorial, no de estado judicial**. La UI debe evitar que un lector confunda "pendiente/parcial/completo" con culpabilidad o fase procesal.
- **Subagentes paralelos deben validar CWD y worktree antes de escribir**. El incidente de `cobertura-bg` confirmó que no basta con lanzar el agente: debe comprobar su directorio real de trabajo.
- **No hacer `git add` ni `git commit` durante la sesión** salvo cierre explícito. La contaminación del index global ya está resuelta por norma, no por memoria.
- **Pagefind requiere build previo**. `/buscar` funciona en `pnpm preview` o producción, no en `pnpm dev` salvo fallback.
- **Las fichas `docs/web/pages/` y `docs/web/features/` descargan el roadmap**. Ideas futuras específicas deben vivir ahí, no en este fichero.
- **`ClientRouter` retirado el 2026-05-26.** La navegación vuelve a recarga completa del documento; corrige el bug de botón atrás (URL cambiaba sin actualizar contenido). Los listeners delegados en `BaseLayout.astro` se mantienen por idempotencia, no por swaps SPA.
- **Enlaces de documento centralizados en `src/lib/documentos.ts`.** Prioridad: `ruta_local` → `url_canonica` → `url_archivo` → ancla de biblioteca. Aplica a `DocumentoCard`, `/biblioteca`, hitos, hechos y `SourceLinkBadge`.
- **No aplicar `display: flex` directamente a `<td>`.** Rompe `border-collapse` y desalinea separadores horizontales en tablas `.tbl`; el layout va en un `<div>` interno (precedente: columna Enlaces de `/biblioteca`).
- **Ritmo de fichas con `gap`, no márgenes entre secciones.** Los `.sec-h` sueltos en `<main>` no colapsan con cajas con borde ni con wrappers TOC solo-JS. Patrón canónico: `.ficha-detail` + `FichaTocSection` (servidor); el wrap JS de `BaseLayout` queda para páginas largas sin ficha (`/cifras`, `/sobre`).
- **Clasificación editorial de medios: tres dimensiones, naturaleza separada.** Canon en doc 07. Lo que NO hacemos: medir "sesgo" o "veracidad" en UI, etiquetas peyorativas, aceptar "independiente" como clasificación, promediar declarada y percibida en un valor sintético. Lo que SÍ: cita literal + URL verificada en cada valor, mismo enum para declarada y percibida (comparables), franjas separadas para verificación / servicio público / especializados. `sin_clasificar` es legal y frecuente.
- **Paleta del eje editorial: ámbar izquierda / azul derecha**, conscientemente invertida respecto a la convención USA y no idéntica a la convención partidista española estricta. Tokens centralizados en `global.css` (`--color-eje-*-bg/fg/outline`). `OrientacionBadge` rectangular con fondo (no pill outlined) tras iteración. Paleta v2 (2026-05-26 tarde) tiene mayor contraste entre grados y lados.
- **`partidos_afectados` es declaración explícita, no derivación.** Aunque el modelo `VinculoInstitucional` tiene cargo orgánico de partido, ese vínculo NO infiere automáticamente que el caso "afecta" al partido. La declaración es del editor, con `tipo_afectacion` (enum cerrado de seis valores) y `justificacion` neutra obligatoria.
- **No verificar UI con preview cuando el maintainer está mirando en directo.** El hook que se dispara tras cada Edit pide verificar; en sesión interactiva eso entorpece el ritmo. Reservar `preview_*` para cierre de sprint y sesiones autónomas. Memoria personal del agente lo recoge.
- **CIS 3421 es hoy la única fuente externa solvente para `orientacion_editorial_percibida`.** Reuters Institute Digital News Report 2025 no contiene escala izquierda-derecha por medio. Pew/Political Watch 2021/paper UN-Twitter 2022 no son accesibles (app caída, 403 en repositorios). El estudio CIS de audiencias (sep-oct 2023, N=27.433) cubre los 11 medios más leídos en escala 1-10. Tras CIS solo entran medios nuevos si aparece fuente cruzable; `sin_clasificar` es legal y frecuente.
- **Skill `/documentar-vinculos` es modal desde v2 (caso · persona · organización).** v1 solo cubría vínculos que rozan a un caso, lo que dejaba huecos obvios en el grafo global (Ayuso→PP, Sánchez→PSOE no modelados). v2 escanea cruzadamente y crea vínculos con `relevancia_para_caso_ids: []` si no rozan ningún procedimiento del inventario. El schema no necesitó cambios: el campo array vacío ya estaba documentado como legal.
- **No inferir relaciones transitivas vía partido común.** Aunque Persona A y Persona B compartan militancia en X, NO se crea arista A↔B en el grafo a partir de eso. Cada vínculo persona→organización con su respaldo propio; el grafo deja al lector hacer la conexión cognitiva. Patrón confirmado en la primera pasada cruzada del 26-may.
- **Esqueletos rápidos arrastran errores de órgano/fase.** Crear 26 casos `pendiente` con un solo agente tipo "investigar y fichar" introdujo 6 desajustes de `organo_judicial_id` (causas con sentencia firme apuntando a juzgado de instrucción, recursos no resueltos, sentencias TS asignadas a AN). Política aprendida: tras lote masivo de esqueletos, lanzar siempre auditoría WebSearch específica de órgano/fase. Las `RelacionEntreCasos` también suelen quedar olvidadas (Gürtel↔Bárcenas, Tándem↔Kitchen) y requieren pasada explícita.
- **Documentos N1 huérfanos esperando vínculo son patrón legítimo.** Cuando un sub-agente crea un BOE/nota oficial pero el vínculo que debería referenciarlo aún no se puede crear (ej. ficha de Persona no existe), el documento queda en `content/documentos/` con `caso_principal_id` opcional y se "rescata" en una pasada posterior. Precedente 2026-05-26: `infobae-feijoo-presidente-pp-2022-04-02` creado por el agente B, rescatado por el agente de fichas de Persona. No es bug, es ciclo de cierre asíncrono.

---

## Cómo se mantiene este documento

1. **Al abrir el proyecto**, leer este fichero entero. Si hace falta contexto histórico, seguir los enlaces de `docs/roadmap/`.
2. **Al cerrar una sesión**, actualizar:
   - `ROADMAP.md` con el estado operativo y próximos pasos.
   - La ficha de feature o página correspondiente en `docs/web/`.
   - `docs/roadmap/historial-YYYY-MM.md` si el cierre necesita detalle largo.
3. **No duplicar contenido de `docs/diseno/`**. Aquí va el "qué" operativo; allí el "por qué" razonado.
4. **No convertir este fichero otra vez en diario completo**. Si una sección crece demasiado, moverla al histórico y dejar enlace.
5. **Si cambia una convención operativa**, actualizar también `AGENTS.md` o el doc canónico que corresponda.
