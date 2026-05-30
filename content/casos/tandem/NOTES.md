# NOTES — Caso Tándem

Anotaciones internas. Excluido del build público.

## Decisiones editoriales tomadas

### Relación con caso Kitchen

La pieza separada nº 7 del caso Tándem (Operación Kitchen) se modela como
**caso independiente** en este inventario (slug `kitchen`), dado que:
- Tiene entidad editorial propia y relevancia capital autónoma.
- Los roles de sus acusados (Fernández Díaz, Francisco Martínez, Pino,
  Villarejo en Kitchen, etc.) ya están completos en `content/casos/kitchen/`.
- Modelar Kitchen también en Tándem duplicaría roles y hechos.

La relación formal entre ambos casos se propone como `RelacionEntreCasos`
de tipo `pieza_de` (tandem es el padre, kitchen es la pieza separada).

### Estructura de roles de Villarejo

Villarejo tiene múltiples condenas de piezas distintas, modeladas como
roles separados en este caso:
- `villarejo-investigado-tandem`: rol inicial en la causa troncal (2017-2023).
- `villarejo-condenado-no-firme-iron-land-pintor`: piezas Iron/Land/Pintor,
  sentencia apelación sept. 2025 (13 años, no firme).
- `villarejo-condenado-no-firme-dina`: pieza Dina, sentencia mayo 2026
  (3 años y 6 meses, no firme).
- En Kitchen, su rol está modelado en `content/casos/kitchen/roles/`.

### Pieza Wine (Repsol/CaixaBank)

La pieza Wine (pieza 21) fue juzgada y condenó a Villarejo en mayo de
2025 a 8 años. Sin embargo, la Sala de Apelación de la AN la revocó en
diciembre de 2025 absolviendo a Villarejo por prescripción de los delitos
(el tribunal la absolvió de cohecho, y sin cohecho los delitos de revelación
de secretos estaban prescritos). Por este motivo NO se incluye hito de
condena Wine en la cronología —quedó sin efecto— pero sí se anota aquí
para contexto.

### Pieza Apolo / grabación al CNI

La pieza relativa a la grabación a miembros del CNI en 2014 resultó en
absolución firme de Villarejo (ninguna parte recurrió). No se modela como
hito de condena sino como absolución. Por su escasa relevancia editorial
actual se deja pendiente de modelado en iteración futura.

### Pieza 8 (Marbella)

En noviembre de 2025 Villarejo fue absuelto de cohecho en la pieza 8
(Marbella). Dos policías (Riaño y Bonilla) fueron condenados a 1 año
cada uno por descubrimiento de secretos. Se deja pendiente de modelado
detallado por ser de relevancia editorial secundaria.

## Candidatos a `acreditado` para revisión humana

### No promovidos (rev. maintainer 2026-05-30)

- `condena-firme-salamanca-cohecho-barajas`: **NO promovido**. La revisión
  editorial del 2026-05-30 localizó la Sentencia 3/2025 (15 enero 2025) de la
  Sala de Apelación de la AN y la nota oficial del CGPJ (poderjudicial.es,
  N1). La propia resolución establece expresamente que "contra ella cabe
  recurso de casación ante el Tribunal Supremo", por lo que NO es firme en
  sentido estricto. La cobertura periodística de enero 2025 que usaba el
  término "firme" era imprecisa. La condena a 3 años y el comiso de 273.915 €
  están respaldados por el N1 CGPJ (nuevo doc:
  `cgpj-nota-confirmacion-condena-salamanca-barajas-2025-01-15`) y el hecho
  sube de `nivel_fuente_efectivo: 4` a `1`, pero permanece en `tipo: atribuido`
  hasta que se resuelva la casación. El hito fue corregido de `sentencia_firme`
  a `sentencia_apelacion`. Acciones pendientes: verificar si el TS admitió
  o rechazó casación (monitorizar CENDOJ-TS a partir de sept. 2025).

- `condena-iron-land-pintor-revelacion-secretos`: **No promovido**. La condena
  de apelación de sept. 2025 (13 años para Villarejo) no es firme a fecha de
  revisión editorial. No promover a `acreditado` hasta confirmar firmeza.

## Personas pendientes de modelar (PR2+)

- Susana García Cereceda (condenada en pieza Land): persona privada,
  V-17 aplica. Modelar con cuidado; es perjudicada y contratante a la vez.
- Directivos del BBVA procesados en pieza 9 (Ángel Corrochano, Ángel Cano,
  Eduardo Arbizu, Joaquín Gortari, Antonio Béjar).
- Antonio Asenjo (ex jefe de Seguridad de Iberdrola, a juicio en pieza
  separada de Iberdrola).

## Fuentes y pendientes_primario

- **Pieza Salamanca (pieza 1)**: Nota N1 del CGPJ (poderjudicial.es, 2025-01-15)
  localizada y catalogada como `cgpj-nota-confirmacion-condena-salamanca-barajas-2025-01-15`.
  La sentencia íntegra (Sentencia 3/2025) no aparece en CENDOJ a fecha de
  revisión (2026-05-30). Pendiente: buscar en CENDOJ-AN y en CENDOJ-TS si
  el recurso de casación fue interpuesto/resuelto.
- El auto de prisión provisional de noviembre de 2017 (Carmen Lamela)
  no está publicado en CENDOJ. Marcado como `pendiente_primario`.
- Las sentencias íntegras de Iron/Land/Pintor (351 pp., julio 2023) y
  de apelación (310 pp., sept. 2025) no están en CENDOJ aún. Marcadas
  como `pendiente_primario` para descarga cuando aparezcan.
- La pieza Dina tiene sentencia de mayo 2026: buscar en CENDOJ
  en sesión futura (plazo estimado: 3-6 meses después del dictado).
- El auto de procesamiento del BBVA y escrito de acusación de la Fiscalía
  en pieza 9 no son públicos; `pendiente_primario`.

## Incertidumbres LLM

- `# LLM-incierto: fecha exacta del inicio del juicio oral Iron/Land/Pintor`
  (fuentes dicen "octubre 2021" sin precisión de día). Marcado como
  `fecha_precision: mes`.
- `# LLM-incierto: firmeza de la sentencia de apelación de sept. 2025`.
  No se ha localizado información sobre recurso de casación al TS
  admitido a trámite. Se modela como `condenado_no_firme` por cautela.
- `# LLM-incierto: nombre exacto del JCI instructor inicial en 2017`.
  La detención fue decretada por Carmen Lamela (JCI nº 3), pero la
  instrucción fue asumida por García-Castellón (JCI nº 6). No se ha
  podido precisar cuándo exactamente se produjo el cambio de órgano.

## Relaciones entre casos propuestas

- `tandem` → `kitchen`: tipo `pieza_de`; nexo: "La Operación Kitchen es la
  pieza separada nº 7 de las Diligencias Previas 96/2017 del caso Tándem."
- `tandem` → `barcenas-caja-b`: tipo `conexion_factual`; nexo: "Luis Bárcenas,
  presunto perjudicado de Kitchen (pieza de Tándem), es el protagonista del
  caso caja b del PP; la documentación intervenida en Kitchen se dirigía
  a impedir que llegara al juez del caso Bárcenas."
