---
name: promover-caso
description: Emite un veredicto reproducible sobre si un Caso del inventario presuntamente.org puede transicionar de un estado_publicacion al siguiente (pendiente → borrador → beta_publica → en_revision → publicado). Aplica un rubro de criterios OBJETIVOS y verificables por un agente sin conocimiento previo del caso, validados por un PANEL de varios agentes independientes que deben coincidir. El maintainer NO revisa el contenido del caso: sólo autoriza la acción de cambiar el estado cuando el veredicto es VERDE. Trigger cuando el usuario pide "¿puede X pasar a beta?", "promueve el caso Y", "qué casos están listos para publicar", "veredicto de promoción de Z", o invoca /promover-caso <slug|--todos> [--a beta_publica|en_revision|publicado].
---

# Skill `promover-caso` — v0

## Por qué existe (lee esto antes que nada)

El proyecto tenía una **contradicción de diseño** sin resolver:

- `AGENTS.md` define al maintainer como **reviewer editorial** ("lee diffs, detecta hallazgos, aprueba").
- El mismo `AGENTS.md` dice que el maintainer **NO aporta conocimiento editorial del caso** ("no sabe quiénes están procesados, qué fuentes existen…").
- El doc 06 remata: *"La promoción entre estados es decisión editorial del maintainer, no automática."*

Es incoherente: no se puede pedir un juicio editorial a quien (correctamente) no tiene el conocimiento del caso. **El maintainer es developer, no periodista de investigación, y no debe revisar el contenido.**

Esta skill resuelve la contradicción separando dos cosas:

1. **El veredicto editorial** lo emite un **panel de agentes** aplicando un rubro objetivo. Es el "CI verde".
2. **La autorización de la acción** la da el maintainer: aprieta el botón sobre un semáforo, **sin leer el caso**. Es el "aprobar el release porque el CI está verde".

Decisión del maintainer (2026-05-30): **el agente dicta el veredicto, el maintainer autoriza la acción** (no automático: un humano sigue en el lazo antes de publicar contenido sobre personas acusadas) · **panel de varios agentes que deben coincidir** (no un solo juez).

Esta skill emite el veredicto y, **sólo si el maintainer autoriza**, aplica el cambio de `estado_publicacion`. Nunca publica sola.

## Inputs aceptados

- `/promover-caso --cola` — **modo por defecto recomendado**. Procesa la **cola de candidatos**: sólo los casos cuyo `caso.yaml` tiene un bloque `promocion_propuesta` con `estado: propuesta` (la bandera que dejan las skills de contenido). No reescanea todo el inventario. **Es lo que escala a 500 casos.**
- `/promover-caso <slug>` — evalúa un caso concreto, infiere la transición objetivo (el siguiente estado a partir del actual), haya o no propuesta.
- `/promover-caso <slug> --a beta_publica|en_revision|publicado` — evalúa contra un destino explícito.
- `/promover-caso --todos` — evalúa **todos** los casos con contenido (barrido completo, caro). Úsalo de vez en cuando como red de seguridad; el día a día es `--cola`.
- Si el slug no existe en `content/casos/`, error y stop.

### La cola de candidatos (`promocion_propuesta`)

Las skills de contenido (`investigar-caso`, `actualizar-caso`, `incorporar-hito`, `documentar-vinculos`, `revisar-caso`), al terminar su trabajo sobre un caso, **dejan una bandera** en `caso.yaml` si creen que el caso merece subir de estado:

```yaml
estado_publicacion: borrador
promocion_propuesta:
  estado_propuesto: beta_publica
  propuesto_por: investigar-caso
  fecha: "2026-05-30"
  razon: "Modelado completo: 5 hitos con N1, 6 hechos trazados, 0 verbos prohibidos."
  estado: propuesta            # propuesta | rechazada
```

Esto es una **cola de pull**: el autor del contenido propone (con una razón muy concisa, no una auditoría), y `/promover-caso` es quien **verifica y decide**. Ventajas: cada skill escribe sólo en el `caso.yaml` que ya está tocando (sin fichero-índice central caliente → cero colisiones entre agentes paralelos), y el promotor sólo evalúa lo propuesto en vez de los 500 casos cada vez.

Para **listar la cola** sin evaluarla aún: `grep -rl "promocion_propuesta:" content/casos/*/caso.yaml` y filtrar los que tengan `estado: propuesta`.

