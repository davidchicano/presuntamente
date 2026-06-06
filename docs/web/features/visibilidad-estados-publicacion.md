# Visibilidad pública por estado de publicación

## Qué hace

Garantiza que en el sitio **público (build de producción)** sólo se exponga el inventario en un estado publicado (`beta_publica` · `en_revision` · `publicado`). Los casos en `pendiente` / `borrador` —y todo lo que cuelga de ellos— no asoman por **ningún** vector: ni página de caso, ni listado, ni fichas de persona/organización, ni feed, ni OG images, ni `/cifras`, ni `/delitos`, ni el grafo `/conexiones`, ni los enlaces que `RichProse` genera en la prosa.

En **desarrollo local** (`import.meta.env.DEV`) se muestra todo, para que el maintainer pueda iterar sobre fichas en construcción.

## Para qué sirve

Principios irrenunciables #1 (imputación ≠ condena) y #5 (no exposición innecesaria): un caso en `borrador` aún no ha pasado el panel de promoción ([`/promover-caso`](../../../.agents/skills/promover-caso/SKILL.md)) y puede tener roles, anonimizaciones o calificaciones pendientes de decisión humana. Publicar por la puerta de atrás la ficha de una persona con su rol y delitos atribuidos en un caso no publicado vulneraría esos principios.

## Cómo funciona

Canon centralizado en [`src/lib/visibilidad.ts`](../../../src/lib/visibilidad.ts):

- `ESTADOS_CASO_VISIBLES` — los tres estados publicados.
- `casoVisibleAqui(estado)` — `dev` → siempre; `prod` → sólo publicados. Misma semántica que `src/pages/casos/[slug].astro`.
- `idsCasosVisibles(casos)` — set de ids de caso visibles en el entorno.
- `entidadesEnCasosVisibles({casos, roles, hechos, hitos, vinculos, documentos})` — personas y organizaciones que aparecen en al menos un caso visible por cualquiera de las vías por las que una ficha publicada las enlaza (rol, órgano/querellante, hechos, hitos, vínculo relevante, producción documental). Es el conjunto de "entidades con página generada"; se usa tanto para **generar rutas** como para **filtrar enlaces** y así no dejar nunca un enlace a una página inexistente.

Dos capas:

1. **Generación de rutas** (`pages/personas/[slug].astro`, `pages/organizaciones/[slug].astro`, `pages/og/{casos,personas,organizaciones}/[slug].png.ts`): en prod sólo se generan rutas de entidades ligadas a un caso visible.
2. **Filtrado de contenido y enlaces** en cada vector: fichas de detalle (roles, "casos donde aparece", cifras, vínculos), índices `/personas` `/organizaciones` `/delitos`, `/cifras` y la home (alcance visible para las cifras), `/casos` (filas bloqueadas fuera del listado en prod), feed ([`lib/feed.ts`](../../../src/lib/feed.ts)), grafo ([`lib/conexiones.ts`](../../../src/lib/conexiones.ts)) y auto-enlaces de [`RichProse`](../../../src/components/RichProse.astro).

