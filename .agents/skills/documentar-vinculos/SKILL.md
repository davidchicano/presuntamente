---
name: documentar-vinculos
description: Documenta vínculos institucionales formales del inventario presuntamente.org como entidades `VinculoInstitucional` en `content/vinculos/<id>.yaml`. Skill **modal** según el tipo del slug recibido. (a) Modo caso — `/documentar-vinculos <caso>`: vínculos que rozan a un caso (cargos públicos, designaciones por gobierno, cargos orgánicos de partido, directivos, acusación/perjudicado/ente investigado, vínculos familiares/económicos/profesionales). (b) Modo persona — `/documentar-vinculos <persona>`: pasada cruzada que escanea todas las organizaciones del repo y propone vínculos documentables persona→organización aunque no rocen ningún caso (ej. militancia activa, cargos académicos públicos). (c) Modo organización — `/documentar-vinculos <organizacion>`: pasada cruzada inversa que escanea todas las personas del repo y propone vínculos para sus dirigentes históricos, militantes con cargo orgánico o directivos públicos. Las tres ramas exigen `documentos_respaldo[]` ≥ 1 y aplican presunción de inocencia + minimización. Trigger cuando el usuario pide "documenta los vínculos de <X>", "amplía el contexto institucional de <X>", "qué entornos tocan a <X>" o invoca `/documentar-vinculos <slug>` directamente. Pensada para correr en sub-agente paralelo a la sesión principal, en un git worktree dedicado.
---

# Skill `documentar-vinculos` — v2

## Propósito

Generar y mantener el corpus de **vínculos institucionales documentados** del inventario. Cubre el hueco entre lo que `RolEnCaso` modela (relación procesal directa entre persona/organización y caso) y el **contexto institucional pleno**: cargos públicos, designaciones por gobierno concreto, cargos orgánicos en partido, dirección de empresas/fundaciones relevantes, organizaciones que ejercen acusación popular o son perjudicadas institucionalmente, y vínculos familiares/económicos públicos relevantes.

A partir de v2, la skill no documenta sólo lo que roza un caso: documenta toda la red de vínculos institucionales formales del repo, anclada o no a procedimientos judiciales. Esto alimenta también el grafo de relaciones global y permite que personas u organizaciones aparezcan con su entorno institucional real (Ayuso → PP, Sánchez → PSOE, García-Castellón → CGPJ, etc.) aunque la militancia o el cargo no toquen directamente al caso modelado.

La feature canónica está descrita en [`docs/web/features/vinculos-institucionales.md`](../../../docs/web/features/vinculos-institucionales.md). El schema mecánico está en [`schemas/vinculo-institucional.schema.json`](../../../schemas/vinculo-institucional.schema.json).

**No es etiquetado ideológico.** Si un cargo público está documentado por nombramiento BOE + cobertura cruzada, entra. Si una "afinidad" no está documentada por ningún acto público o documento oficial, NO entra.

## Inputs aceptados

- `/documentar-vinculos <slug>` donde `<slug>` puede ser:
  - Slug de **caso** ya fichado en `content/casos/<slug>/`. Ej. `/documentar-vinculos koldo`. **Modo caso**.
  - Slug de **persona** existente en `content/personas/<slug>.yaml`. Ej. `/documentar-vinculos isabel-diaz-ayuso`. **Modo persona**.
  - Slug de **organización** existente en `content/organizaciones/<slug>.yaml`. Ej. `/documentar-vinculos partido-popular`. **Modo organización**.
- Si no se pasa argumento, listar los slugs disponibles agrupados por tipo y preguntar cuál documentar.
- Si el slug no resuelve a ninguno de los tres tipos, error claro (no inventar). Si resuelve a más de uno por colisión accidental (ej. una persona y una organización con el mismo slug), error y exigir desambiguación.

## Proceso

### 0. Preflight obligatorio de directorio

Antes de leer o escribir cualquier archivo, validar el directorio real de trabajo:

1. Ejecutar `pwd` y confirmar que apunta al worktree esperado para la sesión.
2. Ejecutar `git rev-parse --show-toplevel` y comprobar que coincide con ese worktree, no con la working copy principal salvo que el maintainer haya pedido expresamente trabajar ahí.
3. Ejecutar `git status --short` para detectar cambios ajenos antes de tocar rutas calientes.

