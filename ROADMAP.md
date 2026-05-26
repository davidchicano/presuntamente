# Roadmap operativo de presuntamente

> **Estado vivo del proyecto.** Este sigue siendo el primer fichero que cualquier persona o agente debe leer al empezar a trabajar, y el último que debe actualizar al cerrar una sesión.
>
> El roadmap conceptual vive en [`docs/diseno/06-roadmap-por-fases.md`](docs/diseno/06-roadmap-por-fases.md). Este fichero es la versión operativa: estado actual, próximos pasos, backlog inmediato y aprendizajes recientes. El histórico largo se ha movido a [`docs/roadmap/`](docs/roadmap/README.md).

**Última actualización:** 2026-05-26. **Ritmo vertical unificado en fichas** (caso, persona, organización, delito): componente `FichaTocSection.astro` con `data-toc-section` en HTML servido; contenedor `.ficha-detail` con `flex` + `gap`; `.entity-mast` compartido en `global.css` (grid 64px, delito sin avatar en columna única); estilos locales duplicados retirados de las tres Pg* de entidad; `PgCasoDetalle` migrado al mismo patrón.

**Último hito de producto:** layout de fichas alineado entre tipos de entidad (2026-05-26). Caso piloto sigue siendo `begona-gomez`. `pnpm build` verde (170 páginas Pagefind).

**Anterior inmediato:** cierre sesión UI Bloque D (2026-05-26): primer render visible de vínculos institucionales y cobertura mediática general en `PgCasoDetalle`, Persona y Organización. 16 vínculos + 29 piezas de cobertura en `begona-gomez`.

