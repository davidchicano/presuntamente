# NOTES.md — Caso Malaya

> Anotaciones internas. Excluido del build público.

## Fuentes principales consultadas

- **CGPJ/poderjudicial.es (N1)**: Nota oficial sobre sentencia AP Málaga 535/2013 (4-oct-2013). URL: https://www.poderjudicial.es/cgpj/es/Poder_Judicial/Tribunales_Superiores_de_Justicia/TSJ_Andalucia__Ceuta_y_Melilla/Noticias_Judiciales_TSJ_Andalucia__Ceuta_y_Melilla/La_Audiencia_Provincial_de_Malaga_condena_a_Roca_a_11_anos_de_prision_y_multa-de-240-millones-de-euros--Sentencia-del--Caso-Malaya_
- **CGPJ/poderjudicial.es (N1)**: Nota oficial sobre sentencia TS de 27-jul-2015 que eleva condena de Roca a 17 años. URL: https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Tribunal-Supremo/Noticias-Judiciales/El-TS-confirma-la-mayoria-de-las-penas-del-caso-Malaya-y-eleva-de-11-a-17-anos-la-condena-a-Juan-Antonio-Roca
- **Wikipedia (referencia)**: Artículo «Caso Malaya» (https://es.wikipedia.org/wiki/Caso_Malaya). No se usa como fuente N1/N2/N3; sirve para orientar la búsqueda.
- **Confilegal (N4)**: «El Supremo eleva a 17 años la condena a Roca por el caso Malaya» (29-jul-2015). Medio especializado jurídico; utilizado como segunda línea editorial para V-13.
- **El Debate (N4)**: «Marbella recupera 92 millones veinte años después del caso Malaya» (2-abr-2026). Para datos de ejecución 2026.
- **Marbellaconfidencial.es (N4)**: Referencias a cambios en condenas del TS.

## Número de procedimiento confirmado

- **Juzgado Instrucción nº 5 Marbella**: Diligencias Previas 4796/2005 → Sumario 7/07
- **AP Málaga Sección 1ª**: Rollo Sumario 21/2007 → Sentencia 535/2013

## Promovidos a 'acreditado' (rev. maintainer 2026-05-30)

Los siguientes hechos han sido promovidos de `atribuido` a `acreditado` con cita literal de documentos N1 verificados (notas oficiales del CGPJ accesibles en poderjudicial.es):

1. **`malaya-condena-firme-roca`**: Promovido a `acreditado`. Respaldo: nota CGPJ-TS (N1, 29-jul-2015), accesible y verificada el 2026-05-30. Confirma 17 años a Roca (3,5 cohecho + 2,5 Hacienda + 7 blanqueo), 5 años y 6 meses a Yagüe, 3 años y 6 meses a García Marcos, reducción de 52 a 48 condenados. **Pendiente verificar cifra exacta de 232 M€ de multa** en texto íntegro de la sentencia TS (flaggeado en `importe_nota`); la cifra del importe queda en estado pendiente hasta CENDOJ.

2. **`malaya-trama-urbanistica`**: Promovido a `acreditado`. Respaldo: nota CGPJ-TS (N1, 29-jul-2015) y nota CGPJ-AP (N1, 4-oct-2013), ambas accesibles y verificadas el 2026-05-30. La nota AP describe la práctica corrupta con detalle; la nota TS confirma la sentencia firme manteniendo la trama probada.

## Candidatos a 'acreditado' no promovidos (V-04 — pendientes)

Los siguientes hechos se mantienen en su tipo actual por insuficiencia de cita verificable en N1/N2:

1. **`malaya-multa-roca-232m`** (mantiene `atribuido`): El importe de 12 M€ de blanqueo acreditado proviene de Wikipedia (no auditable como N1). La cifra de 232 M€ de multa está en notas N4 (El Debate 2026) y no se ha localizado en la nota CGPJ-TS ni en el texto íntegro de la sentencia (no localizado en CENDOJ). **No se promueve hasta que la sentencia TS sea localizable en CENDOJ o haya pasaje exacto verificable.**

2. **`malaya-expolio-municipal`** (mantiene `atribuido`): El importe de 92 M€ recuperados proviene de El Debate (N4, 2026); el rango 300-550 M€ es estimación periodística sin respaldo en un único documento judicial. **No se promueve por ausencia de N1/N2 para cifras estructuradas.**

3. **`malaya-condenas-ap-malaga-2013`** (mantiene `atribuido` / `superado`): Correcto mantener en `atribuido` y `vigencia: superado` porque la AP Málaga 2013 no es sentencia firme; la firma real es el TS 2015, modelada en `malaya-condena-firme-roca`.

4. **`malaya-bienes-incautados-roca`** (mantiene `investigado`): La valoración policial provisional (2.600 M€) es dato de investigación, no judicial. No es candidato a `acreditado` por diseño.

## Pendientes para PR2

### Documentos primarios

- **Sentencia TS (N3 actualmente)**: Localizar en CENDOJ la sentencia del TS de 27-jul-2015 (ponente Saavedra Ruiz) para elevar a N1. La búsqueda manual en https://www.poderjudicial.es/search/ debería localizar la ROJ. El PDF (3.138 folios) está en mirror https://www.losgenoveses.net/Personajes%20Populares/Garcia%20Urbano%20JM/14.%20Tribunal%20Supremo.%20Sentencia%20Caso%20Malaya.27.07.15.pdf pero el servidor devolvió `maxContentLength exceeded` (PDF demasiado grande para WebFetch en sandbox). El maintainer puede descargarlo directamente.
- **Sentencia AP Málaga 535/2013 (N1)**: El texto íntegro (5 tomos) está en CENDOJ. Los Tomos 1 y 4 tienen mirror en El Mundo (e00-elmundo.uecdn.es); el Tomo 4 está catalogado como Rollo Sumario 21/2007 y confirma la Sección 1ª y la composición del tribunal. `pendiente_primario`: descargar a /public/documentos/malaya/ cuando el maintainer tenga acceso.

### Personas no modeladas

- **Magistrado sustituto Óscar Pérez**: relevó a Torres Segura en la instrucción cuando fue trasladado a Granada. No se ha creado ficha por incertidumbre en el nombre completo; anotar como pendiente.
- **Magistrado Francisco Javier de Urquía Peña**: juez instructor del JI nº 2 de Marbella, investigado y condenado por el TSJA (agosto 2008) a 2 años de prisión y 7 años de inhabilitación por cohecho activo (recibió dinero de Roca para comprar una vivienda). Posteriormente el TS (abril 2009) recalificó a cohecho y le impuso 21 meses de suspensión de funciones. Causa conexa a Malaya. No se ha modelado porque no queda claro si su condena forma parte de la causa principal Malaya o de una pieza separada; requiere verificación para no duplicar.
- **Los 41 condenados adicionales del TS (total 48 menos los 7 ya modelados)**: no se modela el conjunto completo en PR1 por volumen; pendiente PR2. Los 4 absueltos por el TS (Joaquín Martínez Vilanova, Julio de Marco, José María Pérez Lozano, Francisco Soriano) tampoco están modelados.

### Causas conexas no modeladas

- **Caso Saqueo I**: malversación de 30 M€ desde las arcas municipales entre 1991-1995 a cuatro sociedades pantalla a nombre de la madre octogenaria de Roca. Condena firme TS en 2010. Candidato a caso propio en el inventario.
- **Caso Saqueo II**: desvío de al menos 70 M€ desde 1991 mediante testaferros y sociedades pantalla. Condenados: Roca y Julián Muñoz (penas reducidas en apelación TS). Candidato a caso propio.
- **Caso Fergocon**: obras municipales adjudicadas sin procedimiento entre 2001-2002 a empresa vinculada a los Del Nido; AP Málaga Sección 8ª condenó a José María del Nido y Julián Muñoz a 2 años y 3 meses de prisión e indemnización de 1,75 M€. Candidato a caso propio.
- **Causa del juez Urquía**: TSJA condenó al magistrado del JI nº 2 de Marbella por cohecho. Relacionado con Malaya pero es causa separada.

## Incertidumbres editoriales

- **Pena exacta de Tomás Reñones en sentencia firme TS**: La AP Málaga impuso 12 años; la cobertura cruzada del TS indica 5 años y 6 meses (fuente: resumen Telemadrid y Marbellaconfidencial). Se ha modelado 5 años y 6 meses pero pendiente confirmación en la sentencia TS.
- **Pena exacta de Pedro Román en sentencia firme TS**: La AP impuso 4 años; la cobertura indica 4 años y 6 meses como sentencia definitiva. Se modela 4 años y 6 meses según la cobertura del TS, pero pendiente confirmación.
- **Multa exacta de Roca en sentencia TS**: La AP impuso 240 M€; El Debate (2026) habla de 232 M€ «sólo por el caso Malaya». Se estructura 232 M€ como importe del hecho de condena firme, pendiente confirmar en sentencia TS.
- **Apellido completo de Pedro Román**: En la prensa aparece como «Pedro Román», sin segundo apellido confirmado. Se ha usado el slug `pedro-roman-malaga` para distinguirle de posibles homónimos.

## Decisiones editoriales tomadas

- **Del Nido en el caso Malaya**: Se modela en el caso Malaya como condenado firme aunque también aparece condenado en Fergocon (causa conexa). No se crea caso Fergocon en PR1.
- **Juez Urquía**: No se modela en este caso porque su condena es una causa separada; pendiente crear caso específico o pieza separada.
- **Cifra de bienes incautados 2.600 M€**: Es la valoración policial provisional inicial, no la cuantificación judicial del perjuicio. Se modela en hecho `malaya-bienes-incautados-roca` como tipo `investigado`, no como perjuicio estructurado, para evitar confusión con el quebranto acreditado (12 M€ de blanqueo).
- **GIL (Grupo Independiente Liberal)**: Se crea organización nueva `grupo-independiente-liberal` ya que no existe en el inventario. El partido fue el vehículo político de la trama.
- **Personas privadas**: No se han modelado ni los 41 condenados de segundo nivel ni los absueltos porque carecen de perfil público y su inclusión requeriría revisión V-17 individualizada.

## Relaciones entre casos propuestas

- Con `gurtel`: ambos son macrocausas de corrupción con adjudicaciones ilegales a empresas privadas a cambio de comisiones; Malaya tiene ámbito municipal, Gürtel tiene alcance autonómico y nacional. Tipo propuesto: `causa_analoga`.
- Con `barcenas-caja-b`: la financiación irregular del PP en Gürtel y Malaya tienen denominador común en las comisiones urbanísticas. Relación más débil (no hay conexión procesal directa). No se propone relación formal.
