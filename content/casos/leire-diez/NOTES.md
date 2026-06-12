# NOTES internas — caso leire-diez

> Este fichero es **uso interno**: no se publica en el sitio.
> Contiene decisiones de modelado, discrepancias, riesgos editoriales y pendientes para PR2+.

## Decisiones de modelado tomadas en PR1

### Estructura dual del procedimiento
El caso tiene dos piezas con órganos distintos:
- **Pieza A** (principal): JCI nº 5 AN, magistrado Santiago Pedraz. El `caso.yaml` apunta a este órgano como `organo_judicial_id` ya que es el procedimiento de mayor alcance y relevancia editorial.
- **Pieza B**: JI nº 9 Madrid, magistrado Arturo Zamarriego. Se menciona en la descripción y en los hechos, pero no se modela como `caso_padre_id`/`caso_hijo_id` en PR1. Pendiente: evaluar si merece modelado como pieza separada o como hito dentro del mismo caso.

### fecha_apertura
Se usa `2025-05-01` (precisión mes) coincidiendo con la publicación de los audios de El Confidencial, que es el hecho verificable más temprano del que tenemos fuente. La apertura formal de diligencias ante el JI nº 9 fue posterior (mayo-junio 2025, no localizado exactamente). La causa ante JCI nº 6 se abrió antes de las detenciones de diciembre 2025.

### No-inclusión de personas "mencionadas sin imputación formal"
Según el brief: Juan Manuel Serrano Quintana (expresidente Correos) y Juan Francisco Serrano Martínez (diputado PSOE) son **mencionados** en fuentes pero sin imputación formal confirmada. No se modelan como `RolEnCaso`. El schema no tiene rol `mencionado`. Pendiente: si aparece fuente oficial que confirme imputación, crear personas y roles.

### Carmen Pano — persona privada sin rol procesal confirmado
La empresaria Carmen Pano aparece en el auto Pedraz como tercera persona a quien presuntamente se ofreció dinero para modificar declaración. No tiene rol procesal formal como investigada o acusada; es víctima potencial de un acto de obstrucción. **No se modela en PR1** conforme a los principios de privacidad (AGENTS.md). Si en PR2 aparece fuente que confirme su personación en el procedimiento (denuncia, declaración ante el JCI), revisar con cuidado aplicando V-17.

### Pere Rusiñol — verificar antes de incluir
El brief menciona a Pere Rusiñol (periodista) pero sin indicar si está imputado ni en qué pieza. **No se incluye en PR1**. Pendiente verificar si tiene rol procesal formal antes de incorporarlo.

### Santos Cerdán — perfil nuevo
Santos Cerdán no existía en el inventario. Se crea en PR1. Tiene rol de investigado en el caso Koldo (TS) que debe modelarse en ese caso cuando se amplíe. No se añade al caso Koldo en esta sesión para no contaminar.

### Ismael Oliver — rol en Koldo
Ismael Oliver es defensor de Koldo García en el caso Koldo. Se anota en sus `notas` de rol. En PR1 no se modela su rol en el caso Koldo (es tarea del caso Koldo, no de esta sesión).

### delitos_atribuidos_en_la_causa
Los slugs de delito usados en `caso.yaml` (`cohecho`, `trafico-de-influencias`) existen en `content/delitos/`. El slug `financiacion-irregular` NO existe. En el `caso.yaml` se marcó como LLM-incierto. Para los roles individuales se usaron los delitos más próximos disponibles. Pendiente: revisar qué delitos exactos aparecen en el auto Pedraz cuando se localice el primario oficial.

### nivel_relevancia_editorial: capital
Justificación: afecta presuntamente a la financiación de un partido de gobierno (PSOE), implica presuntas acciones de obstrucción a la justicia, y su desarrollo (registro Ferraz, UCO en sede del partido mayoritario en el gobierno) tiene repercusión nacional de primer orden. El nivel `capital` es coherente con otros casos del inventario (FGE, Begoña Gómez).

### Relación con caso plus-ultra: NO modelada
El brief indica explícitamente que la confluencia mediática del 27-may-2026 con Plus Ultra es coincidencia de actualidad, no vínculo procesal. Confirmado: no se modela ninguna conexión con plus-ultra.

