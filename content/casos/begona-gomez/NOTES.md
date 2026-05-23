# NOTES — Caso Begoña Gómez

Anotaciones internas. **No se publica.** Vive en el repo para humanos y agentes LLM que iteren sobre este caso. Convención en `AGENTS.md` § *NOTES.md por caso*.

Última actualización: 2026-05-23 (barrido retrospectivo de la convención "Documentos primarios descargados a `/public/documentos/`" sobre los 24 documentos catalogados del caso; ver §"Barrido primarios descargados — 2026-05-23"). Antes: 2026-05-22 (PR3 — incorpora Juan José Güemes como persona desimputada, hitos posteriores al 21-abr-2026 hasta hoy, hito propio del ofrecimiento de personación a la UCM, y nuevo tipo de hito `escrito_conclusiones_provisionales` en el schema).

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

- **`schemas/hito.schema.json`**: añadido un nuevo valor al enum de `tipo`: `escrito_conclusiones_provisionales`. Justificación editorial: en procedimiento abreviado, el escrito de conclusiones provisionales de defensa es un evento procesal puntual y reconocible (parte que cierra fase de instrucción y abre fase intermedia previa al juicio). El enum ya admite otros eventos de parte (`comparecencia_congreso`, `publicacion_investigacion_periodistica`), así que la adición es consistente con el patrón existente. V-14 (hitos jurisdiccionales requieren `documento_principal_id`) NO se aplica al nuevo tipo por defecto, pero al modelarlo siempre con `documento_principal_id` por convención no hay diferencia práctica. `src/lib/labels.ts` extendido con el label `Escrito de conclusiones provisionales` para el nuevo tipo. Pendiente menor: documentar el nuevo tipo en `docs/diseno/01-modelo-de-datos.md §2.5` cuando se haga un repaso editorial del doc.

## Correcciones aplicadas en PR2

- **`goyache-investigado.yaml`**: delitos corregidos de `[malversacion-caudales-publicos]` a `[trafico-de-influencias, corrupcion-en-los-negocios]`. La malversación se introdujo en la causa en agosto de 2025 (imputación específica de Cristina Álvarez), pero Goyache fue citado en julio de 2024 antes de esa ampliación. `fecha_inicio` se ajusta a `2024-07-22` (la fecha del auto que documentan elDiario.es y Newtral.es el 22-jul-2024) y `hito_origen_id` ya apunta al hito específico `imputacion-goyache-bg-2024-07-22`.
- **`hazte-oir-acusacion-popular.yaml`**: `fecha_inicio` corregida de `2024-04-24` (mejor aproximación inicial) a `2024-04-29` (cruzada con la fecha confirmada de Vox; las personaciones de Hazte Oír, Vox e Iustitia Europa son coetáneas según la cobertura).

## Barrido primarios descargados — 2026-05-23

**Contexto.** El 2026-05-22, tras el PR2 del Fiscal General del Estado, se incorporó al proyecto la convención "Documentos primarios descargados a `/public/documentos/<caso>/`" (`AGENTS.md` §correspondiente + `.agents/skills/investigar-caso/SKILL.md` §3.bis). El ROADMAP §"Trabajo paralelizable a otro agente" pide aplicar la convención retrospectivamente a los casos ya fichados antes de la norma. Este barrido cubre exclusivamente el caso `begona-gomez`.

**Universo.** 24 documentos catalogados en `content/documentos/*.yaml` con `caso_principal_id: begona-gomez`:

- 3 autos jurisdiccionales (`auto_judicial`): `auto-procesamiento-bg-2026-04-13`, `auto-audiencia-desimputa-goyache-2025-05-16`, `auto-ap-madrid-anula-jurado-2026-02-23` — todos con `nivel_fuente: 4` y `estado_acceso: acceso_restringido_pero_citable` (no localizables públicamente).
- 1 escrito de la Fiscalía (`escrito_fiscalia`): `escrito-fiscalia-recurso-ap-bg-2026-04-21` — `nivel_fuente: 2`, `estado_acceso: acceso_restringido_pero_citable`.
- 20 artículos de prensa (`articulo_prensa`): todos `nivel_fuente: 4`, gestionados por el hook `pre-commit` / `archive.org` (`url_archivo`).
- 0 documentos del BOE (no hay nombramiento/cese de juez/fiscal específicos del caso) ni nota institucional con URL canónica en `poderjudicial.es` ni Acuerdo del CGPJ publicado relacionado con el caso.

**Resultado del barrido.** Cero descargas aplicadas. Razón: a 2026-05-23 no se ha localizado en fuente oficial (BOE / CENDOJ / poderjudicial.es / fiscal.es) ninguno de los documentos candidatos a descarga primaria. Verificado vía WebSearch contra los buscadores institucionales y contra los acuerdos publicados del CGPJ; el barrido reproduce la misma conclusión de PR3 del 22-may, ampliada a las cuatro fuentes oficiales.

**Candidatos prioritarios revisados uno a uno** (todos quedan `pendiente_primario`):

