# NOTES — Caso González Amador

Anotaciones internas. **No se publica.** Vive en el repo para humanos y agentes LLM que iteren sobre este caso. Convención en [AGENTS.md → "NOTES.md por caso"](AGENTS.md#notesmd-por-caso).

Última actualización: 2026-05-23 (PR4 — primarios descargados: PDF + XML de los dos BOE N1 ya catalogados, con `ruta_local` + `hash_sha256` cumplimentados).

---

## Por qué este caso entra el tercero

Decidido el 2026-05-22 por el maintainer: el caso González Amador entra antes que Koldo porque (a) ya tiene auto de procesamiento ratificado por la AP Madrid y apertura de juicio oral, lo que da una columna vertebral cronológica clara para la ficha, (b) balancea editorialmente el inventario tras Begoña Gómez (caso vivo del entorno PSOE), aplicando exactamente la misma estructura, tono y badges a un caso del entorno PP, conforme a la P-10 de tratamiento sin cuota política, y (c) Koldo se reserva para más tarde porque está conectado a Begoña Gómez por la mención periférica de Víctor de Aldama (NOTES de Begoña Gómez, sección "Personas con rol procesal NO modeladas en PR1 ni PR2") y conviene cerrar Begoña antes.

## Decisiones editoriales aplicadas en PR1

### Cinco investigados procesados, no seis

El procedimiento tuvo en algún momento seis investigados. El 14 de abril de 2025 la magistrada Inmaculada Iglesias citó como investigado al asesor fiscal **Javier Luis Gómez Fidalgo** (fiscalista leonés). El 29 de mayo de 2025, en el mismo auto por el que se cerró la instrucción contra los cinco principales, la jueza acordó el sobreseimiento provisional de la causa respecto a Gómez Fidalgo por considerar insuficientes los indicios de su participación. Se modela como `RolEnCaso(rol=investigado)` con `fecha_fin` + `hito_fin_id` + `RolEnCaso(rol=desimputado)` consecutivo, igual que el patrón Goyache del caso Begoña Gómez (NOTES, sección "Decisiones editoriales aplicadas").

### Maxwell Cremona S.L. modelada como procesada en PR3 tras ampliación de V-11

La sociedad Maxwell Cremona Ingeniería y Procesos S.L., de la que González Amador es administrador único, figura en las actuaciones como persona jurídica procesada al amparo de la Ley Orgánica 5/2010 de responsabilidad penal de personas jurídicas. **En PR1 no se modeló con rol procesal** porque el schema `rol-en-caso` no admitía `procesado` para `sujeto_tipo=organizacion` (V-11). **En PR3 el maintainer aprobó la ampliación de V-11** (paralela a la del `perjudicado` aplicada en Begoña Gómez PR2): la regla ahora admite organizaciones también en los roles imputadores (`investigado`, `procesado`, `acusado`, `condenado_no_firme`, `condenado_firme`, `absuelto`, `desimputado`), manteniendo excluidos los roles del aparato judicial y de testigo (que sólo aplican a personas físicas). Tras la ampliación se crea `RolEnCaso(maxwell-cremona, procesado)` con los mismos delitos atribuidos que González Amador. Patrón reusable: cuando aparezca otra persona jurídica investigada (esperable en Koldo, FGE…), modelarla directamente con su rol.

### Isabel Díaz Ayuso NO se modela como Persona en PR1

Misma lógica que Pedro Sánchez en el caso Begoña Gómez. Ayuso no tiene rol procesal formal en este procedimiento: aparece mencionada como pareja del investigado y residente en el ático compartido. Se incorporará al inventario únicamente si un auto futuro le atribuye un rol formal.

### Carlos Neira (abogado del investigado) tampoco entra como Persona

Carlos Neira, abogado de González Amador, tiene rol procesal formal de `abogado_defensa`, pero su nombre es indisociable del **caso del Fiscal General del Estado** (sentencia del Tribunal Supremo por revelación de secretos del email del 2 de febrero de 2024). Decisión editorial: no se ficha como Persona en PR1 del caso González Amador. Cuando se arranque el caso del Fiscal General como caso autónomo del inventario, se creará la `Persona(carlos-neira)` con el rol `abogado_defensa` en ambos casos. El `RelacionEntreCasos` se modelará entonces.

### Cuantía 350.951 €, no 350.961 €

Hay discrepancia entre fuentes sobre la cuantía exacta del fraude:
- 350.951 € — El Plural, Infobae (07-nov-2025), El Español (en algunas ocasiones).
- 350.961 € — Iustel, otras fuentes derivadas.

Se adopta **350.951 €** por aparecer con mayor consistencia en cobertura coetánea al auto del 29-may-2025 y al auto de la AP Madrid del 7-nov-2025. Se anota como pendiente de confirmar con el auto íntegro cuando esté disponible en CENDOJ.

## Discrepancia de nombres entre fuentes (resuelta)

Dos fuentes daban nombres distintos para uno de los hermanos Carrillo Saborido:
- "José Antonio Carrillo Saborido" — primera mención en Confilegal y derivadas.
- "José Miguel Carrillo Saborido" — El Español (29-may-2025) en cobertura del auto, El Plural (24-ene-2026) en reportaje sobre las dos ramas (sevillana y mexicana).

Se adopta **José Miguel Carrillo Saborido** por aparecer en la cobertura del propio auto y por confirmación de El Plural en reportaje específico. Pendiente de cierre cuando aparezca el auto íntegro en CENDOJ o en una nota oficial del CGPJ.

## Cambios y correcciones aplicados en PR3

### Cambio editorial-arquitectónico (schema)

- **V-11 ampliada para admitir organizaciones en roles imputadores**, conforme a la LO 5/2010 de responsabilidad penal de personas jurídicas. La descripción de la regla se reescribe en el propio schema con remisión histórica al caso Maxwell Cremona como motivador. Repetimos exactamente el patrón empleado en Begoña Gómez PR2 para el `perjudicado`.

### Correcciones a PR1/PR2 con fuentes N1 del BOE

- **Inmaculada Iglesias**: nombre completo corregido a "María Inmaculada Iglesias Sánchez" (antes "Inmaculada Iglesias", apellido erróneo "Carrasco" que figuraba en `nombres_alternativos` retirado). Fecha de jubilación corregida a 10-ago-2025 (antes 18-ago-2025) conforme al Acuerdo CGPJ del 13-may-2025 publicado en BOE-A-2025-16497.
- **Antonio Viejo**: nombre completo corregido a "Antonio Viejo Llorente". Cargo histórico añadido como magistrado del orden penal de la Audiencia Provincial de Madrid hasta su destino al JI 19. Fecha de incorporación al JI 19 ajustada al Real Decreto 838/2025, de 22 de septiembre (BOE-A-2025-19789).
- **Hito `cambio_juez`**: documento principal sustituido por el RD del BOE (N1, sustituye a Confilegal N4 que pasa a doc relacionado). Fecha precisada a 22-sept-2025. ID renombrado de `cambio-juez-iglesias-viejo-ga-2025-10` a `cambio-juez-iglesias-viejo-ga-2025-09-22` con actualización de `hito_origen_id`/`hito_fin_id` en los dos roles afectados.
- **Hito `detencion-herrera-lobato-quiron-2026-01-20`**: precisado que la pieza separada se sustancia en el JI 19 Madrid, no en la AN. La AN solo emite la orden de detención y toma declaración inicial; la sustanciación continúa en el JI 19. Confirmado por la cobertura de Público.es del 10-may-2026 ("la jueza instructora Iglesias encargó la intervención de la UCO") y por Infobae del 27-jun-2025.
- **Hecho `rama-quiron-investigada`** y **documento `infobae-prorroga-pieza-quiron`**: corregido el órgano competente (JI 19 Madrid en lugar de AN Sección 2ª).

### Nuevos elementos PR3

- **2 documentos N1** del BOE: nombramiento de Viejo (RD 838/2025) y jubilación de Iglesias (Acuerdo CGPJ 13-may-2025).
- **2 documentos N4** sobre el encargo del informe UCO (Infobae 27-jun-2025 + Público 10-may-2026 que confirma el retraso casi un año después).
- **1 organización nueva**: Público.es (medio).
- **1 delito nuevo del catálogo**: administracion-desleal (art. 252 CP), invocado en la pieza separada por presunta corrupción en negocios y administración desleal.
- **1 hito nuevo**: encargo a la UCO (tipo `informe_organismo_publico`, 27-jun-2025).
- **2 hechos nuevos**: comisión encubierta de 500.000 € vinculada a la presidencia de Quirón Prevención (investigado); informe UCO pendiente (atribuido).
- **1 rol nuevo**: Maxwell Cremona como persona jurídica procesada al amparo de la LO 5/2010.
- **Caso actualizado**: ampliados los delitos atribuidos en la causa con corrupción en los negocios y administración desleal (de la pieza separada).

## Cambios aplicados en PR4 (primarios descargados retrospectivamente)

Aplicación de la convención editorial "Documentos primarios descargados a `/public/documentos/`" (AGENTS.md, incorporada el 2026-05-22 tras el PR2 del caso FGE) al inventario ya existente del caso. Decidida por el maintainer en el ROADMAP, sección "Próximo paso comprometido" (2026-05-22).

### Documentos N1 descargados al árbol del proyecto

- **`boe-rd838-nombramiento-viejo-ga-2025-09-22`** — RD 838/2025, de 22 de septiembre (`BOE-A-2025-19789`), publicado en BOE núm. 240 de 6 de octubre de 2025. Descargados desde `boe.es` el PDF oficial (10 páginas, 243.380 bytes, sha256 `08d6f012…f6102`) y el XML estructurado (sha256 `bc9d5af6…16f0`). Metadatos PDF confirman autoría institucional CGPJ y productor `eBOE` con Antenna House. Corregida la `fecha_publicacion` del YAML: el RD se firma el 2025-09-22 (fecha del documento) pero se publica en el BOE el 2025-10-06; antes estaba erróneamente fijada en 2025-09-22.
- **`boe-jubilacion-iglesias-ga-2025-05-13`** — Acuerdo de 13 de mayo de 2025 de la Comisión Permanente del CGPJ (`BOE-A-2025-16497`), publicado en BOE núm. 191 de 9 de agosto de 2025. Descargados desde `boe.es` el PDF oficial (1 página, 192.177 bytes, sha256 `9fbd2228…018a2c`) y el XML estructurado (sha256 `dcead7da…b882`). Metadatos PDF confirman autoría CGPJ. Corregida `fecha_publicacion` (2025-08-08 → 2025-08-09 conforme al campo `<fecha_publicacion>` del XML oficial del BOE).

Ambos YAML actualizados con `ruta_local` + `hash_sha256` y reescrito `nivel_fuente_justificacion` para reflejar metadatos reales del PDF (autor, productor, fecha de creación). `productor_organizacion_id` no se cumplimenta para no introducir una dependencia con `Organizacion(consejo-general-poder-judicial)` que no existe todavía en el catálogo (riesgo de colisión con sesiones paralelas que sí tocan CGPJ, p. ej. caso Kitchen).

### Pendientes (no descargados en PR4)

- **Auto AP Madrid Sección 3ª del 7 de noviembre de 2025** ratificando el procesamiento — buscado en CENDOJ por nombre del investigado y por fecha; el buscador público de `poderjudicial.es` no devuelve el documento al filtrar por la cobertura periodística reseñada en `iustel-ratifica-procesamiento-ga-2025-11-07` y `infobae-ratifica-procesamiento-ga-2025-11-07`. Queda como `pendiente_primario`: cuando el auto aparezca con ROJ asignado en CENDOJ, descargar a `/public/documentos/gonzalez-amador/auto-ap-madrid-seccion-3-ratifica-procesamiento-ga-2025-11-07.pdf` y dar de alta el `Documento` correspondiente (sería el primer auto N1 del caso, hoy modelado únicamente con cobertura N4 cruzada por Iustel + Infobae).
- **Auto de admisión de la acusación popular del PSOE y de Más Madrid** en el procedimiento del JI nº 19 de Madrid. Pasada del backlog editorial heredado del 2026-05-27: el `hito_origen_id` de los dos roles (`psoe-acusacion-popular-ga-2024` y `mas-madrid-acusacion-popular-ga-2024`) apuntaba a `denuncia-aeat-fiscalia-ga-2024-01-22` cuando la denuncia AEAT no es el hito de admisión de la personación. Campo vaciado en ambos roles. Una pasada complementaria del 2026-05-27 vía sub-agente Sonnet Explore reconstruyó la cronología real por cobertura N4 cruzada de cuatro líneas editoriales (El Español 01-abr-2024, El Debate 01-abr-2024, The Objective 01-abr-2024, elDiario.es live-blog 16-abr-2024): PSOE presentó escrito de personación en torno al 1 de abril de 2024 y Más Madrid fue admitida en torno al 16 de abril de 2024 por la jueza Inmaculada Iglesias. `fecha_inicio` corregido en ambos roles a `2024-04-01` (PSOE) y `2024-04-16` (Más Madrid) con notas que documentan la aproximación. Queda como `pendiente_primario`: cuando se localice el auto exacto del JI nº 19 que admite a trámite la personación, cumplimentar el `hito_origen_id` y crear el Hito correspondiente (probablemente tipo `personacion_acusacion_popular_admitida` si el enum lo cubre, o equivalente). Lección reiterada: CENDOJ no publica autos de instrucción de los Juzgados ordinarios.
- **Autos del JI nº 19 de Madrid** (29-may-2025 de procesamiento, 22-sept-2025 de apertura de juicio oral, 14-abr-2025 de imputación de Gómez Fidalgo, 29-may-2025 de archivo provisional de Gómez Fidalgo, 27-jun-2025 de encomienda a la UCO): lección reiterada de Plus Ultra y Begoña Gómez — CENDOJ no publica autos de instrucción de Juzgados ordinarios; sólo lo que sube a la AP o al TS. Permanecen como N4 hasta que algún recurso los suba a la AP.
- **Informe UCO** cuando se entregue (a fecha 2026-05-10 sigue pendiente). N1 si está accesible.

Convención de procesamiento de PDFs no aplicada todavía a este caso: las citas literales con localización exacta en `Hecho.documentos_respaldo[].pasaje` quedan para una pasada futura del maintainer cuando aparezca el primer documento procesal sustantivo (no las dos disposiciones del BOE, que son administrativas y no aportan citas relevantes a los hechos del caso).

## Estado editorial — PR1 + PR2 + PR3 acumulado

- **caso.yaml** raíz creado. Delitos atribuidos en la causa: delito contra la Hacienda Pública, falsedad documental, corrupción en los negocios, administración desleal, organización criminal (las dos últimas en la pieza separada y como acusación popular).
- **9 personas**: Alberto González Amador, María Inmaculada Iglesias Sánchez (jueza saliente), Antonio Viejo Llorente (juez entrante), Maximiliano Niederer, David Herrera Lobato, Agustín Carrillo Saborido, José Miguel Carrillo Saborido, Javier Gómez Fidalgo (investigado→desimputado), Julián Salto (fiscal).
- **11 organizaciones nuevas**: Juzgado de Instrucción nº 19 de Madrid; AEAT; Abogacía del Estado; Maxwell Cremona S.L. (procesada como persona jurídica en PR3); PSOE; Más Madrid; Quirón Prevención S.L.U.; medios: El Plural, Iustel, Heraldo de León, Estrella Digital, Público.es. Reutilizadas del catálogo: Audiencia Nacional, Audiencia Provincial de Madrid, Fiscalía Provincial de Madrid, El Español, Confilegal, El Independiente, eldiario.es, Infobae, The Objective.
- **3 delitos nuevos del catálogo**: delito-contra-hacienda-publica (art. 305 CP), administracion-desleal (art. 252 CP). Falsedad documental y corrupción en los negocios reutilizados del catálogo.
- **16 documentos**: 2 N1 del BOE (RD 838/2025 nombramiento Viejo + Acuerdo CGPJ 13-may-2025 jubilación Iglesias) y 14 N4 (Maldita.es cronología; Heraldo de León imputación Gómez Fidalgo; El Español auto 29-may-2025; Estrella Digital auto 29-may-2025; Confilegal apertura juicio oral; Confilegal nombramiento Viejo; Iustel ratificación AP Madrid; Infobae ratificación AP Madrid; El Plural rama sevillana; Infobae detención Herrera Lobato; Infobae prórroga PSOE 9-abr-2026; El Español defensa invoca FGE; Infobae encargo UCO; Público.es UCO pendiente).
- **9 hitos**: denuncia AEAT-Fiscalía (22-ene-2024); imputación Gómez Fidalgo (14-abr-2025); auto procesamiento (29-may-2025); archivo provisional Gómez Fidalgo (29-may-2025); encargo a la UCO (27-jun-2025); apertura juicio oral (22-sept-2025); cambio juez Iglesias→Viejo (22-sept-2025); AP Madrid ratifica procesamiento (7-nov-2025); detención Herrera Lobato pieza Quirón (20-ene-2026).
- **9 hechos**: sistema de facturas falsas (investigado); cuantificación AEAT 350.951 € (atribuido); archivo provisional Gómez Fidalgo (exculpatorio); penas pedidas por Fiscalía/Abogacía y por PSOE/Más Madrid (atribuido); AP Madrid valoración de prueba no útil (atribuido); rama Quirón investigada (investigado); comisión encubierta 500.000 € Quirón (investigado); defensa invoca condena del FGE (atribuido); informe UCO pendiente (atribuido).
- **15 roles**: 5 procesados personas físicas (González Amador, Niederer, Herrera Lobato, los dos Carrillo Saborido); 1 procesada persona jurídica (Maxwell Cremona, en virtud de la ampliación de V-11 en PR3); investigado→desimputado para Gómez Fidalgo (2 roles); juez_instructor Iglesias (cerrado 10-ago-2025); juez_instructor Viejo (vigente desde 22-sept-2025); fiscal Julián Salto; AEAT denunciante; Abogacía del Estado acusación particular; PSOE acusación popular; Más Madrid acusación popular.

## Pendiente para PR4 y siguientes

- **Archive.org / archive.ph mirrors** para los 14 documentos N4. El maintainer está automatizando el archivado; las URLs `url_archivo` se completarán de forma centralizada.
- **Localización de fuentes oficiales** que NO se han podido localizar con búsqueda pública directa (CENDOJ no publica autos de instrucción de los Juzgados ordinarios; sólo cuando suben a la AP o al TS):
  - Auto del Juzgado de Instrucción nº 19 de Madrid del 29 de mayo de 2025 (procesamiento) en CENDOJ — no localizado.
  - Auto del Juzgado de Instrucción nº 19 de Madrid del 22 de septiembre de 2025 (apertura juicio oral) en CENDOJ — no localizado.
  - Auto de la Audiencia Provincial de Madrid (Sección 3ª) del 7 de noviembre de 2025 en CENDOJ — no localizado todavía; este sí podría aparecer al ser de la AP.
  - Auto del Juzgado de Instrucción nº 19 de Madrid del 14 de abril de 2025 (imputación de Gómez Fidalgo) — no localizado.
  - Auto del Juzgado de Instrucción nº 19 de Madrid del 29 de mayo de 2025 (archivo provisional de Gómez Fidalgo) — no localizado.
  - Auto del Juzgado de Instrucción nº 19 de Madrid del 27 de junio de 2025 (encomienda a la UCO) — no localizado; sería N1 si apareciera.
  - Denuncia de la AEAT a la Fiscalía Provincial de Madrid del 22 de enero de 2024 — restringida a las partes (no accesible a terceros conforme al art. 234 LOPJ y al art. 301 LECrim).
  - Escritos de acusación de la Fiscalía, Abogacía del Estado, PSOE y Más Madrid — restringidos a las partes.
- **Informe UCO**: cuando se entregue, crear `Hito(tipo=informe_organismo_publico)` propio con `Documento(tipo=informe_uco)` N1 si está accesible.
- **Resolución de la AP Madrid o instancia superior** sobre el escrito de defensa del 19-feb-2026 que invoca la condena del FGE como vulneración del proceso justo.
- **Nuevos hitos esperables**: señalamiento de juicio oral; resolución del nuevo titular Antonio Viejo sobre el acceso a las cuentas bancarias del investigado pedido por la UCO en diciembre de 2025.
- **Carlos Neira** como abogado defensa de González Amador: fichar como Persona cuando se arranque el caso del Fiscal General del Estado y crear `RelacionEntreCasos(gonzalez-amador, fiscal-general-del-estado, tipo=causa_conexa)`.
- **Pieza separada "Quirón" / rama sevillana**: el 20 de enero de 2026 la Policía Nacional detuvo a David Herrera Lobato en Arahal (Sevilla) por presunta corrupción en gestiones con el grupo Quirón. Esta rama abre potencialmente una pieza separada del procedimiento principal. Pendiente de modelado en PR2 con su propia secuencia de hitos cuando se publique el auto.
- **Informe UCO** encargado el 27 de junio de 2025 por Inmaculada Iglesias para análisis de documentación. A fecha de PR1 (mayo de 2026) sigue sin entregarse (cobertura Público.es). Cuando se entregue, modelar como `Documento(tipo=informe_uco)` + hito.
- **Carlos Neira y caso del Fiscal General del Estado**: cuando se ficha el caso del FGE como caso autónomo del inventario, crear `Persona(carlos-neira)` + `RelacionEntreCasos(gonzalez-amador, fiscal-general-del-estado)` con tipo `derivada_factual` o `causa_conexa`. Ya hay sentencia firme/no firme contra Álvaro García Ortiz por revelación de secretos del email del 2-feb-2024.
- **Cuantía 350.951 € vs 350.961 €**: cerrar discrepancia con el auto íntegro cuando esté disponible (ver sección "Cuantía 350.951 €, no 350.961 €" en decisiones editoriales).
- **Hermanos Carrillo Saborido**: confirmar que el segundo se llama "José Miguel" (criterio actual) y no "José Antonio" (atestado puntual de Confilegal). Cierra con el auto íntegro en CENDOJ.
- **Babia Capital y ático compartido con Ayuso**: la sociedad Babia Capital es propietaria del ático en Chamberí en el que residen Ayuso y González Amador. Administrada por Gómez Fidalgo. Cobertura periférica; no aporta indicios procesales propios al procedimiento principal. Pendiente de revisar si una pieza autónoma o si entra como contexto en la ficha de la propia organización Maxwell Cremona.

## Verbos de [doc 04 — "Presunción de inocencia: reglas de redacción"](docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción) aplicados

- "Consta en el auto…", "el instructor considera indiciariamente que…", "se atribuye…", "según la Fiscalía…", "la Audiencia Provincial considera que…".
- Final explícito de presunción de inocencia en cada rol activo de procesamiento ("rige el principio de presunción de inocencia mientras no recaiga resolución firme en contrario").

## Fuentes consultadas para PR1

Multi-línea editorial (≥ 2 líneas editoriales por hito). Verificación cruzada.

- El Español — auto del 29-may-2025; cobertura del procedimiento.
- Estrella Digital — auto del 29-may-2025; archivo Gómez Fidalgo.
- Confilegal — apertura juicio oral 22-sept-2025; nombramiento Antonio Viejo.
- elDiario.es — solicitud de prórroga de PSOE y Más Madrid.
- El Plural — rama sevillana, hermanos Carrillo Saborido, contexto.
- Heraldo de León / Diario de León — imputación Gómez Fidalgo (14-abr-2025).
- Iustel — confirmación AP Madrid 7-nov-2025.
- Infobae — cobertura cruzada del procesamiento y de la prórroga PSOE.
- The Objective — declaraciones del entorno del investigado.
- Público.es — informe UCO pendiente.

URLs específicas en cada `Documento` que las cita, conforme al modelo.

## Avisos para el LLM en futuras incorporaciones

- **Nunca redactar a González Amador como culpable.** Verbos prohibidos de [doc 04 — "Presunción de inocencia: reglas de redacción"](docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción). Hasta sentencia firme, sólo "se investiga", "se atribuye", "consta en el auto que…", "el instructor considera indiciariamente que…".
- **El procedimiento NO está sentenciado.** El auto de apertura de juicio oral del 22-sept-2025 NO es una condena: es una decisión procesal de continuar la causa. La presunción de inocencia rige en toda la redacción.
- **Isabel Díaz Ayuso NO es investigada** ni procesada en esta causa. Mencionarla sólo como contexto (pareja del investigado / presidenta de la Comunidad de Madrid). El propio caso es delicado por la cercanía política: aplicar exactamente los mismos verbos y la misma estructura que en cualquier otro caso del inventario (P-10 de [doc 02 — "Reglas anti-desinformación en presentación"](docs/diseno/02-ficha-de-caso.md#4-reglas-anti-desinformación-en-presentación)).
- **Javier Gómez Fidalgo es DESIMPUTADO.** Su rol vigente es `desimputado` desde el 29-may-2025 por sobreseimiento provisional. Cualquier redacción posterior debe respetarlo expresamente.
- **El caso del Fiscal General del Estado es un caso distinto.** Aunque relacionado factualmente (el email del 2-feb-2024 fue origen de aquella causa), no se mezcla aquí. Esta ficha se circunscribe al procedimiento por presunto fraude fiscal y falsedad documental contra González Amador y otros cuatro investigados.
- **Tratamiento sin cuota política.** El caso afecta a una persona cercana al gobierno autonómico de Madrid. La P-10 obliga a aplicar exactamente la misma estructura, badges y tono que a cualquier otro caso del inventario.

## Barrido de actualidad 2026-05-30 (skill `/actualizar-caso`)

Ventana barrida: desde el último hito catalogado (`ap-madrid-desestima-recurso-uco-ga-2026-04-09`, 9-abr-2026) hasta hoy (30-may-2026), con repesca de la noticia del señalamiento del juicio que databa de enero de 2026 y no estaba catalogada. Cobertura cruzada en ≥ 3 líneas editoriales (El Plural, elDiario.es, Madridiario, El Independiente, Público.es, infoLibre, The Objective).

### Novedad real incorporada: el juicio no se celebrará hasta 2027

- **Hito nuevo `senalamiento-juicio-2027-ga-2026-01`** (tipo `auto_diligencias`, fecha 14-ene-2026). La noticia trascendió el 14-ene-2026 (origen atribuido a la Cadena SER, recogido por Madridiario y otros) y la cobertura de mayo de 2026 (El Plural, elDiario.es) la reitera: el juicio oral contra González Amador y los demás procesados por el presunto fraude fiscal y la falsedad documental queda emplazado a 2027 por la saturación de los juzgados de lo penal de Madrid y la entrada en vigor de la reforma de eficiencia de la Justicia ("reforma Bolaños"). La causa permanece en `fase_intermedia` (el señalamiento no la transita a `juicio_oral`; eso ocurrirá con la celebración de la vista). Se eligió `tipo: auto_diligencias` por no existir un enum específico de "señalamiento" en el schema de Hito; es la decisión procesal de fijar (aplazar) la vista.
- **3 documentos N4** (V-13 cumplido con creces, tres líneas editoriales distintas): `madridiario-juicio-2027-ga-2026-01` (Madridiario, documento principal, 14-ene-2026) + `elplural-juicio-2027-ga-2026-05` (El Plural) + `eldiario-juicio-2027-ga-2026-05` (elDiario.es). Cobertura adicional vista pero no catalogada (misma noticia, evitar inflar): El Boletín, Diario de León, El Constitucional, infoLibre.
- **1 organización nueva**: `madridiario` (Madridiario, `medio_comunicacion` / `medio_digital`), por ser el medio que da la noticia y no existir aún en el catálogo.
- **Cascada aplicada a `caso.yaml`**: `sintesis_caso.estado_actual` (añade "juicio oral señalado para 2027"); `cifras_clave` (+ "Juicio oral señalado para 2027"); `descripcion_corta` (cierre actualizado); `ultima_revision_editorial` 2026-05-22 → 2026-05-30; `estado_ficha.fecha_actualizacion` 2026-05-25 → 2026-05-30; `estado_ficha.notas` (apunta el señalamiento y el primario pendiente). NO se tocó `fase_actual` (sigue `fase_intermedia`), ni delitos, ni roles (el señalamiento no altera calificación ni estado procesal de ningún procesado), ni `ponente_actual_id` (sigue Antonio Viejo como instructor; el órgano de enjuiciamiento será un Juzgado de lo Penal aún no identificado).

### Incertidumbres del señalamiento (LLM-incierto, pendientes de primario)

- **Fecha exacta dentro de 2027 y número del Juzgado de lo Penal de Madrid** que enjuiciará: no confirmados. La cobertura habla genéricamente de "mediados de 2027" y "juzgados de lo penal de la calle Julián Camarillo". Los WebFetch a El Plural, Madridiario y Público devolvieron error 522/403 de Cloudflare; sólo se dispone de snippets de búsqueda. La `fecha_documento` de los dos documentos de mayo se fijó a nivel de mes (día 01 como convención) con comentario `# LLM-incierto`; la URL canónica de elDiario.es se reconstruyó del snippet (slug incierto).
- **Pendiente_primario**: providencia o auto de señalamiento del Juzgado de lo Penal. CENDOJ no publica señalamientos de Juzgados ordinarios; probablemente no aparezca hasta que la causa suba a la AP o se dicte sentencia.

### Continuidades (NO modeladas — sin novedad procesal)

- **Informe UCO de la pieza Quirón sigue sin entregarse** (a finales de mayo de 2026, ~11 meses desde el encargo del 27-jun-2025) y el juez Antonio Viejo continúa sin autorizar el acceso a las cuentas bancarias del investigado. Es continuidad del estado ya recogido en el hecho `ga-informe-uco-pendiente` y en el hito `ap-madrid-desestima-recurso-uco-ga-2026-04-09`. No genera hito ni hecho nuevo: el estado no ha cambiado, sólo se ha prolongado. Reverificar en el próximo barrido; si el informe se entrega, crear `Hito(tipo=informe_organismo_publico)` + `Documento(tipo=informe_policial)` N1/N2.
- **Estrategia de nulidad de la defensa apoyada en la condena del FGE**: ya modelada en el hecho `ga-defensa-invoca-fge-vulneracion-proceso` (19-feb-2026). La cobertura de mayo la reitera pero no aporta resolución del órgano sobre esa petición. Sin novedad modelable hasta que haya auto que resuelva.

### Cruce con otros casos del inventario

- **`fiscal-general-del-estado`** — nexo factual fuerte y documentable: el correo del abogado de González Amador del 2-feb-2024 (negociación de conformidad en la causa fiscal) es el secreto cuya filtración originó la condena al ex-FGE Álvaro García Ortiz. La ficha del FGE ya describe el vínculo en su `descripcion_corta` y la defensa de González Amador lo invoca en su escrito del 19-feb-2026. **Se PROPONE `RelacionEntreCasos(gonzalez-amador ↔ fiscal-general-del-estado)`** tipo `derivada_factual`, naturaleza `factual` (el agente de Reconciliación la materializa). Esta relación cierra parcialmente el pendiente histórico "Carlos Neira y caso del Fiscal General" de la sección "Pendiente para PR4 y siguientes": el caso FGE YA existe en el inventario, por lo que la relación es modelable ahora (la `Persona(carlos-neira)` y su rol `abogado_defensa` cruzado siguen pendientes aparte).
- Resto del inventario: sin cruce procesal/funcional nuevo detectado en esta ventana.

### Incidencia de calidad de datos detectada (fuera de scope de este barrido)

- El documento `content/documentos/elespanol-defensa-invoca-fge-ga-2026-02-19.yaml` está corrupto: tiene la clave `nivel_fuente_justificacion` duplicada, un campo `tipo_pieza` no contemplado por el schema y decenas de líneas repetidas `documento_naturaleza: "noticia"`. No tocado en este barrido para no mezclar naturalezas de cambio; requiere limpieza específica (riesgo de que `pnpm validate` falle por `additionalProperties:false`).
- Discrepancias documentales históricas aún abiertas (cierran con el auto íntegro en CENDOJ): cuantía 350.951 € vs 350.961 €; nombre "José Miguel" vs "José Antonio" Carrillo Saborido.
