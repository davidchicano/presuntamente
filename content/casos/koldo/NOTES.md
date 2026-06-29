# Caso Koldo — notas internas

## Barrido actualidad 2026-06-29

**Ventana:** 2026-06-23 → 2026-06-29. Barrido cruzado con Plus Ultra y Leire Díez.

### Conclusión

- **Sin hito procesal nuevo** posterior a la Sentencia TS 418/2026 del 22-jun-2026. La cobertura posterior detectada se centra en consecuencias políticas, reacciones, recursos anunciados o material no procesal; no se modela.
- **Primario oficial resuelto:** CENDOJ publica la sentencia como ROJ `STS 2553/2026`, ECLI `ES:TS:2026:2553`, referencia interna `11767153`, URL `openDocument` oficial y PDF `accessToPDF`. Se descarga copia oficial en `/public/documentos/koldo/sentencia-ts-418-2026-cendoj.pdf` (sha256 `c9e074c9f015e92645d25e3a3129a5dd79073bb8dbe53b2007626b774ff5f1d7`) y el Documento `sentencia-ts-418-2026-koldo` sube de N3 `filtrado_verificado` a N1 `publico`.
- **Cifras económicas publicables:** quedan estructuradas sólo las consecuencias de sentencia con soporte CENDOJ N1 (responsabilidad civil y decomiso). No se modela todavía un total agregado de contratos, comisiones o piezas conexas; requiere primarios completos y revisión anti-doble-conteo.
- Se mantiene la cascada prudente de la beta urgente: roles `condenado_no_firme`, hechos de sentencia como `atribuido` y pendiente de firmeza/revisión humana.

### Cruces

- **`leire-diez`**: la relación `leire-diez-comparte-actor-koldo` sigue vigente; el barrido no aporta un rol nuevo en Koldo que justifique editarla.
- **`plus-ultra`**: sigue como candidata futura, no modelada, por nexo Apamate/Aldama pendiente de primario estable.

### Cascada aplicada

- `ultima_revision_editorial` y `estado_ficha.fecha_actualizacion`: 2026-06-29.
- `estado_ficha.notas`: actualizada para dejar claro que el barrido no localizó hito nuevo pero sí resolvió el primario oficial íntegro en CENDOJ.
- Sin tocar `estado_actual`, roles, hechos, fase ni cifras.

## Bootstrap 2026-06-23

Esta pasada arranca el stub existente y lo lleva a beta pública urgente, no a ficha cerrada. Incluye:

- corregir el órgano principal de la pieza de mascarillas al Tribunal Supremo, porque las notas oficiales del CGPJ documentan que la Causa Especial 003/20775/2020 asumió los hechos vinculados a Ábalos, Koldo García y Víctor de Aldama procedentes del JCI nº 2 AN;
- conservar la Audiencia Nacional como pieza conexa, especialmente la pieza de obras públicas remitida al JCI nº 2 AN el 2-feb-2026;
- crear roles actuales y hechos muy prudentes, todos `atribuido` o `investigado`; ningún `Hecho.tipo=acreditado`;
- descargar y catalogar una copia íntegra de la Sentencia TS 418/2026 localizada en un mirror periodístico auditable, con hash local, como N3 `filtrado_verificado` hasta que aparezca copia oficial en CENDOJ/Poder Judicial.

El stub original indicaba "Juzgado Central de Instrucción nº 6". No se ha encontrado respaldo oficial para esa atribución en esta pieza; las fuentes oficiales consultadas apuntan al JCI nº 2 AN como órgano de procedencia de la causa especial y como receptor de la pieza de obras públicas remitida el 2-feb-2026. El JCI nº 6 queda fuera de este bootstrap salvo que una pasada posterior documente una pieza distinta.

## Decisiones editoriales

