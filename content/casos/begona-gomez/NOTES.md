# NOTES — Caso Begoña Gómez

Anotaciones internas. **No se publica.** Vive en el repo para humanos y agentes LLM que iteren sobre este caso. Convención en [AGENTS.md → "NOTES.md por caso"](AGENTS.md#notesmd-por-caso).

Última actualización: 2026-05-30 (barrido de actualidad — detalle informe UCO + fiscalización Cámara de Cuentas de Madrid). Antes: 2026-05-27 (barrido prelaunch — audiencia previa 26-may + informe UCO 25-may). Antes: 2026-05-25 (skill `documentar-vinculos` v0; ver sección "Vínculos institucionales"). Antes: 2026-05-23 (barrido primarios descargados). Antes: 2026-05-22 (PR3).

---

## Barrido de actualidad 2026-05-30

Ventana cubierta: desde el último hito catalogado (auto de audiencia previa del 26-may-2026) hasta el 30-may-2026. Barrido con cobertura cruzada (≥3 líneas editoriales por novedad). Última fecha conocida previa: **2026-05-26**.

**Novedades incorporadas:**

- **Detalle del informe UCO (hito existente enriquecido + Hecho nuevo).** El hito `informe-uco-bg-2026-05-25` tenía una descripción provisional ("conclusiones divergentes"). La cobertura posterior, cruzada en ≥6 líneas editoriales (elDiario.es, El Español, The Objective, El Plural, Euronews, Infobae, OKDiario, Vozpópuli, El Debate, Telemadrid, Canal Sur, Noticias de Navarra), permite precisar el contenido del atestado (fechado **21-may-2026**, varios cientos de páginas): (a) la cátedra TSC se creó **conforme a la normativa** de la UCM; (b) la UCO **no halla ingresos opacos** ni incremento patrimonial irregular en las cuentas de Gómez (matiza la tesis del instructor); (c) sí aprecia irregularidades en la contratación del software: Making Science 24.200 € "prescindiendo del procedimiento administrativo" pese a superar el límite del contrato menor (15.000 €); Deloitte 78.648,79 € en dos contratos (14.999 € + 60.500 €) como "mero marco administrativo" para "dar apariencia de legalidad", con "adjudicaciones premeditadas" y "ofertas simuladas"; (d) Gómez habría registrado a su nombre la marca M4187195 (solicitada 10-oct-2022, concedida 19-abr-2023) y el dominio www.transformatsc.org (transferido a su nombre 14-jul-2023) de la plataforma Transforma TSC, pagando tasas (~206-246 €) desde una cuenta personal; (e) "actividad comercial" real con 6.687,85 € facturados vía Innovación Hexagonal, S.L. (marzo 2024). Se añadió el documento `theobjective-informe-uco-contratos-bg-2026-05-25` (3ª línea editorial) y se creó el Hecho `bg-uco-contratacion-software-2026-05-25` (tipo `investigado`).
  - **Decisión anti-doble-conteo (V-23):** el Hecho UCO **no** estructura `importe`. Las cifras Making Science 24.200 € + Deloitte 78.648,79 € son el **mismo gasto del software** ya estructurado en `bg-software-catedra-coste` (108.765,79 € en contratos administrativos) y solapado con el perjuicio de la UCM (`bg-ucm-perjudicada-cuantificacion-2026-01-27`, 113.509,32 €). Para no triplicar una cifra solapada, el detalle se cita en el enunciado en prosa y el dinero estructurado sigue viviendo solo en los dos hechos preexistentes.

- **Fiscalización de la Cámara de Cuentas de la Comunidad de Madrid (Hito nuevo + Organización nueva).** Hito `fiscalizacion-camara-cuentas-bg-2026-05-26` (tipo `informe_organismo_publico`). La Cámara de Cuentas de Madrid (órgano de control externo autonómico, presidido por Joaquín Leguina) comunicó al JI nº 41 el **26-may-2026** que fiscalizará al menos 6 contratos por **109.140 €** del software de la cátedra (Making Science 24.200; Deloitte 18.148 + 60.500; Myriam Maneyro 3.025; Low Post, S.L. 1.452; Flat 101, S.L. 1.815), dentro de un programa aprobado en feb-2025 por su Consejo a iniciativa de la Asamblea de Madrid (mayoría PP). Peinado dictó providencia el **28-may-2026** dando traslado a las partes y declarando que no rige el secreto de sumario. Creada la Organización `camara-de-cuentas-comunidad-de-madrid` (tipo `organismo_publico`, NO confundir con el Tribunal de Cuentas estatal ni con la AEAT). V-13 cubierto con OKDiario + Libertad Digital (líneas distintas; Estrella Digital y Vocento/Canarias7-TodoAlicante refuerzan).
  - **Doble-conteo:** el importe 109.140 € es una cuantificación **solapada** del mismo software por otro órgano (la UCM cifra 113.509,32; OKDiario menciona 11 pagos ~123.000 €). Por eso el hito **no** lleva importe estructurado: el dinero del software ya está modelado en los dos hechos preexistentes.

**Pendientes abiertos por este barrido (no modelados):**

- **Presunta prevaricación — V-13 INCOMPLETO + corrección de sujeto.** Libertad Digital (2026-05-26) titula que el informe UCO "destaparía un nuevo delito de prevaricación" atribuido a **Begoña Gómez** por participar en el amaño de las adjudicaciones a Deloitte (delito que, según fuentes jurídicas, **no** sería competencia del Tribunal del Jurado, a diferencia de los cuatro ya procesados). **Corrige** el apunte del barrido del 27-may, que situaba la presunta prevaricación en la magistrada Mª de la Paz Cantó: en esta cobertura el encuadre apunta a Gómez. No incorporado: sólo una línea editorial sólida (Libertad Digital; Pravda es mirror) y es calificación de la UCO/acusaciones, no del instructor. No se amplía `delitos_atribuidos_en_la_causa`. Reabrir cuando haya 2ª línea editorial nítida y, sobre todo, un auto que asuma la calificación.
- **Aplazamiento de la audiencia previa del 9-jun — pendiente de 2ª línea.** La defensa de Gómez pidió (29-may) aplazar su citación del 9-jun porque su abogado tiene otra vista ese día. Cobertura: Noticias de Gipuzkoa + El Correo Gallego, **ambos del grupo Prensa Ibérica = una sola línea editorial** → V-13 no cumplido para hito/párrafo propio. Vigilar la resolución del juez sobre el aplazamiento; si se confirma con 2ª línea, añadir un párrafo al hito `auto-audiencia-previa-bg-2026-05-26` (no crear hito nuevo).
- **Resolución de la AP Madrid sobre el jurado popular.** La Audiencia Provincial sigue sin resolver el recurso de fondo contra la decisión de Peinado de dirigir la causa al Tribunal del Jurado; la defensa pide paralizar la causa hasta esa resolución. Sin resolución que modelar todavía.
- **Auto de apertura de juicio oral.** No dictado a 30-may; se decidiría en/tras la audiencia previa del 9-jun. Cuando se dicte, transitar `fase_actual` a `juicio_oral` y crear hito tipo `apertura_juicio_oral`.

**Cascada aplicada a `caso.yaml`:** `ultima_revision_editorial` y `estado_ficha.fecha_actualizacion` → 2026-05-30; `sintesis_caso.estado_actual` reescrito para reflejar la espera de la audiencia previa del 9-jun (y el aplazamiento solicitado); `estado_ficha.notas` ampliado. **Se mantiene** `fase_actual: fase_intermedia` (no hay apertura de juicio oral) y `delitos_atribuidos_en_la_causa` sin cambios (la prevaricación no entra por V-13).

**Cruce con otros casos del inventario (paso 4):** sin nexo procesal nuevo → ninguna `RelacionEntreCasos` propuesta. Víctor de Aldama tiene rol procesal en `koldo`, no aquí (ya descartado). El resumen de COPE del 29-may que mezcla este caso con un "auto del juez Pedraz" pertenece al entorno `leire-diez`/"fontaneros": es confluencia mediática, no nexo procesal. Con `david-sanchez-badajoz`, `fiscal-general-del-estado`, `gonzalez-amador` y `leire-diez` no hay persona ni organización compartida con rol formal en ambas causas; "mismo entorno político" no es vínculo procesal.

**Nota de dato preexistente (fuera de scope, para revisión humana):** el documento `theobjective-audiencia-previa-bg-2026-05-26.yaml` tiene la `url_canonica` apuntando por error a una URL de elDiario.es (debería apuntar al artículo de The Objective del 26-may). No corregido en este barrido para no ampliar el diff; conviene arreglarlo en una pasada de mantenimiento de documentos.

---

## Barrido prelaunch 2026-05-27

Hallazgos del barrido de actualidad previo al lanzamiento público del dominio:

- **Hito incorporado:** `auto-audiencia-previa-bg-2026-05-26` — auto del JI nº 41 del 26-may-2026 convocando audiencia previa (art. 655 LECrim, Ley del Jurado) para el 9-jun-2026 a las 11:00h. El auto cita a Begoña Gómez, Cristina Álvarez y Barrabés; anuncia propósito de imponer medidas cautelares personales; advierte que la no comparecencia voluntaria conllevará conducción por la fuerza pública. Fuentes N4 cruzadas: The Objective + El Español + Moncloa.com (tres líneas editoriales distintas). Schema extendido: nuevo tipo `audiencia_previa` añadido al enum de Hito.
- **Hito incorporado:** `informe-uco-bg-2026-05-25` — la UCO entrega al JI nº 41 su informe pericial el 25-may-2026. Cobertura contradictoria según línea editorial: elDiario.es reporta que "no encontraría ingresos opacos"; El Español reporta que "detecta adjudicaciones premeditadas sin cumplir la normativa". Hito modelado con descripción que recoge ambas perspectivas. Hechos pendientes de modelar: requieren el informe UCO íntegro, no sólo cobertura N4.
- **Informe UCO prevaricación (magistrada Cantó) — V-13 INCOMPLETO:** el barrido localizó únicamente cobertura de Libertad Digital sobre el informe que valoraría si la magistrada María de la Paz Cantó habría prevaricado al archivar el caso. No se encontró segunda fuente de línea editorial distinta en tres queries de búsqueda. No incorporado al inventario. **Pendiente**: localizar segundo N4 (o documento oficial) para cumplir V-13 y poder modelar el hito `informe_organismo_publico` correspondiente.

---

## Vínculos institucionales — pasada 2026-05-25

Ejecutada con la skill `documentar-vinculos` v0 en sesión paralela `vinculos-bg` (worktree `.claude/worktrees/vinculos-bg`, rama `session/vinculos-bg`).

### Vínculos creados (16)

**Personas con rol procesal (10):**
- `begona-gomez-codirectora-catedra-ucm` — cargo_academico_publico (UCM desde 2020-11-01, vigente)
- `begona-gomez-directora-africa-center-ie` — cargo_directivo_organizacion_privada (IE Business School 2018-2022; AP Madrid excluyó estos hechos del objeto de instrucción en mayo 2025)
- `begona-gomez-esposa-pedro-sanchez` — vinculo_familiar_publico (desde 2006-05-05; Pedro Sánchez testificó 2024-07-22 art. 416 LECrim)
- `barrabes-codirector-catedra-ucm` — cargo_academico_publico (UCM desde 2020-11-01, vigente)
- `cristina-alvarez-asesora-presidencia-gobierno` — cargo_publico_designado (Presidencia desde 2018-07-16, vigente; fecha corregida por informe UCO vía Libertad Digital 2025-10-01)
- `goyache-rector-ucm` — cargo_academico_publico (UCM desde 2019-05-31, vigente; respaldo N4 cruzado Newtral+elDiario)
- `guemes-consejero-sanidad-cm` — cargo_publico_designado (CM 2007-2010; gobierno Aguirre II)
- `guemes-consejero-empleo-cm` — cargo_publico_designado (CM 2003-2007; gobierno Aguirre I)
- `guemes-partido-popular` — cargo_organico_partido (PP 2000-2010; respaldo N4 cruzado Newtral+ElIndependiente)
- `guemes-presidente-ie-center` — cargo_directivo_organizacion_privada (IE Business School, presidente del Centro Internacional de Gestión Emprendedora desde 2010, vigente)

**Organizaciones (6):**
- `manos-limpias-acusacion-bg` — acusacion_institucional_en_caso (desde 2024-04-08)
- `hazte-oir-acusacion-bg` — acusacion_institucional_en_caso (desde 2024-04-29)
- `vox-acusacion-bg` — acusacion_institucional_en_caso (desde 2024-04-29)
- `iustitia-europa-acusacion-bg` — acusacion_institucional_en_caso (desde 2024-04-29)
- `mrpe-acusacion-bg` — acusacion_institucional_en_caso (movimiento-regeneracion-politica; desde 2024-05-01)
- `ucm-perjudicada-bg` — perjudicado_institucional_en_caso (desde 2025-10-03; respaldo Confilegal+Moncloa.com)

### Pendiente estructural (1)

**`cristina-alvarez-nombramiento-gobierno-sanchez`** (`nombramiento_por_gobierno`): la skill distingue entre el cargo en sí y el acto de nombramiento por un gobierno concreto. Para Cristina Álvarez, el nombramiento como asesora del Gabinete bajo el Gobierno Sánchez I (julio 2018) es el vínculo político relevante, pero no se ha localizado BOE de nombramiento con URL canónica. Se buscó explícitamente en boe.es (2026-05-25) y se confirmó que los asesoramientos de personal eventual en el Gabinete de Presidencia no se publican nominalmente en BOE — solo los nombramientos de rango Secretario de Estado hacia arriba tienen BOE propio.

**Recomendación editorial (2026-05-25):** este vínculo probablemente no sea necesario. El vínculo `cristina-alvarez-asesora-presidencia-gobierno` (`cargo_publico_designado`) ya lleva `gobierno_o_legislatura: "Gobierno Sánchez I / Sánchez II / Sánchez III"`, lo que captura exactamente la misma información. La naturaleza `nombramiento_por_gobierno` tiene más sentido cuando el acto de nombramiento es en sí mismo un hecho editorialmente relevante (p. ej. el gobierno designa a alguien en el TC). Para Cristina Álvarez el hecho relevante es el cargo, no el acto de nombramiento. Valorar si cerrar este pendiente y dar por completo el bloque de vínculos.

### Nota de merge para el maintainer

El `estado_ficha.vinculos_institucionales` en `caso.yaml` ha sido añadido en este worktree con valor `parcial`. El campo también ha sido añadido por la sesión paralela `bloque-d-base` en el working tree principal (con valor `pendiente`). Al hacer merge, conservar el bloque `estado_ficha` de `bloque-d-base` y cambiar sólo `vinculos_institucionales: pendiente` → `vinculos_institucionales: parcial`.

---

## Por qué este caso entra el segundo

Decidido en el cierre de la sesión 2026-05-22 (ver `ROADMAP.md`): el caso testea trayectoria con **desimputaciones y sobreseimientos parciales**, que Plus Ultra (el caso 0) no tiene. En concreto, este PR1 ya contiene dos cierres de trayectoria que validan el modelo:

1. La Audiencia Provincial de Madrid **desimputa al rector de la UCM Joaquín Goyache** el 16 de mayo de 2025. Se modela como `Hito(tipo=desimputacion)` + `RolEnCaso(rol=investigado, fecha_fin=2025-05-16, hito_fin_id=...)` + `RolEnCaso(rol=desimputado, fecha_inicio=2025-05-16, hito_origen_id=...)` + `Hecho(tipo=exculpatorio)`.
2. El propio auto de cierre de instrucción del 13 de abril de 2026 **archiva el delito de intrusismo profesional** contra Begoña Gómez por falta de indicios sólidos, manteniendo los otros cuatro delitos. Se modela como `Hecho(tipo=exculpatorio)` (no se crea un `Hito(tipo=sobreseimiento_libre)` separado porque el archivo del delito es accesorio al hito principal del auto, y el procedimiento no se archiva: continúa por los otros cuatro delitos).

Ambos cierres dejan en pie la presunción de inocencia y las trayectorias procesales se exhiben con los slots existentes del modelo.

## Estado editorial — PR1 + PR2 + PR3 acumulado

- **caso.yaml** raíz creado en PR1.
- **6 personas** con rol procesal formal: 5 de PR1/PR2 (Begoña Gómez, Juan Carlos Peinado, Cristina Álvarez, Juan Carlos Barrabés, Joaquín Goyache) + 1 nueva PR3: **Juan José Güemes Barrios** (presidente del Centro Internacional de Gestión Emprendedora de IE Business School, ex consejero Comunidad de Madrid bajo Esperanza Aguirre).
- **15 organizaciones**: 14 de PR1/PR2 + 1 nueva PR3 (**El Independiente**, diario digital). Manos Limpias reutilizada del caso Plus Ultra.
- **2 delitos nuevos del catálogo** (PR1): corrupción en los negocios, apropiación indebida. Reutilizados: tráfico de influencias y malversación de caudales públicos.
- **21 documentos**: 16 de PR1/PR2 + 5 nuevos PR3 (Newtral imputación Güemes 18-nov-2024; TheObjective recurso Fiscalía contra imputación Güemes 03-dic-2024; El Independiente desimputación Güemes+Goyache 16-may-2025; Infobae escrito conclusiones defensa 18-may-2026; El Español lista 30+ testigos 18-may-2026; Libertad Digital desestimación recurso defensa 22-may-2026). Total real: **22 documentos** contando la actualización del auto AP Madrid desimputación (fecha de documento corregida a 2025-05-13 y referencia a Güemes añadida).
- **13 hitos**: 8 de PR1/PR2 + 5 nuevos PR3 (imputación Güemes 18-nov-2024; recurso Fiscalía contra imputación Güemes 03-dic-2024; ofrecimiento de personación a la UCM por el JI 41 el 03-oct-2025; escrito de conclusiones provisionales de la defensa 18-may-2026; desestimación del recurso de reforma de la defensa por el JI 41 el 22-may-2026). El hito de desimputación de Goyache se amplía a Güemes (mismo auto AP Madrid 13-may-2025).
- **8 hechos**: sin cambios numéricos respecto a PR2; el hecho `bg-desimputacion-goyache-2025-05-16` se actualiza para mencionar a Güemes y reflejar la exclusión del procedimiento de la contratación de Begoña Gómez por el IE en 2018.
- **17 roles**: 15 de PR1/PR2 + 2 nuevos PR3 (Güemes investigado 18-nov-2024 → 16-may-2025; Güemes desimputado 16-may-2025 → vigente). El rol UCM-perjudicada se actualiza para apuntar a su hito propio (ofrecimiento de personación) en vez del hito de origen del procedimiento.

## Correcciones aplicadas en PR3

- **`auto-audiencia-desimputa-goyache-2025-05-16.yaml`**: el documento del auto de la AP Madrid se corrige editorialmente. Título y `fecha_documento` actualizados a **13 de mayo de 2025** (fecha real del auto, según cita literal de El Independiente del 16-may-2025: "una resolución de 24 páginas, fechada el 13 de mayo de 2025"). `fecha_publicacion` se mantiene en `2025-05-16` (fecha en que la cobertura mediática hace público el contenido del auto). El `id` del documento se conserva (`...-2025-05-16`) por estabilidad — convención: el slug es identificador interno, el contenido es lo que se corrige. Justificación N4 reescrita para reflejar la cobertura cruzada que ahora respalda el documento (Moncloa.com, El Independiente, El Español).
- **`desimputacion-goyache-2025-05-16.yaml` (hito)**: título reescrito a "La Audiencia Provincial de Madrid revoca la condición de investigado del rector de la UCM Joaquín Goyache **y del directivo del IE Juan José Güemes**". `personas_afectadas` extendido para incluir a `juan-jose-guemes`. Descripción reescrita incluyendo el motivo específico de la desimputación de Güemes (cita literal: "sin que existan indicios de que su contratación estuviera relacionada con su condición de esposa del presidente") y la exclusión de los hechos relativos a la contratación de Gómez por el IE en 2018 ("esta diligencia resulta innecesaria porque excede de lo que es objeto de esta investigación"). `documentos_relacionados` añade el nuevo documento de El Independiente.
- **`bg-desimputacion-goyache-2025-05-16.yaml` (hecho)**: `personas_implicadas` extendido a `juan-jose-guemes`. Enunciado reescrito para reflejar el contenido pleno del auto (desimputación de ambos + exclusión de la contratación 2018). `fecha_o_periodo.desde` ajustada a `2025-05-13` (fecha del auto). `documentos_respaldo` añade el nuevo documento de El Independiente como respaldo directo.
- **`ucm-perjudicada.yaml` (rol)**: `hito_origen_id` actualizado de `denuncia-manos-limpias-bg-2024-04-08` (provisional) a su hito propio `ofrecimiento-personacion-ucm-bg-2025-10-03`. Notas reescritas: ya no menciona el TODO de "pendiente de localizar con URL canónica para PR3" — ese pendiente queda resuelto al crear el hito específico aunque la URL canónica del auto del 3-oct-2025 sigue sin localizarse.

## Schema extendido en PR3

- **`schemas/hito.schema.json`**: añadido un nuevo valor al enum de `tipo`: `escrito_conclusiones_provisionales`. Justificación editorial: en procedimiento abreviado, el escrito de conclusiones provisionales de defensa es un evento procesal puntual y reconocible (parte que cierra fase de instrucción y abre fase intermedia previa al juicio). El enum ya admite otros eventos de parte (`comparecencia_congreso`, `publicacion_investigacion_periodistica`), así que la adición es consistente con el patrón existente. V-14 (hitos jurisdiccionales requieren `documento_principal_id`) NO se aplica al nuevo tipo por defecto, pero al modelarlo siempre con `documento_principal_id` por convención no hay diferencia práctica. `src/lib/labels.ts` extendido con el label `Escrito de conclusiones provisionales` para el nuevo tipo. Pendiente menor: documentar el nuevo tipo en [doc 01 — "Hito"](../../../docs/diseno/01-modelo-de-datos.md#25-hito) cuando se haga un repaso editorial del doc.

## Correcciones aplicadas en PR2

- **`goyache-investigado.yaml`**: delitos corregidos de `[malversacion-caudales-publicos]` a `[trafico-de-influencias, corrupcion-en-los-negocios]`. La malversación se introdujo en la causa en agosto de 2025 (imputación específica de Cristina Álvarez), pero Goyache fue citado en julio de 2024 antes de esa ampliación. `fecha_inicio` se ajusta a `2024-07-22` (la fecha del auto que documentan elDiario.es y Newtral.es el 22-jul-2024) y `hito_origen_id` ya apunta al hito específico `imputacion-goyache-bg-2024-07-22`.
- **`hazte-oir-acusacion-popular.yaml`**: `fecha_inicio` corregida de `2024-04-24` (mejor aproximación inicial) a `2024-04-29` (cruzada con la fecha confirmada de Vox; las personaciones de Hazte Oír, Vox e Iustitia Europa son coetáneas según la cobertura).

## Barrido primarios descargados — 2026-05-23

**Contexto.** El 2026-05-22, tras el PR2 del Fiscal General del Estado, se incorporó al proyecto la convención "Documentos primarios descargados a `/public/documentos/<caso>/`" ([AGENTS.md → "Documentos primarios descargados"](AGENTS.md#documentos-primarios-descargados-a-publicdocumentos) + `.agents/skills/investigar-caso/SKILL.md` sección 3.bis). El ROADMAP sección "Trabajo paralelizable a otro agente" pide aplicar la convención retrospectivamente a los casos ya fichados antes de la norma. Este barrido cubre exclusivamente el caso `begona-gomez`.

**Universo.** 24 documentos catalogados en `content/documentos/*.yaml` con `caso_principal_id: begona-gomez`:

- 3 autos jurisdiccionales (`auto_judicial`): `auto-procesamiento-bg-2026-04-13`, `auto-audiencia-desimputa-goyache-2025-05-16`, `auto-ap-madrid-anula-jurado-2026-02-23` — todos con `nivel_fuente: 4` y `estado_acceso: acceso_restringido_pero_citable` (no localizables públicamente).
- 1 escrito de la Fiscalía (`escrito_fiscalia`): `escrito-fiscalia-recurso-ap-bg-2026-04-21` — `nivel_fuente: 2`, `estado_acceso: acceso_restringido_pero_citable`.
- 20 artículos de prensa (`articulo_prensa`): todos `nivel_fuente: 4`; mirror archive.org vía `scripts/archivar-n4.mjs` (`pnpm archive:catchup`). A 2026-05-26: 19/20 con `url_archivo`; pendiente `libertaddigital-uco-cristina-alvarez-bg-2025-10-01` (catchup). Cobertura mediática general en `content/cobertura-mediatica/begona-gomez.yaml` (29 noticias): `url_archivo` pendiente de catchup.
- 0 documentos del BOE (no hay nombramiento/cese de juez/fiscal específicos del caso) ni nota institucional con URL canónica en `poderjudicial.es` ni Acuerdo del CGPJ publicado relacionado con el caso.

**Resultado del barrido.** Cero descargas aplicadas. Razón: a 2026-05-23 no se ha localizado en fuente oficial (BOE / CENDOJ / poderjudicial.es / fiscal.es) ninguno de los documentos candidatos a descarga primaria. Verificado vía WebSearch contra los buscadores institucionales y contra los acuerdos publicados del CGPJ; el barrido reproduce la misma conclusión de PR3 del 22-may, ampliada a las cuatro fuentes oficiales.

**Candidatos prioritarios revisados uno a uno** (todos quedan `pendiente_primario`):

1. **Auto del JI nº 41 del 13-abr-2026 — procesamiento.** Documento `auto-procesamiento-bg-2026-04-13.yaml`. NO publicado en CENDOJ (los Juzgados ordinarios no suben autos de instrucción). NO localizada nota institucional del CGPJ en `poderjudicial.es` al 23-may-2026. URL candidata: ninguna oficial; un mirror periodístico íntegro publicaría las 80+ páginas pero no se ha encontrado uno fiable. Estado: pendiente_primario.
2. **Auto de la AP Madrid del 13-may-2025 — desimputación Goyache + Güemes.** Documento `auto-audiencia-desimputa-goyache-2025-05-16.yaml`. NO publicado en CENDOJ; las secciones de la AP no publican sistemáticamente sus autos. NO localizada nota institucional. El Independiente cita literalmente fragmentos del auto pero no aporta el PDF íntegro; existe un mirror en `wuolah.com` (plataforma de apuntes universitarios) que **no es fuente fiable ni está en lista blanca**, por lo que NO se descarga (la trazabilidad por `hash_sha256` exige procedencia verificable; descargar de Wuolah contradice el principio editorial). Estado: pendiente_primario.
3. **Auto de la AP Madrid del 23-feb-2026 — anulación jurado popular.** Documento `auto-ap-madrid-anula-jurado-2026-02-23.yaml`. Mismo escenario que el anterior: cobertura cruzada con citas pero sin PDF íntegro publicado en fuente fiable. Estado: pendiente_primario.
4. **Escrito de la Fiscalía del 21-abr-2026 — recurso de apelación.** Documento `escrito-fiscalia-recurso-ap-bg-2026-04-21.yaml`. NO publicado en `fiscal.es` (cuya práctica habitual es publicar memorias anuales y disposiciones generales, no escritos procesales concretos). Estado: pendiente_primario.
5. **Escrito de conclusiones provisionales de la defensa del 18-may-2026.** Restringido a las partes por art. 234 LOPJ / 301 LECrim; no se publica en fuente oficial. Estado: no aplica para descarga primaria (es escrito de parte privado).
6. **Autos de la AP Madrid (Sección 3ª/23ª) sobre el jurado popular.** Mismo escenario que (3). Estado: pendiente_primario, cubierto por (3).
7. **Auto del JI nº 41 del 18-ago-2025 — imputación de Cristina Álvarez como investigada por malversación.** Hito `imputacion-cristina-alvarez-bg-2025-08-18`. NO publicado en CENDOJ ni en `poderjudicial.es` con URL canónica. Cobertura cruzada en al menos cuatro medios (Newtral, elDiario, Libertad Digital, Infobae) con citas literales del auto pero sin PDF íntegro publicado. El hito apuntaba erróneamente al auto de procesamiento del 13-abr-2026 (8 meses posterior); reasignado el 2026-05-27 a `libertaddigital-uco-cristina-alvarez-bg-2025-10-01` como cobertura más próxima del cargo público de la investigada, con el auto de procesamiento conservado en `documentos_relacionados`. Estado: pendiente_primario.

   **Verificación CENDOJ 2026-05-27 (noche, 3)**: el maintainer aportó el curl del endpoint AJAX `https://www.poderjudicial.es/search/search.action`; el agente lo probó con cobertura completa de AP Madrid penal 2025-2026 incluyendo dos autos ya conocidos del caso BG (anulación jurado popular del 23-feb-2026 y desimputación Goyache del 13-may-2025): **0 hits** en CENDOJ con búsqueda por nombre o por términos específicos. Confirma que CENDOJ no publica autos de procedimientos en instrucción, ni siquiera los de la AP, mientras el caso esté vivo. Lección incorporada al catálogo de patrones por dominio oficial de la skill `investigar-caso` § 3.ter; el auto de Álvarez del 18-ago-2025 sólo aparecerá en CENDOJ cuando el procedimiento llegue al TS o gane firmeza definitiva.

**Convención disparada al ver candidatos en mirrors no oficiales (Wuolah, scribd, etc.).** No descargar. La trazabilidad editorial del proyecto requiere proveniencia oficial o, en su defecto, segundo mirror cruzado de calidad periodística verificable (medios con redacción identificada). Plataformas como Wuolah no auditan la fidelidad del PDF subido por el usuario. Al ser PDF "anónimo en su origen", el `hash_sha256` no acredita fidelidad al original. Política operativa: si en el futuro aparece el auto íntegro publicado por un medio con redacción identificable (Infobae documentos, eldiario.es PDF embebido, etc.), entonces sí se descarga, se cruza con segundo mirror si existe, y se documenta el origen en `nivel_fuente_justificacion`.

**Cuándo revisar de nuevo.** Trimestralmente, o cuando un hito procesal posterior dispare la publicación oficial de los autos íntegros (firmeza de la sentencia, llegada a TS por casación, indultos publicados en BOE, etc.). Mientras tanto, el modelo del caso ya cumple V-13 mediante cobertura cruzada N4 multimedio para cada hito.

**No se hace ninguna mutación de YAML en este barrido.** No se añaden `ruta_local`, no se calcula `hash_sha256`, no se reescribe `nivel_fuente_justificacion`. Sólo se actualiza esta NOTES.md.

---

## Pendiente para PR4 y siguientes

- **Archive.org / archive.ph mirrors** para los documentos N4 (ahora 19 tras PR3: 6 de PR1 + 7 de PR2 + 6 de PR3; el escrito de la Fiscalía es N2 y no requiere mirror obligatorio aunque conviene). WebFetch no puede llamar a archive.org desde el entorno del agente; el maintainer debe lanzar el archivado y completar `url_archivo`. Mirror obligatorio para fuentes N4 según doc 01, "Enums catalogados".
- **Localización de fuentes oficiales** (sustituir N4 por N1 cuando aparezcan). PR3 ha confirmado, vía WebSearch + WebFetch, que ninguno de los siguientes está disponible aún con URL canónica oficial en `poderjudicial.es` ni en CENDOJ — reconfirmado el 2026-05-23 durante el barrido de primarios descargados:
  - Nota CGPJ del auto del JI nº 41 de Madrid del 13 de abril de 2026 (auto de procesamiento).
  - Nota institucional del auto de la Audiencia Provincial de Madrid del 23 de febrero de 2026 (anulación jurado popular).
  - Auto del JI nº 41 que cita a Joaquín Goyache como investigado (22-jul-2024).
  - Auto del JI nº 41 que cita a Juan José Güemes como investigado (18-nov-2024).
  - Auto de la AP Madrid de 13 de mayo de 2025 (desimputación Goyache + Güemes).
  - Auto del JI nº 41 del 03-oct-2025 (ofrecimiento de personación a la UCM).
  - Auto del JI nº 41 del 05-may-2026 (providencia abriendo plazo de conclusiones provisionales) y el del 22-may-2026 (desestimación recurso defensa).
  - Texto íntegro de los autos en CENDOJ cuando se publiquen.
  - Escrito de la Fiscalía del 21 de abril de 2026 en `fiscal.es` (el doc actual está marcado nivel 2 con texto sin URL canónica).
- **Texto íntegro de la denuncia de Manos Limpias** (08-abr-2024). Si aparece publicada en un medio identificable, podría subirse el `nivel_fuente` a 3 (filtrado_verificado).
- **Auto de incoación del 16-abr-2024** del JI nº 41 de Madrid.
- **Hito del 05-may-2026** del JI nº 41: desestimación de recursos de reforma anteriores + providencia abriendo plazo de conclusiones. Modelado parcialmente en la descripción del hito de 22-may, pero podría merecer hito propio en PR4 si entra cobertura más detallada.
- **Hito del 17-may-2026 del JI nº 41 elevando el valor del software a más de medio millón de euros**. Implica cambio en la cuantía indiciaria de malversación. Pendiente de modelar en PR4 con cobertura cruzada (Libertad Digital es la fuente disponible; necesita al menos otra línea editorial para V-13).
- **Auto de la AP Madrid resolviendo el recurso de la Fiscalía del 21-abr-2026** (cuando se dicte).
- **Resolución del recurso de reforma del 22-may-2026 si la defensa lo eleva a apelación ante la AP Madrid** (siguiente paso procesal natural).
- **Número exacto del procedimiento ("DP 1146/2024" según una fuente)**: requiere segunda fuente cruzada o auto/nota oficial.
- **Apertura del juicio oral** cuando se dicte el auto correspondiente.

## Decisiones editoriales NO modeladas explícitamente en PR3

- **Pedro Sánchez como testigo propuesto**: la cobertura de El Español del 18-may-2026 confirma que la defensa NO incluye al presidente del Gobierno en su lista de 30+ testigos. Se mantiene la decisión de PR1 de no crear ficha de Persona para Pedro Sánchez en este caso (su rol procesal como testigo es accesorio y declinó declarar en julio de 2024).
- **Sonsoles Blanca Gil de Antuñano** (responsable de RR.HH. del IE que aporta el testimonio que motiva la imputación de Güemes): NO modelada como Persona en PR3. Su rol procesal es de testigo y el modelo (igual que con Pedro Sánchez, los vicerrectores UCM, etc.) sólo crea fichas de Persona para quienes tienen rol procesal distinto del de testigo. Mencionada en la descripción del hito de imputación de Güemes como contexto.
- **Antonio Camacho** (ex ministro de Interior del segundo gobierno Zapatero, abogado de la defensa de Begoña Gómez): NO modelado como Persona en PR3. Su rol es de defensa (parte funcional del aparato procesal), no de investigado/procesado. Convención del modelo: las defensas se mencionan en descripciones, no se modelan como Persona individual.
- **Testigos propuestos por la defensa** (Escassi, Rosauro Varo, directivos de Reale/La Caixa/Indra/Telefónica): mencionados en la descripción del hito del escrito de conclusiones del 18-may-2026 pero NO modelados como Persona — son testigos propuestos, no investigados.

## Discrepancia de fecha de apertura

Wikipedia indica como fecha de inicio **24-abr-2024** (presumiblemente la fecha pública del conocimiento del auto). Infobae y Maldita.es coinciden en **16-abr-2024** como fecha del auto de incoación de diligencias previas, tras denuncia presentada el **08-abr-2024**. Se adopta:

- `Caso.fecha_apertura = 2024-04-16` (incoación formal del procedimiento por el juez).
- `Hito(denuncia_presentada) = 2024-04-08` (presentación de la denuncia por Manos Limpias).

## Cambio del schema en PR2

Durante el PR2 fue necesario añadir el valor `perjudicado` al enum de roles válidos para organizaciones en `schemas/rol-en-caso.schema.json` (regla V-11). La versión previa del schema admitía sólo `acusacion_popular / acusacion_particular / querellante / denunciante` para `sujeto_tipo=organizacion`, lo que dejaba fuera el caso real de la UCM personada como perjudicada — una persona jurídica que ejerce la acción civil derivada del delito en proceso penal español. El cambio es mínimo (un valor adicional en el enum interno del bloque if/then de V-11) y defendible: el "perjudicado" es legítimamente un rol de parte en el procedimiento penal español. Documentado en el propio schema y en `ROADMAP.md` como aprendizaje de modelado.

## Personas con rol procesal NO modeladas en PR1 ni PR2

Decisiones editoriales aplicadas:

- **Pedro Sánchez** (presidente del Gobierno): compareció como testigo el 22-jul-2024 acogiéndose a su derecho a no declarar. Aunque el rol "testigo" existe en el modelo, no se le crea ficha en PR1 — su rol procesal es accesorio al caso (testigo) y editorialmente entra en la categoría de "familiar de implicada con rol no imputador". Se menciona como contexto en la biografía corta de Begoña Gómez y en la descripción del caso (relación de la investigada como esposa del Presidente del Gobierno). Si futuras resoluciones le atribuyen otro rol procesal, se revisa.
- **Vicerrectores y exvicerrectores de la UCM** que han declarado como testigos (Juan Carlos Doadrio y otros): no se les crea ficha hasta que un auto les atribuya rol distinto de testigo.
- **Víctor de Aldama** (mencionado en la denuncia inicial por su presencia en reuniones de Globalia): no es investigado en este procedimiento; su rol procesal pertenece a otra causa (caso Koldo). Fuera del inventario aquí.

## Verbos de [doc 04 — "Presunción de inocencia: reglas de redacción"](docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción) aplicados

- "Consta en el auto…", "el instructor considera indiciariamente que…", "se atribuye…", "según la Fiscalía…", "la Audiencia Provincial considera que no concurren indicios racionales de criminalidad…".
- Final explícito de presunción de inocencia en cada rol activo de imputación/procesamiento ("rige el principio de presunción de inocencia mientras no recaiga resolución firme en contrario").

## Fuentes consultadas para PR1

Multi-línea editorial (≥ 2 líneas editoriales por hito). Verificación cruzada.

- Maldita.es — explicación de la denuncia de Manos Limpias.
- Infobae — apertura de diligencias (24-abr-2024) y procesamiento (13-abr-2026).
- El Español — procesamiento (13-abr-2026), testigos del juicio.
- Libertad Digital — procesamiento (13-abr-2026), prueba software UCM.
- TheObjective — recurso de la Fiscalía pidiendo archivo (22-abr-2026).
- Moncloa.com — UCM de imputados a perjudicados (13-oct-2025).
- Newtral.es — perfil de Goyache.
- Noticias de Navarra — coste software UCM (23-ene-2026).
- Wikipedia (es) — Caso Begoña Gómez y Juan Carlos Peinado (sólo para verificar fechas y biografías; nunca como soporte único de hecho).

URLs específicas en cada `Documento` que las cita, conforme al modelo.

## Avisos para el LLM en futuras incorporaciones

- **Nunca redactar a Begoña Gómez como culpable.** Verbos prohibidos de [doc 04 — "Presunción de inocencia: reglas de redacción"](docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción). Hasta sentencia firme, sólo "se investiga", "se atribuye", "consta en el auto de Peinado que…", "el instructor considera indiciariamente que…".
- **El procedimiento NO está archivado.** El archivo del 13-abr-2026 sólo afecta al delito de intrusismo profesional. Por los otros cuatro delitos sigue adelante hacia Tribunal del Jurado.
- **Pedro Sánchez NO es investigado** ni procesado en esta causa. Mencionarlo sólo como contexto (esposo de la investigada / presidente del Gobierno).
- **Joaquín Goyache es DESIMPUTADO.** Su rol vigente es `desimputado` desde el 16-may-2025 por resolución de la Audiencia Provincial de Madrid. Cualquier redacción posterior debe respetarlo expresamente.
- **Tratamiento sin cuota política.** El caso afecta a una familia cercana al gobierno actual. La P-10 de [doc 02 — "Reglas anti-desinformación en presentación"](docs/diseno/02-ficha-de-caso.md#4-reglas-anti-desinformación-en-presentación) obliga a aplicar exactamente la misma estructura, badges y tono que a cualquier otro caso del inventario.
- **Familiares no implicados** (en particular cualquier referencia a otros miembros de la familia Sánchez-Gómez): fuera del inventario salvo que un auto les atribuya rol procesal formal. [Doc 04 — "Ética"](docs/diseno/04-riesgos-legales-y-eticos.md#11-ética).
