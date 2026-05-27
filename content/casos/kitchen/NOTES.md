# NOTES — Caso Kitchen

Anotaciones internas. **No se publica.** Vive en el repo para humanos
y agentes LLM que iteren sobre este caso. Convención en [AGENTS.md → "NOTES.md por caso"](AGENTS.md#notesmd-por-caso).

Última actualización: 2026-05-27 (barrido prelaunch — seguimiento juicio oral activo).

---

## Barrido prelaunch 2026-05-27

Estado del juicio oral a fecha de barrido (27-may-2026):

- **Juicio oral en activo.** La vista oral ante la Sección 4ª de la Sala de lo Penal de la AN (presidenta Teresa Palacios Criado) continúa en curso. No hay sentencia a la fecha del barrido; se espera para el otoño de 2026 (tras el verano judicial).
- **Testigos de cargo.** Ha declarado, entre otros, Eduardo Morocho (testimonio relevante sobre el espionaje a Bárcenas). También se han reproducido en sala audios de José Manuel Villarejo Pérez como prueba.
- **Turno de acusados.** Los acusados comenzarían a declarar a partir del 28 de mayo de 2026 aproximadamente.
- **Sin hito nuevo a incorporar.** El juicio está en fase de prueba; no hay resolución procesal susceptible de modelarse como Hito hasta que recaiga sentencia. Se mantiene el hito `inicio-vista-oral-kitchen-2026-04-06` como el último formalizado.
- **Sentencia pendiente** (no modelar como `sentencia_primera_instancia` hasta que recaiga la resolución publicable). Cuando recaiga, modelar hito + hechos + transformación de roles `procesado` → `condenado_no_firme` o `absuelto` para cada procesado. Previsión: otoño 2026.

---

## Por qué este caso entra ahora

Decidido el 2026-05-23 en la sesión de planning *Camino al lanzamiento
público*, Bloque A: el inventario tenía 3 casos con conexión PSOE o
gobierno PSOE-derivado (Plus Ultra · Begoña Gómez · FGE García Ortiz)
y un único caso PP (González Amador). Para evitar lectura sesgada
"anti-PSOE" del inventario antes del lanzamiento, el Bloque A
incorpora dos casos del PP/derechas, de los cuales Kitchen es uno
(el otro es Lezo, trabajado en sesión paralela).

## Corrección sustantiva de PR1+PR2 aplicada en PR3 (2026-05-24)

PR1 y PR2 modelaron erróneamente la trayectoria de **María Dolores de
Cospedal e Ignacio López del Hierro** como cadena triple
`investigada → desimputada → investigada tras revocación AN`,
asumiendo que un auto de la "Sala de Apelaciones de la AN" de julio
de 2023 había revocado el archivo dictado por el JCI nº 6 el 7 de
diciembre de 2022.

**Esa afirmación es incorrecta.** La realidad confirmada por
cobertura cruzada (The Objective, OKDIARIO, El Español, Estrella
Digital, El Plural) es:

- El sobreseimiento provisional respecto de Cospedal y López del
  Hierro fue acordado por el JCI nº 6 el 29 de julio de 2021 y
  confirmado por el mismo órgano el 7 de diciembre de 2022.
- La **Sección Tercera de la Sala de lo Penal de la Audiencia
  Nacional** dictó auto el **24 de febrero de 2023** **desestimando**
  los recursos de apelación de la Fiscalía Anticorrupción, de Unidas
  Podemos y del PSOE contra ese archivo. Es decir, **dejó firme el
  sobreseimiento en la fase de instrucción**, no lo revocó.
- Posteriores intentos de reapertura (en abril de 2026 a petición del
  PSOE al inicio de la vista oral) han sido **rechazados** por la
  Sección Cuarta de la Sala de lo Penal de la Audiencia Nacional
  presidida por la magistrada Teresa Palacios Criado.

Por tanto Cospedal y López del Hierro NO están reincorporados al
procedimiento; su trayectoria correcta es
`investigado → desimputado` con `desimputado` vigente desde
2021-07-29. PR3 aplica las siguientes correcciones:

- Elimina los roles `cospedal-investigada-2.yaml` y
  `lopez-del-hierro-investigado-2.yaml` (no existen tales roles
  vigentes).
- Elimina el hito `revocacion-archivo-cospedal-kitchen-2023-07.yaml`
  (no existe tal revocación).
- Crea el hito `confirmacion-archivo-cospedal-kitchen-2023-02-24.yaml`
  con la fecha y descripción reales (Sección 3ª desestima los
  recursos de apelación).
- Elimina el hecho `revocacion-archivo-cospedal-kitchen.yaml`.
- Modifica el hecho `archivo-cospedal-kitchen.yaml` para reflejar
  firmeza (sin `corregido_por` ni `vigencia: superado`).
- Modifica `cospedal-desimputada.yaml` y
  `lopez-del-hierro-desimputado.yaml` para que sean roles vigentes
  (sin `fecha_fin` ni `hito_fin_id`).
- Reescribe las biografías de `maria-dolores-cospedal.yaml` y de
  `ignacio-lopez-del-hierro.yaml`.
- Reescribe la descripción de `caso.yaml`.

**Lección operativa**: el guardarraíl 2 de `/investigar-caso`
(`NUNCA inventes datos`) se quedó corto en PR1 porque interpreté un
patrón sin confirmar la cobertura cruzada de cada hito. Para futuros
casos con cadenas procesales largas (archivo → recurso →
revocación), confirmar cada eslabón con al menos dos fuentes en
líneas editoriales distintas antes de modelar la cadena entera. Para
el inventario actual queda registrado como aprendizaje en
[ROADMAP → "Aprendizajes y notas (vivo)"](../../../ROADMAP.md#aprendizajes-y-notas-vivo).

## Corrección sobre delitos atribuidos a procesados

PR1 y PR2 atribuían a los roles `procesado` el delito de
`organizacion-criminal`. Esa atribución se basaba en la cobertura
inicial sobre el auto del JCI nº 6 de julio de 2021, pero el **auto
rectificador del 23 de enero de 2024** (nota CGPJ del mismo día) del
mismo instructor **excluyó del auto de apertura del juicio oral los
delitos de secuestro y de pertenencia a organización criminal** por
superar éstos el límite de pena de nueve años establecido para el
procedimiento abreviado. PR3 elimina `organizacion-criminal` de los
roles `procesado` (Fernández Díaz, Martínez, Pino, Villarejo, Ríos)
y refleja el delito sólo a nivel de instrucción mediante la
descripción de los hitos. Los roles `investigado` mantienen los
delitos atribuidos durante la fase de instrucción sin cambios.

## Contenido nuevo en PR3

### Personas (11)

- **Procesados restantes** (6): José Luis Olivera Serrano (ex jefe
  UDEF y director CITCO), Marcelino Martín-Blas Aritio (ex jefe
  UAI), Enrique García Castaño (ex jefe UCAO, con incapacidad mental
  sobrevenida apreciada tras ictus de 2022 — no se sienta en el
  banquillo), Andrés Manuel Gómez Gordo (inspector jefe próximo a
  Cospedal en Castilla-La Mancha), José Ángel Fuentes Gago (inspector
  CNP), Bonifacio Díez Sevillano (inspector CNP).
- **Tribunal de enjuiciamiento Sección 4ª Sala de lo Penal AN** (3):
  Teresa Palacios Criado (presidenta y ponente), Francisca María
  Ramis Rosselló (magistrada), Francisco Ballesteros (magistrado,
  nombre completo pendiente de verificación contra fuente CGPJ).
- **Acusaciones particulares** (2): Rosalía Iglesias Villar (esposa
  de Luis Bárcenas), Guillermo Bárcenas Iglesias (hijo).

### Organizaciones (3)

- Podemos (partido_politico, acusación popular).
- OKDIARIO (medio_comunicacion).
- El Debate (medio_comunicacion).

### Hitos (3 nuevos + 2 modificados + 1 eliminado + 1 sustituido)

- `apertura-juicio-oral-kitchen-2023-10-13` (nuevo).
- `inicio-vista-oral-kitchen-2026-04-06` (nuevo).
- `confirmacion-archivo-cospedal-kitchen-2023-02-24` (sustituye al
  erróneo `revocacion-archivo-cospedal-kitchen-2023-07`).
- `auto-procesamiento-kitchen-2021-07-29` (modificado para listar a
  los 6 procesados restantes en `personas_afectadas`).
- `imputacion-policias-kitchen-2019-05` (modificado para listar a
  los 6 nuevos investigados en `personas_afectadas`).

### Hechos (3 nuevos + 1 modificado + 1 eliminado)

- `peticion-penas-anticorrupcion-kitchen` (nuevo, atribuido).
- `incapacidad-garcia-castano-kitchen` (nuevo, exculpatorio).
- `tribunal-rechaza-suspender-juicio-kitchen-2026-04-07` (nuevo,
  atribuido).
- `archivo-cospedal-kitchen` (modificado: ahora `vigencia: vigente`
  sin `corregido_por`).
- `revocacion-archivo-cospedal-kitchen` (eliminado por incorrección
  factual).

### Documentos (10 N4 + 1 N1)

- N1: `cgpj-rectifica-auto-kitchen-2024-01-23` (nota oficial CGPJ).
- N4: `theobjective-rechazo-reapertura-cospedal-2023-02-24`,
  `okdiario-rechazo-reapertura-cospedal-2023-02-24`,
  `eldiario-apertura-juicio-oral-kitchen-2023-10`,
  `elplural-apertura-juicio-oral-kitchen-2023-10`,
  `elindependiente-rectifica-auto-kitchen-2024-01-23`,
  `eldebate-juicio-kitchen-2026-04-06`,
  `elplural-juicio-kitchen-2026-04-06`,
  `elespanol-tribunal-rechaza-cospedal-2026-04-07`,
  `estrelladigital-fiscalia-rechaza-suspender-2026-04-07`,
  `elespanol-procesamiento-policias-kitchen-2021-07-30`,
  `iustel-incapacidad-garcia-castano-kitchen-2025`.

### Roles (17 nuevos + 2 modificados + 2 eliminados + 5 corregidos)

- 12 nuevos: cadenas `investigado → procesado` para Olivera,
  Martín-Blas, García Castaño, Gómez Gordo, Fuentes Gago, Díez
  Sevillano.
- 3 nuevos del tribunal: Palacios (juez_ponente), Ramis
  (juez_ponente con nota), Ballesteros (juez_ponente con nota).
- 5 nuevos de acusaciones: PSOE acusación popular, Podemos acusación
  popular, Bárcenas acusación particular (paralelo a perjudicado),
  Rosalía Iglesias acusación particular, Guillermo Bárcenas
  acusación particular.
- 2 modificados: `cospedal-desimputada.yaml` y
  `lopez-del-hierro-desimputado.yaml` (rol vigente sin `fecha_fin`).
- 2 eliminados: `cospedal-investigada-2.yaml`,
  `lopez-del-hierro-investigado-2.yaml`.
- 5 corregidos: `fernandez-diaz-procesado.yaml`,
  `martinez-procesado.yaml`, `pino-procesado.yaml`,
  `villarejo-procesado.yaml`, `rios-procesado.yaml` (quitado
  `organizacion-criminal` por exclusión del auto rectificador
  23-ene-2024).

## Pendientes para PR4+

- **Cadena cronológica completa de instructores**. Wikipedia y otras
  fuentes mencionan que tras García-Castellón pasaron por la
  instrucción otros magistrados (Diego de Egea, José de la Mata) en
  momentos puntuales. Pendiente investigar fechas exactas y
  modelar hitos `cambio_juez` correspondientes.
- **Sentencias del juicio cuando se dicten** (previsto cierre del
  juicio entre finales de mayo y junio de 2026; sentencia en plazo
  habitual posterior).
- **Caso Tándem matriz**. Cuando se decida fichar Tándem como caso
  raíz, modificar este `caso.yaml` añadiendo `caso_padre_id: tandem`
  y `tipo_pieza: pieza_separada`.
- **Mirror archive.org (N4)**: 25 documentos con `url_canonica` pendientes
  de `url_archivo` a 2026-05-26. Ejecutar `pnpm archive:catchup -- --caso=kitchen`
  (`pnpm archive:catchup`; requiere red).
- **Auto íntegro del 24-feb-2023 de la Sección 3ª** si se localiza
  publicado con URL canónica (descarga local + N1).
- **Auto íntegro del 13-oct-2023 y rectificador del 23-ene-2024** si
  se localizan publicados (descarga local + elevación a N1).
- **Verificar nombre completo del magistrado Francisco Ballesteros**
  contra el directorio oficial del CGPJ.
- **Otros procesados archivados durante la instrucción** (si los
  hubo): comprobar si hubo más nombres barajados en la causa que
  fueran archivados antes del auto del 29-jul-2021.

## Fuentes consultadas en PR3

- The Objective (24-feb-2023): rechazo reapertura Cospedal.
- OKDIARIO (24-feb-2023): rechazo reapertura Cospedal y "Quién es
  quién" del juicio (6-abr-2026).
- El Diario (13-oct-2023): apertura juicio oral.
- El Plural (13-oct-2023 y 6-abr-2026): apertura y "Quién es quién".
- El Independiente (23-ene-2024): auto rectificador.
- El Debate (6-abr-2026): "Quién es quién" del juicio con peticiones
  de pena por persona y acusaciones personadas.
- El Español (30-jul-2021 y 7-abr-2026): procesamiento de los seis
  ex comisarios y rechazo de suspensión.
- Estrella Digital (7-abr-2026): rechazo de la Fiscalía a suspender.
- Iustel (2025): incapacidad de García Castaño.
- Fuentes Informadas (2026): composición del tribunal con Palacios
  ponente y los magistrados Ramis y Ballesteros.
- CGPJ poderjudicial.es (23-ene-2024): nota oficial sobre la
  rectificación del auto de apertura.
- Wikipedia "Caso Kitchen" (consultada como índice general; los
  datos verificables se cruzaron con fuentes primarias).
