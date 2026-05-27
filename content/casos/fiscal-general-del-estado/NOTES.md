# NOTES — Caso del Fiscal General del Estado

Anotaciones internas. **No se publica.** Vive en el repo para humanos
y agentes LLM que iteren sobre este caso. Convención en [AGENTS.md → "NOTES.md por caso"](AGENTS.md#notesmd-por-caso).

Última actualización: 2026-05-27 (barrido prelaunch — amparo TC + informe indulto). Antes: 2026-05-23 (PR3 — tribunal de enjuiciamiento + hechos acreditados con cita literal).

## Barrido prelaunch 2026-05-27

Hallazgos del barrido de actualidad previo al lanzamiento público:

- **Hito incorporado:** `recurso-amparo-tc-fge-2026-04-10` — la Fiscalía General del Estado interpone recurso de amparo ante el Tribunal Constitucional el 10-abr-2026, invocando cinco derechos fundamentales presuntamente vulnerados por la sentencia de la Sala de lo Penal del TS que condenó a García Ortiz. El recurso no tiene efecto suspensivo sobre la condena. Admisibilidad pendiente en el TC a 27-may-2026. Fuentes N4 cruzadas: El Independiente + Libertad Digital (líneas editoriales distintas). Nueva org creada: `tribunal-constitucional`. Schema extendido: nuevo tipo `recurso_amparo` añadido al enum de Hito (en V-14 por ser procesal).
- **Hito incorporado:** `informe-fiscalia-indulto-fge-2026-05-08` — la Fiscalía del TS emite informe favorable a un indulto parcial para García Ortiz el 8-may-2026, solicitando eximirle de la inhabilitación de 2 años para cargo público (la pena económica de 17.200 € ya fue abonada el 30-ene-2026). Pendiente: informe del propio TS + decisión del Consejo de Ministros. Fuentes N4 cruzadas: The Objective + El Español. `fase_resultante: ejecucion`.
- **Vínculo institucional pendiente (documentar-vinculos):** García Ortiz tiene un nuevo cargo en la **Sección Social del Tribunal Supremo** (nombramiento posterior a la condena). Pendiente de modelar como vínculo institucional con la skill `documentar-vinculos` cuando se localice el acuerdo del CGPJ o BOE correspondiente.

---

## Por qué este caso entra ahora

Decidido el 2026-05-22 por el maintainer: el caso del FGE entra
después del PR3 del caso González Amador porque (a) está
factualmente conectado al caso ya fichado, (b) tiene sentencia firme
del TS (la primera del inventario) y por tanto permite estrenar el
rol `condenado_firme` con un caso de máxima relevancia objetiva, y
(c) la sentencia firme abre la puerta a hechos con tipo `acreditado`
que hasta ahora ningún caso del inventario tenía con respaldo
jurisdiccional plenamente firme. La fichada como caso autónomo era
condición previa para crear la `Persona(carlos-neira)` y el
`RelacionEntreCasos(gonzalez-amador, fiscal-general-del-estado)` que
quedaban pendientes en NOTES del caso González Amador.

## Decisiones editoriales aplicadas en PR1

### Rol procesal de Carlos Neira en cada caso

Carlos Neira es el abogado de Alberto González Amador. En el caso
González Amador su rol es `abogado_defensa` del investigado, conforme
quedó pendiente en NOTES de aquel caso. En el caso FGE, en cambio, su
rol procesal NO es `abogado_defensa` (lo sería respecto del acusado
García Ortiz, que tiene su propia defensa) sino **`abogado_acusacion`**,
porque defiende a la acusación particular, encarnada en su cliente
Alberto González Amador, que es a la vez el perjudicado del delito y
quien ejerció la acción penal. La indicación de la NOTES de González
Amador, que apuntaba "abogado_defensa en ambos casos", se revisó en
este PR1 con cobertura confirmando que Neira firma escritos como
acusación particular (cf. El Español 30-ene-2026 "La pareja de Ayuso
pide al TS que confirme la condena al exfiscal general").

### Rol procesal de Alberto González Amador en el caso FGE

González Amador es a la vez **perjudicado** y **acusación particular**
en el caso FGE: perjudicado porque la sentencia firme le reconoce
10.000 euros de indemnización por daños morales derivados de la
filtración, y acusación particular porque ejerció la acción penal
mediante querella presentada el 3 de abril de 2024 ante el TSJ
Madrid. En el modelo del proyecto las dos figuras pueden recaer en la
misma persona; el rol procesal que define su posición activa en el
procedimiento es `acusacion_particular`, así que se modela ese rol y
la condición de perjudicado queda reflejada editorialmente en la nota
del rol y en los hechos de la indemnización. Si en el futuro se
quiere modelar el `perjudicado` de forma autónoma para visualizarlo
en la card de la persona, se podrá añadir como rol consecutivo o
paralelo; en PR1 se opta por la solución sencilla.

### Trayectoria procesal completa de García Ortiz como cadena de cuatro roles consecutivos

El procedimiento es el primero del inventario con sentencia firme
condenatoria, así que García Ortiz testa por primera vez la cadena
completa `investigado → procesado → condenado_no_firme → condenado_firme`
con `fecha_fin` + `hito_fin_id` en los tres primeros tramos y
`hito_origen_id` en los condenado_*. Se aplica el mismo patrón
reusable de la cadena `investigado → desimputado` validado con
Goyache (Begoña Gómez PR1) y Gómez Fidalgo (González Amador PR1).

### Hechos `atribuido` en PR1 a pesar de existir sentencia firme

El guardarraíl 3 de la skill `/investigar-caso` (no asignar
`Hecho.tipo = acreditado` automáticamente) sigue plenamente vigente
aunque exista sentencia firme. En PR1 se modelan todos los hechos
como `atribuido` con cita literal de la Sentencia 1000/2025, dejando
para una revisión humana explícita del maintainer (PR2) la promoción
a `acreditado` de los hechos directamente derivados del fallo
dispositivo. Justificación adicional: el recurso de amparo ante el
Tribunal Constitucional, presentado el 10 de abril de 2026 por la
Fiscalía y el 13 de abril de 2026 por la defensa del condenado,
podría hipotéticamente revisar la firmeza en sede constitucional;
optar conservadoramente por `atribuido` hasta que el amparo decaiga
o se resuelva sin efectos retroactivos es coherente con el principio
del modelo (preferir el grado epistémico inferior cuando hay
incertidumbre, aunque sea procesalmente marginal).

### Magistrados modelados en PR1

De los siete magistrados que enjuiciaron el caso se modelan en PR1
dos personas concretas: **Andrés Martínez Arrieta** como
`juez_ponente` (presidente de la Sala Segunda y ponente final tras
el cambio de ponencia motivado por los votos particulares) y
**Ángel Luis Hurtado** como `juez_instructor` (magistrado instructor
designado por la Sala). Los cinco magistrados restantes del tribunal
de enjuiciamiento (Manuel Marchena, Carmen Lamela, Juan Ramón
Berdugo, Antonio del Moral en la mayoría; Ana María Ferrer García y
Susana Polo García en los votos particulares) se citan en la prosa
de la ficha y en la `descripcion` del hito de sentencia pero no se
ficha cada uno como Persona en PR1; se reservan para PR2 si entran
en otros casos del inventario o si el maintainer lo pide. El
magistrado Francisco José Goyena Salgado, instructor en la fase
previa ante el TSJ Madrid (mayo-julio de 2024), tampoco se ficha en
PR1 porque la fase ante el TSJM se modela como contexto en la
`descripcion` del primer hito y no como hito propio.

### Sentencia 1000/2025: nivel de fuente

El texto íntegro de la Sentencia 1000/2025 no se ha localizado en
CENDOJ (poderjudicial.es) a fecha de PR1, pese a ser una causa
especial del TS Sala Segunda con tribunal aforado, lo que la haría
candidata habitual a publicación. Sí está disponible en mirrors
periodísticos (PDF de okdiario, transcripción en Público.es,
análisis jurídico en Catalina Garay) y en la base de datos de
Civil-Mercantil. Para PR1 se modelan dos documentos distintos: la
**nota oficial del CGPJ del 9 de diciembre de 2025** anunciando la
notificación de la sentencia (N1 en `poderjudicial.es`) y el
**texto íntegro de la sentencia** como N3 `filtrado_verificado` (PDF
del 9-dic-2025 en mirrors periodísticos con verificación cruzada
entre Público.es y okdiario.com). Cuando aparezca en CENDOJ se
elevará a N1 manteniendo el mismo `id` del documento.

### Numerología procesal

- **Causa principal**: Causa Especial nº 20557/2024.
- **Causas acumuladas** (ambas presentadas por Manos Limpias / Miguel
  Bernad Remón): Causas Especiales 21116/2024 y 21258/2024. La
  acumulación es contextual y se cita en la `descripcion` del hito de
  apertura de causa; no se modelan como hitos `acumulacion_causas`
  propios en PR1 (cabe hacerlo en PR2 si el maintainer lo solicita).
- **Sentencia**: 1000/2025, de 9 de diciembre de 2025.
- **Real Decreto de cese**: 1138/2025 de 9 de diciembre (BOE
  10-dic-2025).
- **Real Decreto de nombramiento de la sucesora**: 1140/2025 de
  9 de diciembre (BOE 10-dic-2025).

## Magistrados, votación y votos particulares

Tribunal de enjuiciamiento (Sala Segunda del TS, siete magistrados,
constituido el 25-sept-2025):

- Andrés Martínez Arrieta (presidente; ponente final).
- Manuel Marchena Gómez.
- Juan Ramón Berdugo Gómez de la Torre.
- Antonio del Moral García.
- Carmen Lamela Díaz.
- Ana María Ferrer García (voto particular disidente).
- Susana Polo García (voto particular disidente).

Mayoría condenatoria: 5 votos a 2.

## Verbos de [doc 04 — "Presunción de inocencia: reglas de redacción"](docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción) aplicados

- "La Sala Segunda del Tribunal Supremo declara probado…", "consta
  en la sentencia firme que…", "el fallo dispositivo impone…", "los
  votos particulares disidentes sostienen que…", "la defensa alega…",
  "el recurso de amparo pendiente plantea…".
- En el caso de hechos posteriores a la sentencia firme pero todavía
  cubiertos por la presunción de inocencia formal (el amparo
  constitucional puede dejar la sentencia sin efecto), se mantiene el
  registro epistémico `atribuido` en lugar de `acreditado`.

## Fuentes consultadas para PR1

Multi-línea editorial (≥ 2 líneas editoriales por hito), con
cobertura cruzada entre derecha, centro e izquierda mediática.

- Nota CGPJ 16-oct-2024 (apertura causa) — `poderjudicial.es` N1.
- Nota CGPJ 20-nov-2025 (condena, lectura del fallo) — `poderjudicial.es` N1.
- Nota CGPJ 9-dic-2025 (notificación de la sentencia) — `poderjudicial.es` N1.
- Sentencia 1000/2025 íntegra — N3 (filtrado_verificado, dos mirrors).
- BOE-A-2025-XXXXX — RD 1138/2025 de cese; BOE-A-2025-XXXXY — RD
  1140/2025 de nombramiento. (URLs canónicas confirmadas con
  búsqueda en `boe.es` en PR1; ver el documento `boe-cese-garcia-ortiz`).
- El Español — cobertura del juicio (3-13 nov 2025) y del fallo del
  20-nov-2025 con resultado "5 votos a 2".
- Infobae — archivo Pilar Rodríguez 29-jul-2025; incidente nulidad
  26-feb-2026.
- TheObjective — recurso amparo TC 13-abr-2026.
- El Independiente — amparo de la Fiscalía 10-abr-2026.
- Confilegal — ratificación condena 26-feb-2026.
- Moncloa.com — sentencia y firmeza.
- Demócrata — publicación sentencia íntegra.
- Wikipedia — biografía pública verificada de García Ortiz (sólo para
  datos biográficos no controvertidos: fecha de nacimiento, formación,
  nombramientos, cese).

URLs específicas en cada `Documento` que las cita.

## Cambios y correcciones aplicados en PR2 (2026-05-22)

### Descarga al árbol del proyecto de tres documentos primarios

Estrenando la convención editorial documentada en [AGENTS.md → "Documentos primarios descargados"](AGENTS.md#documentos-primarios-descargados-a-publicdocumentos) y en
[investigar-caso SKILL.md](../../../../../.agents/skills/investigar-caso/SKILL.md) apartado 3.bis:

- `/public/documentos/fiscal-general-del-estado/ts-sentencia-1000-2025-fge.pdf`
  — Sentencia 1000/2025 íntegra (238 páginas; voto particular
  conjunto de las magistradas Polo y Ferrer incluido, pp. 184-238).
  Autor PDF `g.tejedor` del propio Tribunal Supremo, creado
  9-dic-2025 10:48. SHA256
  `f671449be85b80e77c0088defa7a26b2dd8324117f836efb8b301453abfbeea1`.
  Verificada por triangulación con segundo mirror (civil-mercantil.com,
  182 páginas, sin voto particular). Mantenida como `nivel_fuente: 3`
  (filtrado_verificado) hasta que aparezca en CENDOJ.
- `/public/documentos/fiscal-general-del-estado/boe-cese-garcia-ortiz-fge-2025-12-10.{pdf,xml}`
  — Real Decreto 1138/2025 (BOE-A-2025-25142), PDF + XML
  estructurado.
- `/public/documentos/fiscal-general-del-estado/boe-nombramiento-peramato-fge-2025-12-10.{pdf,xml}`
  — Real Decreto 1140/2025 (BOE-A-2025-25144), PDF + XML
  estructurado.

### Cuatro hechos promovidos a `acreditado` con cita literal con localización exacta

Tras revisión humana explícita del maintainer (guardarraíl 3 de
`/investigar-caso`):

- `filtracion-correo-2feb-fge` ⇒ Hechos Probados pp. 18-21 + FJ
  Tercero pp. 146-148.
- `quebrantamiento-deber-reserva-fge` ⇒ FJ Tercero, apartados 3.1-3.2,
  pp. 146-149.
- `penas-impuestas-fge` ⇒ FALLO, p. 180.
- `indemnizacion-gonzalez-amador-fge` ⇒ FALLO, p. 180.

El de `votos-particulares-fge` se mantiene como `atribuido` (es
opinión de las disidentes, no del fallo) pero con cita literal del
voto particular p. 237.

### Cuatro hitos previos de la fase TSJ Madrid añadidos

- `denuncia-icam-fge-2024-03-20` (`denuncia_presentada`). Estrena
  el nivel N2 con corporación de derecho público (ICAM) cuyo dominio
  está fuera de la lista blanca DominiosOficiales.
- `querella-gonzalez-amador-tsjm-fge-2024-04-03`
  (`querella_presentada`).
- `tsjm-admite-querella-fge-2024-05-07` (`querella_admitida`).
- `exposicion-razonada-tsjm-ts-fge-2024-07-15` (`cambio_organo`).

## Cambios y correcciones aplicados en PR3 (2026-05-23)

### Composición completa del tribunal de enjuiciamiento

Seis magistrados nuevos del TS Sala 2ª, con biografía verificada
contra CGPJ y BOE. Cada uno con rol `juez_ponente` en la causa
(notas editoriales aclaran posición en mayoría o disidencia y que
la ponencia formal recae en Martínez Arrieta):

- Mayoría condenatoria: Manuel Marchena Gómez (RD 891/2014
  presidente Sala 2ª 10-oct-2014 a 6-dic-2024), Juan Ramón Berdugo
  Gómez de la Torre (Sala 2ª desde 2004), Antonio del Moral García
  (Sala 2ª desde 2012), Carmen Lamela Díaz (Sala 2ª desde sept-2018).
- Voto particular conjunto: Ana María Ferrer García (primera mujer
  Sala 2ª, juramento 7-abr-2014) y Susana Polo García (Sala 2ª
  desde sept-2018, RD 1079/2018 BOE-A-2018-12414).

### Cuatro hechos adicionales acreditados con cita literal

Extraídos del texto íntegro de la Sentencia 1000/2025:

- `presion-whatsapp-lastra-fge`: transcripción literal de los cuatro
  mensajes de WhatsApp del Fiscal General a la Fiscal Superior de
  Madrid el 14-mar-2024 (Hechos Probados, p. 21).
- `adelanto-nota-elpais-fge`: adelanto de tres horas de la nota
  informativa al diario EL PAÍS «con autorización del Fiscal
  General del Estado» (Hechos Probados, p. 21).
- `borrado-dispositivos-fge`: borrado de mensajes el 16-oct-2024,
  mismo día de la notificación de la incoación de diligencias
  previas, aceptado por el propio acusado en juicio (FJ Primero,
  apartado 1.b, p. 35 y FJ Segundo, apartado 2.7.2, p. 134).
- `relato-falso-mar-fge`: rol de Miguel Ángel Rodríguez (jefe de
  Gabinete de la Presidencia de la Comunidad de Madrid) en la
  difusión nocturna del 13-mar-2024 del relato sobre una supuesta
  retirada del pacto, identificado por la Sala como detonante de
  la actuación posterior del Fiscal General (Hechos Probados,
  p. 17; voto particular, p. 237, con reinterpretación opuesta de
  la misma secuencia).

### Correcciones a PR1 con fuentes N1 del BOE

- **Pilar Rodríguez Fernández**: fecha de cargo como Fiscal Jefa
  Provincial de Madrid corregida a `2018-10-12` (Real Decreto
  1288/2018, BOE-A-2018-14014), antes estimada en 2019-09-01.
- **Andrés Martínez Arrieta**: añadida fecha de nacimiento
  (13-abr-1955, Logroño); separados dos cargos públicos históricos
  (magistrado Sala 2ª desde 1998; presidente Sala 2ª desde
  2025-08-25 por Real Decreto 708/2025, BOE-A-2025-17263); biografía
  ampliada con sucesión Marchena → Martínez Arrieta documentada
  (presidía en funciones desde el 6-dic-2024 tras expiración del
  mandato de Marchena; nombramiento formal CGPJ el 23-jul-2025).

## Cambios aplicados durante el backlog editorial heredado (2026-05-27)

Pasada de afinamiento sobre tres hallazgos no estructurales detectados por la
auditoría `/revisar-caso` del 2026-05-27 (ver `ROADMAP.md` del cierre).

### Nuevo rol procesal para Julián Salto Torres en la fase TSJM

- `content/casos/fiscal-general-del-estado/roles/salto-investigado-tsjm.yaml`
  (id `salto-investigado-tsjm-fge-2024-04`, `rol: investigado`, fechas
  2024-04-03 → 2024-10-15, delitos `revelacion-de-secretos` / art. 417.1 CP,
  `hito_origen_id: querella-gonzalez-amador-tsjm-fge-2024-04-03`,
  `hito_fin_id: apertura-causa-fge-2024-10-15`).
- Cierra el gap detectado: Julián Salto Torres figuraba ya como Persona
  fichada con `es_figura_publica: true` y aparecía nominalmente en la
  descripción de dos hitos (`querella-gonzalez-amador-tsjm-fge-2024-04-03`,
  `tsjm-admite-querella-fge-2024-05-07`) sin rol formal.
- El rol cubre estrictamente la fase TSJM: la Sala Segunda del TS, al asumir
  competencia el 15-oct-2024 por razón del aforamiento del entonces FGE, abrió
  causa especial únicamente contra Álvaro García Ortiz y Pilar Rodríguez
  Fernández; Salto quedó excluido de la causa principal.
- Salto añadido a `personas_afectadas` de los dos hitos TSJM en que aparece
  mencionado en la prosa (presentación y admisión de la querella), por
  coherencia con el `hito_origen_id` del nuevo rol.

### V-19 aplicada a cuatro hechos con `nivel_fuente_efectivo: 1` que sólo citan la sentencia TS (N3)

Hechos corregidos a `nivel_fuente_efectivo: 3`:

- `adelanto-nota-elpais-fge`.
- `presion-whatsapp-lastra-fge`.
- `relato-falso-mar-fge`.
- `borrado-dispositivos-fge`.

Verificado que las dos notas CGPJ disponibles (fallo del 20-nov-2025 y
notificación del 9-dic-2025) son resúmenes generales del fallo y no entran en
el detalle específico de la nota a EL PAÍS, los WhatsApp a Lastra, el relato
falso de MAR ni el borrado de dispositivos. Cuando aparezca la sentencia
íntegra en CENDOJ y se promueva el documento a N1 (manteniendo `id` y
`hash_sha256`), los cuatro hechos volverán automáticamente a N1 por V-19.

### Aclaración de `nivel_fuente_justificacion` en escrito Fiscalía recurso AP (Begoña Gómez)

Hallazgo aplicado al documento `escrito-fiscalia-recurso-ap-bg-2026-04-21`
(caso `begona-gomez`, no FGE) — anotado aquí sólo como referencia cruzada
para mantener trazabilidad de la pasada del 27-may: la justificación se
reescribió para aclarar que el N2 se asigna por tipo y origen (escrito
procesal del Ministerio Fiscal), no por publicación oficial en `fiscal.es`.

## Pendiente para PR4 y siguientes

- **Archive.org / archive.ph mirrors** para los documentos N4.
  Maintainer archiva con `pnpm archive:catchup` (manual; requiere red).
- **Localización del texto íntegro de la Sentencia 1000/2025 en
  CENDOJ**. Si aparece, sustituir `nivel_fuente: 3` por `1`
  manteniendo el mismo `id` del documento y el mismo `hash_sha256`
  (que sirve como prueba de fidelidad histórica).
- **Recurso de amparo ante el Tribunal Constitucional**. A fecha
  de PR3 (mayo de 2026) hay dos recursos presentados (Fiscalía
  el 10-abr-2026; García Ortiz el 13-abr-2026), pendientes de
  admisión a trámite. El tipo de Hito `recurso_amparo` no existe
  en el enum del schema; cuando entre el primer auto del TC sobre
  admisión, decidir si se amplía el enum (paralelo a la adición de
  `escrito_conclusiones_provisionales` en Begoña Gómez PR3) o se
  modela como `recurso_casacion` (operativamente cercano, aunque
  no sea casación stricto sensu) con explicación editorial.
- **Registros UCO** del 29-oct-2024 en el despacho del Fiscal
  General y en la Fiscalía Provincial de Madrid. Notas oficiales
  del CGPJ ya disponibles en `poderjudicial.es`; el enum del
  schema no tiene un tipo limpio para "auto de entrada y registro",
  así que se modelaría como contexto del hito `imputacion` o se
  ampliaría el enum.
- **Personas del entorno del condenado citadas en la sentencia
  pero sin rol procesal formal**: Almudena Lastra de Inés (fiscal
  superior de Madrid), directora de comunicación de la Fiscalía
  (no identificada nominalmente en los hechos probados aquí
  modelados), Miguel Ángel Rodríguez (jefe de Gabinete de la
  Presidencia de la Comunidad de Madrid, citado como detonante
  del relato falso). No se modelan como Persona conforme al
  principio editorial de incluir sólo a personas con rol procesal
  formal; quedan citadas en la prosa de los hechos.

## Avisos para el LLM en futuras incorporaciones

- **García Ortiz está condenado por sentencia firme.** Pero la
  presunción de inocencia formal sólo decae con la firmeza definitiva;
  el recurso de amparo ante el TC, aunque jurisdiccional residual,
  no es vía ordinaria y por tanto la firmeza ya consta. Aun así, el
  registro epistémico de los hechos en PR1 sigue siendo `atribuido`
  conservadoramente; cuando el maintainer apruebe, se promoverán a
  `acreditado`. Lenguaje editorial: "condenado en sentencia firme",
  "se declara probado por sentencia firme", "consta en el fallo".
- **Pilar Rodríguez Fernández es DESIMPUTADA.** Por auto del
  29-jul-2025 la Sala Penal archivó el procedimiento respecto de
  ella. Cualquier redacción que la mencione como investigada sin
  matiz temporal es incorrecta (ver [AGENTS.md → "Documentos primarios descargados"](AGENTS.md#documentos-primarios-descargados-a-publicdocumentos) para normas de anonimización en cierre de roles).
- **Alberto González Amador NO está acusado en este procedimiento.**
  Es el perjudicado y ejerció la acusación particular. La
  presunción de inocencia que rige en el caso González Amador (caso
  conexo, también vivo) no se ve afectada por la condena firme
  contra García Ortiz: son procedimientos distintos sobre delitos
  distintos. Cuidado al redactar para no mezclar.
- **El caso González Amador NO se mezcla aquí.** La filtración del
  correo del 2-feb-2024 es el hecho que da origen al delito
  cometido por García Ortiz, pero la causa contra González Amador
  por presunto fraude fiscal sigue su curso independiente. El
  `RelacionEntreCasos` modelado en este PR1 documenta la conexión
  factual; el contenido editorial respeta la separación.
- **Tratamiento sin cuota política.** El caso involucra al máximo
  responsable del Ministerio Fiscal, nombrado a propuesta del
  Gobierno. La P-10 de [doc 02 — "Reglas anti-desinformación en presentación"](docs/diseno/02-ficha-de-caso.md#4-reglas-anti-desinformación-en-presentación) obliga a aplicar exactamente la misma estructura,
  badges y tono que a cualquier otro caso del inventario.
- **La controversia política y mediática alrededor del caso es
  intensa.** El propio Gobierno ha manifestado intención de
  "anular" la sentencia (cobertura de El Debate 11-abr-2026), y el
  recurso de amparo plantea cuestiones de fondo sobre la
  presunción de inocencia, el deber de reserva del Fiscal General y
  los límites del control judicial sobre las decisiones del
  Ministerio Fiscal. Mantener registro estrictamente procesal en
  los hechos: lo que dice la sentencia firme, lo que sostienen los
  votos particulares, lo que alega el recurso de amparo. No
  editorializar.
