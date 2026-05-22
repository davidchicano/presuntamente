---
name: incorporar-hito
description: Incorpora un nuevo Hito a un Caso existente a partir de un PDF de auto judicial, sentencia, informe UCO/UDEF o documento procesal equivalente. Genera borrador YAML de Hito + Documento + Hechos derivados + cambios en RolEnCaso, listo para PR. Aplica los guardarraíles del doc 03 §4. Trigger cuando el usuario pide "incorporar este auto", "añade este hito a", "procesa este PDF de Calama", o referencia un documento procesal nuevo en un caso existente.
---

# Skill `incorporar-hito` — v1

## Propósito

Tomar un documento procesal (PDF de auto, sentencia, informe UCO/UDEF, atestado, escrito de Fiscalía) y producir un borrador de PR que incorpore:

1. Un `Documento` nuevo (con su URL canónica si la hay, hash si tenemos copia).
2. Un `Hito` nuevo asociado al caso.
3. Los `Hecho`s que el hito introduce o modifica, con sus `documentos_respaldo`.
4. Los cambios en `RolEnCaso` que el hito provoca (apertura, cierre, sucesor).

Versión `v0`: deliberadamente mínima. La skill se moldea con cada uso (`AGENTS.md` § Skills).

## Inputs aceptados

- Ruta a un PDF en `/public/documentos/` o ubicación local.
- URL canónica al documento (preferido para `nivel_fuente=1` si está en `DominiosOficiales`, doc 01 §3).
- Texto pegado del documento si el PDF no es procesable directamente.

Acompañado del slug del Caso destino (`caso_id`). Si no se proporciona, pregunta antes de actuar.

## Proceso

### 1. Lectura del documento

Lee el documento entero. Identifica:
- Órgano emisor (juzgado / tribunal / fiscalía / unidad policial).
- Fecha del documento (fecha del auto, no la de publicación).
- Tipo (auto, sentencia, informe, escrito de parte).
- Personas y organizaciones nombradas.
- Hechos nuevos sostenidos por el documento (acreditados o investigados según naturaleza del documento).
- Cambios en roles procesales (imputaciones, desimputaciones, condenas).

### 2. Validaciones previas (bloqueantes)

Antes de proponer YAML alguno:
- El `Caso` referenciado existe en `/content/casos/<slug>/caso.yaml`.
- El órgano emisor existe como `Organizacion` en `/content/organizaciones/`. Si no, marca para creación.
- Las personas referenciadas existen como `Persona` o pertenecen a la categoría "no figura pública". Si no existen, marca para creación con `es_figura_publica` propuesto (NUNCA `false` por defecto; razona).

### 3. Generación del borrador

Produce los YAMLs en disco bajo:
- `content/documentos/<slug-documento>.yaml`
- `content/casos/<caso-id>/hitos/<slug-hito>.yaml`
- `content/casos/<caso-id>/hechos/<slug-hecho>.yaml` (uno por cada hecho derivado)
- `content/casos/<caso-id>/roles/<slug-rol>.yaml` (uno por cada apertura o cierre)

Y abre PR con cuerpo:
- Resumen: `<tipo> del <fecha> incorporado al caso <slug>`.
- Cita del párrafo del documento que justifica cada hecho introducido (página + pasaje).
- Validaciones del modelo (V-04, V-05, V-08, V-12, V-13, V-14) marcadas como verificadas o pendientes.

## Guardarraíles obligatorios (doc 03 §4)

1. **NUNCA asignes `Hecho.tipo = acreditado` automáticamente.** Sólo `investigado`, `atribuido` o `no_concluyente`. Marcar `acreditado` requiere review humano explícito tras sentencia firme.

2. **NUNCA inventes datos.** Si un dato no aparece en el documento:
   - Deja el campo vacío con un comentario YAML inline:
     ```yaml
     fecha_inicio: # LLM-incierto: el auto no precisa la fecha
     ```
   - Reporta los campos vacíos en el cuerpo del PR para que el revisor humano los rellene.

