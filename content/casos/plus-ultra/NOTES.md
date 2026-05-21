# NOTES — Caso Plus Ultra

Anotaciones internas. **No se publica.** Vive en el repo para humanos y agentes LLM que iteren sobre este caso. Convención en `AGENTS.md` § *NOTES.md por caso*.

Última actualización: 2026-05-21.

---

## Estado editorial

- **PR1 (esta entrega):** schemas cerrados, caso, 2 personas (juez instructor + Zapatero como investigado conforme al auto del 19 may 2026), 7 organizaciones, catálogo de delitos aplicables, 3 documentos verificables (querella Manos Limpias, nota SEPI, auto JCI 4), 2 hitos (querella 23 dic 2025 y auto de imputación 19 may 2026), 3 hechos (préstamo SEPI atribuido + 2 investigados sostenidos por el auto), 3 roles (Calama juez instructor, Manos Limpias acusación popular, Zapatero investigado).
- **PR2 pendiente:** ejecutivos de Plus Ultra detenidos en la operación UDEF de 2025-12-11 como `Persona` + `RolEnCaso=investigado`, cuando se localice documento procesal con URL canónica. Cambio_organo JI 15 Madrid → JCI 4 AN (marzo 2026) cuando se localice el auto. Informes UDEF que aporten hechos adicionales.

## Resolución de la discrepancia inicial con el brief

El brief de sesión instruía no imputar formalmente a Zapatero. Al
investigar el caso quedó claro que el auto del JCI nº 4 del 2026-05-19
sí le cita como investigado (declaración fijada para el 2026-06-02 por
tráfico de influencias, pertenencia a organización criminal y falsedad
documental). El maintainer ha confirmado el 2026-05-21 que se incorpore
conforme a la realidad procesal.

Por tanto, en PR1 se ha creado:

- `Persona(id=jose-luis-rodriguez-zapatero, es_figura_publica=true)`.
- `Documento(id=auto-jci4-plus-ultra-2026-05-19, tipo=auto_judicial, nivel_fuente=1)` con `url_canonica` a la nota oficial del CGPJ en `poderjudicial.es` (dominio en la lista blanca DominiosOficiales del doc 01 §3).
- `Hito(id=auto-imputacion-zapatero-2026-05-19, tipo=imputacion)` con `documento_principal_id` apuntando al auto.
- `RolEnCaso(id=zapatero-investigado-plus-ultra-2026-05, rol=investigado, fecha_inicio=2026-05-19, hito_origen_id=auto-imputacion-zapatero-2026-05-19, delitos_atribuidos=[trafico-de-influencias, organizacion-criminal, falsedad-documental])`.
- Dos `Hecho` tipo `investigado` sostenidos por el auto (V-05 cumplido, Nivel 1).

Toda la redacción aplica los verbos del doc 04 §3 ("consta en el auto
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
  imputaciones. Pendiente para PR2 (ver §Discrepancia).

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
  01 §3 (decisión del maintainer del 2026-05-21), junto con otros
  organismos públicos con personalidad jurídica propia (AEAT, Banco de
  España, CNMV, CNMC, IGAE, BOE, EUR-Lex).
- **El Hecho `pu-prestamo-sepi-2021-03-09` se marca `tipo=atribuido`**
  porque V-04 exige documento jurisdiccional firme para `acreditado`.
  Un comunicado SEPI no es jurisdiccional. La redacción cita
  explícitamente a SEPI como actor (conforme a la definición de
  `atribuido` del doc 01 §3).

## Avisos para el LLM en futuras incorporaciones

- **Nunca redactar a Zapatero como culpable** en hechos no acreditados.
  Verbos prohibidos del doc 04 §3. Hasta sentencia firme: sólo "se
  investiga", "se atribuye", "consta en el auto de Calama que…".
- **Distinguir "caso Plus Ultra" (el procedimiento) de "rescate Plus
  Ultra" (la operación administrativa SEPI 2021-03-09).** Son objetos
  distintos: el primero es el procedimiento penal; el segundo, una
  decisión administrativa que el procedimiento investiga.
- **Familiares de Zapatero (sus hijas)** aparecen en cobertura prensa
  por registros UDEF. Doc 04 §11 prohíbe exponer familiares no
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