- La nota oficial del CGPJ sobre la sentencia del 22-jun-2026 se modela con hito `sentencia_primera_instancia` y roles `condenado_no_firme` por cautela. Aunque ya hay copia íntegra oficial de la Sentencia TS 418/2026 en CENDOJ/Poder Judicial, no se ha revisado aún la fórmula de firmeza/no recurso a efectos editoriales. No se promueve ningún hecho a `acreditado` sin revisión humana explícita.
- Se incluye a Santos Cerdán sólo por la pieza de obras públicas y con rol `investigado`, apoyado en la Sentencia TS 418/2026 y la nota oficial CGPJ del 2-feb-2026. No se le conecta con la sentencia de mascarillas del 22-jun-2026.
- Se incluye a Joseba Antxon Alonso en la pieza separada de obras públicas porque ya existe como persona con rol formal en Leire Díez y la Sentencia TS 418/2026 reproduce el auto que lo enumera como investigado en esa pieza. No se incorporan de momento el resto de nombres de la pieza separada para evitar exposición expansiva de personas no trabajadas en el inventario.
- No se crean familiares, testigos ni personas privadas mencionadas en prensa sin rol formal. Koldo García y Víctor de Aldama se tratan como figuras públicas por rol procesal formal en un procedimiento de relevancia pública.
- El 23-jun-2026 se creó `/public/documentos/koldo/sentencia-ts-418-2026-caso-koldo.pdf` desde el mirror público de El País. Hash SHA-256: `50a02d328a86a7619a9f2ba9cdb5df23220271b4587b227ebcf4c0019255cb90`. Metadatos `pdfinfo`: 224 páginas, productor PDFium, creación 22-jun-2026 14:53 CEST. El propio PDF incluye "Puede verificar este documento en administraciondejusticia.gob.es"; se mantuvo como N3 hasta localizar URL oficial.
- El 29-jun-2026 se localiza en CENDOJ la versión oficial como `ROJ: STS 2553/2026`, `ECLI:ES:TS:2026:2553`. El PDF oficial (`sentencia-ts-418-2026-cendoj.pdf`) tiene 84 páginas, productor Apache FOP Version 2.3, creación 25-jun-2026 14:00 CEST y hash SHA-256 `c9e074c9f015e92645d25e3a3129a5dd79073bb8dbe53b2007626b774ff5f1d7`. No es byte a byte idéntico al PDF de El País por paginación/sello, pero sustituye a éste como copia canónica N1.
- Se descarga también la nota resumen oficial DOCX del Tribunal Supremo desde `poderjudicial.es`. Hash SHA-256: `bccf04044793325a88655270d049bdf7df07a45c162e9708ac45ef01af50aeba`. Metadatos: creado/modificado el 22-jun-2026 10:28 UTC.

## Pendientes primarios

- resuelto_2026-06-29: localizado en `poderjudicial.es` / CENDOJ el texto íntegro oficial de la Sentencia 418/2026 / Causa Especial 003/20775/2020 y elevada la ficha documental a N1.
- pendiente_revision_humana: determinar si la sentencia de la Sala Segunda en causa especial debe tratarse ya como firme a efectos editoriales del inventario. Hasta entonces, roles `condenado_no_firme` y hechos subyacentes no `acreditado`.
- pendiente_primario: localizar el auto del 3-nov-2025 de procedimiento abreviado y el auto del 11-dic-2025 de apertura de juicio oral en los archivos asociados del CGPJ, descargar si procede y añadir hash.
- pendiente_primario: localizar auto o exposición razonada de la Audiencia Nacional que eleva la causa al Supremo y delimita el JCI nº 2 como órgano de procedencia.
- pendiente_modelo: si se decide modelar el tribunal completo, la Sentencia TS 418/2026 identifica como sala sentenciadora a Andrés Martínez Arrieta (presidente y ponente), Julián Sánchez Melgar, Manuel Marchena Gómez, Andrés Palomo del Arco, Susana Polo García, Eduardo de Porres Ortiz de Urbina y Javier Hernández García.
- pendiente_modelo: completar acusaciones populares, Fiscalía, defensas y medidas cautelares sólo cuando haya primario o cobertura cruzada suficiente.

## Relaciones candidatas no editadas

- `leire-diez-comparte-actor-koldo`: ya existe y se actualiza en esta pasada con Santos Cerdán y Joseba Antxon Alonso como roles ya modelados en Koldo. Ismael Oliver queda sólo anotado como defensa pendiente, sin crear rol en Koldo al no haber fuente procesal directa incorporada en esta pasada.
- `plus-ultra` ↔ `koldo`: candidata futura a `comparte_actor_con` o `conexion_factual` por el nexo Apamate/Aldama documentado en NOTES de Plus Ultra, pero no se propone YAML todavía: el nexo sigue procediendo de sumario/cobertura sin primario estable.

## Fuentes consultadas

- CGPJ, 2-dic-2024: el Supremo cita a Ábalos y asume la investigación sobre Koldo García y Víctor de Aldama.
- CGPJ, 3-nov-2025: auto de procedimiento abreviado contra Ábalos, Koldo García y Víctor de Aldama.
- CGPJ, 10-dic-2025: desestimación firme de recursos contra el pase a procedimiento abreviado.
- CGPJ, 11-dic-2025: apertura de juicio oral.
- CGPJ, 14-ene-2026: composición del tribunal de enjuiciamiento.
- CGPJ, 2-feb-2026: remisión de la pieza de obras públicas al JCI nº 2 AN.
- CGPJ, 22-jun-2026: sentencia condenatoria de la pieza de mascarillas.
- Tribunal Supremo, 22-jun-2026: nota resumen oficial DOCX de la Sentencia 418/2026.
- Sentencia TS 418/2026, copia oficial CENDOJ descargada el 29-jun-2026; se conserva además copia histórica N3 descargada el 23-jun-2026 desde El País.
- Newtral, 26-feb-2024: claves de la querella inicial de Anticorrupción.
