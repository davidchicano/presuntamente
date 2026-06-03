# Decisiones de diseño — API de datos abiertos

> Registro del **por qué** detrás de la API. Cada entrada deja el contexto, las
> opciones que se consideraron, la elegida y sus consecuencias, para que cualquiera
> que entre después entienda el razonamiento sin haber estado en la conversación.
> El contrato resultante vive en [`README.md`](README.md).
>
> **Estado global: DISEÑO.** Nada de esto está implementado todavía; son las
> decisiones tomadas antes de escribir código.

## Índice

- [D1 — Datos abiertos estáticos, no API de servidor](#d1--datos-abiertos-estáticos-no-api-de-servidor)
- [D2 — El inventario se expone como grafo de tres entidades](#d2--el-inventario-se-expone-como-grafo-de-tres-entidades)
- [D3 — Acceso por índice, detalle y slices](#d3--acceso-por-índice-detalle-y-slices)
- [D4 — Faceta de partido: proyección de afectación, sin agregados](#d4--faceta-de-partido-proyección-de-afectación-sin-agregados)
- [D5 — Faceta de territorio: administración afectada, pendiente de modelar](#d5--faceta-de-territorio-administración-afectada-pendiente-de-modelar)
- [D6 — Documentación externa (docs/api) separada de la interna (feature)](#d6--documentación-externa-docsapi-separada-de-la-interna-feature)
- [D7 — Sin SDK: legibilidad por LLM](#d7--sin-sdk-legibilidad-por-llm)
- [D8 — Visibilidad: la API es un vector más del gate](#d8--visibilidad-la-api-es-un-vector-más-del-gate)
- [D9 — Versionado y promesa de estabilidad](#d9--versionado-y-promesa-de-estabilidad)
- [D10 — Identificadores de organización para el join externo](#d10--identificadores-de-organización-para-el-join-externo)

---

## D1 — Datos abiertos estáticos, no API de servidor

**Contexto.** Llega la petición (Menjòmetre, junio 2026) de exponer los datos para
que terceros los integren. El sitio es Astro estático sobre Cloudflare Pages.

**Opciones.**
- **L0** — el repo git ya es público (CC BY-SA): "clona y lee los YAML". Existe, pero
  un árbol de YAML con estructura interna y `NOTES.md` excluidos no es un *contrato*.
- **L1** — snapshots JSON estáticos generados en build. Mismo patrón que el feed.
- **L2** — Cloudflare Pages Functions (cómputo al edge) para consultas dinámicas.
- **L3** — backend con base de datos.

**Decisión.** **L1.** El núcleo de la API son ficheros JSON estáticos servidos por el
CDN. L2 se reserva para si el inventario crece a decenas de miles de registros; L3 se
descarta.

**Razón.** En arquitectura estática el cuello de botella no es el ancho de banda
(ficheros cacheados, gratis, infinitos) sino el cómputo, y el cómputo lo podemos hacer
**en build**. L1 no añade servidor, ni BD, ni superficie de ataque, y hereda el deploy
automático en `main`. Encaja con [doc 05 — "Arquitectura"](../diseno/05-arquitectura-tecnica.md).

**Consecuencias.** El filtrado dinámico no se resuelve en el servidor sino con índice
+ cliente (ver [D3](#d3--acceso-por-índice-detalle-y-slices)). A escala de cientos —
incluso miles — de casos es de sobra suficiente.

---

## D2 — El inventario se expone como grafo de tres entidades

**Contexto.** ¿Qué es "la unidad" de la API? ¿Casos? ¿Una lista plana?

**Opciones.**
- Exponer sólo casos.
- Exponer tres colecciones independientes (casos, personas, organizaciones).
- Exponer las tres entidades **como grafo**, cada nodo con sus aristas.

**Decisión.** Grafo de **Caso · Persona · Organización**, donde cada nodo serializa
sus aristas (`RolEnCaso`, `VinculoInstitucional`, `RelacionEntreCasos`, afectación).

**Razón.** El inventario *es* un grafo ([doc 01](../diseno/01-modelo-de-datos.md)). La
composabilidad nace de poder recorrerlo desde cualquier nodo: desde una persona llegar
a sus casos, desde un caso a sus organizaciones y partidos afectados. Tres listas
inconexas obligarían al consumidor a reconstruir las relaciones a mano.

**Consecuencias.** Toda faceta derivada (partido, territorio) es una *proyección sobre
el grafo*, no una cuarta entidad. Eso simplifica el modelo y es lo que resuelve la
faceta de partido sin afirmar ideología (ver [D4](#d4--faceta-de-partido-proyección-de-afectación-sin-agregados)).

---

## D3 — Acceso por índice, detalle y slices

**Contexto.** Con cientos de casos no se quiere mandar todo en cada consulta, pero
tampoco montar un servidor de consultas (descartado en [D1](#d1--datos-abiertos-estáticos-no-api-de-servidor)).
¿Cómo se filtra en algo estático?

**Opciones.**
- Pre-construir en build todas las combinaciones de filtros (explota
  combinatoriamente).
- Mandar el dataset completo y que el cliente haga todo (manda fichas completas de más).
- **Índice ligero + detalle bajo demanda + slices pre-construidos para lo común.**

**Decisión.** La tercera. Un **índice compacto** por colección (una fila por entidad,
sólo campos de filtrado) que el cliente descarga una vez y filtra en su lado; **fichas
de detalle** que se piden sólo de lo que se abra; y **slices pre-construidos** por URL
para las facetas finitas y habituales.

**Razón.** Separa lo barato de mandar (índice: ~30 KB comprimido para 500 casos) de lo
caro (fichas completas). El cliente combina filtros arbitrarios sobre el índice sin que
nosotros anticipemos cada combinación, y sólo paga ancho de banda por el detalle que
usa. Es exactamente el modelo de Pagefind, ya probado en el stack.

**Consecuencias.** El `dump.json` completo existe pero es opt-in (investigación), no la
ruta por defecto. La distinción "mandar 500 filas de índice" (trivial) vs "mandar 500
fichas completas" (pesado) es la que deshace la preocupación inicial de volumen.

---

## D4 — Faceta de partido: proyección de afectación, sin agregados

**Contexto.** Un consumidor querrá "los casos del partido X". Pero afirmar "este caso
es del PSOE" choca con el principio **vínculos ≠ ideología** y con el tratamiento sin
cuota política. A la vez, si no ofrecemos nada, cada consumidor inventará su propia
regla de atribución, mal y con sesgo distinto.

**Opciones.**
- No ofrecer nada de partido (cada uno se lo monta → inconsistente, incontrolable).
- Modelar "partido" como atributo nuevo del caso (afirmación editorial nueva y cargada).
- **Proyectar la faceta desde la afectación ya modelada.**

**Decisión.** La faceta de partido es una **proyección de la afectación
directa/indirecta** que ya define [doc 08](../diseno/08-afectacion-directa-indirecta.md).
Un caso aparece bajo un partido porque ya tiene una afectación documentada, y el slice
**arrastra su `nivel_afectacion` y su `justificacion_afectacion`**. Además: **no se
publican agregados ni rankings por partido**.

**Razón.** Así la faceta no es una inferencia nueva sino la misma información sourced y
prudente que ya muestra la web (la afectación tiene reglas explícitas, incluida "Regla
5 — acusación popular constituida por un partido = NO afectada"). La consistencia la
fijamos nosotros, de forma auditable (cada inclusión muestra su trabajo), en lugar de
dejar que cada tercero la reconstruya. Y se traza la línea clave: publicar *los enlaces
documentados* es dato; publicar *"PP: 12, PSOE: 8"* es un marcador político —
metodológicamente basura (refleja lo modelado, la saliencia mediática y la
centralización judicial, no la corrupción real) y contrario a "sin cuota política". Si
alguien quiere contar, que sea su acto editorial, no el nuestro.

**Consecuencias.** El slice `/api/v1/partido/<slug>.json` es viable ya (se apoya en
afectación). La API nunca emite conteos por partido. Relación con
[`partidos-afectados`](../web/features/partidos-afectados.md) y
[`partido-badge`](../web/features/partido-badge.md).

---

## D5 — Faceta de territorio: administración afectada, pendiente de modelar

**Contexto.** La petición concreta de Menjòmetre es "casos de Catalunya". Hoy el
territorio sólo existe a nivel del **órgano judicial** (`comunidad_autonoma` en
organizaciones de tipo juzgado/tribunal), y es **mal proxy**: la Audiencia Nacional y
el Tribunal Supremo centralizan en Madrid, así que casos catalanes de peso (Palau,
parte de Pujol) se juzgan fuera de Cataluña.

**Opciones de definición del "territorio de un caso".**
1. Territorio del **órgano que lo juzga** — el peor proxy (centralización).
2. Territorio de los **hechos** — dónde ocurrió la presunta irregularidad.
3. Territorio de la **administración afectada** — qué poder público / presupuesto se
   abusó (Generalitat, Junta de Andalucía, ayuntamiento, Estado).
4. Territorio de las **personas** — de dónde son / dónde tienen cargo (multivaluado y
   sucio).

**Decisión (propuesta, no ejecutada).** Definir el territorio de un caso como el de
la(s) **administración(es) pública(s) cuya competencia o presupuesto es objeto de la
presunta irregularidad** (opción 3), posiblemente combinada con la opción 2, y como
campo **multivaluado** (`territorios[]`).

**Razón.** La corrupción es abuso de un poder público; el territorio que "posee" ese
poder es el hogar natural del caso, y casa con la intuición mucho mejor que dónde se
juzga (Palau/Pujol → Generalitat → Cataluña; ERE → Junta de Andalucía → Andalucía). Es
**documentable**: ya modelamos organizaciones perjudicadas y la taxonomía de afectación
([doc 08 — "Modelo de datos"](../diseno/08-afectacion-directa-indirecta.md#7-modelo-de-datos)),
y la administración afectada tiene territorio. Extiende un eje existente en vez de ser
un campo suelto.

**Consecuencias.** Es una **decisión de modelo pendiente** ([doc 01 — "Cuestiones
abiertas"](../diseno/01-modelo-de-datos.md#7-cuestiones-abiertas-parking-lot)), no de
la API. La regla debe derivar de un hecho modelado (la administración perjudicada), no
del "donde salió en prensa".

**Actualización (Menjòmetre, junio 2026): el filtro territorial se resuelve en
cliente, no lo pre-construimos.** Menjòmetre propuso no mapear nosotros la lógica
caso → territorio, sino que **expongamos las organizaciones de cada caso** y que el
consumidor cruce con su propia lista de organismos del territorio (en su caso, los
catalanes). Se adopta. Consecuencias:

- **Se retira el slice pre-construido `/api/v1/territorio/<ca>.json`.** La faceta
  territorial deja de depender de modelar territorio en `Caso`.
- **Mejor para la neutralidad**: no afirmamos "caso catalán"; exponemos "el caso afecta
  a la organización X" y el consumidor decide. El juicio territorial se va al consumidor.
- Modelar nuestra propia dimensión territorial (la opción 3 de arriba) pasa de
  **bloqueante** a **opcional y diferido**: sólo si algún día queremos un filtro
  territorial en *nuestra* UI.
- **Requisito para que funcione**: el payload del caso debe inlinear no sólo el
  `organo_judicial_id` (que centraliza en Madrid) sino las **administraciones afectadas
  y empresas implicadas**, que ya se modelan vía `VinculoInstitucional`
  ([doc 08 — "Modelo de datos"](../diseno/08-afectacion-directa-indirecta.md#7-modelo-de-datos))
  con `relevancia_para_caso_ids`. Es serialización del grafo
  ([D2](#d2--el-inventario-se-expone-como-grafo-de-tres-entidades)), no un hueco de
  modelo: verificado en junio 2026 que el modelo ya enlaza esas organizaciones al caso.
- El join externo necesita un identificador estable de organización → ver
  [D10](#d10--identificadores-de-organización-para-el-join-externo).

---

## D6 — Documentación externa (docs/api) separada de la interna (feature)

**Contexto.** ¿Dónde se documenta esto? El proyecto ya tiene fichas de feature en
`docs/web/features/`.

**Decisión.** **Dos documentos, dos audiencias.**
- [`docs/api/`](.) — el **contrato externo**, escrito para quien consume (este
  `README`, las `decisiones`, referencia de schemas, guía de integración). Canon de
  cara afuera; parte se servirá también en el sitio vivo.
- [`docs/web/features/api-datos-abiertos.md`](../web/features/api-datos-abiertos.md) —
  la ficha **interna** de mantenimiento (cómo lo genera el build, call-sites,
  pendientes), que AGENTS.md exige igual para toda feature transversal. Fina, apunta a
  `docs/api/` como canon.

**Razón.** Audiencia opuesta: el de fuera lo lee un tercero (o su IA); el de dentro, un
agente/maintainer. Colapsarlos rompería la norma de
[centralización documental](../../AGENTS.md#centralización-documental) ("cada ficha
documenta sólo lo suyo; lo transversal en su canon").

**Consecuencias.** El detalle del contrato no se duplica en la ficha de feature; se
enlaza.

---

## D7 — Sin SDK: legibilidad por LLM

**Contexto.** ¿Damos clientes/SDKs para integrar? Mantener SDKs por lenguaje es una
carga enorme para un proyecto open pequeño.

**Decisión.** **No SDK.** Se hace el repo legible por un LLM: schemas publicados con
buenas `description`, un `README` de integración y un `llms.txt` de entrada. El
consumidor apunta su IA (o una herramienta tipo DeepWiki) al repo y genera la
integración a medida.

**Razón.** "Buenos schemas + guía legible + un LLM" *son* el SDK, y se mantienen solos.
El modelo además perdona los cambios mejor que un SDK tipado: la IA re-lee en cada
integración. Punto clave: la guía de integración llevará **cómo respetar la presunción
de inocencia al renderizar**, de modo que el consumidor que se porta bien herede los
guardarraíles editoriales.

**Consecuencias.** Las `description` de los [JSON Schema](../../schemas/) pasan a ser
documentación cargante, no sólo validación: hay que cuidarlas. El `llms.txt` es un
entregable de la feature, no un extra.

---

## D8 — Visibilidad: la API es un vector más del gate

**Contexto.** El 2026-06-02 se blindó "borrador no sale en prod" en todos los vectores
(página, home, feed, índices, OG…) con [`src/lib/visibilidad.ts`](../../src/lib/visibilidad.ts).

**Decisión.** La API **reutiliza ese mismo helper sin excepción**: sólo serializa casos
en `beta_publica` o superior.

**Razón.** Una API que vuelque `content/` sería un vector nuevo capaz de filtrar los
casos en borrador (rol, delitos, bio, hitos). Tratarla como un vector de fuga más, igual
que los demás, evita una divergencia silenciosa.
[Ficha de visibilidad](../web/features/visibilidad-estados-publicacion.md).

**Consecuencias.** El build de la API debe pasar por `visibilidad.ts`; el barrido
anti-fugas de `dist/` debe cubrir también `/api/`.

---

## D9 — Versionado y promesa de estabilidad

**Contexto.** En cuanto alguien integra contra `/api/...`, la forma y los IDs son un
contrato; romperlos lo rompe en silencio.

**Decisión.** Ruta versionada (`/api/v1/...`) + promesa explícita: **se pueden añadir
campos sin avisar; no se quitan ni renombran campos ni se cambia el significado de un
`id`** sin pasar a `v2` (ruta nueva, la `v1` se mantiene un tiempo).

**Razón.** Los slugs/`id` del inventario ya son estables por diseño. El `v1` en la ruta
da margen para evolucionar sin romper integraciones vivas; el modelo "clonar + IA"
amortigua el resto.

**Consecuencias.** Coste casi nulo hoy; ahorra disgustos cuando haya consumidores
reales. Sobre de metadatos lleva `version` para que el consumidor lo compruebe.

---

## D10 — Identificadores de organización para el join externo

**Contexto.** Para que un tercero (Menjòmetre y cualquiera) cruce *sus* organizaciones
con las nuestras de forma limpia hace falta un identificador estable. El match por
nombre es frágil (abreviaturas, acentos, razón social vs nombre común). Surge al
adoptar el filtro territorial en cliente ([D5](#d5--faceta-de-territorio-administración-afectada-pendiente-de-modelar)).

**Estado del modelo.** `Organizacion.cif` **ya existe** en el schema (opcional, "sólo si
es público y verificado en registros oficiales"). Cobertura en junio 2026: **1 de 137**
(sólo `plus-ultra-lineas-aereas`). En la práctica, vacío.

**Decisión.**
- **Poblar `cif`/NIF** para las organizaciones de tipo entidad (empresa,
  organismo_publico/administración, partido_politico, fundación, entidad_financiera,
  asociación, medio…) presentes en los casos `beta_publica`+, con verificación en
  registro oficial (BORME para empresas, Registro de Partidos, fuentes oficiales para el
  NIF de administraciones). Los **órganos judiciales** (juzgado/tribunal/fiscalía) **no
  tienen CIF propio** y se dejan vacíos — y no son por los que se filtra territorio.
- **Valorar identificadores hermanos** como ampliación futura: **DIR3** (código canónico
  de unidad orgánica de la administración española, mejor que el NIF para administraciones
  y enlaza con contratación/transparencia) y **QID de Wikidata** (join universal,
  agnóstico de idioma). Posible modelado en un objeto `identificadores: { cif, dir3,
  wikidata }` cuando se aborde.

**Razón.** El CIF/NIF es el identificador canónico español de entidad; convierte el join
de "fuzzy por nombre" a "exacto por id", y es un multiplicador de composabilidad (enlaza
con BORME, contratación pública, portales de transparencia). Para entidades jurídicas es
dato público.

**Consecuencias.**
- **Tarea de contenido**: poblar el `cif` de las orgs entidad en casos beta+ (sweep
  verificado contra registros oficiales). Donde no haya fuente oficial, se deja vacío y
  se anota en el `NOTES.md` del caso.
- **Guardarraíl de privacidad**: el `cif` vive sólo en `Organizacion`; **nunca** se
  expone el NIF/DNI de una persona física (cuidado con autónomos cuyo "organismo" sea en
  realidad su NIF personal).

---

## Sobre la propagación de datos a terceros (asumida)

Decisión transversal del maintainer (junio 2026): **se asume el coste de propagación.**
Una vez los datos salen (y el repo ya es público y CC BY-SA), una anonimización (V-17) o
una rectificación posterior no se puede retraer en copias cacheadas aguas abajo. Se
acepta porque es inevitable en cualquier proyecto abierto; el trabajo es hacer lo propio
bien y poner guardarraíles razonables (el sobre de metadatos, los niveles de fuente y
los roles discretos que viajan con el dato), no construir una jaula imposible. El marco
legal/ético de fondo está en [doc 04](../diseno/04-riesgos-legales-y-eticos.md).
