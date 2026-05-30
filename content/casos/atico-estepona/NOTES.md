# NOTES — caso ático de Estepona

> Anotaciones internas. **Excluido del build público.** Solo para humanos y agentes.

## Contexto base (modelado previo)

- Caso en estado `borrador` (`estado_publicacion: borrador`), `nivel_relevancia_editorial: media`.
- Órgano instructor: Juzgado de Primera Instancia e Instrucción nº 5 de Estepona (Málaga); juez instructor citado en cobertura: Eloy Marfil Gallardo.
- Roles: Ignacio González (investigado→desimputado) y Enrique Cerezo (investigado→desimputado), ambos cerrados con el sobreseimiento de 2020-07-14.
- Conexión con Lezo ya documentada en `content/relaciones-entre-casos/atico-estepona-conexo-lezo.yaml`: conexo factual por compartir investigado (Ignacio González), pero NO pieza separada (lo instruyó un juzgado ordinario de Estepona, no la Audiencia Nacional). **No reescribir esa relación** (la crea/edita Reconciliación).

## Barrido de actualidad 2026-05-30 (skill `actualizar-caso`)

**Ventana barrida:** desde la última fecha conocida (2020-07-14) hasta hoy (2026-05-30).

**Novedad incorporada (no estaba modelada):** la **Sección Novena de la Audiencia Provincial de Málaga**, por auto de **9 de noviembre de 2020** (notificado el 13-nov-2020; ponente Carmen María Castellanos González), **desestimó el recurso de apelación de las acusaciones populares y confirmó el sobreseimiento provisional** del JPI nº 5 de Estepona. Es un hito procesal real **posterior** al único hito catalogado (el archivo de 14-jul-2020) que faltaba en la ficha.

- Razonamiento (según cobertura): no constan indicios de cohecho (sin vínculo entre los contratos de Coast Investors y la actuación de González como vicepresidente/presidente de la CAM) ni de delito antecedente de blanqueo.
- **Importante:** la AP confirma el sobreseimiento **provisional**, no lo eleva a libre/definitivo. Por eso `fase_actual` se mantiene en `archivo_provisional` y `fecha_cierre` sigue en 2020-07-14 (fecha del auto que cierra los roles). El nuevo hito es una *confirmación en apelación*, no un cierre nuevo de roles.

**Modelado creado en esta pasada:**
- Hito `confirmacion-archivo-ap-malaga-2020-11-09` (`tipo: sentencia_apelacion`, fase_resultante `archivo_provisional`).
- Hecho `atico-confirmacion-archivo-apelacion-2020-11-09` (`tipo: exculpatorio`; SIN `importe` para no duplicar la cifra de 770.000 € ya estructurada en `atico-investigacion-fondos-2013-2020`, V-23).
- Documentos N4 (V-13, dos líneas editoriales distintas): `confilegal-ap-malaga-confirma-archivo-atico-2020-11-13` (Confilegal, especializado jurídico) + `elindependiente-ap-malaga-archiva-atico-2020-11-13` (El Independiente, generalista). Cruzado además con Público e Infolibre.
- Cascada en `caso.yaml`: `estado_actual`, `hechos_clave` (+1), `cifras_clave`, `estado_ficha.notas`, `ultima_revision_editorial`/`fecha_actualizacion` -> 2026-05-30. Roles NO se tocan (los cerró el auto de 2020-07-14; la confirmación en apelación no abre ni cierra rol nuevo).

**Cobertura consultada (líneas editoriales distintas):**