Si el CWD no coincide con el worktree de la sesión, parar y corregirlo antes de continuar. Aprendizaje incorporado en v1 tras detectar que el agente `vinculos-bg` trabajó parcialmente en la working copy principal por error.

### 1. Detección de modo

Antes de ramificar el proceso, resolver el tipo del slug:

1. Buscar `content/casos/<slug>/caso.yaml`. Si existe → **modo caso**.
2. Buscar `content/personas/<slug>.yaml`. Si existe → **modo persona**.
3. Buscar `content/organizaciones/<slug>.yaml`. Si existe → **modo organización**.
4. Si dos o más coinciden, error y exigir que el maintainer desambigüe pasando `--tipo=caso|persona|organizacion`.
5. Si ninguno coincide, error claro indicando los tres directorios buscados.

Cargar también el inventario global de vínculos ya existentes: `content/vinculos/*.yaml`. En cualquier modo, no duplicar vínculos ya presentes — si la naturaleza+sujeto+objeto+fechas coinciden con un YAML existente, actualizar `relevancia_para_caso_ids` (si procede) en lugar de crear un duplicado.

---

### 2. Modo caso

Replica el flujo v1. Procesa el contexto institucional que roza un caso concreto.

#### 2.1 Carga del caso

Leer en disco todos los YAMLs del caso (igual que `revisar-caso`):

- `content/casos/<slug>/caso.yaml`, `NOTES.md`, `hitos/*.yaml`, `hechos/*.yaml`, `roles/*.yaml`.
- Resolver `content/personas/<id>.yaml` para cada `sujeto_persona_id` de los roles.
- Resolver `content/organizaciones/<id>.yaml` para cada `sujeto_organizacion_id` de los roles y para `organo_judicial_id`, `productor_organizacion_id`, etc.
- Listar `content/vinculos/*.yaml` filtrando por `relevancia_para_caso_ids` que contenga `<slug>` para saber qué vínculos ya existen y no duplicar.

#### 2.2 Mapeo de personas relevantes

Para cada `Persona` con rol del lado **investigado / procesado / acusado / condenado / desimputado / absuelto** en el caso (consultar `RolEnCaso.rol`), abrir el ciclo de documentación:

1. ¿Tiene `cargo_publico_actual` o `cargos_publicos_historicos[]` en la ficha de `Persona`? Cada uno es candidato a `VinculoInstitucional` con `naturaleza = cargo_publico_electo | cargo_publico_designado | cargo_judicial | cargo_directivo_empresa_publica | cargo_academico_publico | cargo_directivo_organizacion_privada`. Verificar con WebSearch y al menos un Documento de respaldo (BOE, nota oficial CGPJ, web institucional, cobertura cruzada N4).
2. ¿Es militante o cargo orgánico de partido? Comprobar prensa N4 cruzada y, si procede, acta de congreso del partido (N2). Naturaleza: `cargo_organico_partido`.
3. Si su entrada al cargo público fue **por nombramiento de un gobierno concreto** (alto cargo BOE, ministro, secretario de Estado, presidente de empresa pública, magistrado del TS designado por CGPJ), añadir además un `VinculoInstitucional` separado con `naturaleza = nombramiento_por_gobierno` apuntando a la organización gobierno y rellenando `gobierno_o_legislatura` obligatorio. **No fusionar** con el cargo en sí: un cargo y su nombramiento son dos vínculos distintos (el cargo describe la posición, el nombramiento ancla la responsabilidad política del gobierno que lo eligió).
4. ¿Tiene vínculo familiar público y relevante para el caso? Sólo si: (a) la persona vinculada también es figura pública, (b) la relación es citada en cobertura N4 múltiple, (c) la relación es factualmente relevante para el hecho investigado. Documentar con `naturaleza = vinculo_familiar_publico`, `notas` obligatoria explicando relevancia, minimización máxima (no datos de hijos menores, no domicilios, no detalles privados).
5. ¿Hay vínculo económico/profesional documentado (proveedor, beneficiario de contrato, accionista mayoritario, abogado defensor con vínculo previo)? Sólo si está documentado en fuente N1-N3 y es directamente relevante para el hecho investigado. `naturaleza = vinculo_economico_documentado | vinculo_profesional_documentado`, `notas` obligatoria.

