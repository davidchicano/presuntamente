# Vínculos institucionales documentados

> Archivos clave: [`schemas/vinculo-institucional.schema.json`](../../../schemas/vinculo-institucional.schema.json) · [`src/content.config.ts`](../../../src/content.config.ts) (collection `vinculos`) · [`.agents/skills/documentar-vinculos/SKILL.md`](../../../.agents/skills/documentar-vinculos/SKILL.md) · [`SourceLinkBadge.astro`](../../../src/components/SourceLinkBadge.astro) · [`src/lib/documentos.ts`](../../../src/lib/documentos.ts) · directorio `content/vinculos/` (primer corpus: `begona-gomez`). · Relacionada con [`grafo-relaciones-caso.md`](grafo-relaciones-caso.md).

## Qué hace

Modela y muestra los vínculos formales documentados entre personas, organizaciones, partidos, administraciones, empresas públicas, órganos judiciales y casos. La entidad nueva `VinculoInstitucional` cubre lo que `RolEnCaso` no cubre: el contexto institucional alrededor del procedimiento (cargos públicos, designaciones por gobierno concreto, cargos orgánicos en partido, dirección de empresas privadas relevantes para el hecho, vínculos económicos/familiares/profesionales documentados).

## Para qué sirve

Permite que un lector entienda rápidamente a qué entorno institucional alcanza un caso sin convertir la ficha en una etiqueta partidista. Es especialmente útil cuando el nombre mediático no explica nada o cuando la relación no es procesal directa pero es contextualmente decisiva (ej. "este caso afecta al gobierno X porque el alto cargo procesado fue nombrado por ese gobierno", documentado en BOE).

## Cómo funciona

### Modelo

Entidad nueva `VinculoInstitucional` con schema en [`schemas/vinculo-institucional.schema.json`](../../../schemas/vinculo-institucional.schema.json):

- **Sujeto**: exactamente uno de `sujeto_persona_id` o `sujeto_organizacion_id` (validado con `oneOf`).
- **Objeto**: por defecto `objeto_organizacion_id`; `objeto_persona_id` sólo permitido si `naturaleza == vinculo_familiar_publico`.
- **Naturaleza**: enum cerrado de 15 valores cubriendo cargo público electo/designado/judicial, cargo orgánico de partido, directivos públicos/privados, académico público, organización cívica, nombramiento por gobierno concreto, los tres roles institucionales en caso (acusación, perjudicado, entidad investigada como persona jurídica), y los tres tipos de vínculo no procesal documentado (familiar público, económico, profesional).
- **Documentos de respaldo**: array con `minItems: 1` (mismo principio V-13). Cada respaldo lleva `documento_id` + `pasaje` opcional + `nota` opcional.
- **Fechas**: `desde` obligatorio, `hasta` opcional (ausente → vigente). Precisión declarable por separado (`dia`/`mes`/`anio`) para evitar fingir precisión.
- **`gobierno_o_legislatura`**: obligatorio cuando `naturaleza in [nombramiento_por_gobierno, cargo_publico_designado]` para anclar la responsabilidad política al gobierno concreto.
- **`notas`**: obligatorio cuando `naturaleza in [vinculo_familiar_publico, vinculo_economico_documentado, vinculo_profesional_documentado]` para justificar relevancia editorial y evitar inflación.
- **`relevancia_para_caso_ids[]`**: casos del inventario para los que el vínculo es relevante. Vacío significa "vínculo documentado pero no aún anclado a un caso" y es legal por defecto del schema. Cubre vínculos que pertenecen a la red institucional pública aunque no toquen todavía ningún procedimiento del inventario (ej. militancia activa de una figura pública en su partido, dirección de una empresa pública). La skill `/documentar-vinculos` modo persona/organización los crea sistemáticamente.

### Storage

`content/vinculos/<id>.yaml` con id slug `<sujeto-slug>-<objeto-slug>` o `<sujeto-slug>-<naturaleza-corta>`. Colección global (no anidada en `content/casos/`) porque un vínculo puede ser relevante para varios casos (un cargo orgánico en partido alimenta varios casos sin duplicar).

### Skill productora

