# NOTES internas — caso tarjetas-black

> EXCLUIDO del build publico. Anotaciones para humanos y agentes.

## Historial de sesiones

### Sesion 2026-05-30 (segunda pasada — correccion y ampliacion)

Sesion con herramientas funcionales. Se revisaron y corrigieron todos los
ficheros de la sesion anterior (que habia sido creada sin acceso verificable
a herramientas ni a los schemas). Se aplico el schema real leyendo
`schemas/*.json` y usando como referencia los casos `lezo` y `gurtel`.

**Cambios aplicados:**

- `caso.yaml`: reescrito conforme al schema (`caso.schema.json`); campos
  corregidos (`id`, `nombre_oficial`, `nombre_mediatico`, `organo_judicial_id`,
  `fase_actual`, `fecha_apertura`, `origen_denuncia`, `estado_publicacion`,
  `estado_ficha` como objeto con los 10 checks requeridos).
- `hito-2017-02-23-sentencia-an.yaml`: corregido (caso_id, fecha_precision,
  documento_principal_id anadido — requerido para tipo sentencia_primera_instancia).
- `hito-2018-sentencia-ts-firmeza.yaml`: corregido (caso_id, fecha_precision,
  tipo cambiado a sentencia_firme, documento_principal_id anadido).
- `hechos/hecho-uso-tarjetas-opacas.yaml`: marcado como obsoleto (retirado_definitivamente);
  reemplazado por `tarjetas-black-uso-tarjetas-opacas.yaml` con schema correcto.
- `hechos/tarjetas-black-uso-tarjetas-opacas.yaml`: nuevo hecho canonico del uso
  de tarjetas con dinero estructurado conforme a schema (caso_id, enunciado,
  fecha_o_periodo, documentos_respaldo con documento_id, importe_naturaleza con
  enum valido 'cobro_indebido', importe_atribucion con sujeto_tipo/sujeto/papel).
- `hechos/tarjetas-black-condena-an-2017.yaml`: nuevo hecho sobre condena de
  instancia (marcado 'superado' con corregido_por apuntando al hecho firme).
- `hechos/tarjetas-black-condena-firme-ts-2018.yaml`: nuevo hecho sobre firmeza.
- `hechos/tarjetas-black-extincion-blesa.yaml`: nuevo hecho sobre extincion de
  la responsabilidad penal de Blesa por fallecimiento (art. 130 CP).
- `roles/rol-rodrigo-rato-condenado.yaml`: corregido a schema (caso_id,
  sujeto_persona_id, rol, hito_origen_id).
- `roles/rol-miguel-blesa-condenado.yaml`: corregido a schema; se conserva
  condenado_no_firme (condicion al momento del fallecimiento) con fecha_fin.
- `roles/caja-madrid-perjudicada.yaml`: nuevo rol.
- `roles/bankia-perjudicada.yaml`: nuevo rol.
- `content/personas/miguel-blesa.yaml`: corregido a schema (id, nombre_completo,
  es_figura_publica, fallecido, fecha_fallecimiento, biografia_corta).
- `content/personas/rodrigo-rato.yaml`: CREADO (no existia). Schema correcto.
- `content/documentos/sentencia-an-tarjetas-black-2017.yaml`: corregido a schema
  (productor_organizacion_id, fecha_documento, estado_acceso, idioma, estado_publicacion).
- `content/documentos/sentencia-ts-tarjetas-black-2018.yaml`: idem.

**Validacion:** `pnpm validate` — todos los ficheros del caso pasan (OK).

### Sesion 2026-05-30 (primera pasada — sesion sin herramientas)

AVISO: el entorno suprimio la salida de todas las herramientas en esta sesion.
Todo el contenido factico provino del conocimiento del modelo. Requeria segunda
pasada con herramientas funcionales (completada en la sesion anterior).

## Que es el caso (conocimiento solido)

Uso, durante aproximadamente una decada (~2003-2012), de tarjetas de credito de
empresa de Caja Madrid (y luego Bankia tras la fusion/nacionalizacion) por parte de
miembros del consejo de administracion, de la comision de control y de altos
directivos. Los gastos (personales en su mayor parte) se cargaban a la entidad fuera
de la retribucion formal y no se declaraban a Hacienda. El asunto estallo
publicamente en octubre de 2014 a partir de documentacion incorporada a la causa de
la salida a bolsa de Bankia en la Audiencia Nacional.

## Cadena procesal (de memoria — VERIFICAR TODO en CENDOJ / poderjudicial.es)

- Instruccion: Juzgado Central de Instruccion (se cree nº 6), Diligencias Previas
  derivadas de la causa Bankia. Magistrado instructor: Fernando Andreu.
  # pendiente_primario: auto de instruccion / apertura de pieza. Verificar numero DP.
- Enjuiciamiento: Audiencia Nacional, Sala de lo Penal (se cree Seccion Cuarta).
- Sentencia de instancia: **23 de febrero de 2017** (dato solido). Condenas por
  apropiacion indebida; penas graduadas por importe dispuesto.
  # pendiente_primario: sentencia AN integra (CENDOJ). Numero de sentencia/rollo a verificar.