#### 2.3 Mapeo de organizaciones relevantes

Para cada `Organizacion` que aparece en `Hito.organizaciones_afectadas`, `Hecho.organizaciones_implicadas`, o como `productor_organizacion_id` de Documentos del caso, evaluar las **cinco naturalezas `*_en_caso`**:

**Naturalezas de afectación editorial** (exigen `nivel_afectacion` + `justificacion_afectacion`):

1. ¿Es **entidad investigada como persona jurídica** (no sólo sus directivos como personas físicas, sino la propia organización con responsabilidad penal)? `naturaleza = entidad_investigada_en_caso` · `nivel_afectacion: directa`.
2. ¿Es **perjudicada institucional** (administración estafada, organismo público dañado, empresa pública vaciada)? `naturaleza = perjudicado_institucional_en_caso` · `nivel_afectacion: directa`.
3. ¿Es el **ámbito administrativo del que emana el acto** investigado (Ministerio, Consejería autonómica, organismo desde cuyo perímetro se atribuyen los hechos — regla 4 del doc 08)? `naturaleza = ambito_administrativo_directo_del_acto_en_caso` · `nivel_afectacion: directa`.
4. ¿Es un **partido o ente alcanzado indirectamente** (partido del cargo investigado, partido del cónyuge/pareja, partido del gobierno responsable del acto, ente dependiente sin papel procesal — reglas 1-4 del doc 08)? `naturaleza = afectacion_indirecta_en_caso` · `nivel_afectacion: indirecta`.

**Naturaleza de papel procesal** (NO es afectación, no lleva `nivel_afectacion`):

5. ¿Actúa como **acusación popular constituida** en el caso (incluye acusación de partido — regla 5 del doc 08)? `naturaleza = acusacion_institucional_en_caso`. Sin `nivel_afectacion`; sin `justificacion_afectacion`.

> **Importante (2026-05-27)**: las 4 naturalezas de afectación alimentan el bloque **«Organizaciones afectadas»** que `PgCasoDetalle` renderiza con sub-bloques **Directa** / **Indirecta**, y también la columna fusionada **«Organizaciones afectadas»** de `/casos`. La acusación popular figura en **«Participación procesal»** separada. Toda la derivación pasa por [`src/lib/afectacion.ts`](../../../src/lib/afectacion.ts), que deduplica por `organizacion_id` y normaliza el orden. No hay que tocar UI, sólo el YAML.

**Decisión obligatoria de `nivel_afectacion` y `justificacion_afectacion` al crear el vínculo**:

- `nivel_afectacion: directa` para las naturalezas 1, 2, 3 (auto-inferible, pero obligatorio declararlo explícito por V-22a).
- `nivel_afectacion: indirecta` para la naturaleza 4 (auto-inferible, obligatorio por V-22b).
- **Ausente** para la naturaleza 5 (acusación popular — V-23 lo prohíbe; si lo añades, falla validate).
- **Ausente** para cualquier otra naturaleza (cargos, militancia, nombramientos, vínculos familiares — V-24 lo prohíbe).

La `justificacion_afectacion` es texto neutro corto que explica por qué el caso alcanza a la organización en el nivel marcado. Sin verbos prohibidos P-09. Cuando creas un vínculo `afectacion_indirecta_en_caso`, cita en la justificación la regla del doc 08 que aplica (regla 1 / 2 / 3 / 4).

#### 2.3 bis Antes de marcar un partido como afectado: aplicar las 6 reglas

Decididas el 2026-05-27 y canónicas en [`docs/diseno/08-afectacion-directa-indirecta.md`](../../../docs/diseno/08-afectacion-directa-indirecta.md). Resumen operativo:

