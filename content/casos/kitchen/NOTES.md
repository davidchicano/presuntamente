# NOTES — Caso Kitchen

Anotaciones internas. **No se publica.** Vive en el repo para humanos
y agentes LLM que iteren sobre este caso. Convención en `AGENTS.md`
§ *NOTES.md por caso*.

Última actualización: 2026-05-24 (PR2 — Ignacio López del Hierro como
cadena triple paralela a Cospedal + Sergio Ríos Esgueva como
investigado → procesado).

---

## Por qué este caso entra ahora

Decidido el 2026-05-23 en la sesión de planning *Camino al lanzamiento
público*, Bloque A: el inventario tenía 3 casos con conexión PSOE o
gobierno PSOE-derivado (Plus Ultra · Begoña Gómez · FGE García Ortiz)
y un único caso PP (González Amador). Para evitar lectura sesgada
"anti-PSOE" del inventario antes del lanzamiento, el Bloque A
incorpora dos casos del PP/derechas, de los cuales Kitchen es uno
(el otro es Lezo, trabajado en sesión paralela). Pros de Kitchen
sobre otras opciones: causa viva ante la AN con procesados confirmados
(Fernández Díaz · Francisco Martínez · Pino · Villarejo), autos
jurisdiccionales públicamente cubiertos, conexión directa con la
cúpula del Ministerio del Interior bajo gobierno PP de Mariano Rajoy
y con la entonces secretaria general del PP, María Dolores de
Cospedal. Contras asumidos: procedimiento lento y largo (instrucción
abierta en julio de 2018, fase intermedia desde julio de 2021,
todavía pendiente de juicio oral); abundante cobertura periodística
pero ausencia de autos íntegros publicados con URL canónica en lista
blanca DominiosOficiales (el JCI nº 6 y la AN no publican sus autos
de instrucción ordinaria, lección reiterada de Plus Ultra, Begoña
Gómez y González Amador).

## Decisiones editoriales aplicadas en PR1

### Pieza separada del Caso Tándem como caso autónomo

Kitchen es formalmente la pieza separada nº 7 de las Diligencias
Previas 96/2017 del JCI nº 6 (Caso Tándem). El modelo del proyecto
admite modelar piezas separadas como casos hijos vía `caso_padre_id`
y `tipo_pieza: pieza_separada`, pero en PR1 se opta por modelar
Kitchen como caso raíz autónomo sin `caso_padre_id`, por dos motivos:
(a) el Caso Tándem matriz no está fichado todavía en el inventario y
crear el caso padre sólo para colgar la pieza supone trabajo
desproporcionado; (b) la pieza Kitchen tiene relevancia editorial y
mediática autónoma equivalente a la de un caso completo. Cuando en
un PR futuro se decida fichar el Caso Tándem matriz, se podrá añadir
`caso_padre_id: tandem` y `tipo_pieza: pieza_separada` a este YAML
sin destruir trazabilidad ni romper referencias cruzadas, conforme
al patrón documentado en doc 01.

### Ningún Hecho `acreditado` en PR1 conforme al guardarraíl 3

La pieza está en fase intermedia. No hay sentencia firme. Aplicando
estrictamente el guardarraíl 3 de la skill `/investigar-caso`, todos
los hechos del PR1 se modelan como `atribuido` o `investigado`, con
la única excepción del `exculpatorio` correspondiente al sobreseimiento
provisional respecto de Cospedal y López del Hierro confirmado el 7
de diciembre de 2022 (el cual queda `vigencia: superado` tras la
revocación de la Sala de Apelaciones de la AN en julio de 2023,
encadenado vía `corregido_por`).

### Ignacio López del Hierro y Sergio Ríos Esgueva — entregados en PR2

