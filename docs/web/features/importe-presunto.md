# Feature — Importe presuntamente atribuido

> **Estado: modelo + UI implementados (2026-05-29).** Fases 1-4 + preview en `/casos` + **atribución por sujeto** hechas. **Refinamientos clave del 2026-05-29:** (a) **dos clases que NUNCA se mezclan** (`importe_clase`): `objeto` (dinero presuntamente atribuido / en juego) vs `consecuencia` (multas y responsabilidad civil) — tablas separadas en ficha y `/graficas`; (b) **toggle nominal ↔ € constantes de 2025** (IPC INE); (c) **atribución por sujeto** (`importe_atribucion`): el dinero se reparte por **papel económico** (≠ rol procesal) y se muestra en las fichas de persona/organización/delito. Pendiente: titular agregado en la home (fase 5, **gated a copy/disclaimers firmados**).

Trackear **cuánto dinero** se atribuye en cada caso —y por persona y por organización— y mostrarlo en las fichas y en [`/graficas`](../pages/graficas.md). El maintainer lo considera "lo que más puede interesar a la gente". También es lo más delicado editorialmente: un número de euros mal presentado afirma culpabilidad. Por eso se modela con cuidado: cada euro cuelga de un `Hecho` con su estado epistémico, su nivel de fuente y su documento.

## Estado actual (qué hay y qué falta)

- **Modelado como dato en el `Hecho`** (2026-05-29): campos `importe`, `importe_moneda`, `importe_alcance`, `importe_naturaleza`, `importe_nota` en [`schemas/hecho.schema.json`](../../../schemas/hecho.schema.json), [`src/content.config.ts`](../../../src/content.config.ts) y [`docs/diseno/01-modelo-de-datos.md`](../../diseno/01-modelo-de-datos.md) §2.6 (enums `ImporteAlcance`/`ImporteNaturaleza`, reglas V-22 y V-23). 17 Hechos poblados en 7 casos; ya es **sumable y filtrable**.
- **UI entregada** (2026-05-29). Siempre **dos tablas separadas por `importe_clase`** (objeto / consecuencia), nunca sumadas:
  - **Ficha de caso** — sección "Cifras del caso" en [`PgCasoDetalle`](../../../src/components/pages/PgCasoDetalle.astro): hasta dos bloques ([`CifrasCasoBloque`](../../../src/components/CifrasCasoBloque.astro)), "Dinero presuntamente atribuido" y "Consecuencias económicas", cada uno con su total (base `total_caso`/`individual`) y cada importe con estado (`EpistemicBadge`), nivel (`LevelBadge`), naturaleza, alcance, nota y enlaces a hecho/documento. Las cifras que no acumulan (componente / exculpatorio) se muestran apagadas y marcadas "No acumula".
  - **`/graficas`** — sección "Cifras económicas" en [`PgGraficas`](../../../src/components/pages/PgGraficas.astro), **la segunda** de la página (lo más consultado). **Dos conmutadores en el propio header sticky de la sección** (slot `header-actions` de `FichaTocSection` → `.sec-h__actions`; el `.sec-h` ya es `position:sticky; top:0`, sin barra aparte ni título duplicado) que **gobiernan toda la sección a la vez**: vista (Procedimientos abiertos / Solo condenas firmes) y modo (€ nominales / € de 2025) — sustituyen a las antiguas tabs por-gráfica de abierto/firme. Se prerrenderizan las **4 combinaciones** (modo×vista) y el toggle sólo conmuta cuál es visible; sigue accesible tras hacer scroll. Por cada clase, un bloque ([`CifrasEconomicasCharts`](../../../src/components/CifrasEconomicasCharts.astro)) con su **caja-total** ([`CifrasTotalBox`](../../../src/components/CifrasTotalBox.astro)) y las lecturas: ranking **por caso** (drill-down a ficha), **grado de prueba** (se oculta en la vista "solo condenas firmes": sería degenerado, todo acreditado), **nivel de fuente** (`StackedBar`) y treemap **por naturaleza**. Representatividad "X de Y", descarga CSV/JSON (columnas clase, año, € nominal y € constante). La nota inferior explica el **reparto por papel** y enlaza a `/personas` y `/organizaciones`.
  - **Fichas de persona / organización** — sección nueva "Cifras económicas" ([`CifrasSujetoBloque`](../../../src/components/CifrasSujetoBloque.astro)) en [`PgPersonaDetalle`](../../../src/components/pages/PgPersonaDetalle.astro) (tras "Casos donde aparece") y [`PgOrganizacionDetalle`](../../../src/components/pages/PgOrganizacionDetalle.astro) (tras "Casos implicados"), **condicional** a que el sujeto tenga cifras atribuidas. Cifras agrupadas por **papel económico** (`importe_atribucion`), con disclaimer de presunción de inocencia.
  - **Ficha de delito** — sección nueva "Cifras económicas de los casos" en [`PgDelitoDetalle`](../../../src/components/pages/PgDelitoDetalle.astro): contexto a **nivel de caso** (totales objeto y consecuencia de cada caso donde se atribuye el delito), **nunca por persona ni sumado en una sola cifra**.
  - **`/casos`** — chip del total **objeto** (el dinero en juego, no las multas), modo abierto, en la celda del caso (`PgCasos`), envuelto en el **HoverCard común** (metodología + cifra exacta). Filtro **«Importe atribuido»** (Con importe / ≥ 1 M€ / ≥ 10 M€) y orden **«Importe atribuido ↓»**.
  - **Inventarios `/personas` y `/organizaciones`** — chip **«Importe atribuido»** por sujeto (cubetas `beneficiario` + `activo`, clase objeto, vía [`importeAtribuidoSujeto`](../../../src/lib/importe.ts)), con el mismo HoverCard, filtro y orden por importe. **Las víctimas** (solo papel `perjudicado`, p. ej. Canal de Isabel II, UCM, AEAT) **no muestran chip**: lo suyo no es dinero «atribuido» sino quebranto sufrido, que se ve en su ficha de detalle.
  - **Caja-total homogénea** ([`CifrasTotalBox`](../../../src/components/CifrasTotalBox.astro)) — borde superior grueso (4px en color de acento) + borde lateral de 1.5px; HoverCard opcional con metodología/cautela; `tone` objeto|consecuencia, `size` lg|md. Reutilizada en ficha de caso (`CifrasCasoBloque`), `/graficas` (`CifrasEconomicasCharts`) y fichas de sujeto (`CifrasSujetoBloque`).