### Organización El Confidencial
No existía en el inventario. Se crea en PR1 como `medio_comunicacion` con `naturaleza_editorial: generalista_politico` pero sin `orientacion_editorial_declarada` (no se dispone de cita verificable de autoadscripción; requiere investigación adicional).

---

## Riesgos editoriales activos

1. **Polarización política elevada**: el caso afecta directamente a la cúpula del PSOE (partido en el gobierno a fecha 2026-05-28). Aplicar con especial rigor el guardarraíl de neutralidad (P-10). Ningún comentario editorial sobre partidos; solo hechos y roles procesales con fuente.

2. **Sumario bajo secreto**: la pieza A está bajo secreto sumarial a fecha 2026-05-28. El único material disponible es el auto publicado íntegro por El Lliberal Cat (N3 filtrado_verificado) y la cobertura periodística cruzada (N4). Riesgo: el contenido del auto divulgado por el medio podría no ser completo o podría estar sujeto a disputa sobre su autenticidad. Anotar: hasta que aparezca la nota oficial CGPJ o el auto en CENDOJ, el nivel máximo para los hechos derivados es N3.

3. **Carmen Pano — persona privada**: si en PR2 se decide incluirla, aplicar V-17 (revisión de anonimización) antes de publicar.

4. **Fecha exacta de detención**: el brief y la prensa cruzada apuntan a diciembre 2025 sin fijar el día exacto. Se usó `2025-12-10` como estimación. Verificar contra fuentes cruzadas adicionales antes de PR2.

5. **Número de procedimiento**: ni la pieza A ni la pieza B tienen número de diligencias previas confirmado públicamente. `numero_procedimiento` no se incluye en `caso.yaml`. Pendiente.

---

## Pendientes para PR2+

- [x] ~~Localizar nota oficial CGPJ sobre el auto Pedraz del 26-may-2026.~~ **RESUELTO (barrido 2026-06-03):** localizada la nota de la Oficina de Comunicación del CGPJ del 27-may-2026 → catalogada como `cgpj-nota-requerimiento-psoe-leire-2026-05-27` (N1, `nota_prensa_institucional`). Es ahora `documento_principal_id` del hito `uco-en-ferraz-2026-05-27` y `documentos_relacionados` del hito `auto-pedraz-pieza-separada-2026-05-26`. Pendiente menor: archivo local (`ruta_local` + `hash_sha256`) del HTML nativo vía `/incorporar-hito`.
- [ ] Localizar auto JCI nº 6 diciembre 2025 (origen de las detenciones). Si es accesible, crear documento y actualizar hito `detencion-leire-diez-2025-12-10`.
- [ ] Confirmar número de diligencias previas de la pieza A (JCI nº 5) y de la pieza B (JI nº 9 Madrid).
- [ ] Confirmar fecha exacta de la detención de diciembre 2025 (actualmente `2025-12-10`, estimada).
- [ ] Verificar delitos exactos atribuidos en el auto JCI nº 6 dic-2025 (usados en roles de Díez, Fernández Guerrero y Alonso).
- [ ] Verificar delitos exactos imputados por el auto Pedraz 26-may-2026 a cada investigado.
- [ ] Modelo de Santos Cerdán en el caso Koldo: cuando se amplíe ese caso, añadir su rol allí; su ficha de persona ya existe en el inventario tras PR1 de leire-diez.
- [ ] Rol de Ismael Oliver como defensa en caso Koldo: modelar en ese caso (ya existe su ficha de persona).
- [ ] Pere Rusiñol: verificar si tiene rol procesal formal antes de incluir.
- [ ] `url_canonica` exactas de los documentos N4 (actualmente apuntan a raíces de medios): completar con URLs de artículos específicos y ejecutar `pnpm archive:catchup -- --caso=leire-diez`.
- [ ] Descarga primario auto Pedraz cuando aparezca en CENDOJ o se localice fuente oficial: archivo a `/public/documentos/leire-diez/auto-pedraz-jci5-2026-05-26.pdf` con `hash_sha256`.
- [ ] Evaluar si la pieza B (JI nº 9 Madrid) merece modelado como caso hijo `leire-diez/pieza-jm9` o si se mantiene integrada en el caso raíz.
- [ ] Vinculos institucionales (`/documentar-vinculos`): PSOE como organización directamente afectada; SEPI como ámbito del acto presuntamente irregular.
- [ ] Modelo del magistrado Arturo Zamarriego (JI nº 9 Madrid, pieza B): crear persona y rol `juez_instructor` cuando se confirme el número de procedimiento.