3. **`nivel_fuente` del Documento lo propones, pero CI lo valida** contra V-12 (lista blanca `DominiosOficiales`). Niveles posibles:
   - **1**: oficial primaria. URL canónica en `poderjudicial.es`, `cendoj.es`, `boe.es`, `congreso.es`, `senado.es`, `fiscal.es`, `tcu.es`, `airef.es`, `defensordelpueblo.es`, `tribunalconstitucional.es`, `cgpj.es`, o subdominio `.gob.es`. Si no, baja a 2.
   - **2**: oficial secundaria o instructora (informe UCO/UDEF, escrito de Fiscalía publicado, nota de un órgano oficial fuera de la lista blanca).
   - **3**: documento de parte, institucional no jurisdiccional, pericial de parte, filtrado_verificado.
   - **4**: cobertura periodística. **Nunca soporte único para `Hecho` acreditado o investigado** (V-13).

4. **No tocas enunciados publicados.** Si un `Hecho` previo del caso queda superado, propones:
   - Un Hecho nuevo `tipo=exculpatorio` (si el documento lo soporta) o `corregido_por` apuntando al nuevo.
   - Marca el anterior con `vigencia: superado`.
   - **No editas el `enunciado` del Hecho previo.**

5. **Zonas sensibles → marca para review humano explícito**:
   - Cualquier persona con `es_figura_publica = false` que aparezca en el documento.
   - Cualquier `delitos_atribuidos` nuevo en un `RolEnCaso`.
   - Cualquier mención a familiares directos no formalmente investigados.
   - Cualquier persona cuyo rol cierra (V-17: revisión obligatoria de anonimización).

6. **Lenguaje** (doc 04 §3):
   - Verbos prohibidos en enunciados de hechos no acreditados: "robó", "estafó", "se apropió", "es culpable", "ha cometido".
   - Verbos preferidos: "se investiga", "se atribuye", "consta en el auto X que…", "la acusación sostiene que…", "el instructor considera indiciariamente que…".
   - Para sentencias no firmes: "ha sido condenado en primera instancia, pendiente de recurso".
   - **Si el documento contiene una afirmación tajante, cítala literal entre comillas con atribución, no la incorpores como aserción del proyecto.**

## Output esperado

Mensaje final al usuario:
- Lista de ficheros creados o modificados.
- Lista de campos `LLM-incierto` que requieren input humano.
- Validaciones del modelo: cuáles pasan, cuáles bloquean.
- Recordatorios de revisión editorial pendientes (V-08, V-14, V-17 si aplican).

Si el LLM detecta que la incorporación puede violar un principio del proyecto (`AGENTS.md` § Principios irrenunciables), **se detiene y pregunta** antes de tocar nada.

## Iteración

Esta es la `v0`. Tras cada uso real (cada PDF procesado), añade aquí lecciones aprendidas como bullets en una sección "Histórico" — por ejemplo, frases del LLM que se repiten y conviene templatizar, edge cases de tipos de documento no contemplados, errores de fecha que han pasado, etc. La skill mejora con uso, no con diseño anticipado.

## Histórico

### Plus Ultra PR1 (2026-05-21) — bautismo de la skill

Primer uso real. Se incorpora el auto del JCI nº 4 del 19-may-2026 que cita
a Zapatero como investigado. Fuente N1: nota institucional del CGPJ en
`poderjudicial.es` (dominio en lista blanca DominiosOficiales). El auto
íntegro no estaba en CENDOJ todavía; se cita por extracto institucional.

Lecciones:

- **`acreditado` excluye factuales administrativos no controvertidos.** Un
  Real Decreto en BOE o una nota institucional sobre una decisión del
  Consejo de Ministros NO se puede modelar como `acreditado` aunque sean
  factualmente verificables: V-04 exige sentencia firme. Modelarlos como
  `atribuido` con el organismo emisor como actor identificado en el
  enunciado. Ejemplo: el préstamo SEPI 2021-03-09 se modela como
  `atribuido` con la nota SEPI N1 como respaldo.
- **Tensión brief vs realidad procesal en casos vivos.** Cuando el brief
  del usuario está desactualizado respecto a la realidad procesal (un auto
  publicado después de redactar el brief), respetar el brief, documentar
  la discrepancia en `NOTES.md` del caso + `ROADMAP.md → Decisiones
  pendientes`, y deferir al maintainer. NO improvisar ni asumir luz verde.
- **Verbos del doc 04 §3 obligatorios** en todos los enunciados: "consta
  en el auto…", "se atribuye indiciariamente", "el instructor considera
  que…". Final explícito de presunción de inocencia ("rige el principio
  de presunción de inocencia mientras no recaiga resolución firme").

