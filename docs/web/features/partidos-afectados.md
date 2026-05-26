# Partidos afectados por caso

> Archivos clave: [`schemas/caso.schema.json`](../../../schemas/caso.schema.json) (campo `partidos_afectados`) · [`src/content.config.ts`](../../../src/content.config.ts) (Zod) · `src/components/pages/PgCasoDetalle.astro` (bloque «Partidos afectados» dentro de «Estado procesal actual») · `src/components/pages/PgCasos.astro` (columna «Partidos afectados»). Relacionada con [`vinculos-institucionales.md`](vinculos-institucionales.md).

## Qué hace

Declara, caso a caso, qué partidos políticos quedan "alcanzados" editorialmente por el procedimiento — más allá de la existencia o no de imputaciones procesales contra cargos del partido. Es un campo del editor, no derivado automáticamente del repositorio.

## Para qué sirve

Que un lector pueda escanear el listado de casos y ver, sin entrar a la ficha, **qué siglas toca cada caso**. Sirve a la pregunta natural de la audiencia ("¿esto es del PSOE, del PP, de Vox?") sin reducir el caso a una etiqueta partidista ni inferir bandos.

Internamente sirve también como autocontrol: si un caso queda con `partidos_afectados: []`, el editor reconoce que el caso no alcanza directamente a ningún partido (puede pasar — un caso autonómico o municipal puede no encajar en partidos nacionales).

## Cómo funciona

### Modelo

Campo nuevo en `Caso` (decisión 2026-05-26):

```yaml
partidos_afectados:
  - partido_id: psoe
    tipo_afectacion: vinculo_familiar_directo_con_dirigente
    justificacion: >-
      La investigada es cónyuge del presidente del Gobierno, secretario general
      del PSOE en el momento de los hechos.
```

- **`partido_id`** (obligatorio): slug de una `Organizacion` con `tipo: partido_politico`. Validación referencial implícita por convención (no FK estricta en AJV).
- **`tipo_afectacion`** (obligatorio): enum cerrado.
  - `imputacion_a_cargo_del_partido` — un cargo del partido figura como sujeto procesal del caso.
  - `gobierno_responsable_del_acto_investigado` — el partido lidera el gobierno (nacional, autonómico, local) bajo el que se produjo el acto investigado.
  - `vinculo_familiar_directo_con_dirigente` — el investigado tiene vínculo familiar directo con un cargo público o dirigente del partido (figura pública).
  - `militancia_o_cargo_organico_relevante` — el investigado tiene militancia activa o cargo orgánico en el partido en el momento de los hechos.
  - `querella_o_acusacion_popular_del_partido` — el partido figura como denunciante o acusación popular constituida.
  - `otro` — cualquier otra vinculación documentada con justificación.
- **`justificacion`** (obligatorio): frase corta y neutra describiendo por qué el caso alcanza al partido en este eje. **Sin inferencias políticas.** Ejemplos válidos: "Acusación popular personada", "Cónyuge del presidente del Gobierno"; ejemplos prohibidos: "Caso típico de corrupción socialista", "El PP siempre se ve salpicado por…".

### UI

- **Listado /casos**: columna «Partidos afectados» con chips de siglas clicables a la página del partido. Hoy con estilo accent uniforme (todo igual de azul); pendiente refactor a `PartidoBadge` con color por partido — ver ROADMAP.
- **PgCasoDetalle**: bloque dentro de «Estado procesal actual», antes de «Instituciones alcanzadas». Cada partido en una fila con siglas grandes + label del tipo de afectación (versalitas, muted) + justificación literal.
- **Landing**: el preview de "Casos destacados" muestra los chips de partidos afectados.

### Mantenimiento

El campo lo rellena el maintainer al cerrar la primera versión publicable de un caso. No hay skill automática que lo derive — es decisión editorial. Cuando se modele un caso nuevo, valorar si encaja alguno de los seis `tipo_afectacion` y justificar; si no, dejar vacío.

## Estado actual

**Schema + UI + dos pilotos poblados (2026-05-26).**

