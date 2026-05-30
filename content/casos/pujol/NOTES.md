# NOTES — Caso Pujol

Anotaciones internas. **Excluido del build público.**

## Estado del modelado

Ficha arrancada y modelada en profundidad el 2026-05-30. **`estado_publicacion: borrador`
y `estado_ficha: en_progreso`**: la ficha NO debe publicarse hasta verificar las
incertidumbres listadas abajo contra fuentes primarias.

> **AVISO METODOLÓGICO CRÍTICO**: esta sesión se ejecutó **sin acceso web
> funcional** (WebSearch y WebFetch devolvieron vacío durante toda la sesión). El
> modelado se ha construido sobre el registro público bien establecido del caso,
> pero **todas las fechas exactas, el número de procedimiento, las URL canónicas
> de los documentos y la atribución precisa de delitos por persona están sin
> verificar contra fuente oficial**. Cada dato no verificado lleva un comentario
> YAML inline `# LLM-incierto: <razón>` en su fichero. Antes de cualquier
> publicación, un agente con acceso web debe completar la verificación.

## Decisiones editoriales

- **Presunción de inocencia**: todos los Hechos se han modelado como
  `investigado` o `atribuido`; ninguno como `acreditado`. No hay sentencia firme
  conocida en esta causa.
- **Familia como investigada, no condenada**: los siete hijos de Jordi Pujol
  Soley y él mismo se modelan con `RolEnCaso` tipo `investigado`, con
  `nota_presuncion_inocencia` en cada uno.
- **Marta Ferrusola**: se mantiene su rol (`investigado`, `vigente: false`)
  porque tuvo rol procesal formal; su fallecimiento extingue la responsabilidad
  penal. Modelado como hito tipo `archivo` respecto de ella.
- **Oriol Pujol**: figura aquí solo por su rol en ESTA causa (patrimonio
  familiar). Su condena en el caso ITV/Tractament de Cataluña es un procedimiento
  distinto y NO se mezcla aquí (posible RelacionEntreCasos `comparte_persona` con
  `itv-cataluna`, propuesta en la salida del agente).
- **No se ha estructurado importe en los Hechos** porque ninguna cifra concreta
  pudo trazarse a fuente verificable sin acceso web. El dinero estructurado
  (importe + importe_atribucion) debe añadirse cuando se localice el informe
  patrimonial de la UCO o la resolución que fije las cantidades. Ver pendientes.
- **Banca Privada d'Andorra (BPA)**: no se ha creado como organización (no tiene
  rol procesal formal en el inventario). Se ha optado por una entrada de glosario
  para la "herencia de Florenci Pujol" (tesis de parte sobre el origen del
  dinero). Si en verificación BPA adquiere relevancia procesal, valorar crearla.

## Fuentes consultadas

- **Ninguna fuente web pudo consultarse en esta sesión** (web caída). El modelado
  se apoya en el registro público consolidado del caso. Las fuentes a consultar
  en la verificación son:
  - poderjudicial.es (notas del CGPJ / Audiencia Nacional).
  - CENDOJ (autos y eventual sentencia).
  - Cobertura N4 cruzada (≥2 líneas editoriales) para V-13: El País, Vozpópuli,
    El Confidencial, eldiario.es (todos existen ya como organizaciones en el
    repo).

## Candidatos a 'acreditado' (revisión humana, V-04)

- **Ninguno por ahora.** No consta sentencia firme en esta causa. El único hecho
  con reconocimiento directo del interesado es la confesión pública de Jordi
  Pujol del 25-jul-2014 (mantener fondos no regularizados en el extranjero); aun
  así se modela como `investigado` porque su calificación penal y su alcance son
  objeto de la instrucción, no un hecho declarado probado por tribunal.

## Pendientes (pendiente_primario y verificación)

1. **Número de procedimiento**: verificar el número exacto (probablemente
   Diligencias Previas 96/2014 del JCI nº 5, pero SIN confirmar).
