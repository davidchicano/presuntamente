---
name: revisar-caso
description: Auditoría editorial cualitativa por LLM de un caso ya fichado en el inventario presuntamente.org. Cubre el hueco entre `pnpm validate` (schema mecánico) y la revisión humana final del maintainer aplicando las 10 reglas P del doc 02 + los principios irrenunciables de AGENTS.md sobre presunción de inocencia, neutralidad y trazabilidad. Output clasificado en BLOQUEANTE / SUGERENCIA / OK, sin auto-fix. Trigger cuando el usuario pide "revisa el caso X", "audita la ficha de Y", "revisa esta PR de un caso", "haz una pasada editorial sobre Z" o invoca `/revisar-caso <slug>` directamente; también para auto-revisión antes de pushear PRs grandes o ante PR externa de contribuyente.
---

# Skill `revisar-caso` — v1

## Propósito

Pasar una auditoría editorial cualitativa sobre un caso ya fichado, leyendo todos los YAMLs del caso y produciendo un informe en markdown con los hallazgos clasificados en tres niveles. **No toca código ni datos**: sólo señala, el maintainer decide.

La skill cubre exclusivamente la **capa B** del diseño de cuatro capas documentado en [ROADMAP.md → "Después de Fase 1 — antes de Fase 2"](../../../ROADMAP.md#después-de-fase-1--antes-de-fase-2):

- **Capa A — Schema / V-rules mecánicas** → ya cubierta por `pnpm validate`. Esta skill no la duplica; si la capa A falla, el caso no debería siquiera llegar a revisión editorial.
- **Capa B — Auditoría editorial cualitativa (esta skill).** Reglas P-01..P-10 del doc 02 + principios de [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables) que no son chequeables con AJV porque requieren leer texto.
- **Capa C — Verificación externa de fuentes** → diferida a v2+.
- **Capa D — Integración con PRs externas** → invocación manual con `gh pr checkout <num>` + `/revisar-caso <slug>` en local. Misma skill sirve para auto-revisión y para PR externa.

Versión `v1` (2026-05-24): 13 chequeos tras la primera iteración real sobre los 6 casos publicables del Bloque A y refinamientos posteriores. La v0 original (8 chequeos) queda documentada en (ver "Histórico"). La skill se moldea con la experiencia tras cada uso real ([AGENTS.md → "Skills locales"](../../../AGENTS.md#skills-locales-agentsskills)), añadiendo guardarraíles a la sección Histórico cuando aparezcan falsos positivos o falsos negativos.

## Inputs aceptados

- Slug de un caso ya fichado en `content/casos/<slug>/`. Ej. `/revisar-caso fiscal-general-del-estado`.
- Si no se pasa argumento, listar los casos disponibles y preguntar cuál revisar.
- Si el slug no existe en `content/casos/`, error claro (no inventar).

La skill asume que el caso ya pasa `pnpm validate` (capa A). Si no pasa, recomendar arreglar primero los errores de schema antes de gastar contexto en revisión editorial.

## Proceso

### 1. Carga del caso

Leer en disco todos los YAMLs del caso:

- `content/casos/<slug>/caso.yaml` — raíz, incluyendo `sintesis_caso` si existe.
- `content/casos/<slug>/NOTES.md` — anotaciones internas (no se publican pero pueden contener pistas útiles para entender decisiones del fichaje).
- `content/casos/<slug>/hitos/*.yaml`.
- `content/casos/<slug>/hechos/*.yaml`.
- `content/casos/<slug>/roles/*.yaml`.

Resolver las referencias cruzadas a colecciones globales:

- `content/personas/<id>.yaml` para cada `sujeto_id` con `sujeto_tipo: persona`.
- `content/organizaciones/<id>.yaml` para cada `sujeto_id` con `sujeto_tipo: organizacion` y para `organo_judicial_id`, `productor_organizacion_id`, etc.
- `content/documentos/<id>.yaml` para cada `documento_principal_id`, `documentos_relacionados[]`, `documentos_respaldo[].documento_id`.
- `content/delitos/<id>.yaml` para cada `delitos_atribuidos[]`.

**Carga adicional para CH9** (añadida en v1): listar `content/documentos/*.yaml` filtrando por `caso_principal_id == <slug>` y comparar con el conjunto de Documentos referenciados desde el caso. Cualquier Documento en disco con `caso_principal_id == <slug>` que no aparezca en las referencias del caso (Hitos, Hechos, Roles) es un huérfano candidato a CH9.

Si una referencia no resuelve (`getEntry` devuelve null), anotar como hallazgo `BLOQUEANTE` y seguir — no abortar la revisión.

### 2. Aplicación de la checklist

Aplicar los 14 chequeos de la (ver "Checklist") sobre el material cargado. Cada hallazgo se acumula con:

- `nivel`: `BLOQUEANTE` (debe arreglarse antes de publicar / mergear) · `SUGERENCIA` (mejora editorial recomendable, no bloquea) · `OK` (chequeo pasado limpiamente — se reporta sólo en el resumen final, no como entrada individual).
- `chequeo`: nombre corto del chequeo (CH1..CH10).
- `localizacion`: archivo + campo (`content/casos/X/hechos/Y.yaml → enunciado`).
- `evidencia`: cita literal del fragmento problemático (si aplica).
- `razon`: explicación breve de por qué se marca.
- `accion_sugerida`: qué cambio resolvería el hallazgo (sin aplicarlo).

### 3. Output

Informe en markdown impreso al final del turno del agente, con esta estructura:

```markdown
# Revisión editorial — caso `<slug>`

Fecha: YYYY-MM-DD
Skill: revisar-caso v1
Material revisado: <N> hitos, <N> hechos, <N> roles, <N> personas, <N> orgs, <N> docs.

## Resumen

- Bloqueantes: N
- Sugerencias: N
- Chequeos pasados limpiamente: lista de CHx OK.

## Bloqueantes

### CHx — <título del chequeo>
- **Dónde**: `content/casos/X/hechos/Y.yaml → enunciado`
- **Evidencia**: «<cita literal>»
- **Razón**: …
- **Acción sugerida**: …

(repetir por hallazgo)

## Sugerencias

(mismo formato)

## Chequeos pasados limpiamente

- CH1, CH4, CH5, CH7.
```

Si el caso es grande y la lista de hallazgos amenaza con desbordar el contexto, agrupar varios hallazgos del mismo chequeo bajo un único bloque con sub-bullets por localización.

**Agregación recomendada para CH3 y CH5** (refinamiento v1): cuando `NOTES.md` del caso ya documenta búsqueda activa del primario como `pendiente_primario`, agrupar todos los hallazgos del mismo CH bajo una única entrada `SUGERENCIA agregada` con sub-bullets, en lugar de N entradas individuales — los autos de instrucción no publicados en CENDOJ son patrón estructural en España y no aportan al maintainer leer N entradas idénticas.

## Checklist

14 chequeos tras la primera iteración del 2026-05-24 y refinamientos posteriores. Los 8 originales (CH1..CH8) del bullet del ROADMAP + CH9 (Documentos huérfanos), CH10 (Condena firme afirmada en biografía sin Documento modelado), CH11 (afectación directa/indirecta), CH12 (medios productores), CH13 (síntesis sobredimensionada o sin sujeto principal) y CH14 (atribución de dinero por sujeto + presunción de inocencia). Cada uno con qué busca, dónde lo busca y cómo clasifica.

### CH1 — Verbos prohibidos en Hechos no acreditados

**Regla**: en `Hecho.enunciado` con `tipo ∈ {investigado, atribuido, no_concluyente}`, no deben aparecer verbos que afirmen autoría sin sentencia firme: `robó`, `estafó`, `se apropió`, `desvió`, `cobró comisiones`, `blanqueó`, `defraudó`, `es culpable`, `ha cometido`, `cometió`, `delinquió`, `corrompió`, `sobornó`, `compró voluntades`, `recibió sobornos` — en cualquier forma personal (pasado, presente, perfecto).

**Excepción**: si la frase está dentro de comillas literales y se identifica como cita textual de fuente (ej. `«según el informe UCO "X cobró comisiones de Y"»`), no es hallazgo — es atribución a la fuente, no afirmación del proyecto.

**Verbos preferidos** (no se penalizan): `se investiga`, `se atribuye`, `consta en el auto X que`, `la acusación sostiene que`, `el instructor considera indiciariamente que`, `presuntamente`, `según el informe X`.

**Clasificación**: `BLOQUEANTE`.

**Referencia**: [doc 04 — "Presunción de inocencia: reglas de redacción"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción) + [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables) + doc 02 P-09.

### CH2 — Lenguaje activo afirmativo sobre personas sin condena firme

**Regla**: si en cualquier prosa (`Caso.resumen_ejecutivo`, `Caso.descripcion_corta`, `Caso.sintesis_caso.*`, `Caso.resumen_cifras`, `Hito.descripcion`, `Hecho.enunciado`, `Persona.biografia_corta`) se afirma que una persona X **hizo** una conducta delictiva en activo afirmativo (no atribuido, no condicional), tiene que cumplirse al menos una de:

- X tiene `RolEnCaso.rol = condenado_firme` en el caso revisado.
- Existe un `Hecho.tipo = acreditado` en el caso que respalda esa afirmación con `personas_implicadas` incluyendo a X.

Si no se cumple ninguna, hallazgo. Típico falso positivo: descripciones de hitos cuya prosa contextual narra hechos investigados como si estuvieran probados.

**Clasificación**: `BLOQUEANTE` cuando la afirmación atribuye conducta tipificada penalmente; `SUGERENCIA` cuando es genérica ("X mintió") sin tipificación.

**Referencia**: doc 02 P-01 + [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables).

### CH3 — Hechos con respaldo sólo N4 que no son `atribuido` ni `investigado`

**Regla**: si un `Hecho` tiene `tipo ∈ {acreditado, exculpatorio, desmentido}` pero TODOS sus `documentos_respaldo[].documento_id` apuntan a `Documento.nivel_fuente = 4` (cobertura periodística), es hallazgo. Las categorías epistémicas "fuertes" (acreditado, exculpatorio, desmentido) requieren al menos un documento N1-N3 de respaldo; N4 sólo es aceptable como complemento cruzado para `atribuido` / `investigado` (V-13).

**Excepción**: `Hecho.tipo = no_concluyente` puede tener sólo N4 (el propio tipo señala incertidumbre).

**Clasificación**: `BLOQUEANTE` cuando `tipo = acreditado`; `SUGERENCIA` cuando `tipo ∈ {exculpatorio, desmentido}` (el modelo lo permite pero conviene reforzar respaldo).

**Referencia**: doc 01 V-13 cualitativa.

### CH4 — Personas privadas mencionadas sin rol formal en el procedimiento

**Regla**: si una `Persona` aparece nominalmente (por `nombre_completo` o `nombres_alternativos`) en alguna prosa del caso (`Caso.resumen_*`, `Caso.sintesis_caso.*`, `Hito.descripcion`, `Hecho.enunciado`) y se cumple TODO:

- `Persona.es_figura_publica = false`.
- No tiene ningún `RolEnCaso` activo o pasado en el caso.
- No es familiar imputado (cubierto por rol).

Es hallazgo. La excepción de [doc 04 — "Ética"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#11-ética) sólo cubre figuras públicas y personas con rol procesal formal.

**Clasificación**: `BLOQUEANTE`.

**Referencia**: [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables) + doc 02 P-07 + [doc 04 — "Ética"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#11-ética) + V-17 + [`docs/diseno/01-modelo-de-datos.md` — "Test operativo para `es_figura_publica`"](../../../docs/diseno/01-modelo-de-datos.md#221-test-operativo-para-es_figura_publica) (test de doble carril A/B + lista de no-figuras públicas + aplicación a citas nominales en prosa sin ficha modelada).

### CH5 — Hitos sin Documento N1-N2 de respaldo

**Regla**: cada `Hito` con `tipo` jurisdiccional (`querella`, `denuncia`, `auto_imputacion`, `auto_procesamiento`, `auto_apertura_juicio_oral`, `sentencia_*`, `desimputacion`, `sobreseimiento_*`, `archivo_*`, `cambio_organo`, `cambio_juez`, `recurso_*`, `firmeza`) debería tener `documento_principal_id` apuntando a un `Documento` con `nivel_fuente ∈ {1, 2}`.

Si el `documento_principal_id` es N3 o N4, hallazgo `SUGERENCIA` (puede ser legítimo cuando el auto no está en CENDOJ — patrón ya aceptado en Plus Ultra PR2, Begoña PR1, González Amador — pero conviene revisar si existe N1 sobrevenido).

Si el `documento_principal_id` directamente no existe (Hito jurisdiccional sin documento principal), hallazgo `BLOQUEANTE` (V-14 ya lo debería bloquear en capa A, pero por si la regla está laxa para algún tipo).

**Excepción**: tipos no jurisdiccionales (`comparecencia_congreso`, `publicacion_investigacion_periodistica`, `operacion_policial`, `escrito_conclusiones_provisionales`, `informe_organismo_publico`) admiten respaldo N3-N4 sin penalización.

**Referencia**: doc 01 V-14 + lección reaplicada de Plus Ultra / Begoña / González Amador + lección Lezo 2026-05-24 (`cambio_juez` añadido al enum).

### CH6 — Incoherencia de fechas entre Hito y Documento citado

**Regla**: para cada `Hito`, comprobar:

- `Hito.fecha` no es **posterior** a `Documento.fecha_publicacion` del `documento_principal_id` (excepción razonable: el documento que documenta el hito puede tener fecha posterior si retroage — patrón ya aceptado).
- `Hito.fecha` no es **anterior en más de 5 años** a `Documento.fecha_publicacion` del `documento_principal_id` (sospechoso: el documento está demasiado lejos en el tiempo del hito).
- `Documento.fecha_documento` (cuando exista distinta de `fecha_publicacion`) es coherente con el hito.

**Clasificación**: `SUGERENCIA` por defecto (las incoherencias suelen ser tipos legítimos de la propia realidad procesal, pero merece comprobación humana).

**Referencia**: [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables) (trazabilidad) y lección Begoña PR3 sobre `fecha_documento` vs `fecha_publicacion`.

### CH7 — Ausencia de `corregido_por` cuando un Hecho posterior rebate uno anterior

**Regla**: si existen dos `Hecho` en el caso A y B donde:

- B es cronológicamente posterior a A (por la fecha del `Hito` que los respalda o por `fecha_publicacion` del documento).
- A y B tratan sobre el mismo nudo factual (heurística: solapan `personas_implicadas` significativamente y/o B aporta `tipo = exculpatorio | desmentido | acreditado` sobre el mismo enunciado que A dejó como `atribuido | investigado`).
- A no tiene `corregido_por: B` (ni `vigencia: superado`).

Es hallazgo. La detección de "mismo nudo factual" es heurística: marcar como `SUGERENCIA` y dejar que el maintainer decida si procede el `corregido_por` o son hechos distintos.

**Clasificación**: `SUGERENCIA` (la heurística genera falsos positivos; nunca `BLOQUEANTE` en v1).

**Referencia**: doc 01 V-04, V-05 + [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables) ("nunca borres información; corrige con `corregido_por`").

### CH8 — Tono "cuota política" o sectario

**Regla**: en cualquier prosa del caso, no debe aparecer:

- Lista negra de adjetivos editoriales del doc 02 P-09: `escándalo`, `trama`, `mafia`, `casta`, `chiringuito`, `cloaca`, `tinglado`, `pesebre`, `enchufismo`, `paniaguados`. Excepción: dentro de comillas literales de fuente identificada.
- Calificativos peyorativos no neutros sobre actores políticos: `corruptos`, `delincuentes`, `mafiosos`, `chorizos`, `caraduras` referidos a personas o partidos.
- Asimetría de tratamiento detectable: si el caso afecta a una formación política, frases que sólo se aplicarían a esa formación y no a su simétrica de signo contrario (heurística: presencia simultánea de adjetivos valorativos + identificadores partidistas en la misma oración).
- Lenguaje editorial valorativo en titulares de hito o resumen ejecutivo (`grave`, `gravísimo`, `inaceptable`, `imperdonable`, `vergonzoso`, `clamoroso`).

**Distinción prosa publicable vs slug interno** (añadido en v1): los términos de la lista negra detectados en **prosa publicable** (`Caso.resumen_*`, `Caso.sintesis_caso.*`, `Hito.descripcion`, `Hecho.enunciado`, `Persona.biografia_corta`, `Organizacion.descripcion_corta`, `RolEnCaso.notas` — todos estos campos se renderizan en la ficha del sitio) son `BLOQUEANTE`. En **slugs internos** (`Hecho.id`, `Hito.id`, `Rol.id`) son `SUGERENCIA`, salvo que el slug se renderice como URL anchor visible al usuario (`/casos/<slug>#hito-<slug>` con `<slug>` conteniendo "trama") — entonces vuelve a `BLOQUEANTE`.

**Clasificación**: `BLOQUEANTE` para adjetivos de la lista negra del P-09 fuera de cita literal en prosa publicable o en slugs renderizados al usuario; `SUGERENCIA` para los mismos términos en slugs internos no renderizados o para asimetría de tratamiento heurística.

**Referencia**: doc 02 P-09 y P-10 + [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables) + lección Plus Ultra 2026-05-24 ("trama" en `RolEnCaso.notas` publicable detectado como BLOQUEANTE; mismos términos en `Hecho.id` como SUGERENCIA).

### CH9 — Documentos huérfanos del caso con afirmaciones publicables

**Regla**: para cada `Documento` en `content/documentos/*.yaml` con `caso_principal_id == <slug>`, comprobar si está referenciado desde algún `Hito.documento_principal_id`, `Hito.documentos_relacionados[]`, `Hecho.documentos_respaldo[].documento_id` o cualquier otro campo del caso.

Si el Documento es **huérfano** (no referenciado desde ningún Hito/Hecho/Rol del caso), revisar `titulo` y `nivel_fuente_justificacion` en busca de:

- Afirmaciones procesales que contradigan el modelo vivo del caso (ej. afirma una revocación, archivo, condena o desimputación que el caso ya ha eliminado o rectificado).
- Atribuciones nominales de conducta delictiva a personas que el caso ha desimputado o excluido.
- Cualquier contenido cuya `estado_publicacion: borrador|publicable` y cuyo `titulo` sea afirmativo en sentido procesal.

**Clasificación**:

- `BLOQUEANTE` cuando el Documento huérfano contradice frontalmente el modelo vivo del caso. Caso real: Kitchen 2026-05-24, dos Documentos sobre una "revocación de archivo de Cospedal" que PR3 había eliminado del modelo por ser factualmente incorrecta, pero los Documentos quedaron en disco con `estado_publicacion: borrador` y `titulo` afirmativo.
- `SUGERENCIA` cuando el Documento es huérfano por oversight inocuo (su contenido no contradice nada, simplemente nadie lo referencia — puede ser candidato a `documentos_relacionados` olvidado).

**Acción sugerida estándar**:

- Si el huérfano contradice el modelo: borrar el fichero (preferible, coherente con el principio 6 — la corrección queda en `git log`, no es necesario conservar el Documento en disco), o marcar `[RETIRADO]` en `titulo` y reescribir `nivel_fuente_justificacion` documentando la retirada. La opción de borrado es la limpia.
- Si el huérfano es oversight inocuo: añadirlo a `documentos_relacionados` del Hito/Hecho correspondiente, o borrarlo si nunca fue útil.

**Referencia**: [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables) ("nunca borres información; corrige con `corregido_por` y conserva el histórico") aplicado al modelo vivo — los huérfanos contradictorios no son "historia conservada" sino contenido publicable desactualizado + lección Kitchen 2026-05-24.

### CH10 — Afirmaciones de condena firme en biografías sin Documento N1-N2 modelado

**Regla**: si en `Persona.biografia_corta` o `Organizacion.descripcion_corta` se afirma en activo afirmativo que el sujeto **fue condenado** por sentencia firme (condena penal definitiva) en cualquier procedimiento — sea el caso revisado u otro distinto — debe cumplirse al menos una de:

- Existe un `Caso` modelado en `content/casos/` donde el sujeto tiene `RolEnCaso.rol = condenado_firme`.
- Existe un `Documento` N1-N2 con la sentencia íntegra o nota CGPJ equivalente, vinculado a ese `Caso` modelado.

Si no se cumple ninguna:

- `BLOQUEANTE` si la afirmación está en activo afirmativo ("condenado por sentencia firme en X") sin atribución a fuente y sin Documento modelado.
- `SUGERENCIA` si la mención está en pasiva atribuida ("según cobertura periodística citada, habría sido condenado...") pero sigue sin Documento N1-N2 modelado — es admisible editorialmente pero conviene reforzar trazabilidad.

**Caso típico**: biografía de una persona que tiene rol en el caso revisado X y a quien la cobertura cita también como condenada firme en un caso Y ajeno no modelado en el inventario. Riesgo principal: presentar al lector una condena firme sin trazabilidad alguna en el repo, contraviniendo el principio 1 (cada afirmación con su fuente y nivel).

**Relación con CH2**: CH10 es un sub-caso explícito de CH2 (lenguaje activo afirmativo sobre conducta delictiva). Se separa como chequeo propio porque el patrón es específico de biografías cruzadas entre casos modelados y no modelados, y porque la primera pasada cualitativa (2026-05-24) demostró que el matiz se pierde si CH2 se ejecuta sólo pensando en hechos del caso revisado.

**Acción sugerida estándar**:

- Eliminar la mención del procedimiento ajeno si no aporta contexto procesal al caso revisado.
- Reformular en pasiva atribuida: «Según cobertura periodística citada en este inventario, ha sido también vinculado a otras causas ajenas al caso X —entre ellas Y y Z— procedimientos no modelados en este inventario».
- A largo plazo, si el caso ajeno es relevante: fichar el `Caso` correspondiente con su Documento N1-N2 de sentencia firme; entonces CH10 pasa a OK por la primera vía.

**Referencia**: [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables) + doc 02 P-01 + lección Lezo 2026-05-24 (biografía de Javier López Madrid afirmaba condena firme en tarjetas black sin Caso/Documento modelado en el repo).

### CH11 — Afectación directa/indirecta coherente (refactor 2026-05-27)

**Regla** (sustituye al CH11 anterior basado en `Caso.partidos_afectados[]`, ya retirado del modelo). Canon: [`docs/diseno/08-afectacion-directa-indirecta.md`](../../../docs/diseno/08-afectacion-directa-indirecta.md). Toda afectación al caso se modela vía `VinculoInstitucional` con `nivel_afectacion` adecuado.

**Qué debe estar modelado**:

- **Directa**: persona jurídica investigada (`entidad_investigada_en_caso`); perjudicado institucional formalizado (`perjudicado_institucional_en_caso`); Ministerio/Consejería del que emana el acto (`ambito_administrativo_directo_del_acto_en_caso`). Las tres exigen `nivel_afectacion: directa` + `justificacion_afectacion`.
- **Indirecta**: partido del cargo investigado (regla 2), partido del cónyuge (regla 3), partido del gobierno responsable del acto (regla 1), Ministerio del partido titular (regla 4), ente dependiente sin papel procesal. Naturaleza única: `afectacion_indirecta_en_caso` + `nivel_afectacion: indirecta` + `justificacion_afectacion`.
- **Papel procesal (NO afectación)**: acusación popular constituida (`acusacion_institucional_en_caso`), sin `nivel_afectacion`. Regla 5.

**Qué NO debe estar modelado como afectación** (lista canónica del doc 08): nombramiento histórico de cargo con autonomía formal (regla 6), militancia antigua sin cargo activo en los hechos, vínculos familiares lejanos, coincidencia geográfica/generacional, donación pasada sin relación causal.

**Clasificación**:

- `BLOQUEANTE` si un partido aparece marcado como `afectacion_indirecta_en_caso` cuando lo correcto es papel procesal (acusación popular) o ninguna afectación (regla 5 o 6 incumplida).
- `BLOQUEANTE` si una organización procesalmente investigada/perjudicada/ámbito directo carece de su `nivel_afectacion: directa` y `justificacion_afectacion` (V-22a falla silenciosamente sólo si no hay vínculo; si el vínculo existe sin esos campos, validate lo bloquea — `revisar-caso` se asegura de que el vínculo **exista**).
- `SUGERENCIA` si existe un contexto evidente de afectación indirecta no modelada (un cargo público del partido aparece como investigado en el caso, o el acto se atribuye al gobierno de un partido) y no hay vínculo `afectacion_indirecta_en_caso` correspondiente.
- `SUGERENCIA` si una organización con cargo orgánico de partido y persona investigada en el caso se marca como `afectacion_indirecta_en_caso` sin que aplique ninguna de las 4 reglas de afectación (puede ser inflación).
- `OK` si los vínculos `*_en_caso` reflejan exactamente las directas/indirectas que el doc 08 prescribe y la acusación popular figura como papel procesal sin afectación.

**Acción sugerida**: crear el vínculo `afectacion_indirecta_en_caso` o el directo correspondiente con justificación que cite la regla del doc 08 que aplica, o quitar el vínculo si infringe la regla 5 o 6. Nunca inferir afectación por simpatías genéricas; si dudas en una frontera no cubierta por las 6 reglas, marcar `SUGERENCIA` con la duda explícita y dejar que el maintainer decida.

### CH12 — Medios productores con `naturaleza_editorial` poblada

**Regla** (introducida 2026-05-26, ver [`docs/diseno/07-clasificacion-editorial-medios.md`](../../../docs/diseno/07-clasificacion-editorial-medios.md)): toda `Organizacion` con `tipo: medio_comunicacion` que aparezca como `Documento.productor_organizacion_id` en el caso debería tener al menos `naturaleza_editorial` poblada.

- `SUGERENCIA` si un medio citado en el caso no tiene `naturaleza_editorial`. Acción: añadir el campo con el valor adecuado del enum.
- `OK` si todos los medios productores citados tienen al menos naturaleza poblada.

**Orientación editorial declarada/percibida queda como nota informativa**, no bloqueante: su poblado depende de la disponibilidad de cita verificable y de fuentes externas reputadas (`reuters_institute`, `cis`, `estudio_academico_revisado`, `clasificacion_iniciativa_publica`). Sin esas, `sin_clasificar` es legal.

### CH13 — `sintesis_caso.que_se_investiga` como mini-resumen ejecutivo o sin sujeto principal

**Regla**: `Caso.sintesis_caso.que_se_investiga` es una entradilla accesible, no otro resumen ejecutivo. Debe responder al objeto de investigacion en una frase breve. Es hallazgo si:

- Tiene longitud parecida o superior a `descripcion_corta` o `resumen_cifras`.
- Acumula en el mismo campo auto, fecha, registro policial, importes concretos, nombres secundarios y causa paralela.
- Duplica de forma sustantiva lo que ya aparece en `hechos_clave`, `estado_actual` o `cifras_clave`.
- El nombre mediatico del caso gira sobre una persona con rol formal y la sintesis no la nombra ni justifica la omision.

**Accion sugerida**: compactar `que_se_investiga` a objeto investigado + cautela procesal, nombrando al sujeto principal si explica el nombre mediatico, y mover o conservar el detalle en `hechos_clave`, `estado_actual`, `cifras_clave` o `descripcion_corta`.

**Clasificación**: `SUGERENCIA` por defecto; `BLOQUEANTE` si la longitud, la abstraccion o la acumulacion de detalles produce una lectura confusa o contradice el resumen ejecutivo.

**Referencia**: [`docs/web/features/sintesis-caso.md`](../../../docs/web/features/sintesis-caso.md), aprendizaje Leire Diez 2026-05-28.

### CH14 — Atribución de dinero por sujeto (`importe_atribucion`) y presunción de inocencia

**Regla**: para cada `Hecho` con `importe_atribucion`, verifica:

1. **V-24** — cada `{sujeto, sujeto_tipo}` figura en `personas_implicadas`/`organizaciones_implicadas` del mismo Hecho. `BLOQUEANTE` si no (también lo bloquea `pnpm validate`, pero confírmalo).
2. **V-25** — `papel ∈ {activo, beneficiario, perjudicado}` ⇒ `importe_clase: objeto`; `papel ∈ {obligado, acreedor}` ⇒ `importe_clase: consecuencia`. `BLOQUEANTE` si no casan.
3. **Presunción de inocencia en la atribución**:
   - `activo` designa **conducta atribuida, NO percepción**. Si el `enunciado` o una nota da por hecho que el sujeto se quedó el dinero, `BLOQUEANTE`.
   - `beneficiario` solo cuando el documento respalde indiciariamente que **recibió o se le adjudicó** el dinero. Marcarlo sin ese respaldo → `SUGERENCIA`.
   - El quebranto de una víctima (`perjudicado`) **nunca** se atribuye al investigado. Si una víctima clara (erario, entidad pública, empresa defraudada) figura como `activo`/`beneficiario`, o un investigado como `perjudicado`, `BLOQUEANTE`.
4. **Rojo = condena**: el rojo en cifras (ver [DESIGN.md — "Sistema de badges"](../../../DESIGN.md#2bis-sistema-de-badges)) sólo procede en dinero `acreditado` por resolución firme del lado responsable; una cifra `investigado`/`atribuido` no debe llegar a renderizarse en rojo.

**Clasificación**: como arriba. **Referencia**: [doc 01 §2.6](../../../docs/diseno/01-modelo-de-datos.md#26-hecho) (papeles, V-24/V-25), [ficha importe-presunto](../../../docs/web/features/importe-presunto.md), [doc 04 §3](../../../docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción).

## Guardarraíles obligatorios

1. **No auto-fix.** La skill **sólo señala**. Nunca edita YAMLs, nunca abre commits, nunca hace `git add`. Las acciones sugeridas se redactan en prosa para que el maintainer las aplique manualmente. Esto es una norma dura del diseño: el LLM no decide qué se publica.

2. **No `git push`.** El agente que ejecuta la skill no debe hacer push aunque la auditoría salga limpia ([AGENTS.md → "Workflow de rama y PRs"](../../../AGENTS.md#workflow-de-rama-y-prs), norma reforzada el 2026-05-21).

3. **Falsos positivos son aceptables.** La capa B asume ruido; mejor sobre-marcar y dejar que el maintainer descarte, que pasar por alto. Si un hallazgo es dudoso, clasificar como `SUGERENCIA` y describir la duda.

4. **No inventar fuentes.** Si la skill cree que falta un respaldo o que existe una versión oficial mejor del documento, **no buscarla en la web** ni proponer URLs concretas — eso es trabajo de `investigar-caso` / `incorporar-hito`. La skill se limita a señalar que el respaldo actual es insuficiente.

5. **No mezclar capas.** Si durante la revisión se detecta un error de schema (capa A) que `pnpm validate` no estaba capturando, anotarlo en el informe pero **no arreglarlo** ni proponer cambios al schema — abrir incidencia separada con el maintainer.

6. **Lectura íntegra del caso, no muestreo.** v1 lee todos los YAMLs del caso + todos los `Documento` con `caso_principal_id == <slug>` (incluidos huérfanos para CH9). Si el caso es muy grande y el contexto amenaza con desbordarse, **avisar al maintainer** y proponer revisión por bloques (hitos / hechos / roles por separado) en vez de saltarse archivos silenciosamente. En la primera pasada del 2026-05-24 esto se resolvió lanzando un sub-agente `general-purpose` por caso, lo que permite revisar 6 casos en paralelo sin contaminar el contexto principal.

7. **NOTES.md del caso es lectura, no escritura.** La skill puede leer `content/casos/<slug>/NOTES.md` para entender decisiones editoriales previas (por qué tal hecho está como `atribuido` y no `acreditado`, etc.), pero **no debe escribirlo**. Las notas las gestiona el maintainer o la skill `incorporar-hito`.

8. **Carga del contexto antes de aplicar checks.** Antes de empezar a evaluar, leer en orden: [AGENTS.md → "Principios irrenunciables"](../../../AGENTS.md#principios-irrenunciables) + [AGENTS.md → "Documentos primarios descargados"](../../../AGENTS.md#documentos-primarios-descargados-a-publicdocumentos), [doc 02 — "Reglas anti-desinformación en presentación"](../../../docs/diseno/02-ficha-de-caso.md#4-reglas-anti-desinformación-en-presentación) (reglas P), y el `NOTES.md` del caso si existe. No saltar este paso aunque parezca redundante con el frontmatter de la skill: las reglas P y los principios pueden haberse afinado desde la última versión de la skill.

## Output esperado

Mensaje final al usuario con:

1. El informe markdown completo (estructura de "Proceso", apartado 3).
2. Recordatorio explícito de que la skill **no ha tocado ningún archivo** y que las acciones sugeridas requieren intervención manual del maintainer.
3. Si hay hallazgos `BLOQUEANTE`, una nota al final advirtiendo que el caso **no está listo para publicar / mergear** hasta que se resuelvan.
4. Si la skill encontró cosas que no encajan en ninguno de los 13 chequeos pero le parecen relevantes editorialmente, una sección final `## Observaciones fuera de checklist` con esos hallazgos marcados explícitamente como heurísticos. Esta sección alimenta la iteración de la skill (ver "Iteración").

## Iteración

Tras cada uso real de la skill, añadir una entrada en `## Histórico` con:

- Slug del caso revisado (o lista de casos si la pasada cubre varios en paralelo).
- Fecha.
- Resumen cuantitativo de hallazgos (`N bloqueantes, M sugerencias`).
- **Falsos positivos detectados**: chequeos que marcaron algo que el maintainer juzgó correcto. Si el falso positivo se repite, refinar la regla del chequeo en este SKILL.md.
- **Falsos negativos detectados**: cosas que el maintainer encontró mal en revisión humana posterior y que la skill no marcó. Si un patrón se repite, añadir un nuevo chequeo (CH11, CH12...) o ampliar uno existente.
- **Heurísticas que merecen promocionarse**: si la sección `Observaciones fuera de checklist` revela un patrón reincidente, codificarlo como chequeo formal.

La skill sigue el patrón de [AGENTS.md → "Skills locales"](../../../AGENTS.md#skills-locales-agentsskills): se moldea con la experiencia, no se diseña perfecta upfront. v0 fueron 8 chequeos; v1 crece con guardarrailes promocionados a CH9..CH13; v2 puede incorporar nuevos candidatos cuando se confirme reincidencia, o la capa C (verificación externa de fuentes).

## Histórico

### 2026-05-24 — Primera pasada cualitativa sobre los 6 casos publicables del Bloque A

- **Casos revisados**: plus-ultra · begona-gomez · gonzalez-amador · fiscal-general-del-estado · kitchen · lezo. Lanzados en paralelo en 6 sub-agentes `general-purpose` conforme al patrón de [AGENTS.md → "Repositorio multiagéntico en paralelo"](../../../AGENTS.md#repositorio-multiagéntico-en-paralelo) para no contaminar el contexto principal con la lectura íntegra de los 6 casos.
- **Volumen agregado revisado**: ~60 hitos, ~50 hechos, ~95 roles, ~50 personas, ~50 organizaciones, ~90 documentos.
- **Hallazgos**: 3 BLOQUEANTES + 39 SUGERENCIAS + 25 observaciones fuera de checklist.
- **Bloqueantes resueltos por el maintainer en la misma sesión**:
  1. `content/casos/plus-ultra/roles/julio-martinez-sola-investigado.yaml → notas`: «contra terceros de la trama» → «contra otros investigados de la presunta estructura» (CH8).
  2. `content/documentos/`: eliminados dos Documentos huérfanos sobre una revocación de archivo Cospedal/López del Hierro inexistente, que PR3 había eliminado del modelo por ser factualmente incorrecta. Patrón nuevo, motivó el chequeo CH9.
  3. `content/personas/javier-lopez-madrid.yaml → biografia_corta`: reformulación con atribución a cobertura periodística sobre causas ajenas (tarjetas black, Púnica) no modeladas en el inventario. Patrón nuevo, motivó el chequeo CH10.
- **Falsos positivos detectados**: ninguno bloqueante. Hay ruido alto en CH5 y CH3 cuando los autos de instrucción no están en CENDOJ — la clasificación como SUGERENCIA es correcta (patrón estructural en España, ya aceptado en `NOTES.md` de los 6 casos). **Refinamiento operativo aplicado**: cuando `NOTES.md` ya documenta búsqueda activa del primario como `pendiente_primario`, agrupar los hallazgos del mismo CH bajo una única entrada `SUGERENCIA agregada` con sub-bullets por localización, en lugar de N entradas individuales. Documentado en "Proceso", apartado 3 ("Output").
- **Falsos negativos detectados que motivan chequeos nuevos** (promocionados a v1):
  - **CH9** — Documentos huérfanos del caso con afirmaciones publicables. Caso real: Kitchen (dos `Documento` sobre revocación inexistente quedaron en disco tras eliminar el Hito/Hecho asociados en PR3).
  - **CH10** — Afirmaciones de condena firme en biografías sin Documento N1-N2 modelado. Caso real: Lezo (biografía López Madrid afirma condena firme en tarjetas black, caso no modelado).
- **Refinamientos a chequeos existentes** (aplicados en v1):
  - **CH5**: añadido `cambio_juez` al enum de tipos jurisdiccionales que activan el chequeo (caso Lezo: `cambio-juez-velasco-castellon-lezo-2017-07-01` sin `documento_principal_id`).
  - **CH5**: añadido `informe_organismo_publico` al enum de excepciones no jurisdiccionales (caso Kitchen: `informe-asuntos-internos-kitchen-2020-07-29`).
  - **CH8**: documentada explícitamente la distinción entre prosa publicable (BLOQUEANTE) y slug interno (SUGERENCIA), tras el caso Plus Ultra donde "trama" apareció en `RolEnCaso.notas` publicable + en dos `Hecho.id` slugs con clasificación distinta.
- **Candidatos a chequeos futuros** pendientes de promoción hasta confirmar reincidencia (observados una vez):
  - Coherencia temporal entre `Rol.fecha_inicio` y `Hito[id=hito_origen_id].fecha`. Caso observado: Lezo (8 roles con desencaje sistemático — roles de piezas Navalcarnero/Inassa apuntando al hito de Emissao porque el hito propio de cada pieza no está modelado).
  - Consistencia entre `Hecho.personas_implicadas` y `Hito.personas_afectadas` de los hitos que respaldan el hecho. Caso observado: Lezo (Hito Emissao sin Edmundo Rodríguez Sobrino en `personas_afectadas` pese a citarlo en `descripcion`).
  - Coherencia entre `Hito.fecha` y `Hito.fecha_precision` (convención: `fecha_precision: mes` exige día 01). Caso observado: Kitchen (`imputacion-cospedal-kitchen-2019-09-09.yaml` con `fecha_precision: mes` rompe la convención del resto de hitos con `precision: mes`).
  - Campos canónicos con valor placeholder "(pendiente de confirmar)" que pasan schema pero no son dato. Casos observados: Plus Ultra y Begoña Gómez (`Caso.numero_procedimiento`).
- **Output método**: 6 sub-agentes paralelos `general-purpose` invocados con prompts autocontenidos por caso. Coste agregado aproximado: ~700K tokens, ~30 min wall-clock. Aceptable como pasada completa pre-launch. Para PRs externas individuales basta con una sola invocación de la skill por el agente principal sin paralelización.