**López del Hierro** entró en PR2 con la misma cadena triple
`investigado → desimputado → investigado tras revocación AN` que
Cospedal, apuntando a los mismos hitos compartidos (imputación
sept-2019, auto procesamiento 29-jul-2021 que archiva, revocación
Sala AN jul-2023). El hito `imputacion-cospedal-kitchen-2019-09-09`,
el `archivo-cospedal-kitchen-2022-12-07`, el
`revocacion-archivo-cospedal-kitchen-2023-07` y el auto de
procesamiento se ampliaron en PR2 para listar a López del Hierro en
`personas_afectadas`; los Hechos `archivo-cospedal-kitchen` y
`revocacion-archivo-cospedal-kitchen` se ampliaron simétricamente
en `personas_implicadas`. Patrón: cuando un mismo auto judicial
afecta a varias personas con el mismo `tipo`, se mantiene un único
hito con `personas_afectadas: [...]` y se crean pares de
`RolEnCaso` por persona apuntando al mismo `hito_origen_id` /
`hito_fin_id` (consistente con la lección aprendida en Begoña Gómez
PR3 con el auto AP Madrid que desimputó a Goyache y Güemes).

**Sergio Ríos Esgueva** entró en PR2 con la cadena
`investigado → procesado` y un hito nuevo propio
(`imputacion-rios-kitchen-2018-12`) por su perfil distinto (agente
del CNP que actuaba simultáneamente como chófer del presunto
perjudicado, según el instructor). La fecha de su imputación se
sitúa en torno a diciembre de 2018, próxima a la del comisario
Villarejo, con precisión de mes mientras no se localice fuente
directa con día concreto. El hito del auto de procesamiento, el Hecho
`procesamiento-multipartito-kitchen` y los Hechos
`fondos-reservados-rios-kitchen` y `seguimientos-barcenas-kitchen`
se ampliaron en PR2 para listar a Ríos en `personas_afectadas` /
`personas_implicadas`.

### Otros policías procesados — quedan para PR3+

El auto del 29-jul-2021 procesó a varios agentes y altos cargos del
Cuerpo Nacional de Policía adicionales a los cinco fichados ya en el
caso (Fernández Díaz, Francisco Martínez, Pino, Villarejo, Ríos).
Entre ellos suenan mediáticamente Enrique García Castaño, José Luis
Olivera Serrano, Bonifacio Díez Sevillano, Marcelino Martín Blas y
Andrés Manuel Gómez Gordo. Pendientes para PR3 conforme se localice
cobertura verificable persona a persona.

### Otros policías procesados quedan para PR2

El auto del 29-jul-2021 procesó a varios agentes y altos cargos del
Cuerpo Nacional de Policía adicionales a los cuatro fichados en PR1
(Fernández Díaz, Francisco Martínez, Pino, Villarejo). Entre ellos
suenan mediáticamente Enrique García Castaño, José Luis Olivera
Serrano, Bonifacio Díez Sevillano, Marcelino Martín Blas y Andrés
Manuel Gómez Gordo. PR1 se acota a los cuatro procesados con
relevancia política y mando (ministro · secretario de Estado de
Seguridad · DAO · comisario que coordina la operación), dejando los
restantes agentes para PR2/PR3 conforme se localice cobertura
verificable por persona.

### Posición de Cospedal post-revocación AN modelada como `investigado`, no `procesado`

El auto de la Sala de Apelaciones de la AN de julio de 2023 revoca
el archivo y ordena reincorporar la causa contra Cospedal y López
del Hierro a la pieza, pero no es por sí mismo un auto de
procesamiento (procesar es competencia del instructor del JCI nº 6,
no de la Sala AN; lo que la Sala AN hace es estimar el recurso de la
Fiscalía Anticorrupción y de las acusaciones populares contra el
archivo y devolver al instructor con orden de continuar la
investigación contra ella). En consecuencia, el rol procesal post
2023-07-25 de Cospedal se modela como `investigado`, no como
`procesado`. La posición definitiva de Cospedal en la fase intermedia
queda pendiente de la resolución del instructor. Anotación pendiente
para PR2/PR3: si el JCI nº 6 dictara nuevo auto de procedimiento
abreviado respecto de Cospedal posterior a 2023-07-25, abrir nuevo
rol `procesado` con el correspondiente `hito_origen_id`. Modelado
similar al patrón aplicado en otros casos con desimputación seguida
de reapertura.

### Tipo de hito para la revocación del archivo: `recurso_apelacion`

