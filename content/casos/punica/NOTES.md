# Notas internas — Caso Púnica

Esqueleto mínimo creado el 2026-05-29 (solo para aparecer "en cola" en `/casos`).
Ficha completada el 2026-05-30 con hitos, hechos, roles y caso.yaml completo.

## Decisiones editoriales

### Órgano judicial

Se usa `audiencia-nacional` como `organo_judicial_id` (órgano de enjuiciamiento).
El JCI nº 6 (`juzgado-central-instruccion-6`) aparece en los hitos y roles como
órgano instructor. Valorar en el futuro si conviene modelar el JCI nº 6 como
`organo_judicial_id` principal (instrucción más larga) y dejar la AN para las
piezas de juicio oral.

### Numeración del procedimiento

La causa se incoó como Diligencias Previas 85/2014 y se transformó más adelante
en Procedimiento Abreviado 91/2016. Ambas referencias se recogen en
`numero_procedimiento`.

### Piezas separadas

La macrocausa Púnica tiene muchas piezas. En esta ficha se han modelado:

- **Pieza filtración** (sentencia firme TS 14-mar-2019): hitos completos, rol
  condenado_firme de Granados.
- **Pieza Cofely** (sentencia AN 22-dic-2025, no firme): hitos, hechos con dinero
  y roles de Marjaliza y Cofely España.
- **Pieza suelo/obra pública (pieza 8)** (auto apertura JO 21-may-2026): hito y
  hecho de petición de pena para Granados.
- **Pieza financiación PP** (archivada oct-2022): hito de archivo modelado; roles
  archivados de Aguirre, Cifuentes e Ignacio González en esta pieza específica
  NO modelados aún (falta verificar condición procesal exacta en esta pieza,
  distinta de sus condiciones en Lezo u otras causas).

### Granados: trayectoria procesal por piezas

- Investigado (macrocausa, desde 27-oct-2014).
- Condenado firme (pieza filtración, desde 14-mar-2019): 2 años de prisión por
  revelación de secretos.
- Acusado (pieza 8, desde 21-may-2026): 42 años pedidos por la Fiscalía.

Los tres roles coexisten porque pertenecen a piezas distintas.

### Ignacio González en Púnica

Ignacio González aparece en el hito de archivo de la pieza de financiación del PP
(2022). Su rol principal está modelado en el caso Lezo; en Púnica solo se menciona
de pasada en ese hito. No se ha creado rol específico en Púnica para González
porque el archivo elimina su condición procesal en esta pieza.

## Pendientes

- **Sentencia íntegra pieza Cofely**: pendiente de aparecer en CENDOJ. Cuando
  se indexe, crear Documento N1 con ruta_local + hash_sha256 y afinar citas de
  pasaje en los hechos.
- **Piezas menores**: Arpegio (empresa pública de suelo, vinculada a la pieza 8),
  posibles piezas en León, Murcia, Valencia. Requieren revisión de fuentes.
- **Roles de los 40 acusados adicionales en pieza 8** distintos de Granados: la
  cobertura disponible (N4) no individualiza suficientemente; esperar a fuente
  primaria o lista oficial de la AN.
- **Roles archivados** de Esperanza Aguirre, Cristina Cifuentes, Ignacio González
  y exconsejeros en la pieza de financiación PP: modelar con `rol: desimputado` y
  `hito_fin_id: archivo-financiacion-pp-punica-2022-10-14` cuando se confirme la
  condición procesal exacta de cada uno en esa pieza.
- **Cruce con Gürtel y barcenas-caja-b**: ambas macrocausas comparten la presunta
  financiación irregular del PP de Madrid; Púnica tiene su pieza archivada, Gürtel
  tiene otra. Modelar RelacionEntreCasos cuando el agente de Reconciliación
  procese los vínculos.
- **Condena firme pieza filtración**: candidato a `Hecho.tipo = acreditado` una
  vez revisado por el maintainer (sentencia firme TS 2019 que declara hechos
  probados). Actualmente `tipo: atribuido` por guardarrail de no-promoción
  automática. El hecho exacto a promover sería la filtración como hecho acreditado
  respecto de Granados.
- **pendiente_primario**: nota CGPJ del auto de apertura de la pieza de
  financiación PP y autos intermedios relevantes no localizados en poderjudicial.es.

## Fuentes cruzadas usadas

- Nota CGPJ condena Cofely (N1): poderjudicial.es 22-dic-2025.
- eldiario.es condena Cofely (N4 línea 1): 22-dic-2025.
- Infobae condena Cofely (N4 línea 2): 22-dic-2025.
- The Objective condena Cofely (N4 línea 3): 22-dic-2025.
- Público apertura JO pieza8 (N4 línea 1): 26-may-2026.
- Infobae apertura JO pieza8 (N4 línea 2): 26-may-2026.
- El Debate apertura JO pieza8 (N4 línea 3): 27-may-2026.
- Nota CGPJ archivo financiación PP (N1): oct-2022.
- El Español detenciones Púnica (N4): 27-oct-2014.
- Público conformidad Marjaliza (N4): dic-2025.
- Nota CGPJ condena filtración (N1 citada en hito, documento pendiente de
  localización exacta en poderjudicial.es).

## Anotaciones migradas desde comentarios YAML (2026-06-02)

Notas internas que vivían como comentarios `#` dentro de bloques de texto YAML, donde se renderizaban en el sitio público (ver regla V-26 en doc 01). Reubicadas aquí; el YAML quedó limpio.

- **`roles/comunidad-madrid-perjudicado-punica.yaml`** — La personación formal como acusación particular o la condición de perjudicado de cada administración local concreta no se ha verificado pieza por pieza; revisar al modelar las piezas menores.
- **`../../documentos/elespanol-detenciones-punica-2014-10-27.yaml`** — `url_canonica` apunta a la cobertura retrospectiva de El Español sobre el patrimonio oculto de Granados (nov-2015), pieza localizada con fecha y autoría verificables; sustituir por una pieza fechada el 27-oct-2014 (día de las detenciones) en una pasada futura.
