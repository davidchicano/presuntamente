# NOTES — Caso Palau de la Música (palau-musica)

Anotaciones internas para maintainers y agentes. Excluido del build público.
Última actualización: 2026-05-30.

---

## Fuentes consultadas en esta sesión

- Nota CGPJ (N1): nota de prensa de la Sección 10ª AP Barcelona sobre sentencia del caso Palau (enero 2018) — poderjudicial.es.
- Nota CGPJ (N1): nota de prensa del Tribunal Supremo sobre STS 813/2020 que ratifica condenas (30 abril 2020) — poderjudicial.es.
- Nota CGPJ (N1): nota de prensa sobre pieza de ejecución CDC / PDeCat / Junts (15 febrero 2022) — poderjudicial.es.
- Confilegal (N4): cobertura STS 813/2020 (30 abril 2020).
- Público.es (N4): cobertura sentencia AP Barcelona (15 enero 2018).
- elDiario.es (N4): cobertura recuperación más de 12 millones (2022).
- Wikipedia (contraste de datos estructurales).
- El Español, Libertad Digital, Crónica Global (contraste cifras y cronología).

---

## Promovidos a `acreditado` (revisión maintainer 2026-05-30)

Ambos hechos candidatos promovidos a `acreditado` con autorización del maintainer (V-04).
Respaldo verificado el 2026-05-30: notas CGPJ N1 en poderjudicial.es accesibles y con
pasajes literales coincidentes con los hechos modelados.

1. **`palau-expolio-fondos-atribuido`** — Promovido. Respaldo principal: nota CGPJ
   `nota-cgpj-sts-palau-2020` (N1): "El Supremo ratifica además que ambos deberán
   devolver 23 millones de euros a las estructuras del Palau (Consorci, Fundació y
   Associació)". STS 813/2020 es sentencia de casación de la Sala Segunda del TS;
   sin ulterior recurso ordinario. No se hallaron recursos de amparo al TC pendientes
   que afecten a este hecho (búsqueda 2026-05-30).
2. **`palau-comiso-cdc-atribuido`** — Promovido. Respaldo principal: nota CGPJ
   `nota-cgpj-sts-palau-2020` (N1): "El alto tribunal confirma también el comiso de
   6,6 millones de euros a la formación política Convergència Democràtica de Catalunya
   (CDC)". Y nota CGPJ AP Barcelona `nota-cgpj-sentencia-ap-barcelona-palau-2018` (N1):
   "El Tribunal acuerda el comiso de las ganancias obtenidas por Convergència
   Democràtica de Catalunya...que ascienden...a 6.676.105'58 euros".

## Hechos que permanecen en `atribuido`

- **`palau-recuperacion-12-millones`** — No promovido. La cifra de "más de 12 millones
  recuperados" proviene únicamente de cobertura periodística N4 (elDiario.es, 2022).
  La nota CGPJ de 2022 sobre la pieza CDC confirma el importe del comiso (6,67 M€) y
  la derivación al concurso, pero no cuantifica la recuperación global de los 23 M€.
  Permanece en `atribuido` hasta que aparezca fuente N1 o N2 que cuantifique
  explícitamente la cifra de recuperación total.

---

## Decisiones editoriales tomadas

### Absueltos de Ferrovial: no se modelan como personas del inventario
Los directivos de Ferrovial Pedro Buenaventura (director general) y Juan Elízaga
(director de relaciones institucionales) fueron acusados y absueltos por prescripción
de los delitos de administración desleal y tráfico de influencias. Se decidió NO crear
fichas de persona para ellos: su rol procesal es `absuelto` y no tienen condena firme
ni rol vigente en la causa. La Fiscalía les había pedido 5 años y 10 M€ de multa cada uno.
Si en el futuro se requiere modelar el rol de absuelto, se pueden añadir fichas.

### CDC modelada como organización condenada al comiso
El rol `condenado_firme` para CDC es al comiso (no a pena privativa de libertad).
El schema V-11 ampliado (mayo 2026, caso González Amador) admite roles imputadores
para organizaciones desde la LO 5/2010; el comiso es consecuencia penal directa y
encaja en el modelo.

### Fecha de sentencia AP Barcelona: 29 diciembre 2017, pública 15 enero 2018
La sentencia de primera instancia tiene fecha formal 29 de diciembre de 2017 pero fue
hecha pública el 15 de enero de 2018. Los hitos usan la fecha formal (29 diciembre 2017)
y la nota del CGPJ y la cobertura periodística la fecha de publicación (15 enero 2018).

### La pieza de CDC/3%: vinculación pero no confusión con el caso 3%
El caso Palau es la **fuente original** de la investigación sobre la financiación ilegal
de CDC. Sin embargo, existe una pieza separada en la Audiencia Nacional instruida por
el juez Santiago Pedraz (JCI nº 5) sobre el "caso 3%" (financiación sistemática de CDC
mediante la exigencia de un porcentaje sobre contratos públicos). Pedraz archivó la
pieza específica referida a CDC que investigaba si el dinero de los donantes vinculados
al partido tenía origen en el esquema del Palau. El caso 3% sobre infraestructuras
sigue su curso ante la AN y tiene juicio oral previsto en 2027.
**Relación propuesta**: `palau-musica` → `tres-por-ciento-cataluna` (tipo: `conexion_factual`,
nexo: "El caso Palau es el origen de la investigación de la financiación ilegal de CDC
que ramificó en el caso del 3% ante la Audiencia Nacional").

### Marta Vallès y Laila Millet: no se modelan como Persona del inventario
Marta Vallès Guarro (cónyuge de Millet, fallecida) y Laila Millet Vallès (hija)
son declaradas responsables a título lucrativo (art. 122 CP) sin condena penal propia.
No tienen rol procesal formal como investigadas/condenadas. Su responsabilidad civil
se recoge en el hecho `palau-expolio-fondos-atribuido` (en `importe_nota`).
No se crea Persona para ellas en esta versión; si en el futuro hay un hito
penal propio, revisar.

---

## Pendientes para pasadas futuras

- **Primarios descargados**: sentencia AP Barcelona (PA 74/2016, 29-dic-2017) y
  STS 813/2020 íntegras no localizadas en CENDOJ a 2026-05-30. Anotar como
  `pendiente_primario`. Cuando aparezcan, descargar a `/public/documentos/palau-musica/`
  y calcular `hash_sha256`. Las notas CGPJ N1 son suficiente para el modelado actual.
- **Vínculos institucionales**: pendiente documentar la afectación de CDC
  (directa, `entidad_investigada_en_caso`) y de la Generalitat de Catalunya
  (afectación indirecta, `afectacion_indirecta_en_caso` por ser partido del gobierno
  autonómico de la época) mediante la skill `documentar-vinculos`.
- **Cobertura mediática general**: ampliar con El Nacional.cat, Crónica Global,
  Ara.cat y Libertad Digital para cubrir el espectro editorial completo.
- **Estado cumplimiento penas**: Jordi Montull alcanzó tercer grado en enero 2023;
  Gemma Montull y Daniel Osàcar, estado actual de cumplimiento no verificado
  a 2026-05-30. Revisión recomendada si hay cobertura nueva.
- **Concurso CDC**: pendiente seguimiento del Juzgado Mercantil 9 de Barcelona
  sobre el comiso de 6,67 M€. Si hay auto de reconocimiento en el concurso,
  modelar como nuevo hito.
- **Caso 3%**: si se produce algún hito procesal nuevo ante la AN en 2026,
  actualizar la relación entre ambos casos.
