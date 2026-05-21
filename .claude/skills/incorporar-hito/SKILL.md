---
name: incorporar-hito
description: Incorpora un nuevo Hito a un Caso existente a partir de un PDF de auto judicial, sentencia, informe UCO/UDEF o documento procesal equivalente. Genera borrador YAML de Hito + Documento + Hechos derivados + cambios en RolEnCaso, listo para PR. Aplica los guardarraíles del doc 03 §4. Trigger cuando el usuario pide "incorporar este auto", "añade este hito a", "procesa este PDF de Calama", o referencia un documento procesal nuevo en un caso existente.
---

# Skill `incorporar-hito` — v0

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

*(vacío en v0; rellenar con cada caso futuro)*
