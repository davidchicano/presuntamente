# API de datos abiertos

> **Estado: IMPLEMENTADA (v1).** Esta ficha es la cara *interna* (mantenimiento) de
> la feature. El **contrato de cara afuera** y el registro de decisiones son el canon
> y viven en [`docs/api/`](../../api/README.md) ·
> [`docs/api/decisiones.md`](../../api/decisiones.md). Aquí sólo lo propio de la
> implementación; no se duplica el contrato.
>
> Archivos clave:
> - [`src/lib/api.ts`](../../../src/lib/api.ts) — serializadores (`buildApiContext`),
>   sobre `meta`, gate de retractados, denormalización CIF, `loadApiInput`.
> - `src/pages/api/v1/*` — endpoints: `casos.json.ts`, `personas.json.ts`,
>   `organizaciones.json.ts` (índices); `casos/[slug].json.ts`,
>   `personas/[slug].json.ts`, `organizaciones/[slug].json.ts` (detalle);
>   `partido/[slug].json.ts` (slice); `dump.json.ts`; `datapackage.json.ts`.
> - [`src/pages/llms.txt.ts`](../../../src/pages/llms.txt.ts) — `/llms.txt`.
> - [`public/_headers`](../../../public/_headers) — Content-Type JSON + CORS en `/api/*`.
> - Reutiliza [`src/lib/visibilidad.ts`](../../../src/lib/visibilidad.ts) (gate),
>   [`src/lib/afectacion.ts`](../../../src/lib/afectacion.ts) (afectación),
>   [`src/lib/importe.ts`](../../../src/lib/importe.ts) (importe atribuido); contrato
>   de forma en [`/schemas/`](../../../schemas/).

## Qué hace

Expone el inventario como **JSON estático machine-readable** (datos abiertos, CC BY-SA
4.0) para que terceros integren los datos sin scrapear la web. Mismo origen YAML que el
sitio; otra serialización, como el [feed RSS/Atom](feed-rss-atom.md).

## Para qué sirve

**Audiencia primaria**: proyectos y desarrolladores que quieren componer con los datos
(petición concreta de Menjòmetre, junio 2026, para casos de Cataluña) e investigadores
que quieren el dataset entero. **Función secundaria**: composabilidad y señal de
proyecto serio de datos abiertos. Detalle de audiencia y casos de uso en el
[README de la API](../../api/README.md).

## Cómo funciona

> Resumen; el catálogo de endpoints, la fila de índice y el sobre de metadatos son
> canon en [`docs/api/README.md`](../../api/README.md).