---

## Barrido de actualidad — 2026-05-30 (`/actualizar-caso`)

**Ventana revisada:** 2026-05-28 (última revisión editorial) → 2026-05-30. Última fecha procesal conocida ya catalogada: 27-may-2026 (requerimiento UCO en Ferraz). Búsqueda en ≥4 líneas editoriales (eldiario.es, The Objective, Infobae, Vozpópuli, El Español, Confilegal, OKDiario, Libertad Digital) + intento CGPJ.

### Conclusión: SIN Hito procesal nuevo. No se fabrican hitos.
Todo lo publicado entre el 28 y el 30 de mayo de 2026 es una de estas tres cosas, ninguna modelable como Hito:
1. **Lectura más detallada del mismo auto del 26-may** (bajo secreto sumarial): el desglose del pago mensual (4.000 €/mes a Díez vía consultora "Zaño" vinculada a Zarrías, 16.000 € en cuatro meses desde junio de 2024), el detalle de las 39 reuniones Cerdán–Díez (22 en Ferraz) y la tesis de "incrustar" a Díez en la presidencia/jefatura de gabinete de la SEPI. Son matices del Hito ya catalogado `auto-pedraz-pieza-separada-2026-05-26`, no autos nuevos. **No se promueven a Hito** mientras el sumario siga secreto (riesgo activo nº 2 de este NOTES).
2. **Reacción política**: Pedro Sánchez pide comparecer en el Congreso (28-may; previsiblemente tras el Consejo Europeo del 18-19 jun). Por neutralidad (P-10) y por la regla "no fabricar hitos sobre reacción política", **no es Hito** de este caso: no hay auto ni rol procesal.
3. **Filtración / fuente única no auditable**: que Díez habría presentado recurso de reforma pidiendo el levantamiento del secreto (esdiario, fuente única, fecha dudosa) y que el procedimiento sería "DP 150/2025" (Pravda España, no auditable). **No modelar**; verificar con primario u N4 cruzada.

### Hallazgo verificado relevante (refuerza nexo con caso Koldo, no nuevo Hito)
El auto del 26-may sitúa el presunto ofrecimiento de **50.000 €** a la empresaria **Carmen Pano** como intento de que se retractara de su declaración sobre la entrega de **90.000 € en efectivo en Ferraz (octubre de 2020)**, entrega que Pano atribuye a instrucciones de **Víctor de Aldama** (conseguidor del caso Koldo). Pedraz aprecia indicios de que ese ofrecimiento se habría **canalizado a través de Leticia de la Hoz Calvo, abogada de Koldo García** (Oliver → Díez: "Negócialo. Si puedes, hazlo"). De la Hoz lo ha **negado** públicamente. Cruzado en ≥3 líneas (Infobae 27-may, Confilegal 27-may, The Objective 27-may, OKDiario 28-may, Telecinco 27-may).

- **No se modela** `Persona`/`RolEnCaso` para **Leticia de la Hoz** (la cobertura habla de "indicios", no consta imputación formal en esta pieza), ni para **Carmen Pano** (persona privada / potencial perjudicada, decisión previa de no-modelado, V-17) ni para **Víctor de Aldama** (actor del caso Koldo, no de esta pieza). Si un auto futuro imputa formalmente a De la Hoz en la pieza Pedraz, crear persona + rol y elevar el nexo Koldo a `comparte_actor_con` con ella como tercer actor pivote.
- **Acción propuesta (NO ejecutada aquí):** enriquecer la relación ya existente `leire-diez-comparte-actor-koldo` añadiendo este tercer hilo documentado (De la Hoz, abogada de Koldo, como presunto canal del ofrecimiento; y el sustrato Pano/Aldama/90.000 € del caso Koldo). Como las relaciones las consolida el agente de Reconciliación, se propone en la salida estructurada y no se edita el fichero en esta sesión.

