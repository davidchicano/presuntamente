# NOTES — caso Gürtel

Anotaciones internas. EXCLUIDO del build público.

## Alcance del modelado inicial (2026-05-30)

Arranque completo del caso a partir del esqueleto de cabecera ya
existente. El modelado se ha centrado en la columna vertebral del
macroprocedimiento:

- **Época I (1999-2005)**: sentencia 20/2018 de la Audiencia Nacional
  (Sección 2ª Sala de lo Penal; fechada 17-may, pública 24-may-2018;
  ponente formal Julio de Diego, ponencia inicial de Ángel Hurtado que
  quedó en minoría, voto particular de José Ricardo de Prada) y su
  confirmación firme por el Tribunal Supremo (sentencia 507/2020 del
  14-oct-2020, ECLI:ES:TS:2020:3191, ponente Juan Ramón Berdugo). Es la
  pieza con respaldo N1 más sólido (dos notas oficiales del CGPJ).
- **Origen 2009 + cambio de instructor 2010** (Garzón → Ruz),
  respaldado por cobertura N4 cruzada (El País + Público) por no
  haberse localizado nota CGPJ ni auto de incoación público.
- **Pieza valenciana firme** (visita del Papa a Valencia 2006),
  confirmada por el TS en abril de 2023, con N4 cruzado (El Español +
  eldiario.es). Pendiente nota CGPJ o ECLI.

Quedan SIN modelar a propósito (scope para PR2+), para no inflar el
arranque y porque exigen primarios adicionales:

- Piezas Boadilla (con condena al PP de 204.000 € a título lucrativo,
  abril 2022), Majadahonda, Pozuelo (detalle propio), Fundación,
  financiación del PP, Fitur con detalle de penas.
- Roles de segundo nivel: Ricardo Costa, cargos valencianos (Milagrosa
  Martínez, Juan Cotino), cargos madrileños (Alberto López Viejo,
  Guillermo Ortega, Jesús Sepúlveda), etc. No se han creado sus
  personas para no fichar a medias.
- Pieza de los trajes de Francisco Camps: NO se ha tocado. Camps fue
  ABSUELTO por un jurado popular en 2012; modelarlo exige cuidado para
  no insinuar culpabilidad y queda para una pasada específica con su
  primario. (En 2025 está en juicio la pieza Orange Market, que vuelve
  a sentar a Camps en el banquillo; pendiente cuando haya sentencia.)

## Promovidos a `acreditado` (revisión maintainer 2026-05-30, V-04)

Realizada la revisión humana autorizada por el maintainer el 2026-05-30.
Las dos notas CGPJ N1 (poderjudicial.es) se verificaron accesibles en
esa fecha. Los pasajes se actualizaron con citas literales localizadas.

- `condena-firme-correa-crespo-epoca-i` — PROMOVIDO a `acreditado`.
  Respaldo N1: nota CGPJ TS 2020 (URL verificada). Pasaje actualizado
  con penas exactas de cada condenado y referencia a ECLI:ES:TS:2020:3191.
- `pp-participe-titulo-lucrativo` — PROMOVIDO a `acreditado`.
  Respaldo N1: notas CGPJ AN 2018 y TS 2020 (ambas URLs verificadas).
  Pasajes actualizados con desglose exacto (133.628,48 + 111.864,32 €).
- `red-adjudicaciones-comisiones-correa` — PROMOVIDO a `acreditado`.
  Respaldo N1: notas CGPJ AN 2018 y TS 2020 (URLs verificadas). Pasajes
  actualizados con referencia a delitos declarados probados y confirmación
  en casación.

Adicionalmente:

- `condena-firme-piezas-valencianas-papa` — NO PROMOVIDO a `acreditado`
  (ver "No promovidos" abajo). Se localizó la nota CGPJ N1 para la pieza
  (ECLI:ES:TS:2023:1286, 10-abr-2023); se creó el Documento
  `nota-cgpj-sentencia-gurtel-visita-papa-ts-2023` y se actualizó el
  hecho para añadirlo como primer respaldo (nivel_fuente_efectivo
  subido a 1). El tipo sigue `atribuido` porque la N1 no detalla penas
  individuales por acusado (ese dato permanece en las fuentes N4).
  El hito `gurtel-sentencia-firme-visita-papa-2023` actualizado para
  apuntar a la nota CGPJ como `documento_principal_id`.

`condena-no-firme-correa-crespo-epoca-i` se deja como `superado`
(vigencia) y `corregido_por` la versión firme, conservando el
histórico de la sentencia de instancia.

## Candidatos pendientes (no promovidos en rev. 2026-05-30)

- `condena-firme-piezas-valencianas-papa` — La nota CGPJ N1
  (ECLI:ES:TS:2023:1286) confirma firmeza y sobrecoste global
  (3.205.375,11 €) pero NO incluye penas individuales por acusado.
  Las penas de Correa (13a 7m) y El Bigotes (6a 9m) proceden de
  cobertura N4. Para promover el hecho completo a `acreditado` se
  necesita o bien la sentencia íntegra en CENDOJ o una nota CGPJ
  con penas desglosadas.
  Opción de resolución: buscar la sentencia íntegra en CENDOJ por
  ECLI:ES:TS:2023:1286 cuando se tenga acceso (no intentado en esta
  sesión porque la tarea no autorizaba descarga de PDF).

