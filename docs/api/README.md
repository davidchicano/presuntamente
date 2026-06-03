# API de datos abiertos — presuntamente.org

> **Estado: DISEÑO. No implementado todavía.** Este documento describe el contrato
> que queremos ofrecer; las rutas `/api/v1/...` aún no existen en el sitio. Es la
> referencia de cara afuera (la lee quien quiera *consumir* los datos). El *por qué*
> de cada decisión vive en [`decisiones.md`](decisiones.md). La ficha interna de
> mantenimiento (cómo lo genera el build) vive en
> [`docs/web/features/api-datos-abiertos.md`](../web/features/api-datos-abiertos.md).

## Qué es

Una capa de **datos abiertos machine-readable** sobre el inventario: el mismo
contenido que ves en la web, servido como JSON estable para que cualquier proyecto,
investigador o periodista pueda integrarlo. El contenido editorial está licenciado
bajo **CC BY-SA 4.0** (ver [doc 05 — "Licencias"](../diseno/05-arquitectura-tecnica.md#2-licencias));
esta API sólo lo hace cómodo de consumir.

**No es una API de servidor.** No hay backend, ni base de datos, ni endpoint que
compute en tiempo de petición. Son **ficheros JSON estáticos generados en el build**
y servidos desde el CDN de Cloudflare Pages, igual que hoy se generan
[`/feed.xml` y `/rss.xml`](../web/features/feed-rss-atom.md). Coste de runtime cero,
escala a millones de peticiones, sin superficie de ataque nueva. El razonamiento, en
[`decisiones.md` — D1](decisiones.md#d1--datos-abiertos-estáticos-no-api-de-servidor).

## El modelo es un grafo, no tres listas

El inventario son **tres tipos de nodo** unidos por aristas:

- **Caso** · **Persona** · **Organización** — los nodos.
- `RolEnCaso` (persona ↔ caso), `VinculoInstitucional` (persona/org ↔ org),
  `RelacionEntreCasos` (caso ↔ caso), afectación (caso ↔ partido) — las aristas.

Lo que hace los datos *componibles* es que **cada nodo lleva sus aristas**: la ficha
de una persona lista los casos donde tiene rol; la de un caso lista sus personas,
órganos y partidos afectados. Desde cualquier nodo se puede recorrer el grafo entero.
Definición del modelo en [doc 01](../diseno/01-modelo-de-datos.md).

## Cómo se accede (patrón índice + detalle + slices)

Tres formas, combinables, ninguna necesita servidor:

1. **Índice ligero — el cliente filtra.** Un fichero por colección con una fila
   compacta por entidad (sólo los campos por los que se filtra). El consumidor lo
   descarga una vez, lo cachea, y combina los filtros que quiera en su lado. Luego
   pide el detalle sólo de lo que abra. 500 filas de índice son ~30 KB comprimidos:
   trivial. (Es el mismo patrón que ya usa Pagefind para la búsqueda.)
2. **Detalle bajo demanda.** Un fichero por entidad con el payload completo. Sólo se
   descarga el de los nodos que el cliente realmente necesita.
3. **Slices pre-construidos — filtrar por URL.** Para las facetas finitas y
   habituales (por persona, por partido, por territorio) se pre-genera el recorte en
   build, para quien quiere una URL y no escribir código de filtrado.

Nunca se mandan 500 fichas completas por defecto; eso es sólo el `dump` explícito
(abajo). Detalle del razonamiento en
[`decisiones.md` — D3](decisiones.md#d3--acceso-por-índice-detalle-y-slices).

## Catálogo de endpoints (propuesto, v1)

> Ninguno existe aún. Es el mapa objetivo.

| Ruta | Qué devuelve | Patrón |
|---|---|---|
| `/api/v1/casos.json` | Índice de casos públicos (fila ligera) | índice |
| `/api/v1/personas.json` | Índice de personas con rol en casos públicos | índice |
| `/api/v1/organizaciones.json` | Índice de organizaciones | índice |
| `/api/v1/casos/<slug>.json` | Ficha completa de un caso | detalle |
| `/api/v1/personas/<slug>.json` | Ficha completa de una persona | detalle |
| `/api/v1/organizaciones/<slug>.json` | Ficha completa de una organización | detalle |
| `/api/v1/partido/<slug>.json` | Casos que afectan a un partido (con justificación) | slice |
| `/api/v1/dump.json` | Todo el inventario público, opt-in para investigación | bulk |
| `/api/v1/datapackage.json` | Descriptor [Frictionless Data](https://frictionlessdata.io/) del dataset | contrato |
| `/llms.txt` | Punto de entrada para una IA que vaya a integrar los datos | contrato |

Los **JSON Schema** de cada entidad ya existen en [`/schemas/`](../../schemas/) y son
el contrato de forma: `caso.schema.json`, `persona.schema.json`,
`organizacion.schema.json`, `hecho.schema.json`, `documento.schema.json`,
`rol-en-caso.schema.json`, etc.

### Fila de índice de caso (boceto)

```jsonc
{
  "id": "kitchen",
  "nombre_mediatico": "Kitchen",
  "estado_publicacion": "beta_publica",
  "fase_actual": "...",
  "fecha_apertura": "YYYY-MM-DD",
  "organo_judicial_id": "...",
  "organizaciones_afectadas": [
    { "id": "ministerio-del-interior", "naturaleza": "ambito_administrativo_directo_del_acto_en_caso", "nivel_afectacion": "directa" },
    { "id": "pp", "naturaleza": "afectacion_indirecta_en_caso", "nivel_afectacion": "indirecta" }
  ],
  "personas_clave": ["...", "..."],
  "delitos": ["...", "..."],
  "importe_atribuido": null,
  "nivel_relevancia_editorial": "...",
  "url": "https://presuntamente.org/casos/kitchen"
}
```

El cliente hace `casos.filter(...)` sobre estas filas y luego pide
`/api/v1/casos/<slug>.json` de los que le interesen.

Las `organizaciones_afectadas` se resuelven inlineando los `VinculoInstitucional` del
caso (afectación, [doc 08](../diseno/08-afectacion-directa-indirecta.md#7-modelo-de-datos)):
no sólo el órgano judicial sino las administraciones afectadas y empresas implicadas, que
son las que cargan la señal territorial. Para el cruce externo, el índice de
organizaciones (`/api/v1/organizaciones.json`) lleva el `cif`/NIF de cada entidad, de
modo que un consumidor identifica las suyas por identificador estable en vez de por
nombre (ver [`decisiones.md` — D10](decisiones.md#d10--identificadores-de-organización-para-el-join-externo)).

## El sobre de metadatos (los guardarraíles viajan con el dato)

Cada respuesta lleva un objeto `meta` que hace que la presunción de inocencia y la
trazabilidad **no se queden en la web**:

```jsonc
{
  "meta": {
    "licencia": "CC BY-SA 4.0",
    "atribucion": "presuntamente.org, ficha <nombre>, consultada el <fecha>",
    "aviso": "Imputación no es condena. Cada hecho lleva su nivel de fuente (1-4) y cada rol procesal su tipo discreto y su trayectoria temporal.",
    "version": "v1",
    "generado": "<fecha de build>",
    "fuente": "https://presuntamente.org/casos/<slug>"
  },
  "datos": { /* ... */ }
}
```

Y dentro de los datos: cada `Hecho` conserva su `nivel_fuente`; cada `RolEnCaso`
conserva su tipo discreto (`investigado`, `procesado`, `acusado`, `condenado`,
`absuelto`, `desimputado`) y su trayectoria. Un consumidor que renderice
"X = corrupto" tiene que *ignorar activamente* campos que lleva delante.

## Facetas: directas vs. derivadas

- **Directas** (se dan ya, sin deuda de modelo): por persona, por organización, por
  delito, por fase, por estado, por fecha, por importe.
- **Por partido** — *derivada*, proyección de la **afectación directa/indirecta** que
  ya modela [doc 08](../diseno/08-afectacion-directa-indirecta.md). No es una
  inferencia nueva: cada inclusión arrastra su `nivel_afectacion` y su
  `justificacion_afectacion`. **No se publican agregados ni rankings por partido**
  (eso sería una afirmación política, no un dato; ver
  [`decisiones.md` — D4](decisiones.md#d4--faceta-de-partido-proyección-de-afectación-sin-agregados)).
- **Por territorio** — *no se pre-construye; se resuelve en cliente.* Cada caso expone
  sus organizaciones (administraciones afectadas y empresas implicadas, no sólo el órgano
  judicial) y el consumidor filtra cruzando con su propia lista de organismos del
  territorio, por `cif`/NIF. Así no declaramos qué caso es "de tal sitio" (mejor para la
  neutralidad) y nos ahorramos modelar territorio. Modelar nuestra propia dimensión
  territorial queda opcional y diferido. Razonamiento en
  [`decisiones.md` — D5](decisiones.md#d5--faceta-de-territorio-administración-afectada-pendiente-de-modelar)
  y [D10](decisiones.md#d10--identificadores-de-organización-para-el-join-externo).

## Visibilidad: sólo lo público

La API es **un vector de publicación más** y pasa por el mismo gate que el resto del
sitio ([`src/lib/visibilidad.ts`](../../src/lib/visibilidad.ts),
[ficha](../web/features/visibilidad-estados-publicacion.md)): sólo se serializan casos
en `beta_publica` o superior. Los borradores **no** salen por la API, igual que no
salen por la home, el feed o las OG.

## Integrar sin SDK: clonar + preguntarle a tu IA

No mantenemos SDKs por lenguaje. La apuesta es hacer el repo **legible por un LLM**:

1. Clona el repo (o apunta una herramienta tipo DeepWiki al repositorio público).
2. Tu IA lee los [JSON Schema](../../schemas/) — sus campos `description` son la
   documentación de cada propiedad — y este `README` + [`llms.txt`](#).
3. Te genera la integración a medida en tu lenguaje.

Por eso el [`llms.txt`](#) propuesto incluirá, además del mapa de endpoints, **cómo
respetar la presunción de inocencia al renderizar**: así un consumidor que se porta
bien hereda los guardarraíles editoriales sin que nosotros controlemos nada.
Razonamiento en [`decisiones.md` — D7](decisiones.md#d7--sin-sdk-legibilidad-por-llm).

### Qué llevará `llms.txt`

Un fichero servido en `https://presuntamente.org/llms.txt`, pensado para que una IA lo
lea y sepa integrar sola, sin SDK. Alguien apunta su IA a esa URL y obtiene todo lo que
necesita. Contenido objetivo:

- **Qué es** el proyecto en una línea + licencia (CC BY-SA 4.0) y la nota
  "imputación ≠ condena".
- **Qué leer** (punteros al repo de GitHub, no copia): el contrato ([`docs/api/README.md`](README.md)),
  los porqués ([`decisiones.md`](decisiones.md)) y la forma ([`/schemas/`](../../schemas/)).
- **Mapa de endpoints** y el modelo de grafo en dos líneas (cómo enlazan
  caso/persona/organización).
- **Reglas de presunción de inocencia al renderizar** — los guardarraíles que un
  consumidor debe respetar (no afirmar culpabilidad, mostrar siempre el nivel de fuente y
  el rol procesal discreto).
- **Qué puede hacer un LLM** con esto: generar un cliente, filtrar, cruzar por `cif`,
  recorrer el grafo; y **cómo refrescar** (versionado `v1`).

## Estabilidad y versionado (la promesa)

En cuanto alguien integra, los IDs y la forma son un contrato. Compromiso de la `v1`:

- **Podemos** añadir campos nuevos sin avisar.
- **No** quitamos ni renombramos campos, ni cambiamos el significado de un `id`, sin
  pasar a `v2` (ruta nueva, la `v1` se mantiene un tiempo).

Los `id`/slugs del inventario son estables por diseño. Detalle en
[`decisiones.md` — D9](decisiones.md#d9--versionado-y-promesa-de-estabilidad).