### Cruce con otros casos del inventario
- **koldo**: nexo reforzado (ver arriba). Ya existe `leire-diez-comparte-actor-koldo` (Cerdán + Oliver); se propone ampliar descripción.
- **plus-ultra**: ya existe `leire-diez-conexion-factual-plus-ultra` (pivote Fernández Guerrero / SEPI). Novedad colateral en plus-ultra (no de este caso): Zapatero citado a declarar el 17-18 jun (aplazado desde el 2 jun); cifra de 1,95 M€ atribuida a su entorno. Pertenece a plus-ultra, no se toca desde aquí.
- **begona-gomez** y **david-sanchez-badajoz**: el auto del 26-may describe acciones presuntamente dirigidas a desestabilizar esos procedimientos (Peinado y la jueza del caso del hermano de Sánchez). Para Begoña Gómez ya existe `leire-diez-conexion-factual-begona-gomez`. **Pendiente nuevo:** evaluar una `conexion_factual` análoga leire-diez ↔ david-sanchez-badajoz (el auto menciona a la jueza de ese caso como objetivo). Propuesta en la salida; verificar respaldo documental antes de consolidar.
- **fiscal-general-del-estado**: no se localizó nexo procesal documentado en esta ventana (la causa FGE es firme desde feb-2026); **no se propone** relación — sería cuota/contexto político, no nexo formal.

### Cascada de coherencia aplicada sobre `caso.yaml`
- `ultima_revision_editorial`: 2026-05-28 → **2026-05-30**.
- `estado_ficha.fecha_actualizacion`: 2026-05-28 → **2026-05-30**; `notas` ampliada con el resumen del barrido.
- `sintesis_caso.estado_actual`: precisado para situar el ofrecimiento de 50.000 € sobre la entrega en efectivo en Ferraz y su conexión con el entorno Koldo (matiz del auto ya catalogado; sin nuevos hitos/cifras).
- **Sin tocar**: `hechos_clave`, `cifras_clave`, `que_se_investiga`, `fase_actual` (sigue `instruccion`), `delitos_atribuidos_en_la_causa`, roles y hechos (no hay auto nuevo que los altere).

### Pendientes nuevos abiertos por este barrido
- [ ] Ampliar descripción de `leire-diez-comparte-actor-koldo` con el hilo De la Hoz + Pano/Aldama/90.000 € (lo consolida Reconciliación; propuesto en salida).
- [ ] Evaluar `conexion_factual` leire-diez ↔ david-sanchez-badajoz (auto Pedraz menciona a la jueza de ese caso como objetivo de la presunta operación de desestabilización). Verificar respaldo en el auto íntegro.
- [ ] Vigilar imputación formal de Leticia de la Hoz en la pieza Pedraz; si llega, crear persona + rol y elevar nexo Koldo a `comparte_actor_con`.
- [ ] Confirmar nº de DP de la pieza Pedraz ("DP 150/2025" citado sólo por fuente no auditable).
- [ ] Refinar `hecho-presunta-obstruccion-judicial`: la cobertura precisa que el ofrecimiento de 50.000 € se habría canalizado vía De la Hoz y apunta a la retractación sobre los 90.000 € de Pano/Aldama; valorar añadir ese matiz al `enunciado`/`importe_nota` cuando se localice el auto íntegro (no se toca ahora para no introducir a De la Hoz sin imputación formal).

---

## Barrido de actualidad — 2026-06-03 (`/actualizar-caso`)

**Disparador:** el maintainer pregunta si el sumario del caso ya es público.
**Ventana revisada:** 2026-05-30 (última revisión editorial) → 2026-06-03. Última fecha procesal previa catalogada: 27-may-2026 (UCO en Ferraz). Búsqueda en ≥6 líneas editoriales (Público, The Objective, Infobae, El Debate, eldiario, Telecinco, Moncloa, El Ideal Gallego, Última Hora) + nota oficial CGPJ/poderjudicial.es.

