---
name: documentar-vinculos
description: Documenta los vínculos institucionales formales que rodean a un caso del inventario presuntamente.org. Crea entradas `VinculoInstitucional` en `content/vinculos/<id>.yaml` para cargos públicos, designaciones por gobierno, cargos orgánicos de partido, directivos públicos/privados, acusaciones/perjudicados/entes investigados como personas jurídicas, y vínculos familiares/económicos/profesionales públicos relevantes — siempre con `documentos_respaldo[]` ≥ 1 y aplicando los principios de presunción de inocencia y minimización. Trigger cuando el usuario pide "documenta los vínculos institucionales de <caso>", "qué entornos institucionales tocan a <caso>", "amplía el contexto institucional de <caso>" o invoca `/documentar-vinculos <slug>`. Pensada para correr en sub-agente paralelo a la sesión principal, en un git worktree dedicado.
---

# Skill `documentar-vinculos` — v1

## Propósito

Generar el corpus de vínculos institucionales documentados de un caso ya fichado en el inventario. Cubre el hueco entre lo que `RolEnCaso` modela (relación procesal directa entre persona/organización y caso) y el **contexto institucional**: cargos públicos, designaciones por gobierno concreto, cargos orgánicos en partido, dirección de empresas/fundaciones relevantes para el hecho investigado, organizaciones que ejercen acusación popular o son perjudicadas institucionalmente, y vínculos familiares/económicos públicos que son públicamente relevantes.

La feature canónica está descrita en [`docs/web/features/vinculos-institucionales.md`](../../../docs/web/features/vinculos-institucionales.md). El schema mecánico está en [`schemas/vinculo-institucional.schema.json`](../../../schemas/vinculo-institucional.schema.json).

**No es etiquetado ideológico.** Si un cargo público está documentado por nombramiento BOE + cobertura cruzada, entra. Si una "afinidad" no está documentada por ningún acto público o documento oficial, NO entra.

## Inputs aceptados

- Slug de un caso ya fichado en `content/casos/<slug>/`. Ej. `/documentar-vinculos koldo`.
- Si no se pasa argumento, listar los casos disponibles y preguntar cuál documentar.
- Si el slug no existe en `content/casos/`, error claro (no inventar).

## Proceso

### 0. Preflight obligatorio de directorio

Antes de leer o escribir cualquier archivo, validar el directorio real de trabajo:

1. Ejecutar `pwd` y confirmar que apunta al worktree esperado para la sesión.
2. Ejecutar `git rev-parse --show-toplevel` y comprobar que coincide con ese worktree, no con la working copy principal salvo que el maintainer haya pedido expresamente trabajar ahí.
3. Ejecutar `git status --short` para detectar cambios ajenos antes de tocar rutas calientes.

Si el CWD no coincide con el worktree de la sesión, parar y corregirlo antes de continuar. Aprendizaje incorporado tras la primera pasada real: el agente `vinculos-bg` trabajó parcialmente en el working tree principal por error.

### 1. Carga del caso

Leer en disco todos los YAMLs del caso (igual que `revisar-caso`):

- `content/casos/<slug>/caso.yaml`, `NOTES.md`, `hitos/*.yaml`, `hechos/*.yaml`, `roles/*.yaml`.
- Resolver `content/personas/<id>.yaml` para cada `sujeto_persona_id` de los roles.
- Resolver `content/organizaciones/<id>.yaml` para cada `sujeto_organizacion_id` de los roles y para `organo_judicial_id`, `productor_organizacion_id`, etc.
- Listar `content/vinculos/*.yaml` filtrando por `relevancia_para_caso_ids` que contenga `<slug>` para saber qué vínculos ya existen y no duplicar.

### 2. Mapeo de personas relevantes

Para cada `Persona` con rol del lado **investigado / procesado / acusado / condenado / desimputado / absuelto** en el caso (consultar `RolEnCaso.rol`), abrir el ciclo de documentación:

