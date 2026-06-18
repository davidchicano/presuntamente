# Contenido considerado y no modelado

## Qué hace

Sección pública de la ficha de caso que documenta lo que el sitio revisó y **decidió no modelar** (referencias indirectas de documentos de la causa que la prensa identifica con personas concretas; relaciones entre casos evaluadas y descartadas), con la regla aplicada, las fuentes y la fecha de revisión de cada decisión.

## Para qué sirve

Antes, estas decisiones vivían sólo en los `NOTES.md` internos: el lector veía el hueco ("¿por qué no aparece X?") y lo rellenaba con su sesgo — "ocultan" o "respetan" según afinidad. La sección publica el trabajo editorial: enseña lo que circula sobre el sumario sin afirmarlo, y le da al lector las piezas para valorarlo por sí mismo. Origen: propuesta externa (issue #3), aceptada por el maintainer el 2026-06-12 con condiciones que cambian la ejecución (prosa, no tabla).

## Cómo funciona

- **Dato**: campo `contenido_no_modelado` en `caso.yaml` — lista de ítems `{id, texto, fecha_revision, fuentes[]}`; `fuentes[]` = `{medio_id, titular, fecha, url, url_archivo?}`. Schema: [`schemas/caso.schema.json`](../../../schemas/caso.schema.json) (descripción del campo = resumen de la regla en el punto de uso) + bloque zod en [`src/content.config.ts`](../../../src/content.config.ts).
- **Render**: sección 7 de [`PgCasoDetalle.astro`](../../../src/components/pages/PgCasoDetalle.astro) (`id="no-modelado"`), tras los Hechos y sólo si hay ítems. `Aclaracion` fija + bloque por ítem (prosa `RichProse`, lista de fuentes con medio enlazado a su ficha, línea de `fecha_revision`).
- **Guardarraíl de enlace** (condición 4 de P-11): en esta sección `RichProse` recibe `excludePersonaIds` = todas las personas del inventario **menos** las que tienen `RolEnCaso` en este caso. Una persona nombrada sin rol (aunque exista como entidad por otro caso, p. ej. `pedro-sanchez` por contexto de Begoña Gómez) queda como texto plano: sin link, sin nodo. La validación **V-27** prohíbe además usar el escape hatch manual `[[persona:...]]` dentro de `contenido_no_modelado.texto`.
- **API**: el campo fluye al detalle `/api/v1/casos/<slug>.json` por el passthrough con denylist de [`src/lib/api.ts`](../../../src/lib/api.ts) (decisión: se incluye — la prosa lleva las negaciones pegadas, cualquier cita la arrastra).
- **Canon de la regla**: [doc 02 — "2.13 Contenido considerado y no modelado"](../../diseno/02-ficha-de-caso.md#213-contenido-considerado-y-no-modelado) (P-11, las 4 condiciones) y [doc 04 — "Menciones paraprocesales a cargos públicos"](../../diseno/04-riesgos-legales-y-eticos.md#41-menciones-paraprocesales-a-cargos-públicos) (análisis legal). Esta ficha no las duplica.

## Estado actual

- 2026-06-12 — Feature entregada con piloto en `leire-diez` (3 ítems: referencias "el one"/"P.S."/"el presidente" en informes UCO y agendas; mención a Mercedes González; relación con FGE descartada). Fuentes verificadas (titular/fecha/autor vía fetch) de 4 medios y 3 líneas editoriales. Detalle del piloto en el `NOTES.md` del caso.

## Decisiones editoriales y aprendizajes

- **Prosa, no tabla.** La propuesta original (issue #3) pedía una tabla «referencia → persona → cobertura»; se rechazó ese formato: la rejilla hace que el sitio firme la identificación. El porqué completo vive en el canon (doc 02 §2.13); el aprendizaje operativo es que el formato ES la decisión editorial, no un detalle de render.
- **El cruce de líneas se demuestra en el dato.** `fuentes[]` con `medio_id` obliga a que la condición 3 sea auditable mirando el YAML, sin confiar en la prosa.
- **La exclusión de enlaces tenía que ser mecánica.** Una lista manual de "personas a no enlazar" por ítem habría creado justo el dato estructurado persona↔caso que la condición 4 prohíbe. La fórmula "todas menos las con rol en este caso" resuelve los auto-enlaces sin datos nuevos; V-27 cierra el bypass de enlaces manuales.

## Ideas futuras

- Ancla por ítem (`#no-modelado-<id>`) ya existe; valorar enlazarlas desde `/conexiones` cuando una relación descartada involucre dos casos visibles (mostrando el porqué del no-nexo en el grafo).
- Contador en el flip de la masthead ("Sobre la ficha") cuando el caso tenga ítems.

## Pendientes operativos

- [ ] `archivar-n4.mjs` no lee `contenido_no_modelado[].fuentes[]`: extender el script para que `pnpm archive:catchup` capture también estas URLs y rellene `url_archivo` (hoy 6 piezas sin archivar en `leire-diez`).
- [ ] Añadir el chequeo de P-11 al checklist de la skill `/revisar-caso` (verbos de conducta, cruce de líneas, negaciones pegadas al nombre) la próxima vez que se use.
- [ ] Catalán pendiente como el resto de `PgCasoDetalle` (`// TODO i18n`).