### Respuesta a la pregunta del maintainer: SÍ, parcialmente público desde el 1-jun-2026
El secreto **ya no es total**. El **1 de junio de 2026** el juez Pedraz dictó auto **levantando parcialmente** el secreto del sumario, al considerar practicadas gran parte de las diligencias que lo motivaron. **Matiz clave:** mantiene **bajo reserva un mes más** la pieza relativa a **presuntas irregularidades en contratos públicos** (investigados Leire Díez, el expresidente de la SEPI Vicente Fernández Guerrero y Antxon Alonso) — es decir, **la rama que conecta con Plus Ultra/SEPI sigue secreta**. La parte cuyo secreto se levanta es la de la **presunta estructura de desestabilización judicial**. La Audiencia Nacional/Ministerio de Justicia avisó de que el sumario podría tardar 3-4 días en estar materialmente accesible a las partes (subida a la nube), de modo que a fecha de este barrido el contenido íntegro aún no está necesariamente disponible.

### Novedades MODELADAS
1. **Hito nuevo** `auto-pedraz-levantamiento-parcial-secreto-2026-06-01` (`tipo: auto_diligencias`). Respaldo N4 multi-línea (Público izq. + The Objective der. + Infobae indep.), V-13 cumplido. `hechos_introducidos: []` (es un cambio de estado procesal, no introduce hechos sustantivos nuevos).
2. **Documento N1 nuevo** `cgpj-nota-requerimiento-psoe-leire-2026-05-27`: nota oficial de la Oficina de Comunicación del CGPJ sobre el requerimiento de documentación al PSOE. Resuelve el pendiente histórico de "localizar nota CGPJ". Pasa a ser `documento_principal_id` del hito `uco-en-ferraz-2026-05-27` y `documentos_relacionados` del hito `auto-pedraz-pieza-separada-2026-05-26`. La columna vertebral documental del caso deja de depender sólo del auto filtrado N3.
3. **Documentos N4 nuevos** del levantamiento: `publico-levantamiento-secreto-leire-2026-06-01`, `theobjective-levantamiento-secreto-leire-2026-06-01`.
4. **Cascade en `caso.yaml`**: `estado_actual` reescrito (decía "Causa bajo secreto sumarial" → obsoleto); `delitos_atribuidos_en_la_causa` ampliado con `organizacion-criminal` y `prevaricacion` (confirmados por la nota CGPJ N1); `ultima_revision_editorial` y `estado_ficha.fecha_actualizacion` → 2026-06-03; `estado_ficha.notas` ampliada. Sin tocar `hechos_clave` (al máximo de 4 y siguen siendo los hechos sustantivos más relevantes; el levantamiento es estado procesal → `estado_actual`), `cifras_clave` ni `que_se_investiga`.

### Delitos: lista oficial completa (nota CGPJ N1, 27-may) vs slugs disponibles
La nota CGPJ enumera: organización criminal, cohecho, revelación de secretos, **inducción al falso testimonio**, **acusación falsa**, falsedad en documento mercantil, prevaricación, tráfico de influencias y **delito contra las instituciones del Estado**. Los tres en negrita **NO tienen slug** en `content/delitos/` y NO se inventan en una pasada de actualización (decisión de modelo del maintainer). El más relevante es **"delito contra las instituciones del Estado"**: es el que fundamenta la competencia de la Audiencia Nacional y la petición de inhibición al JI nº 9 de Madrid. **Pendiente:** decidir si se crean esos tres slugs de delito.