- **Generación en build**, igual que [`feed.xml.ts`](../../../src/pages/feed.xml.ts):
  endpoints estáticos Astro que hacen `getCollection(...)` y serializan a JSON. Sin
  servidor ni base de datos (decisión [D1](../../api/decisiones.md#d1--datos-abiertos-estáticos-no-api-de-servidor)).
- **Tres patrones de acceso**: índice ligero (el cliente filtra) + detalle bajo demanda
  + slices pre-construidos por URL (decisión [D3](../../api/decisiones.md#d3--acceso-por-índice-detalle-y-slices)).
- **Modelo de grafo**: cada nodo (caso/persona/organización) serializa sus aristas
  (decisión [D2](../../api/decisiones.md#d2--el-inventario-se-expone-como-grafo-de-tres-entidades)).
- **Denormalización para el join externo**: el caso inlinea el `cif` de sus organizaciones
  y la organización lleva sus `casos_relacionados`; un consumidor con CIF va de CIF a casos
  con un solo fichero (decisión [D11](../../api/decisiones.md#d11--denormalizar-para-el-join-externo-cif-inline-y-aristas-bidireccionales)).
  `casos_relacionados` es **completa**: incluye vínculo de afectación, órgano, querellante,
  rol procesal (`rol_<rol>`), implicación en hecho (`implicada_en_hecho`) y afectación en
  hito (`afectada_en_hito`) — pero NO al medio como productor de documento citado (cubrir ≠
  ser parte), por eso los medios quedan vacíos a propósito ([D12](../../api/decisiones.md#d12--decisiones-de-implementación-junio-2026)).
- **Gate de visibilidad obligatorio**: pasa por `visibilidad.ts`; sólo `beta_publica+`
  (decisión [D8](../../api/decisiones.md#d8--visibilidad-la-api-es-un-vector-más-del-gate)).

## Estado actual

- **Implementada (v1), junio 2026.** 9 endpoints en producción (3 índices + 3 detalle +
  slice de partido + dump + datapackage) + `/llms.txt` + `public/_headers`. Build estático,
  coste runtime cero. Verificada: build limpio, `astro check` 0 errores, JSON válido,
  invocación HTTP real (200 + `application/json`), 0 fugas internas, contenido retractado
  excluido. Genera 18 casos, 157 personas, 110 organizaciones, 4 slices de partido.
- **CIF poblado: 73 de 110** orgs visibles (era 1 de 137). Ver "Estado del poblado de CIF".
- Reutiliza: 12 [JSON Schema](../../../schemas/) (forma), `visibilidad.ts` (gate),
  `afectacion.ts`, `importe.ts`, el patrón de endpoint estático del feed, IDs/slugs estables.
- **Faceta territorial resuelta en cliente** (Menjòmetre, junio 2026): se expone el grafo
  de organizaciones por caso (con CIF inline) y el consumidor cruza con su lista del
  territorio por `cif`/NIF; el slice `/territorio/...` se retira y modelar territorio queda
  diferido. Ver [D5](../../api/decisiones.md#d5--faceta-de-territorio-administración-afectada-pendiente-de-modelar).
- **Más estricta que la web** en dos puntos (D12): excluye contenido retractado
  (`vigencia: retirado`, `estado_publicacion: retirado_*`) y el campo interno
  `promocion_propuesta`.

## Estado del poblado de CIF

Dos pasadas de sub-agentes de investigación (junio 2026), mismo umbral: fuente oficial o
≥2 registrales coincidentes, **dígito de control validado** (el test de contrato lo
re-verifica), umbral conservador (ante duda, vacío). Ver
[D10](../../api/decisiones.md#d10--identificadores-de-organización-para-el-join-externo)
y [D12](../../api/decisiones.md#d12--decisiones-de-implementación-junio-2026).

- **Poblados: 72** (+ `plus-ultra-lineas-aereas` previo = **73**). Partidos (PP, PSOE,
  Podemos, Más Madrid, Vox, **CDC**), asociaciones acusación popular (ADICAE, HazteOír,
  Manos Limpias, Iustitia Europa), administraciones (AEAT, ayuntamientos Madrid/Marbella,
  CCAA, CGPJ, ICAM, SEPI, UCM, Min. Interior, Presidencia, **Congreso de los Diputados**,
  **Abogacía General del Estado**…), empresas y financieras (Bankia, Ferrovial, Cofely,
  Quirón Prevención, Servinabar, Maxwell Cremona, **Orange Market**, **Tecnoconcret**, y
  extintas del caso —Filesa, Fórum, Nóos Consultoría, Special Events…—), fundaciones y la
  mayoría de medios (incl. **El País**).

### 2.ª pasada (junio 2026) — 6 nuevos

| Org | CIF | Fuente |
|---|---|---|
| `convergencia-democratica-de-catalunya` | `G08547994` | BORME oficial ([BORME-C-2008-113095](https://www.boe.es/diario_borme/txt.php?id=BORME-C-2008-113095), cita literal del NIF) |
| `orange-market` | `B97364301` | 4 bases registrales coincidentes (Axesor, Empresia, Datoscif, eInforma) |
| `tct-sociedad` | `B83663047` | 4 bases registrales coincidentes (Axesor, Iberinform, Empresite, eInforma); razón social registral "Tecnoconcret Proyectos e Ingeniería SL" |
| `congreso-de-los-diputados` | `S2804002J` | Plataforma de Contratación del Sector Público (NIF de la Mesa del Congreso, su órgano de gobierno) |
| `abogacia-del-estado` | `S2826007C` | Plataforma de Contratación (NIF propio de la Abogacía General del Estado — Dir. del Servicio Jurídico, **distinto** del Min. Justicia S2813001A) |
| `el-pais` | `B85635910` | Aviso legal de elpais.com + 4 bases registrales; editora resuelta a **Ediciones El País, S.L.** (no Prisa Noticias, extinta 2022; no Diario El País, S.L., el holding) |

### Pendientes (10), por motivo documentado

- *Sin fuente registral suficiente* (no aplicado por umbral): `grupo-independiente-liberal`
  (partido ilegalizado y disuelto 2007, sin huella registral pública indexada),
  `movimiento-regeneracion-politica` (sólo el nº 618.750 del Registro Nacional de
  Asociaciones, que **no** es el NIF fiscal), `instituto-noos` (asociación, no en Reg.
  Mercantil; el NIF empezaría por G y estaría en el Reg. de Asociaciones de Cataluña).
- *Candidatos por debajo de umbral* (fuente comercial única, dígito de control válido pero
  sin 2.ª fuente independiente → **no aplicado**, anotados para verificación futura en
  [`content/casos/filesa/NOTES.md`](../../../content/casos/filesa/NOTES.md)):
  `malesa-sociedad` (`A58559782`, Infonif), `time-export` (`B08531279`, Empresia; además su
  razón social registral parece ser S.L.U., no S.A.).
- *Órgano modelado sin NIF propio* — vacío a propósito (`dir3` sería el id correcto):
  `direccion-general-policia` (el NIF hallado `S2816015H` es de una **subunidad**, la
  División Económica y Técnica del CNP, no de la DGP; DIR3 de la DGP: E04931201),
  `jefatura-del-estado` (órgano constitucional sin NIF fiscal; el `S2801001E` que aparece es
  de la **Casa de S.M. el Rey**, entidad distinta no modelada).
- *Entidad no española / sin editora española* — VACÍO razonado: `infobae` (THX Medios S.A.,
  Argentina, CUIT 30-70789668-6, sin sociedad editora española), `actualidad-es` (Contents
  S.p.A., Milán; sin editora española inscrita).
- *Guardarraíl de privacidad*: `apif` publicaba como "NIF" un DNI de persona física →
  descartado, nunca se expone el NIF de una persona.
- **Pasada enfocada sobre los 5 recuperables** (junio 2026: BORME para las sociedades;
  sentencia Nóos / Tribunal de Cuentas / RNA para asociaciones y partido): **0 nuevos
  aplicables**. Bloqueos exactos documentados en la `NOTES.md` de cada caso — homonimia en
  la trama Filesa + BORME que no cita el CIF (`filesa`), CIF en el PDF de 742 pp. de la
  sentencia AP Palma no extraíble vía web (`noos`), informes del Tribunal de Cuentas
  escaneados sin OCR (`malaya`/GIL), MRPE sin NIF público en ninguna fuente (`begona-gomez`).
  Cada uno necesita una operación fuera del alcance del agente (descarga de PDF grande, OCR,
  consulta registral presencial).
- **Notas de entity-resolution** (revisar si se cuestiona): `la-sexta` → CIF de Atresmedia
  Corporación (marca sin editora separada); `el-correo-gallego` → EPI Prensa S.L. (vehículo
  de Prensa Ibérica); `el-pais` → Ediciones El País, S.L. (prosa de `descripcion_corta` ya
  corregida: "editado por Ediciones El País, S.L., sociedad del grupo PRISA").

- **Verificado** (junio 2026): el modelo ya enlaza administraciones afectadas y empresas
  implicadas al caso vía `VinculoInstitucional` ([doc 08](../../diseno/08-afectacion-directa-indirecta.md#7-modelo-de-datos));
  la API sólo las inlinea, no hay hueco de modelo.

## Pruebas (vitest)

Suite en [`tests/`](../../../tests/), corre con `pnpm test` (y en CI tras el build).
**vitest** es la primera (y por ahora única) dependencia de testing del repo; el resto de
validación sigue siendo el script `scripts/validate.mjs` (contenido) y `astro check` (tipos).

- **`tests/api.unit.test.ts`** — unit de `buildApiContext` con un inventario sintético
  ([`tests/fixtures.ts`](../../../tests/fixtures.ts)): gate de visibilidad, exclusión de
  retractados, stripping de `promocion_propuesta`, CIF inline, arista inversa org→casos,
  `personas_clave` = sólo imputados/condenados, acusación popular ≠ afectación, slice de
  partido sin agregados, importe atribuido, sobre `meta`. No necesita build.
- **`tests/api.contract.test.ts`** — contrato sobre el `dist/api/**` real: JSON válido +
  sobre `meta`, integridad referencial índice↔detalle, 0 fugas de `promocion_propuesta`,
  0 hechos retractados, **dígito de control de cada CIF** (`tests/helpers.ts`), aristas
  bidireccionales coherentes, `datapackage`/`llms.txt`/`dump` bien formados. Requiere build
  previo; si no hay `dist/`, **se salta con aviso** (no rompe). Local: `pnpm test:api`
  (build + test).
- **Cómo se fuerza el gate de producción en tests**: `import.meta.env.DEV` se lee en
  runtime, así que [`tests/setup.ts`](../../../tests/setup.ts) lo stubea con `vi.stubEnv`
  (poner `mode: 'production'` o `define` en la config no basta en vitest). El alias
  `astro:content` se resuelve a un stub ([`tests/stubs/`](../../../tests/stubs/)) porque
  `buildApiContext` recibe las colecciones ya cargadas y no llama a `getCollection`.

## Decisiones editoriales y aprendizajes

- Los **guardarraíles editoriales viajan en el payload** (sobre `meta` con licencia,
  aviso "imputación ≠ condena", y `nivel_fuente` + roles discretos en los datos). No
  podemos controlar al consumidor, pero sí hacer que el mal uso requiera ignorar campos
  visibles.
- **Sin SDK**: se apuesta por legibilidad por LLM (schemas + `llms.txt` con los
  guardarraíles dentro). Decisión [D7](../../api/decisiones.md#d7--sin-sdk-legibilidad-por-llm).
- **Propagación de datos asumida** por el maintainer: una vez fuera, anonimización y
  rectificación no se retraen aguas abajo; se acepta como coste inevitable de un
  proyecto abierto.
- El razonamiento completo (opciones consideradas y descartadas) está en
  [`docs/api/decisiones.md`](../../api/decisiones.md), para que un tercero entienda el
  *por qué* sin haber estado en la conversación.

## Ideas futuras

### Entregado en v1 (antes "sin compromiso")

- **`/llms.txt`** ✓ — entrada para IAs consumidoras, con el mapa de endpoints y las
  reglas de presunción de inocencia al renderizar.
- **`datapackage.json`** ✓ — descriptor estándar Frictionless Data del dataset.

### v1.x — sin compromiso

- **Identificadores hermanos de organización**: `dir3` (administraciones) y `wikidata`
  (QID universal) junto al `cif`, para joins aún más limpios. **Fuertemente motivados** por
  la entity-resolution de consumidores reales (Menjòmetre: portales de transparencia sin id
  único, con erratas en los nombres); mantener muy presente. Ver
  [D10](../../api/decisiones.md#d10--identificadores-de-organización-para-el-join-externo).

### Sin compromiso

- **Cloudflare Pages Functions** (cómputo al edge) sólo si el inventario escala a
  decenas de miles de registros y el índice deja de caber en cliente (decisión
  [D1](../../api/decisiones.md#d1--datos-abiertos-estáticos-no-api-de-servidor)).

### Entregado en v1.x

- **Página `/api`** ✓ — recepción humana de la API en el sitio vivo
  ([`src/components/pages/PgApi.astro`](../../../src/components/pages/PgApi.astro), wrapper
  [`src/pages/api/index.astro`](../../../src/pages/api/index.astro)). Capa fina sobre el
  contrato de [`docs/api/README.md`](../../api/README.md): qué es + modelo de grafo +
  catálogo de endpoints (enlazados al JSON real) + sobre `meta` + gate de visibilidad +
  promesa de estabilidad + licencia. Enlazada desde el footer (sección "Datos y
  suscripción", junto a los feeds). No usa `activeNav` (no es pestaña del nav principal).
  El `_headers` no la fuerza a JSON: la regla `Content-Type: application/json` aplica sólo a
  `/api/v1/*.json`, no a `/api`.

## Pendientes operativos

- [x] **Endpoints v1** (índice + detalle + slice + dump + datapackage), `llms.txt`,
  `_headers` (Content-Type JSON + CORS) y barrido anti-fugas de `dist/api` — junio 2026.
- [x] **Poblar el `cif`/NIF**: 72 nuevos (73 total) con fuente oficial / ≥2 registrales,
  dígito de control validado (en dos pasadas, junio 2026). Ver "Estado del poblado de CIF".
- [x] Alcance del slice de partido confirmado (proyección de afectación, sin agregados, D4).
- [ ] **Completar los 10 CIF pendientes** cuando aparezca fuente (lista y motivos en
  "Estado del poblado de CIF"): nota registral del Reg. Mercantil de Barcelona para
  `malesa`/`time-export` (hoy candidatos de fuente única), Reg. de Asociaciones de
  Cataluña para `instituto-noos`, sentencia íntegra Nóos (AP Palma) que cite el NIF;
  partidos extintos (`grupo-independiente-liberal`) y asociaciones recientes
  (`movimiento-regeneracion-politica`) si afloran en Tribunal de Cuentas / AEAT. `el-pais`
  **resuelto** (Ediciones El País, S.L.); los órganos sin NIF propio (`direccion-general-policia`,
  `jefatura-del-estado`) y los medios extranjeros (`infobae`, `actualidad-es`) se quedan
  vacíos a propósito; `apif` nunca (privacidad).
- [ ] Valorar `dir3` + `wikidata` como identificadores hermanos del `cif` (D10) —
  especialmente `dir3` para las administraciones sin NIF propio.
- [ ] (Diferido) Modelar dimensión territorial propia en `Caso` sólo si se quiere filtro
  territorial en la UI propia; ya no bloquea la API.
- [ ] Verificar en el deploy real de Cloudflare que `public/_headers` aplica CORS y
  Content-Type a `/api/*` (sólo comprobable en producción CF, no en `astro preview`).
- [ ] (Opcional) Página `/api` o `/datos` en el sitio vivo enlazando a `llms.txt` y al
  contrato, para no obligar a clonar el repo.