El enum del schema `Hito.tipo` no incluye un tipo específico para
"auto de la Sala de Apelaciones que revoca un sobreseimiento" (el
enum tiene `sentencia_apelacion`, pero la revocación del archivo en
fase intermedia es un auto, no una sentencia). Se opta por modelar
el hito como `recurso_apelacion`, entendido como el evento procesal
puntual de resolución del recurso de apelación interpuesto contra el
archivo. El tipo no exige `documento_principal_id` por V-14 pero se
incluye documento de cobertura cruzada por la importancia editorial
del hito. Si en el futuro el enum se amplía con `auto_apelacion`
(análogo a la ampliación con `escrito_conclusiones_provisionales` de
Begoña Gómez PR3), revisar este hito.

### Origen de denuncia: `oficio_judicial`

La pieza Kitchen no se incoa por una querella o denuncia externa
sino por la separación del Caso Tándem matriz, que se abrió a su vez
por el sumario incoado tras la detención de Villarejo por la propia
Policía y por las diligencias previas del JCI nº 6. La opción más
cercana del enum es `oficio_judicial`.

## Pendientes para PR2+

- ~~**Ignacio López del Hierro**: persona + tres roles (investigado →
  desimputado → investigado tras revocación). Patrón paralelo a
  Cospedal.~~ **Entregado en PR2 (2026-05-24).**
- ~~**Sergio Ríos Esgueva**: persona + dos roles (investigado →
  procesado).~~ **Entregado en PR2 (2026-05-24).**
- **Otros policías procesados** (García Castaño, Olivera Serrano,
  Díez Sevillano, Martín Blas, Gómez Gordo): personas + dos roles
  cada uno conforme se localice cobertura verificable persona a
  persona. **Pendiente para PR3+.**
- **Manos Limpias** ya está fichada como organización en el inventario.
  Si se confirma su personación como acusación popular en la pieza
  Kitchen, crear rol `acusacion_popular` correspondiente.
- **Hito de apertura del juicio oral** cuando se dicte. La fecha
  exacta y el auto de apertura quedan pendientes; cuando se publique
  ficharlo como `apertura_juicio_oral` con el `documento_principal_id`
  correspondiente.
- **Caso Tándem matriz** como caso padre cuando se decida ficharlo;
  añadir `caso_padre_id: tandem` y `tipo_pieza: pieza_separada` a
  este YAML.
- **Cospedal post-revocación como `procesada`**: si el JCI nº 6
  dicta nuevo auto de procedimiento abreviado respecto de ella
  después del 2023-07-25, abrir rol `procesado` paralelo a la
  cadena ya modelada.
- **Cobertura local archive.org**: pendiente del hook pre-commit en
  el commit del PR1 (12 documentos N4 nuevos, todos elegibles para
  archivado en archive.org).
- **Autos íntegros del JCI nº 6 publicados en mirror**: la cobertura
  ocasional incluye fragmentos literales. Si un mirror periodístico
  publica el auto íntegro del 29-jul-2021 o del 7-dic-2022, considerar
  descarga local conforme a la convención de primarios descargados
  (AGENTS.md §"Documentos primarios descargados").

## Fuentes consultadas

- elDiario.es: serie de coberturas 2018-2023 sobre la pieza Kitchen
  (apertura, imputaciones, procesamiento, archivo Cospedal,
  revocación).
- Infobae: coberturas paralelas 2018-2023 sobre los mismos hitos.
- El País: cobertura del Caso Tándem matriz desde noviembre de 2017
  y de la revocación del archivo de Cospedal en 2023.
- laSexta: cobertura televisiva del Caso Tándem y de la pieza Kitchen.
- Informes públicos de la Unidad de Asuntos Internos del Cuerpo
  Nacional de Policía remitidos al JCI nº 6 (citados por la cobertura
  cruzada de elDiario.es e Infobae en 2020).

URLs canónicas específicas de cada artículo NO se han incluido en
los YAML del PR1 por el guardarraíl 2 de la skill (`NUNCA inventes
datos`): cuando no se localiza con alta confianza la URL exacta del
artículo, se omite el campo `url_canonica` (opcional en el schema).
El hook pre-commit archive.org sólo procesa documentos N4 con
`url_canonica`; los del PR1 quedarán como backlog pendiente que el
maintainer puede completar en PR2 una vez localizadas las URLs
exactas.