### Novedades NO modeladas (a propósito) — guardarraíles
- **Petición de inhibición Pedraz → JI nº 9 Madrid (Zamarriego):** Pedraz solicita asumir la causa que el JI nº 9 (mag. Arturo Zamarriego) abrió en verano de 2025, por competencia sobre el delito contra las instituciones del Estado. Es una **petición no resuelta**, no un auto de acumulación. **No se modela como Hito** todavía; cuando se resuelva (inhibición aceptada) será un `acumulacion_causas` o `cambio_organo`. Recogido en `estado_actual`. **Avanza** (no cierra) el pendiente "evaluar pieza B".
- **Recurso de nulidad de Leire Díez** contra la orden de entrada en Ferraz del 26-may (alega uso de información personal fuera de la ventana 2021-2023). Es **escrito de parte no resuelto**; sin `tipo` de Hito adecuado en instrucción. Se anota aquí; no se modela hasta que Pedraz lo resuelva. Cruzado en The Objective, El Debate, Telecinco.
- **Contenido sensible del sumario recién desvelado que NO se modela** (presunción de inocencia + no exposición de personas sin rol formal + V-13 sobre interpretación periodística):
  - Conversaciones UCO con referencias a "el presidente", "one", "jefe" interpretadas por la prensa como posibles indicios de conocimiento por parte de Pedro Sánchez. Es **interpretación periodística de informes UCO**, no hallazgo judicial. NO modelar. Pedro Sánchez no tiene rol procesal en esta causa.
  - Mención a **Mercedes González** (directora de la Guardia Civil) a quien Díez habría dicho "controlar". Claim de informe UCO; **no consta imputación formal**; no se crea persona ni rol.
  - Cifras sueltas atribuidas en algunas coberturas (43.225 €, 125.000 € a Teijelo, 20.000 € a un medio, trabajos 2015-2017) que chocan con la ventana 2021-2023 del caso y no están cruzadas con solidez. **Pendiente de verificación**; no se incorporan a `cifras_clave` ni a hechos.

### Cruce con otros casos del inventario (sin novedad de relación)
- **plus-ultra**: el nexo (Fernández Guerrero / SEPI) sigue en la **pieza que continúa secreta** un mes más; nada nuevo que consolidar. Relación `leire-diez-conexion-factual-plus-ultra` ya existe.
- **koldo / begona-gomez / david-sanchez-badajoz**: pendientes del barrido 30-may siguen abiertos; este levantamiento parcial no aporta primario nuevo sobre ellos (la rama de obstrucción se ha desvelado pero el detalle fino se irá conociendo según suba el sumario). Re-evaluar cuando el sumario esté accesible.

### Pendientes nuevos / actualizados por este barrido
- [ ] Cuando el sumario suba a la nube (≈3-4 días → a partir del 4-5 jun), localizar el **auto íntegro del levantamiento** y los **informes UCO** ya no secretos; valorar elevar a N1 hechos hoy en N3 `filtrado_verificado` y refinar `hecho-presunta-obstruccion-judicial` (matiz De la Hoz, ya pendiente del barrido 30-may).
- [ ] Decidir creación de slugs de delito: "inducción al falso testimonio", "acusación falsa", "delito contra las instituciones del Estado".
- [ ] Vigilar resolución de la **petición de inhibición** al JI nº 9 Madrid → si se acepta, Hito `acumulacion_causas` y posible `cambio_organo` (cierra el pendiente "pieza B").
- [ ] Vigilar resolución del **recurso de nulidad** de Díez sobre la entrada en Ferraz.
- [ ] Archivo local (`ruta_local` + `hash_sha256`) de la nota CGPJ N1 vía `/incorporar-hito` (HTML nativo del órgano emisor).
- [ ] Ejecutar `pnpm archive:catchup -- --caso=leire-diez` para los N4 nuevos (Público, The Objective).

---

## Barrido de actualidad — 2026-06-06 (`/actualizar-caso`)

**Disparador:** el maintainer pide actualizar Leire Díez y Plus Ultra ("leire y plus ultra").
**Ventana revisada:** 2026-06-03 (última revisión editorial) → 2026-06-06. Última fecha procesal previa catalogada: 01-jun-2026 (levantamiento parcial del secreto). Búsqueda en ≥6 líneas editoriales (Infobae, The Objective, Público, Confilegal, Diario Red, eldiario, El Debate, Libertad Digital, Mundiario, Demócrata) + intento de nota oficial CGPJ/poderjudicial.es.

### Novedad MODELADA
1. **Hito nuevo** `auto-pedraz-rechazo-personacion-garcia-castellon-2026-06-04` (`tipo: auto_diligencias`, `fase_resultante: instruccion`, `hechos_introducidos: []`). El 4-jun Pedraz rechaza "por el momento" la personación como **acusación particular** del magistrado jubilado **Manuel García-Castellón**, que alegaba ser perjudicado (la presunta red habría buscado información sobre él y vertido afirmaciones falsas para perjudicarle). Motivo: esos hechos se investigan en el JI nº 9 de Madrid (Zamarriego) y **no están aún acumulados** a la causa de la AN — lo que enlaza directamente con la petición de inhibición de Pedraz al JI nº 9. **V-13 holgado:** tres N4 de líneas distintas con redacción propia — `confilegal-...` (jurídico independiente, principal), `publico-...` (izquierda), `theobjective-...` (derecha). Diario Red también lo cubrió. García-Castellón **NO se ficha como `RolEnCaso`**: su personación fue rechazada, no es parte en esta causa; su persona ya existía en el inventario (instructor jubilado del caso Koldo), por lo que se referencia en `personas_afectadas` del hito sin crear ficha nueva ni tocar su biografía (no es investigado aquí).