- **Lógica centralizada** en [`src/lib/importe.ts`](../../../src/lib/importe.ts) (agregación anti-doble-conteo y **por clase**: `summableEntries`, `analizarCaso`, `totalesPorCaso`, `totalesPorNaturaleza`, `summableComputables`, `aEurosConstantes`; todas aceptan `{ clase, firmeOnly }`; **por sujeto**: `analizarSujeto(entries, sujeto)` → cubetas por papel), [`src/lib/money.ts`](../../../src/lib/money.ts) (formato euro, reutilizado por `richProse.ts`) y [`src/lib/ipc.ts`](../../../src/lib/ipc.ts) (serie IPC del INE para el ajuste a € constantes). Labels `importeClaseLabel`/`importeNaturalezaLabel`/`importeAlcanceLabel`/`importePapelLabel`/`importePapelSeccionLabel` en [`labels.ts`](../../../src/lib/labels.ts). `BarRow`/`Treemap`/`StackedBar` ganaron `valueLabel?`.
- **Validaciones** ([`scripts/validate.mjs`](../../../scripts/validate.mjs)): **V-22** (schema, `importe` ⇒ `importe_alcance` + `importe_clase`), **V-23** (editorial, anti-doble-conteo), **V-24** (cada `sujeto` de `importe_atribucion` ∈ `personas_implicadas`/`organizaciones_implicadas`) y **V-25** (`papel` coherente con `importe_clase`). Detalle en [doc 01 §2.6](../../diseno/01-modelo-de-datos.md#26-hecho).
- **Pendiente:** titular agregado en la home (fase 5, gated a copy firmado).
- [`Money.astro`](../../../src/components/Money.astro) sigue siendo un chip de texto inline para prosa (`amount: string`); es presentación, no dato. `Caso.resumen_cifras` y `sintesis_caso.cifras_clave` siguen como texto libre (titular legible). La cifra estructurada vive en los Hechos.
- La idea ya estaba esbozada como "Vista B" en [`cifras.md`](../pages/cifras.md) (sección "Ideas futuras"), incluida la tensión con la presunción de inocencia.

## Modelado (implementado: en el `Hecho`)

El importe vive en cada **`Hecho`**, no en el `Caso` suelto, para que **herede** lo que el proyecto ya hace bien: estado epistémico, nivel de fuente N1–N4 y documentos de respaldo. Así cada euro es trazable a un hecho concreto con su grado de prueba.

Campos en el `Hecho` ([`schemas/hecho.schema.json`](../../../schemas/hecho.schema.json) + [`src/content.config.ts`](../../../src/content.config.ts) + [doc 01 §2.6](../../diseno/01-modelo-de-datos.md)):

- `importe`: `number` — cantidad en la unidad de `importe_moneda`. Normalizada (sin separadores de miles, punto decimal). Si está presente, exige `importe_alcance` e `importe_clase` (V-22, schema-enforced vía `if/then`).
- `importe_moneda`: `string` — código ISO 4217, por defecto `"EUR"`. Las cifras en otra divisa (dólares en operaciones internacionales) **no** se estructuran: el importe estructurado es siempre la cifra editorialmente relevante en euros y la divisa original se anota en `importe_nota`.
- `importe_clase`: `enum` — **dos tipos de dinero que NUNCA se mezclan ni se suman** (separación pedida por el maintainer el 2026-05-29):
  - `objeto` — el dinero en juego / presuntamente atribuido: perjuicio o quebranto a lo público, objeto del contrato, fondo concedido, comisión presunta, cobro indebido, gasto cuestionado. Lo que se investiga que se movió mal.
  - `consecuencia` — la respuesta económica del procedimiento: multas penales y responsabilidad civil/indemnizaciones. Lo que se impone o se paga.
  - No siempre se deriva de la naturaleza (una `responsabilidad_civil` puede ser el daño reclamado —clase `objeto`— o una indemnización impuesta —`consecuencia`—): se declara por Hecho. La UI fallback en `importe.ts` deriva por naturaleza si falta.
- `importe_alcance`: `enum` — **clave para no duplicar al sumar** (siempre dentro de una misma clase):
  - `total_caso` — cifra global del perjuicio/objeto del caso o de una de sus piezas. Sumable entre sí.
  - `componente` — partida que desglosa un total ya contabilizado, o cifra meramente citada / no acumulable (petición de pena no firme, ofrecimiento no percibido, importe de un hecho exculpatorio). **Nunca se suma.**
  - `individual` — importe atribuido nominalmente a una persona/organización. Alimenta la vista por persona; sólo suma al total del caso si no hay ningún `total_caso`.
- `importe_naturaleza`: `enum` opcional — subtipo dentro de la clase (`perjuicio`, `objeto_contrato`, `fondo_publico_concedido`, `comision_ilicita`, `cobro_indebido`, `gasto_publico_cuestionado` en clase `objeto`; `multa_penal`, `responsabilidad_civil` en clase `consecuencia`; `otro`). Evita que el treemap sume cifras incomparables (un préstamo concedido ≠ un perjuicio ≠ una multa).
- `importe_nota`: `string` opcional — origen de la cifra, desglose, divisa original, o por qué no acumula.

Hereda del propio `Hecho` (ya existentes): `tipo` (acreditado / investigado / atribuido…), `nivel_fuente_efectivo` (N1–N4), `documentos_respaldo`, `personas_implicadas`, `organizaciones_implicadas`, `vigencia`.

### Agregaciones derivadas (la UI las computa desde los Hechos)

**Todas se computan SIEMPRE dentro de una misma `importe_clase`** (objeto / consecuencia nunca se suman entre sí). Las funciones de `importe.ts` aceptan `{ clase, firmeOnly }`.

- **Por caso** — Σ(`importe` con `alcance = total_caso`); si no hay ninguno, Σ(`individual`). Los `componente` nunca suman. Mostrar siempre estado epistémico + nivel. *(`totalesPorCaso`/`analizarCaso`.)*
- **Por naturaleza** — el dinero sumable se reparte por `importe_naturaleza` para no mezclar un préstamo público con un perjuicio o una multa en una sola cifra. Σ buckets == Σ totales por caso (dentro de la clase). *(`totalesPorNaturaleza`.)*
- **Ajuste por inflación** — `aEurosConstantes` reescala cada importe a € constantes de 2025 con la serie del IPC del INE ([`ipc.ts`](../../../src/lib/ipc.ts); año del importe = `fecha_o_periodo.desde`). El toggle de `/graficas` conmuta nominal ↔ constante.
- **Toggle firme/abierto** — "firme" = sólo Hechos `acreditado` (`EPIS_FIRME`); "abierto" = todo. Hoy sólo el FGE (17.200 € en clase `consecuencia`) entra en firme.
- Los Hechos `exculpatorio` / `desmentido` / `no_concluyente` se excluyen de los totales atribuidos.
- **Por persona / organización — ENTREGADO (2026-05-29) vía `importe_atribucion`.** El reparto NO se hace por mera implicación (`personas_implicadas` / `organizaciones_implicadas` lista también a víctimas, acusación popular y el órgano judicial), sino por el **papel económico** que declara cada item de `importe_atribucion`. `analizarSujeto(entries, sujeto)` agrupa el dinero en **cubetas por papel** (orden en `PAPEL_ORDEN`); cada cubeta es de UN papel —y por tanto de UNA clase— y suma `importe_sujeto ?? importe` de los Hechos donde el sujeto figura con ese papel, excluyendo `componente` y los Hechos `exculpatorio`/`desmentido`/`no_concluyente`. Los cinco papeles (objeto: `activo` / `beneficiario` / `perjudicado`; consecuencia: `obligado` / `acreedor`) y el guardarraíl están en [doc 01 §2.6](../../diseno/01-modelo-de-datos.md#26-hecho). **Las vistas por sujeto no se suman entre sujetos** (la responsabilidad solidaria se atribuye íntegra a cada obligado), y `activo` ≠ percepción. El ejemplo real que rompía el reparto ingenuo (indemnización FGE que listaba al condenado **y** al perjudicado; multa pedida en GA que listaba 5 coacusados + PSOE/Más Madrid + juzgado) hoy queda bien resuelto: cada euro va a su papel, nunca el quebranto de la víctima al investigado.

### Cómo elegir el papel económico (guía para poblar `importe_atribucion`)

Para cada sujeto que el documento relacione con el dinero, decide su papel con esta cascada (de la pregunta más segura a la más fuerte):

1. **¿Sufre la pérdida?** (erario, entidad pública, empresa defraudada, particular dañado) → `perjudicado` *(objeto)*. **Nunca se suma al investigado.**
2. **¿Debe pagar una multa o responsabilidad civil** por una resolución? → `obligado` *(consecuencia)*. **¿La cobra a su favor?** → `acreedor` *(consecuencia)*.
3. **¿Consta indiciariamente que recibió o se le adjudicó el dinero?** (cobra una comisión, recibe un fondo/transferencia) → `beneficiario` *(objeto)*.
4. **¿Se le atribuye la conducta económica pero NO consta que lo percibiera?** (organiza el desvío, pero el dinero es un perjuicio a un tercero) → `activo` *(objeto)*.

Reglas de oro: **en la duda entre `activo` y `beneficiario`, elige `activo`** (más conservador: no afirma percepción). El órgano judicial, la fiscalía y la acusación popular **no llevan papel** (no son parte del flujo de dinero). `importe_sujeto` sólo si la cuota del sujeto difiere del importe del Hecho; si se omite, se le atribuye el importe completo (así se modela la responsabilidad solidaria: el total a cada `obligado`/`activo`, sin sumar entre sujetos).

### Código cromático en cifras

Las cifras se colorean por **familia de papel** (navy = atribuido/percibido · gris = quebranto/víctima · mostaza = consecuencia) y el **rojo se reserva a condena firme**: sólo dinero `acreditado` por resolución firme del lado responsable (`activo`/`beneficiario`/`obligado`), nunca lo investigado/atribuido, nunca `perjudicado` ni `acreedor`. Canon de la regla visual en [DESIGN.md — "F-cifras"](../../../DESIGN.md#2bis-sistema-de-badges). Componente de la caja-total: [`CifrasTotalBox`](../../../src/components/CifrasTotalBox.astro) (`tone` objeto/perjuicio/consecuencia/firme).

### Qué se pobló (backfill 2026-05-29)

17 Hechos en 7 casos. Decisiones de dedup tomadas (V-23, revisión editorial):

Cada importe lleva además su `importe_clase` (**objeto** = dinero en juego, **consec.** = multa/resp. civil).

| Caso | Clase · total | Alcance · naturaleza | Nota de dedup |
|------|----------------------|----------------------|----------------|
| Plus Ultra | objeto · 53 M€ | total_caso · fondo_publico_concedido | El hecho `pu-rescate-cauces-irregulares` repite el mismo préstamo: **no se estructura** para no duplicar. |
| Begoña Gómez | objeto · 113.509,32 € | total_caso · perjuicio | El hecho de coste del software lleva la misma cifra como `componente` (desglose 108.765,79 € + 4.743,53 €): no acumula. |
| FGE | **consec.** · 17.200 € | individual · multa_penal (7.200) + responsabilidad_civil (10.000) | Caso de revelación de secretos: **sin clase `objeto`** (no hay dinero sustraído). Total de consecuencias = 17.200 €, condena firme. |
| González Amador | objeto · 2,25 M€ · + consec. · 600.000 € | objeto: total_caso perjuicio (350.951) + objeto_contrato (1,9 M€); consec.: individual multa_penal pedida (600.000, no firme) | Comisión Quirón 500.000 € = `componente` objeto (dentro del 1,9 M€). |
| Leire Díez | objeto · 888.000 € | total_caso · comision_ilicita (700.000) + cobro_indebido (188.000) | Ofrecimiento de 50.000 € = `componente` (no percibido, no acumula). |
| Lezo | objeto · 33,4 M€ | total_caso · perjuicio (19 M Inassa + 9,6 M) / comision_ilicita (1,8 M + 3 M) | **Inassa reclasificada 2026-05-29**: era `responsabilidad_civil`, pero es el sobreprecio (perjuicio/quebranto) → `perjuicio`, clase `objeto`. Cuatro piezas sin solape → suman. USD y reparto 5,5 M€ en `importe_nota`. |
| ático-estepona | objeto · — (no acumula) | componente · objeto_contrato | Hecho `exculpatorio` (sobreseído): 770.000 € conservados por trazabilidad, no acumula. |

**Casos sin importe estructurado:** **Kitchen** — los autos/cobertura citados no cuantifican una cifra concreta de fondos reservados; no se inventa.

Tras la separación por clase: **objeto** cuantificado en 5 casos (PU, Lezo, GA, Leire, BG); **consecuencia** en 2 (FGE, GA). FGE deja de aparecer en "dinero en juego" — su dinero es sólo consecuencia.

## Guardarraíles innegociables

Heredados de [`AGENTS.md`](../../../AGENTS.md) (principios irrenunciables) y [`cifras.md`](../pages/cifras.md):

1. **Lenguaje.** Nunca "robó / defraudó / se apropió". Sí: *"importe presuntamente atribuido en procedimiento abierto"*, *"perjuicio cuantificado en sentencia firme"*. La versión correcta es menos pegadiza; se acepta.
2. **Estado + nivel siempre visibles** junto a cada número. Un importe de sentencia firme (acreditado, N1) ≠ uno de un escrito de acusación (atribuido, N3) ≠ uno de prensa (N4).
3. **Toggle "solo sentencias firmes" vs "procedimientos abiertos".** Sin él, el sumatorio se lee como "dinero realmente robado".
4. **Sin doble conteo.** `importe_alcance` evita sumar un total y sus partes. Revisión obligatoria al backfillear.
5. **Representatividad.** Mostrar "X de Y casos tienen importe cuantificado". Si la cobertura es parcial, el agregado global engaña (mismo principio que el bloque de partidos, hoy diferido).
6. **Moneda e inflación.** Cifra base nominal (la que consta en la resolución, verificable) + **toggle a € constantes de 2025** con IPC del INE ([`ipc.ts`](../../../src/lib/ipc.ts)), claramente etiquetado como estimación para comparar entre épocas. Decidido por el maintainer el 2026-05-29.
7. **Dinero sustraído ≠ dinero pagado (`importe_clase`).** "Robado/desviado" (objeto) y "multa/indemnización que se paga" (consecuencia) son cosas distintas: **nunca se suman ni comparten tabla**. Decidido por el maintainer el 2026-05-29. Un caso de pura sanción (FGE) no debe figurar en el ranking de "dinero en juego".

## Fases de ejecución

1. **Schema + tipos.** `[x]` (2026-05-29) Campos en `hecho.schema.json` (con `if/then` para V-22) + `content.config.ts` + doc 01 (§2.6, enums, V-22/V-23, parking lot 3 cerrado).
2. **Backfill editorial.** `[x]` (2026-05-29) 17 Hechos en 7 casos, con dedup por caso (tabla arriba). `pnpm validate` 787 OK, 0 errores.
3. **Ficha de caso.** `[x]` (2026-05-29) Sección "Cifras del caso": total con base + cada importe con estado, nivel, naturaleza, alcance, nota y enlaces a hecho/documento; las no acumulables marcadas. Renumeradas cobertura (→8) y biblioteca (→9).
4. **Gráficas en `/graficas`.** `[x]` (2026-05-29) Sección "Cifras económicas" (la segunda de la página): **cabecera sticky con dos conmutadores (vista + modo) que gobiernan toda la sección** (sustituyen las tabs por-gráfica de abierto/firme; 4 combinaciones prerrenderizadas), caja-total por clase (`CifrasTotalBox`), ranking por caso + composición por grado de prueba (oculto en vista firme) + por nivel de fuente (`StackedBar`) + treemap por naturaleza, todo con drill-down; representatividad "X de Y" y descarga CSV/JSON. Reutiliza el sistema de charts ([`visualizaciones-graficas.md`](visualizaciones-graficas.md)); `BarRow`/`Treemap`/`StackedBar` ganaron `valueLabel?` para pintar la cifra en euros.
4bis. **Atribución por sujeto + fichas de persona/organización/delito.** `[x]` (2026-05-29) Campo `importe_atribucion` (5 papeles, V-24/V-25), `analizarSujeto` y `CifrasSujetoBloque`: cifras por papel en fichas de persona y organización (condicionales) y contexto a nivel de caso en la ficha de delito.
5. **Titular en la home.** `[ ]` **Gated a copy/disclaimers firmados por el maintainer.** El preview por caso ya está en `/casos`. El titular agregado de la home es "la cara del sitio al compartirlo": no se publica sin copy firmado y sin decidir qué cifra se enseña (clase `objeto`, no mezclando naturalezas). Pendiente de decisión del maintainer.

## Decisiones abiertas

- **Dedup (`importe_alcance`) vs casos multi-pieza.** `[x]` Resuelto: cada pieza con perjuicio/objeto diferenciado es un `total_caso` (suman sin solape); partidas y cifras repetidas como `componente`; peticiones de pena e importes individuales como `individual`. Reglas en [doc 01 §2.6](../../diseno/01-modelo-de-datos.md) (V-23).
- **Dos clases (`importe_clase`).** `[x]` Resuelto 2026-05-29: `objeto` (dinero en juego) vs `consecuencia` (multas/resp. civil), nunca sumadas. Reformulado caso por caso; Inassa reclasificada a `perjuicio`/objeto.
- **Taxonomía económica más fina — modelo objetivo, NO implementado a propósito.** Existe un desglose más rico (beneficio del delito · perjuicio/daño · responsabilidad civil · multa · decomiso/comiso · dinero recuperado · prisión). Decisión del agente (2026-05-29): **no pre-crear categorías vacías** — hoy ningún Hecho del repo tiene decomiso, recuperación ni un beneficio distinto del perjuicio, y modelar sin un caso real que ancle la semántica lleva a la abstracción equivocada (YAGNI; el repo cierra parking-lots al volverse reales). El esqueleto de 2 clases ya absorbe todo esto. **Modelo objetivo y disparador para cuando llegue el dato:**

  | Concepto | Dónde encaja | Cuándo añadirlo |
  |---|---|---|
  | Beneficio ilícito (botín) ≠ perjuicio | clase `objeto`; hoy `comision_ilicita`/`cobro_indebido` ya capturan "lo que se llevó" | separar `beneficio_ilicito` de `perjuicio` **sólo** si un caso tiene ambos por la MISMA cantidad y la suma engañaría (hoy guardado por V-23/`componente`) |
  | Decomiso / comiso, costas | clase `consecuencia`, nuevas naturalezas `decomiso`/`costas` | en el PR que modele el primer caso con comiso (frecuente en corrupción → probable pronto) |
  | **Dinero recuperado / devuelto** | **probablemente clase propia** `recuperado`, mostrada como contrapunto ("investigado X · recuperado Y"), **nunca restada en silencio del total `objeto`** | con el primer caso que tenga recuperación cuantificada; resolver entonces si cuelga del Caso o de un Hecho |
  | Condena de prisión | **fuera de `importe`** (no es dinero); eje no monetario | si se quiere en gráficas, modelar aparte (años de pena), no en importe |

  Regla: el enum se amplía en el **mismo PR que modela el primer caso** con esa cifra; no se crean valores vacíos por adelantado.
- **Ajuste por inflación.** `[x]` Resuelto 2026-05-29: toggle nominal ↔ € constantes de 2025 (IPC INE, [`ipc.ts`](../../../src/lib/ipc.ts)). Pendiente operativo: **refrescar la serie IPC** cuando cambie el año de referencia (hoy dic-2025; reconsultar [ine.es/varipc](https://www.ine.es/varipc/)).
- **Comparativas con cifras externas** (lo que cuestan otras cosas / partidas públicas, "que choquen"). **Diferido a propósito** (decisión del maintainer 2026-05-29): potente pero roza la neutralidad; si se hace, sólo con fuentes oficiales (PGE, BOE, Tribunal de Cuentas), como bloque "contexto" separado, con descargos y datos brutos. Necesita trabajo de sourcing aparte. **Abierto, como bloque propio.**
- **Atribución de importe por sujeto.** `[x]` **Resuelto 2026-05-29.** Se añadió `importe_atribucion[]` al `Hecho` (`{ sujeto_tipo, sujeto, papel, importe_sujeto?, nota? }`), que reparte el dinero por **papel económico** (≠ rol procesal) en vez de por mera implicación — esto desbloqueó la vista por persona/organización (`analizarSujeto` + `CifrasSujetoBloque`). Cinco papeles, V-24/V-25, guardarraíl de presunción de inocencia en [doc 01 §2.6](../../diseno/01-modelo-de-datos.md#26-hecho).
- **Titular agregado de la home — copy firmado.** Pendiente de que el maintainer firme el copy y decida qué cifra se enseña. **Abierto.**
- Modelo de vínculo persona↔partido **en el momento del hecho** si se cruza dinero con partidos. **Abierto.**
- Snapshot histórico mensual para comparativa temporal del agregado. **Abierto.**

## Cómo extender

- **Toda la lógica de agregación está en [`src/lib/importe.ts`](../../../src/lib/importe.ts).** Un consumidor hace `toImporteEntries(hechos.map(h => h.data))` y llama a `analizarCaso(entries, clase)` (por caso, por clase), `totalesPorCaso`/`totalesPorNaturaleza`/`summableComputables` (transversal, con `idsComputables` y `{ clase, firmeOnly }`) o `analizarSujeto(entries, sujeto)` (por sujeto, cubetas por papel). **Siempre por clase**: nunca sumes objeto + consecuencia. Formato de cifra vía [`src/lib/money.ts`](../../../src/lib/money.ts); ajuste a constantes vía `aEurosConstantes(entries, aConstante2025)` ([`ipc.ts`](../../../src/lib/ipc.ts)). No reimplementar el formato europeo: `richProse.ts` consume `formatGroupedNumber`.
- **Nuevos casos:** `/incorporar-hito` y `/actualizar-caso` deben rellenar `importe*` (incluida `importe_clase`) y, cuando un documento desglose nominalmente quién pone/cobra/sufre el dinero, `importe_atribucion[]` (papel por sujeto, V-24/V-25), al leer autos con cifras. La UI los recoge automáticamente.
- **Caja-total homogénea:** reutiliza [`CifrasTotalBox`](../../../src/components/CifrasTotalBox.astro) (no reimplementar el bloque del total); para la vista por sujeto, [`CifrasSujetoBloque`](../../../src/components/CifrasSujetoBloque.astro).
- **Verificado 2026-05-29** (build limpio): clase `objeto` por caso (nominal) PU 53 M€ · Lezo 33,4 M€ · GA 2,25 M€ · Leire 888.000 € · BG 113.509,32 €; en € constantes de 2025 PU 65,14 M€ · Lezo 53,68 M€ (Inassa 2001 infla mucho). Clase `consecuencia`: FGE 17.200 € (firme) · GA 600.000 € (multa pedida). FGE no aparece en "dinero en juego".
