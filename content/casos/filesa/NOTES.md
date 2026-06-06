# NOTES — Caso Filesa

> Anotaciones internas de trabajo. EXCLUIDO del build público.

## Fuentes consultadas (sesión 2026-05-30, primera parte — modelado inicial)

- Wikipedia ES — artículo "Caso Filesa" (resumen estructural, personas, empresas)
- Equipo Nizkor / derechos.org — texto de la STS 1/1997 (antecedentes y fundamentos)
- BOE-T-2001-12759 — STC 126/2001 (recurso amparo Oliveró) [N1]
- BOE-T-2001-12760 — STC 127/2001 (recurso amparo Álvarez y Molledo) [N1]
- BOE-A-2000-23959 — Real Decreto 2700/2000 (indulto Navarro) [N1]
- Libertad Digital, 4 jun 2001 — "Las penas a los ocho condenados del caso Filesa"
- El País / mirror udel.edu — cobertura del juicio 1997 (absueltos)
- El Debate, 16 mar 2024 — rama Viajes Ceres, estado procesal
- Público, feb 2022 — reapertura Viajes Ceres por TS

## Fuentes consultadas (sesión 2026-05-30, segunda parte — revisión V-04 y promoción a acreditado)

- BOE-T-2001-12756 — STC 123/2001 (recurso amparo Carlos Navarro Gómez) [N1] — NUEVO
- BOE-T-2001-12757 — STC 124/2001 (recurso amparo Josep Maria Sala i Grisó) [N1] — NUEVO
- BOE-T-2001-12758 — STC 125/2001 (recurso amparo Alberto Flores Valencia) [N1] — NUEVO
- BOE-A-2000-23478 — Real Decreto 2442/2000 (indulto Flores Valencia) [N1] — NUEVO
- BOE-A-2000-23958 — Real Decreto 2699/2000 (indulto Oliveró Capellades) [N1] — NUEVO

## Decisiones editoriales tomadas

### Tipo de causa
La causa es una **Causa Especial** ante la Sala Segunda del Tribunal Supremo (nº 880/1991) porque uno de los investigados tenía la condición de aforado (Josep Maria Sala i Grisó, senador del PSC). Por eso no existe instrucción ante juzgado ordinario ni recurso de casación; la sentencia del TS es firme en única instancia.

### Sentencia: atribuido, no acreditado
La STS 1/1997 es firme. Conforme al guardarraíl V-04 y a la skill investigar-caso, los hechos se modelan como `atribuido` con cita de la sentencia. La promoción a `acreditado` requiere revisión humana explícita. Ver sección "Candidatos a acreditado" más abajo.

### Indultos del año 2000
Los tres principales condenados recibieron indultos parciales del Gobierno de Aznar (PP). El dato está en el BOE (N1) para Navarro (RD 2700/2000). Los Reales Decretos de Flores y Oliveró también se publicaron en BOE (BOE del 21 de diciembre de 2000) pero no se localizó el número exacto de cada Real Decreto en la sesión de modelado. Anotar como pendiente la búsqueda de los RD exactos de Flores y Oliveró para crear documentos N1 individuales.

### Absueltos
Tres acusados fueron absueltos: Luis Sánchez Marcos, Francisco Javier Iglesias Díaz y Julio Calleja González-Camino. No se crean fichas de Persona para los absueltos en esta sesión por no tener información verificable de su cargo o rol. Pendiente de completar si se localizan fuentes.

### Sentencia del TC respecto a Sala i Grisó (CORRECCIÓN 2026-05-30)
**Corrección de error editorial anterior.** La sesión inicial indicaba que el TC estimó parcialmente el amparo de Sala i Grisó, anulando la condena por falsedad. La lectura directa de la STC 124/2001 (BOE-T-2001-12757) confirma que el TC **desestimó íntegramente** el recurso de amparo. Ambas condenas de la STS 1/1997 permanecen firmes:
- 1 año de prisión menor + 100.000 pesetas de multa (falsedad en documento mercantil)
- 2 años de prisión menor + 6 años y un día de inhabilitación especial + 250.000 pesetas de multa (asociación ilícita)

Se ha creado el documento N1 `boe-stc-124-2001-filesa` con la url correcta. La corrección está aplicada en `filesa-condenas-firmes-1997.yaml`.