**Retractación a nivel de `Hecho` (no de caso).** Las dos capas anteriores operan sobre la visibilidad del **caso**. Dentro de un caso visible, un `Hecho` retractado —`vigencia: retirado` o `estado_publicacion: retirado_*`— tampoco debe asomar: [`PgCasoDetalle.astro`](../../../src/components/pages/PgCasoDetalle.astro) lo excluye al construir la lista de hechos, con el **mismo criterio que la API** ([doc API — "D12"](../../api/decisiones.md#d12--decisiones-de-implementación-junio-2026)). Los `vigencia: superado` (histórico corregido por un `Hecho` posterior vía `corregido_por`) **sí** se conservan: son trayectoria, no retractación (principio #6 "conserva el histórico").

Verificación de no-fuga: build de producción + barrido de `dist/` (0 referencias —en cualquier formato— a slugs de casos/entidades no generados) + 0 enlaces internos colgantes.

## Estado actual

- **2026-06-02 — entregado.** Antes del push de la tanda de 12 casos en borrador se detectó que el gate de borradores sólo cubría la página de caso, la home, `/casos`, `/graficas` y `/conexiones`; las fichas de persona/organización, el feed, los índices, `/cifras`, `/delitos`, las OG y los auto-enlaces de `RichProse` exponían contenido de casos en borrador (rol + delitos + bio + cifras + hitos recientes). Cerrado extendiendo el gate a todos los vectores con el helper central. Build prod: 8 casos, 90 personas, 82 organizaciones; `dist/` sin fugas ni enlaces colgantes; `validate` 1359 OK.
- **2026-06-04 — retractación a nivel de `Hecho` (coherencia web↔API).** `PgCasoDetalle` no filtraba los hechos por estado/vigencia (los renderizaba todos), incoherencia que [D12](../../api/decisiones.md#d12--decisiones-de-implementación-junio-2026) había dejado anotada como follow-up. Resuelto: excluye `vigencia: retirado` / `estado_publicacion: retirado_*`, conserva `superado`. Borrado además el único hecho retractado del repo (placeholder obsoleto de `tarjetas-black`, que filtraba el texto interno «Fichero obsoleto…» a la ficha y a `/graficas`). Verificado: `grep 'Fichero obsoleto' dist/` = 0; el hecho canónico y los `superado` siguen.

## Decisiones editoriales y aprendizajes

- **`dev` muestra todo, `prod` sólo publicados.** El maintainer necesita ver los borradores en local; el público no.
- **`/cifras` y las cifras de la home cuentan sólo el inventario visible** (decisión del maintainer 2026-06-02). Los catálogos de referencia (delitos, glosario) se cuentan completos: son tipos penales y términos, no contenido de un caso.
- **`/casos` ya no muestra filas grises "en preparación" en prod.** Esas filas exponían nombre + síntesis + organizaciones afectadas del borrador. Se decidió excluirlas del listado público (en dev siguen visibles y clickables). **En su lugar**, el pie del catálogo lista los **nombres** de las fichas en preparación (estado `borrador`) como texto plano —sin enlace, sin síntesis, sin afectados ni rol— para conservar la señal de transparencia ("estos casos están en marcha") que pidió el maintainer, sin exponer contenido del borrador.
- **Los nombres en prosa no se borran, se des-enlazan.** Una entidad sin página pública mencionada en un texto editorial publicado se renderiza como texto plano (no como enlace muerto).

## Ideas futuras

- Si se añade un estado intermedio (p. ej. `beta_privada`), ampliar `ESTADOS_CASO_VISIBLES` y revisar los call-sites.
- El listado "en preparación" del pie de `/casos` hoy cubre sólo `borrador` (en desarrollo activo). Valorar si añadir también los `pendiente` (en cola) o dejarlos en la lista de candidatos de GitHub.

## Pendientes operativos

- **El filtro de retractación a nivel de `Hecho` vive sólo en [`PgCasoDetalle.astro`](../../../src/components/pages/PgCasoDetalle.astro).** Hoy es inocuo (tras borrar el placeholder de `tarjetas-black` no queda ningún `Hecho` retractado en el repo), pero las demás vistas que cargan `getCollection('hechos')` —`/graficas`, `/cifras`, fichas de persona/organización, home, feed…— **no** lo aplican. Si en el futuro se retracta un `Hecho` de un caso visible, sólo la ficha de caso lo ocultaría. **Mejora propuesta:** extraer un helper central (equivalente a `noRetirado` de [`src/lib/api.ts`](../../../src/lib/api.ts)) a [`src/lib/visibilidad.ts`](../../../src/lib/visibilidad.ts) y aplicarlo en todos los call-sites que rendericen hechos. Mientras tanto, el barrido de `dist/` debe incluir el enunciado de cualquier `Hecho` marcado retractado.
- El guardarraíl general sigue siendo el barrido de `dist/` descrito arriba; conviene re-ejecutarlo si se añade un vector nuevo que cargue la colección `casos` o `hechos`.