1. **Auto del JI nº 41 del 13-abr-2026 — procesamiento.** Documento `auto-procesamiento-bg-2026-04-13.yaml`. NO publicado en CENDOJ (los Juzgados ordinarios no suben autos de instrucción). NO localizada nota institucional del CGPJ en `poderjudicial.es` al 23-may-2026. URL candidata: ninguna oficial; un mirror periodístico íntegro publicaría las 80+ páginas pero no se ha encontrado uno fiable. Estado: pendiente_primario.
2. **Auto de la AP Madrid del 13-may-2025 — desimputación Goyache + Güemes.** Documento `auto-audiencia-desimputa-goyache-2025-05-16.yaml`. NO publicado en CENDOJ; las secciones de la AP no publican sistemáticamente sus autos. NO localizada nota institucional. El Independiente cita literalmente fragmentos del auto pero no aporta el PDF íntegro; existe un mirror en `wuolah.com` (plataforma de apuntes universitarios) que **no es fuente fiable ni está en lista blanca**, por lo que NO se descarga (la trazabilidad por `hash_sha256` exige procedencia verificable; descargar de Wuolah contradice el principio editorial). Estado: pendiente_primario.
3. **Auto de la AP Madrid del 23-feb-2026 — anulación jurado popular.** Documento `auto-ap-madrid-anula-jurado-2026-02-23.yaml`. Mismo escenario que el anterior: cobertura cruzada con citas pero sin PDF íntegro publicado en fuente fiable. Estado: pendiente_primario.
4. **Escrito de la Fiscalía del 21-abr-2026 — recurso de apelación.** Documento `escrito-fiscalia-recurso-ap-bg-2026-04-21.yaml`. NO publicado en `fiscal.es` (cuya práctica habitual es publicar memorias anuales y disposiciones generales, no escritos procesales concretos). Estado: pendiente_primario.
5. **Escrito de conclusiones provisionales de la defensa del 18-may-2026.** Restringido a las partes por art. 234 LOPJ / 301 LECrim; no se publica en fuente oficial. Estado: no aplica para descarga primaria (es escrito de parte privado).
6. **Autos de la AP Madrid (Sección 3ª/23ª) sobre el jurado popular.** Mismo escenario que (3). Estado: pendiente_primario, cubierto por (3).

**Convención disparada al ver candidatos en mirrors no oficiales (Wuolah, scribd, etc.).** No descargar. La trazabilidad editorial del proyecto requiere proveniencia oficial o, en su defecto, segundo mirror cruzado de calidad periodística verificable (medios con redacción identificada). Plataformas como Wuolah no auditan la fidelidad del PDF subido por el usuario. Al ser PDF "anónimo en su origen", el `hash_sha256` no acredita fidelidad al original. Política operativa: si en el futuro aparece el auto íntegro publicado por un medio con redacción identificable (Infobae documentos, eldiario.es PDF embebido, etc.), entonces sí se descarga, se cruza con segundo mirror si existe, y se documenta el origen en `nivel_fuente_justificacion`.

**Cuándo revisar de nuevo.** Trimestralmente, o cuando un hito procesal posterior dispare la publicación oficial de los autos íntegros (firmeza de la sentencia, llegada a TS por casación, indultos publicados en BOE, etc.). Mientras tanto, el modelo del caso ya cumple V-13 mediante cobertura cruzada N4 multimedio para cada hito.

**No se hace ninguna mutación de YAML en este barrido.** No se añaden `ruta_local`, no se calcula `hash_sha256`, no se reescribe `nivel_fuente_justificacion`. Sólo se actualiza esta NOTES.md.

---

## Pendiente para PR4 y siguientes

- **Archive.org / archive.ph mirrors** para los documentos N4 (ahora 19 tras PR3: 6 de PR1 + 7 de PR2 + 6 de PR3; el escrito de la Fiscalía es N2 y no requiere mirror obligatorio aunque conviene). WebFetch no puede llamar a archive.org desde el entorno del agente; el maintainer debe lanzar el archivado y completar `url_archivo`. Mirror obligatorio para fuentes N4 según doc 01 §3.
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

## Verbos del doc 04 §3 aplicados

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

- **Nunca redactar a Begoña Gómez como culpable.** Verbos prohibidos del doc 04 §3. Hasta sentencia firme, sólo "se investiga", "se atribuye", "consta en el auto de Peinado que…", "el instructor considera indiciariamente que…".
- **El procedimiento NO está archivado.** El archivo del 13-abr-2026 sólo afecta al delito de intrusismo profesional. Por los otros cuatro delitos sigue adelante hacia Tribunal del Jurado.
- **Pedro Sánchez NO es investigado** ni procesado en esta causa. Mencionarlo sólo como contexto (esposo de la investigada / presidente del Gobierno).
- **Joaquín Goyache es DESIMPUTADO.** Su rol vigente es `desimputado` desde el 16-may-2025 por resolución de la Audiencia Provincial de Madrid. Cualquier redacción posterior debe respetarlo expresamente.
- **Tratamiento sin cuota política.** El caso afecta a una familia cercana al gobierno actual. La P-10 del doc 02 obliga a aplicar exactamente la misma estructura, badges y tono que a cualquier otro caso del inventario.
- **Familiares no implicados** (en particular cualquier referencia a otros miembros de la familia Sánchez-Gómez): fuera del inventario salvo que un auto les atribuya rol procesal formal. Doc 04 §11.
