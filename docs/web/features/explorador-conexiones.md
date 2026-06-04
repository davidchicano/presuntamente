# Explorador de conexiones y relaciones

> Archivos clave: [`src/lib/conexiones.ts`](../../../src/lib/conexiones.ts) · [`ConexionesExplorer.astro`](../../../src/components/ConexionesExplorer.astro) · [`GraphConexionesLink.astro`](../../../src/components/GraphConexionesLink.astro) · [`PgConexiones.astro`](../../../src/components/pages/PgConexiones.astro) · [`src/scripts/conexiones.ts`](../../../src/scripts/conexiones.ts) · [`docs/web/pages/conexiones.md`](../pages/conexiones.md) · Depende de [`vinculos-institucionales.md`](vinculos-institucionales.md)

## Qué hace

Página `/conexiones` con el **Explorador de Conexiones**: grafo visual y tabla textual de relaciones del inventario. Abre en modo **inventario completo**, sin foco, y permite fijar uno o varios focos (`caso`, `persona`, `organizacion` o `documento`), elegir profundidad 1-3 y filtrar tipos de nodo/arista. Las fichas de caso, persona y organización enlazan con el CTA unificado «Ver en grafo de conexiones».

## Para qué sirve

Ayuda a entender conexiones complejas sin convertir la ficha en una pantalla saturada. El objetivo no es sugerir culpabilidad por cercanía visual, sino exponer relaciones explícitas del modelo: rol procesal, vínculo institucional, conexión entre casos o respaldo documental.

## Cómo funciona

- `src/lib/conexiones.ts` deriva un `GraphPayload` desde las collections YAML.
- `ConexionesExplorer.astro` renderiza una superficie full-screen tipo red, controles flotantes redimensionables en desktop, panel de detalle flotante, leyenda y tabla textual equivalente activable.
- `src/scripts/conexiones.ts` monta Cytoscape en cliente, aplica BFS por profundidad, sincroniza query params y actualiza tabla/panel de detalle.
- El selector de vista conserva el patrón de `<select>` nativo mejorado; el foco usa `MultiSelectFilter` para seleccionar varios casos, personas, organizaciones o documentos. En listas largas incorpora búsqueda interna.
- `Profundidad` es un slider compacto 1-3; `Disposición` es un selector icónico de dos estados (`cose` orgánico y `breadthfirst` jerárquico); `Separación de nodos` usa el mismo patrón de slider + valor.
- Los tipos de relación tienen ayudas contextuales en popover para explicar qué significa `procesal`, `institucional`, `caso_caso` y `documental` sin obligar al lector a conocer el modelo interno.
- El panel de detalle distingue cierre puntual (`Cerrar`) de preferencia de exploración (`No mostrar detalle`): con la preferencia activa, los clicks siguen resaltando el grafo pero no abren el panel.
- Las descripciones largas (relaciones y sublabel de nodo) se muestran recortadas en vista previa (~220 caracteres) con puntos suspensivos al final del párrafo y `Ver más` en la línea siguiente; `Cerrar` comparte fila con el badge de tipo (estilo `graph-panel__collapse` del panel).
- La visualización deduplica aristas por pareja de nodos: si A y B tienen varias relaciones modeladas, se dibuja una sola línea agregada para no ensuciar la lectura. La tabla textual muestra esa misma agregación visible.
- El control `Separación de nodos`, dentro del bloque `Nodos`, recalcula el layout aumentando repulsión y longitud de arista, con refuerzo en nodos de mayor grado para despejar centros neurálgicos.
- En modo "Red viva", el arrastre de un nodo desplaza suavemente vecinos de primer y segundo grado para dar sensación de malla sin recalcular aleatoriamente todo el layout al soltar.
- URL compartible global: `/conexiones?focus=inventario&layout=cose`.
- URL compartible con foco: `/conexiones?focus=caso&id=begona-gomez&depth=2&layout=cose`.
- URL compartible con varios focos: `/conexiones?focus=caso&id=begona-gomez,plus-ultra&depth=2&layout=cose`.
- Los casos `pendiente`, `borrador` o retirados quedan fuera del dataset del grafo para que esqueletos editoriales no contaminen la vista pública.
- Nodos v1: caso, persona, organización, documento.
- Aristas v1: `procesal`, `institucional`, `caso_caso`, `documental`.
- Layouts v1: `cose` como modo "Red viva" por defecto y `breadthfirst` para lectura por profundidad.

La fuente de verdad es el modelo de datos, no un dibujo manual. Si una arista no puede derivarse o documentarse, no aparece.

## Estado actual