2. **Fecha exacta de incoación** de las diligencias en 2014.
3. **Auto de transformación a procedimiento abreviado** (José de la Mata):
   localizar fecha exacta y copia íntegra en CENDOJ → `pendiente_primario` en
   `content/documentos/auto-transformacion-procedimiento-abreviado-pujol.yaml`.
4. **Auto de procesamiento**: verificar si existió como tal o si la imputación
   formal se articuló solo por el auto de transformación / apertura de juicio
   oral (procedimiento abreviado). Ajustar el documento y el hito en
   consecuencia.
5. **Apertura de juicio oral y estado del juicio**: fecha y estado actual sin
   verificar; el hito está con `fecha_aproximada: true`. Comprobar si el juicio
   se ha celebrado, suspendido o señalado, y si hay sentencia (a 2026).
6. **Fallecimiento de Marta Ferrusola**: confirmar fecha exacta (modelada
   aproximada como 2024-09-22).
7. **Atribución de delitos por persona**: la lista de delitos por cada
   `RolEnCaso` es una aproximación; verificar contra el escrito de la Fiscalía /
   el auto de apertura de juicio oral.
8. **Informe UCO patrimonial**: localizar referencia y fecha exactas →
   `pendiente_primario`.
9. **Cobertura N4**: localizar URL reales de los artículos de El País y
   Vozpópuli sobre la confesión (hoy con `url_canonica: ~`) y archivarlas en
   archive.org (operación del maintainer; NO ejecutar `archive:catchup` desde
   sandbox sin red).
10. **Titularidad vigente del JCI nº 5**: confirmar quién instruye actualmente.
11. **Aforamiento**: verificar si en algún momento hubo cuestión de aforamiento
    (Jordi Pujol fue diputado autonómico/expresident); relevante para la
    competencia AN vs TSJ Cataluña vs TS.

---

## Barrido de actualidad — 2026-05-30 (sesión 2)

**Acceso web funcional en esta sesión.** Barrido cruzado con WebSearch y WebFetch
sobre tres líneas editoriales (elDiario.es, Vozpópuli, El Español) + nota oficial
del CGPJ en poderjudicial.es.

### Qué se verificó y actualizó

**Hitos nuevos creados:**

- `pujol-inicio-vista-oral-2025-11-10` — El juicio oral comenzó el 10 de
  noviembre de 2025. 51 sesiones programadas en San Fernando de Henares.
  Tribunal: presidenta María Riera, ponente María Fernanda García, Carolina Rius.
  Respaldo: nota CGPJ (N1, poderjudicial.es) + elDiario.es (N4).

- `pujol-sobreseimiento-pujol-soley-2026-04-27` — El 27 de abril de 2026 el
  tribunal acordó el sobreseimiento libre de Jordi Pujol Soley (95 años) por
  trastorno neurocognitivo mayor mixto (tipo Alzheimer + vascular) que le impide
  ejercer su derecho de defensa. Auto formal confirmado públicamente el 11 de
  mayo de 2026 por el magistrado presidente José Ricardo de Prada. El juicio
  continúa contra los siete hijos. Respaldo: Vozpópuli (N4) + elDiario.es (N4),
  líneas editoriales distintas, V-13 cumplido.

- `pujol-visto-sentencia-2026-05-14` — El 14 de mayo de 2026 el juicio quedó
  visto para sentencia tras 38 sesiones y más de 200 testigos. Los siete hijos
  no usaron su derecho a la última palabra. Fiscalía mantiene penas de 8-29
  años (máxima para Jordi Pujol Ferrusola: 29 años). Respaldo: El Español (N4)
  + elDiario.es (N4), V-13 cumplido.

**`caso.yaml` actualizado:**
- `sintesis_caso.hechos_clave`: sustituidos los dos últimos (ahora obsoletos)
  por los hitos del juicio oral, sobreseimiento y visto para sentencia.
- `sintesis_caso.estado_actual`: corregido de "a la espera de juicio oral" a la
  situación real (visto para sentencia para los hijos, sobreseimiento para Pujol
  Soley).
- `fase_actual`: actualizado de `juicio_oral` a `sentencia_primera_instancia`.
- `ultima_revision_editorial`: `2026-05-30`.

