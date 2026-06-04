# Histórico operativo — junio 2026

Detalle largo de las sesiones de junio 2026. El resumen vivo está en [`ROADMAP.md`](../../ROADMAP.md).

## 2026-06-02 — Visibilidad de borradores blindada + lote 1 de promoción

Gate "borrador no sale en prod" extendido a TODOS los vectores (fichas persona/org, feed, índices, `/cifras`, `/delitos`, OG, auto-enlaces `RichProse`) con el helper central [`src/lib/visibilidad.ts`](../../src/lib/visibilidad.ts). Build prod 8 casos / 90 personas / 82 orgs; `dist/` 0 fugas + 0 enlaces colgantes; `validate` 1359 OK. Ficha canónica: [`visibilidad-estados-publicacion.md`](../web/features/visibilidad-estados-publicacion.md). En la misma sesión, **lote 1 de promoción** (`noos`, `malaya`, `palau-musica`, `tarjetas-black` → `beta_publica`, panel 3/3 VERDE) y roles de Pujol actualizados (7 hijos→`acusado`, Pujol Soley→`desimputado`).

## 2026-06-03 — Cierre de los 8 borradores restantes (panel de promoción)

Sesión para "atar los cabos" pendientes tras el lote 1 de promoción: las 4 incertidumbres de Pujol, la sugerencia de malaya y el panel `/promover-caso` sobre los 8 borradores.

### Pujol — 4 incertidumbres resueltas + cuadro procesal completo

Investigación web cruzada (Confilegal, elDiario.es, El Español, Público, El Nacional; nota CGPJ N1 de la apertura). Todo sigue `investigado`/`atribuido` (no hay sentencia; presunción intacta).

1. **`fecha_inicio` de los roles `acusado`** → `2021-06-15` (auto de apertura de juicio oral de Pedraz) + `hito_origen_id`, conforme a la convención del doc 01 (§2.4: fecha del acto que abre el rol).
2. **`cohecho`** retirado de Jordi Pujol Ferrusola y de la unión del caso: el escrito de acusación no se lo imputa (4 fuentes; lo corrobora la nota CGPJ N1 de la apertura, que enumera asociación ilícita, blanqueo, falsedad y Hacienda, sin cohecho).
3. **Cuadro procesal completo**: modelados Mercè Gironès (17 años) y 9 empresarios acusados (5 años c/u): 10 personas + 10 roles nuevos, `es_figura_publica: false` por minimización. Carles Vilarrubí no modelado (fallecido, acusación retirada).
4. **Fecha del hito de apertura** corregida (2021-01-01/anio → 2021-06-15/dia). Auto de transformación a PA: fecha confirmada (16-jul-2020, De la Mata).

Taxonomía: "asociación ilícita" se mapea a la ranura existente `organizacion-criminal` (no hay entidad `asociacion-ilicita`); flag en NOTES para crear la entidad y reclasificar cuando se localice el escrito íntegro. Alzamiento de bienes no modelado (sin entidad-delito).

### malaya

`malaya-expolio-municipal`: `nivel_fuente_efectivo` 1→4 (la cifra de 92 M€ descansa en El Debate N4; la nota CGPJ N1 respalda la reversión de bienes, no la cifra). Comentarios `#` internos migrados a NOTES.

### eres-andalucia y tándem — firmeza verificada, se quedan en borrador

- **ERE**: el TS condenó (2022), el TC anuló/matizó (2024), y la AP de Sevilla **suspendió** la nueva sentencia (jul-2025) esperando una cuestión prejudicial al TJUE. Sin sentencia nueva a jun-2026. Firmes solo periféricas (pieza ACYCO TS dic-2024; Barberá; Viera/Márquez). Los altos cargos (Griñán, Chaves…) NO firmes.
- **Tándem**: ninguna condena firme a jun-2026 (Iron/Land/Pintor en apelación AN sept-2025, recurrible en casación; Dina 1ª instancia may-2026; Villarejo no firme).

### Panel `/promover-caso` + re-panel

- **Panel (18 evaluadores Sonnet ciegos, 3×6)**: VERDE `barcenas-caja-b`, `atico-estepona`; ROJO `punica`, `filesa`, `forum-filatelico`, `pujol` — todos true positives:
  - punica: doc `nota-cgpj-condena-filtracion-punica-2017-12-04` referenciado por 2 hitos pero inexistente (V-12); `fase_actual: juicio_oral` vs último hito `fase_intermedia`.
  - filesa: rol `sala-griso-condenado-firme` afirmaba que el TC "estimó parcialmente" el amparo cuando la STC 124/2001 lo desestimó íntegramente (contradecía su propio doc N1 + NOTES; público).
  - forum: hecho `ff-procesamiento-32-personas-perjuicio` (`investigado`) con una sola fuente N4 (V-13).
  - pujol: voto dividido sobre dos docs N1 sin `url_canonica`.