**Entregada en v1 inicial el 2026-05-26.** Página `/conexiones`, nav **Conexiones**, CTAs desde fichas, modo inventario completo, paneles flotantes y tabla textual. Copy unificado el 2026-05-26 (ver «Convención de copy»). El 2026-05-28 se añadió foco múltiple para todos los tipos de entidad publicable, panel redimensionable/adaptativo, controles compactos de profundidad/disposición/separación y mejor comportamiento móvil. Cytoscape.js en producción. El 2026-06-04, al crecer el inventario, se ejecutó el paso de escala documentado: **migración del layout orgánico de `cose` a `fcose`** (`cytoscape-fcose`, init espectral + pocas iteraciones, ~10× más rápido y en una sola pasada), con la animación de asentamiento desactivada (`animate: false`) y un **skeleton de carga** que cubre el canvas hasta el primer `layoutstop`. Se quitan así los trompicones, el «2 s congelado y luego se reorganiza» y el hueco en blanco inicial. El selector de la UI conserva el valor `cose` (modo «orgánico») por compatibilidad de URLs; el motor real es fcose. Detalle en [`src/scripts/conexiones.ts`](../../../src/scripts/conexiones.ts).

## Convención de copy

**Actualización 2026-05-27:** ruta pública (`/conexiones`) y campo del schema (`estado_ficha.conexiones`) alineados con el vocabulario visible. La asimetría inicial del 2026-05-26 (path `/grafo` y slug `grafo_relaciones` con copy «Conexiones») se revirtió al día siguiente por coherencia entre URL pública, identificador del modelo y nav. «Grafo» queda como descriptor de **formato** en H1 y eyebrow, no como identificador. La separación de superficies se mantiene porque cada una tiene función distinta — **entrada corta** (nav), **nombre de la herramienta** (H1) y **formato** (eyebrow):

| Superficie | Texto canónico | Implementación |
|---|---|---|
| Nav principal | Conexiones | `BaseLayout.astro` → `navEntries` |
| Breadcrumb `/conexiones` | Conexiones | `PgConexiones.astro` |
| `<title>` / OG | Explorador de Conexiones | `PgConexiones.astro` → `strings.title` |
| Eyebrow del panel | Grafo de conexiones y relaciones | `ConexionesExplorer.astro` |
| H1 del panel | Explorador de Conexiones | `ConexionesExplorer.astro` |
| CTA desde fichas | Ver en grafo de conexiones | `GraphConexionesLink.astro` |
| Chequeo estado ficha | Conexiones y relaciones | `PgCasoDetalle.astro` → `conexiones` |

Reglas:

- **Nav:** sustantivo corto, sin «grafo» (jerga técnica).
- **CTA:** «Ver **en** grafo…» — indica que abre la vista exploradora, no que el caso *es* un grafo.
- **H1 vs eyebrow:** el H1 nombra la herramienta; el eyebrow describe el formato (grafo + qué modela).
- **No mezclar** «relaciones» y «conexiones» en la misma frase salvo en el eyebrow, donde ambos conceptos conviven.

## Decisiones editoriales y aprendizajes

