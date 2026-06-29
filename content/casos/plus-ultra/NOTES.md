# NOTES — Caso Plus Ultra

Anotaciones internas. **No se publica.** Vive en el repo para humanos y agentes LLM que iteren sobre este caso. Convención en [AGENTS.md → "NOTES.md por caso"](AGENTS.md#notesmd-por-caso).

Última actualización: 2026-06-29 (barrido actualidad — filtraciones en Plus Ultra, ampliación SEPI/Tubos en Leire, sin hito nuevo en Koldo). Antes: 2026-06-23 (declaración de Zapatero, rechazo de cautelares y revisión editorial de junio).

---

## Barrido actualidad 2026-06-29

**Ventana:** 2026-06-23 → 2026-06-29. Barrido sobre Plus Ultra, Koldo y Leire Díez por petición del maintainer.

### Novedad MODELADA

- **Hito nuevo:** `auto-calama-investiga-filtraciones-2026-06-25` (`tipo: auto_diligencias`). La cobertura cruzada de elDiario.es e Infobae informa de una actuación del magistrado Calama ante filtraciones de documentación y datos de la causa. Se modela sólo la incidencia procesal; no se incorporan contenidos filtrados, datos personales ni personas privadas.
- **Primario oficial localizado durante la pasada:** la nota CGPJ `cgpj-auto-calama-filtraciones-plus-ultra-2026-06-25` confirma el auto del 25-jun-2026, sustituye a elDiario.es como `documento_principal_id` del hito y queda archivada localmente como HTML con hash. Los N4 se conservan como contexto de apoyo.

### Novedades NO modeladas

- **Escritos de nulidad de la defensa de Zapatero.** Son escritos de parte pendientes de resolución. Se dejan en seguimiento; si Calama resuelve sobre la nulidad o licitud de la prueba, entonces sí procede hito.
- **Material filtrado del sumario.** Sigue fuera del modelo como Hecho por falta de primario estable y por cautela de privacidad.

### Cruce con otros casos

- **`leire-diez`**: el 29-jun la cobertura sitúa la ampliación de investigados en la derivada SEPI/Tubos, con la presidenta de SEPI como investigada. Refuerza el hilo SEPI ya conocido, pero no transforma por sí solo la relación `leire-diez-conexion-factual-plus-ultra` porque no aparece nexo formal directo con el préstamo Plus Ultra. Mantener la relación existente y reevaluar con el auto íntegro de la pieza SEPI/Tubos.
- **`koldo`**: sin primario nuevo que permita convertir la candidata Plus Ultra↔Koldo en `RelacionEntreCasos`; el nexo Apamate/Aldama sigue pendiente de documento estable.

### Cascada aplicada

- `sintesis_caso.estado_actual`: actualizado con la incidencia de filtraciones y los escritos de nulidad pendientes.
- `ultima_revision_editorial` y `estado_ficha.fecha_actualizacion`: 2026-06-29.
- Sin tocar `que_se_investiga`, `hechos_clave`, `cifras_clave`, `fase_actual`, delitos ni roles.

### Pendientes

- [x] ~~Localizar respaldo oficial de Calama sobre filtraciones.~~ **Resuelto 2026-06-29:** nota CGPJ N1 localizada y archivada; sigue pendiente el auto íntegro si aparece.
- [ ] Vigilar resolución de los escritos de nulidad/licitud de prueba.
- [ ] Reevaluar Plus Ultra↔Leire cuando esté disponible el auto íntegro de la ampliación SEPI/Tubos.

## Barrido actualidad 2026-06-23

**Disparador:** actualización de `plus-ultra` como worker paralelo.
**Ventana:** desde la última revisión editorial (2026-06-06) hasta hoy. Sweep en varias líneas editoriales (elDiario.es, Vozpópuli, Infobae, EL PAÍS, Público, El Independiente, Cadena SER, infoLibre) + notas oficiales del CGPJ/Audiencia Nacional + query BOE/FASEE.

### Novedad MODELADA

- **Hito nuevo incorporado:** `declaracion-zapatero-sin-cautelares-2026-06-17` (`tipo: declaracion_imputado`). El 17-jun-2026 José Luis Rodríguez Zapatero declaró como investigado ante el JCI nº 4 y, tras la comparecencia, el magistrado José Luis Calama rechazó retirarle el pasaporte o imponerle comparecencias periódicas. El respaldo es **N1 oficial** mediante la nota del CGPJ `auto-jci4-rechazo-medidas-zapatero-pu-2026-06-17`; no hace falta V-13 al estar sostenido por fuente de nivel 1. Hecho derivado: `pu-declaracion-zapatero-sin-cautelares-2026-06-17` (`tipo: atribuido`, `nivel_fuente_efectivo: 1`).

- **Actualización de Hito existente:** `auto-acusaciones-populares-pp-2026-05-29` se amplía con la nota oficial `auto-jci4-rechazo-acusaciones-diligencias-pu-2026-06-16`. El auto del 16-jun-2026 no merece hito propio: precisa la **ejecución práctica** de la unificación ya acordada el 29 de mayo y rechaza los recursos de reforma contra ella. Se clasifica como **actualización de descripción de Hito existente**, no como Hito nuevo.

### Novedades NO modeladas (a propósito)

- **Pieza separada sobre las joyas halladas en Ferraz (CGPJ, 12-jun-2026).** La nota oficial del CGPJ informa de que Calama abre una **pieza separada** para investigar a Zapatero por presuntos delitos fiscal y de contrabando en relación con joyas tasadas preliminarmente en 1.323.915 euros. **No se modela en esta pasada**: abre un objeto procesal autónomo, distinto del rescate/SEPI, y meterlo sin más en `plus-ultra` obligaría a decidir si el caso principal absorbe una pieza separada de naturaleza tributaria o si esa línea merece modelado específico aparte. Pendiente de criterio humano.

- **Investigación formal del entorno inmediato de Zapatero (CGPJ, 18-jun-2026).** La nota oficial del CGPJ del 18-jun-2026 indica que el juez pone las actuaciones en conocimiento de dos familiares directos y de la secretaria del expresidente para que puedan personarse como investigadas. **No se modela aquí**: por prudencia editorial y V-17, la pasada evita crear fichas de personas privadas salvo decisión humana expresa sobre proporcionalidad, necesidad y forma de exposición. Queda anotado como pendiente humano, no como descarte fáctico.

- **Escritos de la defensa sobre la licitud de la prueba procedente de EEUU (10-jun y 23-jun-2026).** EL PAÍS (10-jun) y Cadena SER (23-jun) describen escritos de la defensa de Zapatero pidiendo más información sobre el volcado del móvil de Rodolfo Reyes y sobre el disco duro "CRUCIAL", con posible alegación futura de nulidad. **No se modela**: son escritos de parte no resueltos, sin hito procesal autónomo todavía.

- **BOE / FASEE / SEPI.** Query específica de BOE en esta ventana: **sin novedad normativa nueva** relevante para el caso. Se mantiene como marco el `boe-rdl25-2020-fondo-solvencia-fasee` ya catalogado.

### Cruce con otros casos del inventario

- **`leire-diez`** — la relación `leire-diez-conexion-factual-plus-ultra` ya existe y sigue siendo válida. La cobertura de junio (Vozpópuli, Telemadrid, EL PAÍS) refuerza el hilo SEPI / Bartolomé Lora / Tubos Reunidos, pero la rama de contratos SEPI que haría más fuerte el nexo sigue viva en material parcialmente reservado o recién aflorado. **No se toca** la relación existente; cuando se levante del todo el secreto de esa pieza, valorar enriquecerla.

- **`koldo`** — el enlace ya no depende de una sola pieza aislada: EL PAÍS (23-may), El Independiente (25-may) e Infobae (26-may) documentan cruces entre el rescate de Plus Ultra y el entorno Ábalos/Koldo/Aldama, con Miguel Palomero y pagos/sociedades como nodos narrativos recurrentes. **Aun así no se modela desde esta pasada** por scope, y porque la base sigue siendo cobertura sobre material instructor. Queda **candidata seria** a `RelacionEntreCasos` en reconciliación.

- **`begona-gomez`** — barrido sin nexo procesal nuevo. La coincidencia de agenda política/judicial o de abogados en cobertura no alcanza el estándar de `RelacionEntreCasos`.

### Cascada de coherencia aplicada sobre `caso.yaml`

- `sintesis_caso.estado_actual`: actualizado para sustituir la previsión de declaración por el hecho ya ocurrido el 17-jun-2026 y el rechazo de medidas cautelares.
- `sintesis_caso.hechos_clave`: un bullet actualizado para reflejar la comparecencia efectiva de Zapatero y la decisión cautelar posterior.
- `ultima_revision_editorial` y `estado_ficha.fecha_actualizacion`: **2026-06-06 → 2026-06-23**.
- `roles/zapatero-investigado.yaml`: nota actualizada para reflejar la declaración del 17-jun y la ausencia de medidas cautelares.
- **Sin tocar**: `que_se_investiga`, `cifras_clave`, `fase_actual`, `delitos_atribuidos_en_la_causa`, `organo_judicial_id`. La pieza separada de joyas no se absorbe editorialmente en esta pasada.

### Pendientes abiertos / actualizados

- [x] ~~Declaración de Zapatero 17-18 jun → será el próximo hito.~~ **Resuelto:** modelado el 17-jun-2026.
- [ ] Auto íntegro del JCI nº 4 en CENDOJ (19-may y 25-may) → elevar N4 a N1 donde proceda y verificar si las 4 órdenes internacionales tienen hito propio.
- [ ] Decisión humana sobre si la **pieza separada de joyas** (CGPJ, 12-jun-2026) debe integrarse como hito del caso `plus-ultra`, como pieza interna explícita o mantenerse sólo en NOTES hasta nueva pasada.
- [ ] Decisión humana sobre si la nota oficial del **18-jun-2026** justifica crear personas/roles para personas privadas formalmente llamadas al proceso.
- [ ] Seguir la tramitación de los **escritos de nulidad/licitud de prueba** de la defensa: si el juez resuelve, entonces sí podría haber hito `auto_diligencias`.
- [ ] `plus-ultra` ↔ `koldo`: candidata a `RelacionEntreCasos` por `conexion_factual` / `comparte_actor_con` cuando el maintainer quiera consolidarla en reconciliación.

## Barrido actualidad 2026-06-06

**Disparador:** el maintainer pide actualizar Leire Díez y Plus Ultra ("leire y plus ultra").
**Ventana:** desde el último hito catalogado (`auto-acusaciones-populares-pp-2026-05-29`, 29-may) y la última revisión (30-may) hasta hoy. Sweep en ≥6 líneas editoriales (Infobae, The Objective, Vozpópuli, El Debate, El Independiente, Newtral, Telecinco, France24) + órgano judicial JCI nº 4 / magistrado Calama + cruce con casos del inventario (leire-diez, koldo).

### Conclusión: SIN Hito procesal nuevo. No se fabrican hitos.
La ventana 30-may → 6-jun es **procesalmente tranquila**. El próximo hito previsto es la **declaración de Zapatero los días 17 y 18 de junio** (ya recogida en `estado_actual`). Todo lo que devuelve la cobertura de esta ventana es: (a) material ya catalogado o anotado (agrupación de las 8 acusaciones populares bajo el PP del 29-may → ya es hito `auto-acusaciones-populares-pp-2026-05-29`; las 4 órdenes internacionales de detención y el nexo Apamate/Koldo son del 25-26 may, anteriores al barrido del 30-may); (b) relecturas del sumario de 4.000 folios (caja fuerte con joyas y lingotes pendientes de peritaje; 174 transferencias por 2,6 M€; 40 empresas / 60 personas en el grafo UDEF) — material del sumario/UDEF bajo secreto, ya anotado en barridos previos, **no modelable** sin primario que lo fije.

### Detalle de las 4 órdenes internacionales de detención (contexto, no hito nuevo)
La cobertura del 25-may (Infobae "Las cuatro órdenes internacionales de detención que ha dictado el juez Calama") nombra a los cuatro reclamados: **Rodolfo José Reyes Rojas** (venezolano, considerado gestor real de Plus Ultra desde 2017), su esposa **María Aurora López López** (titular formal de la compañía desde feb-2021), **Luis Felipe Baca Arbulu** (peruano con nacionalidad francesa) y el holandés **Simon Leendert Verhoeven** (residente en Suiza, pieza clave de la presunta estructura de blanqueo Francia-Suiza-Venezuela). Sigue **pendiente** verificar si estas órdenes están contenidas en el auto del 19-may ya catalogado o si requieren hito propio: depende del auto íntegro en CENDOJ, todavía no disponible. **No se ficha persona/rol** para estos cuatro: no consta auto del JCI nº 4 con URL canónica que los incorpore formalmente; son nombres en cobertura N4 sobre actuaciones bajo instrucción.

### Cruce con casos del inventario
- **`leire-diez` (nexo SEPI / Fernández Guerrero)** — el nexo **se refuerza** en esta ventana: Vozpópuli ("Un alto cargo de la SEPI conecta los casos de Leire Díez y la trama de Zapatero") y reporting de que el **rescate de Plus Ultra podría haber sido una de las primeras actuaciones de la presunta red Hirurok**. **Pero** este hilo vive en la **pieza de contratos SEPI del caso Leire que Pedraz mantiene secreta hasta julio** (Mundiario: la UCO trabaja en esa pieza, registro de Tubos Reunidos). Es filtración/interpretación sobre material bajo reserva → **no se modela**. La relación `leire-diez-conexion-factual-plus-ultra` ya existe y la consolida reconciliación; **propuesta** para cuando se levante ese secreto (~julio): enriquecerla con el hilo "rescate PU = presunta primera actuación de Hirurok" y valorar elevar de `conexion_factual` a `comparte_actor_con` (pivote Fernández Guerrero + SEPI). Anotado igual en el NOTES de leire-diez (bidireccional).
- **`koldo` (nexo Apamate / Aldama)** — más detalle disponible (Miguel Palomero como conexión más documentada entre Koldo y la red atribuida a Zapatero, "tocamos a Ábalos" mar-2020; Apamate Corporate and Trust → contrato de 120.000 € con Análisis Relevante de Julio Martínez + 300.000 € a Deluxe Fortune de Aldama), pero **sigue procediendo del sumario bajo secreto y de cobertura**, sin auto/informe citable que lo fije. Se mantiene la decisión del barrido 30-may: **NO se propone aún** `RelacionEntreCasos` plus-ultra↔koldo; candidata a `comparte_actor_con` (Julio Martínez / Aldama) cuando aparezca primario.
- **`begona-gomez`, `david-sanchez-badajoz`** — siguen siendo contexto político compartido, no nexo procesal. NO se propone relación.

### Cascada de coherencia aplicada sobre `caso.yaml`
- `ultima_revision_editorial` y `estado_ficha.fecha_actualizacion`: 2026-05-30 → **2026-06-06** (la pasada es revisión editorial real aunque su conclusión sea "sin novedad procesal").
- **Sin tocar** ningún otro campo: `estado_actual` sigue vigente (declaración 17-18 jun, acusaciones agrupadas bajo el PP), `hechos_clave`, `cifras_clave`, `que_se_investiga`, `fase_actual` (`instruccion`), `delitos_atribuidos_en_la_causa`, `organo_judicial_id`.

### Pendientes (sin cambios respecto al barrido 30-may, se mantienen vigentes)
- [ ] Auto íntegro del JCI nº 4 en CENDOJ (19-may y 25-may) → elevar N4 a N1 y verificar si las 4 órdenes internacionales tienen hito propio.
- [ ] Declaración de Zapatero 17-18 jun → será el próximo hito (`declaracion_imputado`).
- [ ] Figuras económicas bajo secreto (16 M€ desviados, 1,95 M€ entorno Zapatero) pendientes de primario.
- [ ] Relación plus-ultra↔koldo cuando haya primario que fije el nexo Apamate/Aldama.

---

## Barrido actualidad 2026-05-30

Ventana: desde el último hito catalogado (`auto-aplazamiento-declaracion-zapatero-2026-05-26`) hasta hoy. Sweep en profundidad sobre el caso (cobertura general en ≥3 líneas editoriales, órgano judicial JCI nº 4 / magistrado Calama, cruce con casos del inventario).

### Hito nuevo incorporado — `auto-acusaciones-populares-pp-2026-05-29`

Única novedad procesal real desde el último hito catalogado (26-may). El 29 de mayo de 2026 el JCI nº 4 (magistrado Calama) dicta auto que **agrupa las ocho acusaciones populares personadas en el caso bajo una representación y dirección letrada conjunta, atribuida al Partido Popular**. Las ocho son: PP, Vox, Hazte Oír, Manos Limpias, Ciudadanos, Iustitia Europa, la organización Liberum y un particular (Borja Fernández). El instructor razona que la personación de Vox, primera en registrarse, no era "válida y plenamente eficaz" por faltarle el poder de representación, y que la del PP fue la primera procesalmente idónea; añade que el PP "presenta una implantación institucional más relevante".

- **Tipo de hito usado:** `auto_diligencias` (resolución de ordenación procesal; no transita la fase ni amplía el objeto). `fase_resultante: instruccion`.
- **V-13 cumplido:** dos N4 de líneas editoriales distintas con redacción propia: `the-objective-acusaciones-populares-pp-2026-05-29` (The Objective, centroderecha) + `infobae-acusaciones-populares-pp-2026-05-29` (Infobae España, generalista). La cobertura es masiva y multilínea (Moncloa.com, ElNacional.cat, Estrella Digital, Público) — V-13 holgado.
- **Hecho derivado:** `pu-acusaciones-populares-pp-2026-05-29` (`tipo: atribuido`, N4).
- **Roles nuevos creados:** `partido-popular-acusacion-popular-plus-ultra` y `vox-acusacion-popular-plus-ultra` (ambos `acusacion_popular`, `sujeto_tipo: organizacion`, `fecha_inicio: 2026-05-29`). Hazte Oír, Ciudadanos, Iustitia Europa, Liberum y el particular **NO se fichan como rol** en esta pasada: están personados pero su detalle individual no aporta a la ficha y Liberum/el particular ni siquiera tienen organización en el repo; si el maintainer quiere granularidad completa de las ocho, se amplía. Manos Limpias ya tenía rol `acusacion_popular` desde su querella (2025-12-23); este auto confirma su personación efectiva tras el traslado al JCI nº 4 (nota del rol existente actualizada).
- **Pendiente:** no consta nota CGPJ ni auto íntegro en CENDOJ a 30-may; cuando aparezca, sustituir `documento_principal_id` por el primario oficial y subir `nivel_fuente`.

### No se ha encontrado ningún artefacto de rol PSOE

Verificado: **no existe** ningún `content/casos/plus-ultra/roles/psoe-acusacion-popular.yaml`. El listado real de roles del caso es Zapatero (investigado), tres ejecutivos (investigados), Manos Limpias (acusación popular), Calama (instructor) y los dos roles PP/Vox creados en esta pasada. Búsquedas específicas ("PSOE acusación popular caso Plus Ultra") no devuelven nada que sostenga una personación del PSOE como acusación popular en esta causa — algo que además sería procesalmente anómalo al estar investigado un expresidente del propio partido. No hay nada que retirar en Plus Ultra. (Sí existen roles `psoe-acusacion-popular` legítimos en otros casos del inventario —`gonzalez-amador`, `kitchen`—, ajenos a este barrido.)

### No modelado — figuras económicas bajo secreto de sumario (a la espera de primario)

El auto del 25-may-2026 (`auto-diligencias-pu-2026-05-25`) impuso **secreto absoluto sobre la actuación de la UDEF**. Las siguientes cifras circulan en cobertura de finales de mayo pero proceden del sumario/informe UDEF bajo secreto, sin auto del JCI nº 4 que las fije formalmente. Conforme al guardarraíl de sumario bajo secreto, **NO se modelan como Hecho** (ni se estructura su `importe`) hasta que un primario N1/N2 las acredite con cita y localización:

- **Hasta 16 M€ presuntamente desviados a una red de blanqueo**, según atribución a la UDEF (El Español 24-may; Infobae 24-may). Si en el futuro hay auto o informe UDEF citable, modelar como Hecho `investigado`/`atribuido` con `importe: 16000000`, `importe_alcance: componente` (subconjunto de los 53 M€ ya estructurados en `pu-prestamo-sepi-2021-03-09`; NO sumar — V-23), `importe_naturaleza: blanqueo`, `importe_clase: consecuencia`.
- **1,95 M€ al entorno de Zapatero** (1,52 M€ él + 423.779 € a sus hijas vía la sociedad Whathefav S.L.), **174 transferencias por 2,6 M€ (2020-2025)**, **40 empresas y 60 personas en el grafo UDEF** — ya anotados en barridos previos; siguen pendientes de primario. (Las hijas son familiares sin rol procesal formal: [doc 04 — "Ética"] prohíbe ficharlas; fuera del inventario hasta que un auto les atribuya rol.)
- **Presunta inflación por la SEPI de empleos, cuota de mercado y situación financiera** de Plus Ultra para aprobar el rescate (El Español 27-may; El Debate 23-may; Libertad Digital 27-may, esta última sobre el interrogatorio de la fiscal a los peritos). Es la línea "inflación de datos de viabilidad" ya pendiente; ahora con más cobertura, pero deriva de prueba pericial/sumario bajo secreto. Pendiente de pericial o auto citable.

### Contexto (no procesal, no modelado)

- **Estado de devolución del préstamo**: a 23-may-2026 Plus Ultra no habría devuelto principal de los 53 M€ y sí ~12 M€ en intereses (El Debate). Dato contextual de seguimiento, no hito procesal.
- **4 órdenes internacionales de detención** dictadas por Calama por blanqueo y tráfico de influencias (Vozpópuli; Euronews). Ya señalado como pendiente: verificar si están contenidas en el auto del 19-may ya catalogado o si requieren hito propio; pendiente del auto íntegro en CENDOJ.
- **Investigación paralela del DOJ de EEUU** sobre presunto blanqueo de fondos venezolanos vinculados al entorno: sin N4 cruzado suficiente en este barrido. Sigue como seguimiento.

### Cruce con casos del inventario

- **`leire-diez` (nexo SEPI / Vicente Fernández Guerrero)** — **YA materializada** en el repo: existe `content/relaciones-entre-casos/leire-diez-conexion-factual-plus-ultra.yaml` (tipo `conexion_factual`), creada por la sesión que arrancó el caso Leire. El barrido reconfirma el nexo con fuentes nuevas: Vozpópuli ("El expresidente de la SEPI sondeó al entorno de Plus Ultra en la antesala del rescate") + Público ("El expresidente de la SEPI detenido junto a Leire Díez cobró 219.000 euros de Servinabar"). Fernández Guerrero presidió la SEPI (jun-2018/oct-2019) y mantuvo funciones ejecutivas hasta abr-2021, coincidiendo con la aprobación del rescate Plus Ultra (9-mar-2021); en Leire se le investiga por presuntas comisiones de operaciones SEPI 2021-2023. Nota de enum para futuras pasadas: el schema **NO contiene `vinculo_funcional`** (como suponían la versión previa de NOTES y la skill); los valores válidos son `derivado_de`, `comparte_actor_con`, `conexion_factual`, `misma_trama`, `contradiccion_factual`. La relación existente usa `conexion_factual`, que es aceptable; `comparte_actor_con` también encajaría (organización pivote SEPI + persona Fernández Guerrero). No se toca el fichero existente (lo gestiona reconciliación). **NO** se ficha a Fernández Guerrero como `RolEnCaso` en Plus Ultra: no tiene rol procesal formal en esta causa, sólo es persona mencionada en cobertura.
- **`koldo` (nexo testaferro / sociedades pantalla)** — la UDEF habría conectado las dos tramas (El Independiente 25-may: "La UDEF conecta el 'caso Plus Ultra' con la trama Koldo a través de pagos a testaferros y contratos simulados"; Infobae 26-may; ElNacional.cat). Nexo concreto citado: Apamate Corporate and Trust firmó un contrato de 120.000 € con la consultora Análisis Relevante (vinculada a Julio Martínez, ya investigado en Plus Ultra) y pagó 300.000 € a Deluxe Fortune (sociedad vinculada a Víctor de Aldama, del caso Koldo). **NO se propone aún** `RelacionEntreCasos` plus-ultra↔koldo: el nexo procede del sumario bajo secreto y de cobertura, sin auto/informe que lo fije; esperar a primario para evitar relación basada en filtración. Anotado para seguimiento; si se confirma, candidata a `comparte_actor_con` (Julio Martínez / Aldama).
- **`begona-gomez`, `david-sanchez-badajoz`** — aparecen agrupados con Plus Ultra en piezas de "casos que cercan al PSOE / entorno de Sánchez" (eldiario.es; emol.com 27-may), pero es **contexto político compartido, no nexo procesal**: distintos jueces, distintos órganos, sin persona/organización pivote común en el procedimiento. NO se propone relación (guardarraíl: "ambos afectan al PSOE" no es `RelacionEntreCasos`).

### Conclusión del barrido

Esta pasada aporta: (1) **un hito nuevo** `auto-acusaciones-populares-pp-2026-05-29` con su hecho, dos documentos N4 y dos roles (PP, Vox); (2) consolidación de figuras económicas bajo secreto pendientes de primario (16 M€ desviados, 1,95 M€ al entorno, etc.); (3) propuesta formal de la relación `plus-ultra` ↔ `leire-diez` con el tipo de enum correcto. Cascada de coherencia sobre `caso.yaml`: `estado_actual` actualizado para reflejar la agrupación de las acusaciones populares bajo el PP; `ultima_revision_editorial` y `estado_ficha.fecha_actualizacion` a 2026-05-30. `hechos_clave`, `que_se_investiga`, `fase_actual` (sigue `instruccion`), `delitos_atribuidos_en_la_causa` y `organo_judicial_id` no cambian (la agrupación no altera objeto, fase ni calificación). `estado_ficha.conexiones` se mantiene `parcial` (la `RelacionEntreCasos` la materializa la reconciliación).

---

## Barrido actualidad 2026-05-28

### Hito incorporado

- **`auto-aplazamiento-declaracion-zapatero-2026-05-26`** — El magistrado Calama acuerda aplazar la declaración del investigado Zapatero del 2 de junio al 17 y 18 de junio de 2026, atendiendo la solicitud de la defensa por la extensión del sumario (~4.000 folios en ocho tomos entregados a las partes en los días previos). Tipo de hito usado: `auto_diligencias` (encaja: resolución de señalamiento que modifica el calendario de diligencias; no es tipo jurisdiccional de los que exigen `documento_principal_id` por V-14 del schema, pero se ha incluido igualmente apuntando al N4 más sólido).
  - **V-13 cumplido:** dos N4 de líneas editoriales distintas: `infobae-aplazamiento-zapatero-2026-05-26` (Infobae España, grupo editorial latinoamericano, cobertura propia con datos detallados del sumario) + `the-objective-aplazamiento-zapatero-2026-05-26` (The Objective, diario digital español independiente centroderecha, redacción propia no de agencia). Se descartaron Diario Libre (dominicano, nota de agencia EFE) y menorca.info (regional balear, nota de agencia EFE): ambas son difusión de agencia EFE sin valor editorial propio.
  - No consta nota oficial CGPJ sobre esta resolución a 28-may-2026. Pendiente: si aparece nota CGPJ o auto íntegro en CENDOJ, actualizar `documento_principal_id` en el hito con el documento oficial.

### Pendientes nuevos identificados en el barrido

- **Ampliación CNI/Edmundo González** — cobertura Infobae del 27-may-2026 publica que el sumario contendría notas sobre la presunta intervención del CNI en la liberación de presos venezolanos vinculados al entorno del caso. **No incorporado:** el auto del 25-may-2026 acordó secreto absoluto; se trata de información filtrada sin auto del JCI nº 4 que confirme formalmente la ampliación del objeto de la investigación. Pendiente de auto o nota CGPJ que confirme esta línea.

- **Datos económicos del sumario** — la cobertura de mayo 2026 cita 1,95 M€ al entorno directo de Zapatero (1,52 M€ él + 423.779 € hijas), 174 transferencias por 2,6 M€ entre 2020-2025, 40 empresas analizadas, 60 personas en el grafo UDEF. Datos ya anotados en el barrido previo (2026-05-27). Siguen pendientes de primario N1/N2 para modelar como Hechos con cita literal y localización exacta en el informe UDEF o en el auto íntegro.

- **4 órdenes internacionales de detención** por blanqueo y tráfico de influencias citadas en cobertura del 27-may-2026. Verificar si están dentro del auto del 19-may-2026 ya catalogado (`auto-imputacion-zapatero-2026-05-19`); si es así, no procede hito separado. Pendiente de confirmar con el auto íntegro cuando aparezca en CENDOJ.

### Cruce con caso `leire-diez` (incorporado al inventario el 2026-05-28)

El 27-may-2026 la UCO se presentó en la sede federal del PSOE (Ferraz, Madrid) durante aproximadamente 12 horas requiriendo documentación. **Es operación del `caso leire-diez`**, no de Plus Ultra: la orden de registro la dictó el magistrado Santiago Pedraz (JCI nº 5 AN, pieza separada del caso Leire), no Calama (JCI nº 4 AN, PU). No procede modelar como Hito de PU.

Sí procede dejar constancia de la **conexión factual** entre ambos casos:

- **Nexo SEPI**: Plus Ultra es el rescate SEPI del 9-mar-2021 (53 M€). El caso Leire investiga si Vicente Fernández Guerrero (presidente SEPI jun-2018/oct-2019, director general SEPI hasta abr-2021) participó en una estructura (HIRUROK) que presuntamente desvió más de 700.000 € en comisiones de contratos SEPI 2021-2023. Fernández Guerrero seguía en SEPI cuando se aprobó Plus Ultra. Vozpópuli ([url](https://www.vozpopuli.com/espana/el-expresidente-de-la-sepi-sondeo-al-entorno-de-plus-ultra-en-la-antesala-del-rescate.html)) documenta que "sondeó al entorno de Plus Ultra en la antesala del rescate".
- **Confluencia temporal de operaciones policiales en Ferraz**: el 19-may-2026 la UDEF registró la oficina de Zapatero en Ferraz por orden de Calama (PU); el 27-may-2026 la UCO entró en la sede del PSOE en Ferraz por orden de Pedraz (Leire). Dos órdenes distintas, dos procedimientos distintos, mismo edificio en ocho días.

Acción resuelta en sesiones posteriores: existe `content/relaciones-entre-casos/leire-diez-conexion-factual-plus-ultra.yaml` con tipo `conexion_factual`, que es el enum vigente para este nexo. **NO** modelar a Fernández Guerrero como `RolEnCaso` en Plus Ultra: en el inventario de PU no tiene rol procesal formal; sólo es persona mencionada en cobertura. Cuando aparezca un primario de PU que lo cite como investigado, se promueve.

Este cruce es un aprendizaje editorial de la sesión 2026-05-28: la primera lectura del brief de Sonnet describió la confluencia como "sólo coincidencia de actualidad mediática"; al investigar más en profundidad, se ve que el nexo SEPI es funcional y documentado. Se recoge en la nueva skill `actualizar-caso` (creada en la misma sesión) como guardarraíl: cuando un barrido de actualidad detecta operaciones policiales o ecos mediáticos cruzados con otro caso del inventario, **no concluir "sin vínculo" hasta cruzar nombres de personas con rol formal en ambos casos** (en este caso: Fernández Guerrero + SEPI + época del rescate PU).

### Pendiente resuelto

- ~~**Auto o resolución de aplazamiento de la declaración de Zapatero** (de 2-jun a 17-18-jun-2026)~~ — **Resuelto 2026-05-28.** Hito `auto-aplazamiento-declaracion-zapatero-2026-05-26` incorporado con dos N4 cruzados. La mención que existía en la descripción del hito `auto-imputacion-zapatero-2026-05-19` ya anticipaba el aplazamiento; ahora tiene hito propio con su Hecho y documentos.

---

## Barrido prelaunch 2026-05-27

Hallazgos del barrido de actualidad previo al lanzamiento público del dominio:

- **Nuevo hito incorporado:** `auto-diligencias-pu-2026-05-25` — auto del JCI nº 4 del 25-may-2026 acordando bloqueo de 490.780 € en cuentas de Zapatero, acceso a correos de Zapatero y sus hijas (Acens Technologies / Telefónica) y secreto absoluto sobre la UDEF. Fuentes N4 cruzadas: Infobae (25-may) + Actualidad.es (26-may).
- **Hito actualizado:** `auto-imputacion-zapatero-2026-05-19` — descripción ampliada para reflejar que la declaración inicialmente fijada para el 2-jun-2026 fue posteriormente aplazada al 17-18 de junio de 2026. Fuente: cobertura periodística barrida el 27-may-2026. **Pendiente**: localizar el auto o resolución específica del aplazamiento (no consta aún como documento en el inventario).
- **Org nueva:** `actualidad-es` creada como medio digital de comunicación para cumplir V-13 en el hito de diligencias.
- **Investigación paralela EEUU:** la cobertura de mayo 2026 menciona que el Departamento de Justicia de EEUU estaría investigando presunto blanqueo de fondos venezolanos vinculados al entorno de Plus Ultra. No incorporado al inventario: sin documento oficial ni N4 cruzado suficiente a fecha de barrido. Pendiente de seguimiento.
- **CENDOJ:** el auto íntegro del JCI nº 4 del 19-may-2026 (imputación Zapatero) y el del 25-may-2026 (diligencias bloqueo + correos) no constaban en CENDOJ a 27-may-2026.

**Hechos pendientes** (investigados en el barrido, no incorporados por falta de fuente suficiente o complejidad editorial):

- Trazabilidad del dinero: prensa cita 174 transferencias por importe de ~2,6 M€ entre cuentas vinculadas a la causa. Requiere auto íntegro o informe UDEF publicado para modelar como Hecho con cita literal y localización exacta.
- Presunta inflación de datos de pasajeros en la solicitud SEPI (requisito de viabilidad): igualmente pendiente de primario N1/N2 para modelar con garantías.

---

## Estado editorial

- **PR1 (entregado en main):** schemas cerrados, caso, 2 personas (juez Calama + Zapatero), 7 organizaciones, 5 delitos del catálogo aplicables, 3 documentos (querella Manos Limpias, nota SEPI, auto JCI 4 del 19-may), 2 hitos (querella 23-dic-2025, auto imputación 19-may-2026), 3 hechos, 3 roles.
- **PR2 (entregado en main):** 3 personas nuevas (Julio Martínez Sola, Roberto Roselli, Javier Martínez Martínez), 2 organizaciones nuevas (Infobae, Libertad Digital como medios de comunicación), 3 documentos nuevos (Infobae operación UDEF, Libertad Digital detención, Infobae cambio_organo — todos N4), 2 hitos nuevos (operación UDEF detenciones 11-dic-2025, cambio_organo a JCI 4 marzo 2026), 2 hechos nuevos (detenciones atribuido por cobertura cruzada, trama organizada investigado conforme al auto), 3 roles nuevos (los 3 detenidos como investigados por blanqueo de capitales).

- **Sesión retrospectiva (2026-05-23):** aplicación de la convención "Documentos primarios descargados a `/public/documentos/`" (AGENTS.md). Único documento N1 descargable identificado y procesado: la nota oficial del CGPJ del 19-may-2026 (auto JCI nº 4), conservada como HTML en `/public/documentos/plus-ultra/auto-jci4-plus-ultra-2026-05-19.html` (109 322 bytes, sha256 `c0189d82…f6c416aa`). Sin candidatos N1 adicionales descargables en esta pasada (ver sección "Pendientes de primario descargado" más abajo).

Total tras PR2: 5 personas · 9 organizaciones · 6 documentos · 4 hitos · 5 hechos · 6 roles.

## Pendientes de primario descargado

Documentos candidatos a aplicar la convención de `ruta_local` + `hash_sha256` que **no han podido completarse** en la pasada retrospectiva del 2026-05-23 y quedan abiertos para futuras sesiones:

- **`nota-sepi-aprobacion-plus-ultra-2021-03`** — el YAML actual apunta a `https://www.sepi.es/es/sala-de-prensa/notas-prensa` (índice general de notas), no a la URL canónica específica del comunicado del 9-mar-2021. El buscador interno de SEPI (`/es/sala-de-prensa/busqueda-de-noticias`) no devuelve resultados para "Plus Ultra" en 2026-05-23. Posibles vías para una pasada futura: (a) localizar la URL específica histórica vía Wayback Machine (`https://web.archive.org/web/2021/https://www.sepi.es/...`) si aparece archivada; (b) sustituir la nota institucional por el comunicado del Consejo de Ministros del 9-mar-2021 en `lamoncloa.gob.es` si está disponible con URL estable; (c) descargar el Real Decreto-ley 25/2020 (Fondo de Apoyo a la Solvencia) desde `boe.es` como base normativa y modelarlo como documento N1 adicional propio, no como sustituto del comunicado SEPI específico.

- ~~**BOE Real Decreto-ley 25/2020 de 3 jul 2020**~~ — **Resuelto el 2026-05-24** (decisión editorial del maintainer: catalogar). Incorporado al inventario como `boe-rdl25-2020-fondo-solvencia-fasee` (BOE-A-2020-7311, BOE núm. 185 de 6-jul-2020, 59 pp, 1.145.841 bytes, sha256 `d0c95f42…0a2f07`). PDF + XML descargados a `/public/documentos/plus-ultra/`. Enlazado desde el hecho `pu-prestamo-sepi-2021-03-09` con cita literal del art. 2.1 (creación del FASEE + adscripción a SEPI). Justifica documentalmente la base normativa del préstamo de 53 M € hoy investigado por el JCI nº 4 AN. El hecho permanece como `atribuido` (no se promueve a `acreditado` sin revisión humana específica conforme a guardarraíl 3 de [investigar-caso](docs/diseno/03-estrategia-de-mantenimiento.md#4-uso-de-llm-para-diffs-revisables)).

- **Auto íntegro del JCI nº 4 del 19-may-2026 en CENDOJ** — el documento `auto-jci4-plus-ultra-2026-05-19` referencia hoy la nota CGPJ (descargada en HTML). Cuando aparezca el auto íntegro firmado por el magistrado Calama en CENDOJ, descargarlo como PDF anexo conservando el `id` del documento existente y añadiendo un segundo `ruta_local` o creando un documento complementario `auto-jci4-plus-ultra-2026-05-19-integro` con el texto íntegro. Es la pasada que permitiría citar `Hechos Probados` o fundamentos jurídicos con localización exacta tipo "FJ Tercero, apartado 3.1, p. 14".
- **Auto JCI nº 4 del 25-may-2026 (diligencias bloqueo + correos)** — no consta en CENDOJ a 27-may-2026. Cuando aparezca, crear documento N1 propio y vincular al hito `auto-diligencias-pu-2026-05-25` como `documento_principal_id` sustituyendo el actual N4.
- **Auto o resolución de aplazamiento de la declaración de Zapatero** (de 2-jun a 17-18-jun-2026) — no localizado todavía con URL canónica. Cuando aparezca (nota CGPJ o auto en CENDOJ), crear documento y actualizar la descripción del hito `auto-imputacion-zapatero-2026-05-19`.

- **Documentos N4 (cobertura periodística) del caso** — fuera de scope de la convención de primarios descargados ([AGENTS.md → "Documentos primarios descargados"](AGENTS.md#documentos-primarios-descargados-a-publicdocumentos), sección "Cuándo NO descargar"). El mirror permanente está cubierto por `scripts/archivar-n4.mjs` + archive.org; los cinco documentos N4 del caso ya tienen `url_archivo` cumplimentado desde la sesión 6 del 2026-05-22.

---

## Pendiente para PR3 y siguientes

- **Archive.org / archive.ph mirrors** para todos los documentos N4 nuevos. WebFetch no puede llamar a archive.org desde el entorno del agente; el maintainer debe lanzar el archivado y completar `url_archivo` en cada YAML de documento. Mirror obligatorio para fuentes N4 según doc 01, "Enums catalogados".
- **Nota CGPJ del auto del cambio_organo** (febrero o marzo 2026) — pendiente de localizar en `poderjudicial.es`; cuando aparezca, sustituir `documento_principal_id` del hito `cambio-organo-jci4-2026-03` por el documento oficial y subir `nivel_fuente` a 1.
- **Comunicado oficial Policía Nacional / Interior** sobre la operación UDEF del 11-dic-2025 — no localizado todavía. Misma lógica: cuando aparezca, complementar como segundo documento del hito o sustituir el principal.
- **Auto íntegro del 19-may-2026 en CENDOJ** — actualmente el hito apunta a la nota institucional CGPJ (N1, lista blanca poderjudicial.es). Cuando publiquen el auto íntegro, añadirlo como documento N1 adicional (o `url_archivo` adicional del documento existente).
- **Manuel F. G.** (siglas en la nota CGPJ del 19-may) y otros intermediarios que aparecen anonimizados en el auto — NO se modelan como `Persona` hasta tener nombre completo confirmado en fuente oficial. Respetamos la anonimización del propio órgano hasta que el levantamiento se publique formalmente.
- **Hijas de Zapatero (Laura y Alba)** + agencia "What the fav" — registradas por la UDEF el 19-may pero **sin rol procesal formal**. [Doc 04 — "Ética"](docs/diseno/04-riesgos-legales-y-eticos.md#11-ética) prohíbe exposición de familiares no implicados. NO se crean fichas hasta que un auto les atribuya rol formal. El registro de "What the fav" se menciona dentro de la descripción del hito existente, no como hito separado, hasta que la posición procesal se aclare.
- **Denuncia de Plus Ultra contra la UDEF** por revelación de secretos (admitida a trámite el 2026-03-06 en un juzgado distinto del JCI 4). Procedimiento secundario, fuera de la causa principal. Pendiente de evaluar si modelar como pieza separada o como hito conexo. De momento, fuera del inventario.
- **Operación UDEF de 19-may-2026** (registros en Ferraz y empresa de las hijas) — actualmente se cubre dentro de la descripción del hito `auto-imputacion-zapatero-2026-05-19`. Si en el futuro hay auto específico de los registros, se puede separar en hito propio con tipo apropiado.

## Resolución de la discrepancia inicial con el brief

El brief de sesión instruía no imputar formalmente a Zapatero. Al
investigar el caso quedó claro que el auto del JCI nº 4 del 2026-05-19
sí le cita como investigado (declaración fijada para el 2026-06-02 por
tráfico de influencias, pertenencia a organización criminal y falsedad
documental). El maintainer ha confirmado el 2026-05-21 que se incorpore
conforme a la realidad procesal.

Por tanto, en PR1 se ha creado:

- `Persona(id=jose-luis-rodriguez-zapatero, es_figura_publica=true)`.
- `Documento(id=auto-jci4-plus-ultra-2026-05-19, tipo=auto_judicial, nivel_fuente=1)` con `url_canonica` a la nota oficial del CGPJ en `poderjudicial.es` (dominio en la lista blanca DominiosOficiales del doc 01, "Enums catalogados").
- `Hito(id=auto-imputacion-zapatero-2026-05-19, tipo=imputacion)` con `documento_principal_id` apuntando al auto.
- `RolEnCaso(id=zapatero-investigado-plus-ultra-2026-05, rol=investigado, fecha_inicio=2026-05-19, hito_origen_id=auto-imputacion-zapatero-2026-05-19, delitos_atribuidos=[trafico-de-influencias, organizacion-criminal, falsedad-documental])`.
- Dos `Hecho` tipo `investigado` sostenidos por el auto (V-05 cumplido, Nivel 1).

Toda la redacción aplica los verbos de [doc 04 — "Presunción de inocencia: reglas de redacción"](docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción) ("consta en el auto
que…", "se atribuye indiciariamente", "según el magistrado instructor")
y recoge expresamente la presunción de inocencia.

## Correcciones a datos del brief

- **Fecha del préstamo SEPI.** El brief decía "2020-06-22". La fecha
  correcta del acuerdo del Consejo de Ministros que autoriza el préstamo
  es **2021-03-09** (confirmado por SEPI y por la mayoría de cobertura
  multi-medio). 22 de junio de 2020 NO se identifica con ningún hito
  documentable del caso; posiblemente confusión con la entrada en vigor
  del Fondo de Apoyo a la Solvencia (Real Decreto-ley 25/2020, 3 jul
  2020). El campo `fecha_apertura` del Caso refleja el inicio de las
  diligencias previas a petición de la Fiscalía Anticorrupción tras la
  cooperación internacional Francia/Suiza en 2024.
- **"Imputación reciente: 19-may-2026"** — confirmado por fuente
  oficial (nota CGPJ en `poderjudicial.es`), pero **no se incorpora** a
  PR1 por la discrepancia anterior.
- **Acusación popular Vox** — pendiente de verificar si Vox tiene rol
  formal de acusación popular en esta causa, distinto de Manos Limpias.
  En cobertura multi-medio del 19-20 may 2026 se menciona la querella de
  Manos Limpias como principal palanca popular; Vox aparece más como
  comentario político. No se crea `RolEnCaso=acusacion_popular` para Vox
  hasta confirmar con auto judicial.

## Origen procesal verificado

- 2024 (mes exacto no disponible públicamente): la **Fiscalía
  Anticorrupción** recibe peticiones de cooperación internacional desde
  Francia y Suiza relacionadas con presunto blanqueo de fondos
  venezolanos. La Fiscalía pide al **Juzgado de Instrucción nº 15 de
  Madrid** la apertura de diligencias previas sobre el rescate Plus
  Ultra. Sin documento canónico público de la apertura.
- **2025-12-11**: operación UDEF, registros en sede de Plus Ultra y
  detenciones de varios ejecutivos y un abogado. Sin nota CGPJ accesible
  con URL canónica todavía localizada; verificable por prensa
  multi-medio. Pendiente para PR2 cuando aparezca documento oficial.
- **2025-12-23**: Manos Limpias presenta querella ante el JI nº 15 de
  Madrid añadiendo a Zapatero como querellado. Documento publicado
  íntegro por Público.es → único hito de PR1.
- **2026-03** (mes preciso, día exacto pendiente): el JCI nº 4 de la
  Audiencia Nacional (juez José Luis Calama) asume competencia. Hito
  `cambio_organo` pendiente para PR2 cuando se localice el auto de
  inhibición/asunción.
- **2026-05-19**: auto del JCI nº 4 que levanta el secreto y amplía
  imputaciones. Pendiente para PR2 (ver sección "Resolución de la discrepancia inicial con el brief").

## Decisiones de modelado tomadas

- **`Caso.organo_judicial_id` = `juzgado-central-instruccion-4`**
  (estado actual). El paso previo por el JI nº 15 Madrid se modela como
  `Hito(tipo=cambio_organo)` cuando entre en PR2.
- **`Caso.fase_actual` = `instruccion`** porque sigue en diligencias
  previas; aún no hay procesamiento ni apertura de juicio oral.
- **Documento de la querella de Manos Limpias**: nivel de fuente 3
  (documento de parte filtrado_verificado, publicado íntegro por medio
  identificable). NO Nivel 1: no es producto del órgano judicial.
- **Documento nota SEPI 2021-03-09**: nivel de fuente 1.
  `sepi.es` se incorpora a la lista blanca `DominiosOficiales` del doc
  01, "Enums catalogados" (decisión del maintainer del 2026-05-21), junto con otros
  organismos públicos con personalidad jurídica propia (AEAT, Banco de
  España, CNMV, CNMC, IGAE, BOE, EUR-Lex).
- **El Hecho `pu-prestamo-sepi-2021-03-09` se marca `tipo=atribuido`**
  porque V-04 exige documento jurisdiccional firme para `acreditado`.
  Un comunicado SEPI no es jurisdiccional. La redacción cita
  explícitamente a SEPI como actor (conforme a la definición de
  `atribuido` del doc 01, "Enums catalogados").

## Avisos para el LLM en futuras incorporaciones

- **Nunca redactar a Zapatero como culpable** en hechos no acreditados.
  Verbos prohibidos de [doc 04 — "Presunción de inocencia: reglas de redacción"](docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción). Hasta sentencia firme: sólo "se
  investiga", "se atribuye", "consta en el auto de Calama que…".
- **Distinguir "caso Plus Ultra" (el procedimiento) de "rescate Plus
  Ultra" (la operación administrativa SEPI 2021-03-09).** Son objetos
  distintos: el primero es el procedimiento penal; el segundo, una
  decisión administrativa que el procedimiento investiga.
- **Familiares de Zapatero (sus hijas)** aparecen en cobertura prensa
  por registros UDEF. [Doc 04 — "Ética"](docs/diseno/04-riesgos-legales-y-eticos.md#11-ética) prohíbe exponer familiares no
  implicados. Si la causa formalmente les atribuye un rol (`RolEnCaso`)
  se evalúa entonces; mientras tanto, fuera de la ficha.
- **Vínculo con Venezuela / chavismo** se modela como organizaciones y
  hechos atribuidos a actores identificados (UDEF, Fiscalía
  Anticorrupción, Manos Limpias), nunca como hechos acreditados sin
  sentencia. Modulo de cautela alto: redacción siempre con cita al actor.

## Fuentes consultadas para PR1

Multi-medio (≥ 2 líneas editoriales). Verificación cruzada.

- CGPJ — nota oficial 19 may 2026 (poderjudicial.es).
- Público.es — texto íntegro querella Manos Limpias.
- Newtral.es — origen procesal (Fiscalía Anticorrupción, cooperación
  Francia/Suiza).
- Infobae.es — perfil empresa, accionistas venezolanos, operación UDEF
  diciembre 2025.
- TheObjective — cobertura auto 19 may 2026.
- El Español — guía protagonistas.
- VozPópuli — perfil juez Calama.
- Hosteltur — situación devolución del préstamo.
- LawAndTrends — perfil juez Calama.
- SEPI — comunicaciones institucionales rescate Plus Ultra (sepi.es).
- Wikipedia (en) — datos descriptivos de la empresa, cruzados con SEPI
  y einforma para CIF.

URLs específicas en cada `Documento` que las cita, conforme al modelo.