[`/documentar-vinculos <slug>`](../../../.agents/skills/documentar-vinculos/SKILL.md) v2 — modal según el tipo del slug:

- **Modo caso** (original) — `/documentar-vinculos plus-ultra`. Recorre personas con rol y organizaciones implicadas del caso, propone vínculos con `relevancia_para_caso_ids` incluyendo el caso.
- **Modo persona** — `/documentar-vinculos isabel-diaz-ayuso`. Escanea todas las organizaciones del repo (partidos, administraciones, empresas, órganos) y propone vínculos persona→organización documentables (cargo público electo o designado, orgánico de partido, judicial, directivo, académico). `relevancia_para_caso_ids` queda vacío si el vínculo no roza ningún caso del inventario, o se rellena con los casos donde la persona aparezca.
- **Modo organización** — `/documentar-vinculos partido-popular`. Escanea todas las personas del repo y propone vínculos para sus dirigentes históricos, militantes con cargo orgánico o directivos cuyo cargo en esa organización esté públicamente documentado.

Pensada para correr en sub-agente paralelo en un git worktree dedicado, lanzada por el maintainer cuando quiera ampliar el contexto institucional de un caso, completar la red de relaciones de una figura pública recién modelada o cubrir el entorno de una organización. Las tres ramas comparten guardarraíles: exigen documento de respaldo (≥1), aplican P-09 (verbos prohibidos en `descripcion` y `notas`), minimizan vínculos familiares, exigen documentación en económicos/profesionales.

### Próximo paso

Una vez existan `VinculoInstitucional` poblados en al menos un caso piloto, el render en UI queda:

- Relaciones embebidas dentro de las propias cards de "Personas implicadas" y "Organizaciones implicadas" en la ficha de caso. No hay sección independiente de contexto institucional porque duplicaba contenido y añadía ruido.
- Vista compacta en ficha de Persona y de Organización con los vínculos en los que aparece la entidad, separada del rol procesal pero sin tabla pesada.
- Consumido también por [`grafo-relaciones-caso.md`](grafo-relaciones-caso.md) como fuente de aristas.

## Estado actual

**Schema canónico + collection en `content/vinculos/` + skill `/documentar-vinculos` v2** (modal: caso · persona · organización). UI integrada en ficha de caso (relaciones dentro de las cards de personas y organizaciones implicadas), Persona y Organización (lista compacta de vínculos donde la entidad aparece), bloque «Instituciones alcanzadas» en cabecera de caso y columna derivada en /casos.

**Corpus actual (2026-05-26 tarde):** 6 casos publicables con vínculos institucionales poblados — `begona-gomez` (16), `plus-ultra` (7), `kitchen` (7), `lezo` (5), `fiscal-general-del-estado` (5), `gonzalez-amador` (6). Faltan vínculos persona↔organización generales no atados a caso (militancia activa, dirigencia histórica, cargos académicos): la pasada en modo persona/organización con la skill v2 está pendiente de ejecutarse.

La biblioteca del caso incluye también los documentos que respaldan vínculos institucionales. En UI el tipo de vínculo se renderiza con [`SourceLinkBadge`](../../../src/components/SourceLinkBadge.astro): badge funcional distinto de los badges de estado/categoría (borde izquierdo acento + tipografía mono), con flecha de salida ↗ al final. El badge es clicable y abre el documento de respaldo vía [`documentoRespaldoHref`](../../../src/lib/documentos.ts) — copia local, URL canónica o archive.org, en ese orden; si ninguna existe, cae en ancla `#doc-<id>` de la biblioteca del caso o `/biblioteca#doc-<id>` en ficha de Persona/Organización.

En las cards de persona/organización del caso, las relaciones van separadas del bloque de roles por una línea divisoria, sin título redundante ni viñetas: el badge ya aporta el contexto institucional.

## Decisiones editoriales y aprendizajes