## Modelo de estados (canon)

Enum `estado_publicacion` (ver [doc 01 — "Enums y catálogos"](../../../docs/diseno/01-modelo-de-datos.md#enums-y-catálogos) y [doc 06 — "Estados de ciclo de vida por ficha de caso"](../../../docs/diseno/06-roadmap-por-fases.md#estados-de-ciclo-de-vida-por-ficha-de-caso)):

`pendiente` → `borrador` → `beta_publica` → `en_revision` → `publicado` (+ `retirado_temporalmente` / `retirado_definitivamente`).

Visibilidad pública: `pendiente` y `borrador` NO generan ruta en producción (fila gris en `/casos`). `beta_publica`, `en_revision` y `publicado` SÍ son accesibles. **Cruzar a `beta_publica` es el salto crítico: es cuando el caso se hace público.**

Recordatorio: `estado_publicacion` (etiqueta global, lo que mueve esta skill) ≠ `estado_ficha` (checklist de 10 chequeos, información complementaria). Ver [`estado-ficha-caso.md`](../../../docs/web/features/estado-ficha-caso.md).

## El rubro de transición (criterios objetivos)

Cada criterio es **verificable por un agente sin conocer el caso**: o es mecánico (`pnpm validate`), o es una regla escrita que se comprueba leyendo los YAML y las fuentes citadas. Ningún criterio exige que el evaluador sepa de antemano quién está procesado.

### Puerta A — `pendiente`/`borrador` → `beta_publica` (hacerse público)

Todos obligatorios. Cualquier fallo ⇒ veredicto ROJO.

- **A1 · Validación mecánica.** `pnpm validate` termina con 0 errores. (Reproducible, no opinable.)
- **A2 · Cero BLOQUEANTES.** Una pasada de `/revisar-caso <slug>` no devuelve ningún hallazgo `BLOQUEANTE` (las `SUGERENCIA` no bloquean beta).
- **A3 · Trazabilidad (V-12 + V-13).** Toda referencia por slug resuelve (persona/org/documento/delito existen). V-13 canónico ([doc 01 — V-13](../../../docs/diseno/01-modelo-de-datos.md)): un `Documento` `articulo_prensa` no puede ser soporte **único** de un `Hecho` `acreditado` o `investigado`; **sí** puede serlo de un `Hecho` `atribuido` o como cita adicional. Por tanto el requisito de ≥2 líneas editoriales distintas (EFE/Europa Press = una sola) aplica **solo a hechos `acreditado`/`investigado` con N4**; un `atribuido` con una única fuente N4 es válido (refinado 2026-05-31, v0.1, tras falso positivo en palau-musica).
- **A4 · Presunción de inocencia (CH1, CH2, CH10).** Sin verbos prohibidos en hechos no acreditados; sin lenguaje activo afirmativo de culpabilidad sobre personas sin condena firme; sin biografías que afirmen condena firme sin Documento que la respalde.
- **A5 · Sin exposición indebida (CH4 + V-17).** Ninguna persona privada **sin ningún rol formal en el procedimiento** aparece nombrada en la **prosa propia del proyecto** (enunciados, síntesis, `importe_nota`, resúmenes de cobertura). Dos matices fijados el 2026-05-31 (v0.1, a raíz del lote noos/malaya/palau/tarjetas): (a) quien **sí fue parte formal** (acusado, absuelto, condenado o responsable civil declarado en sentencia firme) es **nombrable** aunque aún no tenga ficha `Persona`/`Rol` modelada — esa ausencia es **laguna de completitud**, que se declara honestamente en `estado_ficha.roles_procesales: parcial`, no exposición indebida; (b) las **citas literales** (campo `pasaje`) de resoluciones públicas se reproducen **fieles**, incluidos los nombres de partes formales: alterar una cita sería peor que reproducirla. Solo bloquea nombrar, en prosa propia, a un tercero privado sin ningún rol formal.
- **A6 · Mínimos de contenido.** `caso.yaml` tiene `sintesis_caso` completa (`que_se_investiga` + `hechos_clave` + `estado_actual`), `descripcion_corta`, `fase_actual`, `organo_judicial_id`, `delitos_atribuidos_en_la_causa`; y el caso tiene ≥2 hitos, ≥2 hechos y ≥1 rol con condición formal. (Umbrales orientativos; ajustar con la experiencia.)
- **A7 · Coherencia factual del estado.** `sintesis_caso.estado_actual` y `fase_actual` no se contradicen con el último Hito catalogado ni con la cobertura del propio caso (el patrón "pujol decía 'a la espera de juicio' con el juicio ya celebrado" es el fallo a cazar).
- **A8 · `estado_ficha` presente y honesto.** El objeto `estado_ficha` existe con sus 10 chequeos; un chequeo en `pendiente`/`parcial` NO bloquea beta (beta admite huecos declarados), pero un chequeo marcado `completo` que sea verificablemente falso (p. ej. `cobertura_mediatica_general: completo` sin fichero de cobertura) SÍ bloquea: es deshonesto.

### Puerta B — `beta_publica` → `en_revision`

- Todo lo de la Puerta A sigue cumpliéndose.
- **B1 · Cero SUGERENCIAS sin atender** de `/revisar-caso`, o cada una justificada en `NOTES.md` como aceptada conscientemente.
- **B2 · Documentos primarios.** Los hitos jurisdiccionales clave (sentencias, autos de procesamiento, aperturas de juicio) tienen documento N1-N2, o están anotados como `pendiente_primario` en `NOTES.md` con razón estructural (p. ej. auto de instrucción ordinaria no publicado en CENDOJ).
- **B3 · `estado_ficha`** sin chequeos en `pendiente` salvo los que dependan de features transversales del producto aún no entregadas (esos pueden quedar `pendiente` sin bloquear, ver nota de `estado-ficha-caso.md` línea 110).

### Puerta C — `en_revision` → `publicado`

- Todo lo de las Puertas A y B.
- **C1 · Hechos firmes promovidos.** Donde haya sentencia **firme** y el documento N1 lo respalde con cita literal, los hechos correspondientes están en `tipo: acreditado` (decisión V-04 ya tomada). Si quedan candidatos a `acreditado` sin promover, deben estar justificados en `NOTES.md` (p. ej. firmeza matizada por el TC, como ERE).
- **C2 · Sin `pendiente_primario` abierto** sobre un documento que es jurisdiccionalmente esencial para una afirmación `acreditado`.
- **C3 · `estado_ficha`** con `revision_editorial: completo` y el resto en `completo`/`no_aplica` (salvo features transversales no entregadas).

> Estos umbrales son v0. La skill se moldea con la experiencia ([AGENTS.md → "Skills locales"](../../../AGENTS.md#skills-locales-agentsskills)): si un criterio produce falsos positivos/negativos repetidos, se ajusta y se documenta en `## Histórico`.

## Proceso

### 0. (Modo `--cola`) Construir la lista de candidatos

Si se invocó `--cola`: localiza los casos con propuesta abierta — `grep -rl "promocion_propuesta:" content/casos/*/caso.yaml`, y de ésos quédate con los que tengan `estado: propuesta` (ignora `rechazada`). Para cada uno, la transición a evaluar es la de su `estado_propuesto`. Si la cola está vacía, dilo y termina. Procesa los candidatos en pipeline (paso 1→3 por cada uno) y al final agrega una tabla-resumen.

### 1. Resolver caso y transición

Lee `content/casos/<slug>/caso.yaml`, extrae `estado_publicacion` actual. Determina la **puerta aplicable**:
- actual `pendiente`/`borrador` → Puerta A (destino `beta_publica`).
- actual `beta_publica` → Puerta B (destino `en_revision`).
- actual `en_revision` → Puerta C (destino `publicado`).
- Si hay `promocion_propuesta`, su `estado_propuesto` indica el destino que pidió el autor: evalúa contra él. Si el usuario pasó `--a <estado>`, evalúa todas las puertas intermedias hasta ese destino (para subir dos escalones deben cumplirse las dos puertas).
- **La propuesta orienta, no manda.** El panel verifica el rubro igual: una `razon` optimista en la bandera no exime de cumplir los criterios.

### 2. Panel de evaluación (varios agentes que deben coincidir)

Lanza un **panel de N agentes evaluadores independientes** (sub-agentes, modelo Sonnet). N por defecto = 3. Cada uno recibe **el mismo contrato cerrado**: el slug, la puerta aplicable con su lista de criterios, y la instrucción de devolver, **por cada criterio**, un veredicto `PASA` / `FALLA` / `DUDA` con la evidencia concreta (ruta de fichero + cita textual del problema). Cada agente trabaja **sin ver el veredicto de los demás** (evaluación ciega → coincidencia significativa).

Reglas de agregación:
- Un criterio **PASA** sólo si **la mayoría** de los agentes lo marca `PASA` y **ninguno** lo marca `FALLA` con evidencia verificable. Un `FALLA` con cita concreta de un solo agente baja el criterio a revisión: el orquestador relee el fichero citado y arbitra.
- **DUDA** de la mayoría en un criterio ⇒ el criterio NO pasa (en la duda, no se promueve: es contenido sobre personas acusadas).
- El **veredicto global** es VERDE sólo si **todos** los criterios de la puerta pasan. Si cualquiera falla ⇒ ROJO, con la lista de criterios fallados y su evidencia.

Para `--todos`, ejecuta el panel por caso en pipeline y agrega una tabla.

### 3. Veredicto

Devuelve al maintainer, en lenguaje claro y sin jerga del caso:

- **Semáforo**: 🟢 VERDE (listo para `<destino>`) / 🔴 ROJO (no listo).
- Si ROJO: **lista de criterios fallados**, cada uno con (a) qué criterio, (b) fichero + cita del problema, (c) qué habría que hacer para arreglarlo y con qué skill (`/actualizar-caso`, `/incorporar-hito`, etc.). El maintainer no necesita entender el caso: necesita saber qué skill lanzar.
- Si VERDE: el cambio exacto que se aplicaría (`estado_publicacion: <actual>` → `<destino>` en `content/casos/<slug>/caso.yaml`, + `estado_ficha.fecha_actualizacion` y `ultima_revision_editorial` a hoy), y el resumen de en qué se basó el panel (cuántos agentes, coincidencia).

### 4. Autorización y aplicación

**NO cambies el estado hasta que el maintainer lo autorice explícitamente.** Pregunta: *"El panel da VERDE para subir <slug> a <destino>. ¿Autorizas el cambio?"* (`AskUserQuestion` con opciones Sí / No / Ver evidencia).

- Si autoriza ⇒ edita `estado_publicacion` (+ `estado_ficha.fecha_actualizacion` y `ultima_revision_editorial` a hoy) en el `caso.yaml`, **elimina el bloque `promocion_propuesta`** (la propuesta queda resuelta), corre `pnpm validate`, y reporta. **No `git add`/`commit`/`push`** (norma de AGENTS.md): el commit lo decide el maintainer al cierre.
- Si no autoriza ⇒ no toca el estado; deja el veredicto por escrito.

**Gestión de la bandera según el veredicto** (para que la cola no se reproponga en bucle):
- **VERDE + autorizado** ⇒ sube el estado y **borra** `promocion_propuesta`.
- **VERDE + no autorizado por el maintainer** ⇒ deja `promocion_propuesta` como está (sigue en cola para otra ocasión).
- **ROJO** ⇒ marca la propuesta como resuelta-negativa en el propio `caso.yaml`: `promocion_propuesta.estado: rechazada` + `nota_resolucion: "<qué criterios fallaron, muy conciso>"`. Así la próxima skill de contenido ve que ya se evaluó y qué falta antes de reproponer, en vez de volver a dejar la misma bandera. La razón ROJA detallada (con evidencia) va al reporte para el maintainer y, si procede, al `NOTES.md` del caso.

El maintainer **autoriza la acción**, no certifica el contenido. La responsabilidad editorial recae en el rubro + el panel, que son reproducibles y auditables.

## Guardarraíles obligatorios

1. **El maintainer nunca revisa el caso.** No le pidas que valide fuentes, lenguaje ni roles. Si te falta criterio, es fallo del rubro o del panel, no del maintainer: anótalo para refinar la skill.
2. **En la duda, no se promueve.** Es contenido sobre personas acusadas: un falso VERDE publica algo que no debía. El coste de un falso ROJO (un caso tarda más en publicarse) es mucho menor.
3. **Panel ciego e independiente.** Los evaluadores no comparten contexto entre sí; si no, la coincidencia no vale como señal.
4. **El veredicto cita evidencia, no opina.** Cada FALLA debe apuntar a fichero + texto concreto. Sin evidencia localizable, no es un FALLA válido.
5. **Nunca promueve a `publicado` un caso con un candidato a `acreditado` sin resolver** salvo justificación explícita en `NOTES.md` (firmeza matizada, primario pendiente).
6. **No `git add`/`commit`/`push`.** Sólo edita el working tree tras autorización.
7. **Degradar también es válido.** Si el panel encuentra que un caso `beta_publica` ya público incumple la Puerta A (p. ej. quedó factualmente obsoleto), el veredicto puede recomendar **bajar** el estado o retirar; eso también lo autoriza el maintainer.

## Relación con otras skills

- **`/revisar-caso`** es el motor del criterio A2/B1: el rubro lo consume, no lo reemplaza. `revisar-caso` audita; `promover-caso` decide la transición a partir de esa auditoría + el resto del rubro.
- **`/actualizar-caso`**, **`/incorporar-hito`**, **`/documentar-vinculos`**: son las herramientas que el maintainer lanza para arreglar lo que el veredicto ROJO señale.
- El rubro de esta skill debería bajarse a canon en [doc 06](../../../docs/diseno/06-roadmap-por-fases.md) cuando se estabilice (hoy el doc 06 dice "decisión del maintainer, no automática"; esta skill lo concreta en "veredicto del panel + autorización del maintainer").

## Iteración

Tras cada uso real, añadir a `## Histórico`:
- Slug y transición evaluada.
- Veredicto y si el maintainer lo autorizó.
- **Falsos positivos** (panel dio VERDE y luego hubo que retirar) y **falsos negativos** (ROJO por un criterio mal calibrado). Ajustar umbrales A6, lista de criterios, o N del panel en consecuencia.

## Histórico

**2026-05-31 · `gurtel` (borrador → beta_publica) · primer uso real.** Panel de 3 Sonnet ciegos: **3/3 VERDE unánime**, coincidencia incluso en el razonamiento fino (uso correcto de `tipo: atribuido` para penas N4; ausencia de N4-efectivo; estado_ficha honesto). Maintainer **autorizó** → subido a `beta_publica`. Sin falsos positivos.

**2026-05-31 · lote `noos`/`malaya`/`palau-musica`/`tarjetas-black` (borrador → beta_publica) · 3 pasadas.**
- **1ª pasada: 4/4 ROJO**, todos true positives con evidencia fichero+línea (estado_ficha deshonesto, cifra N4 como firme, nivel de fuente mal etiquetado, placeholder y fechas erróneas en campos públicos). Arreglos aplicados (5 sub-agentes Sonnet).
- **2ª pasada: 4/4 ROJO de nuevo** — el residuo vivía en **ficheros laterales que la 1ª no citó** (ficha de persona, fichero de cobertura, hechos/roles secundarios, citas literales). Arreglos exhaustivos.
- **3ª pasada: `noos` VERDE**; los otros 3 con bugs reales restantes → arreglados.
- **Aprendizajes clave:**
  1. **Los arreglos deben ser exhaustivos por caso** (grep de TODOS los ficheros del caso + entidades relacionadas), no solo el fichero que cita el panel. El residuo de la tanda está disperso.
  2. **Falsos positivos del rubro v0 corregidos → v0.1** (no era el panel fallando, era el rubro tosco): **A5** (citas literales `pasaje` se reproducen fieles; partes formales aún no modeladas = laguna de completitud declarada en `roles_procesales: parcial`, no exposición indebida) y **A3** (V-13 canónico — doc 01 — exime a `atribuido`: una sola fuente N4 es válida para `atribuido`). Ambos refinamientos ya aplicados en el rubro de arriba.
  3. **Hallazgo sistémico** que el panel destapó: comentarios `# LLM-incierto` dentro de bloques YAML se renderizan en el sitio público → documentado en [`ROADMAP.md`](../../../ROADMAP.md) ("Fugas de comentarios internos"), pendiente de sesión dedicada.
- **Falsos negativos:** ninguno detectado.
- **Coste:** ~830k tokens/pasada (12 sub-agentes Sonnet). El panel **justifica su coste**: cazó defectos reales que una revisión humana a ojo no vería.

**Validación del diseño:** el mecanismo funciona de punta a punta — panel ciego reproducible + agregación determinista + autorización del maintainer sin leer contenido. Pendiente: re-panel de confirmación de malaya/palau/tarjetas; panel sobre los 8 borradores restantes; estrenar el modo `--cola` cuando las skills de contenido dejen banderas `promocion_propuesta`.
