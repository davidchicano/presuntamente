---
name: investigar-caso
description: Arranca un caso nuevo en el inventario presuntamente.org desde un nombre mediático, una URL de prensa o un brief breve del maintainer. Localiza el órgano titular, las personas con rol formal y los hitos clave; genera el esqueleto YAML inicial (Caso + 1-2 Hitos + Documentos respaldo + 1-3 Roles + Hechos derivados) listo para PR. Trigger cuando el usuario pide "investiga el caso X", "arranca un caso nuevo sobre Y", "ficha el caso Z", o pasa un brief de un procedimiento sin slug.
---

# Skill `investigar-caso` — v0

## Propósito

Tomar un brief, un nombre mediático o una URL de prensa de un procedimiento judicial relevante y producir un borrador inicial de PR que incorpore al inventario:

1. La ficha de `Caso` raíz (`/content/casos/<slug>/caso.yaml`).
2. Las `Persona`s mínimas con rol formal en el procedimiento (`/content/personas/<slug>.yaml`).
3. Las `Organizacion`es del aparato procesal: órgano judicial titular, fiscalía, acusación popular, organismo público afectado, empresa investigada si aplica.
4. Los `Documento`s primarios localizados durante la investigación (con `url_canonica` y nivel de fuente).
5. Los primeros `Hito`s: querella/denuncia inicial, operación policial si la hubo, cambio_organo si lo hubo, auto de imputación más reciente.
6. Los primeros `Hecho`s (típicamente `atribuido` y `investigado`; nunca `acreditado` automático).
7. Los `RolEnCaso` mínimos para los implicados con condición formal vigente.

Versión `v0`: deliberadamente mínima. La skill se moldea con la experiencia tras cada caso (`AGENTS.md` §"Skills locales").

## Inputs aceptados

- Nombre mediático del caso (ej. "caso Begoña Gómez", "caso Koldo").
- URL de un reportaje de prensa o de una nota CGPJ que sirva de punto de partida.
- Brief breve del maintainer con datos preliminares (probablemente desactualizados o parciales — ver guardarraíl §"Tensión brief vs realidad procesal").

Si el input es ambiguo (puede referirse a varios procedimientos), preguntar antes de empezar a buscar.

## Proceso

### 1. Identificación del procedimiento

Buscar con `WebSearch` y `WebFetch`:

- **Nombre oficial** del procedimiento (`Diligencias Previas <nº>`, `Procedimiento Abreviado <nº>`, `Sumario <nº>`).
- **Órgano titular actual** (Juzgado de Instrucción nº X de <localidad>, Juzgado Central de Instrucción nº Y, Tribunal Supremo, etc.).
- **Magistrado instructor / ponente** identificable.
- **Fecha de apertura** del procedimiento (lo más aproximada posible).
- **Origen** (querella, denuncia, oficio judicial, cooperación internacional, comparecencia Congreso).

Si el órgano titular ha cambiado durante el procedimiento (típico de causas grandes), identificar el órgano actual y modelar el `cambio_organo` como Hito posterior al inicial.

### 2. Identificación de implicados

Localizar **sólo personas con rol procesal formal**: investigados, procesados, acusados, condenados, absueltos, desimputados, denunciantes formales, juez instructor, fiscal.

**No incluir** en la ficha inicial:
- Personas mencionadas en prensa sin rol procesal formal.
- Familiares no implicados (doc 04 §11).
- Comentaristas, analistas, terceros que opinan.
- Sospechosos identificados sólo por iniciales en notas oficiales (respeta la anonimización del propio órgano hasta que se publique el levantamiento).

Si el procedimiento tiene una persona privada (no figura pública) con rol formal, marca para review humano antes de incluirla — V-17 + doc 04 §11.

### 3. Localización de documentos primarios

Para cada hito candidato, buscar el documento de mayor nivel de fuente disponible:

- **N1 — preferido**: sentencia, auto, BOE, nota oficial CGPJ. URL canónica en lista blanca `DominiosOficiales` (doc 01 §3): `poderjudicial.es`, `cendoj.es`, `boe.es`, `congreso.es`, `senado.es`, `fiscal.es`, `tcu.es`, `airef.es`, `defensordelpueblo.es`, `tribunalconstitucional.es`, `cgpj.es`, subdominios `.gob.es`, organismos públicos con personalidad jurídica propia (SEPI, AEAT, CNMV, etc.).
- **N2**: informe UCO/UDEF (a veces filtrado, a veces oficial), escrito de Fiscalía, nota institucional fuera de lista blanca.
- **N3**: documento de parte, institucional no jurisdiccional, pericial de parte. Querella publicada íntegra por un medio identificable cuenta como N3 (filtrado_verificado).
- **N4**: cobertura periodística. Aceptable como soporte SI cumple V-13: al menos otra fuente en línea editorial distinta que cruce el hecho.

Si un hito relevante NO tiene N1 disponible (típico en operaciones policiales o cambios de órgano cuando el auto aún no ha aparecido en CENDOJ), modelar con N4 como `documento_principal_id` + uno o más `documentos_relacionados` en distintas líneas editoriales. Anotar en `NOTES.md` del caso como pendiente para una pasada futura cuando aparezca el documento oficial.

### 4. Generación del esqueleto

Producir los YAMLs en disco bajo:

- `content/casos/<slug>/caso.yaml` — raíz del caso.
- `content/casos/<slug>/NOTES.md` — anotaciones internas con decisiones tomadas, fuentes consultadas, discrepancias con el brief.
- `content/personas/<slug>.yaml` — una por cada Persona nueva no existente ya.
- `content/organizaciones/<slug>.yaml` — una por cada Organización nueva no existente ya (incluidos medios cuando se usen como `productor_organizacion_id`).
- `content/documentos/<slug>.yaml` — uno por cada Documento citado.
- `content/casos/<slug>/hitos/<slug>.yaml` — los primeros hitos.
- `content/casos/<slug>/hechos/<slug>.yaml` — los primeros hechos.
- `content/casos/<slug>/roles/<slug>.yaml` — los primeros roles.

Y propone commits coherentes (una idea por commit, en español imperativo presente, ver `AGENTS.md` §"Commits").

## Guardarraíles obligatorios

1. **Tensión brief vs realidad procesal en casos vivos.** Cuando el brief del usuario está desactualizado respecto a la realidad procesal (nuevo auto publicado, cambio de órgano reciente, persona imputada después del brief), respetar el brief, documentar la discrepancia en `NOTES.md` del caso + `ROADMAP.md → Decisiones pendientes`, y deferir al maintainer. NO improvisar ni asumir luz verde sobre incorporar la novedad.

2. **NUNCA inventes datos.** Si no tienes fuente verificable para un dato, déjalo vacío con comentario YAML inline `# LLM-incierto: <razón>` y repórtalo en el resumen final. No completes "lo que parece probable".

3. **NUNCA asignes `Hecho.tipo = acreditado` automáticamente.** Sólo `investigado`, `atribuido` o `no_concluyente`. Marcar `acreditado` requiere sentencia firme + review humano explícito (V-04).

4. **Lenguaje del doc 04 §3 obligatorio:**
   - Verbos prohibidos: "robó", "estafó", "se apropió", "es culpable", "ha cometido".
   - Verbos preferidos: "se investiga", "se atribuye", "consta en el auto X que…", "la acusación sostiene que…", "el instructor considera indiciariamente que…".
   - Final explícito de presunción de inocencia en notas de roles activos.

5. **Anonimización del órgano se respeta.** Si una nota oficial identifica a un sospechoso con iniciales, no crear `Persona` con nombre completo aunque la prensa lo haya identificado. Esperar al levantamiento formal.

6. **Familiares no implicados quedan fuera** salvo que un auto les atribuya rol procesal formal. Doc 04 §11.

7. **Cobertura editorial sin cuota política.** Si el caso afecta a una formación política, no editorializar; aplicar exactamente la misma estructura, badges y tono que a cualquier otro caso. Doc 02 §"Principios de la ficha" P-10.