- Casacion: Tribunal Supremo, Sala Segunda, confirmacion en **2018**.
  # pendiente_primario: STS confirmatoria. ECLI / numero a verificar.
  # LLM-incierto: fecha exacta STS (se usa 2018-06-08 pero a verificar).

## Personas / roles (perfiles solidos)

- **Rodrigo Rato** (`rodrigo-rato`, CREADO en esta sesion): presidente de
  Bankia/Caja Madrid en el tramo final; usuario de tarjeta; condenado_firme por TS.
- **Miguel Blesa** (`miguel-blesa`, CORREGIDO al schema): presidente de Caja
  Madrid hasta 2010; condenado en primera instancia por la AN (2017). Fallecio
  en julio de 2017; su responsabilidad penal se extinguio (art. 130.1.1.a CP).
  Rol: condenado_no_firme (condicion al fallecimiento); no existe condena firme.
- Resto de acusados (~65): consejeros y directivos de distintos perfiles politicos
  y sindicales. **NO crear Personas sin verificar nominalmente** contra la sentencia.
  Tratamiento sin cuota politica.

## Dinero

- Importe total dispuesto: en torno a **12 millones de euros** (~2003-2012).
  # LLM-incierto: cifra de memoria — VERIFICAR en hechos probados de la sentencia AN.
- Modelado en `tarjetas-black-uso-tarjetas-opacas.yaml` como `cobro_indebido`,
  `total_caso`, `objeto`. Perjudicadas: caja-madrid y bankia.

## Promovidos a 'acreditado' (rev. maintainer 2026-05-30)

Revision V-04 ejecutada el 2026-05-30. Se verificaron las notas oficiales del CGPJ
en poderjudicial.es mediante WebFetch directo. Los siguientes hechos se promovieron
de `atribuido` a `acreditado`:

### tarjetas-black-condena-firme-ts-2018

- **Respaldo N1 verificado**: nota oficial CGPJ de 03-10-2018 en poderjudicial.es
  (URL verificada) + ECLI:ES:TS:2018:3253 (Sala Segunda TS, ponente magistrado
  Miguel Colmenero, 3 de octubre de 2018).
- **Datos confirmados**: Rodrigo Rato condenado a 4 anos y 6 meses de prision;
  63 condenados mas con penas de 4 meses a 4 anos y 6 meses; responsabilidad civil
  total >12 M EUR (9,3 M periodo Blesa + 2,6 M periodo Rato).
- **Correccion adicional**: fecha corregida de 2018-06-08 (LLM-incierto) a
  2018-10-03 (verificada).
- **Limitacion**: el texto integro de la sentencia (paginas exactas del FALLO y
  Hechos Probados) no fue localizado en CENDOJ en esta sesion; los pasajes no
  incluyen numero de pagina. Pendiente de completar cuando el maintainer descargue
  el PDF a /public/documentos/tarjetas-black/.

### tarjetas-black-extincion-blesa

- **Respaldo N1 verificado**: nota oficial CGPJ de 21-11-2017 en poderjudicial.es
  (URL verificada), que recoge el auto del TS que declara desierto el recurso y
  extinguida la responsabilidad criminal de Blesa.
- **Datos confirmados**: fallecimiento el 28-07-2017 (comunicado al tribunal en
  esa fecha); extincion de responsabilidad penal por fallecimiento (art. 130.1.1.a
  CP); recurso declarado desierto por falta de poder notarial de herederos.
- **Correccion adicional**: fecha de fallecimiento corregida de 2017-07-17
  (LLM-incierto) a 2017-07-28 (verificada via CGPJ nota).

## Documentos N1 creados en esta sesion (notas CGPJ)

- `content/documentos/cgpj-nota-tarjetas-black-an-2017-02-23.yaml` — nota CGPJ
  sobre la sentencia AN del 23-02-2017 (URL verificada).
- `content/documentos/cgpj-nota-tarjetas-black-ts-2018-10-03.yaml` — nota CGPJ
  sobre la STS del 03-10-2018, ECLI:ES:TS:2018:3253 (URL verificada).
- `content/documentos/cgpj-nota-tarjetas-black-blesa-recurso-desierto.yaml` —
  nota CGPJ de 21-11-2017 sobre recurso desierto y extincion de responsabilidad
  penal de Blesa (URL verificada).

## CANDIDATOS A 'acreditado' PENDIENTES

### tarjetas-black-uso-tarjetas-opacas (NO promovido — razon)