### Plus Ultra PR2 (2026-05-21/22) — operación UDEF + cambio_organo

Segundo uso. Se incorporan 2 hitos sin documento procesal jurisdiccional
publicado: operación UDEF del 11-dic-2025 (detenciones del presidente, CEO
y un empresario) y cambio_organo del 3-mar-2026 (JI 15 Madrid → JCI 4 AN).
Sólo había cobertura periodística N4 disponible; ni la nota CGPJ ni el
comunicado oficial de la Policía Nacional pudieron localizarse con URL
canónica.

Lecciones:

- **Hitos sin documento N1 son aceptables si cumplen V-13 (cruce N4).**
  Cuando un hito relevante sólo tiene cobertura periodística disponible,
  redactar el `Documento` principal como N4 (`tipo=articulo_prensa`) con
  `nivel_fuente_justificacion` que explicite que es cobertura cruzada y
  que se cumplirá V-13 al menos en dos líneas editoriales distintas.
  Añadir uno o más `documentos_relacionados` al Hito apuntando a las
  otras líneas. Cuando aparezca el documento oficial (nota CGPJ,
  comunicado policial, auto en CENDOJ), sustituir el `documento_principal_id`
  por el oficial y elevar el nivel.
- **Mapeo de "operación policial" → tipo=`imputacion`.** El schema no
  tiene un tipo "operación policial" o "registro" en el enum de Hito.
  Para operaciones UDEF/UCO con detenciones que llevan a investigados,
  usar `tipo=imputacion` con descripción explícita del flujo (registro,
  detención, libertad provisional, medidas cautelares). Si la operación
  fuera meramente un registro sin detenciones, usar `informe_organismo_publico`.
- **Anonimización del propio órgano se respeta.** Si la nota CGPJ
  identifica a un sospechoso con iniciales (ej. "Manuel F. G.", "Julio M.
  M."), NO crear `Persona` con nombre completo aunque la prensa lo haya
  identificado. Esperar a que el levantamiento se publique formalmente o
  hasta que el nombre completo aparezca en fuente oficial. La cobertura
  periodística NO autoriza desanonimizar.
- **Familiares no implicados quedan FUERA del inventario** aunque la UDEF
  haya registrado su empresa o domicilio, salvo que un auto les atribuya
  rol procesal formal. Doc 04 §11. Si el registro es relevante para
  describir un hito, se menciona dentro de la descripción del hito sin
  crear `Persona`.
- **Procedimientos secundarios derivados (denuncia X contra UDEF por
  filtración) quedan FUERA del inventario principal** salvo que el
  maintainer decida modelarlos como pieza separada. PR2 ignoró la
  denuncia de Plus Ultra contra la UDEF (admitida 2026-03-06) por ser
  procedimiento secundario en otro juzgado.
- **Las medidas cautelares concretas que siguen a una detención
  (libertad con retirada de pasaporte, comparecencia bimensual) se
  modelan dentro de la descripción del hito de la operación**, no como
  hito separado. El schema no tiene tipo "libertad provisional" y la
  decisión es accesoria al registro inicial.
- **`hito_origen_id` en cada RolEnCaso es obligatorio en la práctica**
  aunque el schema sólo lo exija para `condenado` (V-10). Sin él, el
  rol queda "huérfano" sin trazabilidad. Convención: siempre apuntar al
  hito que abre el rol (auto de imputación, operación UDEF, designación
  como juez instructor, etc.).
- **Medios de comunicación como `Organizacion` tipo=medio_comunicacion**
  son necesarios cuando se usan como `productor_organizacion_id` de un
  Documento. Crear la ficha de la org del medio antes de los Documentos
  (o en el mismo PR si es la primera vez que aparece). Atributos
  mínimos: nombre, tipo, descripcion_corta, ambito_territorial,
  localidad, url_canonica. `linea_editorial_declarada` queda para
  cuando haya cita literal del "Quiénes somos"; no asumir.
- **`url_archivo` (archive.org / archive.ph) queda pendiente del
  maintainer.** El agente no puede llamar a `web.archive.org/save` ni
  con WebFetch (dominio bloqueado) ni de forma fiable con Claude in
  Chrome (timeouts del CDP). Anotar en NOTES.md del caso como
  pendiente para que el maintainer archive manualmente y rellene el
  campo en una pasada posterior. Mirror obligatorio para fuentes N4.
