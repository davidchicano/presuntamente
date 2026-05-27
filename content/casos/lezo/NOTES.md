# NOTES — caso Lezo (tras PR1-PR7 + barrido prelaunch 2026-05-27)

Anotaciones internas. Excluido del build público.

## Barrido prelaunch 2026-05-27

Estado de las piezas activas a fecha de barrido:

- **Pieza Inassa (vista oral):** La vista oral fue suspendida en febrero de 2026 por huelga de funcionarios de justicia. Se reanudó el 10 de mayo de 2026. A fecha de barrido (27-may-2026) no hay veredicto publicado; la sentencia está pendiente. No se modela hito hasta que recaiga resolución publicable.
- **Pieza Golf (juicio oral):** El señalamiento sigue para septiembre-octubre de 2027 ante la Sección 2ª de la Sala de lo Penal de la AN. Sin novedades procesales en el intervalo.
- **Sin hitos nuevos incorporados.** El estado del caso no ha cambiado procesalmente de modo que requiera nuevo Hito modelable entre el cierre de PR7 (24-may-2026) y el barrido (27-may-2026).
- **Sentencias pendientes para PR8+:** cuando recaiga sentencia en Inassa y/o Golf, modelar hito `sentencia_primera_instancia` + roles consecutivos conforme al patrón ya establecido en FGE (cuatro roles en cadena: `investigado → procesado → condenado_no_firme → condenado_firme`).

---



## Estado consolidado tras PR1-PR7 (pieza Navalcarnero al completo + refino caso.yaml)

Acumulado tras PR1 + PR2 + PR3 + PR4 + PR5 + PR6 + PR7:

- **15 personas fichadas**: Jaime Ignacio González González (procesado
  golf + Emissao + Navalcarnero + investigado→desimputado Inassa), su
  hermano Pablo Manuel González González (procesado golf), su cuñado
  Juan José Caballero Escudier (procesado golf), el socio José Antonio
  Clemente Marín (procesado golf), el ex director gerente del Canal
  Ildefonso de Miguel Rodríguez (procesado golf + Navalcarnero), el
  consejero de OHL Francisco Javier López Madrid (investigado →
  procesado pieza Navalcarnero), **el empresario Adrián de la Joya
  Ruiz de Velasco (procesado Navalcarnero, PR7)**, **el ex consejero
  ejecutivo de OHL Rafael Martín de Nicolás Martín (procesado
  Navalcarnero, PR7)**, **el ex director de Control de Gestión de
  OHL Felicísimo Damián Ramos Ramos (procesado Navalcarnero, PR7)**,
  Edmundo Rodríguez Sobrino (procesado Emissao + Inassa), Pedro
  Luis Calvo Poch (procesado Inassa), Juan Bravo Rivera (procesado
  Inassa), Alberto Ruiz-Gallardón Jiménez (investigado→desimputado
  Inassa) más los cuatro magistrados (Velasco, García-Castellón,
  Tardón, Piña) y Fernando Andreu como ponente del tribunal.
- **5 organizaciones nuevas**: Canal de Isabel II, Comunidad de
  Madrid, Ayuntamiento de Madrid, Tecnoconcret Proyectos de
  Ingeniería (TCT), Unidad Central Operativa de la Guardia Civil
  (UCO). Tribunal Supremo, Audiencia Nacional y JCI nº 6 fichados
  previamente por otras sesiones; Fiscalía Anticorrupción ya
  existía en main.
- **8 hitos**: operación UCO 19-abr-2017 (imputación) → prisión
  preventiva Velasco 22-abr-2017 (declaracion_imputado) → cambio
  juez Velasco→Castellón jul-2017 (cambio_juez) → auto procesamiento
  pieza Emissao 18-nov-2019 (auto_procesamiento) → archivo pieza
  Inassa para Ruiz-Gallardón y otros 14 desimputados 30-may-2019
  (archivo_provisional) → **apertura juicio oral pieza Navalcarnero
  4-jun-2021 (apertura_juicio_oral, PR6)** → inicio vista oral pieza
  Inassa 24-may-2023 (inicio_vista_oral) → cambio juez Castellón→Piña
  8-ene-2025 (cambio_juez) → señalamiento juicio pieza golf
  22-dic-2025 (apertura_juicio_oral).