- `begona-gomez`: PSOE · `vinculo_familiar_directo_con_dirigente`.
- `gonzalez-amador`: PP · `vinculo_familiar_directo_con_dirigente` + PSOE/Más Madrid · `querella_o_acusacion_popular_del_partido`.

Los otros 4 casos publicables (`plus-ultra`, `fiscal-general-del-estado`, `kitchen`, `lezo`) tienen `partidos_afectados: []` por defecto y van a poblarse en próximas sesiones de revisión.

## Decisiones editoriales y aprendizajes

- **Declaración explícita, no derivación.** Aunque el repositorio contiene `VinculoInstitucional` con cargo orgánico de un investigado en un partido, NO inferimos `partidos_afectados` desde ahí: el editor lo declara explícitamente para no producir falsos positivos (un cargo orgánico antiguo en otro partido no implica que el caso alcance a ese partido).
- **No es un campo de responsabilidad política.** Que un caso toque al PSOE no significa "el PSOE es responsable del acto". El tipo de afectación lo precisa: `gobierno_responsable_del_acto_investigado` se aproxima a responsabilidad institucional, pero el resto (vínculo familiar, acusación popular…) son contextos, no atribuciones de culpa.
- **Justificación obligatoria y neutra.** Sin justificación literal y verificable contra fuentes públicas (cobertura cruzada, BOE, manifestación pública del propio investigado), no se rellena. Las justificaciones son auditables por cualquier lector contra documentos del propio inventario.
- **No reemplaza a `VinculoInstitucional`.** Cuando un caso alcanza a un partido por imputación a un cargo orgánico del partido, ambos modelos coexisten: el vínculo cargo_orgánico_partido en `VinculoInstitucional` (con su documento de respaldo), y `partidos_afectados` con `tipo_afectacion: imputacion_a_cargo_del_partido` (con justificación que probablemente cite ese mismo vínculo).
- **Tipos de afectación son ortogonales.** Un mismo caso puede afectar al mismo partido por más de un tipo. En esos casos se modelan **varias entradas** en el array, una por tipo, cada una con su justificación. No promediamos.
- **Sin colores partidistas en la UI actual.** Los chips usan el estilo accent del proyecto (azul institucional uniforme). El refactor a `PartidoBadge` con colores por partido está en ROADMAP — se hará cuando se haya pensado bien si los colores oficiales transmiten lo que queremos sin perder neutralidad.

## Ideas futuras

### v1 pre-launch

- Poblar los 4 casos publicables restantes con `partidos_afectados` (revisión editorial humana, Bloque C).
- Nota metodológica en `/sobre` explicando los seis `tipo_afectacion` y por qué se llaman "afectados" (no "responsables").

### v1.x

- `PartidoBadge` con tokens de color por partido (PSOE, PP, Vox, Podemos, Más Madrid, Sumar, BNG, EH Bildu, Junts, ERC…). Sustituye los chips actuales en /casos, en el bloque de Caso y en la landing.
- Filtro «Partido afectado» en /casos.
- Vista agregada en /cifras: distribución de casos por partido afectado, separada por tipo de afectación (no se mezcla "imputación" con "acusación popular").
- Lectura cruzada con [`vinculos-institucionales.md`](vinculos-institucionales.md): cuando hay imputación a cargo del partido, mostrar el vínculo respaldado.

### Sin compromiso

- Vista temporal: partidos afectados por legislatura o periodo.
- Export del corpus por partido.

## Pendientes operativos

- [x] Diseñar enum de `tipo_afectacion`. **Decisión 2026-05-26**: seis valores cerrados.
- [x] Decidir si el campo es derivado o declarado. **Decisión 2026-05-26**: declarado, justificación obligatoria.
- [x] Entregar UI en PgCasoDetalle y /casos. **Entregado 2026-05-26 (tarde):** bloque dentro de «Estado procesal actual» + columna en listado.
- [x] Poblar al menos dos casos piloto. **Entregado 2026-05-26 (tarde):** `begona-gomez`, `gonzalez-amador`.
- [ ] Poblar los 4 casos restantes (`plus-ultra`, `fiscal-general-del-estado`, `kitchen`, `lezo`) en próximas sesiones.
- [ ] Refactor a `PartidoBadge` con tokens de color por partido. Ver ROADMAP.
