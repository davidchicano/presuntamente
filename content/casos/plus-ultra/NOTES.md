# NOTES — Caso Plus Ultra

Anotaciones internas. **No se publica.** Vive en el repo para humanos y agentes LLM que iteren sobre este caso. Convención en [AGENTS.md → "NOTES.md por caso"](AGENTS.md#notesmd-por-caso).

Última actualización: 2026-05-27 (barrido prelaunch — diligencias 25-26 may 2026).

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