- **8 hechos**: adjudicación amañada campo golf 2003-2004 (atribuido),
  comisiones sobres efectivo TCT (atribuido), prisión preventiva
  Ignacio González abril 2017 (atribuido), múltiples piezas
  separadas activas (investigado), compra Inassa sobreprecio 2001
  (atribuido), compra Emissao desvío 2013 (atribuido), archivo
  Ruiz-Gallardón pieza Inassa 2019 (exculpatorio), **adjudicación
  amañada tren ligero Móstoles-Navalcarnero 2007 (atribuido, PR6)**.
- **21 roles**: 5 procesados en pieza golf + 3 procesados en
  Inassa + Rodríguez Sobrino procesado Emissao+Inassa + Ignacio
  González investigado→procesado-golf→**procesado-Navalcarnero (PR6)** +
  Ildefonso de Miguel **procesado-Navalcarnero (PR6)** sumado a su
  procesado-golf existente + **López Madrid investigado→procesado
  pieza Navalcarnero (PR6)** + **De la Joya, Martín de Nicolás y Ramos
  procesados pieza Navalcarnero (PR7)** + Ruiz-Gallardón
  investigado→desimputado + 4 jueces instructores en cadena
  Velasco/Castellón/Tardón/Piña + Andreu juez_ponente Sec 2ª +
  Comunidad de Madrid acusación_particular + Ayuntamiento de Madrid
  acusación_particular + Canal de Isabel II perjudicado.
- **14 documentos**: dos N1 BOE descargados al árbol
  (BOE-A-2024-17653 jubilación García-Castellón + BOE-A-2025-350
  RD destino Piña, ambos con `ruta_local` + `hash_sha256` y XMLs
  estructurados); doce N4 de cobertura cruzada en siete líneas
  editoriales distintas (El Español, Público, El Independiente,
  eldiario.es, Confilegal, The Objective, **infoLibre — alta en
  PR6**).
- **1 delito nuevo catalogado en PR6**: `fraude-administraciones-publicas`
  (art. 436 CP), familia `contra_administracion_publica`. Atribuido
  en la pieza Navalcarnero a López Madrid, Martín de Nicolás, Ramos,
  Ignacio González, Ildefonso de Miguel y De la Joya. Reutilizable
  en futuras causas.
- **1 organización nueva catalogada en PR6**: `infolibre` (medio de
  comunicación, ámbito nacional). Reutilizable.

## Tensión brief vs realidad procesal (guardarrail 1 de `/investigar-caso`)

El brief inicial del maintainer (sesión 2026-05-23, planning Bloque
A del Camino al lanzamiento público) presentaba a Lezo como caso
con **sentencia firme del Tribunal Supremo** por delitos vinculados
al Canal de Isabel II, candidato para servir como 2º caso firme del
inventario tras el FGE.

La investigación confirmó que **a fecha de PR1 (2026-05-23) no
existe sentencia firme del TS en ninguna pieza**. El juicio oral
más avanzado (pieza del campo de golf) ha sido señalado por la
Sección Segunda de la Sala de lo Penal de la Audiencia Nacional
para **13-30 de septiembre de 2027**. La pieza Inassa inició
vista oral el 24 de mayo de 2023 ante la misma Sección Segunda;
la sentencia de esta primera pieza no se localiza públicamente a
fecha de PR4 (posible incidente de cuestiones previas o jurado
todavía no resuelto; pendiente seguimiento). La pieza Emissao
sigue en fase intermedia desde el auto de procesamiento del 18
de noviembre de 2019.

Decisión editorial mantenida durante los cuatro PRs: hechos en
estado `atribuido` / `investigado` / `exculpatorio`, sin
`acreditado` hasta resolución firme.

## Convención editorial fijada en la cobertura de Lezo

- **Magistrados de cargo público nominal**: fichados con
  `cargos_publicos_historicos` precisos (BOE / CGPJ); cuando la
  fecha de cargo es incierta, anotada como aproximada en NOTES.
  Aplicado a Velasco, García-Castellón, Tardón, Piña, Andreu.