1. **Gobierno responsable del acto = indirecta del partido titular.** Plus Ultra → PSOE/Podemos indirectos.
2. **Pareja sentimental del cargo público → partido del cargo = indirecta.** González Amador → PP indirecto.
3. **Cónyuge del cargo público → partido del cargo = indirecta.** Begoña Gómez → PSOE indirecto.
4. **Ministerio/Consejería titular del acto = directa para el ámbito + indirecta para el partido titular.** Kitchen → Ministerio del Interior directa, PP indirecto.
5. **Acusación popular constituida por partido = NO afectada.** PSOE/Más Madrid en González Amador → no afectados; van en participación procesal.
6. **Nombramiento por gobierno X de cargo con autonomía formal = NO afectada del gobierno X.** FGE → PSOE no afectado.

Si encuentras una **frontera no cubierta** por estas 6 reglas (partido extranjero, asociación cultural con vínculo difuso, organismo internacional, etc.), **pregunta al maintainer** antes de modelar. No introduzcas una séptima regla por tu cuenta.

**Qué NO es afectación (lista canónica)** — no crear `afectacion_indirecta_en_caso` para:
- Acusación popular, defensa, juzgado instructor, fiscalía, peritos, unidades policiales investigadoras.
- Nombramiento histórico de cargo con autonomía formal cuando el caso no cuestiona el nombramiento.
- Militancia antigua sin cargo activo en el periodo de los hechos investigados.
- Vínculo familiar lejano (primos, cuñados, parientes no convivientes, sin cargo público).
- Coincidencia geográfica, generacional o de cohorte.
- Donación/subvención puntual del pasado sin relación causal con los hechos.

#### 2.4 Cierre modo caso

Editar `content/casos/<slug>/caso.yaml` campo `estado_ficha.vinculos_institucionales` según la cobertura alcanzada (ver § 6).

---

### 3. Modo persona

Pasada cruzada centrada en una `Persona` ya fichada. El objetivo es completar la red institucional pública de esa persona aunque no roce ningún caso del inventario.

#### 3.1 Carga de la persona

- Leer `content/personas/<slug>.yaml` y sus campos: `nombre_completo`, `cargo_publico_actual`, `cargos_publicos_historicos[]`, `figura_publica`, `fecha_nacimiento`, etc.
- Listar todos los `VinculoInstitucional` ya existentes con `sujeto_persona_id == <slug>`. No duplicar.
- Listar los `RolEnCaso` donde aparece la persona (para enriquecer `relevancia_para_caso_ids` si procede).

#### 3.2 Detección de vínculos cruzados

Recorrer **todas las organizaciones** del inventario (`content/organizaciones/*.yaml`) y, para cada una, evaluar si existe un vínculo persona→organización **públicamente documentable**:

1. **Militancia o cargo orgánico de partido** — si la organización es `tipo: partido_politico`, buscar con WebSearch si la persona ha tenido cargo orgánico en él (Secretario General, miembro de Ejecutiva, presidente regional, etc.) o militancia pública. Mínimo: nota oficial del partido + cobertura cruzada N4 que cite el cargo. Naturaleza: `cargo_organico_partido`.
2. **Cargo público en órgano del Estado** — si la organización es `tipo: ministerio`, `tipo: organismo_publico`, `tipo: comunidad_autonoma`, `tipo: ayuntamiento`, etc. y la persona tuvo cargo allí, buscar BOE de nombramiento o nota institucional. Naturaleza: `cargo_publico_electo | cargo_publico_designado` según corresponda; añadir `nombramiento_por_gobierno` separado si el cargo es designado por gobierno concreto.
3. **Cargo judicial** — si la organización es `tipo: juzgado | tribunal | fiscalia | cgpj`, y la persona aparece como titular o miembro, naturaleza `cargo_judicial`. Respaldo: nota CGPJ, BOE de nombramiento.
4. **Dirección de empresa o fundación** — si la organización es `tipo: empresa_publica | empresa_privada | fundacion`, y la persona aparece como directivo (presidente, consejero delegado, vocal del consejo de administración), naturaleza `cargo_directivo_empresa_publica | cargo_directivo_organizacion_privada`. Respaldo: registro mercantil, memoria anual, BOE para empresas públicas.
5. **Cargo académico público** — si la organización es `tipo: universidad_publica` o similar, naturaleza `cargo_academico_publico`.
6. **Vínculo familiar público** — sólo entre dos figuras públicas, con cobertura cruzada citada, y relevancia institucional. Casi nunca aplica fuera de modo caso; aplicable aquí si la relación familiar es la razón por la que la persona aparece en el inventario (p.ej. pareja de presidente, hijo/a de ex ministro).
7. **Vínculo económico/profesional documentado** — sólo con factura, contrato, registro mercantil o sentencia. Sin documento no entra.

