---
name: rastrear-cobertura
description: Rastrea la cobertura mediática general de un caso del inventario presuntamente.org. Construye un corpus separado de noticias publicadas sobre el caso (no de Documentos que respaldan Hechos) con metodología explícita, deduplicación, archivado en archive.org y clasificación por tipo de pieza. Trigger cuando el usuario pide "rastrea la cobertura mediática de <caso>", "analiza la cobertura pública de <caso>", "muestreo de prensa sobre <caso>" o invoca `/rastrear-cobertura <slug>`. Pensada para correr en sub-agente paralelo a la sesión principal, en un git worktree dedicado.
---

# Skill `rastrear-cobertura` — v1

## Propósito

Producir un corpus de cobertura mediática general sobre un caso, **separado** del corpus de Documentos que respaldan Hechos. La cobertura general mide cómo se ha hablado públicamente del caso; los Documentos N4 que sostienen Hechos son lo que presuntamente.org cita para fundamentar afirmaciones. Mezclar ambos infla artificialmente la biblioteca probatoria y confunde al lector.

La feature canónica está descrita en [`docs/web/features/cobertura-mediatica-general.md`](../../../docs/web/features/cobertura-mediatica-general.md). El schema mecánico está en [`schemas/cobertura-mediatica.schema.json`](../../../schemas/cobertura-mediatica.schema.json).

**No es "buscar todas las noticias".** Es un muestreo sistemático con metodología declarada, deduplicado, archivado y trazable. "Todas" es una promesa peligrosa.

## Inputs aceptados

- Slug de un caso ya fichado en `content/casos/<slug>/`. Ej. `/rastrear-cobertura begona-gomez`.
- Si no se pasa argumento, listar los casos disponibles y preguntar cuál rastrear.
- Si el slug no existe en `content/casos/`, error claro (no inventar).

## Proceso

### 0. Preflight obligatorio de directorio

Antes de leer o escribir cualquier archivo, validar el directorio real de trabajo:

1. Ejecutar `pwd` y confirmar que apunta al worktree esperado para la sesión.
2. Ejecutar `git rev-parse --show-toplevel` y comprobar que coincide con ese worktree, no con la working copy principal salvo que el maintainer haya pedido expresamente trabajar ahí.
3. Ejecutar `git status --short` para detectar cambios ajenos antes de tocar rutas calientes.

Si el CWD no coincide con el worktree de la sesión, parar y corregirlo antes de continuar. Aprendizaje incorporado tras la primera pasada real: el agente `cobertura-bg` trabajó íntegramente en el working tree principal por error.

### 1. Lectura del caso para anclar metodología

Leer `content/casos/<slug>/caso.yaml`:

- `nombre_oficial`, `nombre_mediatico`, `nombres_alternativos[]` — base de los `terminos_busqueda`.
- `fecha_apertura`, hito más antiguo y más reciente — base de las `ventanas_temporales`.
- `sintesis_caso.hechos_clave[]` — pistas para términos secundarios.

Leer `NOTES.md` por si hay aliases o pistas adicionales.

### 2. Diseño del rastreo (publicado en metodología)

Antes de buscar, declarar:

- **Términos canónicos**: nombre mediático + entre 1 y 4 aliases (nombre del órgano judicial, número del procedimiento, apodo de la trama, nombre del instructor si es referenciado en prensa, persona principal investigada).
- **Ventanas temporales**: una o más, con `desde` y opcional `hasta`. Empezar por la apertura del caso. Si el caso es vivo y largo, partir en bloques de 6-12 meses.
- **Fuentes buscadas**: 6-10 medios cubriendo líneas editoriales distintas. Como base de referencia para casos nacionales en España, los puntos siguientes son sólo guía operativa, no clasificación editorial cerrada:
  - Diarios generalistas con web abierta: `elpais.com`, `elmundo.es`, `abc.es`, `lavanguardia.com`.
  - Nativos digitales: `eldiario.es`, `infolibre.es`, `theobjective.com`, `okdiario.com`, `vozpopuli.com`, `elconfidencial.com`, `elespanol.com`.
  - Medios públicos: `rtve.es`.
  - Agencias: `efe.com`, `europapress.es`.
  - Medios autonómicos relevantes cuando aplique.