## Importe estructurado

Solo se ha estructurado una cifra: los **245.492,80 €** de
responsabilidad civil a título lucrativo del PP (N1, firme,
desglosable en 133.628,48 Majadahonda + 111.864,32 Pozuelo). Es
clase `consecuencia` / `responsabilidad_civil`, papel `obligado`. La
condena análoga del PP en la pieza Boadilla (204.000 €, 2022) es de
otra pieza y NO se acumula (anotado en importe_nota).

La cifra titular «en torno a 200 M€» que circula sobre el conjunto de
la trama es una **agregación periodística** de responsabilidades
económicas de todas las piezas (El Plural la presenta sin fuente
oficial única). NO se estructura como `importe` porque (a) no es
trazable a un documento oficial único y (b) sumaría piezas
heterogéneas, violando el anti-doble-conteo (V-23). Vive solo como
texto en `cifras_clave` / `resumen_cifras` con la advertencia
explícita.

Las multas penales de las piezas valencianas (3,9 M€ por tráfico de
influencias a cada uno de Correa, Crespo y El Bigotes según cobertura,
para la pieza de la Época I; y 3,2 M€ que la Generalitat reclama
devolver en la pieza de la visita del Papa) NO se han estructurado
todavía: pendiente de confirmar contra primario (qué pieza exacta,
firmeza, sujetos) antes de modelarlas como `consecuencia`/`multa_penal`
con `importe_atribucion` papel `obligado`.

## Documentos — pendiente_primario

- `sentencia-gurtel-epoca-i-an-2018` (sentencia 20/2018): modelada N3
  `filtrado_verificado` (circuló un PDF vía mirror de El Mundo;
  triangulada con nota CGPJ N1). **pendiente_primario**: localizar en
  CENDOJ la resolución íntegra para elevar a N1 y, si procede,
  descargar copia local con hash. No se ha descargado PDF en esta
  sesión (norma del maintainer).
- `sentencia-ts-gurtel-epoca-i-2020` (sentencia 507/2020): N1 por ECLI
  oficial (ECLI:ES:TS:2020:3191). **pendiente_primario**: fijar URL
  CENDOJ exacta; `url_canonica` apunta de momento al buscador del CGPJ.
- Pieza valenciana 2023: **pendiente_primario** nota CGPJ / ECLI.

## Personas creadas

francisco-correa-sanchez (n. 31-oct-1955), pablo-crespo-sabaris,
alvaro-perez-alonso (El Bigotes), julio-de-diego-lopez (ponente formal
AN), jose-ricardo-de-prada (voto particular AN), baltasar-garzon-real,
pablo-ruz-gutierrez. Reutilizadas: luis-barcenas, rosalia-iglesias,
angel-hurtado (ponente inicial AN), juan-ramon-berdugo (ponente TS).

Slugs con apellido completo (correa-**sanchez**, crespo-**sabaris**,
perez-**alonso**) para evitar colisiones futuras y converger entre
agentes. `nombres_alternativos` incluyen el alias corto de prensa.

## Organizaciones creadas

special-events, orange-market (empresas de la red de Correa).
Reutilizadas: partido-popular, audiencia-nacional, tribunal-supremo,
fiscalia-anticorrupcion, juzgado-central-instruccion-5,
consejo-general-poder-judicial, el-pais, publico-es, el-espanol,
eldiario-es. No se ha creado `easy-concept` ni la Fundación Gürtel
(pendiente cuando se modelen sus piezas). AENA (pieza de contratos con
Aena) no creada: pendiente de su pieza.

## Modelado del Partido Popular

El PP fue **partícipe a título lucrativo** (responsabilidad civil), no
condenado penalmente en la Época I. El esquema `rol-en-caso` no tiene
un rol para «partícipe a título lucrativo», así que NO se ha creado un
RolEnCaso del PP (sería engañoso etiquetarlo `condenado_*` o
`perjudicado`). Su situación se captura en el Hecho
`pp-participe-titulo-lucrativo` y en `organizaciones_afectadas` de los
hitos. Decisión a validar por el maintainer; posible ampliación futura
del enum con `participe_titulo_lucrativo`.

## Glosario

Creada entrada `gurtel` (categoría `trama_sobrenombre`) para el tooltip
inline de RichProse.

## Relaciones entre casos

YA EXISTE el fichero `content/relaciones-entre-casos/barcenas-caja-b-deriva-de-gurtel.yaml`
(creado por sesión previa) y referencia el documento
`sentencia-gurtel-epoca-i-an-2018`, que ahora existe en esta sesión
(cierra esa referencia colgante). NO hay ficheros `gurtel-comparte-*`.
NO he tocado `content/relaciones-entre-casos/` (lo hace el agente de
Reconciliación). Relaciones propuestas en la salida estructurada:
barcenas-caja-b (derivado_de y comparte_actor), kitchen
(comparte_actor: Bárcenas), lezo (comparte_actor: aparato judicial PP).

El caso `barcenas-caja-b` SÍ existe ya como directorio
(`content/casos/barcenas-caja-b/`) en estado `pendiente`; y `kitchen`
existe y está publicable.
