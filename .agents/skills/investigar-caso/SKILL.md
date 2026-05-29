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

Versión `v0`: deliberadamente mínima. La skill se moldea con la experiencia tras cada caso ([AGENTS.md → "Skills locales"](../../../AGENTS.md#skills-locales-agentsskills)).

## Inputs aceptados

- Nombre mediático del caso (ej. "caso Begoña Gómez", "caso Koldo").
- URL de un reportaje de prensa o de una nota CGPJ que sirva de punto de partida.
- Brief breve del maintainer con datos preliminares (probablemente desactualizados o parciales — ver guardarraíl "Tensión brief vs realidad procesal").

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
- Familiares no implicados ([doc 04 — "Ética"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#11-ética)).
- Comentaristas, analistas, terceros que opinan.
- Sospechosos identificados sólo por iniciales en notas oficiales (respeta la anonimización del propio órgano hasta que se publique el levantamiento).

Si el procedimiento tiene una persona privada (no figura pública) con rol formal, marca para review humano antes de incluirla — V-17 + [doc 04 — "Ética"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#11-ética).

### 3. Localización de documentos primarios

Para cada hito candidato, buscar el documento de mayor nivel de fuente disponible:

- **N1 — preferido**: sentencia, auto, BOE, nota oficial CGPJ. URL canónica en lista blanca `DominiosOficiales` (doc 01, "Enums catalogados"): `poderjudicial.es`, `cendoj.es`, `boe.es`, `congreso.es`, `senado.es`, `fiscal.es`, `tcu.es`, `airef.es`, `defensordelpueblo.es`, `tribunalconstitucional.es`, `cgpj.es`, subdominios `.gob.es`, organismos públicos con personalidad jurídica propia (SEPI, AEAT, CNMV, etc.).
- **N2**: informe UCO/UDEF (a veces filtrado, a veces oficial), escrito de Fiscalía, nota institucional fuera de lista blanca, comunicado oficial de corporación de derecho público (Colegios profesionales como el ICAM, p. ej.).
- **N3**: documento de parte, institucional no jurisdiccional, pericial de parte. Querella publicada íntegra por un medio identificable cuenta como N3 (filtrado_verificado). **Sentencias del TS no localizadas en CENDOJ pero accesibles vía mirrors periodísticos estables**, modeladas como N3 `filtrado_verificado` con verificación por triangulación entre al menos dos mirrors públicos coincidentes.
- **N4**: cobertura periodística. Aceptable como soporte SI cumple V-13: al menos otra fuente en línea editorial distinta que cruce el hecho.

Si un hito relevante NO tiene N1 disponible (típico en operaciones policiales o cambios de órgano cuando el auto aún no ha aparecido en CENDOJ), modelar con N4 como `documento_principal_id` + uno o más `documentos_relacionados` en distintas líneas editoriales. Anotar en `NOTES.md` del caso como pendiente para una pasada futura cuando aparezca el documento oficial.

### 3.bis. Descarga y procesamiento de documentos primarios

**Norma adoptada en PR2 del caso Fiscal General del Estado (2026-05-22).** Para documentos jurisdiccionales y oficiales clave del caso (sentencias, autos relevantes, BOE, informes públicos), no basta con citar la URL canónica: hay que **descargar copia íntegra al árbol del proyecto y procesarla** para extraer citas literales precisas. Convención completa en [AGENTS.md → "Documentos primarios descargados"](../../../AGENTS.md#documentos-primarios-descargados-a-publicdocumentos).

**Flujo recomendado por documento**:

1. **Localizar el PDF/XML** en el dominio canónico (BOE: endpoints estables `boe.es/diario_boe/{txt,pdf,xml}.php?id=BOE-A-YYYY-XXXXX`) o en mirrors públicos cuando no esté en lista blanca.
2. **Pedir autorización explícita al maintainer** antes de descargar de fuentes que no estén en la lista blanca y que el sandbox classifier vaya a bloquear. URLs del BOE no requieren consulta (es lista blanca); URLs de prensa o mirrors sí.
3. **Descargar a `/public/documentos/<caso>/<id>.<ext>`**. Calcular `shasum -a 256` sobre el fichero descargado.
4. **Verificar metadatos PDF** con `pdfinfo`: autor, fecha de creación, productor (Word, Antenna House, etc.). Si el autor pertenece al órgano emisor (p. ej. usuario `g.tejedor` del Tribunal Supremo en un PDF generado en Word), eso refuerza la confianza en el documento.
5. **Si hay dos mirrors posibles**, descargar ambos y comparar hashes. Si difieren, comparar páginas y contenidos: distintos PDFs del mismo documento son frecuentes (uno con OCR, otro re-comprimido, uno con voto particular y otro sin él). Quedarse con el más completo y fiel al original (el del propio órgano).
6. **Extraer texto con `pdftotext`** (depende de `poppler-utils`; `brew install poppler` una vez por máquina).
7. **Mapear estructura de la sentencia / auto**: `grep -nE "^(HECHOS PROBADOS|FUNDAMENTOS|FALLO|VOTO PARTICULAR|PRIMERO|SEGUNDO|TERCERO|CUARTO)"`. Identificar líneas de inicio de cada sección y leer en bloques con `sed -n '<inicio>,<fin>p'`.
8. **Para cada Hecho del caso**: buscar el pasaje literal que lo respalda, citarlo en `Hecho.documentos_respaldo[].pasaje` con localización precisa ("FALLO, p. 180", "Fundamento de Derecho Tercero, apartado 3.1, p. 147", "Hechos Probados pp. 18-21"). Si la sentencia es firme y el pasaje declara probado un hecho, **promover a `acreditado`** (con review humano explícito conforme al guardarraíl 3 cuando el caso es delicado).
9. **Actualizar el YAML del `Documento`** con `ruta_local`, `hash_sha256` y reescribir `nivel_fuente_justificacion` para reflejar la metadata real del archivo descargado y el cruce con segundo mirror si aplica.

**Beneficio editorial**: el sitio puede ofrecer al lector "URL canónica + copia local + cita exacta", elevando el rigor a nivel de citación académica. Y si la URL canónica desaparece, el documento se conserva. La trazabilidad de fidelidad es el `hash_sha256`.

### 3.ter. Localización de PDFs en portales oficiales

El catálogo técnico de **endpoints, patrones de URL y trampas conocidas por portal** vive en [`docs/fuentes/`](../../../docs/fuentes/README.md), no aquí. Es conocimiento operativo reusable por varias skills, scripts y agentes; centralizarlo evita duplicidad y permite ampliarlo con cada sesión.

Para localizar un documento primario al fichar un caso:

1. **Identifica el portal**: poder judicial (sentencias, autos, acuerdos CGPJ, notas de prensa) → [`docs/fuentes/poder-judicial.md`](../../../docs/fuentes/poder-judicial.md). BOE y boletines autonómicos → [`docs/fuentes/boe-y-boletines-oficiales.md`](../../../docs/fuentes/boe-y-boletines-oficiales.md). Fiscalía → [`docs/fuentes/fiscalia.md`](../../../docs/fuentes/fiscalia.md). Tribunal Constitucional → [`docs/fuentes/tribunal-constitucional.md`](../../../docs/fuentes/tribunal-constitucional.md). Organismos económicos → [`docs/fuentes/organismos-economicos.md`](../../../docs/fuentes/organismos-economicos.md). Congreso/Senado/Defensor → [`docs/fuentes/legislativo.md`](../../../docs/fuentes/legislativo.md). archive.org y mirrors → [`docs/fuentes/archivos-y-mirrors.md`](../../../docs/fuentes/archivos-y-mirrors.md).

2. **Lee la ficha del portal** y reproduce el endpoint con `curl`. La ficha trae patrones de URL, parámetros del buscador, cobertura temporal real, filtros silenciosos y un caso de prueba conocido para verificar que el portal sigue funcionando como esperamos.

3. **Si descubres algo nuevo** (endpoint estable no documentado, código numérico opaco, filtro que no filtra de verdad, cobertura recortada en años): **anótalo en la misma sesión** en la ficha correspondiente, en el bloque "Histórico de descubrimientos". El catálogo crece y se vuelve más útil cada vez que se usa.

4. **Si el portal no existe todavía en el catálogo**: crea la ficha mínima con el patrón básico que descubras, aunque sea breve. La plantilla está en [`docs/fuentes/README.md`](../../../docs/fuentes/README.md#plantilla-mínima-por-ficha).

**Decisión editorial sobre nivel de fuente** (esto sí es responsabilidad de la skill, no del catálogo):

- **N1 — preferido**: documento del propio órgano emisor en lista blanca `DominiosOficiales`, con URL canónica estable. Descargar al árbol cuando aplica la convención de "Documentos primarios descargados" (sentencias, autos relevantes, BOE, informes públicos).
- **N2**: documento oficial secundario o instructor (informe UCO/UDEF, escrito de Fiscalía, comunicado de corporación de derecho público fuera de lista blanca). El nivel se asigna **por tipo y origen**, no por publicación oficial. Si una Fiscalía emite un escrito procesal y no lo publica en `fiscal.es`, sigue siendo N2 por tipo; documentar la verificación cruzada en `nivel_fuente_justificacion`.
- **N3**: documento de parte, institucional no jurisdiccional, pericial de parte, sentencia TS no localizada en CENDOJ pero accesible íntegra vía mirror periodístico identificable con triangulación (`filtrado_verificado`). Criterios para aceptar un mirror en [`docs/fuentes/archivos-y-mirrors.md`](../../../docs/fuentes/archivos-y-mirrors.md). **NO** mirrors anónimos (Wuolah, Scribd, blogs personales): rechazar y anotar `pendiente_primario` en `NOTES.md`.
- **N4**: cobertura periodística. Exigir respaldo cruzado por al menos otra línea editorial distinta (V-13). `url_archivo` en archive.org obligatorio.

Si un hito relevante NO tiene N1 disponible (típico en autos de instrucción de JI ordinarios o autos intermedios de AP en causas vivas), modelar con N4 cruzado como `documento_principal_id` + uno o más `documentos_relacionados` en distintas líneas editoriales. Anotar en `NOTES.md` del caso como `pendiente_primario` para una pasada futura cuando aparezca el documento oficial — típicamente cuando el procedimiento llegue al TS o gane firmeza definitiva.

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

**Al modelar un medio de comunicación nuevo** (decisión 2026-05-26, ver [`docs/diseno/07-clasificacion-editorial-medios.md`](../../../docs/diseno/07-clasificacion-editorial-medios.md)): poblar como mínimo `naturaleza_editorial` (enum: `generalista_politico`, `verificacion`, `especializado_juridico`, `especializado_no_politico`, `servicio_publico_estatal`, `servicio_publico_autonomico`, `confesional`, `otro`). Si encuentras declaración pública verificable del propio medio sobre su orientación, poblar también `orientacion_editorial_declarada` con `valor` + `fuente` + `cita` literal + `url`. No clasificar por intuición: si no hay cita verificable, no rellenes orientación (queda implícitamente como sin clasificar, lo cual es legal).

**Al cerrar el `caso.yaml` raíz** (refactor 2026-05-27, ver [`docs/diseno/08-afectacion-directa-indirecta.md`](../../../docs/diseno/08-afectacion-directa-indirecta.md)): la afectación editorial NO se modela en `caso.yaml` — el campo `Caso.partidos_afectados[]` está retirado. Cada organización afectada por el caso se documenta vía `VinculoInstitucional` con `nivel_afectacion: directa | indirecta` + `justificacion_afectacion`. Naturalezas aplicables: `entidad_investigada_en_caso` (persona jurídica investigada), `perjudicado_institucional_en_caso` (víctima oficial), `ambito_administrativo_directo_del_acto_en_caso` (Ministerio/Consejería del que emana el acto), `afectacion_indirecta_en_caso` (partido del cargo, partido del cónyuge, partido del gobierno responsable, ente dependiente). La acusación popular (`acusacion_institucional_en_caso`) NO es afectación. Aplicar las 6 reglas del doc 08 antes de marcar un partido como indirecto. **No inferir** desde militancia histórica genérica ni desde simpatías ideológicas. Detalle operativo y plantillas en la skill [`/documentar-vinculos`](../../documentar-vinculos/SKILL.md) v3.

**Al escribir `sintesis_caso.que_se_investiga`** (aprendizaje 2026-05-28, ver [`docs/web/features/sintesis-caso.md`](../../../docs/web/features/sintesis-caso.md)): redactarlo como entradilla breve de una frase. Debe decir el objeto de la investigación, no convertirse en un segundo resumen ejecutivo. Fechas de autos, registros policiales, importes, nombres secundarios, causas paralelas y matices de estado procesal van en `hechos_clave`, `estado_actual`, `cifras_clave` o `descripcion_corta`. Si el nombre mediático gira sobre una persona con rol formal, nombrarla con cautela procesal (`investigada`, `procesada`, etc.) o dejar explícito por qué no se la nombra. Si queda casi tan largo como `descripcion_corta` o `resumen_cifras`, compactar antes de publicar.

Y propone commits coherentes (una idea por commit, en español imperativo presente, ver [AGENTS.md → "Commits"](../../../AGENTS.md#commits)).

### 5. Alimentar el diccionario de citaciones inline

El sitio renderiza acrónimos institucionales, nombres de organización,
nombres de persona, cifras monetarias y "cosas de interés" no
jerárquicas como micro-componentes inline (`RichProse`,
`src/lib/richProse.ts`). La v1 cubre 5 ejes de auto-detección, todos
sin tener que marcar nada a mano en el YAML:

1. **Money chip**: cifras monetarias detectadas y convertidas a forma
   corta canónica. `"53 millones de euros"`, `"5.000.000 €"`, `"53 M€"`,
   `"1 millón de euros"` → todas renderizan `53 M€` / `5 M€` / `1 M€`
   con tooltip al texto original.
2. **Acrónimos institucionales**: lista blanca base (UDEF, AN, JCI,
   CGPJ, SEPI…) + cualquier sigla corta (2-12 caracteres, mayúsculas)
   presente en `nombres_alternativos` o `siglas` del inventario.
3. **Nombres largos de organización**: `nombre` + entradas con espacio
   o mixed-case de `nombres_alternativos`. Case-sensitive
   ("Audiencia Nacional" sí, "audiencia nacional" no).
4. **Personas**: `nombre_completo` + `nombres_alternativos` enteros.
   Case-sensitive ("Zapatero" sí, "zapateros" no).
5. **Glosario** (`/content/glosario/<slug>.yaml`): "cosas de interés"
   no jerárquicas que se citan en prosa sin ser entidades formales.
   Tres categorías: `programa_publico` (Fondo de Apoyo a la Solvencia,
   PERTE Chip…), `operacion_policial` (Operación Kitchen, Operación
   Catalonia…), `trama_sobrenombre` (Gürtel, Lezo, Púnica, ERE…). Se
   renderiza con dotted underline + tooltip de `descripcion_breve`,
   sin link interno (no son páginas del inventario) ni externo
   ([DESIGN.md → "Component Stylings"](../../../DESIGN.md#4-component-stylings): nunca a Wikipedia).

**Al crear una `Organizacion` o `Persona` nueva**, añadir SIEMPRE en
`nombres_alternativos` cómo la prensa y los autos la citan. Ejemplos:

- `juzgado-central-instruccion-4.yaml` → `nombres_alternativos: ["JCI nº 4", "JCI 4 AN"]`.
- `audiencia-nacional.yaml` → `nombres_alternativos: ["AN"]`.
- `joaquin-goyache.yaml` → `nombres_alternativos: ["Joaquín Goyache", "Goyache"]`.
- `jose-luis-rodriguez-zapatero.yaml` → `nombres_alternativos: ["Zapatero", "JLRZ", "Rodríguez Zapatero"]`.

Sin esos alias, una mención en prosa como "según declaró Goyache" se
quedará como texto plano en vez de enlazar a la ficha de la persona.

**Al fichar un caso donde aparecen "cosas de interés" no entidades**
(programa público citado por nombre comercial, operación policial
nombrada, sobrenombre mediático de la trama), añadir una entrada de
glosario en `/content/glosario/<slug>.yaml` con:

```yaml
id: operacion-kitchen
label: "Operación Kitchen"
nombres_alternativos:
  - "caso Kitchen"
categoria: operacion_policial
descripcion_breve: |
  Operación parapolicial atribuida al Ministerio del Interior entre
  2013 y 2015, instruida ante el JCI nº 6 de la Audiencia Nacional,
  consistente en el espionaje al exministro Luis Bárcenas con el
  presunto objetivo de hacerse con documentación sensible para el PP.
estado_publicacion: borrador
ultima_revision_editorial: "YYYY-MM-DD"
```

Una entrada de glosario NO genera ruta web (no hay `/glosario/[slug]`).
Sólo alimenta el tooltip de las menciones inline.

#### Escape hatch (marcado explícito)

Cuando la auto-detección falle (un alias no cubierto, un nombre
ambiguo, una cifra que requiere tooltip distinto del literal) o
quieras forzar comportamiento, usa sintaxis explícita en el YAML:

```yaml
# Persona: el texto entre |...]] es lo que se renderiza.
enunciado: |
  El rector [[persona:joaquin-goyache|Goyache]] compareció…

# Organización (cuando ni siglas ni nombre largo capturan el alias):
descripcion: |
  El [[org:juzgado-central-instruccion-4|JCI 4]] dictó auto…

# Cifra con tooltip personalizado (label tras "|" es el tooltip):
resumen_cifras: |
  Contratos por [[€:113.509,32 €|cifra cuantificada por la UCM]].

# Delito (auto-detección OFF hasta Fase 2; el escape hatch genera
# texto plano por ahora, listo para activarse cuando exista la ruta):
enunciado: |
  Investigado por [[delito:trafico-de-influencias|tráfico de influencias]].
```

Reglas del escape hatch:

- `[[org:<slug>|<label>]]` enlaza siempre a `/organizaciones/<slug>`.
- `[[persona:<slug>|<label>]]` enlaza a `/personas/<slug>`.
- `[[delito:<slug>|<label>]]` se reserva para Fase 2 (ruta inexistente
  todavía); hoy se renderiza como texto plano sin link pero con la
  sintaxis ya escrita.
- `[[€:<texto>]]` o `[[€:<texto>|<tooltip>]]` para chip de money con
  forma exacta no detectable.
- El escape hatch tiene prioridad sobre la auto-detección y NO se
  vuelve a procesar (no se autoenlaza dos veces).

Usar el escape hatch con moderación. La auto-detección sigue siendo el
camino principal: lo normal es ampliar `nombres_alternativos` cuando
detectes que un alias falta, no salpicar el YAML de `[[...]]`.

#### Anti-falsos-positivos automáticos

`RichProse` no enlaza la ficha consigo misma:

- En `/personas/<slug>`, los aliases de esa persona no se autoenlazan
  en la propia biografía.
- En `/organizaciones/<slug>`, igual con la descripción.
- En `/casos/<slug>`, las menciones de la persona/organización cuyo
  `id` coincide con el slug del caso (típico: el caso Begoña Gómez)
  no se autoenlazan en el resumen ejecutivo, resumen_cifras, los
  enunciados de Hecho ni las descripciones de Hito.

Titulares, breadcrumbs, nombres oficiales del caso y cabeceras de
tabla NUNCA se enrutan por `RichProse` (son texto plano en el
componente), así que ya están a salvo por construcción.

## Guardarraíles obligatorios

1. **Tensión brief vs realidad procesal en casos vivos.** Cuando el brief del usuario está desactualizado respecto a la realidad procesal (nuevo auto publicado, cambio de órgano reciente, persona imputada después del brief), respetar el brief, documentar la discrepancia en `NOTES.md` del caso + `ROADMAP.md → Decisiones pendientes`, y deferir al maintainer. NO improvisar ni asumir luz verde sobre incorporar la novedad.

2. **NUNCA inventes datos.** Si no tienes fuente verificable para un dato, déjalo vacío con comentario YAML inline `# LLM-incierto: <razón>` y repórtalo en el resumen final. No completes "lo que parece probable".

3. **NUNCA asignes `Hecho.tipo = acreditado` automáticamente.** Sólo `investigado`, `atribuido` o `no_concluyente`. Marcar `acreditado` requiere sentencia firme + review humano explícito (V-04).

4. **Lenguaje de [doc 04 — "Presunción de inocencia: reglas de redacción"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción) obligatorio:**
   - Verbos prohibidos: "robó", "estafó", "se apropió", "es culpable", "ha cometido".
   - Verbos preferidos: "se investiga", "se atribuye", "consta en el auto X que…", "la acusación sostiene que…", "el instructor considera indiciariamente que…".
   - Final explícito de presunción de inocencia en notas de roles activos.

5. **Anonimización del órgano se respeta.** Si una nota oficial identifica a un sospechoso con iniciales, no crear `Persona` con nombre completo aunque la prensa lo haya identificado. Esperar al levantamiento formal.

6. **Familiares no implicados quedan fuera** salvo que un auto les atribuya rol procesal formal. [Doc 04 — "Ética"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#11-ética).

7. **Cobertura editorial sin cuota política.** Si el caso afecta a una formación política, no editorializar; aplicar exactamente la misma estructura, badges y tono que a cualquier otro caso. Doc 02, reglas anti-desinformación P-10.

8. **NUNCA `git push`.** El agente acumula commits locales; el push lo decide el maintainer ([AGENTS.md → "Workflow de rama y PRs"](../../../AGENTS.md#workflow-de-rama-y-prs), norma reforzada el 2026-05-21).

9. **Traducción terminológica `imputado → investigado`.** La LO 13/2015 sustituyó "imputado" por "investigado" como término procesal vigente. Mucha cobertura periodística (especialmente antes de 2015, pero también después por inercia) sigue usando "imputado". **El modelo de datos del proyecto usa `investigado`**, nunca `imputado`. Cuando una fuente diga "imputado" o "imputación de X" en un texto de Hecho/Hito, traducir mentalmente a `investigado` para el rol y mantener "imputación" sólo si se refiere al **acto** (auto de imputación, hito de imputación). Verbos preferidos en prosa: "se le investiga", "queda como investigada", "el juez la cita como investigada". Evitar "imputada" como adjetivo de persona — usar "investigada".

10. **`condenado` se separa en `condenado_no_firme` y `condenado_firme`.** El rol genérico `condenado` ya no existe en el schema (cambio del 2026-05-22). Si una fuente confirma una condena, posicionarse: si la sentencia es **recurrible** (apelación, casación), usar `condenado_no_firme`; si ya no cabe recurso, usar `condenado_firme`. La presunción de inocencia formal cae solo con firmeza, así que el badge UI cambia (rojo apagado outline vs rojo chillón fill) y el lenguaje editorial también: "condenado en sentencia no firme, pendiente de recurso" vs "condenado por sentencia firme". Si la firmeza no está clara en las fuentes, optar conservadoramente por `condenado_no_firme` y documentar la incertidumbre en `NOTES.md`.

11. **Importe estructurado en el Hecho.** Si un Hecho del esqueleto cuantifica dinero trazable a su fuente (la cifra titular del caso suele ir en el primer Hecho), rellena `importe` + `importe_alcance` (obligatorio si hay importe, V-22) + `importe_naturaleza` ([doc 01 §2.6](../../../docs/diseno/01-modelo-de-datos.md), [ficha importe-presunto](../../../docs/web/features/importe-presunto.md)). La cifra titular del caso → `total_caso`. Anti-doble-conteo (V-23): no estructures la misma cifra en dos Hechos; peticiones de pena no firmes y ofrecimientos no percibidos → `componente`. Divisa extranjera → estructura la relevante en euros, divisa original en `importe_nota`. Esto es además del `Money chip` en prosa y de `sintesis_caso.cifras_clave` (texto libre).
    - **Atribución por sujeto (`importe_atribucion`).** Si el documento desglose nominalmente quién **recibe / paga / sufre** el dinero, rellena además `importe_atribucion[]` con el **papel económico** de cada sujeto (distinto del rol procesal): clase `objeto` → `activo` (conducta atribuida, **no** afirma que percibiera), `beneficiario` (consta indiciariamente que lo recibe/se le adjudica), `perjudicado` (víctima que sufre el quebranto); clase `consecuencia` → `obligado` (paga multa/RC), `acreedor` (la cobra). **Guardarraíl de presunción de inocencia:** el quebranto del `perjudicado` NUNCA se suma al investigado; `activo` ≠ percepción; usa `beneficiario` solo cuando el documento lo respalde. Cada `sujeto` debe estar en `personas_implicadas`/`organizaciones_implicadas` (V-24) y el papel ser coherente con la clase (V-25). Detalle y tabla en [doc 01 §2.6](../../../docs/diseno/01-modelo-de-datos.md#26-hecho) y la [guía de la ficha](../../../docs/web/features/importe-presunto.md).

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

### Fiscal General del Estado PR2 + PR3 (2026-05-22 / 2026-05-23) — descarga de primarios + acreditados con cita literal + tribunal completo

Continúa el caso FGE arrancado en PR1. Tres lotes de cambios en
dos sesiones consecutivas:

- **PR2 (2026-05-22)** — Descarga al árbol del proyecto de tres
  documentos primarios: Sentencia 1000/2025 íntegra del TS (238 pp.,
  voto particular incluido) y los dos Reales Decretos del BOE
  relacionados (RD 1138/2025 cese García Ortiz y RD 1140/2025
  nombramiento Peramato), con `ruta_local` + `hash_sha256` y
  metadatos PDF reflejados en `nivel_fuente_justificacion`. Promoción
  a `acreditado` de los cuatro hechos derivados directamente del
  fallo dispositivo y de los Hechos Probados (filtración del correo,
  quebrantamiento del deber de reserva, penas impuestas,
  indemnización), con citas literales con localización exacta tras
  revisión humana explícita del maintainer. Incorporación de los
  cuatro hitos previos de la fase TSJ Madrid (marzo-julio de 2024)
  que faltaban en PR1.
- **PR3 (2026-05-23)** — Composición completa del tribunal de
  enjuiciamiento con seis magistrados nuevos del TS Sala 2ª
  (Marchena, Berdugo, del Moral, Lamela en mayoría; Ferrer y Polo
  en voto particular) y seis roles `juez_ponente`. Cuatro hechos
  adicionales acreditados con cita literal extraídos del texto
  íntegro de la sentencia (presión WhatsApp a Lastra, adelanto nota
  EL PAÍS, borrado dispositivos, papel de Miguel Ángel Rodríguez).
  Correcciones de fechas inciertas de PR1 contra fuentes N1 BOE.

Lecciones operativas:

- **La descarga local de documentos primarios es transformadora
  editorialmente.** Pasamos de citar "nota CGPJ que resume el fallo"
  a citar "FALLO, p. 180" con el PDF servido desde la propia web del
  proyecto y trazabilidad por `hash_sha256`. El esfuerzo de
  descargar + procesar es del orden de minutos por documento
  (incluida instalación una vez por máquina de `poppler-utils` vía
  `brew install poppler`). El beneficio compone: una vez la
  sentencia está procesada, todos los hechos derivados pueden citar
  pasajes literales con número de página, y futuras consultas
  cruzadas (¿qué dice exactamente la sentencia sobre X?) se
  resuelven con `grep` o `sed` sobre el texto extraído sin
  reabrir el PDF. Convención añadida a [AGENTS.md → "Documentos primarios descargados"](../../../AGENTS.md#documentos-primarios-descargados-a-publicdocumentos) y al
  flujo de la skill en apartado 3.bis. **Patrón reusable** en todos los
  casos del inventario; pendiente aplicarlo retroactivamente a
  Plus Ultra, Begoña Gómez y González Amador (ver ROADMAP, "Trabajo
  paralelizable a otro agente").
- **El sandbox classifier bloquea fetches a fuentes externas no
  pre-autorizadas.** Bloquea descargas de okdiario.com, brew install
  de paquetes del sistema, etc. Patrón operativo: pedir
  autorización explícita al maintainer (con `AskUserQuestion`
  proponiendo opciones de mirror) antes de descargar de fuentes
  fuera de lista blanca DominiosOficiales. Las URLs del BOE
  (boe.es) no requieren consulta (es lista blanca). Cuando hay
  varios mirrors editoriales posibles para un mismo documento
  jurisdiccional, dar al maintainer la decisión con razonamiento
  editorial (neutralidad, completitud, autoría) — en FGE el
  maintainer eligió "descargar de dos fuentes y cruzar hash",
  patrón aplicable a otras sentencias mediáticas con coberturas
  divididas en líneas editoriales.
- **Cruce de mirrors revela diferencias estructurales del
  documento, no falsificaciones.** En FGE el PDF de
  civil-mercantil.com tiene 182 páginas y el de okdiario.com tiene
  238: la diferencia son las 56 páginas del voto particular,
  presentes sólo en el segundo mirror. Decisión: quedarse con el
  más completo, dejando el otro mencionado como mirror secundario
  en la justificación del nivel de fuente. Verificación de
  autoría editorial vía metadatos PDF (`pdfinfo`): autor
  `g.tejedor` en el mirror más completo, lo que evidencia origen
  en el propio sistema ofimático del Tribunal Supremo. **Patrón
  reusable**: cuando dos mirrors de la misma sentencia tienen
  hashes distintos, comparar páginas y metadatos antes de descartar
  uno — la diferencia suele explicarse por inclusión / exclusión
  del voto particular o por OCR/re-compresión, no por falsificación.
- **Mapeo de la estructura de una sentencia larga.** `pdftotext`
  sin layout produce flujo de texto secuencial limpio (formato
  preferible para grepping). `grep -nE
  "^(HECHOS PROBADOS|FUNDAMENTOS|FALLO|VOTO PARTICULAR|PRIMERO|
  SEGUNDO|TERCERO|CUARTO|QUINTO|SEXTO)"` identifica líneas de
  cabecera de sección con números de línea. Luego
  `sed -n '<inicio>,<fin>p'` lee cada bloque en aislamiento. En
  238 páginas y ~10.000 líneas de texto, esto reduce el coste de
  navegación a segundos. Para citas literales en
  `Hecho.documentos_respaldo[].pasaje` conviene anotar tanto el FJ
  ("FJ Tercero, apartado 3.1") como la página (`p. 147`) — la página es
  estable entre versiones de la sentencia, los apartados internos son
  más volátiles.
- **`juez_ponente` se usa para todos los magistrados firmantes del
  tribunal de enjuiciamiento, no sólo para el ponente formal.**
  Decisión adoptada en PR3 del caso FGE. El enum del schema
  `rol-en-caso` no tiene `juez_integrante`, y crear `juez_ponente`
  sólo para Martínez Arrieta dejaba a los otros 6 magistrados
  huérfanos de la ficha y sin aparecer en la sección "Funcionales".
  Solución editorial: `juez_ponente` para los 7, distinguiendo en
  el campo `notas` su posición (mayoría / voto particular /
  presidente y ponente formal). Las dos magistradas autoras del
  voto particular se modelan como ponentes "del voto particular"
  (el voto particular es un texto firmado y argumentado del que
  ellas son responsables directas). **Patrón reusable** para
  futuros casos con tribunal de varios magistrados (causas
  especiales TS, sentencias importantes de la AN). Alternativa
  futura: ampliar el enum del schema con `juez_integrante` si la
  distinción editorial se vuelve crítica.
- **Magistrados como personas reusables del inventario.** Aunque
  un magistrado no sea protagonista editorial de un caso concreto,
  fichar su Persona con biografía verificada (CGPJ, BOE) en un caso
  capitaliza para futuros casos donde aparezca. Los 7 magistrados
  de la Sala 2ª del TS aparecerán en casi cualquier causa especial
  futura del inventario (Koldo, Cerdán). PR3 FGE fichó a los 6 que
  faltaban; ya están disponibles para enlazado vía RichProse en el
  resto del inventario.
- **Confirmar fechas estimadas contra fuentes N1 BOE/CGPJ**.
  Patrón reaplicado de González Amador PR3 (que subió a N1 del BOE
  el cambio de juez Iglesias → Viejo). En FGE PR3 se confirmaron
  fechas de cargo de Pilar Rodríguez Fernández (RD 1288/2018
  BOE-A-2018-14014) y de Martínez Arrieta como presidente Sala 2ª
  (RD 708/2025 BOE-A-2025-17263, con sucesión Marchena → Martínez
  Arrieta documentada por nota oficial CGPJ del 23-jul-2025). Las
  fechas de PR1 eran estimaciones razonables; las corregidas son
  confirmadas. **Patrón operativo**: cuando se ficha una persona
  con cargo público, anotar fechas estimadas si no hay tiempo de
  verificar pero marcar como pendiente; una sesión posterior puede
  cerrar con BOE/CGPJ. El sistema RichProse autoenlaza
  correctamente con o sin la fecha exacta.
- **El brief paralelizable a otro agente vive en el ROADMAP, no
  en NOTES del caso.** Cuando una tarea es lo bastante grande y
  lineal para delegarla a una segunda sesión de Claude Code,
  redactar en el ROADMAP, en sección "Trabajo paralelizable a
  otro agente", como brief autónomo: objetivo, candidatos
  prioritarios, qué hacer y qué no hacer, pasos por unidad,
  output esperado, convivencia multiagéntico. La sesión paralela
  debe poder arrancarla sin más contexto que el ROADMAP + el
  AGENTS.md vigentes. **Patrón estrenado** en este PR3 con la
  tarea de aplicar la convención de primarios descargados
  retrospectivamente a los otros 3 casos.

### Fiscal General del Estado PR1 (2026-05-22) — primera sentencia firme del inventario y primera RelacionEntreCasos

Tercer caso real arrancado con la skill (cuarto si contamos Plus
Ultra retrospectivo). Causa Especial nº 20557/2024 ante la Sala
Segunda del Tribunal Supremo contra Álvaro García Ortiz por
revelación de datos reservados, conectada factualmente al caso ya
fichado `gonzalez-amador` mediante la primera entrada del
inventario en `content/relaciones-entre-casos/` (tipo `derivado_de`).
PR1 estrena la cadena completa de cuatro roles consecutivos del
mismo sujeto `investigado → procesado → condenado_no_firme →
condenado_firme` con cuatro hitos jurisdiccionales encadenados, y
abre la collection `relaciones` en `src/content.config.ts`.

5 personas + 8 orgs nuevas + 1 delito + 14 docs (7 N1 + 1 N3 + 6
N4) + 9 hitos + 6 hechos + 15 roles + 1 RelacionEntreCasos.
Validación: 264 YAML OK, build 95 páginas, `astro check` 0/0/0.

Lecciones operativas:

- **El primer caso firme NO se modela con `acreditado` por defecto.**
  El guardarraíl 3 de la skill se aplica con literalidad incluso
  cuando hay sentencia firme: en PR1 todos los hechos derivados del
  fallo dispositivo se modelan como `atribuido` con cita literal,
  dejando para revisión humana explícita del maintainer (PR2) la
  promoción a `acreditado`. Razón adicional reaprovechable en
  futuras condenas firmes con amparo en trámite: la presentación
  del recurso ante el TC, aunque no suspensiva, deja abierto un
  canal hipotético de revisión. El modelo es expresivo: el cambio
  `atribuido → acreditado` es trivial cuando llega la luz verde
  humana, y conserva trazabilidad porque el hecho ya está cableado
  a la sentencia firme vía documento de respaldo.
- **La cadena `investigado → procesado → condenado_no_firme →
  condenado_firme` funciona como secuencia de cuatro roles
  consecutivos del mismo sujeto, con `fecha_fin` + `hito_fin_id` en
  los tres primeros tramos y `hito_origen_id` apuntando a la
  sentencia correspondiente en los dos condenado_*.** Validado en
  García Ortiz. La card de Persona renderiza correctamente los
  cuatro roles en su micro-tabla cronológica y la sección
  "Personas implicadas" del caso agrupa al sujeto bajo "Condenados"
  con el rol vigente (`condenado_firme`). V-10 se cumple
  naturalmente apuntando `hito_origen_id` al
  `sentencia_primera_instancia` en el primer condenado_no_firme y
  al `sentencia_firme` en el condenado_firme. **Patrón reusable**
  cuando lleguen condenas firmes en otros casos (Koldo, Cerdán,
  etc.).
- **El rol procesal de un letrado depende de a qué parte representa,
  no de su nombre o trayectoria.** Carlos Neira es `abogado_defensa`
  en `gonzalez-amador` (defiende al investigado) y `abogado_acusacion`
  en `fiscal-general-del-estado` (representa a la acusación
  particular ejercida por el mismo cliente). La NOTES anterior de
  González Amador anotaba erróneamente "abogado_defensa en ambos
  casos"; corregido en PR1 del FGE tras cobertura del 30-ene-2026
  confirmando que Neira firma escritos como acusación particular.
  **Patrón reusable**: al fichar a un letrado en un segundo caso,
  reconfirmar siempre cuál es su rol procesal real en ese
  procedimiento concreto.
- **La collection `relaciones-entre-casos` se crea cuando se
  introduce la primera entrada.** El script `pnpm validate` ya
  estaba preparado para validar `content/relaciones-entre-casos/`
  contra el schema correspondiente; sólo había que crear la carpeta
  y cablear la collection en `src/content.config.ts` para que
  Astro la cargue. El cambio de `content.config.ts` es config, no
  schema, por lo que cae dentro del PR1 conforme a la norma de
  granularidad (los cambios mixtos schema + datos sí requieren
  commits separados; config + datos no). **Patrón reusable**: la
  segunda entrada `RelacionEntreCasos` ya no necesita tocar
  `content.config.ts`; sólo añadir el YAML.
- **Notas oficiales del CGPJ (`poderjudicial.es`) son N1 fiables
  para todas las fases jurisdiccionales clave de causas mediáticas
  ante el TS.** A diferencia de los autos de instrucción ordinaria
  (que no se publican: lección reiterada en Plus Ultra, Begoña
  Gómez y González Amador), las notas oficiales del CGPJ cubren las
  causas con tribunal aforado y notoriedad pública con detalle
  procesal suficiente para servir de `documento_principal_id` en
  todos los hitos jurisdiccionales (V-14). En el caso FGE se han
  podido modelar 6 hitos consecutivos con nota oficial N1 directa.
  **Patrón reusable**: para causas especiales ante el TS, buscar
  primero la nota CGPJ específica por nombre del documento.
- **Sentencias del TS con sentencia íntegra no en CENDOJ se modelan
  como N3 `filtrado_verificado` con justificación por triangulación
  entre dos o más mirrors públicos estables.** La Sentencia 1000/2025
  no aparece en CENDOJ a fecha de PR1 (pese a ser de tribunal
  aforado), pero sí está disponible en `publico.es` con
  transcripción íntegra, en `okdiario.com` como PDF y en
  `civil-mercantil.com` como base documental, todas coincidentes en
  contenido literal. La triangulación entre fuentes editorialmente
  dispares funciona como prueba de fidelidad. **Patrón reusable**:
  cuando aparezca el documento en CENDOJ, se eleva el `nivel_fuente`
  a 1 manteniendo el mismo `id` del documento, sin romper hechos
  derivados.
- **Recurso de amparo ante el TC no encaja en el enum del schema
  `hito` y se documenta como pendiente.** El enum actual no tiene
  `recurso_amparo`; la opción procesalmente más cercana es
  `recurso_casacion` pero semánticamente es incorrecta (el amparo
  no es casación). La decisión se difiere a PR2 cuando aparezca el
  primer auto del TC sobre admisión: si el patrón se repite (Koldo,
  ERE, etc. pueden llegar a amparo) merece ampliar el enum con
  `recurso_amparo`. **Patrón reusable**: si una omisión del schema
  bloquea un hito puntual y no hay urgencia, registrar la decisión
  en NOTES y diferir; si bloquea contenido editorial necesario,
  ampliar enum siguiendo el patrón de `escrito_conclusiones_provisionales`
  (Begoña PR3) o de V-11 ampliada (GA PR3).
- **Archivado archive.org vía `scripts/archivar-n4.mjs`.** Manual con
  `pnpm archive:catchup` (requiere red; no hay hook de git). Si
  archive.org falla o HTTP 520, dejar `url_archivo` vacío y anotar.
  **Patrón reusable**: al fichar N4, basta `url_canonica` verificable;
  `url_archivo` lo rellena catchup posterior.
  Ver [`docs/web/features/archive-org-pre-commit.md`](../../../docs/web/features/archive-org-pre-commit.md).

### González Amador PR1 + PR2 + PR3 (2026-05-22) — segundo caso real arrancado con la skill, en sesión paralela

Primer caso del inventario arrancado por un segundo agente trabajando
sobre la misma working copy en paralelo al maintainer (que cerraba
PR3 Begoña Gómez). Tres PRs en una sola sesión.

PR1: 9 personas + 10 organizaciones nuevas + 9 documentos + 7 hitos
+ 5 hechos + 14 roles + nuevo delito `delito-contra-hacienda-publica`
(art. 305 CP). PR2: pieza separada Quirón (3 docs, 1 hito, 1 org, 2
hechos). PR3: ampliación V-11 + N1 BOE para cambio de juez + Maxwell
Cremona persona jurídica procesada + encargo UCO + delito
`administracion-desleal`.

Lecciones operativas:

- **Sesiones paralelas multiagéntico**. La operación más delicada es
  `git add`: si arrastra archivos modificados por el otro agente,
  acabas commiteando trabajo ajeno. Norma incorporada a `AGENTS.md`:
  antes de cada `git commit`, ejecutar `git status -s` y stagear
  sólo por ruta explícita (nunca `git add .`, `-A` ni patrones
  genéricos); justo después de `git add` y antes del commit,
  segundo `git status -s` para confirmar que sólo lo propio aparece
  como `A`. La recuperación cuando se mete la pata: `git reset
  HEAD~1` no destructivo y rehacer con `git add` explícito.
- **Granularidad de commits**. Como no se hace push hasta que el
  maintainer decide, el log local lo lee el maintainer por sesión,
  no por bloque. Norma incorporada a `AGENTS.md`: un commit por PR
  coherente, no por sub-bloque interno (delitos / orgs / personas /
  docs / caso). Excepción legítima: cambios mixtos que mezclen
  schema + datos, o cambios editorialmente delicados que el
  maintainer pueda querer revertir aisladamente. PR1 se dividió en
  5 commits y PR3 en 1; el segundo formato es claramente preferible
  en revisión.
- **Persona jurídica investigada / procesada existe en el ordenamiento
  español desde la LO 5/2010**. La regla V-11, ya ampliada en
  Begoña PR2 para admitir `perjudicado` a organizaciones, ha
  necesitado segunda ampliación para admitir los roles imputadores
  cuando el procedimiento sigue formalmente contra una mercantil
  (caso Maxwell Cremona S.L. en este procedimiento). El cambio se
  documenta en el propio schema con remisión histórica al caso
  motivador. **Patrón reusable**: cuando una validación del schema
  choca con un dato real verificable y procesalmente legítimo,
  revisar la validación, no forzar el dato.
- **CENDOJ no publica autos de instrucción de Juzgados ordinarios**.
  Lección reaplicada de Plus Ultra y Begoña Gómez: los autos del
  Juzgado de Instrucción nº 19 de Madrid (29-may-2025
  procesamiento; 22-sept-2025 apertura juicio oral; 14-abr-2025
  imputación Gómez Fidalgo; 27-jun-2025 encomienda UCO) NO están
  publicados en CENDOJ ni en la web del CGPJ. Los autos sólo suben
  a CENDOJ cuando recaen sobre causas de aforados (TS), órganos
  centrales (AN) o cuando llegan a una instancia superior por
  recurso. El auto de la AP Madrid Sección 3ª del 7-nov-2025
  ratificando el procesamiento sí podría aparecer (tribunal
  colegiado de Audiencia Provincial), pero a fecha de PR3 no se
  localiza con búsqueda pública. **Patrón estable**: no esperar
  autos jurisdiccionales de instrucción ordinaria; cobertura
  cruzada N4 con V-13 cubre operativamente el gap.
- **BOE es N1 fiable para nombramientos / jubilaciones de magistrados**.
  Reales Decretos de destinación de magistrados y Acuerdos de la
  Comisión Permanente del CGPJ publicados en BOE son N1 puro
  (boe.es está en la lista blanca). En este caso, dos documentos N1
  sustituyen cobertura N4 inicial sobre el cambio de juez Iglesias
  → Viejo: BOE-A-2025-19789 (RD 838/2025 destino Antonio Viejo
  Llorente al JI 19) y BOE-A-2025-16497 (Acuerdo CGPJ jubilación
  voluntaria de María Inmaculada Iglesias Sánchez). El rastreo del
  BOE es eficaz para datos de relevo de plaza / comisión /
  jubilación; conviene incluirlo siempre en la investigación de un
  caso con cambio de juez documentado.
- **Pieza separada NO siempre cambia de órgano titular**. En este
  caso la pieza por presunta corrupción en los negocios y
  administración desleal vinculada a Quirón Prevención es una pieza
  separada *dentro del mismo JI 19 Madrid*, no una causa que escale
  a la Audiencia Nacional. La intervención de la AN Sección 2ª en
  la detención de David Herrera Lobato del 20-ene-2026 se limita a
  la orden de detención y toma de declaración inicial; la
  sustanciación sigue en el JI 19. La cobertura de Infobae del
  20-ene-2026 inducía a confusión; sólo cruzando con la cobertura
  de Público.es del 10-may-2026 y de Infobae del 27-jun-2025
  (encomienda UCO por la jueza Iglesias del JI 19) se confirma quién
  instruye la pieza. **Patrón reusable**: cuando un órgano emite una
  orden de detención en un caso que se instruye en otro órgano, NO
  se asume que el órgano detenedor sea el instructor; verificar con
  segunda fuente.
- **Personas físicas y jurídicas se modelan de forma simétrica una
  vez V-11 está ampliada**. Maxwell Cremona aparece en `RolEnCaso`
  con el mismo `rol=procesado` y los mismos `delitos_atribuidos` que
  Alberto González Amador, su administrador único, y con el mismo
  `hito_origen_id`. La distinción entre persona física y persona
  jurídica vive en `sujeto_tipo`, no en el rol. Esto simplifica el
  modelado y mejora la trazabilidad de la responsabilidad penal
  societaria.

### Begoña Gómez PR2 (2026-05-22) — segundo PR del primer caso real

PR2 del caso Begoña Gómez. Cierra los pendientes anotados en NOTES tras
PR1 que sí estaban accesibles públicamente, y añade un descubrimiento
de modelado: la regla V-11 del schema `rol-en-caso` necesitaba admitir
`perjudicado` como rol de organización (la UCM no podía modelarse
como perjudicada con el schema original).

Resultado: 6 organizaciones nuevas (Vox como `partido_politico`
ejerciendo acusación popular + 2 asociaciones nuevas como acusación
popular + 3 medios nuevos), 8 documentos nuevos (incluido el primer
N2 del inventario: escrito de la Fiscalía), 3 hitos nuevos (imputación
Goyache, anulación AP Madrid jurado popular, recurso de la Fiscalía
ante la AP Madrid), 2 hechos nuevos, 4 roles nuevos. 2 correcciones a
roles de PR1.

Lecciones:

- **V-11 estaba mal calibrada para organizaciones perjudicadas.** El
  enum original limitaba a organizaciones a `acusacion_popular /
  acusacion_particular / querellante / denunciante`. La UCM como
  perjudicada en proceso penal español (responsable de la acción
  civil derivada del delito) es un caso legítimo y el modelo lo
  rechazaba. Cambio mínimo aplicado al schema: añadir `perjudicado`
  al enum del bloque if/then de V-11. **Patrón futuro**: si la
  validación del schema choca con un dato real verificable y
  procesalmente legítimo, revisar la validación. La V-11 sigue
  cumpliendo su propósito (no permitir roles "imputador" sobre
  organizaciones, que en Derecho penal español es problemático),
  sólo amplía la lista permitida.
- **El nivel 2 del modelo de fuentes ya tiene su primer ejemplo.**
  Escrito de la Fiscalía Provincial de Madrid del 21-abr-2026:
  `tipo: escrito_fiscalia, nivel_fuente: 2`, justificación que
  explicita por qué no es N1 (no está en `fiscal.es`) ni N4 (no es
  cobertura periodística). Patrón reusable para informes UDEF/UCO
  filtrados, escritos de Fiscalía fuera de `fiscal.es`, notas de
  órganos oficiales fuera de la lista blanca. En PR1 todo era N3 o
  N4; PR2 cubre por fin la franja intermedia del modelo.
- **Las acusaciones populares se modelan como bloque coetáneo.** En
  Begoña Gómez, Hazte Oír / Vox / Iustitia Europa se personaron "días
  después" del 24-abr-2024 (24-29 abril). Se modelan con la misma
  `fecha_inicio: 2024-04-29` y las notas del rol explicitan que el
  auto específico de admisión queda pendiente. MRPE quedó al margen
  porque tuvo que prestar fianza y se personó más tarde. **Patrón**:
  cuando varias acusaciones populares se personan en bloque tras la
  apertura, sincronizar fechas con la mejor estimación cruzada y
  documentar la convención en las notas del rol.
- **Los partidos políticos se modelan como `Organizacion(tipo=partido_politico)`
  con rol `acusacion_popular` igual que cualquier asociación.** Vox
  ejerce la acusación popular en este caso. No requiere ningún
  wrapper especial: el schema lo admite directamente. Lo único
  particular es la `tipo` del partido (no `asociacion_acusacion_popular`).
  Patrón previsible: cuando Vox aparezca en futuros casos (Fiscal
  General, Koldo), su ficha ya existe y sólo hay que crear el rol.
- **Corregir delitos atribuidos de un rol de PR1 sin destruir
  trazabilidad.** En PR1 puse erróneamente `malversacion-caudales-publicos`
  como delito atribuido a Goyache; la malversación entró en la causa
  en agosto de 2025, mientras Goyache estuvo investigado de julio de
  2024 a mayo de 2025. PR2 lo corrige a `[trafico-de-influencias,
  corrupcion-en-los-negocios]`. Como el rol no se había publicado
  (todo el caso está en `estado_publicacion: borrador`), no procede
  V-08 ni `corregido_por`: se modifica directamente y se documenta
  la corrección en NOTES del caso. Si el caso estuviera publicado,
  habría que emitir un Hecho `corregido_por` que sustituye al previo
  manteniendo el original con `vigencia: superado`.
- **Los `hito_origen_id` provisionales se sustituyen cuando aparece
  el hito específico.** En PR1 el rol `goyache-investigado` apuntaba
  al hito de origen del procedimiento (denuncia Manos Limpias) por
  falta del hito específico. PR2 crea el hito `imputacion-goyache-bg-2024-07-22`
  y actualiza el rol. Patrón reusable: el `hito_origen_id`
  provisional es una bandera para PR posterior; en cuanto aparezca
  fuente para crear el hito específico, sustituir.
- **Los autos del juez instructor no se publican fácilmente.** Tras
  buscar exhaustivamente en `poderjudicial.es`, CENDOJ y notas
  institucionales, los autos del JI nº 41 de Madrid del caso Begoña
  Gómez NO están localizables con URL canónica. Esto es lo
  esperable: el JI es un órgano cotidiano del partido judicial de
  Madrid, no un órgano-noticia del CGPJ como la Audiencia Nacional.
  Las notas CGPJ se reservan para resoluciones de alta visibilidad
  pública. Confirmación de la lección de Plus Ultra PR2: muchos
  hitos jurisdiccionales legítimos viven sólo en N4 cruzado.

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
  verbos de [doc 04 — "Presunción de inocencia: reglas de redacción"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#3-presunción-de-inocencia-reglas-de-redacción) con independencia de la cobertura.
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