8. **NUNCA `git push`.** El agente acumula commits locales; el push lo decide el maintainer (`AGENTS.md` §"Workflow de rama y PRs", norma reforzada el 2026-05-21).

## Output esperado

Mensaje final al usuario con:

1. Slug del caso creado y URL relativa de la ficha (`/casos/<slug>`).
2. Lista de ficheros creados.
3. Resumen del estado de cuotas mínimas (Persona: 2-4 esperadas en PR inicial, Hito: 2-3, Hecho: 2-3, etc.) y cuáles cumple.
4. Lista de campos `LLM-incierto` que requieren input humano.
5. Validaciones del modelo: cuáles pasan, cuáles bloquean.
6. Lista de pendientes para PR2+: archive.org mirrors, documentos oficiales esperados, decisiones editoriales pendientes.
7. Recordatorio de **no haber hecho push** y de qué commits quedan locales esperando al maintainer.

## Iteración

Tras cada caso real arrancado con esta skill, añadir aquí una entrada en `## Histórico` con:

- Slug del caso.
- Fecha.
- Decisiones editoriales no triviales que se tomaron.
- Lecciones aprendidas que conviene templatizar.

## Histórico

### Begoña Gómez (2026-05-22) — primer arranque real con la skill

Primer caso arrancado de cero con la skill `/investigar-caso` v0 desde
un prompt del maintainer que sólo aportaba nombre mediático y la
hipótesis del órgano titular ("probablemente Juzgado de Instrucción
nº 41 de Madrid, Juan Carlos Peinado, pero VERIFÍCALO"). El caso se
seleccionó deliberadamente porque testea trayectoria con
desimputaciones que Plus Ultra no tiene.

Resultado PR1: 5 personas, 8 organizaciones (incluyendo 5 medios
nuevos), 8 documentos, 5 hitos, 6 hechos, 11 roles. Validado con
`pnpm validate` 92 OK + `astro check` 0/0/0 + `pnpm build` 40 páginas.
Ficha verificada con la trayectoria `investigado → desimputado`
visible en la sección "ABSUELTOS / DESIMPUTADOS" para el rector UCM
Joaquín Goyache.

Lecciones:

- **El par `investigado → desimputado` con `fecha_fin` + `hito_fin_id`
  funciona en datos reales.** Validado por primera vez con Goyache:
  se modela como dos `RolEnCaso` consecutivos del mismo sujeto. La
  card de Persona renderiza ambos roles en una micro-tabla
  cronológica y la sección de personas implicadas del caso agrupa
  correctamente el rol vigente en "ABSUELTOS / DESIMPUTADOS". Patrón
  reusable: una desimputación es un cierre de rol + apertura de
  otro, nunca una modificación destructiva del rol previo.
- **Sobreseimientos parciales de delito (no de procedimiento) se
  modelan como `Hecho(tipo=exculpatorio)`, no como `Hito` separado.**
  El auto del 2026-04-13 archiva el delito de intrusismo profesional
  contra Begoña Gómez manteniendo los otros cuatro delitos. El
  procedimiento continúa, así que no aplica `archivo_provisional`
  ni `sobreseimiento_libre` (sugerirían cierre total). Se modela
  como un `Hecho(tipo=exculpatorio)` colgado del hito principal
  (auto procesamiento) con cita literal al pasaje del auto que
  archiva ese delito.
- **`hito_origen_id` falla cuando no se ha modelado el hito específico
  de imputación.** En PR1 el rol `goyache-investigado` apunta al hito
  de origen del procedimiento (denuncia Manos Limpias) y NO al auto
  específico de imputación del rector. Razón: el auto que elevó a
  Goyache a investigado no se ha localizado todavía con URL canónica
  y modelar un hito sin documento exige usar tipos no jurisdiccionales
  del enum (que no encajan semánticamente). Patrón aceptado para PR1:
  apuntar al hito de origen del procedimiento + nota en NOTES.md de
  que se sustituirá por el hito específico cuando se localice fuente.
  Aprendizaje: el "hito de origen" de un rol no siempre tiene que ser
  el auto específico que lo abrió — puede ser el hito que da carta
  de naturaleza al procedimiento en su conjunto, hasta que aparezca
  el auto más fino.
- **El doc principal de un hito puede ser un documento posterior** que
  documenta retroactivamente lo ocurrido, NO necesariamente coetáneo.
  Caso ejemplo: la imputación de Cristina Álvarez (2025-08-18) tiene
  como `documento_principal_id` el auto de procesamiento del
  2026-04-13 — porque el auto recoge la imputación previa y la
  confirma. Funciona dentro del modelo. Sin embargo, **cuando hay
  cobertura coetánea N4 disponible es preferible usarla como
  `documento_principal_id` y referenciar el doc posterior en
  `documentos_relacionados`** (es lo que se hizo con la imputación
  de Barrabés, 2024-07-19, apoyada en Libertad Digital del mismo día).
  Refuerza la trazabilidad temporal.
- **Personas con rol procesal de "testigo" pero figura pública NO se
  modelan como `Persona` en PR1.** Caso de Pedro Sánchez en el caso
  Begoña Gómez: compareció como testigo el 2024-07-22 acogiéndose a
  su derecho a no declarar. Aunque el schema admite rol "testigo",
  editorialmente entra en la categoría de "familiar de implicada con
  rol no imputador" y no aporta valor al inventario. Se menciona como
  contexto en la biografía corta de la investigada (esposa del
  presidente) y en la descripción del caso. Patrón reusable: el rol
  "testigo" se reserva para personas cuyo testimonio sea materialmente
  relevante para el modelado de hechos o cuya identificación sea
  relevante editorialmente, no para todos los que comparezcan ante
  el juzgado.
- **Cobertura de medios con orientación editorial dispar es el
  estándar de cruce V-13.** Para los hitos sin documento oficial
  localizable se necesitaron al menos dos líneas editoriales
  distintas. Para Begoña Gómez PR1 se cruzaron: Infobae + Libertad
  Digital (giro derechista) con El Español + Maldita.es + The
  Objective + Moncloa.com (con perfiles editoriales heterogéneos).
  La P-10 de neutralidad política se garantiza no por la línea
  editorial de cada medio (que es la que es) sino por **cuántas
  líneas se cruzan** y por el lenguaje del proyecto, que aplica los
  verbos del doc 04 §3 con independencia de la cobertura.
- **El nº exacto del procedimiento (Diligencias Previas xxxx/2024)
  no siempre es público.** En Begoña Gómez PR1 una fuente lo da como
  "DP Previas 1146" pero no se ha podido cruzar oficialmente. Patrón:
  poner en `numero_procedimiento` un texto que explicite la
  incertidumbre ("Diligencias Previas (número exacto pendiente de
  confirmación pública)") en lugar de un número no verificable.

### Plus Ultra (2026-05-21) — caso bautismo (no usó la skill formalmente)

El caso Plus Ultra se arrancó manualmente antes de que existiera esta skill, en sesión directa con el maintainer. Lecciones que han informado la v0:

- **Lista blanca de dominios oficiales se amplía caso a caso.** Plus Ultra añadió `sepi.es` cuando el primer documento N1 fue una nota institucional de la SEPI. Cuando un caso introduce un organismo público no previsto, anotar en la lista blanca + decisión en NOTES.md.
- **Decisiones del brief vs auto judicial.** El brief no incluía a Zapatero como investigado; un auto del 19-may-2026 sí lo hizo. La decisión fue respetar el brief, documentar la discrepancia, y deferir. Patrón válido para futuros casos.
- **Hitos sin documento N1 disponible son aceptables** con cruce N4 (cobertura periodística en dos líneas editoriales distintas), siempre que se anote como pendiente la sustitución por documento oficial cuando aparezca. Cumple V-13.
- **Implícitos del modelado**: `hito_origen_id` siempre obligatorio en la práctica para todos los RolEnCaso (aunque V-10 sólo lo exija para condenado); medios como Organizacion `tipo=medio_comunicacion` cuando se usan como `productor_organizacion_id`; mapeo de operación policial → `tipo=imputacion`.