Para cada vínculo creado:
- `relevancia_para_caso_ids`: incluir los casos del inventario donde la persona aparezca con rol, **si y solo si** el vínculo es contextualmente relevante para ese caso (un cargo orgánico actual sí; uno de hace 20 años en otra organización no). Vacío legal si el vínculo no roza ningún caso.

#### 3.3 Cierre modo persona

No actualizar `estado_ficha` de ningún caso (eso es de modo caso). Sí actualizar la propia ficha de la persona si el escaneo detecta cargos no anotados en `cargos_publicos_historicos[]`: en ese caso, **proponerlo en el output** pero no modificar `content/personas/<slug>.yaml` automáticamente (la skill no toca personas; lo decide el maintainer).

---

### 4. Modo organización

Pasada cruzada centrada en una `Organizacion` ya fichada. Versión inversa del modo persona: escanea todas las personas del repo y propone vínculos persona→organización para los dirigentes históricos, militantes con cargo orgánico, magistrados titulares, directivos, etc.

#### 4.1 Carga de la organización

- Leer `content/organizaciones/<slug>.yaml` y sus campos: `nombre_oficial`, `tipo_organizacion`, `naturaleza_editorial` (si es medio), `grupo_editorial`, `descripcion`, etc.
- Listar todos los `VinculoInstitucional` ya existentes con `objeto_organizacion_id == <slug>`. No duplicar.

#### 4.2 Detección de vínculos cruzados

Recorrer **todas las personas** del inventario (`content/personas/*.yaml`) y, para cada una, evaluar si existe un vínculo persona→organización documentable según las naturalezas aplicables al `tipo_organizacion`:

- Si organización es partido → buscar militancia/cargo orgánico de la persona.
- Si organización es ministerio/órgano del Estado → buscar cargos electos/designados.
- Si organización es juzgado/tribunal → buscar titularidad o miembros.
- Si organización es empresa → buscar dirigencia.
- Etc.

Aplicar las mismas reglas de respaldo documental que en modo persona (§ 3.2).

#### 4.3 Cierre modo organización

Igual que modo persona: el output es la propuesta de vínculos nuevos; la ficha de organización no se toca automáticamente. Reportar al maintainer cualquier desajuste detectado en la propia ficha (campos vacíos, `tipo_organizacion` que parece incorrecto a la luz de los hallazgos cruzados).

---

### 5. Documentos de respaldo (los tres modos)

Cada `VinculoInstitucional` exige **al menos un `documento_respaldo`** (mismo principio V-13). Aceptables por nivel:

- **N1 / N2** preferentes para cargos formales: BOE de nombramiento (`tipo: boe_disposicion`), acta de congreso de partido (`tipo: acta_organica_partido` si existe), nota oficial CGPJ, web institucional con captura archivada (`tipo: web_institucional`).
- **N3** sólo si está documentado por filtrado verificado (rara vez para vínculos).
- **N4** aceptable como respaldo único sólo si hay **al menos 2 piezas cruzadas en líneas editoriales distintas** (mismo principio que la skill `/investigar-caso`).

