# Partidos afectados por caso — **retirado el 2026-05-27**

> **Esta feature está retirada.** El campo `Caso.partidos_afectados[]` fue eliminado del schema y sustituido por el modelo de afectación directa/indirecta sobre `VinculoInstitucional`. Lectura canónica: [`afectacion-directa-indirecta.md`](afectacion-directa-indirecta.md) + [`docs/diseno/08-afectacion-directa-indirecta.md`](../../diseno/08-afectacion-directa-indirecta.md).
>
> Esta ficha se conserva como nota histórica para entender qué había antes y por qué se cambió. No describe el comportamiento actual.

## Qué hacía antes del refactor

Declaraba, caso a caso, qué partidos políticos quedaban "alcanzados" editorialmente por el procedimiento. Campo declarado por el editor con enum cerrado de 6 `tipo_afectacion`:

- `imputacion_a_cargo_del_partido`
- `gobierno_responsable_del_acto_investigado`
- `vinculo_familiar_directo_con_dirigente`
- `militancia_o_cargo_organico_relevante`
- `querella_o_acusacion_popular_del_partido`
- `otro`

10 entradas pobladas en los 6 casos publicables al cierre del sprint 2026-05-26.

## Por qué se retiró

Tres problemas estructurales que el refactor del 2026-05-27 resolvió de raíz:

1. **Confundía afectación con papel procesal.** `querella_o_acusacion_popular_del_partido` mezclaba "el caso alcanza al partido" con "el partido ejerce acusación popular". Un partido que se persona como acusación popular no está afectado: está acusando. El bug visual de Kitchen mostrando "Podemos · ACUSACIÓN POPULAR" como organización afectada en `/casos` venía exactamente de ahí.
2. **Vivía en paralelo a `VinculoInstitucional`.** La derivación de "organización afectada" en `/casos` y de "instituciones alcanzadas" en la ficha leía vínculos, mientras "partidos afectados" leía un campo aparte del caso. Dos verdades convivían sobre la misma pregunta editorial.
3. **No tenía granularidad de profundidad.** Todas las afectaciones aparecían en el mismo plano visual, sin distinguir entre sujeto procesal pasivo y partido salpicado por dependencia política. El lector no podía leer la profundidad.

## Cómo se ha resuelto

Modelo nuevo en una sola dimensión sobre `VinculoInstitucional`:

- `nivel_afectacion: directa | indirecta` (opcional; ausente para vínculos no-afectivos como acusación popular o cargos sueltos).
- `justificacion_afectacion`: prosa neutra. Hereda literalmente la que vivía en el campo retirado.
- Naturalezas nuevas: `ambito_administrativo_directo_del_acto_en_caso` (regla 4) + `afectacion_indirecta_en_caso` (reglas 1-4 del doc 08).

Reglas de validación V-22..V-24 en el schema de `VinculoInstitucional` garantizan coherencia: la acusación popular no puede llevar `nivel_afectacion`; las naturalezas de afectación lo exigen.

## Cómo se migraron las 10 entradas viejas

Cada entrada del campo viejo se mapeó al modelo nuevo conforme a las 6 reglas editoriales del doc 08:

| Caso | Entrada vieja | Decisión nueva | Vínculo creado |
|---|---|---|---|
| Plus Ultra | PSOE `gobierno_responsable_del_acto_investigado` | Indirecta (regla 1) | `psoe-afectado-indirecto-plus-ultra` |
| Plus Ultra | PSOE `militancia_o_cargo_organico_relevante` (Zapatero) | Descartada | Militancia histórica sin cargo activo en los hechos; no es afectación |
| Plus Ultra | Podemos `gobierno_responsable_del_acto_investigado` | Indirecta (regla 1) | `podemos-afectado-indirecto-plus-ultra` |
| Begoña Gómez | PSOE `vinculo_familiar_directo_con_dirigente` | Indirecta (regla 3) | `psoe-afectado-indirecto-bg` |
| González Amador | PP `vinculo_familiar_directo_con_dirigente` | Indirecta (regla 2) | `pp-afectado-indirecto-gonzalez-amador` |
| González Amador | PSOE `querella_o_acusacion_popular_del_partido` | No afectada (regla 5) | El vínculo `acusacion_institucional_en_caso` ya existía; sin `nivel_afectacion` |
| González Amador | Más Madrid `querella_o_acusacion_popular_del_partido` | No afectada (regla 5) | Idem |
| FGE | PSOE `gobierno_responsable_del_acto_investigado` | No afectada (regla 6) | Sin vínculo: el nombramiento de cargo con autonomía formal no afecta al partido del gobierno que nombró |
| Kitchen | PP `gobierno_responsable_del_acto_investigado` | Directa (Ministerio del Interior) + Indirecta (PP, regla 4) | `ministerio-interior-ambito-directo-kitchen` + `pp-afectado-indirecto-kitchen` |
| Kitchen | PP `imputacion_a_cargo_del_partido` | Incluida en el vínculo indirecto PP combinado | Idem |
| Kitchen | PSOE `querella_o_acusacion_popular_del_partido` | No afectada (regla 5) | Sin `nivel_afectacion` |
| Kitchen | Podemos `querella_o_acusacion_popular_del_partido` | No afectada (regla 5) | Idem |
| Lezo | PP `gobierno_responsable_del_acto_investigado` + `imputacion_a_cargo_del_partido` | Indirecta (combinada) | `pp-afectado-indirecto-lezo` |

La prosa literal de cada `justificacion` antigua se preservó en `justificacion_afectacion` (a veces ampliada para citar la regla del doc 08 que aplica).

## Pendientes operativos

- [x] Diseñar enum de `tipo_afectacion`. Cerrado 2026-05-26: seis valores.
- [x] Decidir si el campo es derivado o declarado. Cerrado 2026-05-26: declarado.
- [x] Entregar UI en PgCasoDetalle y /casos. Cerrado 2026-05-26.
- [x] Poblar los 6 casos. Cerrado 2026-05-26.
- [x] Refactor a `PartidoBadge`. Cerrado 2026-05-27 mañana.
- [x] **Refactor estructural "afectación directa vs indirecta"**. Cerrado 2026-05-27 noche. Campo retirado. Detalle en [`afectacion-directa-indirecta.md`](afectacion-directa-indirecta.md).