- **Procesados privados con rol formal**: fichados como
  `es_figura_publica: false` con biografía corta neutra ceñida a
  rol procesal sin datos personales innecesarios (V-17 y [doc 04 — "Ética"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#11-ética)). Aplicado a Pablo González, Caballero, Clemente. Revisión
  obligatoria de anonimización si su rol se cierra con absolución
  o desimputación.
- **Procesados privados que también son figuras públicas por
  cargo histórico**: Ildefonso de Miguel (ex gerente Canal)
  fichado como figura pública con cargo histórico. Caso especial
  porque su rol procesal arranca por ese cargo.
- **Ignacio González como caso multi-pieza**: tres tramos
  procesales distintos modelados con tres roles consecutivos del
  mismo sujeto sobre el mismo `caso_id: lezo` — `investigado`
  (cubre la apertura del procedimiento 2017-2019), `procesado`
  pieza golf (2019-vigente) y `desimputado` pieza Inassa
  (2019-vigente). El sistema lo gestiona naturalmente porque el
  modelo no exige unicidad sujeto×caso, sólo sujeto×caso×rol.
- **Cuantías en M€ y M$**: las cuantías de las piezas en USD
  (Inassa 73 M$; Emissao 30 M$) se conservan en USD por
  fidelidad a la operación original; las peticiones de pena y
  responsabilidad civil en €. RichProse autoformatea ambas.
- **Nombre completo de Ignacio González**: la cobertura jurídica
  indica «Jaime Ignacio González González» como nombre formal.
  Persona fichada con ese nombre completo y la prensa generalista
  cubierta en `nombres_alternativos` («Ignacio González»,
  «Ignacio González González», «González González»).
- **TCT**: nombre legal «Tecnoconcret Proyectos de Ingeniería»
  según cobertura jurídica. Fichada como `Organizacion(tipo:
  empresa)` sin CIF por no contar con la confirmación registral.

## Niveles de fuente — decisiones aplicadas

- **N1**: dos documentos del BOE en el repositorio local
  (BOE-A-2024-17653 y BOE-A-2025-350) con `ruta_local` +
  `hash_sha256` + XML estructurado del propio BOE. Pendientes
  N1 adicionales: notas oficiales del CGPJ sobre el auto de
  procesamiento Emissao 18-nov-2019 y sobre el auto de apertura
  de juicio oral pieza golf agosto 2021 si están accesibles en
  `poderjudicial.es`; auto íntegro si llega a CENDOJ tras
  primera sentencia de la pieza Inassa.
- **N4**: cobertura cruzada de seis líneas editoriales
  (El Español + Público + Confilegal + eldiario.es + El
  Independiente + The Objective). V-13 cumplido en todos los
  hitos sin documento oficial accesible.
- **Hook archive.org**: los 9 documentos N4 de Lezo se
  procesarán con `pnpm archive:catchup` cuando haya red.
  Sin verificación específica en NOTES.

## Pendientes PR8+

Actualizado tras el cierre de PR7 (sesión 24-may-2026), que cerró
al 100% la composición de la pieza separada nº 3 (Navalcarnero):
fichó como Personas a Adrián de la Joya Ruiz de Velasco, Rafael
Martín de Nicolás Martín y Felicísimo Damián Ramos Ramos, y añadió
los tres roles `procesado-pieza-navalcarnero` correspondientes
junto al hito de apertura JO ya ampliado en `personas_afectadas` con
los seis procesados. Corrección de nombre incorporada: el segundo
apellido de Felicísimo Damián Ramos es **Ramos** (no «Sánchez» como
anotaba la NOTES de PR6 con cobertura más débil). El refino del
`caso.yaml` reescribe el comentario de cabecera para listar las seis
piezas documentadas (golf, Inassa, Emissao, Navalcarnero,
Ruiz-Gallardón y conexión `atico-estepona`) y amplía la
`descripcion_corta` para citar también Inassa, Navalcarnero y la
conexión ático-Estepona. Sin nuevos catalogados.

**Investigaciones sin hallazgo positivo en la misma sesión** (anotadas
para PR8+):

- **Sentencia primera instancia pieza Inassa**: búsqueda intensiva
  en 2026-05-24 (eldiario.es, Confilegal, Público, The Objective,
  iAgua, El Plural, El Independiente, Wikipedia ES) no localizó
  sentencia accesible públicamente para los 22 procesados de la
  pieza Inassa cuya vista oral arrancó el 24-may-2023 con 18
  sesiones previstas hasta el 27-jun-2023. Sin cobertura sólida
  posterior al cierre del juicio. Aplazar el rastreo a CENDOJ y a
  poderjudicial.es; si recae, modelar hito `sentencia_primera_instancia`
  + transformar los 22 roles `procesado` en `condenado_no_firme` o
  `absuelto` según el fallo. Patrón de cuatro roles consecutivos
  del mismo sujeto ya validado en FGE.
- **Estado actual pieza Navalcarnero a 2026**: sin señalamiento de
  fecha de juicio oral localizable a la misma fecha; sin sentencia.
  Cobertura editorial más reciente identificada en la sesión:
  informe definitivo de la UCO (eldiario.es 22-jun-2022) que
  confirma comisiones superiores a 1 M€ y 2,5 M$ desde cuenta OHL
  en Banco Santander. Sin novedad procesal pública relevante entre
  2022 y 2026. Pendiente cruzar con la agenda de señalamientos
  oficial del CGPJ
  (`poderjudicial.es/cgpj/es/Poder-Judicial/Audiencia-Nacional/Portal-de-Transparencia/Te-puede-interesar---/Agenda-de-senalamientos/`).

**Refinamientos no críticos** (heredados de PR6 con ajustes):

- **Diego Fernando García Arias, Luis Vicente Moro Díaz y
  Ramón Navarro Pereira** como procesados Emissao/Inassa.
  Figuras menores (director de nuevos negocios de Inassa,
  vinculado a Essentium, director gerente de Triple A). Evaluación
  caso a caso conforme a V-17 / [doc 04 — "Ética"](../../../docs/diseno/04-riesgos-legales-y-eticos.md#11-ética). La opción
  conservadora es dejarlos como mención en la descripción del
  hito sin Persona propia.
- **Resto de desimputados de la pieza Inassa** (12 personas
  más sobreseídas el 30-may-2019, ya tienen Cobo y Ruiz-Gallardón
  fichados de los principales). Modelar sólo las que sean
  figuras públicas relevantes; el resto puede quedar como
  mención en descripción del hito de archivo
  `archivo-pieza-inassa-gallardon-lezo-2019-05-30`.
- **Esperanza Aguirre** como Persona si se documenta
  formalmente su comparecencia como testigo o cualquier rol
  procesal en alguna pieza. La cobertura indica que fue
  requerida a testificar; pendiente de verificar si se llegó
  a celebrar la diligencia y en qué pieza.
- **Auto íntegro de la providencia de la Sec 2ª de la AN
  señalando juicio oral pieza golf para sept-2027** si aparece
  en CENDOJ o nota CGPJ específica. Probable que sea
  providencia interna no publicable.
- **Sentencia de primera instancia de la pieza Inassa** si ya
  ha recaído tras la vista oral del 24-may-2023; pendiente de
  rastrear. Si recae, modelar como hito `sentencia_primera_instancia`
  + roles consecutivos (`procesado` → `condenado_no_firme` o
  `absuelto`) para los 22 acusados. Patrón de cuatro roles
  consecutivos en cadena ya validado en FGE.
- **Promoción a `acreditado`** de los hechos respaldados por
  resolución firme: aplazada al juicio oral de septiembre de
  2027 y eventual casación posterior para la pieza golf, y a
  la primera sentencia de Inassa cuando se localice. Hasta
  entonces, todos los hechos conservados en `atribuido` /
  `investigado` / `exculpatorio` conforme al guardarrail 3 de
  `/investigar-caso`.
- ~~Adrián de la Joya, Rafael Martín de Nicolás Martín y
  Felicísimo Ramos Sánchez~~ → **Cerrado en PR7** como De la Joya,
  Martín de Nicolás Martín y Ramos Ramos (segundo apellido
  corregido tras cobertura más fiable: Público + eldiario.es +
  vanguardia.com.mx para Felicísimo Damián Ramos Ramos como
  director de Control de Gestión OHL hasta su jubilación en 2013).

- **~~Acuerdo del CGPJ que adscribe a Manuel María García-Castellón
  García-Lomas al Juzgado Central de Instrucción nº 6~~** —
  **Resuelto el 2026-05-27 noche (3)** tras navegación directa al
  endpoint estable de boletines del CGPJ. El maintainer aportó el
  curl del formulario de búsqueda del CGPJ; el agente confirmó que
  ese buscador interno sólo indexa acuerdos a partir de 2024 (no
  llega a 2017) pero localizó las URLs canónicas del histórico
  estático de boletines en `/cgpj/es/Servicios/Acuerdos-del-CGPJ/Historico-Acuerdos-de-la-Comision-Permanente/Acuerdos-de-la-Comision-Permanente-del-CGPJ-de-<DD>-de-<mes>-de-<YYYY>`,
  cada uno con su PDF en `/stfls/CGPJ/SECRETARÍA GENERAL/ACUERDOS
  DE LA COMISIÓN PERMANENTE/FICHERO/<YYYYMMDD> BoletinesAcuerdosCP.pdf`.
  La fecha real del acuerdo de reingreso es **22 de junio de 2017**
  (acuerdo 1.1-2, no 6-jun-2017 como suponía el sub-agente Sonnet
  Explore por cita imprecisa de tres medios). Texto literal: «Acordar
  el reingreso al servicio activo en la Carrera Judicial del
  magistrado Manuel García-Castellón García-Lomas, con destino en el
  Juzgado Central de Instrucción número 6 con efectos económicos y
  administrativos del día 16 de junio de 2017, disponiendo del plazo
  de 20 días hábiles para tomar posesión a partir de dicho momento.»
  Boletín íntegro descargado al árbol como `cgpj-cp-22jun2017-reingreso-castellon-jci6.pdf`
  (400 803 bytes, sha256 `39c968b7…f5870b`).

  Adicionalmente se localizó y descargó el acuerdo 2-3-1 de la
  Comisión Permanente del 8 de junio de 2017 (boletín
  `cgpj-cp-08jun2017-velasco-interino-jci6.pdf`, 312 563 bytes, sha256
  `dc535616…f259a`) por el que, al amparo del artículo 216 bis 1
  párrafo 2 LOPJ, se acuerda la adscripción obligatoria de Eloy
  Velasco Núñez en régimen de comisión de servicio sin relevación
  de funciones para cubrir interinamente la vacante del JCI nº 6
  «hasta la incorporación efectiva del magistrado Manuel
  García-Castellón García-Lomas». Esta medida cautelar interina
  explica la transición ordenada del juzgado mientras García-Castellón
  formalizaba su reingreso desde el extranjero.

  El hito `cambio-juez-velasco-castellon-lezo-2017-07-01` queda
  cumplimentado con cinco documentos: `documento_principal_id`
  `cgpj-cp-22jun2017-reingreso-castellon-jci6` (N1, acuerdo formal
  de adscripción); `documentos_relacionados[0]`
  `cgpj-cp-08jun2017-velasco-interino-jci6` (N1, medida cautelar
  interina); `documentos_relacionados[1]`
  `cgpj-velasco-sala-apelaciones-2017-05-17` (N1, nota CGPJ que
  adjudica las plazas de la Sala de Apelación a Velasco y Enrique
  López); `documentos_relacionados[2]`
  `boe-rd527-vacante-velasco-jci6-2017-05-24` (N1, RD 527/2017 que
  formaliza por Real Decreto el acuerdo del 17-may-2017);
  `documentos_relacionados[3]`
  `eldiario-velasco-sustituido-castellon-2017-05-31` (N4, cobertura
  del regreso de García-Castellón). Cronología procesal-administrativa
  completa y trazable en el árbol del proyecto.

  **Aprendizaje operativo del 2026-05-27**: el buscador interno del
  CGPJ (`/Servicios/Acuerdos-del-CGPJ/Acuerdos-de-la-Comision-Permanente/`)
  sólo indexa de 2024 en adelante. Para acuerdos previos a 2024 hay
  que navegar al histórico estático
  (`/Servicios/Acuerdos-del-CGPJ/Historico-Acuerdos-de-la-Comision-Permanente/`)
  por URL directa con el formato
  `Acuerdos-de-la-Comision-Permanente-del-CGPJ-de-<DD>-de-<mes>-de-<YYYY>`
  o probar fechas próximas con HEAD/GET para descubrir qué sesiones
  existen. Las sesiones tienen URLs PDF estables en
  `/stfls/CGPJ/SECRETARÍA GENERAL/ACUERDOS DE LA COMISIÓN PERMANENTE/FICHERO/<YYYYMMDD> BoletinesAcuerdosCP.pdf`
  (con espacios en URL-encoding `%20`).

  **Corrección de fecha del hito 2026-05-27**: la toma de posesión
  efectiva de García-Castellón en el JCI nº 6 es el **lunes 26 de
  junio de 2017**, no julio como tenía previamente el hito (Confilegal
  del 21-jun-2017 dice «tomará posesión el próximo lunes»; el acuerdo
  CP CGPJ del 22-jun-2017 fija efectos del reingreso al 16-jun-2017
  con plazo de 20 días hábiles para tomar posesión, lo que sitúa la
  toma de posesión efectiva entre el 16-jun y mediados de julio).
  `fecha` corregida a `"2017-06-26"` con `fecha_precision: dia`; el
  `id` del fichero (`cambio-juez-velasco-castellon-lezo-2017-07-01`)
  se conserva por V-21 (slugs inmutables tras `estado_publicacion = publicado`
  del caso), patrón ya aplicado en Begoña Gómez al documento
  `auto-audiencia-desimputa-goyache-2025-05-16` cuando la fecha real
  resultó ser 13-may-2025 sin cambiar el slug.

## Lo que NO está bloqueante

Ninguno de los pendientes anteriores impide que el caso Lezo se
considere publicable en la primera oleada de lanzamiento del sitio:
los 7 PRs ya cubren la columna vertebral procesal (6 piezas
documentadas con Navalcarnero al 100% en sus seis procesados, 4
instructores en cadena, tribunal de enjuiciamiento con ponente, dos
acusaciones particulares, dos N1 BOE descargados, 12 N4 cruzados en
7 líneas editoriales, 8 hitos jurisdiccionales, 21 roles, primera
RelacionEntreCasos con caso conexo). Los refinamientos PR8+ son
acumulativos, no críticos.

## Incidencia multiagéntico documentada

Durante esta sesión (24-may-2026), los 12 archivos del PR2 de
Lezo fueron arrastrados dos veces consecutivas por commits de la
sesión paralela del caso Kitchen (commits `93cbb7a` y luego
`41f9642` tras el reset intermedio del primero). El contenido
editorial del PR2 (3 personas, 1 hito, 2 hechos, 3 roles, 3
documentos) está correctamente en main pero atribuido a commits
con mensajes Kitchen/ROADMAP/AGENTS.

La sesión paralela detectó la incidencia, hizo `git reset HEAD~1`,
documentó la lección en el commit `40de2b0` y consolidó dos
normas nuevas en [AGENTS.md → "Repositorio multiagéntico en paralelo"](../../../AGENTS.md#repositorio-multiagéntico-en-paralelo) (puntos 6 y 7) mediante el commit `41f9642`:

- **Norma 6**: no encadenar `git add` y `git commit` con `&&`,
  separar siempre en llamadas discretas para inspeccionar el
  staging entre uno y otro.
- **Norma 7**: minimizar commits intermedios cuando hay sesiones
  paralelas activas. Acumular cambios en el menor número
  posible de commits finales para reducir la ventana de
  contaminación cruzada.

PR3 y PR4 aplicaron ambas normas correctamente y no sufrieron
arrastre. Trazabilidad efectiva del contenido editorial de Lezo
PR2: visible vía `git log --oneline -- content/casos/lezo/` y
`git log --oneline -- content/personas/edmundo-rodriguez-sobrino.yaml`.