### Rama Viajes Ceres
Se recoge en esta ficha como hito de reapertura y hecho investigado, pero el caso Viajes Ceres podría merecer una ficha propia cuando se dicte sentencia o el procedimiento avance significativamente. Instrucción activa en el Juzgado de Instrucción nº 26 de Madrid a 2026-05-30. Estado del señalamiento de juicio oral: en preparación en 2024 según prensa; pendiente confirmar si se señaló en 2024-2025.

### Importe estructurado
- **Causa Especial 880/1991**: "más de 1.000 millones de pesetas" (≈ 6 M€) — total_caso, clase objeto
- **Multa fiscal solidaria Navarro/Flores/Oliveró**: 258.827.765 pesetas (≈ 1,56 M€) — componente, consecuencia
- **Rama Viajes Ceres**: 42,2 M€ investigados — componente, objeto (no acumulable con el total de la causa principal, son procedimientos distintos y cifras distintas)

Anti-doble-conteo (V-23): el importe de Viajes Ceres no se suma al de la causa principal; son ramas distintas con fondos distintos.

## Promovidos a acreditado (rev. maintainer 2026-05-30)

Sesión de revisión V-04 completada el 2026-05-30. Resultado:

1. **filesa-condenas-firmes-1997** — PROMOVIDO a `acreditado`. Respaldo N1 completo: STC 123/2001 (Navarro), STC 124/2001 (Sala i Grisó), STC 125/2001 (Flores), STC 126/2001 (Oliveró), STC 127/2001 (Álvarez/Molledo) — todas en BOE, todas desestiman los amparos, todas con condenas plenamente firmes. Se corrigió también el error editorial sobre Sala i Grisó (ver sección "Sentencia del TC respecto a Sala i Grisó" más arriba).

2. **filesa-indultos-parciales-navarro-flores-olivero** — PROMOVIDO a `acreditado`. Respaldo N1 completo: RD 2700/2000 (Navarro, ya catalogado), RD 2442/2000 (Flores, localizado en esta sesión) y RD 2699/2000 (Oliveró, localizado en esta sesión). Los tres RD del BOE confirman el indulto de la mitad de las penas el 1 de diciembre de 2000.

## Candidatos a 'acreditado' pendientes (tras revisión 2026-05-30)

Hechos que NO se han podido promover por falta de documento N1 verificable con pasaje localizado:

1. **filesa-financiacion-irregular-psoe** — PERMANECE en `atribuido`. La cifra de "más de mil millones de pesetas" procede de los antecedentes de hecho de la STS 1/1997, cuyo texto íntegro sólo está disponible en el portal Equipo Nizkor (N3, `sentencia-ts-filesa-1997`). Las STCs 123-127/2001 reproducen las condenas concretas pero no el relato de hechos probados sobre la recaudación total. Sin un N1 que reproduzca el pasaje del "Fallo" o los "Hechos Probados" de la STS 1/1997 con localización exacta, no procede la promoción a `acreditado`. Pendiente de localizar en CENDOJ o de descarga cuando el TS publique la sentencia íntegra.

## Pendientes de PR2 (actualizados tras revisión V-04 del 2026-05-30)

Resueltos en la sesión de revisión V-04:
- [x] Localizar RD indulto Flores Valencia → BOE-A-2000-23478 (RD 2442/2000) ✓
- [x] Localizar RD indulto Oliveró Capellades → BOE-A-2000-23958 (RD 2699/2000) ✓
- [x] Localizar STC amparo Sala i Grisó → STC 124/2001, BOE-T-2001-12757 ✓ (+ corrección error editorial)
- [x] Localizar STCs amparos Navarro y Flores → STC 123/2001 (BOE-T-2001-12756) y STC 125/2001 (BOE-T-2001-12758) ✓

Pendientes aún abiertos:
- Buscar en CENDOJ si existe alguna referencia a la STS 1/1997 de la Causa Especial nº 880/1991 (necesario para elevar `filesa-financiacion-irregular-psoe` a `acreditado`).
- Confirmar estado procesal de la rama Viajes Ceres (JI nº 26 de Madrid) en 2025-2026.
- Añadir absueltos (Sánchez Marcos, Iglesias Díaz, Calleja González) como roles `absuelto` si se localizan datos verificados de su cargo o rol.
- Completar los magistrados Ramón Montero y Luis Román Puerta (integrantes del tribunal junto a Vega Ruiz) si se localizan sus datos en CGPJ/BOE.
- Investigar si existe nota oficial CGPJ sobre la STS 1/1997 (poco probable en 1997).

## Pendiente primario

