# NOTES — barcenas-caja-b

Anotaciones internas del caso. No se publica en el sitio.

## Decisiones editoriales

### Estructura del caso: dos piezas, un caso

El caso `barcenas-caja-b` agrupa dos piezas que comparten instrucción y órgano pero tienen destinos distintos:

1. **Pieza Génova** («pago en negro de obras»): sentencia firme TS (15-nov-2024, ECLI:ES:TS:2024:5577). Modelada con hitos, hechos y roles completos.
2. **Pieza de donaciones** («aportaciones empresarios ↔ contratos»): sobreseída provisionalmente por Pedraz (19-dic-2022). Modelada como hecho exculpatorio y hito de archivo.

Alternativa considerada: separar en dos sub-casos. Descartada porque la instrucción fue unificada bajo el mismo juzgado y la misma numeración de diligencias previas.

### Rol del PP: responsable civil subsidiario

El Partido Popular no es condenado penalmente; es declarado «responsable civil subsidiario» de los delitos fiscales de Unifica. El schema no tiene un enum específico para este rol. Se modela provisionalmente como `perjudicado` en el schema de rol-en-caso con nota explicativa larga. Si el maintainer considera necesario ampliar el enum con `responsable_civil_subsidiario`, este es un buen caso precedente.

### Álvaro Lapuerta: sin rol en este caso

El extesorero Álvaro Lapuerta fue inicialmente investigado y acusado, pero fue sobreseído en 2016 por demencia sobrevenida (informe forense) y falleció en junio de 2018 antes del juicio. Se ha optado por NO crear un rol para Lapuerta en este caso porque:
- Su causa quedó extinguida con su muerte.
- Modelarle con un rol activo generaría confusión editorial.
- La mención a su fallecimiento y sobreseimiento aparece en los hitos relevantes.
Si en el futuro se añade un rol `extinguido_por_fallecimiento` al schema, Lapuerta sería candidato prioritario.

### Cristóbal Páez y Laura Montero: absueltos

El exgerente del PP Cristóbal Páez y la empleada de Unifica Laura Montero fueron absueltos por la AN en 2021. No se crean Persona ni Rol porque no tienen condena y la absueltos no son la parte central del caso. Si se modelan en el futuro, sus roles serían `absuelto` con hito_origen_id apuntando a `barcenas-sentencia-an-genova-2021-10-28`.

### Persona jurídica Unifica S.L.

Se crea como organización nueva (`unifica-sl`). El schema de RolEnCaso admite organizaciones como `condenado_firme` desde la ampliación V-11 (precedente González Amador / Maxwell Cremona). Sin embargo, en este caso los condenados son las personas físicas administradoras, no la entidad en sí (la AN condenó a los administradores, no a la sociedad como persona jurídica). Unifica aparece como responsable civil directa y solidaria en el auto de apertura de juicio oral pero no como condenada penalmente en la sentencia firme. Por eso no se le asigna rol `condenado_firme`.

## Promovidos a `acreditado` (rev. maintainer 2026-05-30)

Los siguientes hechos han sido promovidos de `atribuido` a `acreditado` mediante revisión humana explícita del maintainer (2026-05-30). La promoción se sustenta en sentencia firme del TS (ECLI:ES:TS:2024:5577, 15-nov-2024) verificada mediante notas CGPJ N1 (poderjudicial.es) accesibles en línea. Las citas literales de los pasajes han sido incorporadas a los YAML de cada hecho.

1. `barcenas-caja-b-contabilidad-paralela` — Existencia de contabilidad B institucionalizada. Hecho probado por AN (oct-2021) confirmado por TS (nov-2024). Cita literal de Hechos Probados incorporada.
2. `barcenas-pago-en-negro-obras-genova` — Pago de 1.072.000 € en negro a Unifica. Cita literal «ascendió a 1.072.000 euros» de Hechos Probados AN-2021 verificada vía nota CGPJ + prensa identificable cruzada.
3. `barcenas-caja-b-responsabilidad-civil-pp` — Responsabilidad civil del PP de 123.669 €. Confirmada por TS; cita del Fallo AN-2021 incorporada.
4. `barcenas-condena-firme-genova` — Penas reducidas en casación. Citas literales del Fallo TS incorporadas (8 meses Bárcenas, 9 meses Urquijo/García, multas, dilaciones indebidas).

## LLM-incierto: pendientes de verificar

- Fecha exacta del auto de incoación de diligencias previas (se cita "marzo 2013"; en algunas fuentes aparece "7 de marzo de 2013" pero sin referencia oficial directa).
- Número exacto de diligencias previas de la pieza separada ante el JCI nº 5 (no localizado en CENDOJ ni en notas CGPJ consultadas).
- Fecha de nombramiento oficial de José de la Mata como representante en Eurojust (citado como "noviembre 2020"; verificar BOE).
- Número de la sentencia de la AN de 28 de octubre de 2021 (la nota CGPJ no lo especifica; pendiente buscar en CENDOJ).

## Pendientes primarios (documentos)

- Sentencia AN de 28 de octubre de 2021 íntegra → pendiente localizar en CENDOJ/repositorio AN; la nota CGPJ es N1 pero sin número de resolución.
- Sentencia TS ECLI:ES:TS:2024:5577 íntegra → pendiente localizar en CENDOJ y descargar como primario con `ruta_local` + `hash_sha256`.
- Auto de sobreseimiento provisional de Pedraz de 19 de diciembre de 2022 → no localizado en CENDOJ (instrucción de juzgado ordinario de AN).

## Fuentes clave consultadas

- Nota oficial CGPJ apertura juicio oral (2015): N1 directo.
- Nota oficial CGPJ sentencia AN (28-oct-2021): N1 directo.
- Nota oficial CGPJ sentencia TS (15-nov-2024): N1 directo → URL que identifica ponente (Antonio del Moral) y ECLI.
- El Español (15-nov-2024): identifica el ponente y penas reducidas.
- Eldiario.es (28-oct-2021): hechos probados de la sentencia AN.
- El Debate (19-dic-2022): auto de sobreseimiento provisional Pedraz.
- Eldiario.es (feb-2021): cronología completa y árbol de piezas.
- Wikipedia Caso Bárcenas: cronología orientativa; no usada como fuente directa de hechos.

## Relaciones con otros casos del inventario

- **Gürtel** (`gurtel`): caso padre. Esta pieza es derivada directa. Tipo `pieza_separada` ya modelado en `caso.yaml`.
- **Kitchen** (`kitchen`): la Operación Kitchen se atribuye presuntamente al intento de hacerse con documentación de Bárcenas que podría haber llegado a la justicia en esta pieza. Nexo funcional/causal documentado. Proponer `RelacionEntreCasos` tipo `causa_conexa`.

## Revisión editorial pendiente

- Revisar que todos los hechos usan verbos permitidos por doc 04.
- Verificar que los roles de Páez y Montero (absueltos) no estén implícitos en ningún enunciado de Hecho.
- Pendiente: roles de acusaciones populares en el juicio de 2021 (IU y otros). Fuentes consultadas no permiten identificar con certeza qué acusaciones populares participaron; pendiente para PR2.