- **Arreglos** (investigación delegada + verificación propia de URLs con WebFetch): creados 2 docs N1 de punica (notas CGPJ AN-2017 + TS-2019 firme, URL oficial verificada); 2ª línea editorial (Confilegal) en forum; corregido el rol de filesa; corregida la fase de punica; URL+fecha verificadas en los docs de pujol (apertura → nota CGPJ pública que corrobora los delitos; transformación → 16-jul-2020, sigue `acceso_restringido`).
- **Re-panel (12 evaluadores)**: VERDE 3/3 los cuatro. Refinamiento del rubro: **A3 NO exige `url_canonica` en docs N1** (un N1 `acceso_restringido_pero_citable` es legítimo para Puerta A; la falta de URL es `pendiente_primario` de Puerta B). Documentado en el `## Histórico` de la skill.
- **Autorización del maintainer**: los **6 → `beta_publica`** (incluido pujol, tras confirmar que tiene N1 para el armazón: notas CGPJ apertura + inicio vista oral, auto transformación N1, informe UCO N2).

### Estado técnico

`pnpm validate` 1382 OK; build limpio (los 6 casos generan ruta; eres/tándem ocultos; personas nuevas de Pujol con página); 0 fugas.

### Pendientes abiertos

- Escrito de acusación íntegro de Pujol (detalle cargos/penas por persona, hoy N4) + sentencia ~jul-2026.
- eres/tándem: revisar firmeza (ERE → resolución del TJUE; Tándem → casación TS).
- `archive:catchup` de los N4 nuevos (requiere red).
- Crear entidad-delito `asociacion-ilicita` y reclasificar Pujol/filesa cuando proceda.

## 2026-06-03 — API de datos abiertos (diseño, no implementado)

A raíz de una petición pública de Menjòmetre (integrar los datos del inventario, en concreto "casos de Catalunya" y una posible API), se diseñó y **documentó** la capa de datos abiertos **sin tocar código**. Canon en [`docs/api/`](../api/README.md): contrato ([`README.md`](../api/README.md)), registro de decisiones D1-D10 ([`decisiones.md`](../api/decisiones.md)) y ficha interna ([`api-datos-abiertos.md`](../web/features/api-datos-abiertos.md)).

Decisiones clave: datos JSON estáticos sobre Cloudflare Pages (sin servidor, mismo patrón que el feed); grafo caso/persona/organización con aristas inlineadas; acceso índice ligero + detalle bajo demanda + slices pre-construidos; faceta de partido como proyección de la afectación ([doc 08](../diseno/08-afectacion-directa-indirecta.md#7-modelo-de-datos)), sin agregados/rankings; **filtro territorial resuelto en cliente** vía organizaciones (el consumidor cruza por `cif`/NIF; descartado pre-construir `/territorio/`; modelar territorio en `Caso` queda diferido); sin SDK (`llms.txt` + schemas legibles por IA); propagación de datos a terceros asumida por el maintainer.

Verificado que el modelo ya enlaza administraciones afectadas y empresas implicadas al caso vía `VinculoInstitucional` (no hay hueco de modelo; es serialización del grafo).

Pendiente al implementar: endpoints estáticos `/api/v1/`; **poblar `cif`/NIF** de las orgs entidad de los casos beta+ (hoy 1/137, fuentes oficiales: BORME, Registro de Partidos, NIF de administraciones); `llms.txt`; valorar DIR3/Wikidata; gate `visibilidad.ts` + barrido anti-fugas sobre `/api/`.

## 2026-06-04 — Regla 7 de afectación + leire-diez al día + Astro 6

- **Regla 7 del [doc 08](../diseno/08-afectacion-directa-indirecta.md#aplicación-de-la-regla-7-2026-06-04):** partido cuya caja/financiación es **objeto** del procedimiento → afectación **directa** (naturaleza `caja_partido_objeto_investigacion_en_caso`). Aplicada a `leire-diez`, `filesa`, `barcenas-caja-b`, `gurtel`; `palau-musica`, `punica` y `pujol` siguen indirecta.
- **`leire-diez` al día:** hito del levantamiento parcial del secreto del sumario (auto Pedraz 1-jun-2026 + nota CGPJ N1). Detalle en [`NOTES` leire](../../content/casos/leire-diez/NOTES.md).
- **Infra/tooling:** fix de `scripts/archivar-n4.mjs` (bug con `url_canonica` plegada; reparadas 3 fichas caja-b). Antes en la misma tanda: migración a **Astro 6 (6.4.2)** y adaptación del render de OG images.
- **Fix de IDs duplicados en collections anidadas:** las collections `roles`/`hitos`/`hechos` derivaban el id de Astro sólo de `data.id` (único **únicamente dentro de su caso**) → dos casos con el mismo `data.id` (p. ej. Ruz `juez_instructor` en bárcenas-caja-b, gürtel, forum-filatelico) colisionaban y uno sobrescribía al otro: **pérdida silenciosa de datos en build**. Fix en [`src/content.config.ts`](../../src/content.config.ts): id de collection `<caso>/<data.id>` (helper `generateIdConCaso`). No cambia ningún `data.id`, anclas ni feed (la app filtra por `caso_id`). `build` 0 warnings (antes 9).
