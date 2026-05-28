---
name: actualizar-caso
description: Actualiza un Caso del inventario presuntamente.org ya fichado, descubriendo qué ha pasado desde el último Hito catalogado. Hace barrido de actualidad en profundidad sobre el caso (varias líneas editoriales, varias queries, ventana 1-3 meses), clasifica cada novedad en Hito nuevo / actualización de Hito existente / Hecho nuevo / NOTES.md / RelacionEntreCasos / descarte, y produce los YAMLs + actualización de NOTES.md listo para revisión. Trigger cuando el usuario pide "actualiza el caso X", "qué ha pasado últimamente en el caso Y", "hay revuelo en Z y no sé qué hitos hay", "barrido de actualidad sobre <caso>", o "incorpora las novedades de <caso>". Pensada para correr en sub-agente paralelo a la sesión principal, en un git worktree dedicado. Se usa cuando NO hay PDF concreto en mano (eso es `/incorporar-hito`) y NO se está arrancando un caso desde cero (eso es `/investigar-caso`): el caso ya tiene slug y al menos un Hito previo.
---

# Skill `actualizar-caso` — v1

## Propósito

Tomar el slug de un Caso **ya catalogado** en el inventario y producir un borrador de cambios que recoja la actividad nueva desde el último Hito catalogado: hitos procesales, datos económicos del sumario, ampliaciones del objeto, conexiones con otros casos del inventario, operaciones policiales, sentencias o autos sobrevenidos.

Cubre el hueco que dejan las dos skills hermanas:

- [`/investigar-caso`](../investigar-caso/SKILL.md) arranca un caso desde cero (sin slug).
- [`/incorporar-hito`](../incorporar-hito/SKILL.md) procesa un PDF concreto ya en mano hacia un caso existente.

Esta skill empieza con menos información que `/incorporar-hito` (no hay PDF concreto) y más estado previo que `/investigar-caso` (el caso ya tiene historia que respetar). La tarea editorial central es **descubrir** qué falta, no modelar lo que ya está.

