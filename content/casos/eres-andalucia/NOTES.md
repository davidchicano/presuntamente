# NOTES — Caso ERE de Andalucía

Anotaciones internas. Excluido del build público.

## Estado del modelado (2026-05-30)

Sesión actual (2026-05-30): **migración de schema** de todos los ficheros
del caso al schema plano vigente (usado en gurtel y lezo). Todos los YAML
(caso, hitos, hechos, roles, glosario) han pasado del formato antiguo con
wrappers `hito:`/`hecho:`/`rol:` al formato flat que valida contra los
schemas en `/schemas/`.

Espina dorsal modelada: instrucción (JI nº 6 de Sevilla), juicio, sentencia
AP Sevilla 2019, casación TS 2022 y amparos TC 2024. Estado de ficha:
`estado_publicacion: borrador`, `fase_actual: ejecucion`.

## Limitación grave: SIN acceso a red

Las herramientas `WebSearch` y `WebFetch` **no devolvieron resultados en
vivo** en el sandbox de esta sesión (devolvían conocimiento del modelo o
respuestas vacías). En consecuencia, **nada de lo modelado está verificado
contra fuente primaria en vivo**. El modelado se hizo a partir de
conocimiento general ampliamente documentado y público del caso, marcando
con `# LLM-incierto` cada dato concreto no verificable.

**Antes de publicar (revisión humana obligatoria), verificar en vivo:**

- Número y fecha exacta de la sentencia AP de Sevilla (citada como
  490/2019, sin confirmar) y la sección concreta.
- Número, fecha y ponente de la STS de casación (citada como 749/2022,
  sin confirmar) y el contenido de los votos particulares.
- Números, fechas y alcance individualizado de las sentencias de amparo
  del TC de 2024 (son varias, una por recurrente).
- Fecha de incoación/asunción por el JI nº 6 de Sevilla y número de
  diligencias. La instructora inicial fue Mercedes Alaya (dato ampliamente
  conocido; verificar titularidad posterior).
- Fecha exacta de inicio del juicio de la pieza política (situada
  en diciembre de 2017; verificar contra AP Sevilla).
- Penas individualizadas (prisión / inhabilitación) de cada condenado.
- Denominación exacta del programa presupuestario (citado como "31L").
- Si Zarrías y Fernández Guerrero fueron condenados solo por prevaricación
  o también por malversación, y si el amparo del TC de 2024 les afecta.

## Candidatos a `acreditado` — revisión V-04 completada el 2026-05-30

### Documentos primarios N1: estado de verificación en vivo

Revisión ejecutada el 2026-05-30. Fuentes consultadas: nota CGPJ en
poderjudicial.es, encabezados y sumarios BOE (boe.es), nota informativa
Sala II TS. No se ha descargado ningún PDF íntegro (sandbox sin red para
downloads). Los documentos YAML del caso han sido actualizados con lo
verificado.

**SAP 490/2019 (Sección Primera AP Sevilla, 19-11-2019)**
- Número y fecha VERIFICADOS: nota CGPJ oficial + encabezados BOE STCs 2024.
- ECLI preliminar: `ECLI:ES:APSE:2019:1101` (citado por el portal del CGPJ;
  pendiente confirmar en CENDOJ con el primario íntegro).
- URL canónica (nota CGPJ): https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Noticias-Judiciales/La-Audiencia-Provincial-de-Sevilla-notifica-la-sentencia-del-caso-de-los-ERE
- Datos del fallo verificados parcialmente desde nota oficial: 19 condenados,
  2 absueltos; Chaves 9 años inhabilitación; Griñán 6 años 2 días prisión +
  15 años 2 días inhabilitación absoluta.
- Penas individualizadas del resto de condenados: **no verificadas** (no
  accesibles en la nota CGPJ sin el PDF íntegro).

**STS 749/2022 (Sala Penal TS, 13-09-2022)**
- Número y fecha VERIFICADOS: nota informativa Sala II TS en CGPJ + BOE STCs
  2024 (ambos citan "sentencia núm. 749/2022, de 13 de septiembre").
- CORRECCIÓN: la fecha en el YAML era "2022-07-26" (fecha del fallo anticipado
  por el CGPJ); fecha real de la sentencia es 2022-09-13. Corregido en YAML.
