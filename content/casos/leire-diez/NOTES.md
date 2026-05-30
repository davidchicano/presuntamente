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

- [ ] Localizar nota oficial CGPJ sobre el auto Pedraz del 26-may-2026. Si existe, elevar `el-lliberal-cat-auto-pedraz-integro-2026-05-27` a N1 o crear nuevo documento N1 CGPJ y actualizar `documento_principal_id` del hito `auto-pedraz-pieza-separada-2026-05-26`.
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