- **No usar "ideología afectada" como modelo canónico.** El encuadre correcto es **vínculo institucional documentado**. Sin documento, no entra.
- **No implica responsabilidad del partido u organización.** Que una persona tenga o haya tenido cargo en una organización no significa que la organización sea sujeto procesal ni responsable de sus actos.
- **Cargo público formal ≠ cargo orgánico de partido ≠ nombramiento por gobierno.** Tres `VinculoInstitucional` separados si las tres dimensiones existen para la misma persona. Esto permite distinguir "es alto cargo del BOE" de "fue nombrado por el gobierno X" — son dos hechos editoriales distintos.
- **El partido es una organización más, no un color.** Modelado en `Organizacion(tipo: partido_politico)`, sin colores ni iconos partidistas en UI. El badge de un vínculo en partido lleva el mismo lenguaje visual que un vínculo en empresa pública.
- **Administraciones y organismos públicos importan tanto como partidos.** Muchos casos alcanzan ministerios, comunidades autónomas, ayuntamientos, empresas públicas u órganos constitucionales sin que el partido sea sujeto procesal. El enum `naturaleza` cubre los tres carriles (electo, designado, judicial) y los nombramientos.
- **Vínculos familiares minimizados.** `vinculo_familiar_publico` exige: (a) que la persona vinculada también sea figura pública; (b) que la relación sea citada en cobertura cruzada; (c) que sea factualmente relevante para el hecho investigado. `notas` obligatoria. Sin uno de los tres, no entra.
- **Vínculos económicos sólo con documento.** "X es proveedor de Y" exige factura/contrato/registro mercantil/sentencia. Sin documento no entra. `notas` obligatoria.
- **Entidad nueva, no campos en `Persona`/`Organizacion`.** Razones documentadas en el plan de sesión 2026-05-25: (a) cubre 15 naturalezas, demasiado para un solo subtipo; (b) un vínculo puede cruzar varios casos sin duplicar; (c) mismo patrón que `RelacionEntreCasos`; (d) `documentos_respaldo[]` obligatorio se exige por defecto.
- **Naturalezas `*_en_caso`:** el enum incluye `acusacion_institucional_en_caso`, `perjudicado_institucional_en_caso` y `entidad_investigada_en_caso` para modelar quién actúa o resulta alcanzado institucionalmente sin confundirlo con imputación procesal directa. La skill `/documentar-vinculos` las recorre explícitamente al auditar organizaciones del caso. Precedente en `begona-gomez`: UCM como perjudicada, varias acusaciones populares (Manos Limpias, Vox, HazteOír…).
- **Vista agregada "instituciones alcanzadas" entregada el 2026-05-26 (tarde).** Bloque dentro de la sección «Estado procesal actual» de PgCasoDetalle con tres familias en cajas separadas (border-left por familia, fondo blanco): *Investigadas como persona jurídica*, *Perjudicadas institucionales*, *Acusación popular constituida*. Derivado automáticamente de `VinculoInstitucional` con `relevancia_para_caso_ids` incluyendo el caso. En el listado /casos se proyecta a una columna **«Organización afectada»** con prioridad investigada → perjudicada → acusación y `RolBadge` para el rol procesal equivalente.
- **Listado inverso "Personas relacionadas" en PgOrganizacionDetalle (2026-05-26 tarde).** Sección que lista personas con cargo o nombramiento documentado en la organización (`objeto_organizacion_id === org` + naturalezas de cargo). Hermana de la lista de vínculos de Persona, sin documentos para no duplicar — el detalle vive en «Relaciones institucionales documentadas».
- **Skill modal v2 (2026-05-26 tarde, post-sprint).** La v1 sólo cubría vínculos que rozan a un caso, lo que dejaba huecos en la red institucional global: personas con militancia evidente (Ayuso → PP, Sánchez → PSOE) sin vínculo modelado porque ningún caso lo había necesitado en su contexto procesal específico. v2 añade dos modalidades hermanas — modo persona (escaneo cruzado contra todas las organizaciones del repo) y modo organización (escaneo cruzado inverso contra todas las personas). Los vínculos así creados quedan con `relevancia_para_caso_ids: []` si no rozan ningún caso, lo cual es legal por defecto del schema. La motivación es alimentar el grafo global con la red institucional pública real, no sólo con la fracción que aparece en procedimientos del inventario.
- **Modelo intacto.** v2 no requiere cambios en el schema (el campo `relevancia_para_caso_ids[]` con default `[]` ya lo permitía). Sólo la skill ramifica el flujo. Misma exigencia de `documentos_respaldo` ≥ 1, mismo enum de `naturaleza`, mismos guardarraíles de presunción de inocencia y minimización.
- **No infiere relaciones transitivas.** Si Ayuso es presidenta de Madrid (PP) y un dirigente del PP estuvo en el gobierno de Madrid, NO se infiere relación entre ambas personas vía partido común. Sólo se documenta cada vínculo persona→organización con su respaldo propio. Esto evita ruido en el grafo y mantiene la trazabilidad documental persona-a-persona.