- Confilegal — "La Audiencia de Málaga confirma el archivo del caso del ático de Ignacio González" (13-nov-2020). https://confilegal.com/20201113-la-audiencia-de-malaga-confirma-el-archivo-del-caso-del-atico-de-ignacio-gonzalez/
- El Independiente — "La Audiencia de Málaga archiva el caso del ático de Ignacio González" (13-nov-2020). https://www.elindependiente.com/espana/2020/11/13/la-audiencia-de-malaga-archiva-el-caso-del-atico-de-ignacio-gonzalez/
- Público — "La Audiencia de Málaga confirma el archivo del caso del ático de Ignacio González". https://www.publico.es/politica/audiencia-malaga-confirma-archivo-definitivo-caso-atico-ignacio-gonzalez.html
- Infolibre — "La Audiencia de Málaga confirma el archivo del caso del ático del expresidente de Madrid Ignacio González" (13-nov-2020). https://www.infolibre.es/noticias/politica/2020/11/13/la_audiencia_malaga_confirma_archivo_del_caso_del_atico_del_expresidente_madrid_ignacio_gonzalez_113181_1012.html
- (Contexto del archivo de 1ª instancia: eldiario.es, El Español, Vozpópuli, Libertad Digital, elEconomista, 14-jul-2020.)

**Resultado del resto del barrido:** no se localizó ninguna novedad procesal en el caso del ático **posterior a noviembre de 2020** (ni reapertura, ni archivo libre/definitivo formal, ni prescripción documentada). El caso lleva archivado provisionalmente desde 2020.

### Pendientes

- [ ] **`pendiente_primario`**: el auto del JPI nº 5 de Estepona (14-jul-2020) y el auto de la Sección 9ª de la AP de Málaga (9-nov-2020) NO se han localizado en fuente oficial (CENDOJ/poderjudicial.es). Ambos hitos se sostienen solo con cobertura N4. Si aparecen en CENDOJ, elevar los Documentos a N1 conservando id y añadiendo `ruta_local`+`hash_sha256`. NO descargar de mirrors no auditables.
- [ ] **Comprobar prescripción / archivo libre** del procedimiento de Estepona a fecha actual (presunto cohecho/blanqueo). Si en algún momento se decretó sobreseimiento libre, sería un hito `sobreseimiento_libre` + cascada (`fase_actual: archivo_libre`, `fecha_cierre`).
- [ ] **Cruce con Lezo (persona pivote Ignacio González):** novedad relevante EN Lezo, no en el ático, pero conviene tenerla a la vista para la coherencia del inventario. Cobertura dic-2025 (Confilegal, Infobae, El Diario, El Debate): la AN ha señalado el juicio de la pieza del **campo de golf del Canal** para **13-30 septiembre de 2027** (Anticorrupción pide 6 años para González por dos cohechos); y la pieza **Inassa** arrancaría en **septiembre de 2026** (Fiscalía pide 8 años). Esto NO toca el ático (instruido por juzgado ordinario, no AN) más allá del nexo ya documentado de "comparte investigado". NO inferir vínculo procesal nuevo entre ático y Lezo. **Estas novedades son material para `/actualizar-caso lezo`, no para este caso.**
- [ ] La cobertura de El Plural (nov-2025) compara el "modus operandi" del caso del ático de Ayuso con el de Ignacio González: es contexto periodístico de opinión, NO nexo procesal. Descarte para modelado; anotado por si surge tracción.

## Anonimización aplicada 2026-05-30 (V-17)

La esposa de Ignacio González figura como coinvestigada en el procedimiento según la cobertura de época, pero el caso fue sobreseído provisionalmente sin condena. Por decisión del maintainer, se aplica minimización (V-17 + doc 04) en todos los campos publicables: el nombre propio ha sido sustituido por la referencia relacional «su esposa» (o «la esposa de Ignacio González» donde quedara ambiguo el sujeto). No se crea ficha de persona ni RolEnCaso para ella. Su identidad consta en la cobertura periodística de la época (El Español, eldiario.es, Vozpópuli, Confilegal, entre otros).

### Decisión de esta pasada

- SÍ hay novedad real (confirmación en apelación 2020) -> se modela hito + hecho + 2 documentos + cascada en `caso.yaml`.
- Roles NO modificados (la confirmación en apelación no abre ni cierra rol; los roles ya estaban cerrados por el auto de 2020-07-14).
- Relación con Lezo NO modificada (ya existe; es competencia del agente de Reconciliación).
- Se crea este `NOTES.md` (no existía antes de esta pasada).