### Novedades NO modeladas (a propósito) — guardarraíles
- **Recurso de Santos Cerdán contra la petición de inhibición** Pedraz → JI nº 9 (eldiario, 5-jun). Es **escrito de parte no resuelto**; sin `tipo` de Hito adecuado en instrucción. Se anota; no se modela hasta que se resuelva.
- **La Fiscalía pide que Cristina Narbona (presidenta del PSOE) declare como testigo** (cobertura 5-jun). Es **solicitud no resuelta**; además "testigo" no es `RolEnCaso` de los tipos procesales del schema (investigado/procesado/…). No se crea persona ni rol. Si un auto la cita formalmente como testigo, seguirá sin ser rol de imputación: sólo se anotaría en la descripción del hito correspondiente.
- **Contenido del sumario recién accesible** (libretas/anotaciones de Díez intervenidas por la UCO — "libreta azul", "Pedro no se fía del DAO", supuesta tesis de "proteger a Sánchez"; mención a **Mercedes González**, directora de la Guardia Civil). Es **interpretación periodística de informes UCO**, no hallazgo judicial; ni Pedro Sánchez ni Mercedes González tienen rol procesal en esta causa. NO modelar (presunción de inocencia + no exposición de personas sin rol formal + cautela V-13 sobre interpretación de la prensa). Pendiente del barrido 03-jun: cuando el sumario esté íntegro, valorar elevar a N1 hechos hoy en N3 `filtrado_verificado`.
- **Pieza de contratos públicos / SEPI sigue secreta hasta julio.** Mundiario (4-5 jun) publica que la UCO trabaja en esa pieza secreta y habría registrado **Tubos Reunidos** (nueva derivada SEPI, posible rescate de 112,8 M€ que rozaría al PNV). Es **la rama que conecta con Plus Ultra y que Pedraz mantiene bajo reserva**; además es fuente prácticamente única (Mundiario). NO modelar; vigilar cuando se levante ese secreto (~julio).

### Cruce con otros casos del inventario
- **plus-ultra** — el nexo SEPI/Fernández Guerrero **se refuerza** en cobertura de esta ventana: Vozpópuli ("Un alto cargo de la SEPI conecta los casos de Leire Díez y la trama de Zapatero") y reporting de que el **rescate de Plus Ultra podría haber sido una de las primeras actuaciones de la red Hirurok**. **Matiz crítico:** este nexo vive en la **pieza de contratos SEPI que sigue secreta hasta julio** → es filtración/interpretación sobre material bajo reserva. **NO se toca** la relación existente `leire-diez-conexion-factual-plus-ultra` (la consolida reconciliación). **Propuesta para cuando se levante el secreto (~julio):** enriquecer esa relación con el hilo "rescate PU = presunta primera actuación de Hirurok" y valorar elevar de `conexion_factual` a `comparte_actor_con` (pivote Fernández Guerrero + SEPI). Anotado bidireccionalmente en el NOTES de plus-ultra.
- **koldo / begona-gomez / david-sanchez-badajoz** — pendientes de barridos previos siguen abiertos; esta ventana no aporta primario nuevo sobre ellos.

### Cascada de coherencia aplicada sobre `caso.yaml`
- `sintesis_caso.estado_actual`: añadida una frase con el rechazo (por el momento) de la personación de García-Castellón, ligándolo a la petición de inhibición ya recogida. Sin reescribir el resto.
- `ultima_revision_editorial` y `estado_ficha.fecha_actualizacion`: 2026-06-03 → **2026-06-06**.
- `estado_ficha.notas`: ampliada con el resumen del barrido.
- **Sin tocar**: `hechos_clave`, `cifras_clave`, `que_se_investiga`, `fase_actual` (sigue `instruccion`), `delitos_atribuidos_en_la_causa` (el rechazo de personación no altera la calificación), roles y hechos (el auto no introduce hechos sustantivos).