## Ideas futuras

### v1 pre-launch

- Nota metodológica pública en `/sobre` o `/cifras` cuando haya al menos dos casos poblados y se pueda explicar el patrón sin depender de un único ejemplo.
- Bloque resumen en ficha de caso: instituciones y actores institucionales alcanzados (acusación · perjudicado · ente investigado · nombramientos relevantes), agrupados por naturaleza y siempre con enlace al documento de respaldo.

### v1.x

- Vista por organización con todos los casos donde aparece por vínculo institucional.
- Vista por gobierno/legislatura (`gobierno_o_legislatura`) cruzando todos los nombramientos.
- Export de vínculos documentados.
- Integración con [`grafo-relaciones-caso.md`](grafo-relaciones-caso.md) como fuente de aristas.

### Sin compromiso

- Filtros agregados por tipo de administración: estatal, autonómica, local, empresa pública, partido, fundación, sindicato.
- Vista temporal: "vínculos vigentes en el momento del hecho X".

## Pendientes operativos

- [x] Decidir schema: entidad nueva vs campos en `Persona`/`Organizacion`. **Decisión 2026-05-25**: entidad nueva.
- [x] Definir enum de `naturaleza` del vínculo. **Decisión 2026-05-25**: 15 valores cerrados (revisar tras primera ronda real de poblado).
- [x] Definir requisito de fuente para cada vínculo. **Decisión 2026-05-25**: `documentos_respaldo[] minItems: 1` igual que `Hecho`.
- [x] Revisar riesgos RGPD para vínculos familiares o de pareja. **Decisión 2026-05-25**: `vinculo_familiar_publico` con tres condiciones obligatorias + `notas` obligatoria + minimización máxima (no datos de hijos menores, no domicilios, no detalles privados).
- [ ] Escribir nota metodológica pública en `/sobre` o `/cifras` cuando el corpus tenga masa suficiente para no parecer una nota ad hoc de un único caso.
- [x] Poblar el primer caso piloto con `/documentar-vinculos <slug>` lanzado en sub-agente paralelo. **Entregado 2026-05-25**: `begona-gomez`, 16 vínculos.
- [x] Diseñar el render en UI una vez exista corpus. **Entregado 2026-05-26**: relaciones embebidas en personas/organizaciones de la ficha de caso + vista compacta en Persona/Organización.
- [x] Diseñar bloque agregado "instituciones alcanzadas" en ficha de caso. **Entregado 2026-05-26 (tarde):** tres cajas (investigadas / perjudicadas / acusación popular) en cabecera de Estado procesal + columna derivada en /casos.
- [x] Diseñar listado inverso de Personas en PgOrganizacionDetalle. **Entregado 2026-05-26 (tarde):** nueva sección compacta con cargo + periodo + naturaleza.
- [x] Extender la skill `/documentar-vinculos` a modo persona y modo organización. **Entregado 2026-05-26 (tarde):** skill v2 modal. Sin cambios en schema (el modelo ya lo permitía vía `relevancia_para_caso_ids: []`).
- [ ] **Primera pasada en modo persona/organización** sobre figuras públicas del repo aún sin militancia / cargo orgánico modelado (Ayuso → PP, Sánchez → PSOE, Feijóo → PP, etc.). Lanzar sub-agente Sonnet con un listado de personas + organizaciones a recorrer. Output esperado: ~8-20 vínculos nuevos en `content/vinculos/` con `relevancia_para_caso_ids: []` o anclado a casos del repo donde la persona aparezca.
