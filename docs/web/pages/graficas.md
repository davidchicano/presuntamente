# Página /graficas

> Componente: [`src/components/pages/PgGraficas.astro`](../../../src/components/pages/PgGraficas.astro) · Wrapper: [`src/pages/graficas/index.astro`](../../../src/pages/graficas/index.astro) · Sistema de charts: [`visualizaciones-graficas.md`](../features/visualizaciones-graficas.md).

Lectura **visual** del inventario, buque insignia de gráficas. Hermana de [`/cifras`](cifras.md) (expediente tabular denso): `/graficas` engancha de un vistazo, `/cifras` da el detalle. Enlazadas en ambos sentidos (meta de cabecera) y desde el sello de la home.

## Estado actual

Ocho secciones numeradas (`FichaTocSection`, con `PageToc` automático):

1. **Encuadre honesto** — barra de madurez del inventario (publicable / borrador / esqueleto). El antídoto: deja claro que es un inventario curado y en construcción, no un censo.
2. **Cifras económicas** — importe presuntamente atribuido (va el segundo a propósito: es lo que más se pregunta). **Cabecera sticky con dos conmutadores que gobiernan toda la sección a la vez** —vista (Procedimientos abiertos / Solo condenas firmes) y modo (€ nominales / € de 2025)—, en lugar de las antiguas tabs por gráfica. Por cada clase (objeto / consecuencia, nunca sumadas), una **caja-total** y las lecturas del mismo dinero sumable, sin doble conteo: ranking **por caso** (drill-down a ficha), composición **según el grado de prueba** (se oculta en la vista "solo condenas firmes") y **según el nivel de fuente** (N1–N4) en `StackedBar`, y treemap **por naturaleza**. Representatividad "X de Y" y datos descargables CSV/JSON. Reparto por sujeto en las fichas de persona/organización (enlazadas desde la nota al pie). Canon: [`importe-presunto.md`](../features/importe-presunto.md); no se repite aquí.
3. **Recorrido procesal** — casos por fase (orden inicio→firme) + personas por situación procesal **actual** (una persona = un estado, el más avanzado vigente; explícitamente **no es un embudo de cohorte**).
4. **Trazabilidad** — composición de fuentes N1–N4 + hechos por estado epistémico.
5. **Mapa de delitos** — treemap con **tabs**: por familia y por delito concreto (nº de atribuciones en roles).
6. **Tiempo** — **tabs** de columnas por año (hitos · casos abiertos · imputaciones) + duración de cada procedimiento (Gantt; barras rayadas = en curso).
7. **Por partido político** — *en preparación* (ver decisión abajo).
8. **Notas metodológicas** — qué cuenta y qué no cada gráfica + chapita homenaje.

**Drill-down**: pulsar una barra, segmento o celda (fase, situación procesal, estado epistémico, familia, delito, madurez) abre un panel —bottom sheet en móvil— con la lista enlazada de las entidades detrás de ese número y un enlace al listado completo. Sólo enlaza a entidades con ficha pública.

Detalle técnico del render/animación/tabs/drill-down/accesibilidad: en la ficha de feature, no se repite aquí.

## Decisiones editoriales

- **Solo casos en beta pública o superior** (decisión del maintainer, 2026-05-28). Salvo el Bloque 0 (que muestra el total y hace de disclaimer), todas las gráficas cuentan únicamente los casos con `estado_publicacion` ∈ {`beta_publica`, `en_revision`, `publicado`} — mismo umbral de visibilidad que el resto del sitio. Los esqueletos y borradores quedan fuera: un caso a medio fichar tiene pocos hechos/roles y falsearía las distribuciones. El Bloque 0 lo explicita (bloque verde = computable) y una aclaración al inicio lo deja claro. El teaser de la home (`PgInicio`) aplica el mismo filtro, por coherencia.
- **Honestidad antes que pegada.** Bloque 0 va primero a propósito. Cada gráfica indica qué cuenta y qué no; ninguna afirma culpabilidad. Estados procesales = fases de un procedimiento, no condenas (presunción de inocencia, [AGENTS.md](../../../AGENTS.md) — principios irrenunciables).
- **Nada de embudo investigado→condena.** Con el inventario joven (mayoría en instrucción, 1 condena firme) un embudo sugeriría una tasa de absolución falsa. Se muestra como **foto del estado actual**, no como cohorte que fluye.
- **Bloque de partidos diferido** (decisión del maintainer, 2026-05-28). No se publica ranking por partido en v1: no hay campo de afiliación machine-readable y la cobertura por familia política no es representativa. Se publicará con metodología visible, descargos de lo que no mide y datos brutos cuando la cobertura sea suficiente. Coherente con lo ya escrito en [`cifras.md`](cifras.md) ("un ranking sesgado por cobertura es peor que no tener ranking") y con el Bloque A del ROADMAP.
- **Homenaje discreto** (decisión del maintainer, 2026-05-28). Guiño a la divulgación de datos públicos en gráficos claros (estilo Jon González, que **cerró su cuenta de X** —no falleció— en mayo de 2026). Copy actual: chapita mono al pie "En honor a Jon G. por su contribución a la divulgación de datos públicos" + línea en la aclaración de cierre. Se nombra sólo con la inicial del apellido y sin arrobas ni alusión a la polémica. Razón: el sitio se sostiene en la neutralidad política y la figura quedó polarizada; se recoge el oficio. Copy afinable por el maintainer.

## Ideas futuras

- Activar el **bloque de partidos** cuando la cobertura sea representativa (con CSV/JSON descargable + disclaimers).
- ~~**Importe presuntamente atribuido** (treemap/ranking por caso · persona · organización)~~ **Entregado 2026-05-29** (sección 2). La vista por caso, el reparto por sujeto (vía `importe_atribucion`, mostrado en fichas de persona/organización) y el toggle nominal/constante están en producción. Sigue pendiente sólo el **titular agregado de la home** (gated a copy firmado). Canon: [`importe-presunto.md`](../features/importe-presunto.md).
- Sankey de transiciones procesales cuando haya cohortes con recorrido completo.
- Filtro por caso (`?caso=`) cuando el inventario crezca.
- OG image propia con 2-3 gráficas del encuadre.

## Pendientes operativos

- [ ] Copy final del homenaje y de los textos de cada bloque (revisión del maintainer).
- [ ] OG image específica de `/graficas`.
- [ ] Revisar densidad del Gantt de duración cuando el inventario pase de ~40 casos (hoy muestra todos).
