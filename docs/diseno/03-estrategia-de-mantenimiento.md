# Estrategia de mantenimiento

**Estado:** borrador 1.0 · 2026-05-21
**Alcance:** cómo mantener el inventario actualizado sin que sea trabajo a tiempo completo, partiendo de una persona (tú) y con posible apertura a colaboradores.
**Asume:** docs 01-02 cerrados.

---

## 0. Principios de mantenimiento

1. **El maintainer no investiga, valida.** El trabajo manual no debería ser leer prensa todo el día. Debería ser revisar diffs preparados por automatismos y por contribuidores.
2. **El delta es la unidad.** Lo que se actualiza es siempre un cambio incremental: un nuevo Hito, un nuevo `RolEnCaso`, un nuevo Documento, un cambio de fase. NO se reescribe la ficha de un caso desde cero.
3. **La detección la hacen máquinas, la incorporación una persona.** Un sistema automatiza la *señal* (algo ha cambiado en X); el humano confirma y lo incorpora con criterio editorial.
4. **El git log es el changelog público.** Cualquiera puede ver qué cambió, cuándo y con qué justificación (PR description). Parte del producto.
5. **Mantenibilidad > completitud.** Mejor 12 casos vivos bien mantenidos que 60 a medio gas. El MVP comprime alcance hasta que el ritmo es sostenible.

---

## 1. Fuentes de cambio que hay que monitorizar

Tipos de cambio que puede sufrir un caso:

| Cambio | Señal típica | Frecuencia |
|--------|--------------|------------|
| Nueva imputación / desimputación | Auto en CENDOJ o nota CGPJ | semanal-mensual por caso vivo |
| Nueva pieza separada | Auto de separación | irregular |
| Nuevo informe UCO/UDEF | Filtración o publicación parcial | irregular |
| Comparecencia en Comisión | Diario de Sesiones, vídeo Congreso/Senado | conocido con antelación |
| Cambio de juez/ponente | Nota CGPJ | irregular |
| Cambio de fase | Auto judicial | esperable según estado |
| Sentencia | Publicada en CENDOJ | conocida con antelación |
| Cobertura de prensa con efecto procesal | Multi-medio | continua, ruido alto |
| **Aporte humano externo** (periodista, jurista, funcionario, ciudadano informado) | Email entrante a `aportar@presuntamente.org` con pista a fuente, corrección fáctica o idea (ver doc 04 §6bis) | irregular, depende del lanzamiento público y de la tracción |

Fuentes a vigilar, en orden de fiabilidad:

1. **CENDOJ** (`poderjudicial.es`): sentencias y autos publicados. Algunos casos relevantes tardan en aparecer.
2. **Diario de Sesiones del Congreso y Senado**: comparecencias en comisiones. RSS oficial.
3. **CGPJ — Sala de prensa**: notas sobre autos relevantes. RSS oficial.
4. **BOE**: muy raro que algo de un caso aparezca aquí salvo nombramientos.
5. **Tribunal de Cuentas**: informes anuales y específicos. Publicación irregular.
6. **Fiscalía**: notas y dictámenes públicos.
7. **Prensa multi-medio**: Google News, RSS de medios principales, filtros por términos del caso. Ruido alto; sólo señal preliminar.

---

## 2. Pipeline de detección

Propuesta concreta, ejecutable con cron diario y poco código:

1. **Watcher por caso vivo**: para cada `Caso` con `fase_actual ∉ {sentencia_firme, archivo_libre}` y con personas con `RolEnCaso` activo:
   - Búsqueda en CENDOJ por número de procedimiento + apellidos de investigados.
   - Búsqueda en CGPJ Sala de prensa por términos clave (nombre mediático, juez, órgano).
   - Búsqueda en RSS de prensa por términos clave.
2. **Watcher por persona pública** con roles activos: alertas Google News + RSS de medios principales.
3. **Watcher por órgano judicial**: si un caso está en JCI 41, monitorizar publicaciones del juzgado.
4. Cada watcher genera **señales** (no cambios). Una señal: `(caso_id, url_o_documento_candidato, snippet)`.
5. **Aporte humano externo**: segunda boca al mismo embudo. Los aportes que entran por `aportar@presuntamente.org` (ver doc 04 §6bis) producen señales del mismo tipo, simplemente con el productor distinto — una persona en vez de un cron. El maintainer las vuelca a `content/aportes/YYYY-MM-DD-<slug>.md` y el agente las procesa con la skill `/incorporar-aporte` siguiendo el pipeline de incorporación de §3.

Las señales se escriben en una **bandeja de entrada** (issue tagged `signal`, o fichero `signals.yaml` en una rama de trabajo). Una vez al día, el maintainer abre la bandeja, descarta ruido, y para las señales reales prepara incorporaciones.

---

## 3. Pipeline de incorporación

Cuando una señal sobrevive al filtro:

1. Maintainer (o colaborador) abre **rama** desde main.
2. Crea nuevo `Documento` (YAML) con el documento fuente (PDF descargado si es público, hash, URL canónica + archivo).
3. Crea nuevo `Hito` asociado al caso, vinculado al Documento.
4. Si el Hito introduce o modifica Hechos: crea/modifica las entidades `Hecho` correspondientes, manteniendo el principio de no borrar (corrección por `corregido_por`, no por edit destructivo).
5. Si el Hito implica nuevo `RolEnCaso` (imputación, desimputación, sentencia): crea/cierra el rol.
6. Actualiza `Caso.fase_actual` y `Caso.ultima_revision_editorial`.
7. Abre PR con descripción que cite la señal original y argumente la incorporación.
8. CI ejecuta validaciones del doc 01 (V-01 a V-21).
9. Otro revisor (o el propio maintainer en MVP) hace merge.
10. El build publica el sitio.