1. ¿Tiene `cargo_publico_actual` o `cargos_publicos_historicos[]` en la ficha de `Persona`? Cada uno es candidato a `VinculoInstitucional` con `naturaleza = cargo_publico_electo | cargo_publico_designado | cargo_judicial | cargo_directivo_empresa_publica | cargo_academico_publico | cargo_directivo_organizacion_privada`. Verificar con WebSearch y al menos un Documento de respaldo (BOE, nota oficial CGPJ, web institucional, cobertura cruzada N4).
2. ¿Es militante o cargo orgánico de partido? Comprobar prensa N4 cruzada y, si procede, acta de congreso del partido (N2). Naturaleza: `cargo_organico_partido`.
3. Si su entrada al cargo público fue **por nombramiento de un gobierno concreto** (alto cargo BOE, ministro, secretario de Estado, presidente de empresa pública, magistrado del TS designado por CGPJ), añadir además un `VinculoInstitucional` separado con `naturaleza = nombramiento_por_gobierno` apuntando a la organización gobierno y rellenando `gobierno_o_legislatura` obligatorio. **No fusionar** con el cargo en sí: un cargo y su nombramiento son dos vínculos distintos (el cargo describe la posición, el nombramiento ancla la responsabilidad política del gobierno que lo eligió).
4. ¿Tiene vínculo familiar público y relevante para el caso? Sólo si: (a) la persona vinculada también es figura pública, (b) la relación es citada en cobertura N4 múltiple, (c) la relación es factualmente relevante para el hecho investigado. Documentar con `naturaleza = vinculo_familiar_publico`, `notas` obligatoria explicando relevancia, minimización máxima (no datos de hijos menores, no domicilios, no detalles privados).
5. ¿Hay vínculo económico/profesional documentado (proveedor, beneficiario de contrato, accionista mayoritario, abogado defensor con vínculo previo)? Sólo si está documentado en fuente N1-N3 y es directamente relevante para el hecho investigado. `naturaleza = vinculo_economico_documentado | vinculo_profesional_documentado`, `notas` obligatoria.

### 3. Mapeo de organizaciones relevantes

Para cada `Organizacion` que aparece en `Hito.organizaciones_afectadas`, `Hecho.organizaciones_implicadas`, o como `productor_organizacion_id` de Documentos del caso:

1. ¿Actúa como **acusación popular** o **acusación institucional** en el caso? `naturaleza = acusacion_institucional_en_caso`.
2. ¿Es **perjudicada institucional** (administración estafada, organismo público dañado, empresa pública vaciada)? `naturaleza = perjudicado_institucional_en_caso`.
3. ¿Es **entidad investigada como persona jurídica** (no sólo sus directivos como personas físicas, sino la propia organización con responsabilidad penal)? `naturaleza = entidad_investigada_en_caso`.

> **Importante (2026-05-26)**: estas tres naturalezas alimentan el bloque **«Instituciones alcanzadas»** que `PgCasoDetalle` renderiza automáticamente dentro de «Estado procesal actual» (tres cajas separadas con border-left por familia) y también la columna **«Organización afectada»** de `/casos` (prioridad: investigada → perjudicada → acusación). Cada vínculo nuevo en estas categorías se ve inmediatamente en cabecera de la ficha y en el listado — no hay que tocar UI, sólo el YAML.

### 4. Documentos de respaldo

Cada `VinculoInstitucional` exige **al menos un `documento_respaldo`** (mismo principio V-13). Aceptables por nivel:

- **N1 / N2** preferentes para cargos formales: BOE de nombramiento (`tipo: boe_disposicion`), acta de congreso de partido (`tipo: acta_organica_partido` si existe), nota oficial CGPJ, web institucional con captura archivada (`tipo: web_institucional`).
- **N3** sólo si está documentado por filtrado verificado (rara vez para vínculos).
- **N4** aceptable como respaldo único sólo si hay **al menos 2 piezas cruzadas en líneas editoriales distintas** (mismo principio que la skill `/investigar-caso`).