- URL canónica (nota Sala II): https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Noticias-Judiciales/Nota-informativa-de-la-Sala-II-del-Tribunal-Supremo-sobre-la-sentencia-del--caso-ERE--y-voto-particular
- Absolvió en casación: Aguado Hinojal, Sánchez García, Medina Varo (3
  Secretarios Generales Técnicos). Resto de condenas confirmadas en sustancial.
- Votos particulares: magistradas Ana Ferrer García y Susana Polo García
  (abogaban por absolver de malversación a 5 acusados más, entre ellos Griñán).
- Penas individualizadas del fallo TS: **no verificadas** sin el PDF íntegro.

**STCs TC 2024 (Pleno TC, junio-julio 2024)**
- Números y fechas VERIFICADOS desde encabezados BOE (ver YAML actualizado).
- STC 99/2024 (16-07-2024, BOE-A-2024-17480): Chaves, amparo parcialmente
  estimado. Prevaricación en actos pre-legislativos anulada; actos ejecutivos
  del Consejo de Gobierno válidamente enjuiciables. Retroacción a AP Sevilla.
- STC 100/2024 (16-07-2024, BOE-A-2024-17481): Griñán, amparo parcialmente
  estimado. Malversación ANULADA. Prevaricación retroactada a AP Sevilla.
- STC 95/2024 (03-07-2024, BOE-A-2024-16038): A. Fernández García, malversación
  anulada.
- STC 93/2024 (19-06-2024, BOE-A-2024-15428): M. Álvarez, prevaricación
  parcialmente anulada.
- STC 101/2024 (BOE-A-2024-17482): Márquez Contreras, amparo DESESTIMADO.
  Su condena ES FIRME.
- Zarrías: TC estimó parcialmente (inhabilitación rebajada; condena revisable
  a la baja). STC exacta y BOE pendientes de verificar individualmente.
- PENDIENTE: AP Sevilla debe dictar nueva sentencia (tribunal reforzado
  constituido en nov-2024; nueva sentencia NO dictada aún a 05-2026).

### Hechos no promovidos (V-04 2026-05-30) — con razón

**1. `hecho-condena-prevaricacion-malversacion-2019` → NO PROMOVIDO**