**Anterior inmediato:** Bloque E pre-launch completado: favicon multi-tamaño, 404 con chrome ministerial, sitemap, robots, Cloudflare Web Analytics condicionado a `CF_ANALYTICS_TOKEN`, fichas [`docs/web/features/higiene-tecnica.md`](docs/web/features/higiene-tecnica.md) y [`docs/web/pages/404.md`](docs/web/pages/404.md). Build verde 168 páginas.

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
- **Bloque D**: parcialmente entregado. Cerrados `/cifras`, OG images, RSS/Atom, timeline visual, estado de ficha, síntesis de caso, vínculos institucionales (datos + UI) y cobertura mediática general (corpus + UI). Quedan grafo y composición de fuentes citadas.
- **Próximo paso comprometido**: lo decide el maintainer. Opciones naturales: Bloque C (revisión editorial humana pre-launch), continuar Bloque D, o publicación técnica en Cloudflare Pages sin DNS apex.
- **Dev server local**: `pnpm dev` en `http://localhost:4321`.
- **Workflow git**: trabajo directo sobre `main`, sin ramas ni PRs mientras dure el MVP. No hacer `git add`, `git commit` ni `git push` salvo petición explícita del maintainer. Ver [`AGENTS.md`](AGENTS.md).
- **Infraestructura pública**: dominio `presuntamente.org` comprado, `contacto@`, `rectificacion@` y `aportar@` operativos vía Cloudflare Email Routing. Sitio aún sin publicar: DNS apex no apuntado y Pages pendiente.

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
- [ ] Conectar Cloudflare Pages al repo `davidchicano/presuntamente`. Build command `pnpm build`, output `dist/`, Node 24. Primero URL `*.pages.dev`, sin DNS apex.
- [ ] Revisar el aviso legal con abogado especializado. Repaso especial: LSSI, datos personales/RGPD, licencias y límites de responsabilidad.
- [ ] Activar DNS apex + `www` cuando lo anterior esté cerrado.

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
- [ ] **Barra proporcional por corriente editorial en cobertura mediática general** (v1.x). Prerrequisito: ampliar modelado de `Organizacion` (`tipo: medio_comunicacion`) con clasificación documentada — hoy sólo existe `linea_editorial_declarada` (cita literal) y casi no está poblada. Sin enum + metodología + `sin_clasificar` obligatorio no hay gráfico fiable. Actualizar skill `/rastrear-cobertura`, ficha de feature y UI juntos. Copy público: composición de la muestra rastreada, no "sesgo" ni veracidad. Análisis en ficha de cobertura y en [`composicion-fuentes-citadas.md`](docs/web/features/composicion-fuentes-citadas.md) (feature hermana: mide N4 citadas por el inventario, no el corpus rastreado).
- [ ] **Vista agregada "instituciones alcanzadas" en ficha de caso** (v1.x). El modelo ya cubre acusación popular, perjudicado institucional, ente investigado y nombramientos (`VinculoInstitucional`); en `begona-gomez` ya hay datos (p. ej. UCM perjudicada, acusaciones populares). Falta bloque resumen de a quién "le salpica" el caso (administración, partido, organismo…) sin reducirlo a etiqueta partidista. Detalle en [`vinculos-institucionales.md`](docs/web/features/vinculos-institucionales.md).
- [ ] Grafo de relaciones por caso. Detalle en [`docs/web/features/grafo-relaciones-caso.md`](docs/web/features/grafo-relaciones-caso.md). Grafo local por caso, no grafo global todavía; siempre con alternativa textual.
- [ ] Composición de fuentes periodísticas citadas. Detalle en [`docs/web/features/composicion-fuentes-citadas.md`](docs/web/features/composicion-fuentes-citadas.md). Mide las N4 usadas por presuntamente.org, no "la cobertura total de internet". Comparte con cobertura mediática general el prerrequisito `Organizacion.orientacion_editorial` para medios.
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
- [ ] **Grafo por caso**: prototipo visual + equivalente textual. Puede empezar con vínculos y relaciones existentes, pero no debe bloquear la ficha si faltan datos.
- [ ] **Clasificación editorial de medios + barra en cobertura general**: extender schema `Organizacion`, poblar medios del inventario, cerrar metodología y entonces UI + copy en cobertura (y composición N4 citadas).
- [ ] **Resumen "instituciones alcanzadas" en ficha de caso**: agregar vista agregada de vínculos `*_en_caso` y nombramientos; datos piloto ya en `begona-gomez`.
- [x] **Cobertura mediática general**: convertir el corpus `content/cobertura-mediatica/begona-gomez.yaml` en patrón reutilizable, deduplicación y UI inicial.
- [ ] **Revisión editorial humana asistida**: preparar checklist de Bloque C para que el maintainer revise hero, `/sobre`, `/aviso-legal`, README y resúmenes.

Orden recomendado si hay varios agentes: primero composición/vínculos, después grafo y cobertura UI. Evitar que dos sesiones toquen a la vez `schemas/caso.schema.json`, `content/casos/*/caso.yaml` o `global.css`.

---

## Ideas propuestas sin decisión

- *(vacía a 2026-05-25)*. Las ideas previas se promovieron a Bloque D y se separaron en fichas propias: vínculos institucionales, grafo, composición de fuentes, cobertura mediática general y síntesis de caso.

---

## Decisiones pendientes del maintainer

- [ ] **Clasificación editorial de medios (`Organizacion.orientacion_editorial`).** Decidir enum (corrientes editoriales gruesas vs afinidad vs propiedad/grupo — son dimensiones distintas), fuente/metodología por valor, obligatoriedad de `sin_clasificar` y copy público ("composición de la muestra", no "sesgo"). Bloquea barra horizontal en cobertura mediática general y composición de fuentes citadas.
- [ ] **Vista agregada de instituciones alcanzadas por caso** (acusación/perjudicado/nombramientos). Modelo y skill ya lo contemplan; falta diseño UI y criterio de agrupación.
- Cerrar criterio legal antes de usar fotos reales de personas o logos con licencia/crédito.
- Elegir el siguiente bloque de trabajo: revisión editorial humana, continuar Bloque D (grafo · composición N4 · barra editorial cobertura · resumen institucional) o publicación técnica en Cloudflare Pages.
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