- **Criterios de inclusión**: ¿se incluye sólo pieza con mención en titular/lead, o también mención de pasada? Declararlo.
- **Criterios de exclusión**: ¿se incluyen columnas de opinión? ¿editoriales? ¿republicaciones de agencia idéntica? Declararlo.

### 3. Búsqueda y recogida

Para cada combinación término × ventana × fuente, usar `WebSearch` con `site:` y rango de fechas cuando esté disponible. Para cada hit, abrir con `WebFetch` para recoger: URL, medio, titular, fecha de publicación, autor (si firma), 1-3 frases de resumen.

**Verbos prohibidos del P-09 vetados en `resumen`.** El resumen es neutro: "El medio publica el contenido del auto …", "Pieza que repasa la cronología…", "Entrevista al instructor…". No reescribir el titular en el resumen (el titular ya queda literal en su propio campo).

### 4. Deduplicación

Marcar `pieza_referenciada_id` en piezas derivadas/sindicadas/idénticas dentro del propio corpus. Mantener una entrada por instancia de publicación pero declarar la relación. Si la republicación es palabra por palabra (suelto de agencia replicado), marcar `tipo_pieza: pieza_agencia` en todas las copias y vincular `pieza_referenciada_id` a la del medio que firma originalmente.

### 5. Archivado

Cada noticia incluida exige `url_archivo` en `web.archive.org` (mismo principio V-13). Si la URL no responde al archivado anónimo de archive.org, dejarlo vacío y anotar en `notas` del item; **no inventar URL**.

### 6. Tipificación

Para cada pieza, asignar `tipo_pieza`:

- `noticia` — pieza informativa estándar.
- `reportaje` — pieza larga con investigación o cobertura ampliada.
- `entrevista` — formato Q&A.
- `analisis` — pieza interpretativa firmada por periodista.
- `editorial` — posición institucional del medio, sin firma personal.
- `opinion` — pieza firmada externa al staff editorial.
- `columna` — pieza firmada del staff editorial (columnistas regulares).
- `pieza_agencia` — copia de agencia (EFE, Europa Press) republicada.
- `suelto` — breve de menos de 200 palabras.
- `tv_radio` — pieza de televisión o radio (puede no tener URL textual).
- `investigacion_periodistica` — investigación con valor probatorio propio (que normalmente acabará también como `Documento` N4 si presuntamente.org cita la pieza).

Y `relevancia_editorial`:

- `capital` — exclusiva, primera ruptura factual, portada papel/digital prominente.
- `alta` — pieza propia con desarrollo.
- `media` — pieza derivada, agencia ampliada, cobertura habitual.
- `baja` — suelto, mención lateral, agencia replicada.

### 7. Edición del YAML

Una entrada por caso: `content/cobertura-mediatica/<slug-caso>.yaml`. Si ya existe del rastreo anterior, **actualizar** sin perder lo previo (mantener IDs estables, añadir nuevas noticias al array). Estructura completa en el schema canónico.

### 8. Actualización del `estado_ficha`

Al cerrar la pasada:

- Editar `content/casos/<slug>/caso.yaml` campo `estado_ficha.cobertura_mediatica_general`:
  - `completo`: corpus actualizado a fecha y revisado.
  - `parcial`: una o más ventanas temporales aún no cubiertas (anotar en `notas`).
  - `pendiente`: trabajo aún no comenzado para este caso.
  - `no_aplica`: el caso es tan poco mediático que no tiene cobertura general analizable (justificar en `notas`).
- Actualizar `estado_ficha.fecha_actualizacion` a hoy.

### 9. Output

Informe en markdown impreso al final del turno:

```markdown
# Cobertura mediática general — caso `<slug>`

Fecha: YYYY-MM-DD
Skill: rastrear-cobertura v1
Material: <N> noticias recogidas, <N> medios cubiertos, <N> ventanas temporales.

## Metodología declarada

- Términos: ...
- Ventanas: ...
- Fuentes buscadas: ...

## Distribución por tipo de pieza

- noticia: N
- reportaje: N
- ...

## Distribución por medio

- elpais.com: N
- ...

## Picos detectados

- YYYY-MM-DD a YYYY-MM-DD — explicación del pico (auto X, sentencia Y).
- ...

## Limitaciones del rastreo

- ...

## Estado de la ficha tras la pasada

- `cobertura_mediatica_general`: <nuevo estado>.
```

## Guardarraíles editoriales

1. **Corpus separado del corpus probatorio.** Los Documentos que respaldan Hechos siguen en `content/documentos/`. La cobertura general vive en `content/cobertura-mediatica/`. No mezclar.
2. **Sin archivado en archive.org, no entra.** Mismo principio V-13. Excepción: piezas tras paywall duro que archive.org no captura; anotar limitación en `notas` y discutirlo con el maintainer antes de incluir.
3. **Resumen neutral.** Verbos prohibidos del P-09 vetados. No reescribir el titular.
4. **No inventar URL ni fecha.** Si `WebFetch` no resuelve, anotar y omitir.
5. **No clasificar orientación editorial del medio en este corpus.** La clasificación de medios es decisión sensible que vive (cuando exista) en `Organizacion.orientacion_editorial`, fuera del scope de esta skill. Hoy esta skill sólo registra `medio_id`.
6. **No usar la cobertura mediática para inferir hechos.** Si el corpus revela un hecho relevante no modelado todavía, anotar en `NOTES.md` del caso para que la sesión principal lo evalúe con la skill `/incorporar-hito` o `/investigar-caso`.
7. **Republicaciones de agencia marcadas explícitamente.** No inflar el conteo confundiendo 12 copias de un suelto EFE con 12 piezas independientes.

## Operativa multiagéntica

Esta skill está pensada para correr en **sub-agente paralelo** lanzado por el maintainer en un `git worktree` aislado. El sub-agente:

1. Abre sesión propia en `.git/agents/sessions/<timestamp>-rastrear-cobertura-<caso>/`.
2. Valida CWD y toplevel de git antes de escribir nada. Si está en la working copy principal por accidente, corrige directorio o pide intervención.
3. Trabaja sólo en `content/cobertura-mediatica/<caso>.yaml`, en `content/organizaciones/<medio>.yaml` que cree (nuevos medios de comunicación), y en `content/casos/<slug>/caso.yaml` (sólo para `estado_ficha`).
4. **NO toca** `content/documentos/`, ni `content/personas/`, ni el resto del caso. Si detecta una investigación periodística con valor probatorio para sostener un Hecho aún no modelado, la anota en `NOTES.md` del caso.
5. Cierra sesión cuando el output final está completo y `pnpm validate` pasa.

## Histórico

### v1 — 2026-05-26

Primera versión moldeada tras aplicar la skill al caso `begona-gomez`.

- Añade preflight obligatorio de CWD y `git rev-parse --show-toplevel` antes de escribir, tras detectar que `cobertura-bg` trabajó íntegramente en la working copy principal por error.
- Mantiene explícita la separación entre corpus de cobertura general y `Documento`: la UI entregada el 2026-05-26 consume `content/cobertura-mediatica/` en una sección propia y no infla la biblioteca probatoria.

### v0 — 2026-05-25

Primera versión. Diseñada antes de aplicarla sobre ningún caso. Se moldeará con la experiencia tras la primera pasada real. Candidatos a revisión tras la primera ronda:

- Si la lista de fuentes buscadas se queda corta o larga.
- Si el enum `tipo_pieza` se queda corto frente a formatos reales (newsletter, podcast, hilo de X verificado, etc.).
- Si la regla de paywall duro requiere matización.
- Si emerge la necesidad de un campo `comentario_editorial` interno del maintainer para piezas particulares.