### Pendientes nuevos / actualizados por este barrido
- [ ] Vigilar la **resolución de la inhibición** JI nº 9 → AN (ahora recurrida por Cerdán); si se acepta, Hito `acumulacion_causas` y posible `cambio_organo`, y entonces reevaluar la personación de García-Castellón (que Pedraz dejó condicionada a la acumulación).
- [ ] Cuando se levante el secreto de la **pieza de contratos SEPI** (~julio): enriquecer la relación con plus-ultra y valorar `comparte_actor_con`; revisar la derivada Tubos Reunidos / 112,8 M€.
- [ ] `pnpm archive:catchup -- --caso=leire-diez` para los tres N4 nuevos del auto García-Castellón (Confilegal, Público, The Objective).

---

## Sección pública «Contenido considerado y no modelado» — 2026-06-12 (piloto)

**Disparador:** issue #3 (propuesta de contribuyente externo, aceptada con condiciones por el maintainer). Este caso pilota la sección y el campo `contenido_no_modelado` de `caso.yaml` (regla canónica: doc 02, sección 2.13, P-11; análisis legal: doc 04, apartado 4).

**Qué se elevó a la ficha pública** (deja de ser sólo nota interna; la decisión editorial ahora es visible al lector con sus fuentes):

1. **Referencias "el one" / "P.S." / "el presidente"** en informes UCO y agendas intervenidas. La ola de cobertura del 5-jun (eldiario.es, Público, The Objective — tres líneas) recoge que la propia UCO interpreta "el one" como alusión al presidente del Gobierno. Verificadas titular/fecha/autor de las tres piezas vía fetch el 2026-06-12. La prosa pública nombra a Pedro Sánchez con las tres negaciones pegadas (sin identificación judicial, sin rol procesal, sin indicio de conocimiento según la propia cobertura + desmentido de Moncloa). Sigue sin modelarse como Hecho: V-13.
2. **Mención a Mercedes González** (directora general de la Guardia Civil): tres encuentros con Díez según informes UCO + nota del SIGC del 29-abr-2025 ("Posibles estrategias de defensa ante investigaciones de la UCO", citada por OKDIARIO 9-jun). Cruce: Público (izq) + The Objective ×2 (c-der) + OKDIARIO (der). Sin ficha de persona, sin rol; negación de Interior incluida en la prosa.
3. **Relación con FGE descartada** (antes sólo en este NOTES, línea ~98): razonamiento "sería cuota, no nexo formal" ahora público en la ficha.

**Guardarraíl técnico aplicado:** en la sección, `RichProse` sólo auto-enlaza personas con rol en ESTE caso; Pedro Sánchez (persona existente por contexto Begoña Gómez) y cualquier otra mención quedan como texto plano, sin link, sin nodo (condición 4 de la regla).

**Cobertura nueva 5-11 jun detectada al preparar el piloto, NO procesada** (pendiente de próximo `/actualizar-caso`, no era el objeto de esta sesión): detalle de agendas/libretas ("Pedro no se fía del DAO", anotación sobre el rescate de Air Europa meses antes de concederse — The Objective 11-jun), maniobras descritas contra Marlaska y nombramientos de Interior, petición de Cerdán sobre Marlaska/González (The Objective 11-jun), comparecencias políticas. Ojo: la pieza de Air Europa podría rozar un caso futuro (rescate SEPI), anotar si se ficha.

### Pendientes nuevos por el piloto
- [ ] `url_archivo` de las 6 piezas citadas en `contenido_no_modelado` (el script `archivar-n4.mjs` no lee este campo todavía — ver ficha de la feature, pendiente operativo).
- [ ] Barrido `/actualizar-caso` de la ola 5-11 jun (ver arriba).
- [ ] Revisar `fecha_revision` de los 3 ítems si el sumario íntegro accesible confirma/desmiente las interpretaciones (podrían pasar a Hecho o retirarse).