Si el Documento no existe todavía en `content/documentos/`, **crearlo primero** con `productor_organizacion_id` rellenado y, si es N1-N2 público (BOE, nota CGPJ), seguir [AGENTS.md — "Documentos primarios descargados"](../../../AGENTS.md#documentos-primarios-descargados-a-publicdocumentos) (descarga a `/public/documentos/<caso-o-slug-contexto>/`, `ruta_local` + `hash_sha256`).

**Sobre `caso_principal_id` del Documento creado**: en modo caso, va el caso. En modo persona/organización, queda opcional o se rellena con el caso del inventario donde sea más relevante; si no hay caso natural, dejar vacío y archivar el PDF en `/public/documentos/_globales/` o similar (no convención forzada; el maintainer puede ajustar después).

### 6. Edición del YAML

Cada vínculo se guarda en `content/vinculos/<id>.yaml` con id slug `<sujeto-slug>-<objeto-slug>` o `<sujeto-slug>-<naturaleza-corta>`. Ej.:

- `santos-cerdan-secretaria-organizacion-psoe.yaml`
- `garcia-ortiz-fge-nombramiento-gobierno-sanchez-ii.yaml`
- `manos-limpias-acusacion-begona-gomez.yaml`
- `isabel-diaz-ayuso-militancia-pp.yaml` (modo persona, vínculo no atado a caso concreto)

Estructura mínima (ver schema canónico para detalle):

```yaml
id: santos-cerdan-secretaria-organizacion-psoe
naturaleza: cargo_organico_partido
descripcion: "Secretario de Organización del PSOE."
sujeto_persona_id: santos-cerdan
objeto_organizacion_id: psoe
cargo_o_rol: "Secretario de Organización"
desde: 2021-10-15
hasta: 2024-06-15
precision_desde: dia
precision_hasta: dia
vigente: false
relevancia_para_caso_ids: [koldo]
documentos_respaldo:
  - documento_id: psoe-cierre-40-congreso-federal-2021-10-17
    pasaje: "Composición del nuevo Comité Federal, p. 14"
estado_publicacion: borrador
ultima_revision_editorial: 2026-05-26
```

**Vínculo de afectación** (incluye los dos campos `nivel_afectacion` + `justificacion_afectacion` obligatorios para las 4 naturalezas que aportan afectación):

```yaml
id: pp-afectado-indirecto-kitchen
naturaleza: afectacion_indirecta_en_caso
descripcion: "El Partido Popular queda alcanzado de forma indirecta por el procedimiento Kitchen..."
sujeto_organizacion_id: partido-popular
objeto_organizacion_id: audiencia-nacional
desde: 2018-07-19
precision_desde: dia
vigente: true
relevancia_para_caso_ids: [kitchen]
documentos_respaldo:
  - documento_id: eldiario-procesamiento-kitchen-2021-07-29
    pasaje: "El procesamiento alcanza a Jorge Fernández Díaz, exministro del Interior por el PP..."
nivel_afectacion: indirecta
justificacion_afectacion: "El PP era el partido del Gobierno titular del Ministerio del Interior en los hechos investigados (regla 4 del doc 08)..."
estado_publicacion: borrador
ultima_revision_editorial: 2026-05-27
```

En modo persona/organización, `relevancia_para_caso_ids` puede quedar vacío (`[]`): es legal y refleja "vínculo documentado en la red institucional pública aunque no anclado todavía a procedimiento del inventario". Pero las 4 naturalezas de afectación (`entidad_investigada_en_caso`, `perjudicado_institucional_en_caso`, `ambito_administrativo_directo_del_acto_en_caso`, `afectacion_indirecta_en_caso`) **siempre** exigen al menos un caso en `relevancia_para_caso_ids` (V-22): no se crean vínculos de afectación huérfanos.

### 7. Actualización del `estado_ficha` (sólo modo caso)

Sólo aplica en modo caso. Al cerrar la documentación:

- Editar `content/casos/<slug>/caso.yaml` campo `estado_ficha.vinculos_institucionales`:
  - `completo`: todos los vínculos identificables han sido modelados y revisados.
  - `parcial`: hay vínculos modelados pero falta cerrar algunos (anotar en `notas` cuáles).
  - `pendiente`: trabajo aún no comenzado para este caso.
  - `no_aplica`: el caso tiene contexto institucional irrelevante (raro; justificar en `notas`).
- Actualizar `estado_ficha.fecha_actualizacion` a hoy.
- Si la pasada incluyó revisión cruzada de todos los actores, opcionalmente promover `revision_editorial` a `completo`.

En modo persona y organización, **NO se toca ninguna ficha de Caso, Persona ni Organización**. Sólo se crean YAMLs en `content/vinculos/` y, si procede, nuevos `Documento` en `content/documentos/`.

### 8. Output

Informe en markdown impreso al final del turno. Plantilla genérica adaptable a los tres modos:

```markdown
# Vínculos institucionales — `<slug>` (modo <caso|persona|organizacion>)

Fecha: YYYY-MM-DD
Skill: documentar-vinculos v2

## Vínculos creados

- `<id-vinculo>` — <descripción> (`<naturaleza>`) · `relevancia_para_caso_ids: [<lista>]`
- ...

## Vínculos no creados con justificación

- <persona/organización> — <por qué no se modela> (ej. "Sin documento N1-N2 ni N4 cruzado para el cargo").

## Documentos nuevos cargados

- `<id-documento>` — <título>, nivel <N>, ruta_local si aplica.

## Cambios sugeridos en otras fichas (no aplicados)

- `content/personas/<slug>.yaml` → propuesta de añadir `cargos_publicos_historicos[]` con detalle X (modo persona).
- `content/organizaciones/<slug>.yaml` → propuesta de campo Y vacío que el escaneo cruzado detectó (modo organización).

## Estado de la ficha tras la pasada

- (sólo modo caso) `vinculos_institucionales`: <nuevo estado>.

## Pendientes para próxima pasada

- ...
```

## Guardarraíles editoriales (los tres modos)

1. **Sin documentos de respaldo, no entra.** Un vínculo intuido o asumido es invisible para esta skill.
2. **Cargo público formal ≠ cargo orgánico de partido ≠ nombramiento por gobierno.** Tres `VinculoInstitucional` separados si las tres dimensiones existen.
3. **El partido es una organización más, no un color.** La UI no usa colores partidistas; el modelado tampoco etiqueta "ideología", sólo `naturaleza`.
4. **Verbos prohibidos del P-09 vetados en `descripcion` y `notas`.** "Ostenta el cargo", "ocupa", "ejerce" sí; "manda", "controla", "domina" no — salvo cita literal de un Documento, marcada como tal.
5. **Vínculos familiares minimizados, pero no invisibilizados cuando son el contexto público del caso.** No usar para hijos menores, parejas no públicas, familiares sin rol propio en el caso o en cargo público. Sí puede modelarse una relación familiar entre dos figuras públicas cuando la relación es pública, aparece citada de forma central en cobertura cruzada y explica el alcance institucional o mediático del procedimiento. Precedente 2026-05-25: `begona-gomez-esposa-pedro-sanchez`, modelado porque Pedro Sánchez es figura pública, la relación es el contexto institucional explícito del caso y se documenta con respaldo N4 cruzado. Mantener minimización máxima: no añadir detalles privados accesorios.
6. **Vínculos económicos sólo con documento.** "X es proveedor de Y" exige factura/contrato/registro mercantil/sentencia. Sin documento no entra.
7. **Fechas con precisión declarada.** Si sólo se conoce el año, `desde: YYYY-01-01` + `precision_desde: anio`. No fingir precisión.
8. **`estado_publicacion: borrador` por defecto.** Al maintainer le toca elevar a `publicado` tras revisar.
9. **Modo persona/organización ≠ inflación.** No documentar todo cargo histórico vagamente verificable. El criterio sigue siendo "vínculo formal públicamente documentado con respaldo solvente". Si la persona tuvo 17 cargos menores en una empresa privada hace 30 años sin documentación clara, no entran todos. Documentar los principales y dejar nota en el output.
10. **Modo persona/organización no infiere.** Si Ayuso es presidenta de Madrid (PP) y un dirigente del PP estuvo en el gobierno de Madrid, NO se infiere relación entre ambas personas vía partido común. Sólo se documenta cada vínculo persona→organización con su respaldo propio.

## Operativa multiagéntica

Esta skill está pensada para correr en **sub-agente paralelo** lanzado por el maintainer en un `git worktree` aislado (ver [AGENTS.md — "Repositorio multiagéntico en paralelo"](../../../AGENTS.md#repositorio-multiagéntico-en-paralelo)). El sub-agente:

1. Abre sesión propia en `.git/agents/sessions/<timestamp>-documentar-vinculos-<slug>/`.
2. Valida CWD y toplevel de git antes de escribir nada. Si está en la working copy principal por accidente, corrige directorio o pide intervención.
3. Trabaja sólo en `content/vinculos/<*.yaml>`, `content/documentos/<*.yaml>` que cree, `/public/documentos/<caso-o-_globales>/` si descarga primarios, y `content/casos/<slug>/caso.yaml` (sólo en modo caso y sólo para `estado_ficha`).
4. **NO toca** `content/personas/*.yaml`, `content/organizaciones/*.yaml`, ni `RolEnCaso`, ni el resto del caso. Si detecta inconsistencia en uno de esos, la anota en el output como "cambio sugerido en otras fichas".
5. Cierra sesión cuando el output final está completo y `pnpm validate` pasa.

## Histórico

### v3 — 2026-05-27

Refactor de **afectación directa/indirecta**. Cambios al modelo de vínculos `*_en_caso`:

- Dos naturalezas nuevas: `ambito_administrativo_directo_del_acto_en_caso` (Ministerio/Consejería titular del acto, regla 4 del doc 08) y `afectacion_indirecta_en_caso` (partido salpicado, ente dependiente, reglas 1-4).
- Dos campos nuevos en `VinculoInstitucional`: `nivel_afectacion` (`directa | indirecta`) y `justificacion_afectacion` (texto neutro). Obligatorios para las 4 naturalezas de afectación; prohibidos para `acusacion_institucional_en_caso` y el resto (V-22..V-24).
- § 2.3 reescrito en 5 ramas + § 2.3 bis con las 6 reglas editoriales + lista "Qué NO es afectación".
- Campo retirado en paralelo: `Caso.partidos_afectados[]` ya no se modela aquí ni se lee desde la UI. La justificación literal del campo viejo migró a `VinculoInstitucional.justificacion_afectacion`.

Motivo: durante el sprint 2026-05-26 se detectó que la columna "Organización afectada" de `/casos` pintaba la acusación popular como "afectada" (Kitchen mostraba `Podemos · ACUSACIÓN POPULAR`). La taxonomía nueva separa afectación editorial de papel procesal y unifica los dos modelos paralelos (`Caso.partidos_afectados[]` + derivación por naturaleza) en una sola dimensión.

### v2 — 2026-05-26 (tarde)

Skill convertida en **modal**. Acepta slug de caso, persona u organización. Añade:

- Detección de modo en § 1 (busca en los tres directorios).
- Sección § 3 — Modo persona: escaneo cruzado contra todas las organizaciones del repo; vínculos con `relevancia_para_caso_ids: []` si no rozan ningún caso.
- Sección § 4 — Modo organización: escaneo cruzado inverso contra todas las personas del repo.
- Nuevo guardarraíl § 9 (no inflación) y § 10 (no inferir relaciones transitivas vía partido común).
- Aclaración en § 5 sobre `caso_principal_id` del Documento creado en modo persona/organización.
- Output con apartado "Cambios sugeridos en otras fichas (no aplicados)" para que el maintainer pueda actuar sobre `content/personas/` y `content/organizaciones/` sin que la skill toque esos archivos.

Motivo del cambio: tras la primera ronda de poblado de vínculos por caso (v1, 5 casos del sprint del 26-may) se identificaron asimetrías en el grafo — personas con cargo orgánico evidente (Ayuso → PP, Sánchez → PSOE) sin vínculo modelado, porque ningún `/documentar-vinculos <caso>` había necesitado documentarlas en su contexto procesal específico. v2 cierra el hueco con dos modalidades hermanas que pueden invocarse para personas y organizaciones nuevas o ya fichadas.

### v1 — 2026-05-26

Primera versión, sólo modo caso. Moldeada tras aplicar la skill al caso `begona-gomez`.

- Añade preflight obligatorio de CWD y `git rev-parse --show-toplevel` antes de escribir, tras detectar que `vinculos-bg` trabajó parcialmente en la working copy principal por error.
- Matiza el guardarraíl de vínculos familiares: siguen minimizados, pero pueden modelarse entre figuras públicas cuando la relación sea pública, central para entender el contexto institucional del caso y esté respaldada por cobertura cruzada. Precedente: Pedro Sánchez como objeto de `begona-gomez-esposa-pedro-sanchez`.

### v0 — 2026-05-25

Primera versión. Diseñada antes de aplicarla sobre ningún caso. Se moldeó con la experiencia tras la primera pasada real, igual que `revisar-caso` v0 → v1.