- La sentencia íntegra STS 1/1997 no está en CENDOJ. Pendiente primario cuando aparezca en CENDOJ o se descargue de otro mirror auditable. El texto de derechos.org es fiable (N3 filtrado_verificado) pero no sustituye al PDF del órgano emisor. Este es el bloqueante para promover `filesa-financiacion-irregular-psoe` de `atribuido` a `acreditado`.
- Para las condenas individuales (filesa-condenas-firmes-1997) y los indultos (filesa-indultos-parciales-navarro-flores-olivero), el respaldo N1 es completo a través de las STCs 123-127/2001 y los RDs de indulto del BOE. No son necesarios primarios adicionales para esos hechos.

## Relaciones propuestas con otros casos del inventario

- **filesa → gurtel**: tipo `causa_conexa` — ambas son macrocausas de financiación irregular de partidos (PSOE en Filesa, PP en Gürtel). No hay nexo jurisdiccional formal pero sí conexión editorial relevante.
- **filesa → barcenas-caja-b**: tipo `causa_conexa` — la "caja b" del PP (caso Bárcenas) es el correlato temporal (años 90) de lo investigado en Filesa para el PSOE.
- **filesa → tres-por-ciento-cataluna**: tipo `causa_conexa` — el "3%" de CDC en Cataluña como patrón de financiación irregular contemporáneo.

## CIF/NIF de las sociedades de la trama (sweep API, 2026-06-04)

Barrido de poblado de `cif` para la API de datos abiertos (ver [ficha API — "Estado del
poblado de CIF"](../../../docs/web/features/api-datos-abiertos.md)). Umbral del proyecto:
fuente oficial **o** ≥2 bases registrales independientes coincidentes, con dígito de
control validado. Dos sociedades de Filesa quedan **sin aplicar** por no alcanzarlo —
candidatos plausibles para verificar con nota informativa del Registro Mercantil de
Barcelona:

- **`malesa-sociedad` (Malesa, S.A.)** — candidato `A58559782` (Infonif, fuente comercial
  **única**; dígito de control válido; coherente con el bloque A58 del Reg. Mercantil de
  Barcelona donde está Filesa S.A. = A58554908). Extinguida el 14/02/2003. No aplicado:
  falta 2.ª fuente independiente. Reg. Mercantil de Barcelona si se quiere confirmar.
- **`time-export` (Time Export)** — candidato `B08531279` (Empresia, fuente registral
  **única**; dígito de control válido). El BORME ([BORME-C-2004-17018](https://www.boe.es/buscar/doc.php?id=BORME-C-2004-17018))
  confirma la **identidad** (absorbida por Filesa, S.A. el 11-dic-2003, administrador
  único Luis Oliveró Capellades) pero no el CIF literal. **Ojo razón social:** los
  registros la identifican como **S.L.U.**, no "S.A." como dice hoy `time-export.yaml` y
  la prensa — revisar antes de tocar el campo `nombre`. No aplicado: fuente única del CIF.

**2.ª pasada enfocada (2026-06-05):** confirmado que ambos siguen siendo **fuente única**.
El BORME-C-2004-17018 acredita la *identidad* de Time Export (absorción por Filesa, S.A. el
11-dic-2003, administrador Luis Oliveró) pero **no cita el CIF**. Señal de cautela adicional:
una base registral muestra para "Filesa, S.A." un CIF distinto del conocido (`A58554908`) →
**riesgo de homonimia** en esta trama. Se mantienen **vacíos** hasta nota registral oficial
del Reg. Mercantil de Barcelona que cite el CIF literal. (Datos registrales de Malesa para
esa nota: T 9358, F 225, S 8, H B 78643.)

(El `instituto-noos` del caso Nóos quedó igualmente vacío: es asociación, no está en el
Reg. Mercantil; su NIF empezaría por G y estaría en el Reg. de Asociaciones de Cataluña.
Anotado en la ficha de la API.)

## Anotaciones migradas desde comentarios YAML (2026-06-02)

Nota interna que vivía como comentario `#` dentro de un bloque de texto YAML, donde se renderizaba en el sitio público (ver regla V-26 en doc 01). Reubicada aquí; el YAML quedó limpio.

- **`roles/sala-griso-condenado-firme.yaml`** — Número exacto de la STC del recurso de amparo de Sala i Grisó no localizado directamente; se deduce de la STC 124/2001 citada en cobertura. Verificar en BOE (se enmarca en el bloque "Pendiente primario" de arriba: STC 123-127/2001).