**Tiempo objetivo por incorporación rutinaria:** 10-20 minutos. Casos complejos (nueva pieza separada con varios investigados): 1-2 horas.

---

## 4. Uso de LLM para diffs revisables

Aquí está la palanca para mantener el ritmo. El maintainer NO escribe los YAML desde cero. Un LLM puede:

1. **Extraer** de un PDF de auto judicial los campos relevantes: fecha, juez, personas afectadas, tipo de Hito propuesto, delitos atribuidos, párrafos citables (con número de página).
2. **Proponer un PR** con el YAML del nuevo Hito, los Hechos derivados, y los cambios en `RolEnCaso` afectados, como diff sobre el repo.
3. **Justificar** cada campo con cita textual del documento original (página, párrafo).

El maintainer revisa el diff y aprueba o ajusta. Esto reduce el trabajo de "leer auto y traducir a YAML" de horas a minutos.

**Guardarraíles para uso de LLM:**

- El LLM **nunca** asigna `tipo = acreditado` a un Hecho directamente; sólo `investigado`, `atribuido` o `no_concluyente`. Acreditar requiere review humano explícito.
- Si el LLM no encuentra un dato exacto, deja el campo vacío con marca `// LLM-incierto: razón`. No inventa.
- El nivel de fuente del Documento extraído lo propone el LLM, pero la lista blanca de dominios oficiales (V-12) lo valida en CI.
- El LLM no toca enunciados publicados; sólo propone nuevos o cambios marcados.
- En zonas sensibles (descripciones de delitos atribuidos, identificación de personas privadas), el LLM marca explícitamente que requieren review especial.

Modelos candidatos: cualquier Claude con contexto largo. La elección no condiciona el modelo de datos.

---

## 5. Ritmo de revisión

| Tipo | Frecuencia | Qué se hace |
|------|------------|-------------|
| Diaria | 5-15 min | Revisar bandeja de señales, descartar ruido, identificar señales reales |
| Por caso vivo | mensual | Revisar fichas en `fase_actual ≠ archivo/firme`, validar consistencia con último hito |
| Por caso firme | trimestral | Revisar fichas en fase firme o archivo, comprobar que no hay desarrollos posteriores |
| V-17 mensual | mensual | Revisar personas privadas con todos sus `RolEnCaso` cerrados → decidir anonimización o retirada |
| Editorial anual | anual | Revisar línea editorial, enunciados publicados, detectar drift de tono, recalibrar la guía |

**Total estimado de tiempo del maintainer en régimen estable (≈12 casos vivos):** 3-5 horas/semana.

---

## 6. Panel de admin / dashboard

Vista interna (behind basic auth) para el maintainer:

- **Bandeja de señales** pendientes.
- **Casos por revisar** (con `ultima_revision_editorial` más antigua, en fase activa).
- **Personas en V-17 pendiente** de anonimización.
- **PRs abiertos** y estado de CI.
- **Validaciones rotas** en main (no debería pasar, pero si pasa, aviso).
- **Estadísticas básicas**: casos por fase, número de Hechos por nivel de fuente, tasa de incorporaciones por mes.

Página interna estática del propio sitio, generada en build, protegida por basic auth a nivel CDN (Cloudflare Pages access rules o equivalente).

---

## 7. Cuando algo se rompe o se cuestiona

| Incidente | Respuesta |
|-----------|-----------|
| Querella o burofax al maintainer | Procedimiento legal específico (doc 04 §10) |
| Rectificación legítima vía issue | Atender en plazo definido (7 días para casos vivos, 21 para firmes) |
| Cambio en sentencia firme (revisión TC, recurso amparo) | Crear Hito, marcar Hechos como superados con `corregido_por`, NO borrar |
| Archivo o sentencia absolutoria | Marcar fase, marcar Hechos investigados como `superado` corregidos por exculpatorios, cerrar `RolEnCaso` investigado con `hito_fin` apuntando al archivo |
| PR vandálico de colaborador | CI bloquea por validaciones; review humano rechaza |
| Bug en CI que deja main inválido | Revertir merge ofensivo; hot fix |

---

## 8. Métricas a vigilar

- **Latencia de incorporación**: desde que ocurre un hito procesal público hasta que está en la ficha. Objetivo: < 7 días para hechos relevantes.
- **% Hechos con Nivel 1-2 sobre total**: indicador de rigor de fuentes.
- **Backlog de bandeja de señales**: si crece sin tope, el sistema está enfermo.
- **Casos con `ultima_revision_editorial` > 90 días**: alerta.
- **Rectificaciones aceptadas / total**: salud del feedback loop con el público.

---

## 9. Cuestiones abiertas

1. **Watchers en código propio o herramientas existentes** (Feedly, IFTTT, scripts cron). Propuesta: cron + scripts en repo, simple, auditable.
2. **Hosting del panel de admin** dentro del mismo sitio (con basic auth) o aparte. Propuesta: mismo repo, behind auth.
3. **Quién accede al panel de admin** además del maintainer. CODEOWNERS de áreas concretas con permiso de lectura.
4. **Traducciones a lenguas cooficiales** si se aceptan: workflow distinto, requiere revisor por lengua. Aplazado.
5. **Política de retención de datos personales** tras anonimización V-17. ¿Se mantiene la entrada con identificadores reemplazados, o se elimina por completo? Borderline LOPD; decidir en doc 04.

---

## 10. Siguiente paso

Doc 04 — Riesgos legales y éticos.
