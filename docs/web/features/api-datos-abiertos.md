# API de datos abiertos

> **Estado: DISEÑO. No implementado.** Esta ficha es la cara *interna*
> (mantenimiento) de la feature. El **contrato de cara afuera** y el registro de
> decisiones son el canon y viven en [`docs/api/`](../../api/README.md) ·
> [`docs/api/decisiones.md`](../../api/decisiones.md). Aquí sólo lo propio de la
> implementación; no se duplica el contrato.
>
> Archivos clave (cuando se implemente): `src/pages/api/v1/…` (endpoints) ·
> `src/lib/api.ts` (serializadores) · reutiliza
> [`src/lib/visibilidad.ts`](../../../src/lib/visibilidad.ts) ·
> contrato de forma en [`/schemas/`](../../../schemas/).

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
- **Gate de visibilidad obligatorio**: pasa por `visibilidad.ts`; sólo `beta_publica+`
  (decisión [D8](../../api/decisiones.md#d8--visibilidad-la-api-es-un-vector-más-del-gate)).

## Estado actual

- **Nada implementado.** Sólo documentación de diseño en [`docs/api/`](../../api/README.md).
- Base ya presente que la feature reutilizará: 12 [JSON Schema](../../../schemas/)
  (contrato de forma), `visibilidad.ts` (gate), el patrón de endpoint estático del feed,
  e IDs/slugs estables.
- **Faceta territorial resuelta en cliente** (Menjòmetre, junio 2026): se expone el grafo
  de organizaciones por caso y el consumidor cruza con su lista del territorio por
  `cif`/NIF; el slice `/territorio/...` se retira y modelar territorio queda diferido. Ver
  [D5](../../api/decisiones.md#d5--faceta-de-territorio-administración-afectada-pendiente-de-modelar).
- **Verificado** (junio 2026): el modelo ya enlaza administraciones afectadas y empresas
  implicadas al caso vía `VinculoInstitucional` ([doc 08](../../diseno/08-afectacion-directa-indirecta.md#7-modelo-de-datos));
  la API sólo las inlinea, no hay hueco de modelo.
- **Pendiente de contenido**: poblar el `cif` (hoy **1 de 137**) para las orgs entidad de
  los casos beta+. Ver [D10](../../api/decisiones.md#d10--identificadores-de-organización-para-el-join-externo).

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

### v1.x — sin compromiso

- **`/llms.txt`** de entrada para IAs consumidoras, con el mapa de endpoints y las
  reglas de presunción de inocencia al renderizar.
- **`datapackage.json`** (Frictionless Data) como descriptor estándar del dataset.
- **Identificadores hermanos de organización**: `dir3` (administraciones) y `wikidata`
  (QID universal) junto al `cif`, para joins aún más limpios. Ver
  [D10](../../api/decisiones.md#d10--identificadores-de-organización-para-el-join-externo).

### Sin compromiso

- **Cloudflare Pages Functions** (cómputo al edge) sólo si el inventario escala a
  decenas de miles de registros y el índice deja de caber en cliente (decisión
  [D1](../../api/decisiones.md#d1--datos-abiertos-estáticos-no-api-de-servidor)).
- **Página `/api`** (o `/datos`) servida en el sitio vivo, para que ni haga falta
  clonar el repo.

## Pendientes operativos

- [ ] **Poblar el `cif`/NIF** de las organizaciones de tipo entidad en casos beta+
  (verificado contra registro oficial; vacío + nota en `NOTES.md` si no hay fuente). Hoy
  1 de 137.
- [ ] Confirmar el alcance del slice de partido (proyección de afectación, sin
  agregados).
- [ ] Valorar `dir3` + `wikidata` como identificadores hermanos del `cif` (D10).
- [ ] (Diferido) Modelar dimensión territorial propia en `Caso` sólo si se quiere filtro
  territorial en la UI propia; ya no bloquea la API.
- [ ] Cuando se implemente: extender el barrido anti-fugas de `dist/` para cubrir
  `/api/`.
- [ ] Cuando se implemente: añadir `_headers` de Cloudflare para `Content-Type:
  application/json` y CORS (`Access-Control-Allow-Origin`) en `/api/`.