**Documento huérfano eliminado:**
`content/documentos/auto-procesamiento-familia-pujol.yaml` fue **borrado**.
Motivo: el documento tenía el título "Auto de procesamiento de la familia Pujol
Ferrusola (pendiente de verificar existencia)" y el propio texto del YAML
advertía de que quizá no existía. La búsqueda con WebSearch confirma que en el
procedimiento abreviado (Pujol) el paso procesal equivalente es el "auto de
transformación a procedimiento abreviado" (dictado por José de la Mata el 16 de
julio de 2020 y ya modelado correctamente en `pujol-auto-transformacion-pa-2020`).
El "auto de procesamiento" en sentido estricto es figura del sumario ordinario
(art. 384 y ss. LECrim) y no aplica aquí. El documento era un artefacto sin
base procesal real, no referenciado por ningún hito ni hecho.

### Pendientes resueltos por esta pasada

- ~~Pendiente 4 (auto de procesamiento)~~: confirmado que NO existió; sólo existe
  el auto de transformación a PA ya modelado.
- ~~Pendiente 5 (apertura de juicio oral y estado del juicio)~~: fecha exacta de
  inicio (10-nov-2025) y estado actual (visto para sentencia, 14-may-2026)
  verificados y modelados.

### Pendientes nuevos / abiertos

- **Rol procesal de Jordi Pujol Soley**: debería actualizarse de `investigado`
  a `desimputado` (sobreseimiento libre). Cambio pendiente de revisión humana
  (V-11) y de localizar el auto formal de sobreseimiento libre para añadir
  `hito_fin_id`. Anotar: el sobreseimiento libre extingue la causa respecto de
  él; no es una desimputación ordinaria.
- **Roles de los siete hijos**: técnicamente pasaron de `investigado` a `acusado`
  al iniciarse el juicio oral. Cambio pendiente de revisión humana (¿actualizar
  los 7 RolEnCaso?) porque implica cambiar el badge visual.
- **Auto formal de sobreseimiento libre (N1 o N2)**: no localizado el texto del
  auto en CENDOJ ni en poderjudicial.es en esta pasada. Cuando aparezca,
  reemplazar el respaldo N4 del hito de sobreseimiento por el primario.
- **Fecha exacta de inicio del señalamiento (nota CGPJ)**: la nota del CGPJ
  verificada tiene URL real, pero la fecha exacta del auto de señalamiento del
  tribunal (dentro de oct-nov-2024) sigue como `fecha_precision: dia` con fecha
  del inicio del juicio (10-nov-2025). Verificar si la nota CGPJ tiene fecha de
  publicación explícita para actualizar `fecha_documento` del documento
  `nota-cgpj-inicio-vista-oral-pujol-2025`.
- **`pnpm archive:catchup`**: los 6 documentos N4 nuevos tienen `url_archivo: ~`.
  El maintainer debe ejecutar `pnpm archive:catchup -- --caso=pujol` cuando tenga
  red disponible.

### No modelado en esta pasada (descartado con justificación)

- **Detalles de testigos y peritos durante el juicio**: cobertura de sesiones
  individuales (debates sobre testigos Villarejo/Pino, incidentes procesales)
  no merecen Hito propio; están dentro del hito de vista oral.
- **Infobae / agencias EFE** sobre el señalamiento: republicaciones de nota
  oficial, no añaden línea editorial nueva. Usada la nota CGPJ (N1) como
  primario.

---

## Posibles relaciones con otros casos (propuestas, no escritas)

- `itv-cataluna` — `comparte_persona`: Oriol Pujol Ferrusola, investigado aquí,
  fue condenado en el caso ITV/Tractament de Cataluña (procedimiento distinto).
- `tres-por-ciento-cataluna` — `comparte_trama`/`comparte_organizacion`: ambos
  giran en torno a la presunta financiación irregular vinculada al entorno de
  Convergència; verificar nexo documental antes de afirmarlo.
- `pretoria` — verificar si hay solapamiento de personas/organizaciones (caso
  catalán de corrupción urbanística); NO afirmar sin documento.