Si el Documento no existe todavía en `content/documentos/`, **crearlo primero** con `caso_principal_id = <slug>`, `productor_organizacion_id` rellenado y, si es N1-N2 público (BOE, nota CGPJ), seguir [AGENTS.md — "Documentos primarios descargados"](../../../AGENTS.md#documentos-primarios-descargados-a-publicdocumentos) (descarga a `/public/documentos/<caso>/`, `ruta_local` + `hash_sha256`).

### 5. Edición del YAML

Cada vínculo se guarda en `content/vinculos/<id>.yaml` con id slug `<sujeto-slug>-<objeto-slug>` o `<sujeto-slug>-<naturaleza-corta>`. Ej.:

- `santos-cerdan-secretaria-organizacion-psoe.yaml`
- `garcia-ortiz-fge-nombramiento-gobierno-sanchez-ii.yaml`
- `manos-limpias-acusacion-begona-gomez.yaml`

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
ultima_revision_editorial: 2026-05-25
```

### 6. Actualización del `estado_ficha`

Al cerrar la documentación de un caso:

- Editar `content/casos/<slug>/caso.yaml` campo `estado_ficha.vinculos_institucionales`:
  - `completo`: todos los vínculos identificables han sido modelados y revisados.
  - `parcial`: hay vínculos modelados pero falta cerrar algunos (anotar en `notas` cuáles).
  - `pendiente`: trabajo aún no comenzado para este caso.
  - `no_aplica`: el caso tiene contexto institucional irrelevante (raro; justificar en `notas`).
- Actualizar `estado_ficha.fecha_actualizacion` a hoy.
- Si la pasada incluyó revisión cruzada de todos los actores, opcionalmente promover `revision_editorial` a `completo`.

### 7. Output

Informe en markdown impreso al final del turno:

```markdown
# Vínculos institucionales — caso `<slug>`

Fecha: YYYY-MM-DD
Skill: documentar-vinculos v1
Material revisado: <N> personas con rol, <N> organizaciones implicadas.

## Vínculos creados

- `<id-vinculo>` — <descripción> (`<naturaleza>`)
- ...

## Vínculos no creados con justificación

- <persona/organización> — <por qué no se modela> (ej. "Sin documento N1-N2 ni N4 cruzado para el cargo").

## Documentos nuevos cargados

- `<id-documento>` — <título>, nivel <N>.

## Estado de la ficha tras la pasada

- `vinculos_institucionales`: <nuevo estado>.
- Justificación: ...

## Pendientes para próxima pasada

- ...
```

## Guardarraíles editoriales

1. **Sin documentos de respaldo, no entra.** Un vínculo intuido o asumido es invisible para esta skill.
2. **Cargo público formal ≠ cargo orgánico de partido ≠ nombramiento por gobierno.** Tres `VinculoInstitucional` separados si las tres dimensiones existen.
3. **El partido es una organización más, no un color.** La UI no usará colores partidistas; el modelado tampoco etiqueta "ideología", sólo `naturaleza`.
4. **Verbos prohibidos del P-09 vetados en `descripcion` y `notas`.** "Ostenta el cargo", "ocupa", "ejerce" sí; "manda", "controla", "domina" no — salvo cita literal de un Documento, marcada como tal.
5. **Vínculos familiares minimizados, pero no invisibilizados cuando son el contexto público del caso.** No usar para hijos menores, parejas no públicas, familiares sin rol propio en el caso o en cargo público. Sí puede modelarse una relación familiar entre dos figuras públicas cuando la relación es pública, aparece citada de forma central en cobertura cruzada y explica el alcance institucional o mediático del procedimiento. Precedente 2026-05-25: `begona-gomez-esposa-pedro-sanchez`, modelado porque Pedro Sánchez es figura pública, la relación es el contexto institucional explícito del caso y se documenta con respaldo N4 cruzado. Mantener minimización máxima: no añadir detalles privados accesorios.
6. **Vínculos económicos sólo con documento.** "X es proveedor de Y" exige factura/contrato/registro mercantil/sentencia. Sin documento no entra.
7. **Fechas con precisión declarada.** Si sólo se conoce el año, `desde: YYYY-01-01` + `precision_desde: anio`. No fingir precisión.
8. **`estado_publicacion: borrador` por defecto.** Al maintainer le toca elevar a `publicado` tras revisar.

## Operativa multiagéntica

Esta skill está pensada para correr en **sub-agente paralelo** lanzado por el maintainer en un `git worktree` aislado (ver [AGENTS.md — "Repositorio multiagéntico en paralelo"](../../../AGENTS.md#repositorio-multiagéntico-en-paralelo)). El sub-agente:

1. Abre sesión propia en `.git/agents/sessions/<timestamp>-documentar-vinculos-<caso>/`.
2. Valida CWD y toplevel de git antes de escribir nada. Si está en la working copy principal por accidente, corrige directorio o pide intervención.
3. Trabaja sólo en `content/vinculos/<*.yaml>`, `content/documentos/<*.yaml>` que cree, `/public/documentos/<caso>/` si descarga primarios, y `content/casos/<slug>/caso.yaml` (sólo para `estado_ficha`).
4. **NO toca** `content/personas/*.yaml`, `content/organizaciones/*.yaml`, ni `RolEnCaso`, ni el resto del caso. Si detecta inconsistencia en uno de esos, la anota en `NOTES.md` del caso para que el agente principal la revise.
5. Cierra sesión cuando el output final está completo y `pnpm validate` pasa.

## Histórico

### v1 — 2026-05-26

Primera versión moldeada tras aplicar la skill al caso `begona-gomez`.

- Añade preflight obligatorio de CWD y `git rev-parse --show-toplevel` antes de escribir, tras detectar que `vinculos-bg` trabajó parcialmente en la working copy principal por error.
- Matiza el guardarraíl de vínculos familiares: siguen minimizados, pero pueden modelarse entre figuras públicas cuando la relación sea pública, central para entender el contexto institucional del caso y esté respaldada por cobertura cruzada. Precedente: Pedro Sánchez como objeto de `begona-gomez-esposa-pedro-sanchez`.

### v0 — 2026-05-25

Primera versión. Diseñada antes de aplicarla sobre ningún caso. Se moldeará con la experiencia tras la primera pasada real, igual que `revisar-caso` v0 → v1. Candidatos a revisión tras la primera ronda:

- Si aparece patrón sistemático de "vínculo familiar relevante" con criterios ambiguos.
- Si el enum `naturaleza` se queda corto frente a casos reales (sindicatos, asociaciones de víctimas, fundaciones de cargos cesados, etc.).
- Si la regla "nombramiento por gobierno como vínculo separado del cargo" genera ruido o, al revés, descubre patrones útiles.