Versión `v1`: nace de la sesión 2026-05-28 (primer ciclo de actualidad post-launch sobre Plus Ultra). La skill se moldea con cada uso ([AGENTS.md → "Skills locales"](../../../AGENTS.md#skills-locales-agentsskills)).

## Inputs aceptados

- Slug del Caso (`plus-ultra`, `leire-diez`, `begona-gomez`, etc.). Obligatorio.
- Ventana temporal opcional (por defecto: desde la `fecha` del último Hito del caso hasta hoy). El maintainer puede acotar (`--ventana=72h`, `--desde=2026-05-20`).
- Acotación opcional a un sub-tema (`--tema="sumario"`, `--tema="ampliacion-objeto"`).

Si el slug no existe en `content/casos/`, **no inventes**: reporta error y propón usar [`/investigar-caso`](../investigar-caso/SKILL.md) en su lugar.

## Proceso

### 1. Lectura preparatoria obligatoria

Antes de cualquier WebSearch, lee y comprende:

- `content/casos/<slug>/caso.yaml` — estado actual del caso, fase, órgano titular, relevancia editorial.
- `content/casos/<slug>/hitos/*.yaml` (ordenados por fecha desc) — qué está modelado y qué no. Identifica la fecha del último hito (`última fecha conocida`).
- `content/casos/<slug>/hechos/*.yaml` — hechos vigentes, no propongas hechos que ya existen.
- `content/casos/<slug>/roles/*.yaml` — personas con rol procesal formal y vigente.
- `content/casos/<slug>/NOTES.md` — **especialmente** la sección "Pendientes" o equivalente: ahí están las decisiones del maintainer sobre qué se modela y qué no, y los pendientes que esta pasada puede ayudar a cerrar.
- `ROADMAP.md` — bullet del caso en la tabla "Fase 2 y casos" (si existe). Lo que el maintainer espera próximamente.

Lista en tu reporte la "última fecha conocida" y los pendientes abiertos del caso. Tu trabajo es discriminar qué de lo que aparezca en cobertura es novedad real frente a lo ya catalogado.

### 2. WebSearch en profundidad — guardarraíl de robustez

**Aprendizaje 2026-05-28 (sesión Plus Ultra + Leire Díez):** una sola búsqueda no basta. La cobertura mediática de cualquier caso del inventario suele tener cuatro o cinco capas que sólo se ven cruzando líneas editoriales y queries específicas. Hacer pocas búsquedas produce diagnósticos superficiales del tipo "sólo confluencia mediática" cuando hay vínculo funcional documentado.

Mínimos obligatorios:

- **3 queries de cobertura general** en al menos 3 líneas editoriales distintas (centro-izquierda, centro-derecha, independiente latinoamericano focused en España). Ejemplo: `eldiario.es`, `vozpopuli.com`, `infobae.com/espana`. Si el caso es de un partido concreto, **busca explícitamente cobertura del partido contrario** para ver qué cuenta y qué no.
- **1 query sobre el órgano judicial titular** (`poderjudicial.es` para notas CGPJ + nombre del magistrado instructor).
- **1 query sobre BOE** si el caso tiene componente normativa.
- **1 query cruzada con CADA caso del inventario que el caso pueda tocar** (ver paso 4 para el método). Si el caso es plus-ultra, hay que buscar explícitamente Plus Ultra + Koldo, Plus Ultra + Begoña Gómez, Plus Ultra + Leire Díez, etc.

Filtra resultados sospechosos:

- **Notas de agencia (EFE, Europa Press) sin valor editorial propio** no cuentan como línea editorial. Si Diario Libre y Menorca.info publican la misma nota EFE, es **una** fuente, no dos. Verifica el nombre del autor o el cierre "EFE / Europa Press" antes de aceptar.
- **Mirrors no auditables** (Wuolah, Scribd, blogs personales) no son fuente válida para `Documento`, aunque parezcan íntegros. Si la única vía pública a un primario es un mirror no auditable, anota en NOTES como `pendiente_primario` y **NO** modeles el documento ([AGENTS.md → "Documentos primarios descargados"](../../../AGENTS.md#documentos-primarios-descargados-a-publicdocumentos), regla del 2026-05-24).
- **Sumarios bajo secreto absoluto**: si el último Hito procesal acordó secreto de sumario, lo que se publica sobre contenido del sumario es **filtración periodística sin auto que lo confirme**. NO modeles como Hito; anota en NOTES como pendiente del auto que confirme la línea.

### 3.bis. Cascada sobre estado previo del caso — guardarraíl de coherencia

**Aprendizaje 2026-05-28 (sesión Plus Ultra + Leire Díez).** Cuando incorporas un Hito nuevo o un dato procesal sobrevenido, la novedad puede invalidar prosa publicada hace semanas que el lector ve hoy. El principio operativo es simple:

> **Después de incorporar la novedad, relee el `caso.yaml` entero. Ningún campo está exento de revisión por defecto.** A continuación revisa Roles vigentes, Hitos previos, NOTES y biografías de personas con rol formal afectado.

La tabla siguiente lista los campos clasificados por **probabilidad real de cambio** tras una pasada de actualización. Úsala como checklist, no como filtro: tu obligación es revisar todo el `caso.yaml`, no sólo lo que aparece aquí.

#### `caso.yaml` — Casi siempre cambian

| Campo | Cuándo y cómo |
|---|---|
| `sintesis_caso.estado_actual` | Cualquier hito procesal (auto, cambio de órgano, sentencia, archivo, aplazamiento, registro policial, imputación, desimputación) → actualizar a la fase actual real |
| `ultima_revision_editorial` | **Siempre** al cerrar la pasada |
| `estado_ficha.fecha_actualizacion` | Misma fecha que `ultima_revision_editorial` |
| `estado_ficha.*` | Si la pasada cierra checks `pendiente` o avanza un `parcial` → ajustar; si la pasada abre líneas nuevas (conexiones, cobertura, vínculos), también |

#### `caso.yaml` — Frecuentes según el tipo de hito

| Campo | Cuándo y cómo |
|---|---|
| `sintesis_caso.hechos_clave` | Si el hito introduce uno de los 2-4 hechos más relevantes del caso, sustituye o añade (límite del schema) |
| `sintesis_caso.que_se_investiga` | Si el hito amplía o restringe el objeto de la investigación |
| `sintesis_caso.cifras_clave` | Si el hito documenta cifras nuevas (importes, transferencias, plazos) |
| `resumen_cifras` | Como `cifras_clave` pero en campo descriptivo libre |
| `fase_actual` | Si el hito transita la causa (`instruccion` → `fase_intermedia` → `juicio_oral` → `sentencia_primera_instancia` → `recurso` → `sentencia_firme` → `ejecucion`/`archivo_*`) |
| `delitos_atribuidos_en_la_causa` | Si el hito amplía la calificación (auto que añade delitos) o la restringe (auto de archivo parcial). Mantener slugs existentes en `content/delitos/` |
| `nombres_alternativos` | Si la prensa empieza a denominar al caso de otra forma (apareció "caso Hirurok" como alias durante la cobertura mayo 2026 en `leire-diez`). Conservar nombres preexistentes salvo justificación |
| `descripcion_corta` | Si el hito cambia el alcance, el ámbito o el peso narrativo del caso |
| `nivel_relevancia_editorial` | Si el caso pasa a ser objeto de cobertura masiva (decisión del maintainer; en duda, no tocar) |

#### `caso.yaml` — Raros pero posibles

| Campo | Cuándo y cómo |
|---|---|
| `organo_judicial_id` | Si hubo `cambio_organo`. Es lo que hace que la cabecera del caso muestre el órgano correcto |
| `ponente_actual_id` | Si cambia el magistrado instructor/ponente |
| `numero_procedimiento` | Cuando aparece formalmente (p. ej. "DP 96/2017" tras el primer auto público) |
| `tipo_procedimiento` | Cuando transita (`diligencias_previas` → `procedimiento_abreviado` → `sumario_ordinario` → `tribunal_jurado`); también si entra en `causa_especial_aforado` por aforamiento sobrevenido o en `recurso_amparo_tc`/`recurso_casacion_ts` |
| `querellante_inicial_id` | Casi nunca; sólo si se descubre que la apertura procesal tenía otro origen del registrado |
| `origen_denuncia` | Casi nunca; sólo si la lectura del primer hito corrige la fuente del registro inicial |
| `caso_padre_id` + `tipo_pieza` | Si el procedimiento pasa a ser pieza separada de otro caso ya catalogado |
| `fecha_apertura` | Casi nunca; sólo si se descubre que la fecha registrada era estimativa y aparece el dato exacto |
| `fecha_cierre` | Cuando el caso se cierra (archivo o sentencia firme) |
| `nombre_oficial` | Si la denominación oficial del procedimiento cambia (poco frecuente) |
| `nombre_mediatico` | Casi nunca; sólo si el caso adquiere un nombre mediático distinto del registrado |
| `estado_publicacion` | Si la madurez editorial avanza (`borrador` → `beta_publica` → `publicado`) o si se retira |
| `estado_ficha.notas` | Si justificas por qué un check sigue siendo `parcial` o `pendiente` |

#### Más allá de `caso.yaml`

| Capa | Campo | Cuándo y cómo |
|---|---|---|
| `RolEnCaso` | `notas` (publicable) | Si el hito modifica una fecha procesal mencionada (declaración fijada → aplazada), una condición cautelar, o el estado del rol |
| `RolEnCaso` | `delitos_atribuidos` | Si el hito amplía o reduce la calificación de esa persona en concreto |
| `RolEnCaso` | `fecha_fin` + `hito_cierre_id` | Si el hito es desimputación, absolución, condena firme o archivo: cerrar el rol previo y abrir el rol sucesor |
| Hitos previos | `descripcion` | Si la pasada anterior dejó "menciones provisionales" que ahora tienen Hito propio (p. ej. PU 27-may dejó el aplazamiento como nota dentro del hito de imputación; PU 28-may creó hito propio y la nota previa quedó redundante) |
| `Persona` | `biografia_corta` | Si la persona estrena rol (nuevo investigado) o cambia de estado procesal en este caso. Mantener el lenguaje de presunción de inocencia |
| `Persona` | `cargos_publicos_historicos[]` | Si la cobertura precisa fechas de mandato o cargos no registrados (p. ej. corrección Fernández Guerrero en esta sesión: presidente jun-2018/oct-2019 + funciones ejecutivas hasta abr-2021) |
| `Documento` | `url_archivo` | Si ya hay mirror en archive.org y se está rellenando. Si no, ejecutar `pnpm archive:catchup` luego |
| `Organizacion` | ficha completa | Si un medio productor o un órgano nuevo apareció en la pasada; verifica que tiene `naturaleza_editorial` o el tipo apropiado |
| `NOTES.md` del caso | Sección nueva | Siempre. Tachar pendientes resueltos por esta pasada; abrir pendientes nuevos identificados |

#### Procedimiento operativo

1. **Lee el `caso.yaml` entero** después de aplicar los hitos/hechos nuevos. Lo lees como si fueras un lector externo: ¿algo suena obsoleto?
2. **Lista los campos potencialmente afectados** en tu reporte (checklist explícita).
3. **Para cada campo**, decide: `actualizar` / `dejar igual` / `pendiente humano` (con motivo).
4. **Aplica las actualizaciones** con lenguaje neutro y presunción de inocencia. **No aproveches la pasada para reescribir prosa** más allá de lo que la novedad justifica — es una pasada de actualización, no un rewrite editorial.
5. **Reporta al final** qué cascada se aplicó y qué se dejó intacto, con el motivo en cada caso.

Esto vale tanto para `/actualizar-caso` como para [`/incorporar-hito`](../incorporar-hito/SKILL.md): añadir un Hito sin revisar la cascada produce fichas internamente contradictorias (un caso cuyo `estado_actual` dice "declaración prevista 2 de junio" y cuyo último hito catalogado es el aplazamiento al 17-18 de junio).

### 3. Identificación de candidatos

Para cada novedad detectada en el barrido, propón una clasificación:

| Categoría | Cuándo | Acción |
|---|---|---|
| **Hito nuevo** | Documento primario nuevo (auto, sentencia, BOE, nota CGPJ); operación policial autorizada por auto; cambio de órgano titular; cambio de fase procesal | Crear `content/casos/<slug>/hitos/<id>.yaml` + `Documento` + `Hecho`s derivados |
| **Hito nuevo N4** | Hecho procesal relevante sin primario localizable, con V-13 cumplido (dos N4 líneas distintas) y sin estar bajo secreto del sumario | Crear Hito con `documento_principal_id` N4, anotar pendiente del primario en NOTES |
| **Actualización descripción de Hito existente** | Datos sobrevenidos (aplazamientos, cambios de fecha de declaración) que matizan un Hito ya catalogado pero no merecen Hito propio | Edit del Hito existente añadiendo párrafo con la cobertura cruzada |
| **Hecho nuevo asociado a Hito existente** | Hecho concreto investigado/atribuido derivado de un primario ya catalogado, no modelado todavía | Crear `Hecho` con `documentos_respaldo` apuntando al primario |
| **Anotación a NOTES.md** | Filtración del sumario bajo secreto; datos económicos cuantitativos sin primario; ampliaciones del objeto sin auto que las confirme | Sección nueva en NOTES con cobertura citada y motivo del no-modelado |
| **`RelacionEntreCasos`** | Cobertura cruzada con otro caso del inventario que comparte persona, organización o evento | Verificar paso 4. Si procede, crear `content/relaciones-entre-casos/<id>.yaml` con `nexo` documentado |
| **Descarte** | Ruido, opinión política, especulación de tertuliano, fuente única no cruzada | Anotar brevemente en el reporte el motivo del descarte, no modelar |

### 4. Cruce explícito con otros casos del inventario — guardarraíl crítico

**Aprendizaje 2026-05-28**: una skill anterior diagnosticó la confluencia mediática entre Plus Ultra y Leire Díez como "sólo coincidencia de actualidad". Al investigar más en profundidad, se vio que Vicente Fernández Guerrero (presidente SEPI 2018-2019, director general hasta abr-2021) está imputado en Leire por presuntas comisiones SEPI 2021-2023, y Plus Ultra es el rescate SEPI de 2021. **Hay vínculo funcional documentado**. La conclusión "sin vínculo" era prematura.

Método para evitar el falso negativo:

1. **Lista los otros casos del inventario** con `ls content/casos/`.
2. **Por cada caso candidato a vínculo**, lee su `caso.yaml` + último estado de NOTES.md.
3. **Cruza explícitamente**: ¿hay alguna `Persona` imputada en ambos? ¿alguna `Organizacion` directamente afectada en ambos? ¿comparten época y vehículo institucional (FASEE, SEPI, contratos públicos, etc.)?
4. **Verifica con WebSearch** cualquier nexo identificado: que la prensa documente el solapamiento, no es inferencia tuya. Cita.
5. Si el nexo se confirma, propón `RelacionEntreCasos` con `tipo` apropiado del schema (`vinculo_funcional`, `causa_conexa`, `comparte_investigado`, etc.; verifica enum vigente) y `nexo` describiendo la persona o organización pivote con cita de fuente.
6. **No fuerces conexiones políticas** ("ambos casos afectan al PSOE" no es un nexo procesal — eso es contexto político, no `RelacionEntreCasos`). Sólo nexos formales o funcionales documentables.

Cuando una skill descubre un nexo nuevo, **propón también añadirlo al NOTES.md del otro caso** (sección "Cruce con caso `<slug>`") como acción adicional, para que la trazabilidad sea bidireccional.

### 5. Generación del borrador

Produce los YAMLs en disco bajo:

- `content/casos/<slug>/hitos/<id>.yaml` por cada Hito nuevo.
- `content/casos/<slug>/hechos/<id>.yaml` por cada Hecho derivado.
- `content/documentos/<id>.yaml` por cada Documento nuevo.
- `content/organizaciones/<id>.yaml` si necesitas medios o entidades nuevas. Verifica primero `ls content/organizaciones/` para no duplicar.
- `content/personas/<id>.yaml` sólo si hay rol procesal formal nuevo. Verifica primero.
- `content/casos/<slug>/roles/<id>.yaml` para roles nuevos. NO cierres roles existentes salvo que la cobertura lo soporte con primario.
- `content/relaciones-entre-casos/<id>.yaml` por cada nexo confirmado.

Actualiza `content/casos/<slug>/NOTES.md` añadiendo una sección nueva con fecha del barrido. **No reescribas el NOTES.md**: añade, no sobrescribas. Si un pendiente queda resuelto por esta pasada, marca el item con tachado y enlace al hito que lo cierra.

### 6. Reporte de cierre

Al volver, entrega un reporte estructurado:

- Lista de archivos creados/modificados (rutas relativas).
- Decisiones tomadas con su justificación corta (tipo de Hito usado, fuentes elegidas vs descartadas, vínculos con otros casos confirmados/descartados).
- Pendientes nuevos identificados (descrito en NOTES).
- Errores o ambigüedades que requieren decisión del agente principal o del maintainer.
- Validaciones del modelo (V-04, V-05, V-12, V-13, V-14) marcadas como verificadas o pendientes.

## Guardarraíles obligatorios

1. **NUNCA `Hecho.tipo = acreditado`** sin sentencia firme y revisión humana explícita. Sólo `investigado`, `atribuido` o `no_concluyente`.

2. **NUNCA inventes**. Si un dato no está en la cobertura cruzada o en un primario, déjalo vacío con comentario YAML inline y repórtalo como pendiente.

3. **Presunción de inocencia obligatoria** en toda la prosa generada. Verbos preferidos: "se investiga", "se atribuye", "consta en el auto", "según la cobertura periodística". Prohibidos: "robó", "estafó", "se apropió" para hechos no acreditados. Ver [doc 04 — "Presunción de inocencia: reglas de redacción"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción).

4. **V-13 inviolable**. Cada Hecho con `nivel_fuente_efectivo: 4` necesita dos `documentos_respaldo` en líneas editoriales distintas. Notas de agencia EFE/Europa Press no cuentan como línea propia.

5. **Sumario bajo secreto**: si la cobertura cita contenido del sumario y el último Hito acordó secreto, NO modelar como Hito ni Hecho. Anotar en NOTES como pendiente del auto que confirme la línea.

6. **Familiares no implicados**: no incluyas como `Persona` ni los nombres en la descripción de Hitos. Ver [doc 04 — "Ética"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#11-ética). Si la cobertura los menciona, anótalo en NOTES y espera a que un auto les atribuya rol formal.

7. **NO descargas PDFs grandes** ni los pones en `/public/documentos/`. Eso es decisión del maintainer o tarea de [`/incorporar-hito`](../incorporar-hito/SKILL.md) cuando hay PDF concreto.

8. **NO `git add` ni `git commit`**. Trabajas en working tree. El maintainer decide commit al cierre de sesión.

9. **No fuerces hitos para mover el orden del home**. Si la mecánica del home (último hito + relevancia + `pin_destacado`) no coloca el caso donde el maintainer espera, la solución editorial es `pin_destacado`, no fabricar Hitos sobre filtraciones.

10. **No concluyas "sin vínculo" entre casos sin cruzar personas/orgs explícitamente** (paso 4).

## Errores comunes a evitar

Heredados de sesiones anteriores:

- **Aceptar la primera lectura de la cobertura** sin cruzar líneas editoriales. Aprendizaje 2026-05-28.
- **Modelar hito sobre filtración del sumario** bajo secreto. Aprendizaje 2026-05-27.
- **Confundir agencias EFE con líneas editoriales distintas**. Aprendizaje 2026-05-28.
- **Modelar `RolEnCaso` para personas mencionadas en cobertura sin imputación formal**. Aprendizaje 2026-05-23.
- **Forzar `Hecho.tipo = acreditado`** desde cobertura periodística sin sentencia firme.
- **Asumir conexión política como vínculo procesal**. "Ambos casos afectan al PSOE" no es `RelacionEntreCasos`.

## Recursos clave

- [`AGENTS.md`](../../../AGENTS.md) — principios irrenunciables, `DominiosOficiales`, documentos primarios descargados.
- [`docs/diseno/01-modelo-de-datos.md`](../../../docs/diseno/01-modelo-de-datos.md) — V-01..V-21 (especialmente V-04, V-05, V-12, V-13, V-14, V-16, V-17).
- [`docs/diseno/02-ficha-de-caso.md`](../../../docs/diseno/02-ficha-de-caso.md) — P-01..P-10.
- [`docs/diseno/04-riesgos-legales-y-eticos.md`](../../../docs/diseno/04-riesgos-legales-y-eticos.md) — Ética, presunción de inocencia, anonimización.
- [`docs/fuentes/`](../../../docs/fuentes/README.md) — catálogo técnico de portales oficiales (CGPJ, BOE, Fiscalía, TC, etc.).
- Schemas en [`schemas/`](../../../schemas/) — verifica enums vigentes antes de asignar campos.

## Hermandad con otras skills

Al final de un barrido `/actualizar-caso` el agente principal puede encadenar:

- [`/revisar-caso <slug>`](../revisar-caso/SKILL.md) — auditoría editorial cualitativa del resultado.
- [`/documentar-vinculos <slug>`](../documentar-vinculos/SKILL.md) — modo persona, organización o caso si la pasada identificó nuevos roles.
- [`/rastrear-cobertura <slug>`](../rastrear-cobertura/SKILL.md) — corpus separado de cobertura mediática general del caso.
- [`/incorporar-hito <slug>`](../incorporar-hito/SKILL.md) — cuando un primario pendiente identificado por `/actualizar-caso` aparece como PDF concreto en mano.

La skill correcta para arrancar un caso nuevo es [`/investigar-caso`](../investigar-caso/SKILL.md), no `/actualizar-caso`.