- **El grafo global sí entra, pero como explorador filtrado.** La idea inicial era empezar por un grafo local por caso. La versión entregada usa una página general porque permite enlaces profundos desde caso/persona/organización sin duplicar componentes.
- **Visual más tipo Obsidian, pero sin conspiracionismo.** La primera versión encajonada en bloque administrativo resultaba demasiado plana. La revisión usa superficie full-screen, nodos circulares, física animada y paneles flotantes, pero mantiene navy institucional, grises y mostaza estructural; sin líneas rojas ni paleta arcoíris.
- **La profundidad es semántica de navegación, no de responsabilidad.** Depth 2 significa "vecinos de vecinos", no mayor implicación.
- **La tabla textual no es opcional.** Mantiene equivalencia P-06 y sirve para auditar las relaciones visibles.
- **Inventario completo por defecto.** La página debe servir para ver el mapa general, no sólo vistas prefiltradas desde fichas.
- **Documentos ocultos por defecto.** Las aristas documentales existen, pero no se muestran en el preset inicial porque saturan rápido. El lector puede activarlas.
- **Los tipos de relación necesitan explicación in situ.** "Procesal", "institucional" o "documental" son categorías del modelo; el lector no tiene por qué conocerlas. La UI incorpora popovers breves junto a cada filtro.
- **Detalle no debe forzar el flujo de exploración.** El lector puede cerrar el detalle de la selección actual o activar "No mostrar detalle" para navegar por la red sólo con resaltados visuales.
- **Los hubs necesitan aire configurable.** En la vista inventario completo algunos casos u organizaciones acumulan muchas aristas; el slider de separación permite abrir la red sin convertirlo en un modo visual distinto.
- **El foco múltiple evita una falsa jerarquía de caso único.** La vista de caso, persona, organización y documento permite comparar varios focos a la vez; el detalle lateral se abre sólo cuando hay un foco único para no mezclar resúmenes incompatibles.
- **Los controles de ajuste no deben parecer filtros de catálogo.** Profundidad y separación son sliders compactos; disposición queda como selector icónico binario. Esto reduce peso visual frente a `Vista` y `Foco`, que sí son filtros principales.
- **Panel redimensionable, pero sin scroll horizontal.** El panel puede cambiar de tamaño en desktop; el contenido usa grid adaptativo y `overflow-x: hidden` para que el resize no genere una barra inferior ni controles cortados.
- **Fuera de foco, el panel debe dejar respirar el grafo.** En reposo baja opacidad y recupera presencia con hover/focus; en móvil se mantiene algo más visible por ergonomía táctil.
- **Cytoscape no es un motor de física live completo.** Su layout orgánico (`fcose`, antes `cose`) calcula posiciones de una vez, pero no mantiene una simulación continua tipo Obsidian. Para aproximarlo sin migrar librería se añade arrastre local de vecinos; si se exige física live real, conviene evaluar `d3-force` o una capa de simulación específica.
- **La animación de asentamiento del layout no aporta y a escala estorba (2026-06-04).** El `animate: true` del `cose` no era decorativo: era el algoritmo *force-directed* asentándose a la vista, repintando el canvas cada `refresh` iteraciones. Con pocos nodos se percibía como una transición agradable; al crecer el inventario se volvió lenta y a trompicones, porque cada repintado de un canvas grande es caro y se hacían ~120. Como las posiciones finales son estáticas, mostrar el proceso intermedio no añadía información.
- **Quitar la animación no basta a escala: el cuello real es el cálculo del layout (2026-06-04).** Sólo con `animate: false`, el `cose` base seguía tardando ~2 s en el inventario y, peor, mostraba una colocación intermedia, congelaba la interacción (`graphViewportLocked` no se liberaba hasta `layoutstop`) y al terminar **daba un salto** a la posición final. El problema no era el render por frame sino el coste *de cómputo* del `cose` base. Solución: migrar a **`fcose`**, que arranca con una colocación espectral (instantánea) y converge en pocas iteraciones — calcula en una sola pasada, ~10× más rápido, sin estado intermedio visible. Escalas a vigilar al migrar: fcose **no** usa la misma magnitud que cose para `edgeElasticity` (cose ~32-120 → fcose ~0.45) ni para `gravity`; `nodeRepulsion`/`idealEdgeLength` sí aceptan función por elemento, así que el refuerzo por grado de hub se conserva igual.
- **Separar núcleos, no nodos: clustering por tipo en el layout (2026-06-04).** El espaciado deseado no es global («todos los nodos más lejos») sino estructural: que cada **caso** forme su propia galaxia separada de las demás, con sus satélites (personas, organizaciones, documentos) pegados. Se consigue con fuerzas *conscientes del tipo*, aprovechando que fcose acepta `nodeRepulsion`/`idealEdgeLength`/`edgeElasticity` como función por elemento: (a) los nodos `caso` reciben un factor de repulsión alto (`casoRepulsionFactor`) y el resto repulsión suave → los núcleos se empujan entre sí pero los satélites no se disgregan; (b) las aristas `caso_caso` se hacen largas (núcleos relacionados a distancia) y las demás cortas (satélite pegado a su caso); (c) muelle rígido (`edgeElasticity` alta) en las aristas caso→satélite para sujetar el halo pese a la repulsión del núcleo, y blando en `caso_caso`. El slider de «separación» sigue escalando todo el conjunto por encima de esa estructura.
- **El hueco en blanco de arranque se cubre con skeleton, no acelerando más (2026-06-04).** Aunque fcose es rápido, entre que la página carga, el script parsea el `GraphPayload` y se pinta la primera colocación hay un instante sin nada. Un skeleton (malla de nodos con pulso suave + label) cubre el canvas hasta el primer `layoutstop`; de paso enmascara cualquier flash de nodos en el origen antes de aplicar posiciones. Se retira una sola vez (`data-graph-ready` en el root) y no se remuestra en los relayout por filtro, que son rápidos. Respeta `prefers-reduced-motion` (pulso estático) y usa tokens para dark mode.

## Ideas futuras

### v1.x