Razón: Aunque el número y la fecha de la SAP 490/2019 y la STS 749/2022 están
verificados, las condenas individuales de los cuatro personas modeladas en el
hecho (Chaves, Griñán, Zarrías, V. Fernández Guerrero) han sido retroactadas
por el TC en 2024 a AP Sevilla para que dicte nueva sentencia. A fecha de esta
revisión (05-2026), la AP Sevilla NO ha dictado la nueva sentencia. Por tanto,
las condenas por prevaricación de Chaves, Griñán y Zarrías NO SON FIRMES en
su formulación actual (pendientes de nueva sentencia). La condena de Griñán
por malversación fue ANULADA por STC 100/2024. El hecho en su redacción actual
refleja correctamente la situación ("condenas que el TS confirmó en lo sustancial
en casación (2022) y que el TC matizó parcialmente en 2024") y es apropiado
mantenerlo en `atribuido` hasta que la nueva sentencia de AP Sevilla sea firme.
Además, las penas individualizadas de cada condenado no se han verificado
contra el primario (sin PDF íntegro), lo que impide añadir pasajes literales.

**2. `hecho-sistema-ayudas-transferencias-financiacion` → NO PROMOVIDO**

Razón: El sistema de transferencias de financiación SÍ está en los hechos
probados de la SAP 490/2019 y fue confirmado en casación por el TS; el TC
no revocó el hallazgo del sistema sino la atribución individual de
responsabilidad. Podría promoverse la descripción del sistema, pero:
(a) el pasaje citado en `documentos_respaldo` es genérico ("Hechos probados
(descripción del sistema...)") y no incluye localización exacta (páginas,
fundamento concreto); (b) el importe de 680M EUR está marcado `LLM-incierto`
y no puede verificarse sin el primario íntegro. Sin localización exacta ni
importe verificado, la promoción sería incompleta. Dejar en `atribuido` hasta
disponer del PDF con la página exacta de los hechos probados.

## Decisiones editoriales

- **Chaves vs. Griñán**: la distinción clave del fallo es que a Chaves se
  le condenó solo por **prevaricación** y a Griñán por **prevaricación y
  malversación** (con pena de prisión). Se ha reflejado en sus Roles. El
  amparo del TC de 2024 afecta a la malversación, luego principalmente a
  Griñán (y eventualmente a Fernández Guerrero y otros).
- **Dinero estructurado**: una sola cifra estructurada (~680 M EUR) en
  `hecho-sistema-ayudas-transferencias-financiacion`, clase `objeto`,
  alcance `total_caso`, atribuida como `activo` a Junta y a IDEA.
  Anti-doble-conteo: no se repite en el hecho de condena (V-23).
- **No se han modelado** los numerosos perceptores individuales de ayudas
  ni intermediarios de otras piezas: exceden el arranque y requieren
  verificación caso a caso.
- **Anonimización**: solo se han creado/usado personas con rol procesal
  formal y condición de alto cargo público.

## Dedup de entidades

- Reutilizadas (ya existían): `gaspar-zarrias`, `vicente-fernandez-guerrero`,
  `junta-de-andalucia`, `audiencia-provincial-sevilla`, `tribunal-supremo`,
  `tribunal-constitucional`, `juzgado-instruccion-6-sevilla`,
  `fiscalia-anticorrupcion`, `psoe`, y los delitos `prevaricacion`,
  `malversacion-caudales-publicos`.
- Creadas nuevas en sesión anterior: personas `manuel-chaves-gonzalez`,
  `jose-antonio-grinan-martinez`; organizaciones `agencia-idea`,
  `consejeria-empleo-junta-andalucia`; glosario
  `ayudas-sociolaborales-ere-andalucia`.
- Descartadas por no poder verificar nombre/cargo/pena: persona "Viñas Rico"
  (director general de Trabajo) y otros condenados de segundo nivel.

## Pendientes operativos

- [ ] `pendiente_primario`: descargar a `/public/documentos/eres-andalucia/`
      las sentencias (SAP 490/2019 desde CENDOJ; STS 749/2022 desde CENDOJ;
      STCs TC 2024 desde BOE en PDF) para obtener hash_sha256, rellenar
      `ruta_local` y completar el estado_acceso. El número y fecha están
      verificados; falta el PDF íntegro. Lo decide el maintainer.
- [x] Verificar número SAP 490/2019 → confirmado 2026-05-30.
- [x] Verificar número STS 749/2022 → confirmado 2026-05-30. Corregida
      `fecha_documento` de 2022-07-26 a 2022-09-13.
- [x] Verificar números STCs TC 2024 → confirmados parcialmente (93, 95, 99,
      100, 101/2024) desde encabezados BOE el 2026-05-30. Pendiente: STCs
      94, 96, 97, 98, 103/2024 y STC exacta de Zarrías.
- [ ] Penas individualizadas de cada condenado (prisión + inhabilitación):
      no verificadas; requieren PDF íntegro de SAP 490/2019 y STS 749/2022.
- [ ] Modelar el rol del **juez instructor** (Mercedes Alaya, instructora
      inicial; después hubo cambios de titularidad) y del **magistrado
      ponente** del TS una vez verificadas las identidades.
- [ ] Desglosar `sentencias-tc-amparo-ere-2024` en Documentos individuales
      cuando se descarguen los primarios (ya se tienen los BOE-A-2024-XXXXX
      de las STCs verificadas; el maintainer decide el timing).
- [ ] Monitorizar la nueva sentencia de la AP Sevilla (retroacción TC):
      el tribunal reforzado (5 magistrados) fue constituido en nov-2024;
      la nueva sentencia no se ha dictado a 05-2026. Cuando se dicte:
      crear nuevo Documento, actualizar los Hechos y reconsiderar promoción
      a `acreditado`.
- [ ] Ampliar con piezas específicas (ayudas concretas) en sesiones futuras.
- [ ] Afinar `importe`: separar volumen del programa vs. importe declarado
      irregular vs. perjuicio, con el primario delante.
- [ ] Confirmar si el `juzgado-instruccion-6-sevilla` es el slug correcto
      para el órgano instructor o si conviene crear uno específico del caso
      ERE (el juzgado siguió teniendo otra actividad al margen de los ERE).
- [ ] Verificar el cargo exacto y la STC individual de Gaspar Zarrías en el
      TC 2024 (inhabilitación rebajada, según fuentes periodísticas; pendiente
      verificar el número de STC desde BOE oficial).
