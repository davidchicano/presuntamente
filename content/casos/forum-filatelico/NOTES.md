# NOTES — Caso Fórum Filatélico

## Fuentes consultadas en el modelado inicial (2026-05-30)

- **CGPJ / poderjudicial.es (N1)**:
  - Nota CGPJ sobre la sentencia de la Audiencia Nacional de 13-jul-2018
  - Nota CGPJ sobre la sentencia del Tribunal Supremo STS 688/2019 de 5-mar-2020
- **Prensa (N4, con triangulación múltiple)**:
  - El Independiente (2018-07-13)
  - Público.es (2020-03-05 y 2014-10-08)
  - El Español (2020-03-05)
  - Confilegal (2017-11-24 — rebaja condenas Afinsa TS)
  - Wikipedia ES (síntesis, no como fuente primaria; verificado contra notas CGPJ)
- **Nota sobre Afinsa (causa paralela)**: las noticias del CGPJ del TS 749/2017 de 21-nov-2017 para Afinsa (ponente también Colmenero) son causa separada y NO se mezclan con el YAML de forum-filatelico. Se han empleado sólo para contextualización.
- **Auto de transformación a Sumario 3/2013** (23-abr-2013): localizado en URL de ElMundo pero no descargable desde el sandbox. Pendiente descarga por el maintainer.

---

## Decisiones editoriales

### Afinsa vs Fórum Filatélico: causas separadas
Las dos causas son procedimientos penales independientes (distintos juicios orales, distintas sentencias). Afinsa tiene su propia sentencia del TS de 21-nov-2017 (STS 749/2017) y la AN de 27-jul-2016. El caso Fórum Filatélico tiene sentencia AN de 13-jul-2018 y STS 688/2019 de 5-mar-2020. El inventario sólo modela Fórum Filatélico aquí; Afinsa sería un caso propio separado si se decide incorporar.

### Número de condenados y penas
- AN (2018): 20 condenados de 27 acusados
- TS (2020): 16 condenados firmes de los 20 (absuelve 4)
- Pena máxima firme: 11 años 10 meses (Francisco Briones)

### Identificación de acusados restantes
De los 16 condenados firmes, sólo se han podido identificar con nombre completo verificado en fuentes N4 cruzadas:
- Francisco Briones Nieto (expresidente)
- Juan Ramón González Fernández (ex asesor jurídico)
- Antonio Merino (exdirector general; apellido "Blanco" por completar si se confirma)

Los 13 restantes aparecen en prensa con iniciales (J.M.C.L., J.C.S., R.R.B., P.R.R., etc.) o con nombres no verificados con suficiente precisión editorial. No se crean Persona para ellos por no disponer de fuente verificable. Se recogen en NOTES para revisión futura.

### José Manuel Carlos Llorca Rodríguez
Señalado en múltiples fuentes como el "cerebro" de la trama. Estaba en situación de rebeldía; no fue juzgado en el juicio oral principal. En enero de 2026 la AN confiscó 2,6 millones de francos suizos que le pertenecían (fondo MALAPA, Suiza) para destinarlos a la compensación de víctimas (fuente: The Objective, 2026-01-15). Pendiente: modelar si y cuando se proceda a enjuiciamiento.

### Candidatos a 'acreditado' (pendiente revisión humana)
Los siguientes hechos son candidatos a promover de `atribuido` a `acreditado` dado que la STS 688/2019 es sentencia firme y los hechos constan como probados:
- `ff-esquema-piramidal-captacion`: mecanismo piramidal declarado probado por el TS
- `ff-condena-firme-briones`: condena firme a Francisco Briones
- `ff-condena-firme-gonzalez`: condena firme a Juan Ramón González Fernández
- `ff-condena-firme-otros`: condenados restantes con sentencia firme
- `ff-perjuicio-civil`: responsabilidad civil declarada en sentencia firme

**La promoción a 'acreditado' requiere revisión humana explícita (guardarraíl V-04).** No promover automáticamente aunque la sentencia sea firme.

---

## Pendientes para próximas sesiones

1. **Primarios a descargar** (el maintainer debe ejecutar la descarga; el sandbox no lo permite):
   - Sentencia íntegra de la AN (13-jul-2018) — pendiente localizar en CENDOJ o mirror periodístico verificable. Se recomienda buscar en `cendoj.es` o solicitar al CGPJ.
   - STS 688/2019 completa — pendiente localizar en CENDOJ (búsqueda por número de recurso 2891/2018).
   - Auto de transformación a Sumario 3/2013 (23-abr-2013) — URL candidata en ElMundo (`e00-elmundo.uecdn.es/documentos/2013/04/23/auto_forum.pdf`); verificar legitimidad del PDF antes de descargar.

2. **Modelos pendientes**:
   - Los 13 condenados firmes restantes (nombres incompletos o no verificados).
   - Jueces instructores intermedios entre Garzón y Ruz (si hubo magistrado sustituto temporal).
   - Afinsa como causa paralela separada (slug sugerido: `afinsa`), si el maintainer decide incorporarla.
   - José Manuel Carlos Llorca Rodríguez: rebelde sin enjuiciar; hito de confiscación en Suiza (jan-2026).
   - Cuatro miembros absueltos del Consejo de Administración (identificados en algunas fuentes N4 como M.Á.H., F.J.L.G., A.F.R., J.M.M.) — no modelar hasta identificar con nombre completo verificado.

3. **Vínculos institucionales** (skill `/documentar-vinculos`):
   - Fórum Filatélico S.A. como entidad investigada.
   - La causa no afecta directamente a partidos políticos, sino a directivos de empresa privada.

4. **Cobertura mediática** (`content/cobertura-mediatica/`):
   - ADICAE y asociaciones de afectados tienen cobertura extensa; pendiente catalogar.

5. **archive.org mirrors** para las N4 usadas:
   - Ejecutar `pnpm archive:catchup -- --caso=forum-filatelico` cuando el maintainer tenga red.

---

## Notas de contexto

- La «Operación Atrio» afectó simultáneamente a Fórum Filatélico (JCI nº 5, Garzón) y Afinsa (causa separada, también en AN). Los 400.000 afectados totales que circulan en prensa suman los de ambas causas.
- El perjuicio de 3.707 millones para Fórum es la cifra del proceso concursal; la de Afinsa es 2.574 millones. La suma (~6.200 M€) no es cifra de un solo documento oficial.
- El Tribunal Supremo (Sala Contencioso-Administrativa) exoneró al Estado de responsabilidad patrimonial por falta de supervisión previa (sentencia 2019 / principios 2020), confirmando que las empresas estaban fuera de la supervisión formal de la CNMV en el período relevante.