El hecho sobre el uso de las tarjetas (periodo 2003-2012, importe ~12 M EUR,
calificacion como apropiacion indebida) se mantiene en `atribuido` porque:
- El enunciado afirma un importe total de ~12 M EUR que los hechos probados del
  texto de la sentencia desglosarian con precision; sin acceso a las paginas
  exactas del texto no se puede citar el pasaje con localizacion ("Hechos
  Probados, p. XX").
- El periodo exacto (2003-2012) y la calificacion juridica ("constitutivos de
  un delito de apropiacion indebida") son datos solidos confirmados por notas
  CGPJ, pero el enunciado actual incluye marcadores LLM-incierto sobre el importe
  exacto que deben resolverse con la lectura del texto.
- **Accion pendiente**: cuando el maintainer descargue la sentencia AN integra
  (o la STS) a /public/documentos/tarjetas-black/, releer los Hechos Probados
  y promover con cita literal + pagina.

## Pendientes (pendiente_primario y verificaciones)

- [ ] pendiente_primario: sentencia AN 23-02-2017 integra (CENDOJ) + numero/rollo.
      Procedimiento origen: PA 59/12 JCI n.4; Seccion Cuarta Sala Penal AN.
      Pendiente de localizar URL exacta en poderjudicial.es/search y descargar
      el PDF a /public/documentos/tarjetas-black/ para citas literales con pagina.
- [ ] pendiente_primario: STS ECLI:ES:TS:2018:3253 texto integro en CENDOJ.
      Fecha y ECLI ya verificados; pendiente URL exacta en CENDOJ y descarga
      del PDF para citas literales con pagina.
- [ ] pendiente_primario: auto/DP de instruccion (JCI n.4, numero DP y fecha de
      apertura).
- [ ] Modelar los ~63 condenados restantes con sus roles individuales y penas —
      requiere lectura de la sentencia; hacerlo en una sesion con acceso a CENDOJ.
- [ ] Borrar el fichero obsoleto `hechos/hecho-uso-tarjetas-opacas.yaml` (marcado
      como retirado_definitivamente; se dejo en disco porque las tools no permiten
      borrar).
- [ ] Promover `tarjetas-black-uso-tarjetas-opacas` a 'acreditado' tras localizar
      el texto de la sentencia e identificar las paginas exactas de Hechos Probados.

## Revision panel 2026-05-31 (correcciones post-revision ROJO)

Panel de revision dejo el caso en estado ROJO por dos hallazgos:

**A2 — Texto placeholder y afirmacion falsa en campo publico (`resumen_cifras`):**
El campo contenia la frase "(cifra pendiente de verificar contra los hechos probados
de la sentencia)" y la afirmacion "No existe una cifra unica de responsabilidad civil
global publicada oficialmente", que es falsa: la nota CGPJ de la STS de 03-10-2018
(ECLI:ES:TS:2018:3253) si cifra la responsabilidad civil total en >12 M EUR
(aprox. 9,3 M EUR periodo Blesa + 2,6 M EUR periodo Rato).
Correccion aplicada: `resumen_cifras` reescrito con las cifras verificadas y la
fuente (nota CGPJ). Eliminado el texto placeholder. Las cifras se basan en la nota
oficial CGPJ documentada en NOTES.md (sesion 2026-05-30, seccion
"tarjetas-black-condena-firme-ts-2018").

**A7 — Tres fechas erroneas que contradecian valores ya verificados en el caso:**
- `caso.yaml` / `fecha_cierre`: corregida de "2018-06-08" a "2018-10-03"
  (fecha verificada del hito tarjetas-black-sentencia-ts-firme-2018 y nota CGPJ).
- `roles/rol-rodrigo-rato-condenado.yaml` / `fecha_inicio`: corregida de "2018-06-08"
  a "2018-10-03" (idem).
- `roles/rol-miguel-blesa-condenado.yaml` / `fecha_fin`: corregida de "2017-07-17"
  a "2017-07-28" (fecha verificada del hecho tarjetas-black-extincion-blesa y
  nota CGPJ de 21-11-2017).
En todos los casos se eliminaron los comentarios `# LLM-incierto` correspondientes
y se sustituyeron por comentarios que referencian el respaldo verificado.

**FIX 3 (estado_ficha):** ningun subcampo estaba en `completo`; no se modifico.

## Relaciones con otros casos (propuestas, NO escritas en content/)

- **bankia-salida-bolsa**: nexo formal/funcional fuerte. Las tarjetas afloraron a
  partir de la documentacion de la causa de la salida a bolsa de Bankia en la AN;
  comparten entidad (Caja Madrid/Bankia) y solapan personas (Rato). Tipo: derivada_factual.
- **rato-fraude-fiscal**: solapamiento de persona investigada (Rodrigo Rato) y
  entorno temporal; son procedimientos distintos. Tipo: causa_conexa.

## Anotaciones migradas desde comentarios YAML (2026-06-02)

Nota interna que vivía como comentario `#` dentro de un bloque de texto YAML, donde se renderizaba en el sitio público (ver regla V-26 en doc 01). Reubicada aquí; el YAML quedó limpio.

- **`../../personas/miguel-blesa.yaml`** — Tratamiento exacto en la STS: verificar el texto de la resolución en CENDOJ para confirmar el artículo del CP aplicado y la fecha.
- **`../../organizaciones/bankia.yaml`** — Completar fechas y datos registrales de Bankia desde fuente oficial.
- **`../../organizaciones/caja-madrid.yaml`** — Completar fechas de constitución/extinción y datos registrales de Caja Madrid desde fuente oficial.