- Filtro por rol procesal concreto.
- Filtro por nivel mínimo de fuente en aristas documentales.
- Colorear aristas procesales según el rol formal en el caso (`investigado`, `procesado`, `acusado`, `condenado_no_firme`, `condenado_firme`, `absuelto`, `desimputado`), reutilizando la paleta F-estado y manteniendo presunción de inocencia: el color comunica estado procesal documentado, no culpabilidad.
- Filtro por gravedad procesal / fase del rol: cautelar, procesamiento, acusación, condena no firme, condena firme, cierre favorable.
- Leyenda específica para aristas procesales cuando se active el coloreado por rol, separada de la leyenda de tipos de nodo.
- Modo de atenuación por rol: mostrar todas las conexiones pero bajar opacidad de las que no coinciden con el rol/fase seleccionada.
- Agregación de aristas con roles mixtos entre los mismos nodos: decidir si prima el rol más reciente, el más grave, o si se muestra un indicador compuesto en el panel de detalle.
- Modo "camino entre dos nodos".
- Export SVG/PNG para prensa.
- Deep links desde documentos de biblioteca hacia `/conexiones?focus=documento`.
- Modo visual alternativo con simulación live (`d3-force`, WebGL/Sigma o capa Three.js si aporta valor) sobre el mismo `GraphPayload`, sin sustituir la vista Cytoscape v1.

### Sin compromiso

- Sustituir Cytoscape por Sigma.js + Graphology si el inventario crece a miles de nodos y WebGL compensa la complejidad adicional.

### Escala del inventario completo (paso intermedio, antes del salto a WebGL)

El modo **Inventario completo** corre el layout *force-directed* sobre **todos** los nodos (en [`src/scripts/conexiones.ts`](../../../src/scripts/conexiones.ts)). El render ya es canvas y el modo foco hace subgrafo limitado por profundidad (eso escala bien). Estado de los pasos dirigidos, **antes** de plantear el salto a Sigma.js/WebGL de arriba:

- [x] **Desactivar la animación de asentamiento** (`animate: false`, 2026-06-04). Quita los trompicones y los repintados intermedios; necesario pero insuficiente por sí solo (ver aprendizaje).
- [x] **`cose` → `fcose`** (`cytoscape-fcose`, 2026-06-04). Ataca el coste de *cálculo*, que `animate: false` no tocaba: init espectral + pocas iteraciones, una sola pasada, ~10× más rápido. Resuelve el «2 s congelado y luego se reorganiza».
- [x] **Skeleton de carga** sobre el canvas hasta el primer `layoutstop` (2026-06-04). Cubre el hueco en blanco de arranque.
- [ ] Si a ~50+ casos / varios cientos de nodos el cálculo de fcose aún se nota (sobre todo en móvil): **precalcular posiciones en build** y usar layout `preset` para la vista por defecto (coste de layout en cliente = cero), cayendo a fcose live sólo cuando cambian filtros/separación/foco.

**Pendiente de afinado visual** (2026-06-04): el layout fcose es ahora *consciente del tipo* (ver aprendizaje «Separar núcleos, no nodos»). Las palancas a ajustar viven en `layoutFor` de [`src/scripts/conexiones.ts`](../../../src/scripts/conexiones.ts): `baseRepulsion` (repulsión de satélites), `casoRepulsionFactor` (cuánto se separan los núcleos; subido a 8 el 2026-06-04 porque con 4 el cúmulo central de casos PP/PSOE —muy acoplados por satélites compartidos y aristas `caso_caso`— quedaba apelmazado), los multiplicadores de `idealEdgeLength` (`×3.5` caso_caso / `×0.72` resto) y de `edgeElasticity` (`0.2` caso_caso / `0.55` resto), más `gravity` (0.16 en inventario, menos pull central = más expansión). Revisar que los casos formen galaxias legibles sin que el inventario quede ni demasiado disperso ni apelmazado.

## Pendientes operativos

- [x] Decidir librería o SVG propio generado en build. **Cytoscape.js**.
- [x] Definir formato interno de nodos/aristas.
- [x] Añadir página global `/conexiones`.
- [x] Añadir modo inventario completo sin foco.
- [x] Pasar la UI a superficie full-screen con paneles flotantes.
- [x] Añadir enlaces desde fichas de caso, persona y organización.
- [x] Mantener alternativa textual.
- [x] Añadir foco múltiple con URL compartible por ids CSV.
- [x] Convertir profundidad/disposición/separación en controles compactos especializados.
- [x] Hacer el panel de controles redimensionable en desktop y adaptado a móvil.
- [x] Verificar vista móvil del panel (bottom sheet opaco, minimizado por defecto, HUD arriba) — 2026-05-28.
- [x] Unificar microcopy nav / página / CTAs (2026-05-26).
- [x] Migrar el layout orgánico de `cose` a `fcose` y añadir skeleton de carga (2026-06-04).
- [ ] Afinar las constantes de espaciado de fcose si el inventario queda demasiado disperso o apelmazado.
